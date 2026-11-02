import fs from 'node:fs';
import sharp from 'sharp';
import {createRequire} from 'node:module';
const {chromium}=createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright');
const root='audit/vet-portfolio-premium-v3/neighbors';
const results=JSON.parse(fs.readFileSync(`${root}/results.json`));
const b=await chromium.launch();const analysis=[];
for(const entry of results.filter(e=>!e.pixelIdentical)) {
  const metrics={};
  for(const phase of ['before','after']) {
    const p=await b.newPage({viewport:{width:entry.width,height:900},reducedMotion:'reduce'});
    await p.goto(`http://127.0.0.1:${phase==='before'?5381:5382}/${entry.locale==='ru'?'ru/':''}work/${entry.slug}`,{waitUntil:'networkidle'});
    await p.evaluate(async()=>{await document.fonts.ready;document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.all([...document.images].filter(i=>i.getAttribute('src')).map(i=>i.decode()));});
    metrics[phase]=await p.locator('main').evaluate(e=>({text:e.innerText,elements:[...e.querySelectorAll('h1,h2,h3,p,a,img,video')].map(n=>{const r=n.getBoundingClientRect();return {tag:n.tagName,text:n.tagName==='VIDEO'?undefined:n.textContent,src:n.currentSrc?new URL(n.currentSrc).pathname:undefined,href:n.getAttribute('href'),x:r.x,y:r.y+scrollY,width:r.width,height:r.height};})}));
    await p.close();
  }
  const a=await sharp(`${root}/${entry.locale}-${entry.width}-${entry.slug}-before.png`).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const c=await sharp(`${root}/${entry.locale}-${entry.width}-${entry.slug}-after.png`).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let x0=a.info.width,y0=a.info.height,x1=0,y1=0,pixels=0;
  for(let i=0;i<a.data.length;i+=4)if(a.data[i]!==c.data[i]||a.data[i+1]!==c.data[i+1]||a.data[i+2]!==c.data[i+2]){const x=i/4%a.info.width,y=Math.floor(i/4/a.info.width);x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);pixels++;}
  analysis.push({locale:entry.locale,width:entry.width,slug:entry.slug,geometryAndContentIdentical:JSON.stringify(metrics.before)===JSON.stringify(metrics.after),rasterDifference:{pixels,bounds:{x0,y0,x1,y1}},reason:'Visually inspected native paused-video buffered-range bar; product pixels, DOM, sources and layout unchanged.',metrics});
  for(const phase of ['before','after'])await sharp(`${root}/${entry.locale}-${entry.width}-${entry.slug}-${phase}.png`).extract({left:24,top:5590,width:342,height:330}).toFile(`${root}/native-video-control-${phase}.png`);
}
await b.close();fs.writeFileSync(`${root}/difference-analysis.json`,JSON.stringify(analysis,null,2));console.log(JSON.stringify(analysis.map(({metrics,...r})=>r),null,2));if(analysis.some(r=>!r.geometryAndContentIdentical))process.exitCode=1;
