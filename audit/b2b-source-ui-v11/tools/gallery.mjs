import { readFile,writeFile,mkdir,copyFile } from 'node:fs/promises';
import sharp from 'sharp';
const root='audit/b2b-source-ui-v11';
const product=process.env.PRODUCT_FIX_ROOT??'D:/Claude-projects/sp-b2b-source-ui-v11';
await mkdir(`${root}/comparisons`,{recursive:true});
const sections=[];
for(const locale of ['en','ru'])for(const width of [1440,1024,768,390,360]){
  const key=`${locale}-${width}`,w=width<768?342:800,gap=24,top=42;
  const buffers=await Promise.all(['before','after'].map(phase=>sharp(`${root}/${phase}/${key}-portal.png`).resize({width:w}).png().toBuffer()));
  const sizes=await Promise.all(buffers.map(b=>sharp(b).metadata()));
  const title=Buffer.from(`<svg width="${w*2+gap}" height="42"><rect width="100%" height="100%" fill="white"/><g font-family="Arial" font-size="17" fill="#222"><text x="0" y="28">Accepted Home · BEFORE</text><text x="${w+gap}" y="28">Native V1.1 source · AFTER</text></g></svg>`);
  await sharp({create:{width:w*2+gap,height:Math.max(...sizes.map(s=>s.height))+top,channels:3,background:'white'}}).composite([{input:title,left:0,top:0},...buffers.map((input,i)=>({input,left:i*(w+gap),top}))]).jpeg({quality:92}).toFile(`${root}/comparisons/${key}-home.jpg`);
  sections.push(`<section><h2>${locale.toUpperCase()} · ${width}px · Home</h2><p><a href="before/${key}-portal.png">Original BEFORE</a> · <a href="after/${key}-portal.png">Original AFTER</a></p><img loading="lazy" src="comparisons/${key}-home.jpg" alt="Accepted Home versus genuine source cover"></section>`);
}
for(const locale of ['en','ru'])for(const width of [1280,390])for(const kind of ['before-after','accepted-parity']){
  const file=`${locale}-${width}-${kind}.jpg`;await copyFile(`${product}/audit/source-ui-v11/comparisons/${file}`,`${root}/comparisons/${file}`);
  sections.push(`<section><h2>${locale.toUpperCase()} · ${width}px · Product ${kind}</h2><img loading="lazy" src="comparisons/${file}" alt="Native product comparison"></section>`);
}
await writeFile(`${root}/index.html`,`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>B2B Source UI V1.1 · portfolio parity</title><style>body{font:16px/1.5 system-ui;background:#eee;color:#222;margin:32px}main{max-width:1650px;margin:auto}section{background:white;padding:24px;margin:32px 0}img{max-width:100%;height:auto;display:block}a{color:#96311f}</style><main><h1>B2B Portal Source UI Fix V1.1 · portfolio parity</h1><p>Independent source-parity review pending. The accepted Agent Ops, portrait, Pawly, Vet and all other source/media remain unchanged. Only the four Portal Home captures and their registry entries change.</p><p>Raw native PNGs are retained untouched. The WebP presentation cutout follows the application's measured rounded silhouette; every opaque RGB pixel is verified equal to the native screenshot. No capture-time CSS, text replacement or DOM assembly.</p><p><a href="REPORT.md">Report</a> · <a href="product/manifest.json">Source SHA and image provenance</a> · <a href="logs/verification.json">Scope verification</a></p>${sections.join('')}</main></html>`);
console.log('Gallery: 10 Home BEFORE/AFTER pairs; 4 actual product BEFORE/AFTER pairs; 4 accepted-source parity pairs.');
