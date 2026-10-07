import {browser} from 'file:///C:/Users/kanar/.codex/worktrees/partner-portal-rebuild/Site-portfolio/tasks/portfolio-rebuild/partner-portal/source-runtime.mjs';
import {mkdirSync,writeFileSync} from 'node:fs';
const out='D:/Claude-projects/Site-portfolio/tasks/portfolio-rebuild/orchestration/review';
mkdirSync(out,{recursive:true});
const b=await browser(),results=[];
try {
  for(const mode of ['normal','reduce','no-js']) {
    const c=await b.newContext({viewport:{width:390,height:844},javaScriptEnabled:mode!=='no-js',reducedMotion:mode==='normal'?'no-preference':'reduce'});
    const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(String(e)));
    await p.goto('http://127.0.0.1:4366/preview/vet-clinic-rebuild/ru/',{waitUntil:'networkidle'});
    await p.evaluate(()=>document.fonts.ready);
    const section=p.locator('#save-is-not-publish'),track=section.locator('[data-carousel-track]');
    await section.evaluate(el=>el.scrollIntoView({block:'start'}));
    await p.waitForTimeout(900);
    const state=async()=>track.evaluate(el=>({scrollLeft:el.scrollLeft,width:el.clientWidth,scrollWidth:el.scrollWidth,index:el.parentElement.querySelector('[data-carousel-index]')?.textContent,nextDisabled:el.parentElement.querySelector('[data-carousel-next]')?.disabled,rect:el.getBoundingClientRect().toJSON(),slides:[...el.querySelectorAll('.case-carousel__slide')].map(s=>({offsetLeft:s.offsetLeft,rect:s.getBoundingClientRect().toJSON(),caption:s.querySelector('figcaption')?.textContent,image:s.querySelector('img')?.getBoundingClientRect().toJSON(),src:s.querySelector('img')?.currentSrc,loaded:s.querySelector('img')?.complete}))}));
    const stops=[await state()];
    await p.screenshot({path:`${out}/d-${mode}-carousel-first.png`});
    if(mode!=='no-js') for(let i=1;i<3;i++) {
      await section.locator('[data-carousel-next]').click();await p.waitForTimeout(900);
      stops.push(await state());await p.screenshot({path:`${out}/d-${mode}-carousel-${i+1}.png`});
    }
    results.push({mode,errors,stops});await c.close();
  }
} finally {await b.close();}
writeFileSync(`${out}/d-carousel-review.json`,JSON.stringify(results,null,2));
console.log(JSON.stringify(results.map(r=>({mode:r.mode,errors:r.errors,stops:r.stops.map(s=>({scrollLeft:s.scrollLeft,index:s.index,width:s.width,scrollWidth:s.scrollWidth,nextDisabled:s.nextDisabled,rects:s.slides.map(x=>({offset:x.offsetLeft,x:x.rect.x,width:x.rect.width,loaded:x.loaded}))}))})),null,2));
