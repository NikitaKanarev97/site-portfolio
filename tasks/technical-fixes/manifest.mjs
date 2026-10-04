import {readFile,writeFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const sha=b=>createHash('sha256').update(b).digest('hex');
const records=JSON.parse(await readFile('tasks/technical-fixes/captures.json','utf8'));
for(const name of ['learn/media-manifest.json','pawly/captures.json']){
 const file='tasks/portfolio-rebuild/'+name;
 const data=JSON.parse(await readFile(file,'utf8'));
 let rows=Array.isArray(data)?data:data.records;
 for(const r of records.filter(r=>r.file.startsWith(`public/media/rebuild/${name.split('/')[0]}/`))){
  const old=rows.find(x=>x.file===r.file);
  const item={...old,...r,bytes:(await stat(r.file)).size,sha256:sha(await readFile(r.file))};
  rows=rows.filter(x=>x.file!==r.file);rows.push(item);
 }
 await writeFile(file,JSON.stringify(Array.isArray(data)?rows:{...data,records:rows},null,2));
}
