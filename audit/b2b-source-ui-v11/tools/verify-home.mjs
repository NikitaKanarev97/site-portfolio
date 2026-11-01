import { readFile,writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const root='audit/b2b-source-ui-v11';const base='d004daf2e63e16ec493bbfadab60b7005e3b17a8';
const before=JSON.parse(await readFile(`${root}/logs/before-home.json`,'utf8')).entries;
const after=JSON.parse(await readFile(`${root}/logs/after-home.json`,'utf8')).entries;
for(const a of after){const b=before.find(b=>b.locale===a.locale&&b.width===a.width);assert.deepEqual(a.protectedHashes,b.protectedHashes);assert.equal(a.metrics.overflow,0);assert.equal(a.metrics.complete,true);assert.equal(a.metrics.portraitWidth,b.metrics.portraitWidth);assert.deepEqual(a.errors,[]);assert.deepEqual(a.failures,[]);}
const baselineMedia=JSON.parse(execFileSync('git',['show',`${base}:src/data/partner-portal-v2-media.json`],{encoding:'utf8'}));
const currentMedia=JSON.parse(await readFile('src/data/partner-portal-v2-media.json','utf8'));
const changedEntries=[];for(const key of Object.keys(baselineMedia))if(JSON.stringify(baselineMedia[key])!==JSON.stringify(currentMedia[key]))changedEntries.push(key);
assert.deepEqual(changedEntries.sort(),['en/home-decision-1280','en/home-decision-390','ru/home-decision-1280','ru/home-decision-390'].sort());
const paths=execFileSync('git',['ls-tree','-r','--format=%(objectname) %(path)',base,'src','public/media'],{encoding:'utf8'}).trim().split('\n');
const allowed=p=>p==='src/data/partner-portal-v2-media.json'||/^public\/media\/home-cover-polish\/portal-(?:en|ru)-(?:1280|390)\.webp$/.test(p);
let unchanged=0;const changed=[];
for(const line of paths){const path=line.slice(41);if(allowed(path)){changed.push(path);continue;}let data=await readFile(path);if(/\.(?:astro|tsx?|js|css|json|svg|md)$/.test(path))data=Buffer.from(data.toString().replaceAll('\r\n','\n'));const blob=createHash('sha1').update(Buffer.from(`blob ${data.length}\0`)).update(data).digest('hex');assert.equal(blob,line.slice(0,40),`Out-of-scope source/media changed: ${path}`);unchanged++;}
const result={base,profiles:after.length,protectedHeroAgentPawlyVetDOMIdentical:true,unchangedSourceAndMediaFiles:unchanged,allowedChangedFiles:changed,changedMediaEntries:changedEntries,errors:[],failedResources:[]};
await writeFile(`${root}/logs/verification.json`,JSON.stringify(result,null,2)+'\n');
console.log(`PASS: ${after.length} Home profiles, frozen hero/Agent/Pawly/Vet DOM; ${unchanged} source/media files unchanged; only 4 Portal images and their 4 registry entries updated.`);
