import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright');
const dir='tasks/portfolio-rebuild/art-direction/h-art-06';await mkdir(dir+'/preflight',{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'}),results=[];
async function specimen(page){return page.locator('.case-specimen').evaluate(e=>{
 const section=e.closest('[data-block-type]'),first=e.querySelector('[data-specimen-state] img'),f=e.querySelector('[data-specimen-part="foundation"]'),r=section.getBoundingClientRect();
 return {height:r.height,firstImageOffset:first.getBoundingClientRect().top-r.top,foundationAfterStates:!!(e.querySelector('[data-specimen-state]').compareDocumentPosition(f)&Node.DOCUMENT_POSITION_FOLLOWING),
 states:[...e.querySelectorAll('[data-specimen-state]')].map(s=>{const i=s.querySelector('img'),a=i.getBoundingClientRect(),box=s.querySelector('.case-screen').getBoundingClientRect(),cs=getComputedStyle(i);return{id:s.dataset.specimenState,media:s.dataset.mediaId,src:i.currentSrc.split('/media/')[1],width:a.width,height:a.height,naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight,fit:cs.objectFit,clip:cs.clipPath,inside:a.left>=box.left-.5&&a.right<=box.right+.5&&a.top>=box.top-.5&&a.bottom<=box.bottom+.5};}),
 type:[...e.querySelectorAll('tbody tr')].map(t=>[...t.children].map(c=>c.textContent.replace(/[\s·]/g,''))),colors:[...e.querySelectorAll('.case-specimen__swatch')].map(s=>s.textContent.trim()),overflow:document.documentElement.scrollWidth-innerWidth};
 });}
try{
 for(const lang of ['en','ru'])for(const width of [1440,390])for(const slug of ['partner-portal','learn','pawly']){
  const c=await browser.newContext({viewport:{width,height:width===390?844:900}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  const path=`/${lang==='ru'?'ru/':''}work/${slug}/`,key=`${lang}-${width}-${slug}`;
  await p.goto('http://127.0.0.1:4398'+path,{waitUntil:'networkidle'});await p.locator('.case-specimen').scrollIntoViewIfNeeded();
  for(const img of await p.locator('.case-specimen img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());}await p.waitForTimeout(1300);const before=await specimen(p);
  await p.goto('http://127.0.0.1:4399'+path,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.locator('.case-specimen').scrollIntoViewIfNeeded();
  for(const img of await p.locator('.case-specimen img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());}await p.waitForTimeout(1200);
  const after=await specimen(p);await p.locator('.case-specimen').screenshot({path:`${dir}/preflight/${key}-system.png`});
  const identity=a=>a.states.map(s=>[s.id,s.media,s.src,s.naturalWidth,s.naturalHeight]);
  const pass=JSON.stringify(identity(before))===JSON.stringify(identity(after))&&JSON.stringify(before.type)===JSON.stringify(after.type)&&JSON.stringify(before.colors)===JSON.stringify(after.colors)&&after.overflow===0&&after.foundationAfterStates&&after.states.every((s,i)=>s.inside&&s.fit==='contain'&&s.clip==='none'&&s.width>=before.states[i].width-.5);
  results.push({key,pass,errors,before,after});console.log(JSON.stringify({key,pass,beforeHeight:before.height,afterHeight:after.height,firstImageOffset:after.firstImageOffset,minImageWidth:Math.min(...after.states.map(s=>s.width))}));await c.close();
 }
 for(const mode of ['full','reduce','no-js'])for(const lang of ['en','ru'])for(const width of [1440,390]){
  const c=await browser.newContext({viewport:{width,height:width===390?844:900},reducedMotion:mode==='reduce'?'reduce':'no-preference',javaScriptEnabled:mode!=='no-js'}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(`http://127.0.0.1:4399/${lang==='ru'?'ru/':''}`,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
  const observations=[];
  for(const article of await p.locator('.featured-case').all()){
   await article.evaluate(e=>e.scrollIntoView({block:'start'}));await p.waitForTimeout(80);
   const frames=await article.locator('.case-screen').evaluateAll(es=>es.map(e=>{const i=e.querySelector('img');return{frameOpacity:getComputedStyle(e).opacity,imageOpacity:getComputedStyle(i).opacity,loaded:i.complete&&i.naturalWidth>0,motion:e.getAttribute('data-motion'),imageMotion:i.getAttribute('data-motion'),href:e.querySelector('a').getAttribute('href')};}));
   observations.push({id:await article.getAttribute('id'),frames});
  }
  const staticFrames=observations.every(o=>o.frames.every(f=>Number(f.frameOpacity)===1&&Number(f.imageOpacity)===1&&!f.motion&&!f.imageMotion));
  results.push({key:`${lang}-${width}-home-${mode}`,pass:staticFrames,errors,observations});console.log(`${lang} ${width} home ${mode}: ${staticFrames}`);await c.close();
 }
}finally{await browser.close();}
await writeFile(dir+'/composition-verification.json',JSON.stringify({sourceRef:process.env.H6_SOURCE_REF||'working-tree',results},null,2)+'\n');
if(results.some(r=>!r.pass||r.errors.length))process.exitCode=1;
