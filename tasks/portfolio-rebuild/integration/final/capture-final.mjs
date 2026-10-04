/** Final static review frames: decode actual images, restore native carousel stops, capture the complete page. */
import{createRequire}from'node:module';import{writeFileSync,mkdirSync}from'node:fs';
const base='http://127.0.0.1:4390',out='tasks/portfolio-rebuild/integration/final';mkdirSync(out+'/shots',{recursive:true});
const browser=await createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright').chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const results=[],failures=[];
try{for(const lang of ['en','ru'])for(const width of [1440,390]){
 const context=await browser.newContext({reducedMotion:'reduce',viewport:{width,height:width===390?844:900}}),page=await context.newPage();
 for(const slug of ['home','about','agent-ops-console','partner-portal','learn','vet-clinic','pawly']){
  const route=(lang==='ru'?'/ru':'')+(slug==='home'?'/':slug==='about'?'/about/':'/work/'+slug+'/');await page.goto(base+route,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
  for(const img of await page.locator('main img').all()){if(!await img.isVisible())continue;await img.scrollIntoViewIfNeeded();await img.evaluate(e=>e.decode());}
  for(const track of await page.locator('[data-carousel-track]').all())await track.evaluate(e=>e.scrollTo({left:0,behavior:'instant'}));
  await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(400);
  const stops=await page.locator('[data-carousel-track]').evaluateAll(es=>es.map(e=>e.scrollLeft));if(stops.some(v=>Math.abs(v)>1))failures.push({route,width,reason:'carousel first stop',stops});
  await page.screenshot({path:`${out}/shots/${lang}-${slug}-${width}-full.png`,fullPage:true});
  if(!['home','about'].includes(slug)){await page.screenshot({path:`${out}/shots/${lang}-${slug}-${width}-opening.png`});await page.evaluate(()=>scrollTo(0,innerHeight));await page.waitForTimeout(80);await page.screenshot({path:`${out}/shots/${lang}-${slug}-${width}-second.png`});}
  if(slug==='partner-portal'&&lang==='en'&&width===1440)await page.locator('[data-specimen-set="availability"]').screenshot({path:out+'/shots/availability-clean.png'});
  results.push({route,lang,width,stops,fullPage:true,decoded:true});
 }
 await context.close();
}}finally{await browser.close();writeFileSync(out+'/capture-final.json',JSON.stringify({base,results,failures},null,2));}
console.log(JSON.stringify({profiles:results.length,failures:failures.length}));if(failures.length)process.exitCode=1;
