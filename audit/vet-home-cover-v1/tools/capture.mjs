import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const {chromium}=createRequire('D:/Claude-projects/b2b-dssl/package.json')('playwright');
const phase=process.argv[2]??'before';
const base=phase==='before'?'http://127.0.0.1:4433':'http://127.0.0.1:4434';
const root='audit/vet-home-cover-v1';
await mkdir(`${root}/screenshots/${phase}`,{recursive:true});
const hash=s=>createHash('sha256').update(s).digest('hex');
const browser=await chromium.launch();
const results=[];
try {
for(const locale of ['en','ru']) for(const [width,height] of [[1440,900],[1024,900],[768,1024],[390,844],[360,800]]) {
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'reduce'});
  const page=await context.newPage();
  const errors=[],failures=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)failures.push(`${r.status()} ${r.url()}`);});
  await page.goto(`${base}/${locale==='ru'?'ru/':''}`,{waitUntil:'networkidle'});
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].filter(i=>!i.closest('dialog')).map(async i=>{i.loading='eager';await i.decode().catch(()=>{});}));});
  const prefix=`${root}/screenshots/${phase}/${locale}-${width}`;
  await page.screenshot({path:`${prefix}-first.png`});
  await page.screenshot({path:`${prefix}-full.png`,fullPage:true});
  for(const [key,selector] of [['vet','#work-vet-clinic'],['agent','#work-agent-ops-console'],['portal','#work-partner-portal'],['learn','#work-learn'],['pawly','#work-pawly']]) {
    await page.locator(selector).screenshot({path:`${prefix}-${key}.png`});
  }
  const metrics=await page.evaluate(()=>({
    overflow:document.documentElement.scrollWidth-innerWidth,
    vetHeight:document.querySelector('#work-vet-clinic').getBoundingClientRect().height,
    vetImages:[...document.querySelectorAll('#work-vet-clinic img')].map(i=>({src:i.currentSrc.replace(location.origin,''),width:i.width,height:i.height,naturalWidth:i.naturalWidth,alt:i.alt})),
    brokenImages:[...document.images].filter(i=>!i.closest('dialog')&&(!i.complete||!i.naturalWidth)).map(i=>i.src),
    protected:Object.fromEntries(['.hero','#work-agent-ops-console','#work-partner-portal','#work-learn','#work-pawly'].map(selector=>[selector,document.querySelector(selector)?.outerHTML])),
    links:[...document.querySelectorAll('#work-vet-clinic a')].map(a=>({href:a.getAttribute('href'),label:a.getAttribute('aria-label')||a.textContent.trim()})),
  }));
  metrics.protected=Object.fromEntries(Object.entries(metrics.protected).map(([k,v])=>[k,hash(v??'MISSING')]));
  results.push({locale,width,height,...metrics,errors,failures});
  await context.close();
}
} finally {
  await browser.close();
  await writeFile(`${root}/logs/${phase}.json`,JSON.stringify({phase,base,browser:browser.version(),dpr:1,reducedMotion:'reduce',results},null,2)+'\n');
}
console.log(JSON.stringify(results.map(({locale,width,overflow,vetHeight,errors,failures,brokenImages})=>({locale,width,overflow,vetHeight,errors,failures,brokenImages}))));
