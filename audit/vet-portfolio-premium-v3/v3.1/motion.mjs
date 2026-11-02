import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const {chromium}=require('playwright');
const phase=process.argv[2],root=`audit/vet-portfolio-premium-v3/v3.1/${phase}`;
const browser=await chromium.launch(),results=[];
for(const locale of ['en','ru']) for(const width of [1440,390,320]) {
 const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
 for(const [route,selectors] of [['vet-clinic',['#process .ds-link','#outcome .ds-link']],['partner-portal',['main .ds-link:has(svg)']]]) {
  await page.goto(`http://127.0.0.1:5391/${locale==='ru'?'ru/':''}work/${route}`,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  for(const selector of selectors) {
   const a=page.locator(selector).first();
   await a.scrollIntoViewIfNeeded();
   const id=`${locale}-${width}-${route}-${selector.includes('process')?'process':selector.includes('outcome')?'outcome':'wrapped'}-motion`;
   for(const state of ['normal','hover','focus']) {
    await page.mouse.move(0,0);await a.evaluate(a=>a.blur());
    await page.emulateMedia({reducedMotion:'no-preference'});
    if(state==='hover')await a.hover();
    if(state==='focus'){await a.focus();await page.keyboard.press('Shift+Tab');await page.keyboard.press('Tab');}
    await page.waitForTimeout(300);
    await a.scrollIntoViewIfNeeded();
    const b=await a.boundingBox(),x=Math.max(0,Math.floor(b.x-12)),y=Math.max(0,Math.floor(b.y-16));
    await page.screenshot({path:`${root}/${id}-${state}.png`,clip:{x,y,width:Math.min(width-x,Math.ceil(b.width+24)),height:Math.min(900-y,Math.ceil(b.height+32))}});
    results.push({id,state,...await a.evaluate(a=>{const i=a.querySelector('svg');return {transform:getComputedStyle(i).transform,transition:getComputedStyle(i).transitionDuration,focusVisible:a.matches(':focus-visible'),hover:a.matches(':hover')};})});
    await page.emulateMedia({reducedMotion:'reduce'});
   }
   await page.mouse.move(0,0);await a.hover();await page.waitForTimeout(100);
   results.push({id,state:'reduced-hover',...await a.evaluate(a=>({transform:getComputedStyle(a.querySelector('svg')).transform,transition:getComputedStyle(a.querySelector('svg')).transitionDuration}))});
  }
 }
 await page.close();console.log(phase,locale,width,'motion captured');
}
await browser.close();fs.writeFileSync(`${root}/motion.json`,JSON.stringify(results,null,2));
