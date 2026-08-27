/** Выводит видимые строки с латиницей на русских маршрутах кейсов. */
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(path.join('d:/Claude-projects/b2b-dssl', 'package.json'));
const { chromium } = require('playwright');

const targets = {
  dssl: {
    base: 'http://localhost:5199/b2b/ru',
    routes: ['/', '/resolution-center', '/resolution-center/candidate-select', '/cart/change-review', '/fulfillment', '/dashboard'],
  },
  vet: {
    base: 'http://localhost:5200/ru',
    routes: ['/', '/app/vet-day-queue', '/app/schedule', '/app/visit-quick-trace', '/app/dose-calculator', '/app/discharge-preview', '/app/patient-card'],
  },
  pawly: {
    base: 'http://localhost:5201/ru',
    routes: ['/app', '/app/owner-home', '/app/handover-photo-review', '/app/address-input', '/app/walker-profile', '/app/replacement-offer'],
  },
  agent: {
    base: 'http://127.0.0.1:5302/ru',
    routes: ['/', '/screens/review-queue', '/screens/run-detail?run=run-cl-promo-01', '/screens/action-approvals', '/screens/cluster-detail?cluster=cl-promo', '/screens/trace-gap-state', '/screens/consequence-preview', '/screens/correction?run=run-cl-promo-01', '/screens/autonomy', '/screens/quality-dashboard', '/screens/policy-version-diff'],
  },
};

const name = process.argv[2];
if (!targets[name]) throw new Error(`Укажите один из: ${Object.keys(targets).join(', ')}`);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
for (const route of targets[name].routes) {
  await page.goto(`${targets[name].base}${route}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800);
  const lines = await page.evaluate(() => [...new Set(document.body.innerText
    .split('\n')
    .map(line => line.trim())
    .filter(line => /[A-Za-z]{2,}/.test(line)))]);
  console.log(`\n## ${route}`);
  for (const line of lines) console.log(line);
}
await browser.close();
