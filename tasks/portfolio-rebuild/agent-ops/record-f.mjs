/** Native wheel recording of actual F pages. No generated frames or retiming. */
import {createRequire} from 'node:module';
import {mkdirSync,writeFileSync,unlinkSync,readFileSync} from 'node:fs';
const require=createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const browser=await require('playwright').chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const out='tasks/portfolio-rebuild/agent-ops/recordings';mkdirSync(out,{recursive:true});
const locale=process.argv.find(v=>v.startsWith('--lang='))?.slice(7);
const records=locale?JSON.parse(readFileSync(out+'/recording.json')).filter(r=>r.lang!==locale):[];
try {
 for(const lang of locale?[locale]:['en','ru']){
  const context=await browser.newContext({viewport:{width:1440,height:900},recordVideo:{dir:out,size:{width:1440,height:900}}});
  const p=await context.newPage(),errors=[],phase={},states=[];p.on('pageerror',e=>errors.push(e.message));const began=Date.now();
  await p.goto(`http://127.0.0.1:4384/preview/agent-ops-rebuild/${lang}/`,{waitUntil:'networkidle'});
  await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(2200);phase.coverEnd=(Date.now()-began)/1000;
  const start=await p.locator('.case-steps').evaluate(e=>(e.closest('.pin-spacer')||e).getBoundingClientRect().top+scrollY-24);
  await p.evaluate(y=>scrollTo(0,y),start);await p.waitForTimeout(1400);phase.sceneStart=(Date.now()-began)/1000;
  const observe=async index=>{states.push(await p.evaluate(index=>{const e=[...document.querySelectorAll('[data-focus-state]')].find(e=>+getComputedStyle(e).opacity>.99);return {index,y:scrollY,scene:e?.dataset.scene,loaded:!!e?.querySelector('img').naturalWidth,time:performance.now()};},index));};
  await observe(0);
  for(let i=0;i<3;i++){
   await p.waitForTimeout(1000);
   for(let d=0;d<650;d+=32){await p.mouse.wheel(0,Math.min(32,650-d));await p.waitForTimeout(75);}
   await p.waitForTimeout(350);await observe(i+1);
  }
  await p.waitForTimeout(1800);phase.sceneEnd=(Date.now()-began)/1000;
  for(let d=0;d<1950;d+=64){await p.mouse.wheel(0,-Math.min(64,1950-d));await p.waitForTimeout(65);}
  await p.waitForTimeout(900);phase.reverseEnd=(Date.now()-began)/1000;await observe('reverse');
  const original=await p.video().path();await context.close();await p.video().saveAs(`${out}/${lang}-1440-native-wheel.webm`);unlinkSync(original);
  records.push({lang,route:`/preview/agent-ops-rebuild/${lang}/`,phase,states,errors,viewport:{width:1440,height:900},method:'Native mouse.wheel. Original cadence; raw WebM. MP4 is a codec conversion only.'});
  if(errors.length||states.some(s=>!s.loaded)||states.slice(0,4).map(s=>s.scene).join(',')!=='overview,workspace,promise,decision'||states.at(-1).scene!=='overview')throw new Error('Recording state/paint failure '+lang);
  console.log(lang,phase,states.map(s=>s.scene));
 }
}finally{await browser.close();writeFileSync(out+'/recording.json',JSON.stringify(records,null,2));}
