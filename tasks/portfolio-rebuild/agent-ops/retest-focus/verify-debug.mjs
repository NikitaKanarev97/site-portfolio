/** DEV-only actual GSAP registry check; production does not expose __dsMotionDebug. */
import {createRequire} from 'node:module';
import {writeFileSync} from 'node:fs';
const require=createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const browser=await require('playwright').chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const base=process.argv.find(a=>a.startsWith('--base='))?.slice(7)||'http://127.0.0.1:4385';
const results=[],failures=[];
try{for(const lang of ['en','ru']){
 const p=await browser.newPage({viewport:{width:1440,height:900}}),route=`/preview/agent-ops-rebuild/${lang}/`;
 await p.addInitScript(()=>{
  window.__readingObservers=[];
  const Native=window.ResizeObserver;
  window.ResizeObserver=class extends Native {
   constructor(callback){super(callback);if(callback.name==='apply'){this.readingRecord={active:false};window.__readingObservers.push(this.readingRecord);}}
   observe(...args){if(this.readingRecord)this.readingRecord.active=true;return super.observe(...args);}
   disconnect(){if(this.readingRecord)this.readingRecord.active=false;return super.disconnect();}
  };
 });
 await p.goto(base+route,{waitUntil:'networkidle'});await p.waitForFunction(()=>typeof window.__dsMotionDebug==='function');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1500);
 const read=async stage=>{const s=await p.evaluate(()=>({debug:window.__dsMotionDebug?.(),pins:document.querySelectorAll('.pin-spacer').length,y:scrollY,readingObservers:window.__readingObservers.filter(o=>o.active).length}));results.push({lang,stage,...s});if(!s.debug||s.debug.duplicateScenes!==0||s.pins>1||s.debug.pins!==s.pins||s.readingObservers>1||((stage==='away'||stage==='back'||stage==='next')&&s.readingObservers))failures.push({lang,stage,...s});};
 const start=await p.locator('.case-steps').evaluate(e=>(e.closest('.pin-spacer')||e).getBoundingClientRect().top+scrollY-24);await p.evaluate(y=>scrollTo(0,y),start+1300);await p.waitForTimeout(400);await read('promise');
 for(let i=0;i<3;i++)for(const reducedMotion of ['reduce','no-preference']){await p.emulateMedia({reducedMotion});await p.waitForTimeout(900);await read(`cycle-${i}-${reducedMotion}`);}
 for(const viewport of [{width:1024,height:900},{width:390,height:844},{width:360,height:800},{width:1440,height:600},{width:1440,height:900}]){await p.setViewportSize(viewport);await p.waitForTimeout(900);await read(`${viewport.width}x${viewport.height}`);}
 await p.locator('.case-next__link').scrollIntoViewIfNeeded();await p.waitForTimeout(500);await read('next');const href=await p.locator('.case-next__link').getAttribute('href');await p.locator('.case-next__link').click();await p.waitForURL(base+href);await p.waitForTimeout(1200);await read('away');await p.goBack();await p.waitForURL(base+route);await p.waitForTimeout(1500);await read('back');
 await p.close();console.log(lang,'registry snapshots',results.filter(r=>r.lang===lang).length,'failures',failures.length);
}}finally{await browser.close();writeFileSync('tasks/portfolio-rebuild/agent-ops/retest-focus/f-debug.json',JSON.stringify({origin:base,results,failures,limitation:'Registry/pin lifecycle only. F-G-01 reading position is evaluated separately in production.'},null,2));}
if(failures.length)throw new Error('Duplicate/pin registry failures');
