const native=()=>window.__TAURI__?.core;
export const isDesktop=()=>!!native();
const invoke=(command,args={})=>native().invoke(command,args);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let update=null,checking=false,installing=false,context=null,version='';
export async function loadDesktopLibrary(){
 if(!isDesktop())return null;
 const library=await invoke('load_library');if(!library)return null;
 for(const q of library.data.questions){q.image=native().convertFileSrc(library.root+'/'+q.image);if(q.key?.url)q.key.url='apple-sat-library:'+encodeURIComponent(q.key.url);}
 return library.data;
}
export async function saveDesktopBackup(payload){return invoke('save_backup',{contents:JSON.stringify(payload,null,2)});}
function safeToRestart(){return !['#practice','#tests','#rush'].includes(location.hash)&&!document.querySelector('dialog[open]')&&!document.querySelector('form');}
async function applyUpdate(){if(!update||installing||!safeToRestart())return;installing=true;context.save();context.toast('Installing the verified update. Apple SAT will restart; your work is saved.');try{await invoke('install_update',{version:update.version});}catch(e){installing=false;context.toast('The update could not install. Your current app and progress are unchanged.');}}
async function check(manual=false){
 if(checking||!isDesktop())return;checking=true;
 try{update=await invoke('check_for_update');if(update){context.toast('Apple SAT '+update.version+' is ready. It will update when you leave your exercise.');if(safeToRestart())await applyUpdate();}else if(manual)context.toast('You have the latest published version.');}
 catch(e){if(manual)context.toast('Updates could not be checked. You can keep studying offline.');}
 finally{checking=false;}
}
export function desktopSettings(){return isDesktop()?`<section class="settings-section"><h2>Desktop app</h2><p>Apple SAT ${esc(version)}. Updates are checked automatically on launch and every six hours. Verified releases install when you’re outside an exercise and the app restarts. Your library and progress stay on this computer.</p><div class="summary-actions"><button class="secondary" data-action="desktop-update">Check for updates</button><button class="secondary" data-action="desktop-library">Import prepared question library</button></div><p class="field-note">Prepare your own PDFs with the repository importer, then choose its output folder containing data.json and assets. Official questions are not bundled.</p></section>`:'';}
export function startDesktop(options){
 if(!isDesktop())return;context=options;
 invoke('desktop_info').then(info=>{version=info.version;}).catch(()=>{});
 document.addEventListener('click',async event=>{
  const action=event.target.closest('[data-action]')?.dataset.action;
  if(action==='desktop-update'){await check(true);return;}
  if(action==='desktop-library'){try{const imported=await invoke('import_library');if(imported){context.save();location.reload();}}catch(e){context.toast(String(e));}return;}
  const anchor=event.target.closest('a[href]');if(!anchor)return;
  const href=anchor.getAttribute('href');
  if(href.startsWith('apple-sat-library:')){event.preventDefault();try{await invoke('open_library_asset',{relative:decodeURIComponent(href.slice('apple-sat-library:'.length))});}catch(e){context.toast(String(e));}return;}
  if(/^https?:/.test(href)){event.preventDefault();try{await invoke('open_external',{url:anchor.href});}catch(e){context.toast(String(e));}}
 },true);
 window.addEventListener('hashchange',()=>{if(update&&safeToRestart())applyUpdate();});
 setTimeout(()=>check(),15000);setInterval(()=>check(),6*60*60*1000);
}
