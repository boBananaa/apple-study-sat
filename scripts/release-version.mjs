import fs from 'node:fs';
const run=Number(process.env.GITHUB_RUN_NUMBER);
if(!Number.isSafeInteger(run)||run<1||run>65000)throw Error('A valid GitHub run number is required.');
const version=`0.2.${run}`;
for(const file of ['package.json','src-tauri/tauri.conf.json']){const value=JSON.parse(fs.readFileSync(file));value.version=version;fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n');}
const file='src-tauri/Cargo.toml';fs.writeFileSync(file,fs.readFileSync(file,'utf8').replace(/^version = "[^"]+"/m,`version = "${version}"`));
for(const name of fs.readdirSync('dist'))if(/\.(js|html)$/.test(name)){const file='dist/'+name;fs.writeFileSync(file,fs.readFileSync(file,'utf8').replace(/(\.(?:js|css|svg)\?v=)[\d.]+/g,(_,prefix)=>prefix+version));}
if(process.env.GITHUB_OUTPUT)fs.appendFileSync(process.env.GITHUB_OUTPUT,`version=${version}\ntag=app-v${version}\n`);
console.log(`Apple SAT ${version}`);

