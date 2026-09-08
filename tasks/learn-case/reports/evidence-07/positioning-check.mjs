import { createRequire } from 'node:module';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const require = createRequire(path.resolve('../b2b-dssl/package.json'));
const { chromium } = require('playwright');
const origin = 'http://127.0.0.1:4322';
const out = 'tasks/learn-case/reports/evidence-07';
const browser = await chromium.launch({ headless: true });
const report = [];
try {
  for (const lang of ['en', 'ru']) for (const width of [1440, 375]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const state = JSON.parse(await readFile('../learn/audit/product-polish/evidence/07/state-marina-final.json', 'utf8'));
    state.toasts = [];
    if (lang === 'en') {
      state.session.company = state.verification.company = 'Learning Example LLC';
      for (const c of state.certificates) c.company = 'Learning Example LLC';
    }
    await context.addInitScript(state => {
      sessionStorage.setItem('learn-prototype-v1', JSON.stringify(state));
      sessionStorage.setItem('learn-account-v2:' + encodeURIComponent(state.session.identifier), JSON.stringify(state));
    }, state);
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    for (const route of [
      `${lang === 'ru' ? '/ru' : ''}/work/learn/`,
      '/prototypes/learn-landing/',
      '/prototypes/learn/my',
      '/prototypes/learn/trajectory/proekt',
      '/prototypes/learn/assessment/intro?trajectoryId=proekt',
      '/prototypes/learn/certificate?documentId=document-35ca2928-5cf8-4599-9509-49d63c89229d',
    ]) {
      const url = new URL(route, origin); url.searchParams.set('lang', lang);
      await page.goto(url.href, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const text = await page.locator('body').innerText();
      await writeFile(`${out}/positioning-last-page.txt`, text);
      assert(!/independent (?:design |learning )?concept|self-initiated|самостоятельный учебный концепт|независимый дизайн-концепт/i.test(text));
      if (lang === 'en') assert(!/[А-Яа-яЁё]/.test(text));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, route);
      assert.equal(errors.length, 0, errors.join('\n'));
      if (route.includes('/work/learn')) {
        assert(text.toLowerCase().includes(lang === 'en' ? 'a real project, reconsidered' : 'реальный проект, пересмотренный'));
        assert(text.includes(lang === 'en' ? 'several months' : 'несколько месяцев'));
        await page.screenshot({ path: `${out}/case-header-${lang}-${width}.png` });
      }
      if (route.includes('learn-landing')) assert(text.includes(lang === 'en' ? 'A work project revisited in 2026' : 'Рабочий проект, переосмысленный в 2026'));
      if (route.includes('/certificate')) {
        assert(text.includes(lang === 'en' ? 'Portfolio version of a work project' : 'Портфолио-версия рабочего проекта'));
        const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: lang === 'en' ? 'Download document · HTML' : 'Скачать документ · HTML', exact: true }).click()]);
        const html = await readFile(await download.path(), 'utf8');
        assert(!/independent concept|самостоятельного концепта/.test(html));
        assert(html.includes(lang === 'en' ? 'not an official DSSL certificate' : 'Не является официальным сертификатом DSSL'));
      }
      report.push({ lang, width, url: page.url(), text });
    }
    await context.close();
  }
} finally { await browser.close(); }
await writeFile(`${out}/positioning-check.json`, JSON.stringify(report, null, 2));
console.log(`PASS ${report.length} positioning/layout observations; 4 document downloads.`);
