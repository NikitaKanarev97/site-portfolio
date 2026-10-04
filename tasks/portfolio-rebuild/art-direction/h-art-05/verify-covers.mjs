import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
const {chromium}=createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright');
const browser=await chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const profiles=['en','ru'].flatMap(lang=>[390,768,1024,1440].flatMap(width=>[600,900].map(height=>({lang,width,height,mode:'normal'}))));
for(const mode of ['reduce','no-js'])for(const lang of ['en','ru'])profiles.push({lang,width:1440,height:600,mode});
const results=[];
for(const profile of profiles){
 const context=await browser.newContext({viewport:{width:profile.width,height:profile.height},javaScriptEnabled:profile.mode!=='no-js',reducedMotion:profile.mode==='reduce'?'reduce':'no-preference'}),page=await context.newPage();
 await page.goto(`http://127.0.0.1:4398/${profile.lang==='ru'?'ru/':''}work/pawly/`,{waitUntil:'networkidle'});await page.waitForTimeout(1500);
 const geometry=await page.evaluate(()=>{const cover=document.querySelector('.case-opening'),c=cover.getBoundingClientRect();return{coverHeight:c.height,overflow:document.documentElement.scrollWidth-innerWidth,material:[...cover.querySelectorAll('.work-stage__photo,.case-screen')].map(e=>{const r=e.getBoundingClientRect(),i=e.querySelector('img');return{class:e.className,loaded:i.complete&&i.naturalWidth>0,inside:r.left>=c.left-1&&r.right<=c.right+1&&r.top>=c.top-1&&r.bottom<=c.bottom+1,bottomField:c.bottom-r.bottom,naturalRatioError:Math.abs(i.clientHeight-i.clientWidth*i.naturalHeight/i.naturalWidth)};})};});
 results.push({...profile,...geometry});await context.close();
}
await browser.close();await writeFile('tasks/portfolio-rebuild/art-direction/h-art-05/cover-verification.json',JSON.stringify({sourceRef:'297ddd3e1a8ccdea56a8a33e4d25865f03771e07',purpose:'Verify the entire Pawly photo and native report are inside the cover, including the shortest desktop viewport and static fallbacks.',results},null,2));
const failed=results.filter(r=>r.overflow>1||r.material.some(m=>!m.loaded||!m.inside||m.naturalRatioError>2));console.log(JSON.stringify({profiles:results.length,failed},null,2));if(failed.length)process.exitCode=1;
