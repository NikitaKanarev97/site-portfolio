import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const require = createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const { chromium } = require('playwright');
const base = 'http://127.0.0.1:4392';
const out = new URL('./', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
await mkdir(`${out}/shots/before`, { recursive: true });
await mkdir(`${out}/recordings/before`, { recursive: true });
const browser = await chromium.launch({ executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe', headless: true });
const routes = ['', 'work/agent-ops-console', 'work/partner-portal', 'work/learn', 'work/vet-clinic', 'work/pawly'];
const result = [];
for (const locale of ['en', 'ru']) for (const width of [1440, 390]) {
  const context = await browser.newContext({ viewport: {width, height: width === 1440 ? 900 : 844}, reducedMotion: 'reduce' });
  const page = await context.newPage();
  for (const route of routes) {
    const path = `${locale === 'ru' ? '/ru/' : '/'}${route}${route ? '/' : ''}`;
    const response = await page.goto(`${base}${path}`, {waitUntil: 'networkidle'});
    await page.evaluate(() => document.fonts.ready);
    const key = `${locale}-${width}-${route.split('/').at(-1) || 'home'}`;
    if (response.status() !== 200) throw Error(`${path}: ${response.status()}`);
    await page.screenshot({ path: `${out}/shots/before/${key}-opening.png` });
    await page.screenshot({ path: `${out}/shots/before/${key}-full.png`, fullPage: true });
    result.push({path, width, status: response.status()});
  }
  await context.close();
}
for (const route of ['', 'work/agent-ops-console']) {
  const context = await browser.newContext({viewport: {width:1440,height:900}, recordVideo:{dir:`${out}/recordings/before`,size:{width:1440,height:900}}});
  const page=await context.newPage();
  await page.goto(`${base}/${route}${route ? '/' : ''}`, {waitUntil:'networkidle'});
  const h=await page.evaluate(()=>document.documentElement.scrollHeight);
  for(let y=0;y<h;y+=600){await page.evaluate(y=>window.scrollTo(0,y),y); await page.waitForTimeout(500);}
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.waitForTimeout(800);
  const video=page.video();
  await context.close();
  await video.saveAs(`${out}/recordings/before/${route ? 'agent-ops':'home'}-walkthrough.webm`);
}
await browser.close();
await writeFile(`${out}/baseline.json`, JSON.stringify({ref:'c0c69040801d60bcfc836f6728f2ae806911be1d',base,captured:new Date().toISOString(),result},null,2));
console.log(JSON.stringify({profiles:result.length, recordings:2}));
