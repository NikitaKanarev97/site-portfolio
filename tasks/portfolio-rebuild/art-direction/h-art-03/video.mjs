import {createRequire} from 'node:module';import {writeFile} from 'node:fs/promises';
const {chromium}=createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright'),dir='tasks/portfolio-rebuild/art-direction/h-art-03';
const b=await chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'}),results=[];
for(const lang of ['en','ru'])for(const width of [1440,390]){
 const c=await b.newContext({viewport:{width,height:844},reducedMotion:'reduce'}),p=await c.newPage();await p.goto(`http://127.0.0.1:4394/${lang==='ru'?'ru/':''}work/pawly/`,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 for(let y=0;y<await p.evaluate(()=>document.documentElement.scrollHeight);y+=600){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(20);}
 const video=p.locator('.case-screen video');await video.scrollIntoViewIfNeeded();await video.evaluate(v=>new Promise(resolve=>{if(v.readyState)resolve();else v.addEventListener('loadedmetadata',resolve,{once:true});}));
 await video.press('Space');await p.waitForTimeout(1100);const playing=await video.evaluate(v=>!v.paused&&v.currentTime>0);await video.press('Space');
 const r=await video.evaluate(v=>({paused:v.paused,controls:v.controls,loop:v.loop,time:v.currentTime,innerPadding:getComputedStyle(v.closest('.media-frame__frame')).padding,imageFits:Math.abs(parseFloat(getComputedStyle(v).height)-parseFloat(getComputedStyle(v).width)*v.videoHeight/v.videoWidth)<.1}));
 results.push({lang,width,playing,...r});await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:`${dir}/final/${lang}-${width}-pawly-full.png`,fullPage:true});await c.close();
}
await b.close();await writeFile(dir+'/video-verification.json',JSON.stringify(results,null,2));console.log(JSON.stringify({profiles:results.length,failures:results.filter(r=>!r.playing||!r.paused||!r.controls||r.loop||r.innerPadding!=='0px'||!r.imageFits).length}));
