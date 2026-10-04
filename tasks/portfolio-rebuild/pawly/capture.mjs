import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const require = createRequire('D:/Claude-projects/PETS-walking/package.json');
const { chromium } = require('playwright');
const out = 'public/media/rebuild/pawly';
const records=[];
const hash=b=>createHash('sha256').update(b).digest('hex');
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
try {
  for (const locale of ['en','ru']) {
    await mkdir(`${out}/${locale}`,{recursive:true});
    for(const name of ['walker-profile','walker-list','active-service','handover-photo-review','order-details','walker-earnings','clip-return-proof-poster','clip-return-proof.mp4','clip-return-proof.webm']) {
      const filename=name.includes('.')?name:`${name}.webp`;
      const source=`public/media/case-pawly${locale==='ru'?'-ru':''}/${filename}`;
      const target=`${out}/${locale}/${filename}`;
      const bytes=await readFile(source);
      await copyFile(source,target);
      records.push({id:`${locale}-${name}`,file:target,source,locale,viewport:'390x844',dpr:1.5,sha256:hash(bytes),reused:true});
    }
  }
  const states=[
    ['photo-pending','photoproof','pending','figure[data-proof-status]'],
    ['photo-local','photoproof','local','figure[data-proof-status]'],
    ['photo-confirmed','photoproof','compact','figure[data-proof-status]'],
    ['photo-unavailable','photoproof','unavailable','figure[data-proof-status]'],
    ['timeline-done','timelinerow','done','[data-state]'],
    ['timeline-current','timelinerow','current','[data-state]'],
    ['timeline-pending','timelinerow','pending','[data-state]'],
    ['timeline-photo','timelinerow','with-nested-photo','[data-state]'],
    ['note-hint','infonote','hint','[data-action]'],
    ['note-warning','infonote','warning','[data-action]'],
    ['note-disclosure','infonote','disclosure','[data-action]'],
  ];
  await mkdir(`${out}/states`,{recursive:true});
  for(const [id,family,state,selector] of states) for(const width of [343,288]) {
    const page=await browser.newPage({viewport:{width:500,height:900},deviceScaleFactor:2,reducedMotion:'reduce'});
    const url=`http://127.0.0.1:4371/iframe.html?id=components-${family}--${state}&viewMode=story`;
    await page.goto(url);
    const node=page.locator(`#storybook-root ${selector}`).first();
    await node.waitFor();
    // Width belongs to outer story decorator, not product CSS.
    await page.evaluate(w=>{document.body.style.background='transparent';const d=document.querySelector('#storybook-root > div');if(d)d.style.width=w+'px';},width);
    await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
    if(id==='photo-unavailable') await page.getByText('Photo unavailable. The recorded event is saved.').first().waitFor();
    await page.waitForTimeout(150);
    const box=await node.boundingBox();
    const png=await page.screenshot({clip:{x:box.x-2,y:box.y-2,width:box.width+4,height:box.height+4},omitBackground:true});
    const file=`${out}/states/${id}-${width}.webp`;
    await sharp(png).webp({quality:95}).toFile(file);
    const bytes=await readFile(file);
    records.push({id:`${id}-${width}`,file,source:url,catalogue:'04 · 13 September 2026',locale:'EN source',viewport:'500x900',dpr:2,nativeWidth:box.width+4,width:box.width+4,height:box.height+4,text:await node.innerText(),sha256:hash(bytes),reused:false});
    await page.close();
  }
  // Verify current accepted application without writing product files.
  for(const locale of ['en','ru']) {
    const p=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
    await p.goto(`http://127.0.0.1:4372/${locale==='ru'?'ru/':''}app/active-service`);
    await p.getByRole('heading',{name:locale==='ru'?'Байкал':'Baikal',exact:true}).first().waitFor().catch(()=>{});
    await p.evaluate(()=>document.fonts.ready);
    await p.screenshot({path:`tasks/portfolio-rebuild/pawly/current-${locale}.png`,fullPage:true});
    records.push({id:`current-${locale}`,source:p.url(),text:(await p.locator('body').innerText()).slice(0,5000),locale});
    await p.close();
  }
  await writeFile('tasks/portfolio-rebuild/pawly/captures.json',JSON.stringify({date:new Date().toISOString(),records},null,2));
  console.log(`${records.length} records: byte-identical existing media, 22 native captures and current EN/RU app`);
}finally{await browser.close();}
