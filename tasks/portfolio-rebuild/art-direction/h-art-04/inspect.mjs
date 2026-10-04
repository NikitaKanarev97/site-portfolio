import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright');
const dir='tasks/portfolio-rebuild/art-direction/h-art-04/initial';
await mkdir(dir,{recursive:true});
const b=await chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'}),results=[];
for(const lang of ['en','ru'])for(const width of [1440,1024,390,360]){
 const p=await b.newPage({viewport:{width,height:900}});await p.goto(`http://127.0.0.1:4395/${lang==='ru'?'ru/':''}`,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1000);
 const opening=await p.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,h1:document.querySelector('h1').getBoundingClientRect().toJSON(),hero:document.querySelector('.hero').getBoundingClientRect().toJSON(),image:document.querySelector('.hero__proof img').getBoundingClientRect().toJSON(),bio:document.querySelector('.hero__copy').getBoundingClientRect().toJSON(),nav:[...document.querySelectorAll('.work-index a')].map(e=>e.getBoundingClientRect().toJSON()),actions:document.querySelector('.hero__actions').getBoundingClientRect().toJSON()}));
 await p.screenshot({path:`${dir}/${lang}-${width}-home-opening.png`});
 for(const el of await p.locator('.featured-case').all()) {await el.scrollIntoViewIfNeeded();await p.waitForTimeout(1000);if(width===1440||width===390)await el.screenshot({path:`${dir}/${lang}-${width}-${await el.getAttribute('id')}.png`});}
 await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(200);if(width===1440||width===390)await p.screenshot({path:`${dir}/${lang}-${width}-home-full.png`,fullPage:true});
 results.push({lang,width,...opening});await p.close();
}
await b.close();await writeFile(dir+'/geometry.json',JSON.stringify(results,null,2));
console.log(JSON.stringify(results.map(r=>({lang:r.lang,width:r.width,overflow:r.scrollWidth-r.width,uiTop:r.image.y,uiBottom:r.image.bottom,navBottom:Math.max(...r.nav.map(n=>n.bottom)),actionsBottom:r.actions.bottom})),null,2));
