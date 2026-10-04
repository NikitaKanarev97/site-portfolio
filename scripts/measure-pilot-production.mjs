/** Repeatable local production probe. CPU emulation is not a physical-device test. */
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
const require = createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const browser = await require('playwright').chromium.launch({ executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
const base = process.env.PILOT_BASE || 'http://127.0.0.1:4330';
const results = [];
const samples = Math.max(1, Number(process.env.PILOT_SAMPLES || 1));
for (const width of [1440, 390]) for (const cpu of [1, 6]) for (let sample = 1; sample <= samples; sample++) {
  const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpu });
  await cdp.send('Performance.enable');
  await page.addInitScript(() => {
    window.__paintProbe = { lcp: null, cls: 0 };
    new PerformanceObserver(list => {
      const last = list.getEntries().at(-1);
      window.__paintProbe.lcp = { ms: last.startTime, element: last.element?.tagName, url: last.url };
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__paintProbe.cls += entry.value;
    }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto(`${base}/preview/agent-ops-pilot/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const startup = await page.evaluate(() => ({ ...window.__paintProbe,
    production: !window.__dsMotionDebug,
    transferredKB: performance.getEntriesByType('resource').reduce((n, r) => n + r.transferSize, 0) / 1024,
  }));
  const before = (await cdp.send('Performance.getMetrics')).metrics;
  const gaps = await page.evaluate(async () => {
    const gaps = []; let last = performance.now();
    for (let i = 0; i < 200; i++) {
      await new Promise(requestAnimationFrame);
      const now = performance.now(); gaps.push(now - last); last = now; scrollBy(0, 48);
    }
    return gaps.sort((a, b) => a - b);
  });
  const after = (await cdp.send('Performance.getMetrics')).metrics;
  results.push({ width, cpu, sample, startup, frameMedian: gaps[100], frameP95: gaps[190], framesOver34ms: gaps.filter(x => x > 34).length,
    costs: Object.fromEntries(['TaskDuration', 'ScriptDuration', 'LayoutDuration', 'RecalcStyleDuration'].map(n =>
      [n, after.find(x => x.name === n).value - before.find(x => x.name === n).value])), errors });
  await page.close();
}
await browser.close();
mkdirSync('outputs', { recursive: true });
writeFileSync(`outputs/agent-ops-${process.argv[2] || 'stage3'}-production.json`, JSON.stringify({ base, network: 'local, unthrottled', samplesPerProfile: samples, results }, null, 2));
console.log(JSON.stringify(results, null, 2));
if (results.some(r => r.errors.length || !r.startup.production)) throw new Error('Production probe failed');
