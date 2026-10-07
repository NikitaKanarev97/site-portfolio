import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import puppeteer from 'file:///D:/Claude-projects/learn/landing/app/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const output = fileURLToPath(new URL('./06-evidence/', import.meta.url));
const observations = [];
try {
  await browser.defaultBrowserContext().overridePermissions('http://127.0.0.1:4406', ['clipboard-read','clipboard-write','clipboard-sanitized-write']);
  const page = await browser.newPage();
  await page.setViewport({ width: 360, height: 900 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  for (const locale of ['en','ru']) {
    const path = locale === 'ru' ? '/ru/' : '/';
    await page.goto('http://127.0.0.1:4406' + path, { waitUntil: 'networkidle0' });
    await page.$eval('[data-copy-trigger]', node => node.focus());
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => document.querySelector('[data-copy-trigger]').dataset.state === 'copied');
    assert.match(await page.$eval('[data-copy-status]', node => node.textContent), locale === 'ru' ? /скопирован/ : /copied/);
    await page.waitForFunction(() => document.querySelector('[data-copy-trigger]').dataset.state === 'default');
    await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable:true, value: { writeText: () => Promise.reject(new Error('denied')) } }));
    await page.$eval('[data-copy-trigger]', node => node.focus());
    await page.keyboard.press('Space');
    await page.waitForFunction(() => !document.querySelector('[data-copy-failure]').hidden);
    const data = await page.evaluate(() => ({
      hint: document.querySelector('[data-copy-hint]').textContent,
      selectable: getComputedStyle(document.querySelector('[data-copy-hint]')).userSelect,
      overflow: document.documentElement.scrollWidth - innerWidth,
      failure: document.querySelector('[data-copy-failure]').textContent,
    }));
    assert.equal(data.hint, 'nikita.kanarev.dev@outlook.com');
    assert.equal(data.selectable, 'all');
    assert.equal(data.overflow, 0);
    await page.screenshot({ path: output + 'copy-failure-' + locale + '-360.png' });
    await page.$eval('#contact .copy-email__address', node => node.focus());
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.getAttribute('href')), locale === 'ru' ? '/cv-ru.pdf' : '/cv.pdf');
    await page.keyboard.press('Tab');
    assert.match(await page.evaluate(() => document.activeElement.getAttribute('href')), /linkedin/);
    observations.push({ locale, width: 360, keyboard: true, copy: 'success and rejection', ...data });
  }
  console.log('PASS mobile EN/RU keyboard, copy success, fallback and overflow');
} finally {
  writeFileSync(output + 'mobile-controls.json', JSON.stringify({ date: '2026-10-07', observations }, null, 2));
  await browser.close();
}
