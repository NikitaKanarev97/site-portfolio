import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
const require = createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const browser = await require('playwright').chromium.launch({ executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
const page = await browser.newPage({viewport:{width:1440,height:900}});
const errors=[]; page.on('pageerror', e=>errors.push(e.message));
await page.goto(`${process.env.PILOT_BASE || 'http://127.0.0.1:4321'}/preview/agent-ops-pilot/`,{waitUntil:'networkidle'});
await page.waitForTimeout(1800);
const state = () => page.evaluate(() => ({...window.__dsMotionDebug(), masks:document.querySelectorAll('.ds-split-line').length,
  text:document.querySelector('h1').textContent, numbers:Array.from(document.querySelectorAll('[data-motion="count"]')).map(el=>el.textContent.trim())}));
const samples=[await state()];
for(let i=0;i<3;i++) {
  await page.emulateMedia({reducedMotion:'reduce'}); await page.waitForTimeout(300); samples.push(await state());
  await page.emulateMedia({reducedMotion:'no-preference'}); await page.waitForTimeout(1800); samples.push(await state());
}
await page.locator('.case-next').evaluate(el=>scrollTo(0,el.offsetTop-100)); await page.waitForTimeout(300);
const track=page.locator('[data-motion="marquee"]');
const controlsAbsent=await page.locator('.case-next button').count()===0;
await page.emulateMedia({reducedMotion:'reduce'}); await page.waitForTimeout(300);
const paused1=await track.getAttribute('style'); await page.waitForTimeout(500); const paused2=await track.getAttribute('style');
await page.mouse.wheel(0,-1200); await page.waitForTimeout(150); await page.mouse.wheel(0,1200); await page.waitForTimeout(500);
const paused3=await track.getAttribute('style');
await page.emulateMedia({reducedMotion:'no-preference'}); await page.waitForTimeout(500); const resumed=await track.getAttribute('style');
const result={samples,controlsAbsent,pausedStable:paused1===paused2&&paused2===paused3,resumes:resumed!==paused3,errors};
writeFileSync(`outputs/agent-ops-${process.env.PILOT_STAGE || 'stage2'}-lifecycle.json`,JSON.stringify(result,null,2)); console.log(result);
await browser.close();
if(errors.length||!result.controlsAbsent||!result.pausedStable||!result.resumes||samples.some(x=>x.duplicateScenes)) throw new Error('Lifecycle acceptance failed');
