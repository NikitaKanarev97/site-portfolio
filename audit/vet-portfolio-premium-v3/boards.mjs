import fs from 'node:fs';
import sharp from 'sharp';
const root='audit/vet-portfolio-premium-v3';
fs.mkdirSync(`${root}/comparisons`,{recursive:true});
const boards=[
  ['01-hero','R02-dounar-hero.jpg','hero','1440','Compact project facts and one dominant native workspace; reject borrowed business metrics.'],
  ['02-hero-agent','S01-agent-v3-hero.webp','hero','1440','Match first-fold authorship and consequential UI; retain Vet sage and the full clinical context.'],
  ['03-hero-learn','S03-learn-v3-hero.png','hero','1440','Match fast thesis and provenance; retain one clinical specimen instead of copying Learn’s paired opening.'],
  ['04-hero-phone','B02-vet-v22-mobile.png','hero','390','Keep the genuine phone context; add role, scope and browser implementation disclosure before the proof.'],
  ['05-constraint','R01-garri-editorial.jpg','problem','1440','Borrow label/thesis hierarchy; tie three design tensions to the current queue, not invented operational outcomes.'],
  ['06-diagnosis','R03-dounar-diagnosis.jpg','problem','1440','Borrow grouped rationale; use a current entry state, with no manufactured old-versus-new product study.'],
  ['07-information-model','R04-ha-flow.png','roles','1440','Borrow explicit directional branching; reduce to one saved encounter and two output gates.'],
  ['08-trace','B02-vet-v22-mobile.png','trace','390','V2 has no trace chapter: its combined clinical section is the before; V3 adds native source-led entry.'],
  ['09-calculation','B03-vet-v22-clinical.png','clinical','1440','Preserve native arithmetic and zoom; explain source, substitution and rounding without the decorative left rule.'],
  ['10-invoice','B05-vet-v22-handoff.png','invoice','1440','Preserve complete service proof; replace the repeated full-width stack with a concise asymmetric handoff.'],
  ['11-publication','R05-ha-components.jpg','publication','1440','Borrow a real state family at readable scale; show ready versus blocked, with the full document in native zoom.'],
  ['12-owner','R07-kudinov-desktop-mobile.jpg','owner','1440','Borrow distinct desktop/phone scales; retain the same genuine published snapshot and omit device shells.'],
  ['13-process','R03-dounar-diagnosis.jpg','process','1440','V2 has no process chapter: existing state evidence is shown before; V3 traces decisions to immutable source.'],
  ['14-outcome','R06-dounar-outcome.jpg','outcome','1440','Borrow three clear outcome groups; separate delivery, browser verification and unmeasured real-world impact.'],
];
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
let gallery='<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Vet V3 — independent acceptance boards</title><style>body{font:16px/1.6 system-ui;margin:32px;color:#1b1b18}main{max-width:1800px;margin:auto}h1{font-size:36px}section{margin:72px 0}a{color:#165e61}figure{margin:0;min-width:0}img{max-width:100%;height:auto}figure img{max-height:900px;object-fit:contain;object-position:top}.trio{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}.note{max-width:1000px}@media(max-width:800px){.trio{grid-template-columns:1fr}}</style><main><h1>Vet Clinic OS V3 · comparison evidence</h1><p>Implementation candidate. Independent visual and functional acceptance pending. Original reference → newly captured V2.2 baseline → actual final V3. Click any image for the full source. R/S references describe separate stored captures, not merged or current live pages. Preview boards scale complete images without retouching.</p><p><a href="../REPORT.md">Report</a> · <a href="../BENCHMARK.md">Benchmark assessment</a> · <a href="../MEDIA-PROVENANCE.md">Media provenance</a></p>';
const manifest=[];
for(const [id,ref,chapter,width,note] of boards) {
  const paths=[`references/${ref}`,`before/en-${width}-${chapter}.png`,`after/en-${width}-${chapter}.png`];
  const labels=['Opened original reference','Matched V2.2 BEFORE','Final V3 AFTER'];
  const images=[];let maxHeight=0;
  for(const p of paths) {
    const meta=await sharp(`${root}/${p}`).metadata();
    const ratio=Math.min(600/meta.width,1150/meta.height);
    const image=await sharp(`${root}/${p}`).resize({width:Math.round(meta.width*ratio),height:Math.round(meta.height*ratio)}).png().toBuffer();
    const m=await sharp(image).metadata();maxHeight=Math.max(maxHeight,m.height);images.push({input:image,width:m.width,height:m.height});
  }
  const height=maxHeight+174;
  const header=Buffer.from(`<svg width="1904" height="148"><rect width="1904" height="148" fill="white"/><g font-family="Arial" fill="#1b1b18"><text x="24" y="32" font-size="24">${id} · EN ${width} · reference / V2.2 / V3</text><text x="24" y="65" font-size="17">${escape(note)}</text>${labels.map((l,i)=>`<text x="${24+i*628}" y="126" font-size="19">${l}</text>`).join('')}</g></svg>`);
  const composite=[{input:header,left:0,top:0},...images.map((im,i)=>({input:im.input,left:24+i*628,top:150}))];
  await sharp({create:{width:1904,height,channels:3,background:'white'}}).composite(composite).png().toFile(`${root}/comparisons/${id}.png`);
  gallery+=`<section id="${id}"><h2>${id}</h2><p class="note">${escape(note)}</p><p><a href="${id}.png">Open comparison board</a></p><div class="trio">${paths.map((p,i)=>`<figure><figcaption>${labels[i]} · ${p}</figcaption><a href="../${p}"><img src="../${p}" loading="lazy" alt="${labels[i]} for ${chapter}"></a></figure>`).join('')}</div></section>`;
  manifest.push({id,reference:paths[0],before:paths[1],after:paths[2],note,board:`comparisons/${id}.png`});
}
fs.writeFileSync(`${root}/comparisons/index.html`,gallery+'</main></html>');
fs.writeFileSync(`${root}/comparisons/manifest.json`,JSON.stringify(manifest,null,2));
console.log(`${boards.length} individual boards and native-source comparison gallery`);
