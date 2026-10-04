import {createRequire} from 'node:module';
import {writeFileSync} from 'node:fs';
const require=createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const browser=await require('playwright').chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const results=[];
const pilot=process.argv.includes('--pilot');
const locale=process.argv.find(v=>v.startsWith('--lang='))?.slice(7);
const scenarios=pilot?[{lang:'en',route:'/preview/agent-ops-pilot/'}]:(locale?[locale]:['ru','en']).map(lang=>({lang,route:`/preview/agent-ops-rebuild/${lang}/`}));
try{
for(const {lang,route} of scenarios)for(const wait of [600,1800]){
 const p=await browser.newPage({viewport:{width:1440,height:900}});
 await p.goto('http://127.0.0.1:4384'+route,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1500);
 // Exercise the same material/loading sequence as the broad F matrix.
 for(const img of await p.locator('.pilot img').all()){if(!await img.isVisible())continue;await img.scrollIntoViewIfNeeded();await img.evaluate(e=>e.decode());}await p.waitForTimeout(100);
 const start=await p.locator('.case-steps').evaluate(e=>(e.closest('.pin-spacer')||e).getBoundingClientRect().top+scrollY-24);
 await p.evaluate(y=>scrollTo(0,y),start+1300);await p.waitForTimeout(350);
 const read=()=>p.evaluate(()=>({y:scrollY,top:document.querySelector('[data-scene="promise"]').getBoundingClientRect().top,focused:!!document.querySelector('.is-focused'),pins:document.querySelectorAll('.pin-spacer').length,debug:window.__dsMotionDebug?.(),states:[...document.querySelectorAll('[data-focus-state]')].map(e=>({scene:e.dataset.scene,top:e.getBoundingClientRect().top,opacity:getComputedStyle(e).opacity,loaded:e.querySelector('img').naturalWidth}))}));
 const entry=await read(),changes=[];
 for(let cycle=0;cycle<3;cycle++)for(const reducedMotion of ['reduce','no-preference']){await p.emulateMedia({reducedMotion});await p.waitForTimeout(wait);const state=await read();changes.push({cycle,reducedMotion,...state});if(lang==='ru'&&wait===1800)await p.screenshot({path:`tasks/portfolio-rebuild/agent-ops/shots/live-ru-${cycle}-${reducedMotion}.png`});}
 results.push({lang,route,wait,entry,changes});console.log(lang,route,wait,entry.top,changes.map(s=>[s.reducedMotion,s.top,s.y]));await p.close();
}
}finally{await browser.close();writeFileSync('tasks/portfolio-rebuild/agent-ops/'+(pilot?'pilot-live-reproduction':locale?'live-final-'+locale+'-reproduction':'live-reproduction')+'.json',JSON.stringify(results,null,2));}
