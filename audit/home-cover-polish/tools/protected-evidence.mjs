import { execFileSync } from 'node:child_process';
import { readFile,writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const base=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const tree=execFileSync('git',['ls-tree','-r','--format=%(objectname) %(path)',base,'src','public/media'],{encoding:'utf8'}).trim().split('\n');
const entries=[];
for(const line of tree){
  const path=line.slice(41);
  if(!/pawly|vet|(?:FeaturedCase|WorkStage|CaseScreen)\.astro$|case-art\.ts$|copy\/(?:ru\/)?home\.ts$/i.test(path))continue;
  let data=await readFile(path);
  if(/\.(?:astro|ts|js|css|json|svg)$/.test(path))data=Buffer.from(data.toString('utf8').replaceAll('\r\n','\n'));
  const currentBlob=createHash('sha1').update(Buffer.from(`blob ${data.length}\0`)).update(data).digest('hex');
  const baselineBlob=line.slice(0,40);
  assert.equal(currentBlob,baselineBlob,`Protected file changed: ${path}`);
  entries.push({path,baselineBlob,currentBlob,unchanged:true});
}
const before=JSON.parse(await readFile('audit/home-cover-polish/logs/before.json','utf8')).results;
const after=JSON.parse(await readFile('audit/home-cover-polish/logs/after.json','utf8')).results;
const profiles=after.map(a=>{
  const b=before.find(b=>b.locale===a.locale&&b.width===a.width);
  assert.deepEqual(a.protected,b.protected);
  return {locale:a.locale,width:a.width,before:b.protected,after:a.protected,unchanged:true};
});
await writeFile('audit/home-cover-polish/logs/protected-evidence.json',JSON.stringify({base,protectedFileCount:entries.length,entries,profiles},null,2)+'\n');
console.log(`PASS: ${entries.length} protected Pawly/Vet/shared-renderer files equal baseline Git blobs; 10 BEFORE/AFTER card DOM profiles match.`);
