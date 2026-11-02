import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const {webkit}=require('playwright');
const root='audit/vet-portfolio-premium-v3/v3.1/browser-qa';
const browser=await webkit.launch(),results=[];
for(const locale of ['en','ru'])for(const width of [1440,390,320]) {
 const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
 for(const route of ['','work/agent-ops-console','work/partner-portal','work/learn','work/vet-clinic','work/pawly']) {
  await page.goto(`http://127.0.0.1:5391/${locale==='ru'?'ru/':''}${route}`,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  const entry={locale,width,route,links:await page.locator('a.ds-link:has(svg)').evaluateAll(as=>as.filter(a=>a.getClientRects().length).map(a=>{
   const l=a.querySelector('.ds-link__label'),i=a.querySelector('svg'),walker=document.createTreeWalker(l,NodeFilter.SHOW_TEXT),lines=[];
   for(let n;(n=walker.nextNode());)if(n.textContent.trim()){const r=document.createRange();r.selectNodeContents(n);for(const b of r.getClientRects())if(b.width)lines.push({x:b.x,y:b.y,w:b.width,h:b.height});}
   const last=lines.at(-1),icon=i.getBoundingClientRect();
   return {text:l.textContent,delta:icon.y+icon.height/2-last.y-last.h/2,gap:icon.x-last.x-last.w,target:a.getBoundingClientRect().height};
  }))};
  results.push(entry);
  if(route==='work/vet-clinic') {const a=page.locator('#outcome .ds-link');await a.scrollIntoViewIfNeeded();await a.screenshot({path:`${root}/webkit-${locale}-${width}-vet-outcome.png`});}
 }
 await page.close();console.log('WebKit',locale,width,'complete');
}
await browser.close();
fs.writeFileSync(`${root}/webkit.json`,JSON.stringify(results,null,2));
const failures=results.flatMap(r=>r.links.filter(l=>Math.abs(l.delta)>3||Math.abs(l.gap-8)>0.2).map(l=>({key:`${r.locale}-${r.width}-${r.route}`, ...l})));
console.log('WebKit geometry failures:',JSON.stringify(failures));
if(failures.length)process.exitCode=1;
