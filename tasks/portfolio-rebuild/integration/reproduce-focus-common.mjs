import {createRequire} from 'node:module';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
const req=createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const base=process.argv.find(v=>v.startsWith('--base='))?.slice(7)||'http://127.0.0.1:4386';
const dir='tasks/portfolio-rebuild/integration/focus-common';mkdirSync(dir+'/shots',{recursive:true});
const label=process.argv.find(v=>v.startsWith('--label='))?.slice(8)||'baseline';
const diagnose=process.argv.includes('--diagnose'), disableAnchor=process.argv.includes('--no-anchor');
const onlyLang=process.argv.find(v=>v.startsWith('--lang='))?.slice(7);
const onlyWait=process.argv.find(v=>v.startsWith('--wait='))?.slice(7);
const results=[],failures=[];
const browser=await req('playwright').chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
try {
 for(const lang of onlyLang?[onlyLang]:['ru','en'])for(const wait of onlyWait?[Number(onlyWait)]:[600,1800]){
  const page=await browser.newPage({viewport:{width:1440,height:900}}), errors=[];page.on('pageerror',e=>errors.push(e.message));
  if(diagnose)await page.addInitScript(()=>{
   window.__scrollWrites=[];const original=window.scrollTo;
   window.scrollTo=function(...args){window.__scrollWrites.push({at:performance.now(),args,stack:new Error().stack});return original.apply(this,args);};
   document.addEventListener('DOMContentLoaded',()=>{window.addEventListener('scroll',()=>window.__scrollWrites.push({at:performance.now(),event:'scroll',y:scrollY}));});
  });
  const route=`/preview/agent-ops-rebuild/${lang}/`;
  await page.goto(base+route,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1500);
  if(disableAnchor)await page.addStyleTag({content:'html { overflow-anchor: none !important; }'});
  for(const img of await page.locator('.pilot img').all()){
   if(!await img.isVisible())continue;await img.scrollIntoViewIfNeeded();
   try{await img.evaluate(e=>e.decode());}catch(error){
    // A responsive source can change while decode() is pending in dev. Retry the new source once.
    await page.waitForTimeout(150);await img.evaluate(e=>e.decode());
   }
  }await page.waitForTimeout(100);
  const start=await page.locator('.case-steps').evaluate(e=>(e.closest('.pin-spacer')||e).getBoundingClientRect().top+scrollY-24);
  await page.evaluate(y=>scrollTo(0,y),start+1300);await page.waitForTimeout(350);
  const read=()=>page.evaluate(()=>({y:scrollY,top:document.querySelector('[data-scene="promise"]').getBoundingClientRect().top,focused:!!document.querySelector('.is-focused'),pins:document.querySelectorAll('.pin-spacer').length,debug:window.__dsMotionDebug?.(),states:[...document.querySelectorAll('[data-focus-state]')].map(e=>({scene:e.dataset.scene,top:e.getBoundingClientRect().top,opacity:getComputedStyle(e).opacity,loaded:e.querySelector('img').naturalWidth}))}));
  const entry=await read(),changes=[];
  await page.screenshot({path:`${dir}/shots/${label}-${lang}-${wait}-before.png`});
  for(let cycle=0;cycle<3;cycle++)for(const reducedMotion of ['reduce','no-preference']){
   if(diagnose)await page.evaluate(()=>{window.__scrollWrites=[];window.__focusTrace=[];});
   await page.emulateMedia({reducedMotion});await page.waitForTimeout(wait);const state=await read();
   const row={cycle,reducedMotion,...state,...(diagnose?{writes:await page.evaluate(()=>window.__scrollWrites),trace:await page.evaluate(()=>window.__focusTrace)}:{})};changes.push(row);
   const active=state.states.filter(s=>s.opacity==='1').map(s=>s.scene);
   if(Math.abs(state.top-entry.top)>3||state.pins!==(reducedMotion==='reduce'?0:1)||errors.length||(reducedMotion==='no-preference'&&active.join(',')!=='promise'))failures.push({lang,wait,entryTop:entry.top,...row,errors});
   if(cycle===0&&reducedMotion==='reduce')await page.screenshot({path:`${dir}/shots/${label}-${lang}-${wait}-reduce.png`});
  }
  results.push({lang,route,wait,entry,changes,errors});console.log(lang,wait,entry.top,changes.map(s=>[s.reducedMotion,s.top,s.y]));await page.close();
 }
}finally{
 await browser.close();
 writeFileSync(`${dir}/${label}.json`,JSON.stringify({base,diagnose,disableAnchor,results,failures,sharedSourceSha256:createHash('sha256').update(readFileSync('src/scripts/animations.js')).digest('hex')},null,2)+'\n');
}
console.log(JSON.stringify({cases:results.length,transitions:results.reduce((n,r)=>n+r.changes.length,0),failures:failures.length}));
if(failures.length)process.exitCode=1;
