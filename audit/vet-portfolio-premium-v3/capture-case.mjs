import fs from 'node:fs';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
const require = createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const { chromium } = require('playwright');
const phase = process.argv[2] || 'after';
const quick = process.argv.includes('--quick');
const base = `http://127.0.0.1:${phase==='before'?5381:5382}`;
const root = `audit/vet-portfolio-premium-v3/${quick?'iterations':phase}`;
fs.mkdirSync(root,{recursive:true});
const browser = await chromium.launch();
const results=[];
export async function settle(page) {
  await page.evaluate(async()=>{await document.fonts.ready; document.querySelectorAll('img').forEach(i=>i.loading='eager'); await Promise.all([...document.images].filter(i=>i.getAttribute('src')).map(i=>i.decode()));});
  for(let y=0;y<await page.evaluate(()=>document.documentElement.scrollHeight);y+=750) { await page.evaluate(y=>scrollTo(0,y),y); await page.waitForTimeout(20); }
  await page.evaluate(()=>scrollTo(0,0)); await page.waitForTimeout(200);
}
const sections = phase==='before' ? {hero:'.vet-cover',problem:'#problem',roles:'#roles',trace:'#clinical',clinical:'#clinical',invoice:'.vet-output:nth-child(1)',publication:'.vet-output:nth-child(2)',owner:'.vet-output:nth-child(3)',process:'#states',outcome:'#outcome'} : {hero:'.vet-cover',problem:'#problem',roles:'#roles',trace:'#trace',clinical:'#clinical',invoice:'#invoice',publication:'#publication',owner:'#owner',process:'#process',outcome:'#outcome'};
for(const locale of ['en','ru']) for(const width of quick?[1440,390]:[1440,1280,1024,768,390,360,320]) {
  const page = await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce',timezoneId:'Europe/Moscow',locale:locale==='en'?'en-GB':'ru-RU',isMobile:width<768,hasTouch:width<768});
  const entry={locale,width,errors:[],failedAssets:[]};
  page.on('pageerror',e=>entry.errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400) entry.failedAssets.push(r.url());});
  await page.goto(base+(locale==='ru'?'/ru':'')+'/work/vet-clinic',{waitUntil:'networkidle'}); await settle(page);
  const name=`${locale}-${width}`;
  await page.screenshot({path:`${root}/${name}-viewport.png`});
  await page.screenshot({path:`${root}/${name}-full.png`,fullPage:true});
  if([1440,390].includes(width)) for(const [key,sel] of Object.entries(sections)) await page.locator(sel).screenshot({path:`${root}/${name}-${key}.png`});
  entry.metrics=await page.evaluate(()=>{
    const img=document.querySelector('.vet-cover img'),r=img.getBoundingClientRect();
    const broken=[];
    for(const h of document.querySelectorAll('.vet-case h1,.vet-case h2,.vet-case h3')) {
      const walk=document.createTreeWalker(h,NodeFilter.SHOW_TEXT);
      for(let n;(n=walk.nextNode());) for(const w of n.textContent.matchAll(/[\p{L}\p{N}]+/gu)) {
        const range=document.createRange();range.setStart(n,w.index);range.setEnd(n,w.index+w[0].length);
        if(new Set([...range.getClientRects()].filter(r=>r.width).map(r=>Math.round(r.top))).size>1) broken.push(w[0]);
      }
    }
    return {overflow:document.documentElement.scrollWidth-innerWidth,brokenWords:broken,hero:{src:new URL(img.currentSrc).pathname,x:r.x,y:r.y+scrollY,width:r.width,height:r.height,bottom:r.bottom+scrollY},headings:[...document.querySelectorAll('.vet-case h2')].map(h=>h.textContent),images:[...document.querySelectorAll('.vet-case img')].filter(i=>i.getBoundingClientRect().width).map(i=>({src:new URL(i.currentSrc).pathname,width:i.getBoundingClientRect().width,height:i.getBoundingClientRect().height,loaded:i.complete&&i.naturalWidth>0})),version:document.querySelector('.vet-case').dataset.vetVersion};
  });
  entry.viewportSha256=createHash('sha256').update(fs.readFileSync(`${root}/${name}-viewport.png`)).digest('hex');
  results.push(entry); console.log(name,JSON.stringify(entry.metrics.hero),'overflow',entry.metrics.overflow,'errors',entry.errors.length);
  await page.close();
}
fs.writeFileSync(`${root}/capture-results.json`,JSON.stringify({browser:browser.version(),phase,viewportHeight:900,dpr:1,reducedMotion:'reduce',timezone:'Europe/Moscow',results},null,2));
await browser.close();
