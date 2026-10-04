import {createRequire} from 'node:module';
import {writeFileSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const base=process.argv.find(a=>a.startsWith('--base='))?.slice(7)||'http://127.0.0.1:4386';
const browser=await createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright').chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const results=[],failures=[],dir='tasks/portfolio-rebuild/integration/final';
const read=async(p,scene)=>p.evaluate(scene=>{
 const e=document.querySelector(`[data-scene="${scene}"]`), img=e.querySelector('img');
 return {y:scrollY,top:e.getBoundingClientRect().top,scene,loaded:img.complete&&img.naturalWidth>0,pins:document.querySelectorAll('.pin-spacer').length,focused:!!document.querySelector('.case-steps.is-focused'),overflow:document.documentElement.scrollWidth-innerWidth,active:[...document.querySelectorAll('[data-focus-state]')].filter(e=>+getComputedStyle(e).opacity===1).map(e=>e.dataset.scene)};
},scene);
async function wheelTo(p,y){await p.mouse.move(1000,450);await p.mouse.wheel(0,y-await p.evaluate(()=>scrollY));await p.waitForTimeout(400);}
try{
 for(const lang of ['en','ru'])for(const wait of [600,1800]){
  const p=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(base+`${lang==='ru'?'/ru':''}/work/agent-ops-console/`,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1500);
  for(const img of await p.locator('.pilot img').all()){if(!await img.isVisible())continue;await img.scrollIntoViewIfNeeded();try{await img.evaluate(e=>e.decode());}catch(error){await p.waitForTimeout(150);await img.evaluate(e=>e.decode());}}
  // Keyboard and wheel are trusted native input; no scripted play/scroll in this suite.
  await p.keyboard.press('Home');await p.waitForTimeout(350);
  const scenes=['overview','workspace','promise','decision'];
  for(const [index,scene]of scenes.entries()){
   const start=await p.locator('.case-steps').evaluate(e=>(e.closest('.pin-spacer')||e).getBoundingClientRect().top+scrollY-24);
   await wheelTo(p,start+(index===0?20:index===3?1900:index*650));const entry=await read(p,scene),changes=[];
   if(entry.active.join(',')!==scene||!entry.loaded||entry.overflow)failures.push({lang,wait,scene,entry});
   for(let cycle=0;cycle<3;cycle++)for(const reducedMotion of ['reduce','no-preference']){
    await p.emulateMedia({reducedMotion});await p.waitForTimeout(wait);const row={cycle,reducedMotion,...await read(p,scene)};changes.push(row);
    if(Math.abs(row.top-entry.top)>3||row.pins!==(reducedMotion==='reduce'?0:1)||!row.loaded||row.overflow||(reducedMotion==='no-preference'&&row.active.join(',')!==scene))failures.push({lang,wait,scene,entryTop:entry.top,...row});
   }
   results.push({lang,wait,scene,entry,changes});
  }
  // New native input releases the reflow anchor; reverse and fast forward remain free.
  for(const [scene,distance] of [['promise',1300],['workspace',650],['overview',20],['decision',1900],['overview',20]]){
   const start=await p.locator('.case-steps').evaluate(e=>(e.closest('.pin-spacer')||e).getBoundingClientRect().top+scrollY-24);
   await wheelTo(p,start+distance);const row=await read(p,scene);
   if(row.active.join(',')!==scene||row.overflow||!row.loaded)failures.push({lang,wait,nativeReverseFast:row});
   results.push({lang,wait,mode:'native-reverse-fast',...row});
  }
  if(errors.length)failures.push({lang,wait,errors});console.log(lang,wait,'native states checked; failures',failures.length);await p.close();
 }
}finally{await browser.close();writeFileSync(dir+'/native-states.json',JSON.stringify({base,nativeInput:'Trusted Home and mouse.wheel; no scripted scroll/play',results,failures,sharedSourceSha256:createHash('sha256').update(readFileSync('src/scripts/animations.js')).digest('hex'),limitations:['Local Chromium viewport emulation, no physical device or CPU measurement']},null,2)+'\n');}
console.log(JSON.stringify({observations:results.length,transitions:results.filter(r=>r.changes).reduce((n,r)=>n+r.changes.length,0),failures:failures.length}));if(failures.length)process.exitCode=1;
