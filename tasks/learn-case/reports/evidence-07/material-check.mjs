import { createRequire } from 'node:module';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const require = createRequire(path.resolve('../b2b-dssl/package.json'));
const { chromium } = require('playwright');
const origin = process.argv[2] ?? 'http://127.0.0.1:5174';
const base = process.argv[3] ?? '';
const label = base ? 'export' : 'source';
const out = 'tasks/learn-case/reports/evidence-07';
const browser = await chromium.launch({ headless: true });
const observations = [];
try {
  for (const lang of ['en', 'ru']) for (const width of [1440, 375]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    for (const route of ['/material/onvif-not-found', '/player/puskonaladka/2']) {
      await page.goto(`${origin}${base}${route}?lang=${lang}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const article = page.locator('[data-material-body="onvif-not-found"]');
      await article.waitFor();
      const text = await article.innerText();
      assert(text.includes(lang === 'en' ? 'Learning example:' : 'Учебный пример:'));
      for (const address of ['192.168.1.0/24', '192.168.1.10', '192.168.1.101', '192.168.1.102']) assert(text.includes(address));
      if (lang === 'en') assert(!/[А-Яа-яЁё]/.test(text));
      assert.equal(await article.locator('img').count(), 0);
      assert.equal(await article.locator('h2').count(), 5);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      assert.equal(errors.length, 0, errors.join('\n'));
      observations.push({ lang, width, route, text, errors: [...errors] });
      if (route.startsWith('/material')) {
        const [download] = await Promise.all([
          page.waitForEvent('download'),
          page.getByRole('button', { name: lang === 'en' ? 'Download text · HTML' : 'Скачать текст · HTML', exact: true }).click(),
        ]);
        const html = await readFile(await download.path(), 'utf8');
        assert(html.includes('192.168.1.101') && html.includes('192.168.1.102'));
        if (lang === 'en') assert(!/[А-Яа-яЁё]/.test(html));
        await page.screenshot({ path: `${out}/${label}-${lang}-${width}.png`, fullPage: true });
      }
    }
    await context.close();
  }
} finally { await browser.close(); }
await writeFile(`${out}/${label}-material-check.json`, JSON.stringify(observations, null, 2));
console.log(`PASS ${label}: ${observations.length} material/player locale/viewport checks; 4 HTML downloads`);
