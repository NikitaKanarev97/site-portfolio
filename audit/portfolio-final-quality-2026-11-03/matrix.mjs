import {launch,root,json,base,routes,settled,sweep,shot,watch} from './common.mjs';
const phase=process.argv[2]??'before',engine=process.argv[3]??'chromium';
const widths=(process.env.WIDTHS??(engine==='chromium'?'1440,1280,1024,768,390,360,320':'1440,390,320')).split(',').map(Number);
const selectedRoutes=process.env.ROUTES?process.env.ROUTES.split(','):routes;
const captureDir=phase==='final'?'after':phase;
const results=[];let browser;
// Refuse a busy port serving a different worktree: production HTML is the baseline.
const {readFile}=await import('node:fs/promises');
for(const path of ['/','/work/agent-ops-console/','/work/learn/','/work/pawly/']){
 const remote=await (await fetch(base+path)).text(),local=await readFile('dist'+path+'index.html','utf8');
 if(remote!==local)throw new Error(`Wrong server/build at ${base}${path}`);
}
try{browser=await launch(engine);}catch(e){await json(`${root}/logs/${phase}-${engine}-unavailable.json`,{error:e.message});process.exit(2);}
for(const locale of ['en','ru'])for(const width of widths){
 const context=await browser.newContext({viewport:{width,height:width<768?844:900},reducedMotion:'reduce',hasTouch:width<768});
 for(const route of selectedRoutes){
  const path=(locale==='ru'?'/ru':'')+route,name=`${locale}-${width}-${route==='/'?'home':route.split('/').filter(Boolean).at(-1)}`;
  const page=await context.newPage(),events=watch(page);const result={engine,path,width,height:width<768?844:900,motion:'reduce',...events};
  try{
   const response=await page.goto(base+path,{waitUntil:'networkidle'});result.status=response.status();await settled(page);await sweep(page);
   result.dom=await page.evaluate(()=>{
    const visible=e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden';
    const bounds=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right};};
    const assigned=[...document.images].filter(i=>!(i.matches('[data-media-zoom-image]')&&!i.closest('dialog').open&&!i.getAttribute('src')));
    return {overflow:document.documentElement.scrollWidth-innerWidth,height:document.documentElement.scrollHeight,bodyOpacity:getComputedStyle(document.body).opacity,h1:[...document.querySelectorAll('h1')].map(e=>e.innerText),lang:document.documentElement.lang,title:document.title,broken:assigned.filter(i=>!i.getAttribute('src')||!i.complete||!i.naturalWidth).map(i=>i.getAttribute('src')),unnamed:[...document.querySelectorAll('a,button')].filter(visible).filter(e=>!((e.getAttribute('aria-label')||e.innerText||e.querySelector('img')?.alt||'').trim())).map(e=>e.outerHTML.slice(0,200)),headingOverflow:[...document.querySelectorAll('h1,h2,h3')].filter(visible).filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>({text:e.innerText,...bounds(e),scroll:e.scrollWidth})),surfaces:[...document.querySelectorAll('.screen-surface,.agent-shot__image,.portal-shot__frame,.pawly-shot__plate,.pawly-shot__surface,.vet-shot__image,.case-plate')].filter(visible).map(e=>{const s=getComputedStyle(e);return {class:e.className,radius:s.borderRadius,padding:s.padding,border:s.border,background:s.backgroundColor,overflow:s.overflow,...bounds(e)};}),links:[...document.querySelectorAll('a[href]')].map(e=>({text:(e.getAttribute('aria-label')||e.innerText).trim(),href:e.getAttribute('href'),target:e.target,rel:e.rel}))};
   });
   if([1440,390].includes(width)&&engine==='chromium'){
    result.viewport=await shot(page,`${root}/${captureDir}/${name}-viewport`);result.full=await shot(page,`${root}/${captureDir}/${name}-full`,{fullPage:true});
    for(const selector of (route.includes('agent-ops')?['.agent-cover','#checkpoint','#autonomy']:route.includes('partner-portal')?['.portal-cover','#fulfillment']:route.includes('learn')?['.learn-cover']:route.includes('vet-clinic')?['.vet-cover']:route.includes('pawly')?['.pawly-cover','#choosing','#return']:route==='/'?['#work-agent-ops-console','#contact']:[])){
     const el=page.locator(selector).first();if(await el.count()){await el.scrollIntoViewIfNeeded();await page.waitForTimeout(160);await shot(page,`${root}/${captureDir}/${name}-${selector.replace(/[.#]/g,'')}`,{locator:el});}
    }
   }
  }catch(e){result.exception=e.message;}
  result.pass=!result.exception&&result.status===200&&!events.errors.length&&!events.failed.length&&!result.dom?.overflow&&!result.dom?.broken.length&&!result.dom?.headingOverflow.length&&!result.dom?.unnamed.length;
  results.push(result);await page.close();console.log(name,result.pass?'PASS':'FAIL',result.exception??JSON.stringify({overflow:result.dom?.overflow,headings:result.dom?.headingOverflow,broken:result.dom?.broken,errors:events.errors}));
  await json(`${root}/logs/${phase}-${engine}-matrix.json`,results);
 }
 await context.close();
}
await browser.close();console.log('TOTAL',results.length,'FAIL',results.filter(x=>!x.pass).length);
if(results.some(x=>!x.pass))process.exitCode=1;
