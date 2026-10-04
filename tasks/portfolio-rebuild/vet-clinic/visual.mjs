import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import sharp from 'sharp';
const require=createRequire('D:/Claude-projects/b2b-dssl/package.json'),{chromium}=require('playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const origin=process.env.BASE??'http://127.0.0.1:4366',dir='tasks/portfolio-rebuild/vet-clinic/shots';await mkdir(dir,{recursive:true});
const results=[];
for(const locale of ['en','ru'])for(const width of [1440,390]){
 const p=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});const errors=[];p.on('pageerror',e=>errors.push(String(e)));
 await p.goto(`${origin}/preview/vet-clinic-rebuild/${locale}/`,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 for(const image of await p.locator('img').all())await image.scrollIntoViewIfNeeded().catch(()=>{});
 await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(150);
 await p.screenshot({path:`${dir}/${locale}-${width}-full.png`,fullPage:true});await p.screenshot({path:`${dir}/${locale}-${width}-top.png`});
 for(const id of ['role-boundaries','one-visit','save-is-not-publish','prototype-boundary']){
  const el=p.locator('#'+id);if(await el.count())await el.screenshot({path:`${dir}/${locale}-${width}-${id}.png`});
 }
 const data=await p.evaluate(()=>({title:document.title,overflow:document.documentElement.scrollWidth>innerWidth+1,sections:[...document.querySelectorAll('[data-block-type]')].map(e=>({id:e.id,height:e.offsetHeight})),images:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),height:document.documentElement.scrollHeight}));results.push({locale,width,errors,...data});
 await sharp(`${dir}/${locale}-${width}-full.png`).resize({width:width===1440?720:390}).png().toFile(`${dir}/${locale}-${width}-overview.png`);
 await p.close();
}
await browser.close();await writeFile('tasks/portfolio-rebuild/vet-clinic/visual.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
