/** Explicit thematic allowlist, without staging/committing the dirty checkout. */
import {readFileSync,writeFileSync,readdirSync,existsSync,mkdirSync,mkdtempSync} from 'node:fs';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';import {resolve,join} from 'node:path';
const out='tasks/portfolio-rebuild/common/base';mkdirSync(out,{recursive:true});const files=new Set();
const add=file=>{if(!existsSync(file))throw new Error(`Missing themed file: ${file}`);files.add(file.replaceAll('\\','/'));};
const walk=dir=>{for(const e of readdirSync(dir,{withFileTypes:true})){const file=dir+'/'+e.name;if(e.isDirectory())walk(file);else add(file);}};
[
'CLAUDE.md','PLAN-CHATS.md','package.json','package-lock.json','tsconfig.json',
'ds/CONTRACT.md','ds/story-contract.md','ds/foundation.md','ds/components.md','ds/patterns.md','ds/motion-concept.md','ds/tokens.css','ds/motion.js','ds/screens/case.md',
'src/copy/cases/story.ts','src/copy/kit-case.ts','src/components/Diagram.astro','src/components/DiagramCanvas.astro','src/components/MetaList.astro',
'src/data/diagrams/schema.ts','src/data/diagrams/README.md','src/lib/diagram.ts','src/scripts/animations.js','src/scripts/motion.js',
'src/styles/global.css','src/styles/tokens.css','src/styles/specimen-fonts.css','src/layouts/BaseLayout.astro','src/layouts/PageShell.astro',
'src/pages/kit.astro','src/pages/robots.txt.ts','src/pages/preview/agent-ops-pilot.astro','src/pages/preview/partner-portal-pilot.astro',
'scripts/harmony-check.mjs','scripts/check-scoped-css.cjs','scripts/build-pilot-media.mjs','scripts/shoot-pilot-cover-panels.mjs','scripts/shoot-pilot-panel-insets.mjs','scripts/verify-case-controls.mjs','scripts/verify-case-resize.mjs','scripts/verify-motion-lifecycle.mjs',
'public/media/case-dssl/cover/resolution-center.webp','public/media/case-dssl/polish-after-resolution.webp',
'research/portfolio-benchmark/README.md','research/portfolio-benchmark/harmony-checklist.md','research/portfolio-benchmark/ha-deep-dive.md','research/portfolio-benchmark/pilot-agent-ops-report.md','research/portfolio-benchmark/case-blueprint/case-blueprint.html',
'outputs/agent-ops-checkpoint-review.md','outputs/agent-ops-checkpoint-scene-sheet.jpg','outputs/agent-ops-checkpoint-focus.mp4','outputs/agent-ops-next-link-controls.json','outputs/agent-ops-next-link-only.png',
`${out}/README.md`,`${out}/verify-base.mjs`,
].forEach(add);
for(const e of readdirSync('src/components'))if(/^Case.*\.astro$/.test(e))add('src/components/'+e);
['src/copy/common','src/copy/pilot','src/data/diagrams/common','src/data/diagrams/kit','src/pages/preview/common','public/media/pilot-agent-ops','public/media/rebuild/common','research/portfolio-rebuild-2026-10-03','tasks/portfolio-rebuild/common/shots'].forEach(walk);
const common='tasks/portfolio-rebuild/common';
['report.md','artifact-plan.md','evidence.md','media.md','common-requests.md','captures.json','mirrors.json','source-verification.json','static-verification.json','motion-verification.json','support-verification.json','navigation-verification.json','production-probe.json',
'build-final.log','check-final.log','css-final.log','harmony-final.log','harmony-short.log','static-final.log','motion.log','support.log','navigation.log','production.log','record.log',
'capture-specimens.mjs','capture-review.mjs','crop-review.mjs','verify-static.mjs','verify-motion.mjs','verify-support.mjs','verify-navigation.mjs','verify-sources.mjs','measure-production.mjs','record-central.mjs','make-snapshot.mjs','summarize-production.mjs','refresh-specimen.mjs','specimen-verification.json','specimen-final.log','harmony-specimen-final.log'].forEach(file=>add(common+'/'+file));
['recording.json','native-wheel.webm','central-scene.mp4','movie-sheet.jpg',...Array.from({length:4},(_,i)=>`focus-${i}.png`)].forEach(file=>add(common+'/recording/'+file));
const purpose=path=>path.startsWith('tasks/')?'verification-and-handoff':path.startsWith('research/portfolio-rebuild')?'current-plan-and-pinned-references':path.startsWith('public/media/rebuild/common')||path.includes('/common/')?'contract-example':path.startsWith('outputs/')||path.includes('pilot')||path.startsWith('research/portfolio-benchmark')?'accepted-pilot-support':path.startsWith('ds/')||path.startsWith('src/components/')||path.startsWith('src/layouts/')||path.includes('schema.ts')||path.startsWith('src/scripts/')||path.startsWith('src/styles/')?'frozen-common':'required-base-support';
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');const baseHead=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8',windowsHide:true}).trim();const payload=[...files].sort();
if(baseHead!=='62304d8e555193a26926b673a56ba13f631ecd7e')throw new Error('Base HEAD changed; audit before snapshot');
const manifest={version:'common-a-review-2026-10-04',baseHead,status:'prepared-for-visual-acceptance; no commit',files:payload.map(path=>{const b=readFileSync(path);return {path,purpose:purpose(path),bytes:b.length,sha256:sha(b)};})};
writeFileSync(out+'/manifest.json',JSON.stringify(manifest,null,2));const entries=[...payload,out+'/manifest.json',out+'/files.txt'].sort();writeFileSync(out+'/files.txt',entries.join('\n')+'\n');
execFileSync('tar',['--format=zip','-cf',out+'/common-theme.zip','-T',out+'/files.txt'],{windowsHide:true});
const list=execFileSync('tar',['-tf',out+'/common-theme.zip'],{encoding:'utf8',windowsHide:true}).trim().split(/\r?\n/).map(s=>s.replaceAll('\\','/')).sort();if(JSON.stringify(list)!==JSON.stringify(entries))throw new Error('ZIP entry list mismatch');
writeFileSync(out+'/archive-sha256.txt',sha(readFileSync(out+'/common-theme.zip'))+'  common-theme.zip\n');
mkdirSync('tmp',{recursive:true});const roundtrip=mkdtempSync(resolve('tmp/common-a-base-'));
execFileSync('tar',['-xf',resolve(out+'/common-theme.zip'),'-C',roundtrip],{windowsHide:true});const proof=JSON.parse(execFileSync('node',[resolve(out+'/verify-base.mjs'),'--root='+roundtrip],{encoding:'utf8',windowsHide:true}));writeFileSync(out+'/roundtrip-verification.json',JSON.stringify(proof,null,2));
console.log(JSON.stringify({payloadFiles:payload.length,archiveEntries:entries.length,payloadBytes:manifest.files.reduce((n,f)=>n+f.bytes,0),archiveBytes:readFileSync(out+'/common-theme.zip').length,roundtripFailures:proof.failures},null,2));
