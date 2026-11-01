import sharp from 'sharp';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const root='audit/vet-home-cover-v1';
await mkdir(`${root}/comparisons`,{recursive:true});
await mkdir(`${root}/context`,{recursive:true});
for(const [sha,path,name] of [
 ['317e3b7fdb5e54322646f1a1ef2cc63d70f619c1','audit/b2b-source-ui-v11/INDEPENDENT-ACCEPTANCE.md','b2b-parity-acceptance.md'],
 ['5572d96114125e287f34d407db5a934492e353cf','audit/portfolio-home-v3/stage-01/v3.1/INDEPENDENT-ACCEPTANCE.md','home-v31-acceptance.md'],
])await writeFile(`${root}/context/${name}`,execFileSync('git',['show',`${sha}:${path}`]));
async function sheet(name,title,paths,width=620) {
 const sources=await Promise.all(paths.map(path=>sharp(path).resize({width}).png().toBuffer()));
 const info=await Promise.all(sources.map(b=>sharp(b).metadata()));
 const label=Buffer.from(`<svg width="${paths.length*(width+20)}" height="55"><rect width="100%" height="100%" fill="white"/><text x="15" y="35" font-family="Arial" font-size="20">${title}</text></svg>`);
 await sharp({create:{width:paths.length*(width+20),height:Math.max(...info.map(m=>m.height))+75,channels:3,background:'white'}}).composite([{input:label,left:0,top:0},...sources.map((input,i)=>({input,left:i*(width+20)+10,top:65}))]).jpeg({quality:92}).toFile(`${root}/comparisons/${name}.jpg`);
}
for(const locale of ['en','ru'])for(const width of [1440,390,360])await sheet(`${locale}-${width}-vet`,`${locale.toUpperCase()} ${width} · BEFORE (left) / AFTER (right)`,['before','after'].map(phase=>`${root}/screenshots/${phase}/${locale}-${width}-vet.png`),width===1440?640:390);
await sheet('source-parity','Accepted source / exact excerpt / real Home capture (scaled for this sheet)',[
 `${root}/sources/visit-en-1440.png`,`${root}/candidates/B-1440.png`,`${root}/screenshots/after/en-1440-vet.png`,
],520);
await sheet('peer-covers','Accepted Agent / B2B / Learn / new Vet · same 1440 viewport',['agent','portal','learn','vet'].map(part=>`${root}/screenshots/after/en-1440-${part}.png`),480);
await sheet('saved-benchmarks','Archived Garri / Dounar / HA · visual principles, not style equivalence',[
 'research/portfolio-premium-v3-2026-11-01/references/thumbs/gr-swap1.jpg',
 'research/portfolio-premium-v3-2026-11-01/references/thumbs/dn-head.jpg',
 'research/portfolio-premium-v3-2026-11-01/references/thumbs/ha-cover.jpg',
],480);
const profiles=['en','ru'].flatMap(locale=>[1440,390,360,1024,768].map(width=>({locale,width})));
await writeFile(`${root}/index.html`,`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Vet Home Cover V1 · evidence</title><style>body{font:16px/1.5 system-ui;margin:32px;background:#f4f4f1;color:#202020}main{max-width:1500px;margin:auto}h1{font-size:40px}section{margin:48px 0}.pair{display:grid;grid-template-columns:1fr 1fr;gap:20px}figure{margin:0}img{max-width:100%;height:auto;background:white}a{color:#ad2b1b}details{margin:18px 0}summary{cursor:pointer}@media(max-width:700px){body{margin:16px}.pair{grid-template-columns:1fr}}</style><main><h1>Vet Clinic Home Cover V1</h1><p>2 November 2026 · implementation for independent review. No acceptance, merge or production deploy.</p><p><a href="REPORT.md">Report and source decisions</a> · <a href="sources/manifest.json">Exact source/crop provenance</a> · <a href="logs/verification.json">QA evidence</a></p><section><h2>Final Home cover</h2><div class="pair"><img src="screenshots/after/en-1440-vet.png" alt="English desktop cover"><img src="screenshots/after/en-390-vet.png" alt="English mobile cover"></div></section><section><h2>Three grounded candidates</h2><a href="comparison-board.jpg"><img loading="lazy" src="comparison-board.jpg" alt="Three candidate directions at actual Home widths"></a></section><section><h2>Source parity</h2><a href="comparisons/source-parity.jpg"><img loading="lazy" src="comparisons/source-parity.jpg" alt="Accepted screen, exact excerpt, actual Home"></a></section><section><h2>Home peers and archived references</h2><a href="comparisons/peer-covers.jpg"><img loading="lazy" src="comparisons/peer-covers.jpg" alt="Four Home covers at matched desktop scale"></a><img loading="lazy" src="comparisons/saved-benchmarks.jpg" alt="Archived Garri, Dounar and HA screenshots"></section><section><h2>Matched BEFORE / AFTER</h2>${profiles.map(({locale,width})=>`<details><summary>${locale.toUpperCase()} ${width} · first, full and Vet cover</summary>${['first','vet','full'].map(part=>`<h3>${part}</h3><div class="pair">${['before','after'].map(phase=>`<figure><figcaption>${phase.toUpperCase()}</figcaption><a href="screenshots/${phase}/${locale}-${width}-${part}.png"><img loading="lazy" src="screenshots/${phase}/${locale}-${width}-${part}.png" alt="${phase} ${locale} ${width} ${part}"></a></figure>`).join('')}</div>`).join('')}</details>`).join('')}</section></main></html>`);
console.log('Created matched comparison sheets, parity/peer/reference boards and evidence gallery.');
