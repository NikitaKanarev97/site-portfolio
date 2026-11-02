import {launch,root,base,routes,json,settled,shot,watch} from './common.mjs';
const phase=process.argv[2]??'before',engine=process.argv[3]??'chromium';
const checks=[],issues=[];let browser;
const check=(name,pass,data)=>{checks.push({name,pass:!!pass,data});if(!pass)console.log('FAIL',name,JSON.stringify(data));};
try{browser=await launch(engine);}catch(e){await json(`${root}/logs/${phase}-${engine}-interactions-unavailable.json`,{error:e.message});process.exit(2);}
async function go(page,path){await page.goto(base+path,{waitUntil:'networkidle'});await settled(page);}
async function trap(page,dialog){for(let i=0;i<7;i++){await page.keyboard.press('Tab');if(!await dialog.evaluate(e=>e.contains(document.activeElement)))return false;}await page.keyboard.press('Shift+Tab');return dialog.evaluate(e=>e.contains(document.activeElement));}
for(const locale of ['en','ru'])for(const width of [1440,390]){
 const prefix=locale==='ru'?'/ru':'',context=await browser.newContext({viewport:{width,height:width<768?844:900},hasTouch:width<768}),page=await context.newPage(),events=watch(page);
 try{
  for(const route of routes){
   const path=prefix+route;await go(page,path);
   check(`${locale}-${width} ${route} normal entrance`,await page.locator('body').evaluate(e=>getComputedStyle(e).opacity==='1'));
   if(width===390){const menu=page.locator('[data-navbar-trigger]');await menu.click();check(`${path} mobile menu open`,await menu.getAttribute('aria-expanded')==='true');check(`${path} menu focus contained`,await trap(page,page.locator('[data-navbar]')));await page.keyboard.press('Escape');check(`${path} menu close unlock`,!await page.locator('body').evaluate(e=>e.classList.contains('ds-scroll-locked')));check(`${path} menu focus return`,await menu.evaluate(e=>e===document.activeElement));}
   const targets=page.locator('[data-zoom-trigger]');
   for(let i=0;i<await targets.count();i++){
    const trigger=targets.nth(i);if(!await trigger.isVisible())continue;
    await trigger.scrollIntoViewIfNeeded();await trigger.focus();const expected=await trigger.evaluate(e=>e.dataset.zoomFixed?e.dataset.zoomSrc:e.querySelector('img')?.currentSrc||e.dataset.zoomSrc);await page.keyboard.press('Enter');const dialog=page.locator('[data-media-zoom]');await dialog.waitFor({state:'visible'});
    await page.waitForFunction(()=>{const i=document.querySelector('[data-media-zoom-image]');return i.complete&&i.naturalWidth>0;});
    const actual=await page.locator('[data-media-zoom-image]').getAttribute('src');check(`${path} zoom ${i} source`,new URL(actual,base).href===new URL(expected,base).href,{actual,expected});
    check(`${path} zoom ${i} keyboard trap`,await trap(page,dialog));await page.keyboard.press('Escape');await page.waitForTimeout(60);check(`${path} zoom ${i} restore`,await trigger.evaluate(e=>e===document.activeElement)&&!await page.locator('body').evaluate(e=>e.classList.contains('ds-scroll-locked')));
   }
   const details=page.locator('main details');for(let i=0;i<await details.count();i++){const d=details.nth(i);if(!await d.isVisible())continue;await d.locator('summary').focus();await page.keyboard.press('Enter');check(`${path} details ${i} opens`,await d.evaluate(e=>e.open));await page.keyboard.press('Enter');check(`${path} details ${i} closes`,!await d.evaluate(e=>e.open));}
   const anchors=page.locator('main a[href^="#"]');for(let i=0;i<Math.min(3,await anchors.count());i++){const a=anchors.nth(i);if(!await a.isVisible())continue;const href=await a.getAttribute('href');if(href==='#')continue;await a.click();await page.waitForTimeout(180);check(`${path} anchor ${href}`,await page.evaluate(h=>location.hash===h&&!!document.getElementById(h.slice(1)),href));}
   await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(180);check(`${path} live reduce visible`,await page.locator('[data-motion]').evaluateAll(es=>es.filter(e=>e.getClientRects().length).every(e=>getComputedStyle(e).opacity==='1')));await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(300);
   if(route.startsWith('/work/')){const next=page.locator('a[data-case-next]').first();if(await next.count()){const href=await next.getAttribute('href');await next.click();await page.waitForURL(u=>u.pathname.replace(/\/$/,'')===new URL(href,base).pathname.replace(/\/$/,''));await settled(page);check(`${path} next keeps locale`,page.url().includes(prefix+'/work/'));await page.goBack();await settled(page);check(`${path} Back route`,new URL(page.url()).pathname.replace(/\/$/,'')===path.replace(/\/$/,''));}}
  }
  await go(page,prefix+'/');const copy=page.locator('[data-copy-trigger]').first();await page.evaluate(()=>{window.__qaCopied=null;Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.__qaCopied=text;}}});});await copy.click();check(`${locale}-${width} copy success`,await copy.getAttribute('data-state')==='copied'&&await page.evaluate(()=>!!window.__qaCopied));
  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new Error('fixture: clipboard denied');}}}));await copy.click();check(`${locale}-${width} copy failure fallback`,await page.locator('[data-copy-failure]').first().isVisible());
  const open=page.locator('[data-dialog-open]').first();await open.scrollIntoViewIfNeeded();await open.focus();await page.keyboard.press('Enter');const project=page.locator('[data-project-dialog][open]');await project.waitFor({state:'visible'});check(`${locale}-${width} project dialog trap`,await trap(page,project));await page.keyboard.press('Escape');check(`${locale}-${width} project dialog returns focus`,await open.evaluate(e=>e===document.activeElement));
  const first=page.locator('[data-case-card] a').first();await first.scrollIntoViewIfNeeded();const scroll=await page.evaluate(()=>scrollY);await first.click();await settled(page);await page.goBack();await settled(page);check(`${locale}-${width} Home history restoration`,Math.abs(await page.evaluate(()=>scrollY)-scroll)<5,{before:scroll,after:await page.evaluate(()=>scrollY)});
  if(width===390)await page.locator('[data-navbar-trigger]').click();
  const alternate=page.locator(`.navbar__locale a`).filter({hasText:locale==='en'?'RU':'EN'}).filter({visible:true}).first();if(await alternate.count()){await alternate.click();await settled(page);check(`${locale}-${width} locale navigation`,await page.locator('html').getAttribute('lang')===(locale==='en'?'ru':'en'));}else check(`${locale}-${width} locale navigation exists`,false);
  check(`${locale}-${width} no runtime or HTTP errors`,!events.errors.length&&!events.failed.length,events);
 }catch(e){issues.push({locale,width,error:e.message,stack:e.stack});console.log('EXCEPTION',locale,width,e.message);}
 await context.close();await json(`${root}/logs/${phase}-${engine}-interactions.json`,{checks,issues});
}
// Every public route remains readable and usable without a bundle.
for(const javaScriptEnabled of [false,true]){
 const context=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled});
 if(javaScriptEnabled)await context.route('**/_astro/*.js',r=>r.abort());
 for(const locale of ['en','ru'])for(const route of routes){const page=await context.newPage();try{await page.goto(base+(locale==='ru'?'/ru':'')+route,{waitUntil:'networkidle'});await page.waitForTimeout(javaScriptEnabled?2200:50);const state=await page.evaluate(()=>({hidden:[...document.querySelectorAll('main [data-motion]')].filter(e=>e.getClientRects().length&&getComputedStyle(e).opacity==='0').length,h1:document.querySelectorAll('h1').length,links:[...document.querySelectorAll('[data-zoom-trigger]')].every(e=>e.href),overflow:document.documentElement.scrollWidth-innerWidth}));check(`${locale} ${route} ${javaScriptEnabled?'blocked JS':'no JS'}`,state.hidden===0&&state.h1===1&&state.links&&state.overflow===0,state);}catch(e){issues.push({route,javaScriptEnabled,error:e.message});}await page.close();}await context.close();
}
await browser.close();await json(`${root}/logs/${phase}-${engine}-interactions.json`,{checks,issues});console.log('TOTAL',checks.length,'FAIL',checks.filter(c=>!c.pass).length,'EXCEPTIONS',issues.length);if(issues.length||checks.some(c=>!c.pass))process.exitCode=1;
