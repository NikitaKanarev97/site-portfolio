import { createRequire } from 'node:module';
const require = createRequire('d:/Claude-projects/Agent-ops-console/package.json');
const { chromium } = require('playwright');
const b = await chromium.launch({ executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
for (const r of ['agent-ops-console','partner-portal','vet-clinic','pawly','learn']) {
  await p.goto(`http://127.0.0.1:4421/work/${r}/`, { waitUntil: 'networkidle' }); await p.waitForTimeout(2500);
  const d = await p.evaluate(() => [...document.querySelectorAll('.pin-spacer,[data-motion]')].map(e => ({ c: (e.className.baseVal ?? e.className).toString().slice(0, 50), m: e.dataset.motion, h: Math.round(e.getBoundingClientRect().height), y: Math.round(e.getBoundingClientRect().top + scrollY) })).filter(x => x.h > 1200 || /pin/.test(x.c)));
  console.log(r, JSON.stringify(d));
}
await b.close();
