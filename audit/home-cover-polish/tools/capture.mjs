import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const require = createRequire('D:/Claude-projects/b2b-dssl/package.json');
const { chromium } = require('playwright');
const phase = process.argv[2] ?? 'before';
const root = 'audit/home-cover-polish';
await mkdir(`${root}/screenshots/${phase}`, { recursive: true });
const browser = await chromium.launch();
const results = [];
try {
  for (const locale of ['en', 'ru']) for (const [width, height] of [[1440,900],[1024,900],[768,1024],[390,844],[360,800]]) {
    const context = await browser.newContext({ viewport:{width,height}, deviceScaleFactor:1, reducedMotion:'reduce' });
    const page = await context.newPage();
    const errors = [], failures = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => { if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`); });
    await page.goto(`http://127.0.0.1:4417/${locale === 'ru' ? 'ru/' : ''}`, {waitUntil:'networkidle'});
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].filter(i=>!i.closest('dialog')).map(async i=>{i.loading='eager'; await i.decode().catch(()=>{});}));
    });
    const prefix = `${root}/screenshots/${phase}/${locale}-${width}`;
    await page.mouse.move(0,0);
    await page.screenshot({path:`${prefix}-first.png`});
    for (const [name,selector] of [['hero','.hero'],['agent','#work-agent-ops-console'],['portal','#work-partner-portal']]) {
      await page.locator(selector).screenshot({path:`${prefix}-${name}.png`});
    }
    const metrics = await page.evaluate(() => ({
      overflow:document.documentElement.scrollWidth-innerWidth,
      portraitWidth:document.querySelector('.hero__portrait').getBoundingClientRect().width,
      protected:Object.fromEntries(['pawly','vet-clinic'].map(slug=>{
        const el=document.querySelector(`#work-${slug}`);
        return [slug,el?.outerHTML];
      })),
      images:[...document.querySelectorAll('#work-agent-ops-console img,#work-partner-portal img')].map(i=>({src:i.currentSrc.replace(location.origin,''),width:i.width,height:i.height,complete:i.complete&&!!i.naturalWidth})),
      firstImageTop:document.querySelector('.agent-home img').getBoundingClientRect().top+scrollY,
    }));
    metrics.protected=Object.fromEntries(Object.entries(metrics.protected).map(([k,v])=>[k,v?createHash('sha256').update(v).digest('hex'):null]));
    results.push({locale,width,height,...metrics,errors,failures});
    await context.close();
  }
} finally { await browser.close(); await writeFile(`${root}/logs/${phase}.json`,JSON.stringify({phase,browser:browser.version(),dpr:1,reducedMotion:'reduce',results},null,2)+'\n'); }
console.log(JSON.stringify(results.map(({locale,width,overflow,portraitWidth,errors,failures})=>({locale,width,overflow,portraitWidth,errors,failures})),null,2));
