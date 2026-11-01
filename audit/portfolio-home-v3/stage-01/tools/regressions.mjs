import {createRequire} from 'node:module';
import {writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const {chromium}=createRequire(`${process.env.PLAYWRIGHT_REPO??'D:/Claude-projects/b2b-dssl'}/package.json`)('playwright');
const browser=await chromium.launch({headless:true});const data=[];
const props=['display','width','height','font-family','font-size','font-weight','line-height','letter-spacing','color','background-color','border-radius','border-width','padding','margin','gap','grid-template-columns','object-fit','object-position','transform'];
try {
 for(const locale of ['en','ru'])for(const width of [1440,390,360,1024]) {
  const pair=[];
  for(const [phase,port] of [['before',4413],['after',4412]]) {
   const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});
   await page.goto(`http://127.0.0.1:${port}/${locale==='ru'?'ru/':''}`,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
   await page.locator('#work-pawly').scrollIntoViewIfNeeded();await page.mouse.move(0,0);
   pair.push(await page.locator('#work-pawly').evaluate((e,props)=>[e,...e.querySelectorAll('*')].map(n=>({tag:n.tagName,styles:Object.fromEntries(props.map(p=>[p,getComputedStyle(n).getPropertyValue(p)]))})),props));await page.close();
  }
  data.push({locale,width,computedStyleEqual:JSON.stringify(pair[0])===JSON.stringify(pair[1]),before:pair[0],after:pair[1]});
 }
 const shifts=[];
 for(const [phase,port]of [['before',4413],['after',4412]])for(const locale of ['en','ru']) {
  const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,reducedMotion:'reduce'});
  await page.addInitScript(()=>{window.__cls=[];new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__cls.push({value:e.value,sources:e.sources?.map(s=>s.node?.tagName)});}).observe({type:'layout-shift',buffered:true});});
  await page.route('**/media/**',async r=>{await new Promise(done=>setTimeout(done,600));await r.continue();});
  await page.goto(`http://127.0.0.1:${port}/${locale==='ru'?'ru/':''}`,{waitUntil:'networkidle'});await page.waitForTimeout(800);shifts.push({phase,locale,entries:await page.evaluate(()=>window.__cls)});await page.close();
 }
 await writeFile('audit/portfolio-home-v3/stage-01/logs/loading-comparison.json',JSON.stringify(shifts,null,2));
}finally{await browser.close();await writeFile('audit/portfolio-home-v3/stage-01/logs/pawly-computed-styles.json',JSON.stringify(data,null,2));}
const capture=JSON.parse(await readFile('audit/portfolio-home-v3/stage-01/logs/after-capture.json','utf8'));
const sources=[];
for(const r of capture.results)for(const c of r.cards)for(const i of c.images){const file=`public${i.src}`;const bytes=await readFile(file);if(!sources.some(x=>x.path===file))sources.push({path:file,sha256:createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length,alt:i.alt,locale:r.locale,case:c.id});}
await writeFile('audit/portfolio-home-v3/stage-01/logs/home-image-sources.json',JSON.stringify(sources,null,2));
console.log(JSON.stringify(data.map(({locale,width,computedStyleEqual})=>({locale,width,computedStyleEqual})),null,2));
