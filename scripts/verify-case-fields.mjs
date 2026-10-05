/** Verify all public case carousels and Vet alignment, including resize and controls.
 * node scripts/verify-case-fields.mjs [origin] [widths]; FIELDS_BROWSER=webkit
 */
import {createRequire} from 'node:module';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const playwright = createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright');
const engine = process.env.FIELDS_BROWSER ?? 'chromium';
const origin = process.argv[2] ?? 'http://127.0.0.1:4475';
const widths = (process.argv[3] ?? '360,390,768,820,1024,1440,1920').split(',').map(Number);
const output = `tmp/case-fields/${origin.includes('127.0.0.1') ? 'local' : 'production'}-${engine}`;
await mkdir(output,{recursive:true});
const report = {origin,engine,checks:[],assets:[],failures:[],errors:[]};
const browser = await playwright[engine].launch(engine === 'chromium' ? {executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'} : {});
const paths = ['/', ...['agent-ops-console','partner-portal','learn','vet-clinic','pawly'].map(s=>`/work/${s}/`)];
async function measure(page) {
  return page.evaluate(() => {
    const failures = [], rows = [];
    const r = n => n.getBoundingClientRect(), same = (a,b) => Math.abs(a-b) <= 1;
    if(document.documentElement.scrollWidth > innerWidth+1) failures.push('Page overflow');
    for (const carousel of document.querySelectorAll('[data-carousel]')) {
      const plates = [...carousel.querySelectorAll('.case-carousel__plate')];
      const captions = [...carousel.querySelectorAll('.case-carousel__caption')];
      const heights = plates.map(p=>r(p).height);
      const tops = captions.map(p=>r(p).top);
      if(heights.some(h=>!same(h,heights[0]))) failures.push(`Unequal plate heights: ${heights}`);
      if(tops.some(t=>!same(t,tops[0]))) failures.push(`Unequal caption positions: ${tops}`);
      captions.forEach((caption,i)=>{
        const gap=r(caption).top-r(plates[i]).bottom;
        const expected=parseFloat(getComputedStyle(carousel).getPropertyValue('--flow-pair'));
        if(!same(gap,expected)) failures.push(`Caption gap ${gap}, expected ${expected}`);
      });
      for(const plate of plates) {
        const content = plate.firstElementChild, outer = r(plate), inner = r(content), css = getComputedStyle(plate);
        if(inner.top < outer.top+parseFloat(css.paddingTop)-1 || inner.bottom > outer.bottom-parseFloat(css.paddingBottom)+1) failures.push('Plate clips its content');
        const image = content.querySelector('img');
        if(image && !same(r(image).height,r(image).width*image.naturalHeight/image.naturalWidth)) failures.push('Image aspect ratio altered');
      }
      rows.push({slides:plates.length,heights,captionTops:tops});
    }
    for(const stage of document.querySelectorAll('.vet-stage')) {
      const route = stage.querySelector('.vet-stage__route');
      const label = stage.querySelector('.vet-stage__trace figcaption');
      if(!same(r(route.firstElementChild).left,r(label).left) || !same(r(route).right,r(label).right)) failures.push('Vet route does not align with figure column');
      const cover = stage.closest('.case-opening');
      if(cover && !same(r(route.firstElementChild).left,r(cover.querySelector('h1')).left)) failures.push('Vet route does not align with title');
    }
    return {rows,failures};
  });
}
const settle = page => page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
try {
  for(const width of widths) for(const lang of ['en','ru']) for(const path of paths) {
    const route = (lang === 'ru' ? '/ru' : '')+path;
    const page = await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
    page.on('pageerror', e=>report.errors.push({route,width,message:e.message}));
    const response = await page.goto(origin+route,{waitUntil:'load'});
    await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));});
    const geometry = await measure(page);
    if(response.status() !== 200) geometry.failures.push(`HTTP ${response.status()}`);
    // Test every reachable stop and return to the first, not only the initial frame.
    for(const carousel of await page.locator('[data-carousel]').all()) {
      const next = carousel.locator('[data-carousel-next]'), prev = carousel.locator('[data-carousel-prev]');
      const track = carousel.locator('[data-carousel-track]');
      const count = await carousel.locator('.case-carousel__slide').count();
      await carousel.scrollIntoViewIfNeeded();
      for(let i=0; i<count && await next.isEnabled(); i++) {
        const left = await track.evaluate(n=>n.scrollLeft);
        await next.click();
        await page.waitForFunction(({left,cls})=>{const n=document.querySelectorAll('[data-carousel-track]')[cls];return Math.abs(n.scrollLeft-left)>1;},{left,cls:await track.evaluate(n=>[...document.querySelectorAll('[data-carousel-track]')].indexOf(n))});
        await settle(page);
      }
      if(await next.isEnabled()) geometry.failures.push('Next does not reach the end');
      if(Number(await carousel.locator('[data-carousel-index]').innerText()) !== count) geometry.failures.push('End counter incorrect');
      const endField = await track.evaluate(n=>{
        const track=n.getBoundingClientRect(),last=n.querySelector('.case-carousel__slide:last-child .case-plate').getBoundingClientRect();
        return {actual:track.right-last.right,expected:parseFloat(getComputedStyle(n).paddingRight)};
      });
      if(Math.abs(endField.actual-endField.expected)>1) geometry.failures.push(`Last slide end field ${endField.actual}, expected ${endField.expected}`);
      if(path === '/work/vet-clinic/' && lang === 'ru' && [390,820,1440].includes(width)) {
        await page.evaluate(()=>document.activeElement?.blur());await settle(page);
        await carousel.screenshot({path:`${output}/vet-carousel-end-${width}.png`});
      }
      for(let i=0; i<count && await prev.isEnabled(); i++) {await prev.click();await settle(page);}
      await page.waitForFunction(n=>{const p=document.querySelectorAll('[data-carousel-prev]')[n];return p.disabled;},await prev.evaluate(n=>[...document.querySelectorAll('[data-carousel-prev]')].indexOf(n)));
      // Native keyboard scrolling must keep the equal-height layout too.
      await track.focus();await page.keyboard.press('ArrowRight');await settle(page);
      const after = await measure(page);geometry.failures.push(...after.failures);
    }
    if(path === '/work/vet-clinic/' && lang === 'ru' && [390,820,1440].includes(width)) {
      await page.evaluate(()=>document.activeElement?.blur());await settle(page);
      await page.locator('.case-opening').screenshot({path:`${output}/vet-cover-${width}.png`});
      for(const [index,carousel] of (await page.locator('[data-carousel]').all()).entries()) await carousel.screenshot({path:`${output}/vet-carousel-${width}-${index}.png`});
    }
    if(path === '/work/learn/' && lang === 'ru' && [390,820,1440].includes(width)) {
      for(const kind of ['assessment','landing']) {
        const shot = page.locator(`.case-screen:has(img[src*="/learn-ru/${kind}-"])`).first();
        await shot.screenshot({path:`${output}/learn-${kind}-${width}.png`});
      }
    }
    // One page crosses both breakpoints, with no reload or script measuring heights.
    if(path.startsWith('/work/') && width === 1440) for(const resized of [390,820,1440]) {
      await page.setViewportSize({width:resized,height:900});
      await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))));
      await settle(page);
      const resizedGeometry = await measure(page);
      geometry.failures.push(...resizedGeometry.failures.map(f=>`${resized}px resize: ${f}`));
    }
    report.checks.push({route,width, ...geometry});
    if(geometry.failures.length) report.failures.push({route,width,failures:geometry.failures});
    await page.close();
    console.log(`${width}px ${route}: ${geometry.rows.length} carousel(s), ${geometry.failures.length} failure(s)`);
  }
  const captures = JSON.parse(await readFile('tasks/portfolio-rebuild/integration/learn-frame-fields-2026-10-05.json','utf8'));
  for(const c of captures) {
    const response = await fetch(origin+'/'+c.file.replace(/^public\//,''));
    const hash = createHash('sha256').update(Buffer.from(await response.arrayBuffer())).digest('hex');
    const fields = c.fields.every(f=>f.left>=16 && f.right>=16 && f.top>=24 && f.bottom>=24);
    const same = hash === c.sha256;
    report.assets.push({file:c.file,fields,same,status:response.status});
    if(!fields || !same || response.status!==200) report.failures.push({file:c.file,fields,same,status:response.status});
  }
} finally {await browser.close();await writeFile(output+'/report.json',JSON.stringify(report,null,2));}
console.log(JSON.stringify({checks:report.checks.length,assets:report.assets.length,failures:report.failures,errors:report.errors},null,2));
if(report.failures.length || report.errors.length) process.exitCode=1;
