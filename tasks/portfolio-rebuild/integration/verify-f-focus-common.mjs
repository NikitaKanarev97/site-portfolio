/** G's isolated F checkout. Browser geometry/state, not human or device certification. */
import {createRequire} from 'node:module';
import {mkdirSync,writeFileSync} from 'node:fs';
const require=createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const base=process.argv.find(v=>v.startsWith('--base='))?.slice(7)||'http://127.0.0.1:4386';
const out='tasks/portfolio-rebuild/integration/focus-common';mkdirSync(out+'/shots',{recursive:true});
const results=[],failures=[];
const isStatic=process.argv.includes('--static');
const takeShots=process.argv.includes('--shots');
const locale=process.argv.find(v=>v.startsWith('--lang='))?.slice(7);
const languages=locale?[locale]:['en','ru'];
const check=(test,detail)=>{if(!test)failures.push(detail)};
const browser=await require('playwright').chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const settle=async p=>{await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1200)};
const headings=p=>p.evaluate(()=>[...document.querySelectorAll('[data-focus-state] h3')].filter(e=>{for(let n=e;n;n=n.parentElement){const s=getComputedStyle(n);if(s.display==='none'||s.visibility==='hidden'||+s.opacity<.99)return false}return true}).map(e=>{
 const node=e.firstChild,lines=[];let offset=0;for(const word of e.textContent.trim().split(/\s+/)){const at=node.textContent.indexOf(word,offset),r=document.createRange();r.setStart(node,at);r.setEnd(node,at+word.length);const y=Math.round(r.getBoundingClientRect().top);let line=lines.find(l=>l.y===y);if(!line)lines.push(line={y,words:[]});line.words.push(word);offset=at+word.length;}return {title:e.textContent.trim(),lines:lines.map(l=>l.words.join(' ')),orphans:lines.filter(l=>l.words.length===1).length};
}));
const geo=p=>p.evaluate(()=>{
 const visible=e=>{for(let n=e;n;n=n.parentElement){let s=getComputedStyle(n);if(s.display==='none'||s.visibility==='hidden'||+s.opacity<.99)return false}return !!e.getBoundingClientRect().width};
 return {y:scrollY,overflow:document.documentElement.scrollWidth-innerWidth,focused:document.querySelectorAll('.case-steps.is-focused').length,pins:document.querySelectorAll('.pin-spacer').length,debug:window.__dsMotionDebug?.(),blocks:[...document.querySelectorAll('[data-block-type]')].map(e=>({id:e.id,type:e.dataset.blockType,evidence:e.dataset.evidenceId,media:e.dataset.mediaId})),states:[...document.querySelectorAll('[data-focus-state]')].filter(visible).map(e=>({scene:e.dataset.scene,title:e.querySelector('h3').textContent,rect:e.querySelector('img').getBoundingClientRect().toJSON(),loaded:e.querySelector('img').complete&&e.querySelector('img').naturalWidth>0})),static:[...document.querySelectorAll('[data-story-motion="static"] [data-h="para"]')].map(e=>+getComputedStyle(e).opacity),pauseButtons:document.querySelectorAll('.case-next button').length};
});
const loadImages=async p=>{for(const img of await p.locator('#agent-ops-rebuild img').all()){if(!await img.isVisible())continue;await img.scrollIntoViewIfNeeded();try{await img.evaluate(e=>e.decode());}catch(error){await p.waitForTimeout(150);await img.evaluate(e=>e.decode());}}await p.waitForTimeout(100)};
const stop=async(p,start,d)=>{await p.evaluate(y=>scrollTo(0,y),start+d);await p.waitForTimeout(250);return geo(p)};
const profiles=[{width:1440,height:900},{width:1024,height:900},{width:390,height:844},{width:360,height:800},{width:1440,height:600}];
try{
 for(const lang of languages)for(const viewport of profiles)for(const mode of isStatic?['reduce','nojs']:['full']){
  const context=await browser.newContext({viewport,reducedMotion:mode==='reduce'?'reduce':'no-preference',javaScriptEnabled:mode!=='nojs'}),page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const route=`/preview/agent-ops-rebuild/${lang}/`,key=`${lang}-${viewport.width}${viewport.height===600?'-short':''}-${mode}`;
  await page.goto(base+route,{waitUntil:'networkidle'});await settle(page);const entry=await geo(page);
  check(entry.focused===Number(mode==='full'&&viewport.width>=1024&&viewport.height>=820),{key,wrongFocus:entry});
  check(entry.overflow<=1&&entry.pauseButtons===0&&entry.static.every(o=>o===1),{key,layout:entry});
  check((await page.locator('meta[name="robots"]').getAttribute('content')).includes('noindex')&&await page.locator('link[rel="canonical"]').count()===0,{key,seo:'index/canonical'});
  check(await page.locator(`.navbar a[href="/preview/agent-ops-rebuild/${lang==='en'?'ru':'en'}/"]`).count()>0,{key,locale:'missing native pair'});
  await loadImages(page);const observations=[];
  if(entry.focused){
   const start=await page.locator('.case-steps').evaluate(e=>(e.closest('.pin-spacer')||e).getBoundingClientRect().top+scrollY-24);
   for(const d of [0,250,495,510,570,650,900,1145,1160,1220,1300,1550,1795,1810,1870,1950]){
    const s=await stop(page,start,d),h=await headings(page);observations.push({d,...s,headings:h});
    check(h.length===1&&h.every(v=>v.orphans===0),{key,d,headings:h});
    check(s.states.length===1&&s.states[0].loaded&&s.overflow<=1,{key,d,oneWholeProof:s});
    for(const state of s.states)check(state.rect.left>=-1&&state.rect.right<=viewport.width+1&&state.rect.top>=23&&state.rect.bottom<=viewport.height-23,{key,d,panelFits:state});
    if(takeShots&&[0,650,1300,1950].includes(d)&&viewport.width===1440)await page.screenshot({path:`${out}/shots/${key}-scene-${d}.png`});
   }
   const field=await page.locator('.case-steps__field-bleed').boundingBox();check(Math.abs(field.x)<2&&Math.abs(field.width-viewport.width)<2,{key,field});
   for(const d of [1810,1550,1160,900,510,250,0,1950,-800,800,1950]){const s=await stop(page,start,d);check(s.states.length===1&&s.overflow<=1,{key,reverseFast:d,state:s});}
  }else{
   const s=await geo(page),h=await headings(page);check(!s.focused&&!s.pins&&s.states.length===(viewport.width<768?3:4)&&s.states.every(e=>e.loaded),{key,fallback:s});
   check(h.every(v=>v.orphans===0),{key,headings:h});observations.push({headings:h});
   if(takeShots&&(viewport.width===1440||viewport.width===390)){
    for(const [section,suffix] of [['#review-load','context'],['[data-scene="decision"]','decision'],['#missing-evidence','evidence'],['#accepted-prototype','outcome']]){await page.locator(section).scrollIntoViewIfNeeded();await page.waitForTimeout(300);await page.screenshot({path:`${out}/shots/${key}-${suffix}.png`});}
    await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(250);await page.screenshot({path:`${out}/shots/${key}-full.png`,fullPage:true});
   }
  }
  await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(250);
  if(takeShots&&[1440,390,360].includes(viewport.width))await page.screenshot({path:`${out}/shots/${key}-cover.png`});
  check(errors.length===0,{key,errors});results.push({key,route,viewport,mode,entry,observations,errors});console.log('PROFILE',key,'states',entry.states.length,'failures',failures.length);await context.close();
 }
 // Actual resize/live preference and native links/Back/Forward for both locales.
 if(!isStatic)for(const lang of languages){
  const context=await browser.newContext({viewport:{width:1440,height:900}}),p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));const route=`/preview/agent-ops-rebuild/${lang}/`;
  await p.goto(base+route,{waitUntil:'networkidle'});await settle(p);await loadImages(p);
  const start=await p.locator('.case-steps').evaluate(e=>(e.closest('.pin-spacer')||e).getBoundingClientRect().top+scrollY-24);await stop(p,start,1300);
  const top=await p.locator('[data-scene="promise"]').evaluate(e=>e.getBoundingClientRect().top),changes=[];
  for(let cycle=0;cycle<3;cycle++)for(const reducedMotion of ['reduce','no-preference']){await p.emulateMedia({reducedMotion});await p.waitForTimeout(600);const s=await geo(p),now=await p.locator('[data-scene="promise"]').evaluate(e=>e.getBoundingClientRect().top);changes.push({cycle,reducedMotion,now,...s});check(Math.abs(now-top)<3&&s.pins===(reducedMotion==='reduce'?0:1)&&!s.debug?.duplicateScenes,{lang,live:changes.at(-1)});}
  for(const viewport of [profiles[1],profiles[2],profiles[3],profiles[4],profiles[0]]){await p.setViewportSize(viewport);await p.waitForTimeout(750);const s=await geo(p);changes.push({viewport,...s});check(s.overflow<=1&&!s.debug?.duplicateScenes&&s.focused===Number(viewport.width>=1024&&viewport.height>=820),{lang,resize:changes.at(-1)});}
  const next=p.locator('.case-next__link'),trans=()=>p.locator('[data-motion="marquee"]').evaluate(e=>getComputedStyle(e).transform);
  await next.scrollIntoViewIfNeeded();await p.waitForTimeout(500);const a=await trans();await next.hover();await p.waitForTimeout(300);const b=await trans();await next.focus();await p.waitForTimeout(300);const c=await trans();check(a!==b&&b!==c,{lang,marqueeHoverFocus:{a,b,c}});
  // Resize while Next is visible: B-G-01 regression coverage on F.
  await p.setViewportSize({width:1024,height:900});await p.waitForTimeout(800);await next.scrollIntoViewIfNeeded();await p.waitForTimeout(350);const r1=await trans();await p.waitForTimeout(300);const r2=await trans();check(r1!==r2,{lang,nextAfterResize:{r1,r2}});
  await p.setViewportSize({width:1440,height:900});await p.waitForTimeout(800);await next.scrollIntoViewIfNeeded();await p.waitForTimeout(350);const original=await p.evaluate(()=>scrollY);const href=await next.getAttribute('href');await next.click();await p.waitForURL(base+href);await settle(p);const away=await geo(p);await p.goBack();await p.waitForURL(base+route);await settle(p);const back=await geo(p);check(Math.abs(back.y-original)<=2&&!back.debug?.duplicateScenes,{lang,backPosition:{original,back}});
  await p.goForward();await p.waitForURL(base+href);await settle(p);await p.goBack();await p.waitForURL(base+route);await settle(p);check(!(await geo(p)).debug?.duplicateScenes,{lang,secondBack:'duplicate scenes'});
  await p.locator(`.navbar__desktop a[href="/preview/agent-ops-rebuild/${lang==='en'?'ru':'en'}/"]`).click();await p.waitForURL(`**/agent-ops-rebuild/${lang==='en'?'ru':'en'}/`);await settle(p);
  check(errors.length===0,{lang,lifecycleErrors:errors});results.push({scenario:'resize/live/Next/Back/Forward/locale',lang,changes,original,away,back,href,errors});await context.close();console.log('LIFECYCLE',lang,failures.length);
 }
 // Real native no-JS links and Back, desktop/mobile and both locales.
 if(isStatic)for(const lang of languages)for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:900},javaScriptEnabled:false}),p=await context.newPage();const route=`/preview/agent-ops-rebuild/${lang}/`;await p.goto(base+route,{waitUntil:'networkidle'});await p.locator('.case-next__link').scrollIntoViewIfNeeded();const href=await p.locator('.case-next__link').getAttribute('href');await p.locator('.case-next__link').click();await p.waitForURL(base+href);await p.goBack();await p.waitForURL(base+route);check(await p.locator('#accepted-prototype').count()===1,{lang,width,nativeNoJs:'Back'});results.push({scenario:'no-JS native Next/Back',lang,width,href});await context.close();
 }
}finally{await browser.close();writeFileSync(out+'/'+(isStatic?'f-static':'f-motion')+(locale?'-'+locale:'')+'-verification.json',JSON.stringify({base,results,failures,limitations:['Local Chromium 1243 viewport emulation; no physical devices/people/CPU benchmark','Physically hidden tab not certified']},null,2));}
if(failures.length)throw new Error('F failures '+failures.length);console.log('F verification passed',results.length,'observations');
