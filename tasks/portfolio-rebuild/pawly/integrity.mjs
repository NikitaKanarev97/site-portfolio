import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const base='58002c398c3386c9df4b398f324ab07115c979f7';
const hash=b=>createHash('sha256').update(b).digest('hex');
const source=JSON.parse(await readFile('tasks/portfolio-rebuild/pawly/sources.json','utf8'));
const failures=[];
for(const f of source.files)if(hash(await readFile(`${source.source}/${f.file}`))!==f.sha256)failures.push({source:f.file});
const captures=JSON.parse(await readFile('tasks/portfolio-rebuild/pawly/captures.json','utf8'));
const media=captures.records.filter(r=>r.file);
for(const r of media){
  const bytes=await readFile(r.file);
  if(hash(bytes)!==r.sha256)failures.push({capture:r.file});
  if(r.reused&&hash(await readFile(r.source))!==r.sha256)failures.push({reused:r.file});
  if(bytes.length>2*1024*1024)failures.push({budget:r.file,bytes:bytes.length});
}
const changed=execFileSync('git',['diff','--name-only',base],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
const allowed=['src/copy/cases/pawly.ts','src/copy/ru/cases/pawly.ts','ds/screens/case-pawly.md'];
const prefixes=['public/media/rebuild/pawly/','src/pages/preview/pawly-rebuild/','tasks/portfolio-rebuild/pawly/'];
for(const f of changed)if(!allowed.includes(f)&&!prefixes.some(p=>f.startsWith(p)))failures.push({scope:f});
const untracked=execFileSync('git',['ls-files','--others','--exclude-standard'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
for(const f of untracked)if(!prefixes.some(p=>f.startsWith(p)))failures.push({untracked:f});
const mirrors=[];
for(const [a,b] of [['ds/tokens.css','src/styles/tokens.css'],['ds/motion.js','src/scripts/motion.js']]){
  const ha=hash(await readFile(a)),hb=hash(await readFile(b));
  mirrors.push({a,b,sha256:ha,equal:ha===hb});if(ha!==hb)failures.push({mirror:a});
}
const sourceHead=execFileSync('git',['-C',source.source,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
if(sourceHead!==source.head)failures.push({sourceHead});
const productStatus=execFileSync('git',['-C',source.source,'status','--porcelain'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
const result={base,branch:execFileSync('git',['branch','--show-current'],{encoding:'utf8'}).trim(),sourceHead,sourceFilesVerified:source.files.length,mediaVerified:media.length,reusedVerified:media.filter(r=>r.reused).length,mirrors,changed,untracked,productStatus,failures};
await writeFile('tasks/portfolio-rebuild/pawly/integrity.json',JSON.stringify(result,null,2));
console.log(JSON.stringify({sourceFilesVerified:source.files.length,mediaVerified:media.length,changedTracked:changed.length,untracked:untracked.length,mirrors,failures},null,2));
if(failures.length)process.exitCode=1;
