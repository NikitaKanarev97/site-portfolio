import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
const require = createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const browser = await require('playwright').chromium.launch({ executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
const results = [];
for (const width of [1440, 1024, 390]) {
  const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 900 } });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Performance.enable');
  await page.goto('http://127.0.0.1:4321/preview/agent-ops-pilot/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const before = (await cdp.send('Performance.getMetrics')).metrics;
  const frames = await page.evaluate(async () => {
    const gaps = []; let last = performance.now();
    for (let i = 0; i < 200; i++) {
      await new Promise(requestAnimationFrame);
      const now = performance.now(); gaps.push(now - last); last = now;
      window.scrollBy(0, 48);
    }
    return gaps.sort((a,b) => a-b);
  });
  const after = (await cdp.send('Performance.getMetrics')).metrics;
  results.push({ width, frameMedian: frames[100], frameP95: frames[190], framesOver34ms: frames.filter(x => x > 34).length,
    costs: Object.fromEntries(['TaskDuration','ScriptDuration','LayoutDuration','RecalcStyleDuration'].map(n => [n, after.find(x => x.name === n).value - before.find(x => x.name === n).value])),
    geometry: await page.locator('.case-steps__step').evaluateAll(els => els.map(el => ({ height: el.offsetHeight, width: el.offsetWidth }))) });
  await page.close();
}
mkdirSync('outputs', { recursive: true });
writeFileSync(`outputs/agent-ops-${process.argv[2] || 'baseline'}-performance.json`, JSON.stringify(results,null,2));
console.log(results);
await browser.close();
