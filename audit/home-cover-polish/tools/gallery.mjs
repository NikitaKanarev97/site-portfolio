import sharp from 'sharp';
import { mkdir,writeFile,readFile } from 'node:fs/promises';
const root='audit/home-cover-polish';
await mkdir(`${root}/comparisons`,{recursive:true});
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
async function sheet(left,right,out,labels=['BEFORE · Premium V3.1','AFTER · cover polish'],width=800){
  const gap=24,top=44;const images=[];
  for(const file of [left,right]) images.push(await sharp(file).resize({width}).png().toBuffer());
  const info=await Promise.all(images.map(b=>sharp(b).metadata()));
  const height=Math.max(...info.map(i=>i.height))+top;
  const title=Buffer.from(`<svg width="${width*2+gap}" height="${top}"><rect width="100%" height="100%" fill="white"/><g font-family="Arial" font-size="18" fill="#242424"><text x="0" y="28">${escape(labels[0])}</text><text x="${width+gap}" y="28">${escape(labels[1])}</text></g></svg>`);
  await sharp({create:{width:width*2+gap,height,channels:3,background:'white'}}).composite([{input:title,left:0,top:0},...images.map((input,i)=>({input,left:i*(width+gap),top}))]).jpeg({quality:92}).toFile(`${root}/comparisons/${out}.jpg`);
}
const records=[];
for(const locale of ['en','ru']) for(const width of [1440,1024,768,390,360]){
  for(const subject of ['first','hero','agent','portal']){
    const name=`${locale}-${width}-${subject}`;
    const left=`screenshots/before/${name}.png`,right=`screenshots/after/${name}.png`;
    await sheet(`${root}/${left}`,`${root}/${right}`,name,undefined,width<768?342:800);
    records.push({locale,width,subject,name,left,right});
  }
}
for(const locale of ['en','ru']) for(const width of [1440,1024,390]) await sheet(`${root}/screenshots/variants/${locale}-${width}-A-neutral.png`,`${root}/screenshots/variants/${locale}-${width}-B-dark.png`,`${locale}-${width}-variants`,['A · neutral stage · chosen','B · rounded dark stage'],width<768?342:800);
const refs='research/portfolio-premium-v3-2026-11-01/references/thumbs';
await sheet(`${refs}/gr-comp.jpg`,`${root}/screenshots/after/en-1440-portal.png`,'reference-portal',['Saved Garri comparison','Portal · complete buyer decision'],800);
await sheet(`${refs}/gr-swap1.jpg`,`${root}/screenshots/after/en-1440-agent.png`,'reference-agent',['Saved Garri focused action','Agent · neutral stage A'],800);
const sections=records.map(r=>`<section id="${r.name}" data-locale="${r.locale}" data-width="${r.width}"><h2>${r.locale.toUpperCase()} · ${r.width}px · ${r.subject}</h2><p><a href="${r.left}">Original BEFORE PNG</a> · <a href="${r.right}">Original AFTER PNG</a></p><img loading="lazy" src="comparisons/${r.name}.jpg" alt="Matched before and after: ${r.name}"></section>`).join('\n');
const variants=['en','ru'].flatMap(l=>[1440,1024,390].map(w=>`<section data-locale="${l}" data-width="${w}"><h2>Agent variants · ${l.toUpperCase()} · ${w}px</h2><img loading="lazy" src="comparisons/${l}-${w}-variants.jpg" alt="Agent A and B at equal scale"></section>`)).join('\n');
await writeFile(`${root}/index.html`,`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Homepage cover polish · review</title><style>body{font:16px/1.5 system-ui;margin:32px;color:#222;background:#eee}main{max-width:1650px;margin:auto}section{background:white;padding:24px;margin:32px 0}img{display:block;max-width:100%;height:auto}a{color:#972515}button{font:inherit;padding:8px 16px;margin:4px;cursor:pointer}nav{position:sticky;top:0;background:#eee;padding:8px;z-index:2}section[hidden]{display:none}</style><main><h1>Homepage cover polish</h1><p>Baseline 43eb0b2 · isolated branch codex/home-cover-polish-2026-11-01. Implementation choice A; independent visual acceptance pending. No merge, deploy or Figma edit.</p><p>Final AFTER includes the owner's Portal corner correction: transparent external canvas, original rounded border intact. Matched Chromium screenshots: DPR 1, reduced motion, identical locale and viewport. Raw PNGs are untouched; labeled comparison sheets resize proportionally, both columns at the same scale. Covers have natural heights.</p><nav>View: <button data-filter="all">All</button><button data-filter="1440">1440</button><button data-filter="1024">1024</button><button data-filter="768">768</button><button data-filter="390">390</button><button data-filter="360">360</button> · <a href="REPORT.md">Report and source correction details</a></nav><h2>Agent A / B</h2>${variants}<h2>BEFORE / AFTER</h2>${sections}<section><h2>Saved premium direction</h2><p>Actual archived Garri screenshots: comparison of native options and a single focused action on a neutral stage. No fresh live-reference capture claimed. See REPORT.md for the specific decisions and limits.</p><img loading="lazy" src="comparisons/reference-portal.jpg" alt="Portal beside saved comparison reference"><img loading="lazy" src="comparisons/reference-agent.jpg" alt="Agent beside saved focused-action reference"></section><script>document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>document.querySelectorAll('[data-width]').forEach(s=>s.hidden=b.dataset.filter!=='all'&&s.dataset.width!==b.dataset.filter));</script></main></html>`);
console.log('Gallery: 40 matched pairs, 6 Agent variant pairs, 2 saved-reference comparisons.');
