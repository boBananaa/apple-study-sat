import fs from 'node:fs';
import path from 'node:path';
for(const name of ['roadmap','lessons','desmos']){const from=path.join('docs','screenshots',name+'.png');if(!fs.existsSync(from))throw Error('Missing reviewed screenshot: '+from);fs.mkdirSync('site/screenshots',{recursive:true});fs.copyFileSync(from,path.join('site','screenshots',name+'.png'));}
console.log('Desktop download page prepared.');
