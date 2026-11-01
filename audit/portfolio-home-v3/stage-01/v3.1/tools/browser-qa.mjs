import { createRequire } from 'node:module';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const require = createRequire(`${process.env.PLAYWRIGHT_REPO ?? 'D:/Claude-projects/b2b-dssl'}/package.json`);
const { chromium } = require('playwright');
const origin = process.env.PORTFOLIO_ORIGIN ?? 'http://127.0.0.1:4412';
const dir = 'audit/portfolio-home-v3/stage-01/v3.1';
await mkdir(`${dir}/screenshots/states`, { recursive:true });
const browser = await chromium.launch({headless:true});
const results = [], issues = [];
async function check(name, fn) { console.log('START',name); try { const evidence = await fn(); results.push({name,pass:true,evidence}); console.log('PASS',name); } catch(e) { results.push({name,pass:false,error:e.message}); issues.push(name); console.log('FAIL',name,e.message); } await writeFile(`${dir}/logs/browser-qa-progress.json`,JSON.stringify({results,issues},null,2)); }
const axe = await readFile(require.resolve('axe-core/axe.js'), 'utf8');
try {
 for(const locale of ['en','ru']) for(const width of [1440,1024,390,360]) {
  const prefix = `${locale}-${width}`;
  const context = await browser.newContext({viewport:{width,height:width>=1024?900:width===390?844:800},deviceScaleFactor:1,reducedMotion:'reduce',permissions:['clipboard-read','clipboard-write']});
  context.setDefaultTimeout(8000); context.setDefaultNavigationTimeout(12000);
  const page = await context.newPage();
  const home = `${origin}${locale==='ru'?'/ru/':'/'}`;
  await page.goto(home,{waitUntil:'networkidle'});
  await check(`${prefix} axe WCAG A/AA`,async()=>{
   await page.addScriptTag({content:axe});
   const audit = await page.evaluate(()=>axe.run(document,{iframes:false,runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','best-practice']}}));
   await writeFile(`${dir}/logs/axe-${prefix}.json`,JSON.stringify({violations:audit.violations,incomplete:audit.incomplete,passes:audit.passes.map(x=>x.id)},null,2));
   assert.equal(audit.violations.length,0,JSON.stringify(audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))));
   return {violations:0,passes:audit.passes.length,manualReview:audit.incomplete.length};
  });
  await check(`${prefix} primary work anchor`,async()=>{ await page.locator('.hero__work-link').click(); await page.waitForFunction(()=>location.hash==='#work'); assert(await page.locator('#work').evaluate(e=>Math.abs(e.getBoundingClientRect().top)<5)); return page.url(); });
  await check(`${prefix} CV and internal destinations`,async()=>{
   const links=await page.locator('a').evaluateAll(nodes=>[...new Set(nodes.map(a=>a.getAttribute('href')).filter(h=>h?.startsWith('/')&&!h.startsWith('//')))]);
   for(const href of links) { const r=await context.request.get(new URL(href,origin).href,{timeout:8000}); assert(r.ok(),`${href}: ${r.status()}`); if(href.endsWith('.pdf')) assert((await r.body()).subarray(0,4).toString()==='%PDF'); }
   return links;
  });
  await check(`${prefix} email keyboard copy`,async()=>{
   const button=page.locator('[data-copy-trigger]').first(); await button.focus(); await page.keyboard.press('Enter'); await page.waitForFunction(()=>document.querySelector('[data-copy-trigger]').dataset.state==='copied');
   const copied=await page.evaluate(()=>navigator.clipboard.readText()); assert.equal(copied,await button.getAttribute('data-email')); assert(await page.locator('[data-copy-status]').first().innerText()); return copied;
  });
  await check(`${prefix} all four dialogs / keyboard and focus return`,async()=>{
   for(const trigger of await page.locator('[data-dialog-open]').all()) {
    const id=await trigger.getAttribute('data-dialog-open'); await trigger.focus(); await page.keyboard.press('Enter'); await page.waitForFunction(id=>document.getElementById(id)?.open,id);
    assert(await page.locator(`#${id}`).evaluate(e=>e.contains(document.activeElement)));
    assert(await page.locator(`#${id} a[href]`).count());
    // Native top-layer focus must stay inside the dialog over repeated Tabs.
    for(let i=0;i<6;i++) {await page.keyboard.press('Tab'); assert(await page.locator(`#${id}`).evaluate(e=>document.activeElement===document.body||e.contains(document.activeElement)),'Tab must not reach a background control (Chromium may focus browser chrome/body between cycles)');}
    if(width===390) await page.locator(`#${id}`).screenshot({path:`${dir}/screenshots/states/${locale}-${id}.png`});
    await page.keyboard.press('Escape'); assert(!(await page.locator(`#${id}`).evaluate(e=>e.open))); assert(await trigger.evaluate(e=>document.activeElement===e));
   }
   return {dialogs:4,openedBy:'Enter',closedBy:'Escape',focusRestored:true};
  });
  if(width<768) await check(`${prefix} mobile menu focus trap / Space / Escape`,async()=>{
   const toggle=page.locator('[data-navbar-trigger]'); await toggle.focus(); await page.keyboard.press('Space'); await page.waitForFunction(()=>document.querySelector('[data-navbar-trigger]').getAttribute('aria-expanded')==='true');
   const last=page.locator('[data-navbar-panel] a').last(); await last.focus(); await page.keyboard.press('Tab'); assert(await toggle.evaluate(e=>document.activeElement===e));
   await page.keyboard.press('Shift+Tab'); assert(await last.evaluate(e=>document.activeElement===e));
   await page.screenshot({path:`${dir}/screenshots/states/${prefix}-menu.png`});
   await page.keyboard.press('Escape'); assert(await toggle.evaluate(e=>document.activeElement===e)); assert.equal(await toggle.getAttribute('aria-expanded'),'false');
   assert((await toggle.boundingBox()).height>=44); return {trap:true,targetHeight:(await toggle.boundingBox()).height};
  });
  await check(`${prefix} five live case transitions and About`,async()=>{
   await page.goto(home,{waitUntil:'networkidle'});
   const paths=await page.locator('[data-case-card] h2 a').evaluateAll(a=>a.map(e=>e.getAttribute('href')));
   assert.equal(paths.length,5);
   for(const href of [...paths,locale==='ru'?'/ru/about':'/about']) {
    await page.goto(home,{waitUntil:'networkidle'});
    const link=page.locator(`a[href="${href}"]`).filter({visible:true}).first(); await link.click(); await page.waitForURL(u=>u.pathname.replace(/\/$/,'')===href.replace(/\/$/,'')); await page.waitForLoadState('networkidle'); assert(await page.locator('h1').isVisible());
    if(href===paths[0]) {
     const zoom=page.locator('[data-zoom-trigger]').filter({visible:true}).first(); await zoom.focus(); await page.keyboard.press('Enter'); await page.waitForFunction(()=>document.querySelector('[data-media-zoom]')?.open); await page.keyboard.press('Escape'); assert(await zoom.evaluate(e=>document.activeElement===e));
    }
   }
   await page.goto(home,{waitUntil:'networkidle'});
   const other=locale==='en'?'/ru/':'/';
   // A mobile language switch is inside the existing menu.
   if(width<768) await page.locator('[data-navbar-trigger]').click();
   await page.locator(`.navbar a[href="${other}"]`).filter({visible:true}).first().click(); await page.waitForFunction(l=>document.documentElement.lang===l,locale==='en'?'ru':'en');
   return {cases:paths,about:true,languageSwitch:true};
  });
  await context.close();
 }
 await check('normal motion, reduced motion, no-JS and slow image layout',async()=>{
  const evidence=[];
  for(const locale of ['en','ru']) for(const mode of ['normal','reduced','no-js','slow-images','broken-image']) {
   const c=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:mode!=='no-js',reducedMotion:mode==='normal'?'no-preference':'reduce'});
   const p=await c.newPage();
   const errors=[];p.on('pageerror',e=>errors.push(e.message));
   if(mode==='slow-images') await p.route('**/media/**',async route=>{await new Promise(r=>setTimeout(r,600)); await route.continue();});
   if(mode==='broken-image') await p.route('**/approval-consequences-mobile.webp',r=>r.abort());
   if(mode!=='no-js') await p.addInitScript(()=>{window.__layout=[];new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__layout.push({value:e.value,sources:e.sources?.map(x=>x.node?.tagName)});}).observe({type:'layout-shift',buffered:true});});
   await p.goto(origin+(locale==='ru'?'/ru/':'/'),{waitUntil:'domcontentloaded'});
   if(mode!=='no-js') await p.evaluate(()=>document.fonts.ready);
   const first=await p.locator('.agent-home img').boundingBox(); await p.waitForLoadState('networkidle'); await p.waitForTimeout(1300);
   assert(await p.locator('h1').isVisible()); assert.equal(await p.locator('[data-case-card]').count(),5);
   assert(await p.locator('.hero__work-link').isVisible());
   const last=await p.locator('.agent-home img').boundingBox();
   const shifts=mode==='no-js'?null:await p.evaluate(()=>window.__layout);
   assert.equal(errors.length,0,errors.join('\n'));
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   // Image geometry must be reserved. Record document Y separately: existing
   // progressive mobile navigation collapses its no-JS fallback on hydration.
   if(mode==='slow-images') {assert(Math.abs(last.width-first.width)<2);assert(Math.abs(last.height-first.height)<2);}
   if(mode==='broken-image') {assert(await p.locator('.agent-home img').getAttribute('alt'));assert(await p.locator('.agent-home img').evaluate(i=>i.width>0&&i.height>0));}
   await p.screenshot({path:`${dir}/screenshots/states/${locale}-${mode}.png`});
   evidence.push({locale,mode,first,last,shifts,errors}); await c.close();
  }
  return evidence;
 });
 await check('copy failure keeps selectable email and announces fallback',async()=>{
  const p=await browser.newPage(); await p.goto(origin,{waitUntil:'networkidle'}); await p.evaluate(()=>{navigator.clipboard.writeText=async()=>{throw new Error('permission denied for test');};}); await p.locator('[data-copy-trigger]').click(); await p.locator('[data-copy-failure]').waitFor({state:'visible'}); assert(await p.locator('[data-copy-hint]').innerText()); assert(await p.locator('[data-copy-status]').innerText()); await p.close(); return true;
 });
} finally {await browser.close();await writeFile(`${dir}/logs/browser-qa.json`,JSON.stringify({origin,results,issues},null,2));}
console.log(JSON.stringify(results.map(({name,pass,error})=>({name,pass,error})),null,2));
if(issues.length)process.exitCode=1;

