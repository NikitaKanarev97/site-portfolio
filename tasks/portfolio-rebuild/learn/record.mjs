import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=createRequire('D:/Claude-projects/b2b-dssl/package.json')('playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const dir='tasks/portfolio-rebuild/learn/motion';await mkdir(dir,{recursive:true});
const ctx=await browser.newContext({viewport:{width:1440,height:900},recordVideo:{dir,size:{width:1440,height:900}},reducedMotion:'no-preference'});
const p=await ctx.newPage();const events=[];const startTime=Date.now();const mark=async(action)=>events.push({seconds:(Date.now()-startTime)/1000,action,scrollY:await p.evaluate(()=>scrollY),visible:await p.locator('[data-focus-state]').evaluateAll(es=>es.filter(e=>getComputedStyle(e).visibility==='visible'&&+getComputedStyle(e).opacity===1).map(e=>e.querySelector('h3').textContent))});
await p.goto('http://127.0.0.1:4360/preview/learn-rebuild/en/',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(700);
const start=await p.locator('[data-motion="focus-stage"]').evaluate(e=>(e.closest('.pin-spacer')||e).getBoundingClientRect().top+scrollY-24);
await p.evaluate(y=>scrollTo({top:y,behavior:'instant'}),start+100);await p.waitForTimeout(700);await mark('Reference stop');await p.waitForTimeout(1500);
for(const [name,delta] of [['Programme stop',650],['Completion stop',500],['Programme reverse',-500],['Reference reverse',-650]]){
 for(let i=0;i<20;i++){await p.mouse.wheel(0,delta/20);await p.waitForTimeout(40);}
 await p.waitForTimeout(450);await mark(name);await p.waitForTimeout(1500);
}
await p.screenshot({path:dir+'/central-reference-end.png'});const video=p.video();await ctx.close();await video.saveAs(dir+'/central-raw.webm');await browser.close();
await writeFile(dir+'/timeline.json',JSON.stringify({viewport:{width:1440,height:900},url:'/preview/learn-rebuild/en/',method:'Unretimed Playwright browser video, real wheel input, pauses on whole states; first jump positions the scene.',events},null,2));
console.log(events);
