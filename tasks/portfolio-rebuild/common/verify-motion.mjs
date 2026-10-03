/** Full motion/lifecycle on dev preview. --base=url. No CPU throttle/capture/encoding. */
import {createRequire} from 'node:module';
import {writeFileSync} from 'node:fs';
const require=createRequire('D:/Claude-projects/b2b-dssl/package.json');
const base=process.argv.find(v=>v.startsWith('--base='))?.slice(7)||'http://127.0.0.1:4341';
const browser=await require('playwright').chromium.launch({executablePath:process.env.COMMON_CHROME||'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const profiles=[{width:1440,height:900},{width:1024,height:900},{width:390,height:844},{width:360,height:800},{width:1440,height:600}];
const results=[];const failures=[];
const state=p=>p.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,
  ...window.__dsMotionDebug?.(), focused:document.querySelectorAll('.case-steps.is-focused').length,
  spacers:document.querySelectorAll('.pin-spacer').length,booted:window.__dsMotionBooted,
  staticText:[...document.querySelectorAll('[data-story-motion="static"] [data-h="para"]')].map(e=>+getComputedStyle(e).opacity),
  diagramLayouts:[...document.querySelectorAll('[data-diagram-layout]')].filter(e=>getComputedStyle(e).display!=='none').map(e=>e.dataset.diagramLayout),
}));
try{
  for(const lang of ['en','ru'])for(const slug of ['agent-ops','partner-portal'])for(const viewport of profiles){
    const context=await browser.newContext({viewport,reducedMotion:'no-preference'}); const page=await context.newPage();
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    const route=`/preview/common/${lang}/${slug}/`;
    await page.goto(base+route,{waitUntil:'networkidle'});await page.waitForTimeout(1400);
    const initial=await state(page);
    // Fast forward/back scroll; then read a representative central part.
    const height=await page.evaluate(()=>document.documentElement.scrollHeight);
    for(const y of [height,0,height*.3,height*.75,0]){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(90);}
    await page.locator(slug==='agent-ops'?'#human-checkpoint':'#buyer-decision').scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    const afterScroll=await state(page);
    await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(350);const reduced=await state(page);
    await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(350);const resumed=await state(page);
    const entry={route,...viewport,initial,afterScroll,reduced,resumed,errors};results.push(entry);
    const expectedFocus=slug==='agent-ops'&&viewport.width>=1024&&viewport.height>=820;
    if(errors.length||[initial,afterScroll,reduced,resumed].some(s=>!s.booted||!Number.isInteger(s.triggers)||s.overflow>0||s.duplicateScenes||s.staticText.some(v=>v<1))||reduced.triggers||reduced.spacers||initial.focused!==Number(expectedFocus))failures.push(entry);
    console.log(route,viewport.width,viewport.height,'focus',initial.focused,'reduce',reduced.triggers,'duplicates',afterScroll.duplicateScenes);
    await context.close();
  }
  for(const slug of ['agent-ops','partner-portal']){
    const context=await browser.newContext({viewport:{width:1440,height:900}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(`${base}/preview/common/en/${slug}/`,{waitUntil:'networkidle'});await page.waitForTimeout(1500);
    await page.locator(slug==='agent-ops'?'#human-checkpoint':'#buyer-decision').scrollIntoViewIfNeeded();await page.waitForTimeout(900);
    const sizes=[];
    for(const width of [390,360,1024,1440,390,1440]){await page.setViewportSize({width,height:width<768?844:900});await page.waitForTimeout(650);sizes.push({width,...await state(page)});}
    if(sizes.some(s=>s.overflow>0||s.duplicateScenes||(s.width<1024&&s.focused)))failures.push({slug,sizes});
    results.push({slug,scenario:'real resize',sizes,errors});
    await context.close();
  }
  // Native link -> next, Back, Forward, repeated traversal. No hidden pause control.
  const context=await browser.newContext({viewport:{width:1440,height:900}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/preview/common/en/agent-ops/',{waitUntil:'networkidle'});await page.waitForTimeout(1500);
  const next=page.locator('.case-next__link');await next.scrollIntoViewIfNeeded();await page.waitForTimeout(400);
  const transform=()=>page.locator('[data-motion="marquee"]').evaluate(e=>getComputedStyle(e).transform);
  const before=await transform();await next.hover();await page.waitForTimeout(250);const hover=await transform();await next.focus();await page.waitForTimeout(250);const focus=await transform();
  const href=await next.getAttribute('href');await next.click();await page.waitForURL('**/partner-portal/');await page.waitForTimeout(1200);const portal=await state(page);
  await page.goBack();await page.waitForURL('**/agent-ops/');await page.waitForTimeout(1200);const back=await state(page);
  await page.goForward();await page.waitForURL('**/partner-portal/');await page.waitForTimeout(800);const forward=await state(page);
  await page.locator('.case-next__link').scrollIntoViewIfNeeded();await page.waitForTimeout(400);const forwardNextBefore=await transform();await page.waitForTimeout(250);const forwardNextAfter=await transform();
  const lifecycle={scenario:'native link / Back / Forward / hover / focus',href,before,hover,focus,portal,back,forward,forwardNextBefore,forwardNextAfter,errors};results.push(lifecycle);
  if(before===hover||hover===focus||forwardNextBefore===forwardNextAfter||[portal,back,forward].some(s=>s.overflow>0||s.duplicateScenes)||errors.length)failures.push(lifecycle);
  await context.close();
}finally{await browser.close();}
writeFileSync('tasks/portfolio-rebuild/common/motion-verification.json',JSON.stringify({base,results,failures},null,2));
if(failures.length)throw new Error(`Motion verification: ${failures.length} failures`);
