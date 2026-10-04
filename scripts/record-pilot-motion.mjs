/** Reviewable, uninterrupted wheel scroll + normal click + browser Back. */
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
const require = createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const browser = await require('playwright').chromium.launch({ executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
const out = process.env.PILOT_OUT || 'research/portfolio-benchmark/shots/pilot-stage2';
const base = process.env.PILOT_BASE || 'http://127.0.0.1:4321';
mkdirSync(out, { recursive: true });
const results=[];
for(const width of [1440,390]) {
  const viewport={width,height:width===390?844:900};
  const context=await browser.newContext({viewport,recordVideo:{dir:out,size:viewport}});
  const page=await context.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(() => { const observer=new MutationObserver(()=>document.querySelector('astro-dev-toolbar')?.remove()); observer.observe(document,{childList:true,subtree:true}); });
  await page.goto(`${base}/preview/agent-ops-pilot/`,{waitUntil:'networkidle'});
  await page.waitForTimeout(1800);
  const height=await page.evaluate(()=>document.documentElement.scrollHeight);
  const readingStops=await page.locator('.case-steps__step').evaluateAll(els=>els.flatMap(el=>{
    const top=(el.closest('.pin-spacer')||el).getBoundingClientRect().top+scrollY;
    return [top,top+Math.max(0,el.offsetHeight-innerHeight+64)];
  }));
  let previous=0;
  for(let y=0;y<height;y+=60) {
    await page.mouse.wheel(0,60); await page.waitForTimeout(100);
    if(readingStops.some(stop=>stop>=previous&&stop<y))await page.waitForTimeout(900);
    previous=y;
  }
  await page.waitForTimeout(700);
  // Scroll back through the three material changes to confirm reversibility.
  await page.mouse.wheel(0,-2600); await page.waitForTimeout(800);
  for(let y=0;y<2600;y+=60) { await page.mouse.wheel(0,60); await page.waitForTimeout(90); }
  await page.getByRole('link',{name:'Next case: Partner Portal',exact:true}).scrollIntoViewIfNeeded();
  const origin=await page.evaluate(()=>scrollY);
  await page.getByRole('link',{name:'Next case: Partner Portal',exact:true}).click();
  await page.waitForURL('**/preview/partner-portal-pilot/');
  await page.waitForTimeout(450);
  await page.screenshot({path:`${out}/${width}-transition-final.png`});
  await page.waitForTimeout(1000);
  await page.screenshot({path:`${out}/${width}-portal-final.png`});
  await page.goBack(); await page.waitForURL('**/preview/agent-ops-pilot/'); await page.waitForTimeout(1200);
  const restored=await page.evaluate(()=>scrollY);
  // Verify the ordinary return link too (a new navigation, distinct from Back).
  await page.getByRole('link',{name:'Next case: Partner Portal',exact:true}).click();
  await page.waitForURL('**/preview/partner-portal-pilot/'); await page.waitForTimeout(1200);
  await page.getByRole('link',{name:'Return to pilot: Agent Ops',exact:true}).click();
  await page.waitForURL('**/preview/agent-ops-pilot/'); await page.waitForTimeout(1500);
  await page.screenshot({path:`${out}/${width}-cover-return.png`});
  results.push({width,origin,restored,errors});
  await context.close(); await page.video().saveAs(`${out}/${width}-showcase.webm`);
}
writeFileSync(`${out}/showcase.json`,JSON.stringify(results,null,2));
console.log(results); await browser.close();
if(results.some(r=>r.errors.length||Math.abs(r.origin-r.restored)>2))throw new Error('Transition showcase failed');
