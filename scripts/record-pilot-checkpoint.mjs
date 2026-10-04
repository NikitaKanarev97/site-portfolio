/** Actual native wheel footage. No retiming or generated frames. */
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
const require = createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const browser = await require('playwright').chromium.launch({ executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
const out = 'research/portfolio-benchmark/shots/pilot-checkpoint';
mkdirSync(out, { recursive: true });
const context = await browser.newContext({viewport:{width:1440,height:900},recordVideo:{dir:out,size:{width:1440,height:900}}});
const page = await context.newPage(); const phase={}; const errors=[];
page.on('pageerror',e=>errors.push(e.message));
const began=Date.now();
try {
  await page.goto('http://127.0.0.1:4330/preview/agent-ops-pilot/',{waitUntil:'networkidle'});
  await page.waitForTimeout(3000); phase.coverEnd=(Date.now()-began)/1000;
  const start=await page.locator('.case-steps').evaluate(e=>(e.closest('.pin-spacer')||e).getBoundingClientRect().top+scrollY-24);
  await page.evaluate(y=>scrollTo(0,y),start); await page.waitForTimeout(800);
  phase.sceneStart=(Date.now()-began)/1000;
  for (let i=0;i<3;i++) {
    await page.waitForTimeout(1000);
    for(let d=0;d<650;d+=32) {await page.mouse.wheel(0,Math.min(32,650-d));await page.waitForTimeout(75);}
  }
  await page.waitForTimeout(1800); phase.sceneEnd=(Date.now()-began)/1000;
  for(let d=0;d<1950;d+=64){await page.mouse.wheel(0,-Math.min(64,1950-d));await page.waitForTimeout(65);}
  await page.waitForTimeout(900);phase.reverseEnd=(Date.now()-began)/1000;
} finally {
  await context.close(); await page.video().saveAs(`${out}/1440-native-wheel.webm`);
  await browser.close();writeFileSync(`${out}/recording.json`,JSON.stringify({phase,errors},null,2));
}
if(errors.length)throw new Error(errors.join('\n'));
console.log(phase);
