/** Public EN/RU route acceptance: real section gaps, localized Learn sources,
 * keyboard skip navigation and pointer/history navigation. Fresh page per route.
 * Usage: node scripts/verify-site-rhythm.mjs [origin] [width CSV]
 */
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium,webkit}=createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright');
const engine=process.env.SPACING_BROWSER==='webkit'?webkit:chromium;
const origin=process.argv[2]??'http://127.0.0.1:4475';
const widths=(process.argv[3]??'360,390,768,820,1024,1440').split(',').map(Number);
const label=origin.includes('127.0.0.1')?'local':'production';
const dir=`tmp/site-rhythm/${label}-${engine.name()}`;await mkdir(dir,{recursive:true});
const browser=await engine.launch(engine===chromium?{executablePath:process.env.HARMONY_CHROME??'C:/Program Files/Google/Chrome/Application/chrome.exe'}:{});
const report={origin,engine:engine.name(),widths,pages:[],focus:[],errors:[]};
const routes=['/','/about/',...['agent-ops-console','partner-portal','learn','vet-clinic','pawly'].map(s=>`/work/${s}/`)];
try{
 for(const width of widths)for(const locale of ['en','ru'])for(const route of routes){
  const path=(locale==='ru'?'/ru':'')+route;
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
  page.on('pageerror',e=>report.errors.push({path,width,message:e.message}));
  const response=await page.goto(origin+path,{waitUntil:'load',timeout:30000});
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));});
  const result=await page.evaluate(()=>{
   const problems=[];const expected=innerWidth>=1024?128:96;const close=(a,b)=>Math.abs(a-b)<1;
   const visible=n=>n.getBoundingClientRect().height>0&&getComputedStyle(n).position!=='absolute';
   const groups=[document.querySelector('main'),document.querySelector('.featured__list'),document.querySelector('.case-sheet')].filter(Boolean);
   const pairs=groups.flatMap(group=>[...group.children].filter(visible).flatMap((node,i,nodes)=>{
    if(i===0)return[];const previous=nodes[i-1];const gap=node.getBoundingClientRect().top-previous.getBoundingClientRect().bottom;
    if(!close(gap,expected))problems.push(`Section gap ${gap} expected ${expected}: ${node.className}`);
    return[{from:previous.className,to:node.className,gap}];
   }));
   const broken=[...document.images].filter(i=>i.getAttribute('src')&&!i.naturalWidth).map(i=>i.getAttribute('src'));if(broken.length)problems.push(...broken.map(s=>'Broken image '+s));
   if(document.documentElement.scrollWidth>innerWidth+1)problems.push('Horizontal overflow');
   const sources=[...document.querySelectorAll('.learn-stage img')].map(i=>i.currentSrc);
   const ru=document.documentElement.lang==='ru';
   if(sources.some(src=>!src.includes(`/art-direction/learn${ru?'-ru':''}/`)))problems.push('Learn image locale');
   const storySources=[...document.querySelectorAll('.case-story--learn img')].map(i=>i.currentSrc);
   if(ru&&storySources.some(src=>src.includes('/rebuild/learn/')&&!src.endsWith('/archive-catalog.webp')))problems.push('Learn case image locale');
   const firstCase=document.querySelector('.featured__list');
   const gapToWorks=firstCase?document.querySelector('.featured').getBoundingClientRect().top-document.querySelector('.hero').getBoundingClientRect().bottom:null;
   const eyebrowGap=firstCase?firstCase.getBoundingClientRect().top-firstCase.previousElementSibling.getBoundingClientRect().bottom:null;
   if(eyebrowGap!==null&&!close(eyebrowGap,32))problems.push('Eyebrow/list gap');
   const skip=document.querySelector('.ds-skip-link');if(skip.getBoundingClientRect().bottom>0)problems.push('Skip link visible on entry');
   return{expected,pairs,gapToWorks,eyebrowGap,sources,storySources,problems};
  });
  report.pages.push({path,width,status:response?.status(),...result});
  assert.equal(response?.status(),200,path);assert.deepEqual(result.problems,[],`${width} ${path}`);
  if(process.env.RHYTHM_SHOTS==='1'&&[390,820,1440].includes(width)){
   await page.screenshot({path:`${dir}/${locale}-${route.replaceAll('/','-')||'home'}-${width}.png`,fullPage:true,animations:'disabled'});
   if(route==='/'){
    const y=await page.locator('.featured').evaluate(n=>n.getBoundingClientRect().top+scrollY-250);
    await page.evaluate(y=>scrollTo(0,y),y);
    await page.screenshot({path:`${dir}/hero-work-${locale}-${width}.png`,animations:'disabled'});
    await page.locator('#work-learn').screenshot({path:`${dir}/learn-${locale}-${width}.png`,animations:'disabled'});
   }
  }
  await page.close();
 }
 for(const width of [390,820,1440]){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
  await page.goto(origin+'/ru/');
  const skip=page.locator('.ds-skip-link');
  const visible=()=>skip.evaluate(n=>n.getBoundingClientRect().bottom>0);
  // Headless WebKit has Safari's controls-only Tab preference. Exercise the
  // same keyboard activation after focusing the link; Chromium tests real Tab.
  await page.keyboard.press('Tab');
  if(engine===webkit)await skip.focus();
  await page.waitForFunction(()=>document.querySelector('.ds-skip-link').getBoundingClientRect().bottom>0);
  assert(await visible(),'First keyboard link must be visible');
  assert(await skip.evaluate(n=>n===document.activeElement&&n.matches(':focus-visible')));
  await page.keyboard.press('Enter');await page.waitForTimeout(300);
  assert.equal(await page.evaluate(()=>document.activeElement.id),'main','Skip activation focuses main');
  assert(!(await visible()),'Skip hidden after activation');
  await page.goto(origin+'/ru/');await page.keyboard.press('Tab');
  if(engine===webkit)await skip.focus();
  await page.waitForFunction(()=>document.querySelector('.ds-skip-link').getBoundingClientRect().bottom>0);
  await page.mouse.click(width-30,220);
  await page.waitForFunction(()=>document.querySelector('.ds-skip-link').getBoundingClientRect().bottom<=0);
  assert(!(await visible()),'Skip hidden after pointer click');
  if(width<768){await page.locator('[data-navbar-trigger]').click();await page.locator('.navbar__panel a[href="/ru/about"]').click();}
  else await page.locator('.navbar__desktop a[href="/ru/about"]').click();
  await page.waitForURL('**/ru/about');assert(!(await visible()),'Skip hidden after pointer navigation');
  await page.goBack();await page.waitForTimeout(300);assert(!(await visible()),'Skip hidden on history back');
  await page.reload();assert(!(await visible()),'Skip hidden on reload');
  report.focus.push({width,keyboardReveal:true,mainFocused:true,pointerHidden:true,navigationHidden:true,historyHidden:true,reloadHidden:true});
  await page.close();
 }
}finally{await browser.close();await writeFile(`${dir}/report.json`,JSON.stringify(report,null,2));}
assert.deepEqual(report.errors,[]);
console.log(JSON.stringify({pages:report.pages.length,focus:report.focus,errors:report.errors}));
