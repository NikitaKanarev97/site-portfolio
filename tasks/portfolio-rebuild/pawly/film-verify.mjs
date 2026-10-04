/** Actual Pawly native input. Never invokes scripted video play/pause/seek. */
import {createRequire} from 'node:module';
import {mkdir,rename,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const {chromium}=createRequire('D:/Claude-projects/PETS-walking/package.json')('playwright');
const browser=await chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const origin='http://127.0.0.1:4370',dir='tasks/portfolio-rebuild/pawly';
const output=`${dir}/film-inline-verification.json`;
const results=[],failures=[];
const lifecycleOnly=process.argv.includes('--lifecycle-only');
if(lifecycleOnly){const prior=JSON.parse(await readFile(output,'utf8'));results.push(...prior.results.filter(r=>r.mode!=='lifecycle'));failures.push(...prior.failures.filter(r=>r.mode!=='lifecycle'));}
await mkdir(`${dir}/recording/inline`,{recursive:true});
await mkdir(`${dir}/shots/inline`,{recursive:true});
const check=(ok,where,detail)=>{if(!ok)failures.push({where,detail});};
let active,phase;
async function state(v){return v.evaluate(e=>({paused:e.paused,ended:e.ended,time:e.currentTime,duration:Number.isFinite(e.duration)?e.duration:null,readyState:e.readyState,source:e.currentSrc,controls:e.controls,loop:e.loop,autoplay:e.autoplay,poster:e.poster,decodedFrames:e.getVideoPlaybackQuality().totalVideoFrames,bound:!!e.dataset.bound}));}
async function waitNative(v,predicate,timeout=10000){const deadline=Date.now()+timeout;while(Date.now()<deadline){const s=await state(v);if(predicate(s))return s;await new Promise(r=>setTimeout(r,120));}throw new Error(`Native media state timeout: ${phase}`);}
async function playing(v,time=0.5){return waitNative(v,s=>!s.paused&&s.time>time&&s.readyState>=2&&s.decodedFrames>0);}
async function nativeToggle(p,v){await v.scrollIntoViewIfNeeded();await v.evaluate(e=>{const r=e.getBoundingClientRect();if(r.bottom>innerHeight-20)scrollBy(0,r.bottom-innerHeight+20);});await p.waitForTimeout(180);await v.focus();await p.keyboard.press('Space');}
async function boot(p,js=true){await p.evaluate(()=>document.fonts.ready);if(js){await p.waitForFunction(()=>window.__dsMotionBooted);await p.evaluate(()=>window.__pawlyTransitionFinished);}await p.waitForTimeout(650);}
async function contextFor(options){const c=await browser.newContext(options);await c.addInitScript(()=>{const start=document.startViewTransition;if(start)document.startViewTransition=function(...args){const t=start.apply(this,args);window.__pawlyTransitionFinished=t.finished;return t;};});return c;}
async function save(){await writeFile(output,JSON.stringify({origin,phase:'actual-inline-film',commonDelta:'433c80bcba29eda2060067570e9f8ec2087a2a91',importedRef:'129b96f5bebcb9f11c93a42b2f78617b3b217d9c',historicalFindings:'history/d3bbbb-film-verification.json',nativeInput:'Focused HTML video + trusted Space; read-only Node polling; no scripted play/pause/seek',results,failures,limitations:['Local Chromium1243 only; no physical devices or other engines.','Hidden document is an explicitly synthetic visibility handler probe; physically hidden tab not verified.','No-JS native playback works; lifecycle enhancement requires JS.'],storySha256:createHash('sha256').update(await readFile('src/copy/cases/pawly.ts')).digest('hex')},null,2)+'\n');}
try{
  if(!lifecycleOnly)for(const lang of ['en','ru'])for(const mode of ['full','reduce','no-js']){
    const viewport={width:mode==='full'?1440:mode==='reduce'?390:360,height:mode==='full'?1100:844};
    const c=await contextFor({viewport,javaScriptEnabled:mode!=='no-js',reducedMotion:mode==='reduce'?'reduce':'no-preference',...(mode==='full'?{recordVideo:{dir:`${dir}/recording/inline`,size:viewport}}:{})});
    const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
    const route=`/preview/pawly-rebuild/${lang}/`;await p.goto(origin+route,{waitUntil:'networkidle'});await boot(p,mode!=='no-js');
    const v=p.locator('#return-boundary video[data-clip="film"]');active=v;phase=`${lang} ${mode} first play`;
    await v.scrollIntoViewIfNeeded();await p.waitForTimeout(600);
    const row={lang,mode,viewport,route,initial:await state(v)};
    row.structure=await p.evaluate(()=>({filmCount:document.querySelectorAll('video').length,inline:!!document.querySelector('#return-boundary .case-steps__step:nth-child(2) video[data-clip="film"]'),steps:document.querySelectorAll('#return-boundary .case-steps__step').length,sourceTypes:[...document.querySelector('video').querySelectorAll('source')].map(e=>e.type),overflow:document.documentElement.scrollWidth-innerWidth,companion:!!document.querySelector('#return-proof'),staleAnchor:document.querySelectorAll('a[href="#return-proof"]').length,staticSources:[...document.querySelectorAll('#return-boundary .case-steps__step:not(:nth-child(2)) img')].map(e=>e.getAttribute('src'))}));
    check(row.structure.filmCount===1&&row.structure.inline&&row.structure.steps===3&&!row.structure.overflow&&!row.structure.companion&&!row.structure.staleAnchor&&row.structure.sourceTypes.join(',')==='video/mp4,video/webm',phase,row.structure);
    check(row.initial.paused&&row.initial.controls&&!row.initial.loop&&!row.initial.autoplay&&row.initial.poster.endsWith('/clip-return-proof-poster.webp')&&row.initial.bound===(mode!=='no-js'),phase,row.initial);
    await nativeToggle(p,v);row.played=await playing(v);check(row.played.source.endsWith('.mp4')&&row.played.decodedFrames>0,phase,row.played);
    phase=`${lang} ${mode} manual pause`;await nativeToggle(p,v);await p.waitForTimeout(220);row.manualPause=await state(v);check(row.manualPause.paused,phase,row.manualPause);
    await p.locator('#return-boundary .case-steps__step').nth(1).screenshot({path:`${dir}/shots/inline/${lang}-${mode}-native-paused.png`});
    phase=`${lang} ${mode} resume`;await nativeToggle(p,v);row.resumed=await playing(v,row.manualPause.time+0.15);
    phase=`${lang} ${mode} end`;row.ended=await waitNative(v,s=>s.ended,18000);check(row.ended.paused&&Math.abs(row.ended.time-row.ended.duration)<0.1,phase,row.ended);
    if(mode==='full')await p.screenshot({path:`${dir}/recording/inline/${lang}-end.png`});
    row.errors=errors;check(!errors.length,phase,errors);results.push(row);await save();
    const recording=p.video();await c.close();if(recording)await rename(await recording.path(),`${dir}/recording/inline/${lang}-native-return-proof.webm`);
    console.log(`native ${lang} ${mode}: decoded play/pause/resume/end; failures=${failures.length}`);
  }
  for(const lang of ['en','ru']){
    const c=await contextFor({viewport:{width:390,height:844},reducedMotion:'reduce'}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
    const route=`/preview/pawly-rebuild/${lang}/`;await p.goto(origin+route,{waitUntil:'networkidle'});await boot(p);
    const v=p.locator('#return-boundary video[data-clip="film"]');active=v;phase=`${lang} lifecycle`;
    await nativeToggle(p,v);const row={lang,mode:'lifecycle',beforeDeparture:await playing(v)};
    await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(550);row.outside=await state(v);check(row.outside.paused,phase,row.outside);
    await v.scrollIntoViewIfNeeded();await p.waitForTimeout(550);row.returned=await state(v);check(row.returned.paused&&Math.abs(row.returned.time-row.outside.time)<0.1,phase,row.returned);
    await nativeToggle(p,v);await playing(v,row.returned.time+0.15);await p.emulateMedia({reducedMotion:'no-preference'});await p.waitForTimeout(350);row.preferenceFull=await state(v);check(row.preferenceFull.paused,phase,row.preferenceFull);
    await nativeToggle(p,v);await playing(v,row.preferenceFull.time+0.15);await p.emulateMedia({reducedMotion:'reduce'});await p.waitForTimeout(350);row.preferenceReduce=await state(v);check(row.preferenceReduce.paused,phase,row.preferenceReduce);
    await nativeToggle(p,v);await playing(v,row.preferenceReduce.time+0.15);
    await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});await p.waitForTimeout(250);row.syntheticHidden=await state(v);check(row.syntheticHidden.paused,phase,row.syntheticHidden);
    await p.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});await p.waitForTimeout(250);row.syntheticVisible=await state(v);check(row.syntheticVisible.paused&&Math.abs(row.syntheticVisible.time-row.syntheticHidden.time)<0.1,phase,row.syntheticVisible);
    await nativeToggle(p,v);await playing(v,row.syntheticVisible.time+0.15);const handle=await v.elementHandle();
    await p.locator('.case-next__link').focus();await p.keyboard.press('Enter');await p.waitForURL(url=>url.pathname===`${lang==='ru'?'/ru':''}/work/agent-ops-console/`);await boot(p);
    row.detached=await handle.evaluate(e=>({paused:e.paused,connected:e.isConnected,bound:!!e.dataset.bound}));check(row.detached.paused&&!row.detached.connected&&!row.detached.bound,phase,row.detached);
    await p.evaluate(()=>{window.__pawlyBackDone=false;document.addEventListener('astro:page-load',()=>{window.__pawlyBackDone=true;},{once:true});});
    await p.goBack();await p.waitForURL(url=>url.pathname===route);await p.waitForFunction(()=>window.__pawlyBackDone);await boot(p);
    row.back={count:await p.locator('video').count(),state:await state(p.locator('video'))};check(row.back.count===1&&row.back.state.paused,phase,row.back);
    row.errors=errors;check(!errors.length,phase,errors);results.push(row);await save();console.log(`lifecycle ${lang}: offscreen/preferences/synthetic visibility/Next/Back; failures=${failures.length}`);await c.close();
  }
}catch(error){failures.push({where:phase??'harness',detail:error.message,state:active?await state(active).catch(()=>null):null});}
finally{await browser.close();await save();}
console.log(JSON.stringify({observations:results.length,failures},null,2));if(failures.length)process.exitCode=1;
