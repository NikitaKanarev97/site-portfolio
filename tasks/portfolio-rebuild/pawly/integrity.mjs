import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const base='58002c398c3386c9df4b398f324ab07115c979f7';
const hash=b=>createHash('sha256').update(b).digest('hex');
const source=JSON.parse(await readFile('tasks/portfolio-rebuild/pawly/sources.json','utf8'));
const failures=[];
const originalSources=JSON.parse(execFileSync('git',['show','d3bbbbd78fb3a75c87d3f6117f91d1606e462932:tasks/portfolio-rebuild/pawly/sources.json'],{encoding:'utf8'}));
if(source.head!==originalSources.head||source.files.length!==originalSources.files.length||source.files.some(f=>originalSources.files.find(o=>o.file===f.file)?.sha256!==f.sha256))failures.push({sourceInventory:'September fingerprints must remain identical to submitted d3bbbb'});
const common=JSON.parse(await readFile('tasks/portfolio-rebuild/pawly/common-import.json','utf8'));
const acceptedDelta='433c80bcba29eda2060067570e9f8ec2087a2a91';
const acceptedImport='129b96f5bebcb9f11c93a42b2f78617b3b217d9c';
const sharedNames=['ds/components.md','ds/motion-concept.md','ds/story-contract.md','src/components/CaseScreen.astro','src/components/MediaFrame.astro','src/copy/cases/story.ts'];
if(common.sourceDelta!==acceptedDelta||common.importedRef!==acceptedImport||common.files.map(f=>f.file).sort().join('|')!==sharedNames.join('|'))failures.push({commonMetadata:'Only the exact accepted six-file delta is authorized'});
const commonFiles=[];
for(const name of sharedNames){
  const f=common.files.find(f=>f.file===name);if(!f){failures.push({commonMissing:name});continue;}
  const expected=execFileSync('git',['show',`${acceptedDelta}:${f.file}`],{maxBuffer:1024*1024});
  const current=Buffer.from((await readFile(f.file,'utf8')).replace(/\r\n/g,'\n'));
  const verified=hash(expected)===f.sha256&&hash(current)===f.sha256;
  commonFiles.push({...f,verified});if(!verified)failures.push({common:f.file});
}
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
for(const f of changed)if(!allowed.includes(f)&&!prefixes.some(p=>f.startsWith(p))&&!sharedNames.includes(f))failures.push({scope:f});
const caseDelta=execFileSync('git',['diff','--name-only',acceptedImport],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
for(const f of caseDelta)if(!allowed.includes(f)&&!prefixes.some(p=>f.startsWith(p)))failures.push({caseScope:f});
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
const result={base,commonDelta:common.sourceDelta,commonImportedRef:common.importedRef,commonFiles,caseDelta,branch:execFileSync('git',['branch','--show-current'],{encoding:'utf8'}).trim(),sourceHead,sourceFilesVerified:source.files.length,mediaVerified:media.length,reusedVerified:media.filter(r=>r.reused).length,mirrors,changed,untracked,productStatus,failures};
await writeFile('tasks/portfolio-rebuild/pawly/integrity.json',JSON.stringify(result,null,2));
console.log(JSON.stringify({commonFilesVerified:commonFiles.filter(f=>f.verified).length,sourceFilesVerified:source.files.length,mediaVerified:media.length,changedTracked:changed.length,untracked:untracked.length,mirrors,failures},null,2));
if(failures.length)process.exitCode=1;
