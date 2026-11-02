import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const {chromium}=require('playwright'),axe=require('axe-core');
const root='audit/vet-portfolio-premium-v3/v3.1';
const tests=[];
function check(name,pass,detail){tests.push({name,pass:!!pass,detail});if(!pass)console.log('FAIL',name,JSON.stringify(detail));}
const browser=await chromium.launch();
for(const locale of ['en','ru']) for(const width of [1440,390,320]) {
 const context=await browser.newContext({viewport:{width,height:900},isMobile:width<768,hasTouch:width<768,reducedMotion:'reduce'});
 const page=await context.newPage(),tag=`${locale}-${width}`;
 const base=`http://127.0.0.1:5391/${locale==='ru'?'ru/':''}`;
 await page.goto(base+'work/vet-clinic',{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready);
 const links=page.locator('#process .ds-link,#outcome .ds-link');
 check(`${tag} four Vet links`,await links.count()===4);
 for(let i=0;i<await links.count();i++) {
  const a=links.nth(i);await a.scrollIntoViewIfNeeded();
  const b=await a.boundingBox();
  check(`${tag} link ${i} 48px target`,b.height>=48,b);
  const points=await a.evaluate(a=>{const r=a.getBoundingClientRect(),i=a.querySelector('svg').getBoundingClientRect();return [[r.x+r.width/2,r.y+2],[r.x+r.width/2,r.bottom-2],[i.x+i.width/2,i.y+i.height/2]].map(([x,y])=>a.contains(document.elementFromPoint(x,y)));});
  check(`${tag} link ${i} whole target and SVG clickable`,points.every(Boolean),points);
  await a.focus();await page.keyboard.press('Shift+Tab');await page.keyboard.press('Tab');
  check(`${tag} link ${i} keyboard focus`,await a.evaluate(a=>a===document.activeElement&&a.matches(':focus-visible')&&getComputedStyle(a).outlineStyle!=='none'&&parseFloat(getComputedStyle(a).outlineWidth)>0));
  // Exercise both activation methods, including the final CTA, without editing the external product.
  const expected=await a.getAttribute('href');
  const popupPromise=page.waitForEvent('popup');
  if(i===3)await page.keyboard.press('Enter');else if(width<768)await page.touchscreen.tap(b.x+b.width/2,b.y+2);else await page.mouse.click(b.x+b.width/2,b.y+2);
  const popup=await popupPromise;
  try {await popup.waitForLoadState('domcontentloaded',{timeout:25000});}catch{}
  check(`${tag} link ${i} real popup URL`,popup.url()===expected||popup.url().replace(/\/$/,'')===expected.replace(/\/$/,''),{expected,actual:popup.url()});
  if(i===3) {
   const index=await popup.locator('body').innerText({timeout:10000}).catch(()=> '');
   check(`${tag} prototype renders product index`,/Product screens|Экраны продукта/.test(index),{url:popup.url(),excerpt:index.slice(0,180)});
  }
  await popup.close();
 }
 if(width<768) {
  check(`${tag} real touch media`,await page.evaluate(()=>!matchMedia('(hover: hover)').matches&&matchMedia('(pointer: coarse)').matches));
  const a=links.first();await a.tap();
  // Close the popup produced by a normal tap as well as the earlier padding taps.
  for(const p of context.pages())if(p!==page)await p.close();
  check(`${tag} touch does not translate arrow`,await a.evaluate(a=>getComputedStyle(a.querySelector('svg')).transform==='none'));
 }
 // Verify actual mobile nav through its trigger, then restore page state.
 await page.goto(base,{waitUntil:'networkidle'});
 if(width<768) {
  await page.locator('[data-navbar-trigger]').click();
  const nav=page.locator('#navbar-panel a.ds-link').first();
  check(`${tag} menu nav 48px`,(await nav.boundingBox()).height>=48);
  await nav.focus();await page.keyboard.press('Shift+Tab');await page.keyboard.press('Tab');
  check(`${tag} menu nav keyboard`,await nav.evaluate(a=>a===document.activeElement&&a.matches(':focus-visible')));
  await page.keyboard.press('Escape');
  check(`${tag} Escape closes menu`,await page.locator('[data-navbar-trigger]').getAttribute('aria-expanded')==='false');
 }
 // Audit every affected public page; keep link-specific WCAG findings actionable.
 for(const route of ['','work/agent-ops-console','work/partner-portal','work/learn','work/vet-clinic','work/pawly']) {
  await page.goto(base+route,{waitUntil:'networkidle'});
  await page.addScriptTag({content:axe.source});
  const result=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,html:n.html,summary:n.failureSummary}))}));});
  check(`${tag} ${route||'Home'} axe links`,!result.some(v=>v.nodes.some(n=>n.html.includes('ds-link'))),result);
  fs.mkdirSync(`${root}/browser-qa`,{recursive:true});
  fs.writeFileSync(`${root}/browser-qa/${tag}-${route.split('/').at(-1)||'home'}-axe.json`,JSON.stringify(result,null,2));
 }
 await context.close();console.log('browser QA',tag,'complete');
 fs.writeFileSync(`${root}/browser-qa/tests.json`,JSON.stringify(tests,null,2));
}
// Shared variants not currently exposed in a public case remain covered in /kit.
const page=await browser.newPage({viewport:{width:320,height:900},reducedMotion:'reduce'});
await page.goto('http://127.0.0.1:5391/kit',{waitUntil:'networkidle'});
for(const selector of ['.ds-link--inline','.ds-link--nav:has(svg)','.ds-link--arrow:has(.ds-link__arrow)']) {
 const a=page.locator(selector).first();await a.scrollIntoViewIfNeeded();
 check(`kit ${selector} accessible link`,await a.getAttribute('href')!==null);
 const decoration=await a.locator('.ds-link__label').evaluate(e=>getComputedStyle(e).textDecorationLine);
 check(`kit ${selector} intended underline`,selector.includes('--inline')?decoration==='underline':decoration==='none',decoration);
 await a.focus();await page.keyboard.press('Shift+Tab');await page.keyboard.press('Tab');
 check(`kit ${selector} keyboard focus`,await a.evaluate(a=>a===document.activeElement&&a.matches(':focus-visible')));
}
await browser.close();
fs.writeFileSync(`${root}/browser-qa/tests.json`,JSON.stringify(tests,null,2));
console.log(`${tests.filter(t=>t.pass).length}/${tests.length} browser checks passed`);
if(tests.some(t=>!t.pass))process.exitCode=1;
