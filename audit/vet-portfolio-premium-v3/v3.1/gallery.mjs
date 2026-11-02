import fs from 'node:fs';
import sharp from 'sharp';
const root='audit/vet-portfolio-premium-v3/v3.1';
const files=fs.readdirSync(`${root}/before`).filter(f=>f.endsWith('.png')&&!f.includes('unchanged-image'));
const encode=s=>s.replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
fs.mkdirSync(`${root}/boards`,{recursive:true});
for(const locale of ['en','ru'])for(const width of [1440,390,320])for(const family of ['vet','shared','cases']) {
 const chosen=files.filter(f=>f.startsWith(`${locale}-${width}-`)&&!f.includes('-motion-')&&(family==='vet'?f.includes('-vet-clinic-'):family==='shared'?f.includes('-home-')||f.includes('-partner-portal-'):f.includes('-agent-ops-console-')||f.includes('-learn-')||f.includes('-pawly-')));
 const rows=[];let y=54;
 for(const f of chosen) {
  const imgs=await Promise.all(['before','after'].map(p=>sharp(`${root}/${p}/${f}`).toBuffer({resolveWithObject:true})));
  const h=Math.max(...imgs.map(i=>i.info.height))+30;
  rows.push({f,imgs,y,h});y+=h;
 }
 const col=Math.max(530,...rows.flatMap(r=>r.imgs.map(i=>i.info.width+24)));
 const text=[`<text x="12" y="22" font-size="16">${locale.toUpperCase()} ${width}px · ${family} · BEFORE / AFTER · actual CSS pixels</text>`,`<text x="12" y="45">BEFORE — 864c4ead</text><text x="${col+12}" y="45">AFTER — V3.1</text>`,...rows.map(r=>`<text x="12" y="${r.y+15}">${encode(r.f)}</text>`)];
 const bg=Buffer.from(`<svg width="${col*2+24}" height="${y}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#ededed"/><g font-family="Arial" font-size="12" fill="#222">${text.join('')}</g></svg>`);
 await sharp(bg).composite(rows.flatMap(r=>r.imgs.map((img,i)=>({input:img.data,left:12+i*col,top:r.y+22})))).png().toFile(`${root}/boards/${locale}-${width}-${family}.png`);
}
const cards=files.map(f=>`<article data-file="${encode(f)}"><h2>${encode(f)}</h2><div><figure><figcaption>BEFORE · 864c4ead</figcaption><img loading="lazy" src="before/${encode(f)}" alt="Before ${encode(f)}"></figure><figure><figcaption>AFTER · V3.1</figcaption><img loading="lazy" src="after/${encode(f)}" alt="After ${encode(f)}"></figure></div></article>`).join('\n');
fs.writeFileSync(`${root}/index.html`,`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>TextLink V3.1 — matched evidence</title><style>body{font:16px system-ui;margin:24px;background:#eee;color:#222}input{font:inherit;padding:8px;width:440px;max-width:95%}article{padding:12px;margin:18px 0;background:white}h2{font-size:14px}article>div{display:flex;gap:32px;flex-wrap:wrap}figure{margin:0;min-width:320px}figcaption{font-size:12px;margin-bottom:12px}img{max-width:100%;height:auto}article[hidden]{display:none}nav{margin:16px 0}</style><h1>TextLink V3.1 · matched BEFORE / AFTER</h1><p>1440 / 390 / 320 CSS px · EN / RU · normal / hover / keyboard focus. Primary matrix uses reduced motion for stable captures. Files marked “motion” show the existing animation with no preference. Narrow hover captures use a fine pointer; real touch QA is recorded separately. Open the PNG for native-size inspection.</p><nav><a href="REPORT.md">Report</a> · <a href="comparison.json">Measurements</a> · <a href="browser-qa/tests.json">Interaction checks</a></nav><label>Filter filenames <input id="filter" placeholder="ru-320-vet-clinic or motion-hover"></label><p id="count"></p>${cards}<script>const input=document.querySelector('#filter'),cards=[...document.querySelectorAll('article')];function filter(){const terms=input.value.toLowerCase().split(/\\s+/).filter(Boolean);let n=0;for(const c of cards){c.hidden=!terms.every(t=>c.dataset.file.includes(t));if(!c.hidden)n++}document.querySelector('#count').textContent=n+' matched close-ups'}input.addEventListener('input',filter);filter();</script></html>`);
console.log(`${files.length} matched close-ups and 18 contact sheets`);
