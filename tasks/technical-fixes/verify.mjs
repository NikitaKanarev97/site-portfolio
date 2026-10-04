import{createRequire}from'node:module';
import{mkdir,writeFile}from'node:fs/promises';
import assert from'node:assert/strict';
const{chromium}=createRequire('D:/Claude-projects/b2b-dssl/package.json')('playwright');
const browser=await chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const origin='http://127.0.0.1:4397',out='tasks/technical-fixes/evidence',results=[];
await mkdir(out,{recursive:true});
const slugs=['agent-ops-console','partner-portal','learn','vet-clinic','pawly'];
async function load(page,path){
 const response=await page.goto(origin+path,{waitUntil:'networkidle'});assert.equal(response.status(),200);
 await page.evaluate(()=>document.fonts.ready);
 await page.locator('img').evaluateAll(es=>es.forEach(e=>e.loading='eager'));
 await page.waitForFunction(()=>[...document.images].filter(i=>getComputedStyle(i).display!=='none').every(i=>i.complete));
}
try{
if(!process.argv.includes('--motion-only'))for(const locale of['en','ru'])for(const width of[320,390,768,1024,1440]){
 const prefix=locale==='ru'?'/ru':'';
 for(const route of['',...slugs.map(s=>`work/${s}/`)]){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await load(page,`${prefix}/${route}`);
  const data=await page.evaluate(()=>({
   overflow:document.documentElement.scrollWidth-innerWidth,
   broken:[...document.images].filter(i=>getComputedStyle(i).display!=='none'&&i.getBoundingClientRect().width&&!i.naturalWidth).map(i=>i.src),
   nested:document.querySelectorAll('a a').length,
   callouts:[...document.querySelectorAll('.case-callout')].map(e=>({numbers:[...e.querySelectorAll('.case-callout__dot--list')].map(n=>({text:n.textContent.trim(),display:getComputedStyle(n).display})),items:[...e.querySelectorAll('.case-callout__item')].map(i=>({top:i.getBoundingClientRect().top,bottom:i.getBoundingClientRect().bottom})),pins:[...e.querySelectorAll('.case-callout__pin')].filter(n=>getComputedStyle(n).display!=='none').map(n=>({right:n.getBoundingClientRect().right,imageLeft:e.querySelector('.case-screen__media').getBoundingClientRect().left})),zoom:e.querySelector('[data-zoom-trigger]')!==null})),
   hero:[...document.querySelectorAll('.hero__proof a')].map(e=>({href:e.getAttribute('href'),zoom:e.hasAttribute('data-zoom-trigger')})),
   homeFrames:[...document.querySelectorAll('.featured-case .case-screen__open')].map(e=>({href:e.getAttribute('href'),zoom:e.hasAttribute('data-zoom-trigger')})),
  }));
  assert(data.overflow<=1,`${locale}/${width}/${route} overflow ${data.overflow}`);
  assert.equal(data.broken.length,0,data.broken.join('\n'));assert.equal(errors.length,0,errors.join('\n'));assert.equal(data.nested,0);
  for(const c of data.callouts){assert.deepEqual(c.numbers.map(n=>n.text),c.numbers.map((_,i)=>String(i+1)));assert(c.numbers.every(n=>n.display!=='none'));assert(c.items.every((n,i,a)=>!i||n.top>=a[i-1].bottom));assert(c.pins.every(p=>p.right<=p.imageLeft));assert(c.zoom);}
  if(!route){assert(data.hero.every(a=>a.href===`${prefix}/work/agent-ops-console`&&!a.zoom));assert(data.homeFrames.every(a=>a.href.startsWith(`${prefix}/work/`)&&!a.zoom));}
  if(route==='work/pawly/'){
   const carousel=page.locator('#compatibility .case-carousel');assert.equal(await carousel.locator('.case-carousel__slide').count(),4);
   for(let i=0;i<3;i++){
    if((await carousel.locator('[data-carousel-index]').innerText())==='4')break;
    await carousel.locator('[data-carousel-next]').click({force:true});
    await page.waitForTimeout(80);
   }
   await page.waitForFunction(()=>document.querySelector('#compatibility [data-carousel-index]')?.textContent==='4');
   assert.equal((await carousel.locator('.case-carousel__count').innerText()).replace(/\s/g,''),'4/4');
   await carousel.locator('[data-carousel-prev]').click();await page.waitForFunction(()=>document.querySelector('#compatibility [data-carousel-index]')?.textContent!=='4');
  }
  if([390,1440].includes(width)){
   const target=route==='work/partner-portal/'?'#audit-direction':route==='work/learn/'?'#one-material':route==='work/pawly/'?'#compatibility':null;
   if(target){
    await page.locator(target).scrollIntoViewIfNeeded();
    await page.locator(target+' img').evaluateAll(es=>Promise.all(es.filter(e=>e.getBoundingClientRect().width).map(e=>e.decode())));
    await page.waitForTimeout(150);
    await page.locator(target).screenshot({path:`${out}/${locale}-${width}-${route.split('/')[1]}.png`,animations:'disabled'});
   }
   if(!route)await page.screenshot({path:`${out}/${locale}-${width}-home.png`,animations:'disabled'});
  }
  results.push({locale,width,route:route||'home',...data,errors});await page.close();
 }
 console.log('responsive',locale,width);
}
// Sample forward/backward exchanges, including the boundaries between whole panels.
for(const slug of['agent-ops-console','partner-portal'])for(const locale of['en','ru'])for(const viewport of[{width:1440,height:1000},{width:1024,height:1000},{width:768,height:1000},{width:390,height:844}]){
 const page=await browser.newPage({viewport,reducedMotion:'no-preference'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await load(page,`${locale==='ru'?'/ru':''}/work/${slug}/`);await page.waitForTimeout(1000);
 const list=page.locator('.case-steps--focus');
 const geometry=await list.evaluate(el=>({focused:el.classList.contains('is-focused'),base:(el.closest('.pin-spacer')||el).getBoundingClientRect().top+scrollY}));
 const samples=[];
 if(geometry.focused){
  const last=await list.locator('[data-focus-state]').count()-1;
  for(const state of[0,.74,.79,.86,1,1.74,1.79,1.86,2,2.74,2.79,2.86,3,2.79,1.79,.79,0].filter(n=>n<=last)){
   await page.evaluate(y=>scrollTo(0,y),geometry.base-24+state*650);await page.waitForTimeout(350);
   const data=await list.evaluate(el=>{
    const stage=el.querySelector('.case-steps__list').getBoundingClientRect();
    return [...el.querySelectorAll('[data-focus-state]')].filter(e=>getComputedStyle(e).visibility!=='hidden'&&+getComputedStyle(e).opacity>.01).map(e=>{
     const screen=e.querySelector('.case-screen').getBoundingClientRect(),caption=e.querySelector('.case-steps__caption')?.getBoundingClientRect();
     const text=e.querySelector('.case-steps__text').getBoundingClientRect();
     return{scene:e.dataset.scene,screen:{width:screen.width,top:screen.top,bottom:screen.bottom},stage:{top:stage.top,bottom:stage.bottom},caption:caption?{top:caption.top,bottom:caption.bottom}:null,textBottom:text.bottom};
    });
   });
   assert.equal(data.length,1,`${locale}/${viewport.width}/${state}: blended states`);
   const current=data[0];assert(current.screen.bottom<=(current.caption?.top??current.stage.bottom)+1,`${locale}/${viewport.width}/${state}: screen overlaps caption ${JSON.stringify(current)}`);
   assert((current.caption?.bottom??current.screen.bottom)<=current.stage.bottom+1,`${locale}/${viewport.width}/${state}: outside scene ${JSON.stringify(current)}`);
   samples.push({state,...current});
   if([0,1,2,3].includes(state)&&viewport.width===1440)await list.screenshot({path:`${out}/${locale}-${slug}-motion-${state}.png`});
  }
 }else assert(viewport.width<1024);
 const next=page.locator('.case-next');await next.scrollIntoViewIfNeeded();
 const marquee=await next.evaluate(e=>{const a=e.querySelector('.case-next__marquee').getBoundingClientRect(),b=e.querySelector('.case-next__title').getBoundingClientRect();return{top:b.top-a.top,bottom:a.bottom-b.bottom};});
 assert(marquee.top>=0&&marquee.bottom>=0);assert.equal(errors.length,0,errors.join('\n'));
 if(viewport.width===1440)await next.screenshot({path:`${out}/${locale}-next.png`});
 results.push({slug,locale,viewport,geometry,samples,marquee,errors});await page.close();
 console.log('motion',slug,locale,viewport.width);
}
await writeFile(process.argv.includes('--motion-only')?'tasks/technical-fixes/motion-verification.json':'tasks/technical-fixes/verification.json',JSON.stringify({passed:true,profiles:process.argv.includes('--motion-only')?0:60,motionProfiles:16,results},null,2));
}catch(error){await writeFile('tasks/technical-fixes/failure.json',JSON.stringify({error:String(error),results},null,2));throw error;}
finally{await browser.close();}
