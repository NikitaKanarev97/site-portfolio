import { createRequire } from 'node:module';
import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
const require = createRequire(path.resolve('../b2b-dssl/package.json'));
const { chromium } = require('playwright');
const browser = await chromium.launch({ headless: true });
const state = JSON.parse(await readFile('../learn/audit/product-polish/evidence/07/state-marina-ready.json', 'utf8'));
state.toasts = [];
const reports = [];
try {
  for (const [name, url] of [
    ['source-live', 'http://127.0.0.1:5174/practice?trajectoryId=proekt&lang=ru'],
    ['portfolio-export', 'http://127.0.0.1:4322/prototypes/learn/practice?trajectoryId=proekt&lang=ru'],
    ['deployed', 'https://learn-pi-bice.vercel.app/practice?trajectoryId=proekt'],
  ]) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    await context.addInitScript(state => {
      sessionStorage.setItem('learn-prototype-v1', JSON.stringify(state));
      sessionStorage.setItem('learn-account-v2:' + encodeURIComponent(state.session.identifier), JSON.stringify(state));
    }, state);
    const page = await context.newPage();
    page.setDefaultTimeout(8000);
    try {
      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
      if (response.status() !== 200) throw new Error(`HTTP ${response.status()}`);
      await page.getByRole('radio').nth(1).check();
      await page.getByRole('button', { name: 'Проверить ответ', exact: true }).click();
      await page.getByText('Ваш ответ', { exact: true }).waitFor();
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(document.getAnimations().map(animation => animation.finished.catch(() => {})));
      });
      const data = await page.evaluate(() => ({
        title: document.title,
        url: location.href,
        states: [...document.querySelectorAll('[role="radio"][data-state], [data-variant="success"], [data-variant="error"]')].map(el => ({
          state: el.getAttribute('data-state') || el.getAttribute('data-variant'),
          text: el.textContent.trim(),
          background: getComputedStyle(el).backgroundColor,
          border: getComputedStyle(el).borderColor,
        })),
      }));
      await page.screenshot({ path: `tasks/learn-case/reports/evidence-09/practice-${name}.png`, fullPage: true });
      reports.push({ name, status: 'checked', ...data });
    } catch (e) { reports.push({ name, status: 'unavailable', error: String(e), url: page.url() }); }
    await context.close();
  }
} finally { await browser.close(); }
await writeFile('tasks/learn-case/reports/evidence-09/practice-provenance.json', JSON.stringify({ checkedAt: new Date().toISOString(), reports }, null, 2));
console.log(JSON.stringify(reports, null, 2));
