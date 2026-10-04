import {createRequire} from 'node:module';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import sharp from 'sharp';
const require=createRequire('D:/Claude-projects/b2b-dssl/package.json'),{chromium}=require('playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const origin=process.env.BASE??'http://127.0.0.1:4366',dir='tasks/portfolio-rebuild/vet-clinic/shots';await mkdir(dir,{recursive:true});
// This flag replaces only the affected mobile chapter/full/overview images.
const mobileCarouselOnly=process.argv.includes('--mobile-carousel-only');
const results=mobileCarouselOnly?JSON.parse(await readFile('tasks/portfolio-rebuild/vet-clinic/visual.json','utf8')):[];
const carouselResults=[],failures=[];
async function waitForLayout(p,test,arg){
 const deadline=Date.now()+5000;
 while(!await p.evaluate(test,arg)){if(Date.now()>deadline)throw Error('Carousel layout did not settle');await p.waitForTimeout(25);}
}
async function positionCarousel(p){
 await p.locator('[data-carousel]').evaluate(e=>{const bar=e.querySelector('[data-carousel-bar]');const anchor=bar&&!bar.hidden?bar:e.querySelector('[data-carousel-track]');scrollTo(0,anchor.getBoundingClientRect().top+scrollY-24);});
}
async function settleCarousel(p,index,js=true){
 const target=await p.locator('[data-carousel-track]').evaluate((e,index)=>Math.min(e.querySelectorAll('.case-carousel__slide')[index].offsetLeft,e.scrollWidth-e.clientWidth),index);
 await waitForLayout(p,({target,index,js})=>{const t=document.querySelector('[data-carousel-track]');return Math.abs(t.scrollLeft-target)<1&&(!js||document.querySelector('[data-carousel-index]').textContent.trim()===String(index+1));},{target,index,js});
 // Eight rendered frames for JS; no-JS Chromium blocks RAF callbacks, so poll
 // the native layout from Playwright before screenshot forces a paint.
 if(js)await Promise.race([
  p.evaluate(async()=>{const t=document.querySelector('[data-carousel-track]');let previous=t.scrollLeft,stable=0;for(let i=0;i<120&&stable<8;i++){await new Promise(requestAnimationFrame);const next=t.scrollLeft;stable=Math.abs(next-previous)<0.1?stable+1:0;previous=next;}if(stable<8)throw Error('Carousel snap did not settle');}),
  new Promise((_,reject)=>setTimeout(()=>reject(Error('Carousel paint timeout')),5000))
 ]);
 else for(let frame=0;frame<8;frame++){await p.waitForTimeout(20);const actual=await p.locator('[data-carousel-track]').evaluate(e=>e.scrollLeft);if(Math.abs(actual-target)>=1)throw Error('Native no-JS snap moved');}
}
async function nativeStop(p,index,js=true){
 const current=await p.locator('[data-carousel-track]').evaluate(e=>Math.round(e.scrollLeft/(e.querySelectorAll('.case-carousel__slide')[1].offsetLeft||1)));
 if(js){
  let at=current;while(at!==index){await p.locator(at<index?'[data-carousel-next]':'[data-carousel-prev]').click();at+=at<index?1:-1;await settleCarousel(p,at,js);}
 }else{
  await p.locator('[data-carousel-track]').evaluate((e,index)=>e.scrollTo({left:e.querySelectorAll('.case-carousel__slide')[index].offsetLeft,behavior:'instant'}),index);
 }
 await settleCarousel(p,index,js);
 await waitForLayout(p,index=>{const e=document.querySelectorAll('.case-carousel__slide')[index].querySelector('img');return e.complete&&e.naturalWidth>0;},index);
}
async function carouselSnapshot(p,index){
 return p.locator('[data-carousel-track]').evaluate((t,index)=>{const slides=[...t.querySelectorAll('.case-carousel__slide')],active=slides[index],img=active.querySelector('img'),caption=active.querySelector('figcaption');const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};};const imageRect=rect(img),captionRect=rect(caption),slideRect=rect(active);const hasJS=!t.closest('[data-carousel]').querySelector('[data-carousel-bar]').hidden;return {scrollLeft:t.scrollLeft,maxScroll:t.scrollWidth-t.clientWidth,index:hasJS?t.closest('[data-carousel]').querySelector('[data-carousel-index]').textContent.trim():null,expectedIndex:index+1,track:rect(t),slide:slideRect,image:imageRect,caption:captionRect,captionText:caption.textContent.trim(),src:img.currentSrc,loaded:img.complete&&img.naturalWidth>0,wholeHorizontal:slideRect.x>=-1&&slideRect.right<=innerWidth+1,wholeMaterialInViewport:imageRect.x>=-1&&imageRect.right<=innerWidth+1&&imageRect.y>=0&&imageRect.bottom<=innerHeight&&captionRect.y>=0&&captionRect.bottom<=innerHeight};},index);
}
async function warmCarousel(p,js=true){
 await positionCarousel(p);for(const index of [0,1,2])await nativeStop(p,index,js);await nativeStop(p,0,js);
}
for(const locale of ['en','ru'])for(const width of mobileCarouselOnly?[390]:[1440,390]){
 const p=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});const errors=[];p.on('pageerror',e=>errors.push(String(e)));
 await p.goto(`${origin}/preview/vet-clinic-rebuild/${locale}/`,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 for(const image of await p.locator('img').all()){
  if(await image.evaluate(e=>Boolean(e.closest('[data-carousel]'))))continue;
  await image.scrollIntoViewIfNeeded().catch(()=>{});
 }
 await warmCarousel(p);
 const stops=[];
 if(width===390){
  for(const [index,name] of ['draft','saved','published'].entries()){
   await positionCarousel(p);await nativeStop(p,index);const before=await carouselSnapshot(p,index);
   // A viewport screenshot never invokes element scrollIntoView.
   await p.screenshot({path:`${dir}/${locale}-${width}-save-is-not-publish-${name}.png`});const after=await carouselSnapshot(p,index);
   if(!before.wholeMaterialInViewport||!after.wholeMaterialInViewport||Math.abs(before.scrollLeft-after.scrollLeft)>0.1)failures.push({locale,mode:'reduce',name,before,after});
   stops.push({name,before,after});
  }
 }
 await nativeStop(p,0);await p.evaluate(()=>scrollTo(0,0));await settleCarousel(p,0);
 const firstBefore=await carouselSnapshot(p,0),pageImage=await p.screenshot({fullPage:true}),firstAfter=await carouselSnapshot(p,0);
 if(firstBefore.scrollLeft!==0||firstAfter.scrollLeft!==0||!firstAfter.wholeHorizontal||firstAfter.index!=='1')failures.push({locale,mode:'reduce',name:'full/overview',firstBefore,firstAfter});
 await writeFile(`${dir}/${locale}-${width}-full.png`,pageImage);
 // Capture the section from the same full-page bitmap, preserving its native bleed.
 const bounds=await p.locator('#save-is-not-publish').evaluate(e=>{const r=e.getBoundingClientRect();return {top:r.top+scrollY,bottom:r.bottom+scrollY};});
 await sharp(pageImage).extract({left:0,top:Math.floor(bounds.top),width,height:Math.ceil(bounds.bottom)-Math.floor(bounds.top)}).png().toFile(`${dir}/${locale}-${width}-save-is-not-publish.png`);
 if(!mobileCarouselOnly)await p.screenshot({path:`${dir}/${locale}-${width}-top.png`});
 for(const id of mobileCarouselOnly?[]:['role-boundaries','one-visit','prototype-boundary']){
  const el=p.locator('#'+id);if(await el.count())await el.screenshot({path:`${dir}/${locale}-${width}-${id}.png`});
 }
 const data=await p.evaluate(()=>({title:document.title,overflow:document.documentElement.scrollWidth>innerWidth+1,sections:[...document.querySelectorAll('[data-block-type]')].map(e=>({id:e.id,height:e.offsetHeight})),images:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),height:document.documentElement.scrollHeight}));const result={locale,width,errors,...data,carousel:firstAfter};
 if(mobileCarouselOnly)results[results.findIndex(r=>r.locale===locale&&r.width===width)]=result;else results.push(result);
 await sharp(`${dir}/${locale}-${width}-full.png`).resize({width:width===1440?720:390}).png().toFile(`${dir}/${locale}-${width}-overview.png`);
 await p.close();
 if(width===390)carouselResults.push({locale,mode:'reduce',viewport:{width,height:900},errors,stops,fullPage:{before:firstBefore,after:firstAfter}});
 console.log(JSON.stringify({captured:locale,width,mode:'reduce'}));
}
// Narrow check only: native stops in normal motion and no-JS, without reshooting other work.
if(mobileCarouselOnly)for(const locale of ['en','ru'])for(const mode of ['normal','no-JS']){
 const js=mode!=='no-JS',p=await browser.newPage({viewport:{width:390,height:900},javaScriptEnabled:js,reducedMotion:'no-preference'}),errors=[],stops=[];p.on('pageerror',e=>errors.push(String(e)));
 await p.goto(`${origin}/preview/vet-clinic-rebuild/${locale}/`,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await warmCarousel(p,js);
 for(const [index,name] of ['draft','saved','published'].entries()){await positionCarousel(p);await nativeStop(p,index,js);const state=await carouselSnapshot(p,index);stops.push({name,state});if(!state.wholeMaterialInViewport||!state.loaded||(js&&state.index!==String(index+1)))failures.push({locale,mode,name,state});}
 if(errors.length)failures.push({locale,mode,errors});carouselResults.push({locale,mode,viewport:{width:390,height:900},errors,stops});await p.close();console.log(JSON.stringify({checked:locale,mode}));
}
await browser.close();await writeFile('tasks/portfolio-rebuild/vet-clinic/visual.json',JSON.stringify(results,null,2));
if(mobileCarouselOnly)await writeFile('tasks/portfolio-rebuild/vet-clinic/carousel-handoff.json',JSON.stringify({baseCommit:'4919971ab2a75135fd4efa4a332a998eed292c0f',method:'Warm source images; native stop; eight stable animation frames with JS, eight external layout polls with no-JS; viewport screenshots and page-bitmap chapter crop; no element screenshot on carousel',results:carouselResults,failures},null,2));
console.log(JSON.stringify(mobileCarouselOnly?{profiles:carouselResults.length,failures}:results,null,2));if(failures.length)process.exitCode=1;
