import sharp from 'sharp';
import {readFile,writeFile,readdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {root} from './common.mjs';
const pairs=[
 ['agent-hero','en-1440-agent-ops-console-agent-cover','Agent canvas · EN1440'],
 ['agent-checkpoint','en-1440-agent-ops-console-checkpoint','Agent checkpoint · EN1440'],
 ['learn-word-boundary','ru-768-learn-shared-rule','Learn natural words · RU768'],
 ['vet-word-boundary','ru-1024-vet-heading-viewport','Vet natural words · RU1024'],
 ['next-contrast','en-1440-next-contrast','Next-case contrast · EN1440'],
 ['portal-caption','en-1440-portal-caption-contrast','Portal caption contrast + length · EN1440'],
];
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
async function board(id,before,after,label){
 const width=1440,height=850,header=65;const buffers=await Promise.all([before,after].map(p=>sharp(p).resize(720,height-header,{fit:'contain',background:'#f3f3f3'}).toBuffer()));
 const title=Buffer.from(`<svg width="1440" height="65"><rect width="1440" height="65" fill="#fff"/><text x="16" y="24" font-family="Arial" font-size="18">${escape(label)}</text><text x="16" y="51" font-family="Arial" font-size="14">BEFORE</text><text x="736" y="51" font-family="Arial" font-size="14">AFTER</text></svg>`);
 await sharp({create:{width,height,channels:3,background:'#f3f3f3'}}).composite([{input:title,left:0,top:0},{input:buffers[0],left:0,top:header},{input:buffers[1],left:720,top:header}]).webp({quality:90}).toFile(`${root}/comparisons/${id}.webp`);
}
for(const [id,name,label]of pairs)await board(id,`${root}/before/${name}.webp`,`${root}/after/${name}.webp`,label);
for(const id of ['home','agent','learn']){
 for(const phase of ['before','after'])execFileSync('D:/Programs/ffmpeg/bin/ffmpeg.exe',['-hide_banner','-loglevel','error','-y','-ss','6.7','-i',`${root}/motion-${phase}/late-${id}/browser.webm`,'-frames:v','1',`${root}/comparisons/late-${id}-${phase}.png`]);
 await board('late-'+id,`${root}/comparisons/late-${id}-before.png`,`${root}/comparisons/late-${id}-after.png`,`${id}: real delayed-bundle video at6.7s ·1440×900 ·normal motion`);
}
const files={};for(const phase of ['before','after'])files[phase]=await readdir(root+'/'+phase);
const pages=['home','about','agent-ops-console','partner-portal','learn','vet-clinic','pawly'];
const html=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Portfolio quality · independent review</title><style>body{font:16px/1.5 system-ui,sans-serif;max-width:1500px;margin:auto;padding:28px;color:#202020}a{color:#963122}h1{font-size:32px}select{font:inherit;padding:8px;margin:4px}main{display:grid;grid-template-columns:1fr 1fr;gap:20px}figure{margin:0;min-width:0}img{width:100%;height:auto;background:#f3f3f3}main img{max-height:76vh;object-fit:contain;object-position:top}section{margin-top:48px}video{max-width:100%;max-height:70vh}aside{padding:16px;background:#f5f5f2}nav{display:flex;gap:20px;flex-wrap:wrap}@media(max-width:700px){main{grid-template-columns:1fr}}</style>
<h1>Portfolio Final Quality V1</h1><p><strong>READY FOR INDEPENDENT REVIEW</strong> ·3 November2026</p><aside>Integrated baseline9492558 → implementation c4192c4. No main merge or production deployment. This package is evidence, not acceptance.</aside><nav><a href="REPORT.md">Report</a><a href="BASELINE.md">Source SHAs</a><a href="FINDINGS.md">Findings</a><a href="CONSISTENCY-MATRIX.md">Surface matrix</a><a href="RESEARCH.md">Live research</a><a href="MOTION-INVENTORY.md">Motion inventory</a></nav>
<section><h2>Matched page captures</h2><p>Reduced motion, same locale/viewport/scroll state. Click an image for its original. Long pages are shown complete, scaled for navigation.</p><label>Locale <select id="locale"><option>en</option><option>ru</option></select></label><label>Width <select id="width"><option>1440</option><option>390</option></select></label><label>Page <select id="page">${pages.map(p=>`<option>${p}</option>`).join('')}</select></label><label>Capture <select id="capture"><option>viewport</option><option>full</option></select></label><main><figure><figcaption>BEFORE</figcaption><a id="before-link"><img id="before" alt="Before"></a></figure><figure><figcaption>AFTER</figcaption><a id="after-link"><img id="after" alt="After"></a></figure></main></section>
<section><h2>Specific corrections</h2>${pairs.map(([id,,label])=>`<h3>${label}</h3><a href="comparisons/${id}.webp"><img loading="lazy" src="comparisons/${id}.webp" alt="${label}: matched before and after"></a>`).join('')}</section>
<section><h2>Late-bundle motion</h2><p>Same1440×900 viewport, normal motion,3200ms delay on each built JS request.6.7s frames come directly from the videos; sample logs establish the regression window.</p>${['home','agent','learn'].map(id=>`<h3>${id}</h3><img loading="lazy" src="comparisons/late-${id}.webp" alt="Late ${id} browser frames"><main>${['before','after'].map(phase=>`<figure><figcaption>${phase}</figcaption><video controls preload="none" src="motion-${phase}/late-${id}/browser.webm"></video></figure>`).join('')}</main>`).join('')}</section>
<section><h2>Normal interaction recordings</h2>${['home','agent-ops-console','learn'].map(id=>`<h3>${id}</h3><main>${['before','after'].map(phase=>`<video controls preload="none" src="motion-${phase}/${id}/browser.webm"></video>`).join('')}</main>`).join('')}</section>
<section><h2>Live references</h2><p>Read RESEARCH.md for exact observed behavior and limits. Blinkov's case is password protected; no hidden case interaction is claimed.</p>${[['blinkov','Anton Blinkov'],['malugin-smartcat','Malugin →Smartcat'],['repponen-project','Repponen →M+'],['ha','HA horizontal scene'],['dounar','Dounar MyTeam']].map(([id,title])=>`<h3>${title}</h3><video controls preload="none" src="references/${id}/browser.webm"></video>`).join('')}</section>
<script>const files=${JSON.stringify(files)};function update(){const n=locale.value+'-'+width.value+'-'+page.value+'-'+capture.value;for(const phase of ['before','after']){const f=files[phase].find(f=>f===n+'.webp'||f===n+'.png');document.getElementById(phase).src=phase+'/'+f;document.getElementById(phase+'-link').href=phase+'/'+f;}}for(const e of document.querySelectorAll('select'))e.addEventListener('change',update);update();</script></html>`;
await writeFile(root+'/index.html',html);console.log('Gallery and9comparison boards generated');
