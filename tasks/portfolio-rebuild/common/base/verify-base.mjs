/** Read-only content verification for the Common A thematic overlay. */
import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';import {resolve,dirname,join} from 'node:path';import {fileURLToPath} from 'node:url';
const manifest=JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)),'manifest.json')));const root=resolve(process.argv.find(v=>v.startsWith('--root='))?.slice(7)||'.');const failures=[];
for(const file of manifest.files){try{const bytes=readFileSync(join(root,file.path));if(bytes.length!==file.bytes||createHash('sha256').update(bytes).digest('hex')!==file.sha256)failures.push(file.path);}catch{failures.push(file.path);}}
console.log(JSON.stringify({root,baseHead:manifest.baseHead,files:manifest.files.length,failures},null,2));if(failures.length)process.exitCode=1;
