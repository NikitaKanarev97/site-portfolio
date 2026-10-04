import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
const require=createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const {chromium}=require('playwright');
const base='http://127.0.0.1:4394';
const browser=await chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe',headless:true});
const slugs=['','agent-ops-console','partner-portal','learn','vet-clinic','pawly'];
const result=[],lifecycle=[],failures=[];
for(const lang of ['en','ru'])for(const width of [1440,1024,390,360])for(const mode of ['full','reduce','no-js']){
 const context=await browser.newContext({viewport:{width,height:900},reducedMotion:mode==='reduce'?'reduce':'no-preference',javaScriptEnabled:mode!=='no-js'});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const slug of slugs){
  errors.length=0;
  const path=`${lang==='ru'?'/ru/':'/'}${slug?`work/${slug}/`:''}`;
  const response=await page.goto(base+path,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  const data=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,h1:document.querySelectorAll('h1').length,homeCards:document.querySelectorAll('.featured-case').length,cases:[...document.querySelectorAll('.featured-case')].map(a=>new URL(a.href).pathname),cover:document.querySelector('.case-opening')?.getBoundingClientRect().height,next:document.querySelector('.case-next a')?.getAttribute('href')}));
  const record={lang,width,mode,slug,status:response.status(),...data,errors:[...errors]};
  if(response.status()!==200||data.overflow||data.h1!==1||errors.length||(!slug&&data.homeCards!==5))failures.push(record);
  if(slug==='learn'){
   const details=page.locator('[data-case-route]').nth(1);
   await details.locator('summary').press('Enter');
   const opened=await details.getAttribute('open')!==null;
   const programmeVisible=await details.locator('img').isVisible();
   if(!opened||!programmeVisible)failures.push({lang,width,mode,slug,issue:'native disclosure'});
   record.disclosure={opened,programmeVisible};
  }
  result.push(record);
 }
 await context.close();
}
for(const lang of ['en','ru'])for(const slug of ['','agent-ops-console','partner-portal','learn','vet-clinic','pawly']){
 const c=await browser.newContext({viewport:{width:1440,height:600}}),p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 const path=`${lang==='ru'?'/ru/':'/'}${slug?`work/${slug}/`:''}`;
 await p.goto(base+path,{waitUntil:'networkidle'});
 await p.mouse.wheel(0,1400);await p.waitForTimeout(180);await p.mouse.wheel(0,-800);await p.waitForTimeout(180);
 for(const width of [1024,390,360,1440]){await p.setViewportSize({width,height:600});await p.waitForTimeout(100);if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))failures.push({lang,slug,width,issue:'short resize overflow'});}
 await p.emulateMedia({reducedMotion:'reduce'});await p.waitForTimeout(100);await p.emulateMedia({reducedMotion:'no-preference'});await p.waitForTimeout(100);
 if(slug==='learn'){await p.locator('[data-case-route]').nth(1).locator('summary').press('Enter');await p.setViewportSize({width:390,height:600});await p.locator('[data-case-route]').nth(1).locator('summary').press('Enter');}
 if(slug){
  const next=p.locator('.case-next a').first();
  if(await next.count()){
   await next.click();await p.waitForTimeout(350);await p.goBack();await p.waitForTimeout(350);
   const returned=new URL(p.url()).pathname.replace(/\/$/,'')===path.replace(/\/$/,'');
   if(!returned)failures.push({lang,slug,issue:'Next Back',url:p.url()});
  }else failures.push({lang,slug,issue:'Next missing'});
 }
 lifecycle.push({lang,slug,errors:[...errors]});if(errors.length)failures.push({lang,slug,errors});await c.close();
}
await browser.close();
await writeFile(new URL('./verification.json',import.meta.url),JSON.stringify({base,result,lifecycle,failures},null,2));
console.log(JSON.stringify({profiles:result.length,lifecycle:lifecycle.length,failures}));
