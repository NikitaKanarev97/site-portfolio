import fs from 'node:fs';
import { createRequire } from 'node:module';
const require=createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const {chromium}=require('playwright');
const axe=require('axe-core');
const root='audit/vet-portfolio-premium-v3';
fs.mkdirSync(`${root}/browser-qa`,{recursive:true});
const browser=await chromium.launch();
const results=[];
const base='http://127.0.0.1:5382';
const settle=async page=>{await page.evaluate(async()=>{await document.fonts.ready;document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.all([...document.images].filter(i=>i.getAttribute('src')).map(i=>i.decode()));});await page.waitForTimeout(200);};
for(const locale of ['en','ru']) for(const width of [1440,1280,1024,768,390,360,320]) {
  const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce',timezoneId:'Europe/Moscow',hasTouch:width<768,isMobile:width<768});
  const name=`${locale}-${width}`, entry={name,tests:[],errors:[],failedAssets:[]};
  const test=(label,pass,details)=>{entry.tests.push({label,pass:!!pass,details});if(!pass)console.log('FAIL',name,label,details??'');};
  page.on('pageerror',e=>entry.errors.push(e.message));page.on('response',r=>{if(r.status()>=400)entry.failedAssets.push(r.url());});
  const route=(locale==='ru'?'/ru':'')+'/work/vet-clinic';
  await page.goto(base+route,{waitUntil:'networkidle'});await settle(page);
  test('V3 rendered on the localized public route',await page.locator('[data-vet-version="premium-v3"]').count()===1);
  test('Single h1 and nine connected chapters',await page.locator('h1').count()===1&&await page.locator('.vet-sheet h2').count()===9);
  test('No horizontal overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const dimensions=await page.locator('.vet-case img').evaluateAll(imgs=>imgs.filter(i=>i.getBoundingClientRect().width).map(i=>({src:new URL(i.currentSrc).pathname,alt:i.alt,ok:i.naturalWidth>0&&Math.abs(i.getBoundingClientRect().width/i.getBoundingClientRect().height-i.naturalWidth/i.naturalHeight)<.004})));
  test('All displayed product sources load with natural geometry and alt',dimensions.every(i=>i.ok&&i.alt.length>10),dimensions);
  test('No research/third-party screenshots on public page',dimensions.every(i=>!i.src.includes('/references/')));
  test('Real native hero selected for current breakpoint',dimensions[0].src.includes(width>=1024?'visit-workspace-desktop':'visit-context-mobile'));
  const hero=await page.locator('.vet-cover img').boundingBox();
  test('Real product visible in first viewport',hero.y<520&&hero.y+Math.min(hero.height,240)<900);
  const canonical=await page.locator('link[rel="canonical"]').getAttribute('href');
  test('Canonical, description and locale are accurate',canonical.replace(/\/$/,'')===`https://kanarev.com${route}`&&await page.locator('html').getAttribute('lang')===locale&&!!await page.locator('meta[name="description"]').getAttribute('content'),{canonical});
  const og=await page.locator('meta[property="og:image"]').getAttribute('content');
  test('OG image route loads',!!og&&(await page.request.get(base+new URL(og).pathname)).ok());
  const missingAnchors=await page.locator('.vet-case a[href^="#"]').evaluateAll(as=>as.filter(a=>!document.getElementById(decodeURIComponent(a.hash.slice(1)))).map(a=>a.hash));
  test('Every chapter anchor resolves',missingAnchors.length===0);
  for(const id of ['roles','publication','process']) {
    await page.locator(`.vet-index a[href="#${id}"]`).click();
    test(`Chapter link scrolls to ${id}`,await page.locator(`#${id}`).evaluate(e=>{const r=e.getBoundingClientRect();return r.top>=-1&&r.top<innerHeight;}));
  }
  const triggers=page.locator('.vet-case [data-zoom-trigger]:visible');
  for(let i=0;i<await triggers.count();i++) {
    const trigger=triggers.nth(i);
    const expected=await trigger.evaluate(e=>e.dataset.zoomFixed?e.dataset.zoomSrc:new URL(e.querySelector('img').currentSrc).pathname);
    await trigger.focus();await page.keyboard.press('Enter');await page.locator('[data-media-zoom][open]').waitFor();
    const src=await page.locator('[data-media-zoom-image]').evaluate(async i=>{await i.decode();return new URL(i.src).pathname;});
    test(`Keyboard zoom ${i} opens actual source`,src===expected);
    await page.keyboard.press('Tab');
    test(`Zoom ${i} contains keyboard focus`,await page.evaluate(()=>!!document.activeElement.closest('[data-media-zoom]')));
    if(i<2&&[1440,390,320].includes(width)) await page.screenshot({path:`${root}/browser-qa/${name}-zoom-${i}.png`});
    await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('[data-media-zoom]').open);
    test(`Zoom ${i} Escape restores focus`,await trigger.evaluate(e=>document.activeElement===e));
  }
  await page.locator('.vet-cover [data-zoom-trigger]').first().click();
  test('Pointer zoom opens dialog',await page.locator('[data-media-zoom]').evaluate(d=>d.open));
  await page.locator('[data-media-zoom-close]').click();
  await page.waitForFunction(()=>!document.querySelector('[data-media-zoom]').open&&!document.querySelector('[data-media-zoom-image]').hasAttribute('src'));
  const focus=page.locator('.vet-cover .vet-shot__full:visible').first();await page.keyboard.press('Tab');await focus.focus();
  const focusGeometry=await focus.evaluate(e=>({outline:getComputedStyle(e).outlineStyle,height:e.getBoundingClientRect().height,visible:e.matches(':focus-visible')}));
  test('Inspection link has visible keyboard focus and 48px target',focusGeometry.outline!=='none'&&focusGeometry.visible&&focusGeometry.height>=47.9,focusGeometry);
  if([1440,390].includes(width)) await page.screenshot({path:`${root}/browser-qa/${name}-focus.png`});
  if(width===1440) {
    await focus.hover();await page.waitForTimeout(300);await page.screenshot({path:`${root}/browser-qa/${name}-hover.png`});
    await page.mouse.down();await page.screenshot({path:`${root}/browser-qa/${name}-pressed.png`});
    test('Inspection pressed state has a visible underline',await focus.evaluate(e=>getComputedStyle(e).textDecorationLine.includes('underline')));
    await page.mouse.up();await page.locator('[data-media-zoom][open]').waitFor();await page.keyboard.press('Escape');
    await page.waitForFunction(()=>!document.querySelector('[data-media-zoom]').open&&!document.querySelector('[data-media-zoom-image]').hasAttribute('src'));
    test('Inspection target is an ordinary resolvable source href',(await page.request.get(base+await focus.getAttribute('href'))).ok());
  }
  const cta=page.locator('.vet-outcome a');
  test('Product CTA has locale and safe new-tab behavior',(await cta.getAttribute('href'))===`https://veterinary-clinic-gules.vercel.app/${locale==='ru'?'ru/':''}`&&await cta.getAttribute('target')==='_blank'&&(await cta.getAttribute('rel')).includes('noopener'));
  test('CaseNext retains Pawly destination',await page.locator('.case-next a[href*="/work/pawly"]').count()>0);
  const other=locale==='en'?'ru':'en';
  const otherPath=(other==='ru'?'/ru':'')+'/work/vet-clinic';
  if(await page.locator('[data-navbar-trigger]').isVisible())await page.locator('[data-navbar-trigger]').click();
  await page.locator(`[data-navbar] a[href="${otherPath}"]:visible, [data-navbar] a[href="${otherPath}/"]:visible`).click();
  await page.waitForFunction(lang=>document.documentElement.lang===lang,other);
  test('Language toggle opens the paired Vet case',new URL(page.url()).pathname.replace(/\/$/,'')===otherPath&&await page.locator('[data-vet-version="premium-v3"]').count()===1);
  await page.goto(base+route,{waitUntil:'networkidle'});await settle(page);
  await page.addScriptTag({content:axe.source});
  const accessibility=await page.evaluate(async()=>await window.axe.run('.vet-case',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
  entry.axe=accessibility.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}));
  test('No automated WCAG A/AA findings in the case',entry.axe.length===0,entry.axe);
  test('No runtime errors or failed assets',!entry.errors.length&&!entry.failedAssets.length,{errors:entry.errors,assets:entry.failedAssets});
  results.push(entry);console.log(name,entry.tests.filter(t=>t.pass).length+'/'+entry.tests.length);await page.close();
}
// Distinct fallbacks and motion preferences.
for(const locale of ['en','ru']) for(const mode of ['no-js','motion','zoom-200-equivalent']) {
  const entry={name:`${locale}-${mode}`,tests:[]};const test=(label,pass)=>entry.tests.push({label,pass:!!pass});
  const page=await browser.newPage({viewport:mode==='zoom-200-equivalent'?{width:720,height:450}:{width:390,height:900},deviceScaleFactor:mode==='zoom-200-equivalent'?2:1,javaScriptEnabled:mode!=='no-js',reducedMotion:mode==='motion'?'no-preference':'reduce'});
  await page.goto(base+(locale==='ru'?'/ru':'')+'/work/vet-clinic',{waitUntil:'networkidle'});
  if(mode!=='no-js')await settle(page);
  test('All chapters present and no overflow',await page.locator('.vet-sheet h2').count()===9&&await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  if(mode==='no-js') {
    test('Content remains visible without JavaScript',await page.locator('#vet-title').evaluate(e=>getComputedStyle(e).opacity==='1'));
    const links=await page.locator('.vet-shot__full:visible').evaluateAll(as=>as.map(a=>a.getAttribute('href')));
    for(const href of links)test(`Source fallback ${href}`,(await page.request.get(base+href)).ok());
    await page.locator('a[href="#publication"]').click();test('Anchor works without JS',page.url().endsWith('#publication'));
  } else if(mode==='motion') {
    for(let y=0;y<await page.evaluate(()=>document.documentElement.scrollHeight);y+=700){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(25);}
    await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(1600);
    test('Registered hero motion completes visibly',await page.locator('#vet-title').evaluate(e=>getComputedStyle(e).opacity==='1'));
  }
  await page.screenshot({path:`${root}/browser-qa/${entry.name}.png`,fullPage:mode!=='zoom-200-equivalent'});results.push(entry);await page.close();
}
await browser.close();
fs.writeFileSync(`${root}/browser-qa/results.json`,JSON.stringify(results,null,2));
const all=results.flatMap(r=>r.tests);console.log(`${all.filter(t=>t.pass).length}/${all.length} browser assertions`);if(all.some(t=>!t.pass))process.exitCode=1;
