import {createRequire} from 'node:module';
import {mkdir,readFile,rename,writeFile} from 'node:fs/promises';
const {chromium}=createRequire('D:/Claude-projects/PETS-walking/package.json')('playwright');
const browser=await chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
await mkdir('tasks/portfolio-rebuild/pawly/recording',{recursive:true});
const resume=process.argv.includes('--lifecycle-only');
const prior=resume?JSON.parse(await readFile('tasks/portfolio-rebuild/pawly/film-verification.json','utf8')):{results:[],failures:[]};
const results=prior.results.filter(r=>r.locale),failures=prior.failures.filter(r=>r.id!=='E-G-03');
try{
  if(!resume)for(const locale of ['en','ru'])for(const mode of ['full','reduce','no-js']){
    console.log(`Starting native playback: ${locale} ${mode}`);
    const context=await browser.newContext({viewport:{width:1440,height:1100},javaScriptEnabled:mode!=='no-js',reducedMotion:mode==='reduce'?'reduce':'no-preference',...(mode==='full'?{recordVideo:{dir:'tasks/portfolio-rebuild/pawly/recording',size:{width:1440,height:1100}}}:{})});
    const p=await context.newPage();
    await p.goto(`http://127.0.0.1:4370/preview/pawly-rebuild/${locale}/`);
    const v=p.locator('#return-proof video');await v.scrollIntoViewIfNeeded();await p.waitForTimeout(600);
    const initial=await v.evaluate(e=>({paused:e.paused,controls:e.controls,loop:e.loop,autoplay:e.autoplay,poster:e.poster,readyState:e.readyState,source:e.currentSrc}));
    if(!initial.paused||!initial.controls||initial.loop||initial.autoplay||!initial.poster)failures.push({locale,mode,initial});
    if(mode==='no-js'){
      const metadata=await p.waitForFunction(()=>Number.isFinite(document.querySelector('#return-proof video').duration),{},{timeout:5000}).then(()=>true,()=>false);
      const state=await v.evaluate(e=>({duration:Number.isFinite(e.duration)?e.duration:null,readyState:e.readyState,error:e.error?.message??null,source:e.currentSrc}));
      results.push({locale,mode,initial,metadata,state,staticFallback:true});
      if(!metadata)failures.push({id:'E-G-02',locale,mode,reason:'WebM metadata/decode unavailable; no-JS cannot reach shared MP4 fallback',...state});
      await writeFile('tasks/portfolio-rebuild/pawly/film-verification.json',JSON.stringify({results,failures},null,2));
      await context.close();continue;
    }
    await p.waitForFunction(()=>Number.isFinite(document.querySelector('#return-proof video').duration));
    const box=await v.boundingBox();await p.mouse.move(box.x+24,box.y+box.height-48);await p.waitForTimeout(120);
    await p.mouse.click(box.x+24,box.y+box.height-48); // Native bottom-left play control.
    await p.waitForFunction(()=>document.querySelector('#return-proof video').currentTime>0.5);
    const played=await v.evaluate(e=>({currentTime:e.currentTime,paused:e.paused,duration:e.duration,source:e.currentSrc,readyState:e.readyState}));
    if(played.readyState<2)failures.push({locale,mode,reason:'No decoded frame',played});
    if(mode==='full'){
      await p.waitForFunction(()=>document.querySelector('#return-proof video').ended,{},{timeout:20000});
      await p.screenshot({path:`tasks/portfolio-rebuild/pawly/recording/${locale}-end.png`});
    }else{
      const box=await v.boundingBox();await p.mouse.move(box.x+24,box.y+box.height-48);await p.mouse.click(box.x+24,box.y+box.height-48);
    }
    const final=await v.evaluate(e=>({paused:e.paused,ended:e.ended,time:e.currentTime}));
    if(!final.paused||(mode==='full'&&!final.ended))failures.push({locale,mode,final});
    results.push({locale,mode,initial,played,final});
    await writeFile('tasks/portfolio-rebuild/pawly/film-verification.json',JSON.stringify({results,failures},null,2));
    const recording=p.video();await context.close();
    if(recording)await rename(await recording.path(),`tasks/portfolio-rebuild/pawly/recording/${locale}-native-return-proof.webm`);
  }
  // Observe the frozen shared film lifecycle, including resource-release gaps.
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
  const p=await context.newPage();await p.goto('http://127.0.0.1:4370/preview/pawly-rebuild/en/');
  const v=p.locator('#return-proof video');await v.scrollIntoViewIfNeeded();await p.waitForTimeout(600);
  await p.waitForFunction(()=>document.querySelector('#return-proof video').readyState>=2);
  const box=await v.boundingBox();await p.mouse.move(box.x+24,box.y+box.height-48);await p.mouse.click(box.x+24,box.y+box.height-48);
  await p.waitForFunction(()=>document.querySelector('#return-proof video').currentTime>0.5);
  await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(400);
  results.push({mode:'leave-viewport',paused:await v.evaluate(e=>e.paused)});
  await v.scrollIntoViewIfNeeded();await p.waitForTimeout(300);
  results.push({mode:'return-viewport',paused:await v.evaluate(e=>e.paused)});
  const handle=await v.elementHandle();await p.locator('.case-next__link').focus();await p.keyboard.press('Enter');await p.waitForURL('**/work/agent-ops-console/');await p.waitForTimeout(600);
  results.push({mode:'route-departure',...(await handle.evaluate(e=>({paused:e.paused,connected:e.isConnected})))});
  await p.evaluate(()=>{window.__pawlyBack=false;document.addEventListener('astro:page-load',()=>{window.__pawlyBack=true;},{once:true});});
  await p.goBack();await p.waitForURL('**/preview/pawly-rebuild/en/');await p.waitForFunction(()=>window.__pawlyBack===true);
  results.push({mode:'back',url:p.url(),videos:await p.locator('video').count(),paused:await p.locator('video').evaluate(e=>e.paused)});
  await context.close();
  for(const r of results.filter(r=>['leave-viewport','return-viewport','back'].includes(r.mode)))if(!r.paused)failures.push({id:'E-G-03',...r});
  await writeFile('tasks/portfolio-rebuild/pawly/film-verification.json',JSON.stringify({results,failures},null,2));
  console.log(JSON.stringify({profiles:results.length,results,failures},null,2));
  if(failures.length)process.exitCode=1;
}finally{await browser.close();}
