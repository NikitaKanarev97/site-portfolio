// Production-browser regression and unmodified normal-motion evidence.
// Usage: QA_BASE=http://127.0.0.1:4415 node .../transitions.mjs before|after chromium|webkit
import {launch, base, settled, watch} from '../common.mjs';
import {mkdir, writeFile} from 'node:fs/promises';
import sharp from 'sharp';
const phase=process.argv[2]??'after', engine=process.argv[3]??'chromium';
const root=new URL('./',import.meta.url).pathname.replace(/^\/([A-Z]:)/,'$1');
const out=`${root}/${phase}/${engine}`;
await mkdir(out,{recursive:true});
const expected={agent:'rgb(247, 247, 245)',portal:'rgb(237, 242, 248)',learn:'rgb(36, 60, 86)',vet:'rgb(224, 234, 228)',pawly:'rgb(234, 226, 216)'};
const slugs={agent:'agent-ops-console',portal:'partner-portal',learn:'learn',vet:'vet-clinic',pawly:'pawly'};
const checks=[],transitions=[],issues=[];
const check=(name,pass,data)=>{checks.push({name,pass:!!pass,data});if(!pass)console.log('FAIL',name,JSON.stringify(data));};
const browser=await launch(engine);
for(const locale of ['en','ru'])for(const width of [1440,390,360]){
 if(phase==='before'&&!((locale==='en'&&width===1440)||(locale==='ru'&&width===360)))continue;
 const id=`${locale}-${width}`,prefix=locale==='ru'?'/ru':'';
 const dir=`${out}/${id}`;await mkdir(dir,{recursive:true});
 const ctx=await browser.newContext({viewport:{width,height:width===1440?900:844},reducedMotion:'no-preference',recordVideo:{dir:`${dir}/video`,size:{width,height:width===1440?900:844}}});
 await ctx.addInitScript(()=>{
  if(!document.startViewTransition)return;
  const start=document.startViewTransition.bind(document);
  document.startViewTransition=(...args)=>{
   const vt=start(...args), key=window.__captureKey;
   vt.ready.then(()=>{
    const state=window.__capture={key,ready:performance.now(),epoch:Date.now(),samples:[],finished:false};
    const sample=()=>{
     const pseudos=['group','old','new'].map(type=>{
      const s=getComputedStyle(document.documentElement,`::view-transition-${type}(case-${key})`);
      return {type,background:s.backgroundColor,duration:s.animationDuration,delay:s.animationDelay,name:s.animationName,opacity:s.opacity,width:s.width,height:s.height};
     });
     state.samples.push({t:performance.now()-state.ready,bodyOpacity:getComputedStyle(document.body).opacity,pseudos});
     if(!state.finished)requestAnimationFrame(sample);
    };sample();
    vt.finished.then(()=>{state.finished=true;state.finish=performance.now()-state.ready;});
   }).catch(e=>{window.__captureError=String(e);});
   return vt;
  };
 });
 const page=await ctx.newPage(),runtime=watch(page);
 const route=key=>base+prefix+`/work/${slugs[key]}/`;
 async function navigate(source,key,keyboard=false){
  const name=`${source}-to-${key}`,stem=`${dir}/${name}`;
  if(source==='home')await page.goto(base+prefix+'/',{waitUntil:'networkidle'});
  else if(!page.url().includes(`/work/${slugs[source]}`))await page.goto(route(source),{waitUntil:'networkidle'});
  await settled(page);
  const link=source==='home'?page.locator(`[data-case-card="case-${key}"] .featured-case__cta`):page.locator(`[data-case-next="case-${key}"]`);
  await link.scrollIntoViewIfNeeded();await page.waitForTimeout(220);
  const sourceSurface=await page.locator(source==='home'?(key==='agent'?'.agent-home':'.portal-home'):`[data-case-next="case-${key}"]`).evaluate(e=>getComputedStyle(e).backgroundColor);
  if(source!=='home'||width===1440)check(`${id} ${name} source surface`,sourceSurface===expected[key],sourceSurface);
  await sharp(await page.screenshot()).webp({quality:83}).toFile(`${stem}-source.webp`);
  await page.evaluate(k=>{window.__captureKey=k;window.__capture=null;window.__captureError=null;},key);
  if(keyboard){await link.focus();await page.keyboard.press('Enter');}else await link.click({noWaitAfter:true});
  await page.waitForFunction(k=>window.__capture?.key===k||window.__captureError,key,{timeout:20000});
  const captureError=await page.evaluate(()=>window.__captureError);if(captureError)throw Error(captureError);
  const frames=[];
  for(const target of [0,100,300,600,1000]){
   const delay=await page.evaluate(t=>Math.max(0,t-(performance.now()-window.__capture.ready)),target);
   if(delay>0)await page.waitForTimeout(delay);
   const begin=await page.evaluate(()=>performance.now()-window.__capture.ready);
   const bytes=await page.screenshot({animations:'allow'});
   const end=await page.evaluate(()=>performance.now()-window.__capture.ready);
   const path=`${stem}-${target}ms.webp`;await sharp(bytes).webp({quality:83}).toFile(path);
   frames.push({target,begin,end,file:path.slice(root.length+1)});
  }
  await page.waitForFunction(()=>window.__capture?.finished,{},{timeout:10000});
  const capture=await page.evaluate(()=>window.__capture);
  const surface=await page.locator(`[data-case-cover="case-${key}"]`).evaluate(e=>getComputedStyle(e).backgroundColor);
  // Approved Learn/Pawly hero colors are separate from their navigation treatment.
  const hero={learn:'rgb(247, 247, 245)',pawly:'rgb(255, 255, 255)'};
  check(`${id} ${name} destination surface`,surface===(hero[key]??expected[key]),surface);
  const samples=capture.samples.filter(s=>s.pseudos[0].name!=='none'&&s.t<950);
  check(`${id} ${name} actual native transition`,samples.length>=5&&capture.finish>=900&&capture.finish<1500,{samples:samples.length,finish:capture.finish});
  check(`${id} ${name} group surface`,samples.length>0&&samples.every(s=>s.pseudos[0].background===expected[key]),samples[0]?.pseudos);
  if(key==='agent'||key==='portal')check(`${id} ${name} old/new surface`,samples.length>0&&samples.every(s=>s.pseudos.slice(1).every(p=>p.background===expected[key])),samples[0]?.pseudos);
  check(`${id} ${name} body stays opaque`,capture.samples.every(s=>s.bodyOpacity==='1'));
  check(`${id} ${name} geometry`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const animated=samples[0]?.pseudos;
  check(`${id} ${name} preserved 1s choreography`,animated?.[0].duration==='1s'&&animated?.[1].duration==='0.3s'&&animated?.[2].duration==='0.7s'&&animated?.[2].delay==='0.3s',animated);
  transitions.push({id,source,key,keyboard,sourceSurface,surface,...capture,frames});
  await settled(page);
  console.log('CAPTURED',engine,id,name,`finish=${Math.round(capture.finish)}ms`);
 }
 try{
  await navigate('home','agent',true);await navigate('home','portal');
  if(phase==='before'){await navigate('pawly','agent');await navigate('agent','portal');}
  else {
   // Complete real five-case cycle, starting at Pawly.
   for(const [from,to] of [['pawly','agent'],['agent','portal'],['portal','learn'],['learn','vet'],['vet','pawly']])await navigate(from,to);
  }
  check(`${id} runtime`,runtime.errors.length===0&&runtime.failed.length===0,runtime);
 }catch(e){issues.push({id,error:e.stack});console.log('EXCEPTION',id,e.message);}
 await ctx.close();
 await writeFile(`${out}/results.json`,JSON.stringify({phase,engine,checks,issues,transitions},null,2));
}
await browser.close();
console.log('TOTAL',checks.length,'FAIL',checks.filter(c=>!c.pass).length,'EXCEPTIONS',issues.length);
if(phase==='after'&&(checks.some(c=>!c.pass)||issues.length))process.exitCode=1;
