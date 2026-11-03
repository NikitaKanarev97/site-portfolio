import {readFile,writeFile,readdir,stat,rename,unlink} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=fileURLToPath(new URL('./',import.meta.url));
const batches=[];
for(const phase of ['before','after'])for(const engine of phase==='before'?['chromium']:['chromium','webkit']){
 const d=JSON.parse(await readFile(`${root}/${phase}/${engine}/results.json`,'utf8'));batches.push(d);
 for(const id of new Set(d.transitions.map(t=>t.id))){
  const dir=path.join(root,phase,engine,id,'video');
  const files=(await readdir(dir).catch(e=>{if(e.code==='ENOENT')return [];throw e;})).filter(f=>f.endsWith('.webm'));
  if(files.length){const videos=await Promise.all(files.map(async f=>({f,time:(await stat(path.join(dir,f))).mtimeMs})));videos.sort((a,b)=>b.time-a.time);
   await rename(path.join(dir,videos[0].f),path.join(dir,'../browser.webm'));
   // Only stale recordings created by this harness, inside this evidence root.
   for(const v of videos.slice(1)){const target=path.resolve(dir,v.f);if(path.relative(root,target).startsWith('..'))throw Error('Outside evidence root');await unlink(target);}
  }
 }
}
let html=`<!doctype html><html lang="en"><meta charset="utf-8"><title>Portfolio V1.1 — browser evidence</title><style>
body{font:16px system-ui;margin:32px;background:#fafafa;color:#222;max-width:1600px}a{color:#9b2012}section{margin:48px 0}figure{margin:0}img{display:block;width:100%;height:auto;border:1px solid #aaa} .pair{display:grid;grid-template-columns:1fr 1fr;gap:16px}.frames{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}small{display:block}video{width:100%;max-height:650px}summary{cursor:pointer}code{font-size:13px}table{border-collapse:collapse}td,th{border:1px solid #aaa;padding:8px;text-align:left}@media(max-width:700px){body{margin:12px}.pair{grid-template-columns:1fr}}
</style><h1>Portfolio V1.1 — independent review evidence</h1><p><a href="REPORT.md">Report</a> · <a href="TRANSITION-MATRIX.md">Matrix</a> · <a href="logs/frame-colors.json">Raster assertions</a></p><p>Real production-browser captures, normal motion. No forced completion or animation overrides. Labels are requested offsets from native ViewTransition.ready; each frame gives its actual screenshot acquisition window. Continuous videos preserve intervening frames. WebKit screenshot capture is slower; use timing windows and recordings, not filename alone.</p><h2>Matched baseline → correction, ~300 ms</h2>`;
const before=batches[0];
for(const t of before.transitions){const after=batches.find(d=>d.phase==='after'&&d.engine==='chromium').transitions.find(a=>a.id===t.id&&a.source===t.source&&a.key===t.key);const bf=t.frames.find(f=>f.target===300),af=after.frames.find(f=>f.target===300);html+=`<section><h3>${t.id} · ${t.source} → ${t.key}</h3><div class="pair"><figure><a href="${bf.file}"><img loading="lazy" src="${bf.file}"></a><figcaption>BEFORE · ${Math.round(bf.begin)}–${Math.round(bf.end)} ms</figcaption></figure><figure><a href="${af.file}"><img loading="lazy" src="${af.file}"></a><figcaption>AFTER · ${Math.round(af.begin)}–${Math.round(af.end)} ms</figcaption></figure></div></section>`;}
html+='<h2>Complete EN/RU × 1440/390/360 × Chromium/WebKit</h2>';
for(const d of batches.filter(d=>d.phase==='after'))for(const id of new Set(d.transitions.map(t=>t.id))){
 html+=`<section><h3>${d.engine} · ${id}</h3><p><a href="after/${d.engine}/${id}/browser.webm">Continuous normal-motion recording</a> · <a href="after/${d.engine}/results.json">Computed colors and timing samples</a></p><details><summary>Play recording</summary><video controls preload="none" src="after/${d.engine}/${id}/browser.webm"></video></details>`;
 for(const t of d.transitions.filter(t=>t.id===id)){html+=`<h4>${t.source} → ${t.key}${t.keyboard?' · keyboard entry':''}</h4><p>Native completion ${Math.round(t.finish)} ms. Source ${t.sourceSurface}; destination hero ${t.surface}.</p><div class="frames">`;
  for(const f of t.frames)html+=`<figure><a href="${f.file}"><img loading="lazy" src="${f.file}"></a><figcaption>${f.target} ms requested<small>${Math.round(f.begin)}–${Math.round(f.end)} ms acquisition</small></figcaption></figure>`;
  html+='</div>';
 }html+='</section>';
}
html+='</html>';await writeFile(`${root}/index.html`,html);
let matrix='# Transition matrix · V1.1\n\nReal production build at localhost:4415. Normal motion; expected group/old/new Agent #F7F7F5 and Portal #EDF2F8. Accepted Learn navy, Vet sage and Pawly sand navigation treatments remain unchanged; Learn hero is neutral and Pawly hero white.\n\n| Engine | Locale / width | Paths captured | Assertions | Recording |\n|---|---|---|---|---|\n';
for(const d of batches.filter(d=>d.phase==='after'))for(const id of new Set(d.transitions.map(t=>t.id))){const checks=d.checks.filter(c=>c.name.startsWith(id+' '));matrix+=`| ${d.engine} | ${id} | Home→Agent, Home→Portal; Pawly→Agent→Portal→Learn→Vet→Pawly | ${checks.length-checks.filter(c=>!c.pass).length}/${checks.length} | [video](after/${d.engine}/${id}/browser.webm) |\n`;}
matrix+='\nEvery path includes source and 0/100/300/600/1000 ms requested captures. Actual acquisition windows, per-rAF computed pseudo-element colors, native duration and page opacity are in each engine’s results.json. [Browse all frames and matched before/after pairs](index.html).\n\nThe screenshot windows are real and unaltered. WebKit can lag substantially. This is an evidence timing limitation, not hidden by renaming frames. Continuous normal-motion recordings and per-rAF computed values supplement those captures.\n\n| Engine | Requested offset | Actual acquisition starts (ms) | Actual acquisition ends (ms) |\n|---|---|---|---|\n';
for(const d of batches.filter(d=>d.phase==='after'))for(const target of [0,100,300,600,1000]){const frames=d.transitions.flatMap(t=>t.frames.filter(f=>f.target===target));matrix+=`| ${d.engine} | ${target} | ${Math.round(Math.min(...frames.map(f=>f.begin)))}–${Math.round(Math.max(...frames.map(f=>f.begin)))} | ${Math.round(Math.min(...frames.map(f=>f.end)))}–${Math.round(Math.max(...frames.map(f=>f.end)))} |\n`;}
await writeFile(`${root}/TRANSITION-MATRIX.md`,matrix);
const manifest=[];
async function scan(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);if(entry.isDirectory())await scan(full);else if(/\.(webp|webm)$/.test(entry.name)){const bytes=await readFile(full);manifest.push({file:path.relative(root,full).replaceAll('\\','/'),bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});}}}
await scan(root);await writeFile(`${root}/evidence-manifest.json`,JSON.stringify(manifest,null,2));console.log('Evidence files',manifest.length,'bytes',manifest.reduce((s,f)=>s+f.bytes,0));
