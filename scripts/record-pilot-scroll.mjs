import { createRequire } from 'node:module';
const require = createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const browser = await require('playwright').chromium.launch({ executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
const out = 'research/portfolio-benchmark/shots/pilot-stage1';
for (const width of [1440, 390]) {
  const viewport = { width, height: width === 390 ? 844 : 900 };
  const context = await browser.newContext({ viewport, recordVideo: { dir: out, size: viewport } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/preview/agent-ops-pilot/', { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 480) {
    await page.mouse.wheel(0, 480);
    await page.waitForTimeout(280);
  }
  console.log(width, await page.evaluate(() => ({ scroll: scrollY, height: document.documentElement.scrollHeight, url: location.pathname })));
  await context.close();
  await page.video().saveAs(`${out}/${width}-scroll.webm`);
}
await browser.close();
