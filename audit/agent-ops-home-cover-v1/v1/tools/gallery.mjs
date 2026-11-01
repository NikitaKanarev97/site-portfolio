import sharp from 'sharp';
import{readFile,writeFile}from'node:fs/promises';
import{createHash}from'node:crypto';
const root='audit/agent-ops-home-cover-v1/v1';
async function board(name,items,width=640){
 const bs=await Promise.all(items.map(async({path,label})=>{const input=await sharp(path).resize({width}).png().toBuffer(),m=await sharp(input).metadata();return {input,height:m.height,label};}));
 const label=Buffer.from(`<svg width="${(width+24)*bs.length}" height="54"><rect width="100%" height="100%" fill="white"/>${bs.map((b,i)=>`<text x="${i*(width+24)+8}" y="32" font-family="Arial" font-size="18">${b.label.replaceAll('&','&amp;')}</text>`).join('')}</svg>`);
 await sharp({create:{width:(width+24)*bs.length,height:Math.max(...bs.map(b=>b.height))+64,channels:3,background:'white'}}).composite([{input:label,top:0,left:0},...bs.map((b,i)=>({input:b.input,top:56,left:i*(width+24)}))]).jpeg({quality:93}).toFile(`${root}/comparisons/${name}.jpg`);
}
for(const locale of['en','ru'])for(const width of[1440,1024,768,390,360]){
 await board(`${locale}-${width}-before-after`,['before','after'].map(p=>({path:`${root}/${p}/${locale}-${width}-cover.png`,label:`${p.toUpperCase()} · ${locale} · ${width}`})),width<768?width:800);
}
for(const locale of['en','ru'])for(const width of[1440,390]){
 const kind=width===1440?'desktop':'mobile';
 await board(`${locale}-${width}-source`,[
 {path:`${root}/after/${locale}-${width}-stage.png`,label:'Final cover · actual browser'},
 {path:`public/media/rebuild/agent-ops/v2/${locale}/approval-consequences-${kind}.webp`,label:'S4 · unchanged consequence source'},
 {path:`public/media/rebuild/agent-ops/v2/${locale}/approval-task-${kind}.webp`,label:'S2/S3 · complete accepted task'}],width===1440?640:342);
}
await board('desktop-benchmarks',[
 {path:`${root}/after/en-1440-stage.png`,label:'Final cover · real browser'},
 {path:'audit/agent-ops-home-cover-v1/references/langsmith-migrated.png',label:'R1 · LangSmith · migrated original'},
 {path:'audit/agent-ops-home-cover-v1/references/langfuse.png',label:'R2 · Langfuse · exact original'}],800);
await board('mobile-benchmarks',[
 {path:`${root}/after/en-390-cover.png`,label:'Final cover · EN 390'},
 {path:'audit/agent-ops-home-cover-v1/references/scrn-okx.jpg',label:'R3 · OKX · exact SCRN screen'},
 {path:'audit/agent-ops-home-cover-v1/references/scrn-tbank.jpg',label:'R4 · T-Bank · exact SCRN screen'}],342);
const refs=[
 ['LangSmith','langsmith-migrated.png','https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/69cbaa1c866be8993c5156ad_Screenshot-2025-12-09-at-7.29.41---PM.png'],
 ['Langfuse','langfuse.png','https://langfuse.com/images/docs/llm-analytics.png'],
 ['SCRN OKX','scrn-okx.jpg','https://scrn.gallery/cdn/6abf96731371f38c1767706c.jpg'],
 ['SCRN T-Bank','scrn-tbank.jpg','https://scrn.gallery/cdn/6acbc545d25ce79f7e713bc7.jpg']
];
await writeFile(`${root}/logs/reference-provenance.json`,JSON.stringify(await Promise.all(refs.map(async([name,file,url])=>({name,file:`../references/${file}`,url,sha256:createHash('sha256').update(await readFile(`audit/agent-ops-home-cover-v1/references/${file}`)).digest('hex')}))),null,2)+'\n');
const rows=['en','ru'].flatMap(l=>[1440,1024,768,390,360].map(w=>`<section><h2>${l.toUpperCase()} · ${w}</h2><p><a href="before/${l}-${w}-cover.png">Raw BEFORE</a> · <a href="after/${l}-${w}-cover.png">Raw AFTER</a> · <a href="after/${l}-${w}-first.png">First viewport</a>${[1440,390].includes(w)?` · <a href="before/${l}-${w}-full.png">Full BEFORE</a> · <a href="after/${l}-${w}-full.png">Full AFTER</a>`:''}</p><img loading="lazy" src="comparisons/${l}-${w}-before-after.jpg"></section>`));
await writeFile(`${root}/index.html`,`<!doctype html><html lang="en"><meta charset="utf-8"><title>Agent Home V1 · independent review evidence</title><style>body{font:16px/1.6 system-ui;margin:32px auto;max-width:1600px;padding:0 24px;color:#1b1b18}a{color:#9b2515}section{margin:64px 0}img{max-width:100%;height:auto;display:block}h1{line-height:1.2}p{max-width:90ch}</style><h1>Agent Ops Home Cover V1 · evidence for independent review</h1><p>Branch codex/agent-ops-home-cover-v1-2026-11-02 · base 7991238ac3cad8865eaa24200024cfa764da387c. Pending independent acceptance.</p><p><a href="REPORT.md">Report</a> · <a href="BENCHMARK.md">Benchmark</a> · <a href="logs/verification.json">Browser QA</a></p><p>Raw PNGs are unretouched browser captures. JPEG boards only label, resize and juxtapose those captures and source images; they are not browser screenshots.</p>${rows.join('')}<h2>A/B exploration · actual Home composition</h2>${['en','ru'].flatMap(l=>[1440,390].map(w=>`<section><h3>${l} ${w}</h3><img loading="lazy" src="comparisons/${l}-${w}-A-B.jpg"></section>`)).join('')}<h2>Exact source comparisons</h2>${['en','ru'].flatMap(l=>[1440,390].map(w=>`<img loading="lazy" src="comparisons/${l}-${w}-source.jpg">`)).join('')}<h2>Verified benchmarks</h2><img loading="lazy" src="comparisons/desktop-benchmarks.jpg"><img loading="lazy" src="comparisons/mobile-benchmarks.jpg"><p>${refs.map(([n,f,u])=>`<a href="../references/${f}">${n} original</a>`).join(' · ')}</p></html>`);
console.log('Comparison boards and review gallery written; originals remain unchanged.');
