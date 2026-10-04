import {createRequire} from 'node:module';
import {writeFileSync} from 'node:fs';
const require=createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const browser=await require('playwright').chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'}),results=[];
const measure=async(p,scene)=>p.locator(`[data-scene="${scene}"] h3`).evaluate(e=>{const t=e.firstChild,words=e.textContent.trim().split(/\s+/),lines=[];let offset=0;for(const word of words){const start=t.textContent.indexOf(word,offset),r=document.createRange();r.setStart(t,start);r.setEnd(t,start+word.length);const y=Math.round(r.getBoundingClientRect().top);let line=lines.find(l=>l.y===y);if(!line)lines.push(line={y,words:[]});line.words.push(word);offset=start+word.length;}return {text:e.textContent.trim(),width:e.getBoundingClientRect().width,lines:lines.map(l=>l.words.join(' ')),orphans:lines.filter(l=>l.words.length===1).length};});
try{for(const width of [1440,1024,390,360]){
 const p=await browser.newPage({viewport:{width,height:900}});await p.goto('http://127.0.0.1:4384/preview/agent-ops-rebuild/ru/',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1500);const focused=await p.locator('.is-focused').count();
 const start=focused?await p.locator('.case-steps').evaluate(e=>(e.closest('.pin-spacer')||e).getBoundingClientRect().top+scrollY-24):0;
 for(const [scene,d,candidates] of [['workspace',650,['Слова рядом с фактами']],['promise',1300,['У обещания нет опоры','Нет опоры для обещания']],['decision',1950,['Нет решения — нет выплаты','Нет решения, нет выплаты','Нет «да» — нет выплаты']]]){
  if(scene==='promise'&&!focused)continue;
  if(focused)await p.evaluate(y=>scrollTo(0,y),start+d);else await p.locator(`[data-scene="${scene}"]`).scrollIntoViewIfNeeded();await p.waitForTimeout(350);results.push({viewportWidth:width,scene,kind:'current',...await measure(p,scene)});
  for(const text of candidates){await p.locator(`[data-scene="${scene}"] h3`).evaluate((e,t)=>e.textContent=t,text);results.push({viewportWidth:width,scene,kind:'candidate',...await measure(p,scene)});}
 }
 await p.close();
}}finally{await browser.close();writeFileSync('tasks/portfolio-rebuild/agent-ops/focus-copy-candidates.json',JSON.stringify(results,null,2));}
console.log(JSON.stringify(results.map(r=>({width:r.viewportWidth,scene:r.scene,text:r.text,lines:r.lines,orphans:r.orphans})),null,2));
