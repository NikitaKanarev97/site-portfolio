import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const {chromium}=createRequire(`${process.env.PLAYWRIGHT_REPO??'D:/Claude-projects/b2b-dssl'}/package.json`)('playwright');
const root='audit/agent-ops-home-cover-v1/v1';
const phase=process.argv[2]??'before';
const origin=process.env.PORTFOLIO_ORIGIN??'http://127.0.0.1:4404';
await mkdir(`${root}/${phase}`,{recursive:true});
const browser=await chromium.launch();
const results=[];
try{
 for(const locale of ['en','ru'])for(const [width,height]of [[1440,900],[1024,900],[768,1024],[390,844],[360,800]]){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'reduce'});
  const page=await context.newPage();const errors=[],failures=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failures.push(`${r.status()} ${r.url()}`);});
  await page.goto(`${origin}/${locale==='ru'?'ru/':''}`,{waitUntil:'networkidle'});
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].filter(i=>!i.closest('dialog')).map(async i=>{i.loading='eager';await i.decode().catch(()=>{});}));});
  // Visit the entire real page so its off-screen reveal observers have run.
  // Decoded images alone do not guarantee a visible full-page browser capture.
  await page.evaluate(async()=>{
   for(let y=0;y<document.documentElement.scrollHeight;y+=innerHeight*0.75){scrollTo(0,y);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));}
   scrollTo(0,0);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  });
  const prefix=`${root}/${phase}/${locale}-${width}`;
  await page.screenshot({path:`${prefix}-first.png`});
  if([1440,390].includes(width))await page.screenshot({path:`${prefix}-full.png`,fullPage:true});
  const card=page.locator('#work-agent-ops-console');
  await card.screenshot({path:`${prefix}-cover.png`});
  await page.locator('.agent-home').screenshot({path:`${prefix}-stage.png`});
  const y=await card.evaluate(e=>e.getBoundingClientRect().top+scrollY);
  await page.evaluate(y=>scrollTo(0,Math.max(0,y-120)),y);
  await page.screenshot({path:`${prefix}-context.png`,fullPage:false});
  const metrics=await page.evaluate(()=>{
   const c=document.querySelector('#work-agent-ops-console'),s=c.querySelector('.agent-home');
   const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y+scrollY,width:r.width,height:r.height};};
   return {overflow:document.documentElement.scrollWidth-innerWidth,cover:rect(c),stage:rect(s),story:rect(s.querySelector('.agent-home__story')),image:rect(s.querySelector('img')),
    imageSrc:s.querySelector('img').currentSrc.replace(location.origin,''),imageAlt:s.querySelector('img').alt,
    brokenImages:[...document.images].filter(i=>!i.closest('dialog')&&(!i.complete||!i.naturalWidth)).map(i=>i.src),
    protected:Object.fromEntries(['.hero','#work-partner-portal','#work-learn','#work-vet-clinic','#work-pawly'].map(sel=>[sel,document.querySelector(sel).outerHTML])),
    links:[...c.querySelectorAll('a')].map(a=>({href:a.getAttribute('href'),label:a.getAttribute('aria-label')||a.textContent.trim()}))};
  });
  metrics.protected=Object.fromEntries(Object.entries(metrics.protected).map(([k,v])=>[k,createHash('sha256').update(v).digest('hex')]));
  results.push({locale,width,height,...metrics,errors,failures});await context.close();
 }
}finally{await browser.close();await writeFile(`${root}/logs/${phase}.json`,JSON.stringify({origin,browser:browser.version(),dpr:1,reducedMotion:'reduce',results},null,2)+'\n');}
console.log(JSON.stringify(results.map(({locale,width,overflow,cover,errors,failures,brokenImages})=>({locale,width,overflow,height:cover.height,errors,failures,brokenImages}))));
