import {execFileSync} from 'node:child_process';
import {readFile,writeFile,access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const root='audit/vet-home-cover-v1';
const base='04ae0753342bfcd9289f5628d9ed814b2911a6df';
const accepted='317e3b7fdb5e54322646f1a1ef2cc63d70f619c1';
const run=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
assert.equal(run('diff','--name-only',base,accepted,'--','src','public','ds','package.json','package-lock.json'),'');
const files=['src/components/VetStage.astro','src/components/vet/VetHome.astro','src/copy/vet-home.ts','dist/index.html','dist/ru/index.html','ds/tokens.css','src/styles/tokens.css','ds/motion.js','src/scripts/motion.js'];
const hashes=Object.fromEntries(await Promise.all(files.map(async path=>[path,createHash('sha256').update(await readFile(path)).digest('hex')])));
assert.equal(hashes['ds/tokens.css'],hashes['src/styles/tokens.css']);assert.equal(hashes['ds/motion.js'],hashes['src/scripts/motion.js']);
const report=await readFile(`${root}/REPORT.md`,'utf8');const links=[];
for(const m of report.matchAll(/\]\(([^)]+)\)/g)) {
 if(/^(https?:|#)/.test(m[1]))continue;
 const path=resolve(root,m[1].split('#')[0]);await access(path);links.push(m[1]);
}
await writeFile(`${root}/logs/provenance.json`,JSON.stringify({date:'2026-11-02 Europe/Moscow',worktree:process.cwd(),branch:run('branch','--show-current'),runtimeBase:base,independentAcceptance:accepted,acceptedRuntimeIdentical:true,productAcceptedMerge:'3835c4ffe224a1077d131d2882878d3d373d56e5',ownedSourceHashes:hashes,reportLocalLinksVerified:links.length,originalCheckoutStatus:run('-C','D:/Claude-projects/Site-portfolio','status','--short'),changedTrackedFiles:run('diff','--name-only',base).split('\n'),deliveryState:'Local isolated branch with reviewable working-tree changes; no push, merge or deploy.'},null,2)+'\n');
console.log(`PASS: accepted runtime identity, DS mirrors, ${links.length} report links and final source/build hashes recorded.`);
