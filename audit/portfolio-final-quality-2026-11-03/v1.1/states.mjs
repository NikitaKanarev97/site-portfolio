import {launch,base,settled,watch} from '../common.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
const engine=process.argv[2]??'chromium',browser=await launch(engine);
const root=new URL('./',import.meta.url).pathname.replace(/^\/([A-Z]:)/,'$1');
const checks=[],issues=[];
const check=(name,pass,data)=>{checks.push({name,pass:!!pass,data});console.log(pass?'PASS':'FAIL',name,pass?'':JSON.stringify(data));};
const luminance=rgb=>rgb.match(/[\d.]+/g).slice(0,3).map(Number).map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4;}).reduce((s,x,i)=>s+x*[.2126,.7152,.0722][i],0);
const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
const surfaces={agent:'rgb(247, 247, 245)',portal:'rgb(237, 242, 248)'};
const path=url=>new URL(url).pathname.replace(/\/$/,'');
for(const locale of ['en','ru'])for(const width of [1440,390,360]){
 if(process.env.QA_ID&&process.env.QA_ID!==`${locale}-${width}`)continue;
 const id=`${engine} ${locale}-${width}`,prefix=locale==='ru'?'/ru':'';
 const ctx=await browser.newContext({viewport:{width,height:width===1440?900:844}}),p=await ctx.newPage(),runtime=watch(p);
 await p.addInitScript(()=>{window.__pageLoads=0;document.addEventListener('astro:page-load',()=>window.__pageLoads++);});
 const home=base+prefix+'/',agent=base+prefix+'/work/agent-ops-console/',portal=base+prefix+'/work/partner-portal/';
 async function visible(name){const d=await p.evaluate(()=>({opacity:getComputedStyle(document.body).opacity,transform:getComputedStyle(document.body).transform,hidden:[...document.querySelectorAll('[data-motion-intro] [data-motion]')].filter(e=>e.getClientRects().length&&getComputedStyle(e).opacity!=='1').map(e=>({text:e.textContent.slice(0,80),opacity:getComputedStyle(e).opacity}))}));check(`${id} ${name} readable`,d.opacity==='1'&&!d.hidden.length,d);}
 async function menu(name){if(width<768){const trigger=p.locator('[data-navbar-trigger]');await trigger.click();check(`${id} ${name} menu open`,await trigger.getAttribute('aria-expanded')==='true');await p.keyboard.press('Escape');check(`${id} ${name} menu focus`,await trigger.evaluate(e=>document.activeElement===e));}}
 async function zoom(name){const trigger=p.locator('[data-zoom-trigger]').filter({visible:true}).first();await trigger.focus();await p.keyboard.press('Enter');const dialog=p.locator('[data-media-zoom]');await dialog.waitFor({state:'visible'});let trap=true;for(let i=0;i<6;i++){await p.keyboard.press('Tab');trap&&=await dialog.evaluate(e=>e.contains(document.activeElement));}check(`${id} ${name} zoom trap`,trap);await p.keyboard.press('Escape');check(`${id} ${name} zoom return`,await trigger.evaluate(e=>document.activeElement===e));}
 async function history(direction){const count=await p.evaluate(()=>window.__pageLoads);await p[direction]();await p.waitForFunction(n=>window.__pageLoads>n,count);await settled(p);}
 async function nextStates(key){const link=p.locator(`[data-case-next="case-${key}"]`);await link.scrollIntoViewIfNeeded();const read=()=>link.evaluate(e=>{const s=getComputedStyle(e),l=getComputedStyle(e.querySelector('.case-next__label')),a=getComputedStyle(e.querySelector('svg'));return {surface:s.backgroundColor,text:s.color,label:l.color,arrow:a.color,focus:s.outlineColor,outline:s.outlineStyle,tone:e.dataset.tone};});
  for(const state of ['rest','hover','focus','pressed']){
   if(state==='hover')await link.hover();
   if(state==='focus'){await p.keyboard.press('Tab');await link.focus();}
   if(state==='pressed'){const r=await link.boundingBox();await p.mouse.move(r.x+r.width/2,r.y+r.height/2);await p.mouse.down();}
   await p.waitForTimeout(210);const d=await read();
   check(`${id} ${key} ${state} surface/tone`,d.surface===surfaces[key]&&d.tone==='light',d);
   check(`${id} ${key} ${state} contrast`,contrast(d.text,d.surface)>=4.5&&contrast(d.label,d.surface)>=4.5&&contrast(d.arrow,d.surface)>=3,{...d,textRatio:contrast(d.text,d.surface),labelRatio:contrast(d.label,d.surface),focusRatio:contrast(d.focus,d.surface)});
   if(state==='focus')check(`${id} ${key} focus visible`,d.outline!=='none'&&contrast(d.focus,d.surface)>=3,d);
   if(state==='pressed'){await p.mouse.move(1,1);await p.mouse.up();}
  }
 }
 try{
  for(const [key,url] of [['agent',agent],['portal',portal]]){await p.goto(url,{waitUntil:'networkidle'});await settled(p);await visible(`direct ${key}`);check(`${id} direct ${key} surface`,await p.locator(`[data-case-cover="case-${key}"]`).evaluate((e,color)=>getComputedStyle(e).backgroundColor===color,surfaces[key]));}
  await p.goto(agent,{waitUntil:'networkidle'});await settled(p);await nextStates('portal');
  await p.goto(base+prefix+'/work/pawly/',{waitUntil:'networkidle'});await settled(p);await nextStates('agent');
  await p.goto(home,{waitUntil:'networkidle'});await settled(p);
  check(`${id} Agent Home normal focus ancestry`,await p.locator('[data-case-card="case-agent"] [data-focus-tone="inverse"]').count()===0);
  const entry=p.locator('[data-case-card="case-agent"] .featured-case__cta');await entry.scrollIntoViewIfNeeded();await entry.focus();await p.waitForTimeout(180);const scroll=await p.evaluate(()=>scrollY);
  await p.keyboard.press('Enter');await p.waitForURL(u=>path(u)===path(agent));await settled(p);check(`${id} keyboard arrival top`,await p.evaluate(()=>scrollY<5));
  // Let the actual 1s native snapshot finish before testing post-navigation UI.
  // No animation is skipped, advanced, or disabled.
  await p.waitForTimeout(1150);await menu('after navigation');await zoom('after navigation');
  await history('goBack');check(`${id} history back scroll`,Math.abs(await p.evaluate(()=>scrollY)-scroll)<6,{expected:scroll,actual:await p.evaluate(()=>scrollY)});
  await history('goForward');await visible('forward');check(`${id} forward surface`,await p.locator('.agent-cover').evaluate(e=>getComputedStyle(e).backgroundColor==='rgb(247, 247, 245)'));
  // Real history interruption during the next native transition, no skip/finish.
  await p.locator('[data-case-next="case-portal"]').click({noWaitAfter:true});await p.waitForURL(u=>path(u)===path(portal));await p.waitForTimeout(100);await history('goBack');await visible('interrupted back');
  await history('goForward');await visible('interrupted forward');check(`${id} interrupted final route`,path(p.url())===path(portal));
  await p.emulateMedia({reducedMotion:'reduce'});await p.locator('[data-case-next="case-learn"]').click();await settled(p);await visible('reduce');
  check(`${id} reduce no active native motion`,await p.evaluate(()=>!document.getAnimations().some(a=>a.effect?.pseudoElement?.includes('view-transition')&&a.playState==='running')));
  await p.goto(home,{waitUntil:'networkidle'});await settled(p);const trigger=p.locator('[data-dialog-open]').first();await trigger.focus();await p.keyboard.press('Enter');const dialog=p.locator('[data-project-dialog][open]');await dialog.waitFor({state:'visible'});await p.keyboard.press('Tab');check(`${id} project dialog after navigation`,await dialog.evaluate(e=>e.contains(document.activeElement)));await p.keyboard.press('Escape');check(`${id} project dialog return`,await trigger.evaluate(e=>document.activeElement===e));
  check(`${id} runtime`,!runtime.errors.length&&!runtime.failed.length,runtime);
 }catch(e){issues.push({id,error:e.stack});console.log('EXCEPTION',id,e.message);}
 await ctx.close();
 // Fallback modes retain authored colors and readable content.
 for(const mode of ['no-js','no-view-transition','delayed-js']){
  console.log('BEGIN',id,mode);
  const c=await browser.newContext({viewport:{width,height:844},javaScriptEnabled:mode!=='no-js'});
  if(mode==='no-view-transition')await c.addInitScript(()=>{document.startViewTransition=undefined;});
  if(mode==='delayed-js')await c.route('**/_astro/*.js',async r=>{await new Promise(r=>setTimeout(r,3200));await r.continue();});
  const page=await c.newPage();
  try{
   for(const [key,url] of [['agent',agent],['portal',portal]]){
    await page.goto(url,{waitUntil:mode==='delayed-js'?'commit':'networkidle'});
    if(mode==='delayed-js')await page.waitForTimeout(2300);else if(mode!=='no-js')await settled(page);
    const sample=()=>page.evaluate(()=>({opacity:getComputedStyle(document.body).opacity,hidden:[...document.querySelectorAll('[data-motion-intro] [data-motion]')].filter(e=>e.getClientRects().length&&Number(getComputedStyle(e).opacity)<.99).length,surface:getComputedStyle(document.querySelector('[data-case-cover]')).backgroundColor}));
    const d=await sample();check(`${id} ${mode} ${key}`,d.opacity==='1'&&d.hidden===0&&d.surface===surfaces[key],d);
    if(mode==='delayed-js'){await page.waitForTimeout(2500);const late=await sample();check(`${id} late bundle ${key} stays readable`,late.opacity==='1'&&late.hidden===0,late);}
   }
   if(mode==='no-view-transition'){await page.locator('[data-case-next="case-learn"]').click();await settled(page);check(`${id} unsupported VT navigation`,path(page.url()).endsWith('/work/learn'));}
   if(mode==='no-js'){await page.goto(base+prefix+'/work/pawly/');await page.locator('[data-case-next="case-agent"]').click();check(`${id} no-js native navigation`,path(page.url())===path(agent));}
  }catch(e){issues.push({id,mode,error:e.stack});console.log('EXCEPTION',id,mode,e.message);}await c.close();
 }
 await mkdir(`${root}/logs`,{recursive:true});await writeFile(`${root}/logs/states-${engine}.json`,JSON.stringify({checks,issues},null,2));console.log('DONE',id);
}
await browser.close();console.log('TOTAL',checks.length,'FAIL',checks.filter(c=>!c.pass).length,'EXCEPTIONS',issues.length);if(checks.some(c=>!c.pass)||issues.length)process.exitCode=1;
