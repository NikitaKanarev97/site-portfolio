/** Launch-only proof for the unchanged frozen build; the full matrix is recorded separately. */
import {createRequire} from 'node:module';
import {writeFileSync} from 'node:fs';
const base='http://127.0.0.1:4391',out='tasks/portfolio-rebuild/integration/final';
const browser=await createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright').chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const results=[],failures=[];
try{
 for(const lang of ['en','ru'])for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'}),page=await context.newPage();
  for(const slug of ['home','about','agent-ops-console','partner-portal','learn','vet-clinic','pawly']){
   const route=(lang==='ru'?'/ru':'')+(slug==='home'?'/':slug==='about'?'/about/':'/work/'+slug+'/');const errors=[];const listener=e=>errors.push(e.message);page.on('pageerror',listener);
   const response=await page.goto(base+route,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
   for(const img of await page.locator('main img').all())if(await img.isVisible()){await img.scrollIntoViewIfNeeded();await img.evaluate(e=>e.decode());}
   const data=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,h1:document.querySelectorAll('h1').length,blocks:document.querySelectorAll('.case-story > section').length,cards:document.querySelectorAll('.featured-case').length,story:document.querySelector('main')?.dataset.storyVersion||null}));
   if(response.status()!==200||data.overflow>1||data.h1!==1||errors.length||(slug==='home'&&data.cards!==5))failures.push({route,width,status:response.status(),data,errors});
   if(lang==='en'&&width===1440&&slug==='partner-portal'){
    const image=page.locator('[data-specimen-set="availability"] img').nth(1);await image.scrollIntoViewIfNeeded();const rect=await image.boundingBox();
    await page.screenshot({path:out+'/shots/availability-outline-final.png',clip:{x:Math.floor(rect.x)-5,y:Math.floor(rect.y)-5,width:Math.ceil(rect.width)+10,height:Math.ceil(rect.height)+10}});
   }
   results.push({route,width,status:response.status(),...data,errors});page.removeListener('pageerror',listener);
  }
  await context.close();
 }
}finally{await browser.close();writeFileSync(out+'/clean-launch.json',JSON.stringify({base,scope:'Fresh unchanged frozen build launch; full width/motion matrix in site-verification and its retests',results,failures},null,2));}
console.log(JSON.stringify({profiles:results.length,failures:failures.length}));if(failures.length)process.exitCode=1;
