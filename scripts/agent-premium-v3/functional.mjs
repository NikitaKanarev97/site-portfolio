import {launch,ready,save,root} from './capture.mjs';
import {writeFile} from 'node:fs/promises';
const browser=await launch(),checks=[],errors=[];
const origin=process.argv[2]??'http://127.0.0.1:4406';
const check=(name,pass,data)=>{checks.push({name,pass:!!pass,data});if(!pass)console.error('FAIL',name,JSON.stringify(data));};
try {
 for(const locale of ['en','ru']) {
  const prefix=locale==='ru'?'/ru':'',route=prefix+'/work/agent-ops-console/';
  const context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin+route,{waitUntil:'networkidle'});await ready(page);
  const cls=()=>page.locator('[data-agent-reading]').getAttribute('class');
  check(`${locale} desktop reading enabled`,(await cls()).includes('is-reading'));
  for(const i of [0,1,2,1,0]) {
   await page.locator(`[data-agent-reading-step="${i}"]`).evaluate(el=>scrollTo(0,el.getBoundingClientRect().top+scrollY-innerHeight/2+20));await page.waitForTimeout(160);
   const active=await page.locator('[data-agent-reading-marker][data-current="true"]').getAttribute('data-agent-reading-marker');
   check(`${locale} scroll forward/reverse ${i}`,active===String(i),{active});
  }
  for(const [name,index,offset] of [['stage-1',0,20],['transition-1-2',1,-12],['stage-2',1,20],['transition-2-3',2,-12],['final',2,20]]){
   await page.locator(`[data-agent-reading-step="${index}"]`).evaluate((el,offset)=>scrollTo(0,el.getBoundingClientRect().top+scrollY-innerHeight/2+offset),offset);await page.waitForTimeout(200);
   await save(page,`${root}/after/${locale}-1440-motion-${name}`);
  }
  const proof=await page.locator('.agent-reading__proof').evaluate(el=>{const r=el.getBoundingClientRect();return {height:r.height,viewport:innerHeight,position:getComputedStyle(el).position};});
  check(`${locale} complete sticky proof fits`,proof.height<=proof.viewport-32&&proof.position==='sticky',proof);
  // One meaningful keyboard path through image inspection, including focus trap and return.
  const trigger=page.locator('.agent-reading [data-zoom-trigger]').first();await trigger.scrollIntoViewIfNeeded();await trigger.focus();
  const outline=await trigger.evaluate(el=>({style:getComputedStyle(el).outlineStyle,width:getComputedStyle(el).outlineWidth}));
  check(`${locale} keyboard focus visible`,outline.style!=='none'&&outline.width!=='0px',outline);
  await page.keyboard.press('Enter');const dialog=page.locator('[data-media-zoom]');await dialog.waitFor({state:'visible'});
  check(`${locale} image zoom opens`,await dialog.evaluate(el=>el.open));
  const zoomsrc=await page.locator('[data-media-zoom-image]').getAttribute('src');
  check(`${locale} zoom uses correct locale`,zoomsrc.includes('/'+locale+'/'),{zoomsrc});
  await page.keyboard.press('Tab');check(`${locale} focus remains in zoom`,await dialog.evaluate(el=>el.contains(document.activeElement)));
  await page.keyboard.press('Escape');check(`${locale} Escape closes and returns focus`,await trigger.evaluate(el=>document.activeElement===el)&&!await dialog.evaluate(el=>el.open));
  const policyFull=page.locator('#policy .agent-shot__full--wide').first();await policyFull.click();await dialog.waitFor({state:'visible'});
  check(`${locale} full policy inspection`,(await page.locator('[data-media-zoom-image]').getAttribute('src')).endsWith('policy-editor-desktop.webp'));
  await page.keyboard.press('Escape');
  const summary=page.locator('#autonomy summary');await summary.focus();await page.keyboard.press('Enter');
  check(`${locale} native quality disclosure`,await page.locator('#autonomy details').getAttribute('open')!==null);
  await save(page,`${root}/after/${locale}-1440-quality-expanded`,page.locator('#autonomy details'));
  await summary.focus();await page.keyboard.press('Enter');
  const links=await page.locator('.agent-case a').evaluateAll(els=>els.map(a=>({href:a.getAttribute('href'),target:a.target,rel:a.rel})));
  const internal=links.filter(l=>l.href.startsWith('/')&&!l.href.endsWith('.webp'));
  for(const l of internal){const response=await context.request.get(origin+l.href);check(`${locale} internal link ${l.href}`,response.status()===200);}
  check(`${locale} external links labelled and protected`,links.filter(l=>l.target==='_blank').every(l=>l.rel.includes('noopener')&&l.href.startsWith('https://')));
  for(let i=0;i<3;i++) {
   await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(180);
   check(`${locale} reduce cleanup ${i}`,!(await cls()).includes('is-reading')&&await page.locator('[data-agent-reading] [data-current]').count()===0);
   await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(250);
   check(`${locale} preference restore ${i}`,(await cls()).includes('is-reading'));
  }
  await page.setViewportSize({width:1024,height:900});await page.waitForTimeout(250);check(`${locale} tablet resize no overflow`,await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth));
  await page.setViewportSize({width:390,height:844});await page.waitForTimeout(250);check(`${locale} mobile reading stays native`,!(await cls()).includes('is-reading')&&await page.locator('.agent-reading__proof').evaluate(el=>getComputedStyle(el).position!=='sticky'));
  await page.locator('.agent-cover__media [data-zoom-trigger]').first().click();await dialog.waitFor({state:'visible'});
  check(`${locale} mobile zoom native asset`,(await page.locator('[data-media-zoom-image]').getAttribute('src')).endsWith('approval-consequences-mobile.webp'));
  await page.keyboard.press('Escape');
  // Astro navigation, back and reading-position restoration.
  await page.setViewportSize({width:1440,height:900});
  await page.locator('.agent-index a[href="#checkpoint"]').click();await page.waitForTimeout(600);
  const anchor=await page.locator('#checkpoint').evaluate(el=>el.getBoundingClientRect().top);check(`${locale} direct anchor`,Math.abs(anchor)<100,{anchor});
  const readingY=await page.evaluate(()=>scrollY);
  const about=page.locator('nav a[href="'+prefix+'/about"]').first();
  await about.evaluate(el=>el.click());await page.waitForURL('**/about*');await page.waitForTimeout(700);
  check(`${locale} Astro route cleanup`,await page.locator('[data-agent-reading]').count()===0);
  await page.goBack();await page.waitForURL('**/work/agent-ops-console/**');await page.waitForFunction(y=>Math.abs(scrollY-y)<100,readingY,{timeout:5000}).catch(()=>{});
  const backY=await page.evaluate(()=>scrollY);check(`${locale} browser back restores reading`,Math.abs(backY-readingY)<100,{readingY,backY});
  if(origin.includes('4405')){const debug=await page.evaluate(()=>window.__dsMotionDebug?.());check(`${locale} no duplicate scene`,debug?.duplicateScenes===0,debug);}
  await context.close();
  // Independent static modes at both narrow and desktop widths.
  for(const width of [1440,360])for(const mode of ['reduce','no-js']){
   const c=await browser.newContext({viewport:{width,height:width===360?800:900},javaScriptEnabled:mode!=='no-js',reducedMotion:mode==='reduce'?'reduce':'no-preference'}),p=await c.newPage();
   await p.goto(origin+route,{waitUntil:'networkidle'});await ready(p);
   const state=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,reading:document.querySelector('[data-agent-reading]').classList.contains('is-reading'),hidden:[...document.querySelectorAll('.agent-case h1,.agent-case h2,.agent-reading h3')].filter(el=>getComputedStyle(el).opacity==='0'||el.getBoundingClientRect().height===0).length,images:[...document.querySelectorAll('.agent-case img')].filter(i=>!i.naturalWidth).length}));
   check(`${locale} ${width} ${mode} complete`,!state.overflow&&!state.reading&&!state.hidden&&!state.images,state);
   await save(p,`${root}/after/${locale}-${width}-${mode}-viewport`);
   if(mode==='no-js') {await p.locator('#autonomy summary').click();check(`${locale} ${width} no-JS disclosure works`,await p.locator('#autonomy details').getAttribute('open')!==null);}
   await c.close();
  }
 }
}finally{await browser.close();await writeFile(`${root}/functional${origin.includes('4405')?'-dev':''}.json`,JSON.stringify({checks,errors,pass:checks.every(c=>c.pass)&&!errors.length},null,2));}
if(checks.some(c=>!c.pass)||errors.length)process.exitCode=1;
console.log(JSON.stringify({checks:checks.length,failed:checks.filter(c=>!c.pass).length,errors}));
