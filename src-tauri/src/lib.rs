use serde::Serialize;
use serde_json::{json, Value};
use std::{collections::BTreeSet, fs, path::{Component, Path, PathBuf}, time::{SystemTime, UNIX_EPOCH}};
use tauri::{Emitter, Manager};
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_opener::OpenerExt;
use tauri_plugin_updater::UpdaterExt;

fn err(e: impl std::fmt::Display) -> String { e.to_string() }
fn timestamp() -> String { SystemTime::now().duration_since(UNIX_EPOCH).unwrap_or_default().as_millis().to_string() }
fn library_root(app: &tauri::AppHandle) -> Result<PathBuf, String> { Ok(app.path().app_local_data_dir().map_err(err)?.join("libraries")) }
fn current_folder(root: &Path) -> Result<Option<PathBuf>, String> {
    if !root.join("current.json").exists() { return Ok(None); }
    let id: String = serde_json::from_slice(&fs::read(root.join("current.json")).map_err(err)?).map_err(err)?;
    if id.is_empty() || !id.bytes().all(|b| b.is_ascii_digit()) { return Err("The saved library pointer is invalid.".into()); }
    Ok(Some(root.join(id)))
}
fn asset_path(raw: &str) -> Result<PathBuf, String> {
    let clean = raw.split('#').next().unwrap_or("");
    if raw.contains('\\') || raw.contains('%') || raw.contains('?') { return Err("Library assets must use plain relative paths.".into()); }
    let p = Path::new(clean);
    if !clean.starts_with("assets/") || p.components().any(|c| !matches!(c, Component::Normal(_))) { return Err("Library assets must stay inside the assets folder.".into()); }
    let ext = p.extension().and_then(|s| s.to_str()).unwrap_or("").to_ascii_lowercase();
    if !["png","jpg","jpeg","webp","pdf"].contains(&ext.as_str()) { return Err("Only question images and PDF answer keys can be imported.".into()); }
    Ok(p.to_path_buf())
}
fn inspect_library(value: &Value) -> Result<BTreeSet<PathBuf>, String> {
    if value["version"] != 1 { return Err("Unsupported library version.".into()); }
    let qs = value["questions"].as_array().ok_or("The library needs a questions array.")?;
    if qs.is_empty() || qs.len() > 30000 { return Err("Choose a prepared library containing 1–30,000 questions.".into()); }
    let mut assets=BTreeSet::new(); let mut ids=BTreeSet::new();
    for q in qs {
        let id=q["id"].as_str().ok_or("A question is missing its ID.")?;
        if id.len()!=8 || !id.bytes().all(|c|c.is_ascii_hexdigit()) || !ids.insert(id.to_string()) {return Err("Question IDs must be unique eight-character PDF bank IDs.".into());}
        if !["Math","Reading and Writing"].contains(&q["section"].as_str().unwrap_or("")) || !["Easy","Medium","Hard"].contains(&q["difficulty"].as_str().unwrap_or("")) {return Err("A question has an invalid section or difficulty.".into());}
        for key in ["skill","file","answer"] { if q[key].as_str().filter(|s|!s.is_empty()&&s.len()<1000).is_none() {return Err(format!("A question is missing its {key}."));} }
        if q["page"].as_u64().filter(|p|*p>0&&*p<100000).is_none() || q["number"].as_str().filter(|s|!s.is_empty()).is_none() {return Err("Every question needs its original file, page, question number, and ID.".into());}
        let image=q["image"].as_str().ok_or("A question image is missing.")?;
        let image_path=asset_path(image)?;
        if image_path.extension().and_then(|s|s.to_str())==Some("pdf") {return Err("Question images must be PNG, JPG, or WebP.".into());}
        assets.insert(image_path);
        if let Some(key)=q["key"]["url"].as_str() {assets.insert(asset_path(key)?);}
    }
    Ok(assets)
}
#[derive(Serialize)]
#[serde(rename_all="camelCase")]
struct Library { data: Value, root: String }
fn read_library(root:&Path) -> Result<Option<Library>,String> {
    let Some(folder)=current_folder(root)? else {return Ok(None)};
    let data:Value=serde_json::from_slice(&fs::read(folder.join("data.json")).map_err(err)?).map_err(err)?;
    inspect_library(&data)?;
    Ok(Some(Library{data,root:folder.to_string_lossy().to_string()}))
}
#[tauri::command]
fn desktop_info(app:tauri::AppHandle)->Value {json!({"version":app.package_info().version.to_string(),"platform":std::env::consts::OS,"arch":std::env::consts::ARCH})}
#[tauri::command]
fn load_library(app:tauri::AppHandle)->Result<Option<Library>,String>{read_library(&library_root(&app)?)}
#[tauri::command]
async fn import_library(app:tauri::AppHandle)->Result<Option<Library>,String>{
    let dialog=app.clone();
    let choice=tauri::async_runtime::spawn_blocking(move||dialog.dialog().file().set_title("Choose the prepared library folder containing data.json and assets").blocking_pick_folder()).await.map_err(err)?;
    let Some(choice)=choice else{return Ok(None)};
    let source=choice.into_path().map_err(err)?.canonicalize().map_err(err)?;
    let data_file=source.join("data.json").canonicalize().map_err(err)?;
    if !data_file.starts_with(&source){return Err("The library manifest must be inside the selected folder.".into());}
    if fs::metadata(&data_file).map_err(err)?.len()>40_000_000{return Err("The library manifest is too large.".into());}
    let mut data:Value=serde_json::from_slice(&fs::read(&data_file).map_err(err)?).map_err(err)?;
    let assets=inspect_library(&data)?;
    // Profiles and prior tutoring histories are imported separately through the existing progress flow.
    data["attemptedIds"]=json!(data["history"].as_array().map(|rows|rows.iter().filter_map(|r|r["questionId"].as_str()).filter(|id|id.len()==8&&id.bytes().all(|c|c.is_ascii_hexdigit())).map(String::from).collect::<Vec<_>>()).unwrap_or_default());
    data["history"]=json!([]);data["diagnostics"]=json!([]);
    data["goal"]=json!({"math":null,"readingWriting":null,"total":null,"baseline":null,"testDate":null});
    data["questionCount"]=json!(data["questions"].as_array().unwrap().len());
    let root=library_root(&app)?;fs::create_dir_all(&root).map_err(err)?;
    let id=timestamp();let staging=root.join(format!("staging-{id}"));fs::create_dir(&staging).map_err(err)?;
    let copied=(||->Result<(),String>{
        let mut total=0u64;
        for relative in assets {
            let from=source.join(&relative).canonicalize().map_err(err)?;
            if !from.starts_with(&source){return Err("An asset points outside the selected library.".into());}
            let meta=fs::metadata(&from).map_err(err)?;
            if !meta.is_file() || meta.len()>100_000_000{return Err("A library asset is invalid or larger than 100 MB.".into());}
            total+=meta.len();if total>2_000_000_000{return Err("The prepared library exceeds 2 GB.".into());}
            let dest=staging.join(&relative);fs::create_dir_all(dest.parent().unwrap()).map_err(err)?;fs::copy(from,dest).map_err(err)?;
        }
        fs::write(staging.join("data.json"),serde_json::to_vec(&data).map_err(err)?).map_err(err)?;
        Ok(())
    })();
    if let Err(error)=copied{let _=fs::remove_dir_all(&staging);return Err(error);}
    fs::rename(&staging,root.join(&id)).map_err(err)?;
    // Keep the last good library if copying/validation fails. A pointer update never deletes old editions.
    let pointer=root.join("current.next.json");fs::write(&pointer,serde_json::to_vec(&id).map_err(err)?).map_err(err)?;
    let current=root.join("current.json");if current.exists(){fs::copy(&current,root.join("previous.json")).map_err(err)?;fs::remove_file(&current).map_err(err)?;}
    fs::rename(pointer,current).map_err(err)?;read_library(&root)
}
fn permitted_external(url:&str)->bool{
    let Ok(parsed)=url::Url::parse(url)else{return false};
    parsed.scheme()=="https" && parsed.username().is_empty() && parsed.password().is_none() && parsed.host_str().is_some_and(|h|["collegeboard.org","khanacademy.org","desmos.com","youtube.com","youtu.be","github.com"].iter().any(|base|h==*base||h.ends_with(&format!(".{base}"))))
}
#[tauri::command]
fn open_external(app:tauri::AppHandle,url:String)->Result<(),String>{
    if !permitted_external(&url){return Err("This external link is not an approved study resource.".into());}
    app.opener().open_url(url,None::<&str>).map_err(err)
}
#[tauri::command]
fn open_library_asset(app:tauri::AppHandle,relative:String)->Result<(),String>{
    let path=asset_path(&relative)?;let folder=current_folder(&library_root(&app)?)?.ok_or("Load a library first.")?.canonicalize().map_err(err)?;
    let file=folder.join(path).canonicalize().map_err(err)?;if !file.starts_with(&folder){return Err("Invalid library asset.".into());}
    app.opener().open_path(file.to_string_lossy().to_string(),None::<&str>).map_err(err)
}
#[tauri::command]
async fn save_backup(app:tauri::AppHandle,contents:String)->Result<bool,String>{
    if contents.len()>30_000_000 || serde_json::from_str::<Value>(&contents).map_err(err)?.as_object().is_none(){return Err("Invalid progress export.".into());}
    let dialog=app.clone();let choice=tauri::async_runtime::spawn_blocking(move||dialog.dialog().file().set_file_name("apple-sat-progress.json").add_filter("Progress backup",&["json"]).blocking_save_file()).await.map_err(err)?;
    if let Some(choice)=choice{fs::write(choice.into_path().map_err(err)?,contents).map_err(err)?;return Ok(true)}Ok(false)
}
#[tauri::command]
async fn check_for_update(app:tauri::AppHandle)->Result<Value,String>{
    let update=app.updater().map_err(err)?.check().await.map_err(err)?;
    Ok(update.map(|u|json!({"version":u.version,"notes":u.body})).unwrap_or(Value::Null))
}
#[tauri::command]
async fn install_update(app:tauri::AppHandle,version:String)->Result<(),String>{
    let update=app.updater().map_err(err)?.check().await.map_err(err)?.ok_or("No update is available.")?;
    if update.version!=version{return Err("The release changed. Check for updates again.".into());}
    update.download_and_install(|_,_|{let _=app.emit("apple-sat-update-progress",());},||{}).await.map_err(err)?;
    app.restart()
}
pub fn run(){
    tauri::Builder::default().plugin(tauri_plugin_dialog::init()).plugin(tauri_plugin_opener::init()).plugin(tauri_plugin_updater::Builder::new().build())
      .invoke_handler(tauri::generate_handler![desktop_info,load_library,import_library,open_external,open_library_asset,save_backup,check_for_update,install_update])
      .run(tauri::generate_context!()).expect("Apple SAT could not start");
}
#[cfg(test)]mod tests{
 use super::*;
 #[test]fn assets_are_local_and_data_only(){for p in ["../secret.pdf","assets/../secret.pdf","/assets/a.pdf","assets/x.js","assets/%2e%2e/x.pdf","https://bad.test/x.pdf","assets\\x.pdf"]{assert!(asset_path(p).is_err(),"{p}");}assert!(asset_path("assets/questions/abc.png").is_ok());assert!(asset_path("assets/keys/work.pdf#page=1").is_ok());}
 #[test]fn links_do_not_open_local_or_untrusted_programs(){assert!(permitted_external("https://satsuite.collegeboard.org/practice"));for u in ["file:///etc/passwd","javascript:alert(1)","https://collegeboard.org.bad.test/","https://bad.test/","https://me@github.com/"]{assert!(!permitted_external(u));}}
 #[test]fn malformed_library_never_replaces_saved_work(){assert!(inspect_library(&json!({"version":1,"questions":[]})).is_err());assert!(inspect_library(&json!({"version":1,"questions":[{"id":"12345678","section":"Math","difficulty":"Medium","skill":"Test","answer":"3","file":"test.pdf","page":1,"number":"1.1","image":"https://bad.test/a.png"}]})).is_err());}
}
