import { browser, serve } from '../../tasks/portfolio-rebuild/partner-portal/source-runtime.mjs';
const source = await serve('D:/Claude-projects/PETS-walking/dist', true);
const b = await browser();
try {
 const page = await b.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 await page.goto(source.base+'/app/address-input',{waitUntil:'networkidle'});
 console.log(JSON.stringify(await page.locator('[class*="device"]').evaluate(n=>({html:n.outerHTML.slice(0,3000),children:[...n.children].map(c=>({tag:c.tagName,class:c.className,css:{padding:getComputedStyle(c).padding,border:getComputedStyle(c).border,bg:getComputedStyle(c).backgroundColor},rect:c.getBoundingClientRect().toJSON()})),css:{padding:getComputedStyle(n).padding,border:getComputedStyle(n).border,bg:getComputedStyle(n).backgroundColor}})),null,2));
 await page.goto('http://127.0.0.1:4482/work/pawly/',{waitUntil:'load'});
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].filter(i=>i.getAttribute('src')).map(i=>{i.loading='eager';return i.decode().catch(()=>{})}))});
 console.log('FRAMES',await page.locator('.screen-surface img').evaluateAll(nodes=>nodes.map(n=>({src:n.src,current:n.currentSrc}))));
 const surface=page.locator('.screen-surface:not(.screen-surface--native)').filter({has:page.locator('img[src*="verification-details"]')}).first();
 await surface.scrollIntoViewIfNeeded();
 await surface.evaluate(n=>{const track=n.closest('[data-carousel-track]'),slide=n.closest('.case-carousel__slide');track.style.scrollSnapType='none';track.scrollLeft=slide.offsetLeft;});
 await page.waitForTimeout(300);
 console.log('BEFORE',await surface.evaluate(n=>({rect:n.getBoundingClientRect().toJSON(),img:n.querySelector('img').src,track:n.closest('[data-carousel-track]')?.scrollLeft,hit:document.elementFromPoint(n.getBoundingClientRect().x+30,n.getBoundingClientRect().y+30)?.outerHTML.slice(0,400)})));
 const box=await surface.boundingBox();
 await page.screenshot({path:'outputs/media-edge-audit/verification-viewport.png'});
 await page.screenshot({path:'outputs/media-edge-audit/verification-reveal.png',fullPage:true,clip:{x:box.x,y:box.y+await page.evaluate(()=>scrollY),width:box.width,height:box.height}});
 await page.close();
} finally {await b.close();await source.close();}
