/** Real wheel movement and source screenshots. No CPU emulation during recording. */
import {createRequire} from 'node:module';import {mkdirSync,writeFileSync} from 'node:fs';import {spawnSync} from 'node:child_process';
const require=createRequire('D:/Claude-projects/b2b-dssl/package.json');const browser=await require('playwright').chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const out='tasks/portfolio-rebuild/common/recording';mkdirSync(out,{recursive:true});
const context=await browser.newContext({viewport:{width:1440,height:900},recordVideo:{dir:out,size:{width:1440,height:900}}});const page=await context.newPage(),errors=[],phase={};page.on('pageerror',e=>errors.push(e.message));const began=Date.now();
try{
await page.goto('http://127.0.0.1:4340/preview/common/en/agent-ops/',{waitUntil:'networkidle'});await page.waitForTimeout(1800);
if(!await page.evaluate(()=>window.__dsMotionBooted&&document.querySelector('.case-steps.is-focused')))throw new Error('Focus enhancement did not start');
const start=await page.locator('.case-steps').evaluate(e=>(e.closest('.pin-spacer')||e).getBoundingClientRect().top+scrollY-24);
await page.evaluate(y=>scrollTo(0,y),start);await page.waitForTimeout(700);phase.sceneStart=(Date.now()-began)/1000;
await page.screenshot({path:`${out}/focus-0.png`});
for(let i=1;i<=3;i++){
await page.waitForTimeout(700);for(let d=0;d<650;d+=32){await page.mouse.wheel(0,Math.min(32,650-d));await page.waitForTimeout(60);}await page.waitForTimeout(i===3?2500:1400);await page.screenshot({path:`${out}/focus-${i}.png`});}
phase.forwardEnd=(Date.now()-began)/1000;
for(let d=0;d<1950;d+=64){await page.mouse.wheel(0,-Math.min(64,1950-d));await page.waitForTimeout(55);}await page.waitForTimeout(850);phase.reverseEnd=(Date.now()-began)/1000;
}finally{await context.close();await page.video().saveAs(`${out}/native-wheel.webm`);await browser.close();writeFileSync(`${out}/recording.json`,JSON.stringify({phase,errors,viewport:{width:1440,height:900},cpu:'none',method:'actual native wheel; no retiming'},null,2));}
if(errors.length)throw new Error(errors.join('\n'));
const r=spawnSync('ffmpeg',['-y','-ss',String(phase.sceneStart),'-i',`${out}/native-wheel.webm`,'-t',String(phase.reverseEnd-phase.sceneStart),'-an','-c:v','libx264','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',`${out}/central-scene.mp4`],{encoding:'utf8',windowsHide:true});if(r.status!==0)throw new Error(r.stderr);
const s=spawnSync('ffmpeg',['-y','-i',`${out}/central-scene.mp4`,'-vf','fps=1/2,scale=480:-1,tile=4x2','-frames:v','1',`${out}/movie-sheet.jpg`],{encoding:'utf8',windowsHide:true});if(s.status!==0)throw new Error(s.stderr);console.log(phase);
