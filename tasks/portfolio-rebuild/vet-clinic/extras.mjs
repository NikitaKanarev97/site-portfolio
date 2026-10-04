import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
const {chromium}=createRequire('D:/Claude-projects/b2b-dssl/package.json')('playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const results=[],failures=[],external=[];
const check=(ok,lang,name)=>{if(!ok)failures.push({lang,name});};
for(const lang of ['en','ru']){
 const p=await browser.newPage({viewport:{width:1440,height:900}});await p.goto(`http://127.0.0.1:4366/preview/vet-clinic-rebuild/${lang}/`,{waitUntil:'networkidle'});
 await p.locator('.case-next__link').scrollIntoViewIfNeeded();await p.waitForTimeout(300);const track=p.locator('.case-next__track'),transform=()=>track.evaluate(e=>getComputedStyle(e).transform);
 const moves=async()=>{const before=await transform();await p.waitForTimeout(350);return before!==await transform();};
 await p.locator('.case-next__link').hover();const hover=await moves();await p.locator('.case-next__link').focus();const focus=await moves();check(hover&&focus,lang,'CaseNext continues on hover and focus');
 await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(300);const offscreenMoving=await moves();check(!offscreenMoving,lang,'Offscreen marquee pauses');
 await p.emulateMedia({reducedMotion:'reduce'});await p.locator('.case-next__link').scrollIntoViewIfNeeded();await p.waitForTimeout(300);const reducedMoving=await moves();check(!reducedMoving,lang,'Reduced marquee is static');results.push({lang,hoverMoving:hover,focusMoving:focus,offscreenMoving,reducedMoving});await p.close();
 const url=`https://veterinary-clinic-gules.vercel.app/${lang==='ru'?'ru/':''}`;
 try{const response=await fetch(url,{signal:AbortSignal.timeout(10000)});external.push({url,status:response.status,ok:response.ok,finalUrl:response.url});}catch(e){external.push({url,error:String(e),ok:false});}
}
await browser.close();await writeFile('tasks/portfolio-rebuild/vet-clinic/extras.json',JSON.stringify({results,external,failures},null,2));console.log(JSON.stringify({results,external,failures},null,2));if(failures.length)process.exitCode=1;
