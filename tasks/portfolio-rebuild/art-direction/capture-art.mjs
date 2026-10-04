import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
const require=createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const {chromium}=require('playwright');
const args=Object.fromEntries(process.argv.slice(2).map(x=>x.replace(/^--/,'').split('=')));
const base=args.base || 'http://127.0.0.1:4394';
const stage=args.stage || 'after';
const dir=new URL(`./shots/${stage}/`,import.meta.url).pathname.replace(/^\/([A-Z]:)/,'$1');
await mkdir(dir,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe',headless:true});
const routes=['','work/agent-ops-console','work/partner-portal','work/learn','work/vet-clinic','work/pawly'];
const results=[];
for(const lang of ['en','ru']) for(const width of [1440,390]){
 const ctx=await browser.newContext({viewport:{width,height:width===1440?900:844},reducedMotion:'reduce'});
 const page=await ctx.newPage();
 for(const route of routes){
  const errors=[]; const onError=e=>errors.push(e.message); page.on('pageerror',onError);
  const path=`${lang==='ru'?'/ru/':'/'}${route}${route?'/':''}`;
  const key=`${lang}-${width}-${route.split('/').at(-1)||'home'}`;
  const response=await page.goto(base+path,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:`${dir}${key}-opening.png`});
  for(let y=0; y<await page.evaluate(()=>document.documentElement.scrollHeight); y+=650){await page.evaluate(y=>window.scrollTo(0,y),y);await page.waitForTimeout(80);}
  await page.evaluate(async()=>{await Promise.all([...document.images].filter(i=>i.getClientRects().length && i.complete).map(i=>i.decode().catch(()=>{})));});
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.screenshot({path:`${dir}${key}-full.png`,fullPage:true});
  const geometry=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,h1:document.querySelectorAll('h1').length,broken:[...document.images].filter(i=>i.getClientRects().length && i.complete && !i.naturalWidth).map(i=>i.currentSrc)}));
  if(route==='work/learn' && stage==='after'){
   const entry=page.locator('[data-case-route]').nth(1);
   await entry.locator('summary').press('Enter');
   await entry.scrollIntoViewIfNeeded();
   await page.waitForTimeout(150);
   await page.screenshot({path:`${dir}${key}-programme.png`});
  }
  if(route==='work/agent-ops-console'){
   await page.locator('#accepted-prototype').scrollIntoViewIfNeeded();
   await page.screenshot({path:`${dir}${key}-finale.png`});
  }
  if(route==='work/vet-clinic'){
   await page.locator('#one-visit').scrollIntoViewIfNeeded();
   await page.screenshot({path:`${dir}${key}-handoff.png`});
  }
  results.push({key,status:response.status(),...geometry,errors});page.off('pageerror',onError);
 }
 await ctx.close();
}
await browser.close();
await writeFile(new URL(`./capture-${stage}.json`,import.meta.url),JSON.stringify({base,stage,results},null,2));
console.log(JSON.stringify({stage,profiles:results.length,failures:results.filter(r=>r.status!==200||r.overflow||r.h1!==1||r.errors.length||r.broken.length)}));
