import { createRequire } from 'node:module';
import { mkdir, readFile } from 'node:fs/promises';
const require=createRequire('D:/Claude-projects/b2b-dssl/package.json');
const {chromium}=require('playwright');
const browser=await chromium.launch();
await mkdir('audit/home-cover-polish/screenshots/variants',{recursive:true});
try {
  for(const locale of ['en','ru']) for(const width of [1440,1024,390]) {
    const page=await browser.newPage({viewport:{width,height:width===390?844:900},deviceScaleFactor:1,reducedMotion:'reduce'});
    await page.route('**/media/home-cover-polish/*',async route=>route.fulfill({body:await readFile('public'+new URL(route.request().url()).pathname),contentType:'image/webp'}));
    await page.goto(`http://127.0.0.1:4417/${locale==='ru'?'ru/':''}`,{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    await page.addStyleTag({content:'.agent-home img{border-radius:var(--radius-media)}'});
    const card=page.locator('#work-agent-ops-console');
    await card.screenshot({path:`audit/home-cover-polish/screenshots/variants/${locale}-${width}-B-dark.png`});
    await page.locator('.agent-home picture source').evaluate((e,{locale})=>e.srcset=`/media/home-cover-polish/agent-neutral-${locale}-390.webp`,{locale});
    await page.locator('.agent-home img').evaluate(async(e,{locale})=>{e.src=`/media/home-cover-polish/agent-neutral-${locale}-1440.webp`;await e.decode();},{locale});
    await card.screenshot({path:`audit/home-cover-polish/screenshots/variants/${locale}-${width}-A-neutral.png`});
    await page.close();
  }
} finally {await browser.close();}
