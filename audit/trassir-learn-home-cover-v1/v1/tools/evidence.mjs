import sharp from 'sharp';
import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root='audit/trassir-learn-home-cover-v1/v1';
const read=async p=>JSON.parse(await readFile(p,'utf8'));
const before=await read(`${root}/logs/before.json`),after=await read(`${root}/logs/after.json`),b=await read(`${root}/logs/B.json`);
for(const phase of ['before','after'])for(const row of (phase==='before'?before:after).results){
 const input=`${root}/${phase}/${row.locale}-${row.width}-full.png`,meta=await sharp(input).metadata(),r=row.cover;
 const top=Math.max(0,Math.floor(r.y)-400),bottom=Math.min(meta.height,Math.ceil(r.y+r.height)+600);
 await sharp(input).extract({left:0,top,width:meta.width,height:bottom-top}).png().toFile(`${root}/${phase}/${row.locale}-${row.width}-context.png`);
}
const candidates=[];
for(const locale of ['en','ru'])for(const width of [1440,390]){
 const a=after.results.find(r=>r.locale===locale&&r.width===width),br=b.results.find(r=>r.locale===locale&&r.width===width);
 candidates.push({variant:'A',...a},{variant:'B',...br});
 for(const suffix of ['cover','stage','full'])await copyFile(`${root}/after/${locale}-${width}-${suffix}.png`,`${root}/comparisons/candidates/${locale}-${width}-A-${suffix}.png`);
 await board(`${root}/comparisons/${locale}-${width}-A-B.jpg`,['A · Connected knowledge','B · Task-first'],['A','B'].map(v=>`${root}/comparisons/candidates/${locale}-${width}-${v}-cover.png`),width===1440?800:390);
}
await writeFile(`${root}/logs/candidates.json`,JSON.stringify(candidates,null,2)+'\n');
await board(`${root}/comparisons/premium-mobile.jpg`,['R1 · Practicum active course','R2 · Brilliant unit description','R3 · Ozon Job My learning','Learn · final RU 390 cover'],[...['R1-practicum','R2-brilliant','R3-ozon-job'].map(n=>`${root}/comparisons/references/${n}.png`),`${root}/after/ru-390-cover.png`],342);
await board(`${root}/comparisons/product-source-v-final.jpg`,['P0 · ONVIF original reference','P0 · Programme continuation','Final · EN desktop stage'],['public/media/case-learn-v2/current/en/reference.webp','public/media/case-learn-v2/current/en/path-progress.webp',`${root}/after/en-1440-stage.png`],768);
const manifest=await read('src/data/learn-v2-media.json'),sources={productCommit:'e9ac4b075c4c5251dc10891ad201ecbf5405b727',transform:'None. Whole existing images, original proportions. Alpha details sit on portfolio white surface.',images:[]};
for(const locale of ['en','ru'])for(const key of ['reference','answer-detail','path-progress','home-wide','home-mobile']){const e=manifest[`${locale}/${key}`];sources.images.push({key:`${locale}/${key}`,...e,sha256:createHash('sha256').update(await readFile('public'+e.src)).digest('hex')})}
await writeFile(`${root}/logs/source-provenance.json`,JSON.stringify(sources,null,2)+'\n');
// Labelled boards are derived illustrations; full/cover/stage PNGs stay raw browser evidence.
async function board(out,labels,paths,width){
 const buffers=await Promise.all(paths.map(p=>sharp(p).flatten({background:'white'}).resize({width}).png().toBuffer()));
 const metas=await Promise.all(buffers.map(b=>sharp(b).metadata())),gap=24,w=(width+gap)*paths.length-gap,h=Math.max(...metas.map(m=>m.height))+64;
 const header=Buffer.from(`<svg width="${w}" height="48"><rect width="100%" height="100%" fill="white"/>${labels.map((l,i)=>`<text x="${i*(width+gap)+8}" y="29" font-family="Arial" font-size="17">${l}</text>`).join('')}</svg>`);
 await sharp({create:{width:w,height:h,channels:3,background:'white'}}).composite([{input:header,top:0,left:0},...buffers.map((input,i)=>({input,top:56,left:i*(width+gap)}))]).jpeg({quality:94}).toFile(out);
}
console.log('Evidence boards, exact source manifest and context crops written.');
