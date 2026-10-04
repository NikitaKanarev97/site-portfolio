import{createRequire}from'node:module';
import{writeFileSync}from'node:fs';
const base=process.argv.find(a=>a.startsWith('--base='))?.slice(7)||'http://127.0.0.1:4386';
const b=await createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright').chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const routes=['/kit/','/preview/agent-ops-pilot/','/preview/common/en/agent-ops/','/preview/common/ru/agent-ops/','/work/partner-portal/','/ru/work/partner-portal/','/work/learn/','/ru/work/learn/'];
const results=[],failures=[];
const check=(ok,detail)=>{if(!ok)failures.push(detail)};
try{for(const route of routes){
 const p=await b.newPage({viewport:{width:1440,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(base+route,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1200);
 const focus=p.locator('[data-motion="focus-stage"]');const row={route,focusCount:await focus.count(),changes:[]};
 if(row.focusCount){
  const start=await focus.first().evaluate(e=>(e.closest('.pin-spacer')||e).getBoundingClientRect().top+scrollY-24);
  const count=await focus.first().locator('[data-focus-state]').count();const index=Math.min(2,count-1);
  await p.mouse.move(1000,450);await p.mouse.wheel(0,start+Math.min(index*650,650*(count-1)-30)-await p.evaluate(()=>scrollY));await p.waitForTimeout(400);
  const target=focus.first().locator('[data-focus-state]').nth(index);
  row.entry=await target.evaluate(e=>({top:e.getBoundingClientRect().top,opacity:getComputedStyle(e).opacity}));
  for(let cycle=0;cycle<3;cycle++)for(const reducedMotion of ['reduce','no-preference']){
   await p.emulateMedia({reducedMotion});await p.waitForTimeout(600);
   const s={cycle,reducedMotion,top:await target.evaluate(e=>e.getBoundingClientRect().top),pins:await p.locator('.pin-spacer').count()};row.changes.push(s);
   check(Math.abs(s.top-row.entry.top)<3,{route,reading:s,entry:row.entry});
  }
 }
 const next=p.locator('.case-next__link').first();
 if(await next.count()){
  await next.scrollIntoViewIfNeeded();await p.waitForTimeout(700);
  const read=()=>next.evaluate(e=>{const track=e.closest('.case-next').querySelector('[data-motion="marquee"]');return {transform:getComputedStyle(track).transform,top:track.getBoundingClientRect().top};});
  row.nextA=await read();await p.waitForTimeout(300);row.nextB=await read();check(row.nextA.transform!==row.nextB.transform,{route,nextFrozen:{a:row.nextA,b:row.nextB}});
  await p.setViewportSize({width:1024,height:900});await p.waitForTimeout(800);await next.scrollIntoViewIfNeeded();await p.waitForTimeout(700);
  row.resizedA=await read();await p.waitForTimeout(300);row.resizedB=await read();check(row.resizedA.transform!==row.resizedB.transform,{route,nextAfterResize:{a:row.resizedA,b:row.resizedB}});
 }
 row.overflow=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);row.errors=errors;check(!row.overflow&&!errors.length,{route,overflow:row.overflow,errors});results.push(row);console.log(route,'failures',failures.length);await p.close();
}}finally{await b.close();writeFileSync('tasks/portfolio-rebuild/integration/focus-common/controls.json',JSON.stringify({base,results,failures},null,2)+'\n');}
console.log(JSON.stringify({routes:results.length,liveTransitions:results.reduce((n,r)=>n+r.changes.length,0),failures:failures.length}));if(failures.length)process.exitCode=1;
