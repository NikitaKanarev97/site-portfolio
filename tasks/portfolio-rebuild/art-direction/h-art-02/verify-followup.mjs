import{createRequire}from'node:module';import{writeFile}from'node:fs/promises';
const{chromium}=createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright');
const b=await chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'}),results=[];
try{for(const lang of['en','ru'])for(const mode of['full','reduce']){
 const c=await b.newContext({viewport:{width:1440,height:900},reducedMotion:mode==='reduce'?'reduce':'no-preference'}),p=await c.newPage();await p.goto(`http://127.0.0.1:4394/${lang==='ru'?'ru/':''}work/vet-clinic/`,{waitUntil:'networkidle'});
 const block=p.locator('#save-is-not-publish');await block.scrollIntoViewIfNeeded();await p.waitForTimeout(1200);
 for(let n=0;n<2;n++){await block.locator('[data-carousel-next]').click();await p.waitForTimeout(600);}
 const img=block.locator('img').last();await img.evaluate(e=>e.decode());await p.waitForTimeout(1200);
 const r={lang,mode,slug:'vet-clinic',width:1440,source:await img.getAttribute('src'),...await img.evaluate(e=>({loaded:e.complete&&e.naturalWidth>0,opacity:Number(getComputedStyle(e).opacity),rect:e.getBoundingClientRect().toJSON()})),index:await block.locator('[data-carousel-index]').innerText()};
 await block.screenshot({path:`tasks/portfolio-rebuild/art-direction/h-art-02/after/${lang}-1440-publication-${mode}.png`});results.push(r);await c.close();
}
for(const width of[1440,390])for(const mode of['reduce','no-js']){
 const c=await b.newContext({viewport:{width,height:900},reducedMotion:'reduce',javaScriptEnabled:mode!=='no-js'}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:4394/kit/',{waitUntil:'networkidle'});for(const image of await p.locator('.learn-stage img,.vet-stage img').all()){await image.scrollIntoViewIfNeeded();await image.evaluate(e=>e.decode());}
 const r={slug:'kit',width,mode,errors,overflow:await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)};results.push(r);await c.close();
}
 const c=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:2,reducedMotion:'reduce'}),p=await c.newPage();await p.goto('http://127.0.0.1:4394/work/partner-portal/#domain-system',{waitUntil:'networkidle'});const state=p.locator('[data-specimen-set="availability"] [data-specimen-state="stale"]');await state.scrollIntoViewIfNeeded();await state.screenshot({path:'tasks/portfolio-rebuild/art-direction/h-art-02/after/availability-exact-red-edge.png'});await c.close();
}finally{await b.close();}
const failures=results.filter(r=>r.loaded===false||r.index&&r.index!=='3'||r.opacity!=null&&r.opacity!==1||r.overflow||r.errors?.length);await writeFile('tasks/portfolio-rebuild/art-direction/h-art-02/followup-verification.json',JSON.stringify({results,failures,boundary:'Four initially unvisited lazy carousel slides are verified by the actual native Next controls. No product change. Four kit modes check shared renderers.'},null,2));console.log(JSON.stringify({profiles:results.length,failures:failures.length}));if(failures.length)process.exitCode=1;
