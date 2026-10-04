import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=createRequire('D:/Claude-projects/b2b-dssl/package.json')('playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const dir='tasks/portfolio-rebuild/learn/shots';await mkdir(dir,{recursive:true});const results=[];
for(const lang of ['en','ru'])for(const width of [1440,390]){
 const p=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(`http://127.0.0.1:4360/preview/learn-rebuild/${lang}/`,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 for(let y=0;y<await p.evaluate(()=>document.documentElement.scrollHeight);y+=500){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(65);}
 await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(100);
 await p.screenshot({path:`${dir}/${lang}-${width}-full.png`,fullPage:true});
 for(const id of ['shared-material','one-material','content-language','neutral-assessment','public-promise','honest-result']){
  await p.locator('#'+id).screenshot({path:`${dir}/${lang}-${width}-${id}.png`});
 }
 await p.locator('.case-opening').screenshot({path:`${dir}/${lang}-${width}-cover.png`});
 const metrics=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),sections:[...document.querySelectorAll('[data-block-type]')].map(e=>({id:e.id,height:Math.round(e.getBoundingClientRect().height)})),specimenFont:document.fonts.check('700 32px "Learn Onest"')}));
 results.push({lang,width,errors,...metrics});console.log(lang,width,metrics.overflow,errors.length,metrics.broken.length);await p.close();
}
await browser.close();await writeFile('tasks/portfolio-rebuild/learn/visual.json',JSON.stringify(results,null,2));
