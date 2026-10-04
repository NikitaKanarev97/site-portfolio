import {browser} from './source-runtime.mjs';
import {mkdirSync,writeFileSync} from 'node:fs';
import sharp from 'sharp';
const base=process.argv.find(v=>v.startsWith('--base='))?.slice(7)||'http://127.0.0.1:4354';
const task='tasks/portfolio-rebuild/partner-portal',out=task+'/shots';mkdirSync(out,{recursive:true});
const b=await browser(),results=[],failures=[];
const profiles=[{width:1440,height:900},{width:1024,height:900},{width:390,height:844},{width:360,height:800},{width:1440,height:600}];
const state=p=>p.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,
  ...window.__dsMotionDebug?.(),focused:document.querySelectorAll('.case-steps.is-focused').length,
  spacers:document.querySelectorAll('.pin-spacer').length,booted:window.__dsMotionBooted,
  blank:[...document.querySelectorAll('[data-h="para"],[data-h="thesis"]')].filter(e=>e.getClientRects().length&&+getComputedStyle(e).opacity===0).map(e=>e.textContent),
  staticText:[...document.querySelectorAll('[data-story-motion="static"] [data-h="para"]')].map(e=>+getComputedStyle(e).opacity),
}));
try{
 if(!process.argv.includes('--motion-only')){
  for(const lang of ['en','ru'])for(const mode of ['reduce','no-js'])for(const viewport of profiles){
   const c=await b.newContext({viewport,reducedMotion:'reduce',javaScriptEnabled:mode!=='no-js'}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
   const route=`/preview/partner-portal-rebuild/${lang}/`;
   await p.goto(base+route,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
   // Test all assets, including lazy images reached later in the document.
   await p.locator('img').evaluateAll(es=>es.forEach(e=>e.loading='eager'));
   await p.waitForFunction(()=>[...document.images].filter(i=>i.getClientRects().length).every(i=>i.complete&&i.naturalWidth));
   const height=await p.evaluate(()=>document.documentElement.scrollHeight);
   for(let y=0;y<height;y+=700){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(20);}
   await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(150);
   const s=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,noindex:document.querySelector('meta[name="robots"]')?.content,
    canonical:document.querySelector('link[rel="canonical"]')?.href,lang:document.documentElement.lang,
    ids:[...document.querySelectorAll('[data-block-type]')].map(e=>({id:e.id,type:e.dataset.blockType,evidence:e.dataset.evidenceId,media:e.dataset.mediaId})),
    images:[...document.images].filter(i=>i.getClientRects().length&&(!i.complete||!i.naturalWidth)).map(i=>i.currentSrc),
    blank:[...document.querySelectorAll('[data-h="thesis"],[data-h="para"]')].filter(e=>+getComputedStyle(e).opacity===0).map(e=>e.textContent),
    spacers:document.querySelectorAll('.pin-spacer').length,sets:[...document.querySelectorAll('[data-specimen-set]')].map(e=>({id:e.dataset.specimenSet,states:e.querySelectorAll('[data-specimen-state]').length})),
    next:document.querySelector('.case-next__link')?.getAttribute('href'),locale:[...document.querySelectorAll('.navbar__locale a')].map(e=>e.getAttribute('href')),
   }));
   const r={scenario:'static',lang,mode,...viewport,...s,errors};results.push(r);
   if(errors.length||s.overflow||s.canonical||!s.noindex?.includes('noindex')||s.lang!==lang||s.images.length||s.blank.length||s.spacers||s.sets.length!==4||s.sets.reduce((a,v)=>a+v.states,0)!==13||s.locale.some(h=>!h?.startsWith('/preview/partner-portal-rebuild/')))failures.push(r);
   if(mode==='reduce'&&viewport.height!==600&&[1440,390].includes(viewport.width)){
    await p.screenshot({path:`${out}/${lang}-${viewport.width}-full.png`,fullPage:true});await p.screenshot({path:`${out}/${lang}-${viewport.width}-cover.png`});
    for(const id of ['audit-direction','shared-specification','buyer-decision','source-line','domain-system','source-in-context','shipped-redesign']){
     const el=p.locator('#'+id);await el.evaluate(e=>e.scrollIntoView({block:'center'}));await p.waitForTimeout(80);await el.screenshot({path:`${out}/${lang}-${viewport.width}-${id}.png`});
    }
   }
   console.log('static',lang,mode,viewport.width,viewport.height,'failures',failures.length);await c.close();
  }
  const pair=results.filter(r=>r.mode==='reduce'&&r.width===1440&&r.height===900);
  if(JSON.stringify(pair[0].ids)!==JSON.stringify(pair[1].ids))failures.push({scenario:'locale-identity'});
  const sitemap=await(await fetch(base+'/sitemap.xml')).text();if(sitemap.includes('/preview/'))failures.push({scenario:'sitemap'});
  for(const route of ['/work/partner-portal/','/ru/work/partner-portal/']){const html=await(await fetch(base+route)).text();if(html.includes('data-story-version="blocks-v1"'))failures.push({scenario:'public-legacy',route});}
  // Same-scale review references: source on left, case artifact on right.
  for(const [id,ref] of [['shared-specification','ha-screen-map.png'],['buyer-decision','ha-user-flow.png'],['domain-system','ha-component-library.png']]){
   const left=await sharp('research/portfolio-rebuild-2026-10-03/references/'+ref).resize({width:900}).png().toBuffer();
   const right=await sharp(`${out}/en-1440-${id}.png`).resize({width:900}).png().toBuffer();
   const a=await sharp(left).metadata(),d=await sharp(right).metadata();
   await sharp({create:{width:1800,height:Math.max(a.height,d.height),channels:3,background:'#fff'}}).composite([{input:left,left:0,top:0},{input:right,left:900,top:0}]).png().toFile(`${out}/reference-${id}.png`);
  }
 }
 if(!process.argv.includes('--static-only')){
  for(const lang of ['en','ru'])for(const viewport of profiles){
   const c=await b.newContext({viewport,reducedMotion:'no-preference'}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
   await p.goto(`${base}/preview/partner-portal-rebuild/${lang}/`,{waitUntil:'networkidle'});await p.waitForTimeout(1400);const initial=await state(p);
   const height=await p.evaluate(()=>document.documentElement.scrollHeight);
   for(const y of [height,0,height*.45,height*.8,0]){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(90);}
   await p.locator('#source-line').scrollIntoViewIfNeeded();await p.waitForTimeout(900);const after=await state(p);
   await p.emulateMedia({reducedMotion:'reduce'});await p.waitForTimeout(350);const reduced=await state(p);
   await p.emulateMedia({reducedMotion:'no-preference'});await p.waitForTimeout(500);const resumed=await state(p);
   const r={scenario:'motion',lang,...viewport,initial,after,reduced,resumed,errors};results.push(r);
   const focus=viewport.width>=1024&&viewport.height>=820;
   if(errors.length||[initial,after,reduced,resumed].some(s=>!s.booted||s.overflow||s.duplicateScenes||s.staticText.some(o=>o<1))||reduced.triggers||reduced.spacers||initial.focused!==Number(focus))failures.push(r);
   console.log('motion',lang,viewport.width,viewport.height,'focus',initial.focused,'failures',failures.length);await c.close();
  }
  const c=await b.newContext({viewport:{width:1440,height:900}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(base+'/preview/partner-portal-rebuild/en/',{waitUntil:'networkidle'});await p.waitForTimeout(1500);const sizes=[];
  for(const width of [390,360,1024,1440,390,1440]){await p.setViewportSize({width,height:width<768?844:900});await p.waitForTimeout(650);sizes.push({width,...await state(p)});}
  const resize={scenario:'resize',sizes,errors};results.push(resize);if(errors.length||sizes.some(s=>s.overflow||s.duplicateScenes||(s.width<1024&&s.focused)))failures.push(resize);
  const next=p.locator('.case-next__link');await next.scrollIntoViewIfNeeded();await p.waitForTimeout(400);
  const transform=()=>p.locator('[data-motion="marquee"]').evaluate(e=>getComputedStyle(e).transform);
  const before=await transform();await next.hover();await p.waitForTimeout(250);const hover=await transform();await next.focus();await p.waitForTimeout(250);const focus=await transform();
  await next.click();await p.waitForURL('**/work/learn/');await p.waitForTimeout(900);const other=await state(p);
  await p.goBack();await p.waitForURL('**/partner-portal-rebuild/en/');await p.waitForTimeout(1200);const back=await state(p);
  await p.goForward();await p.waitForURL('**/work/learn/');await p.waitForTimeout(600);await p.goBack();await p.waitForURL('**/partner-portal-rebuild/en/');await p.waitForTimeout(1200);const again=await state(p);
  const lifecycle={scenario:'Next / Back / Forward / hover / focus',before,hover,focus,other,back,again,errors};results.push(lifecycle);
  if(errors.length||before===hover||hover===focus||[back,again].some(s=>s.overflow||s.duplicateScenes||s.focused!==1))failures.push(lifecycle);
  await p.locator('.navbar__locale a[href="/preview/partner-portal-rebuild/ru/"]:visible').first().click();await p.waitForURL('**/partner-portal-rebuild/ru/');await p.waitForTimeout(1200);
  const locale=await state(p);results.push({scenario:'native locale',...locale});if(locale.overflow||locale.duplicateScenes||locale.focused!==1)failures.push({scenario:'native locale',...locale});
  await c.close();
 }
}finally{await b.close();writeFileSync(task+'/'+(process.argv.includes('--motion-only')?'motion':'static')+'-verification.json',JSON.stringify({base,results,failures},null,2));}
if(failures.length)throw Error(failures.length+' preview verification failures');
