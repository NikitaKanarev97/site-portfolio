import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import puppeteer from 'file:///D:/Claude-projects/learn/landing/app/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';
const dir = fileURLToPath(new URL('.', import.meta.url));
const origin = 'http://127.0.0.1:4322';
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const observations = [], errors = [];
try {
  const page = await browser.newPage();
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  page.on('requestfailed', r => { if (r.failure()?.errorText !== 'net::ERR_ABORTED') errors.push(`${r.failure()?.errorText} ${r.url()}`); });
  async function check(label, locale, width) {
    await page.evaluate(() => document.fonts.ready);
    const data = await page.evaluate(() => ({ url: location.href, lang: document.documentElement.lang, text: document.body.innerText, width: innerWidth, scroll: document.documentElement.scrollWidth, brokenImages: [...document.images].filter(i => !i.complete || !i.naturalWidth).map(i => i.src), resources: performance.getEntriesByType('resource').map(r => r.name) }));
    observations.push({ label, ...data });
    writeFileSync(`${dir}browser.json`, JSON.stringify({ observations, errors }, null, 2));
    assert.equal(data.lang, locale, label);
    assert(data.text.length > 150, label);
    assert.equal(data.width, width);
    assert(data.scroll <= width + 1, `${label}: overflow`);
    assert.equal(data.brokenImages.length, 0, label);
    if (locale === 'en') assert(!/[А-Яа-яЁё]/.test(data.text), `${label}: Cyrillic`);
    assert.equal(errors.length, 0, errors.join('\n'));
    console.log(`PASS ${locale} ${width} ${label}`);
    return data;
  }
  for (const width of [1440, 375]) for (const locale of ['en', 'ru']) {
    await page.setViewport({ width, height: 1000, deviceScaleFactor: 1 });
    for (const route of ['home', 'material/onvif-not-found', 'trajectory/proekt', 'player/proekt/0']) {
      await page.goto(`${origin}/prototypes/learn/${route}?lang=${locale}`, { waitUntil: 'networkidle0' });
      const before = await check(route, locale, width);
      await page.reload({ waitUntil: 'networkidle0' });
      const after = await check(`${route} reload`, locale, width);
      assert.equal(new URL(before.url).pathname, new URL(after.url).pathname);
      if (route.startsWith('player')) await page.screenshot({ path: `${dir}${locale}-${width}-player.png` });
    }
    await page.goto(`${origin}/prototypes/learn-landing/?lang=${locale}`, { waitUntil: 'networkidle0' });
    await check('landing query locale', locale, width);
    assert.equal(new URL(page.url()).pathname, `/prototypes/learn-landing/${locale === 'en' ? 'en/' : ''}`);
    await page.screenshot({ path: `${dir}${locale}-${width}-landing.png` });
    await page.reload({ waitUntil: 'networkidle0' });
    await check('landing reload', locale, width);
    const href = await page.$eval('.header-action', a => a.getAttribute('href'));
    assert.equal(href, `/prototypes/learn/home?lang=${locale}`);
    await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), page.click('.header-action')]);
    await check('landing to product click', locale, width);
    assert.equal(new URL(page.url()).pathname, '/prototypes/learn/home');
  }
  await page.setJavaScriptEnabled(false);
  for (const width of [1440, 375]) {
    await page.setViewport({ width, height: 1000 });
    await page.goto(`${origin}/prototypes/learn-landing/en/`, { waitUntil: 'networkidle0' });
    await check('landing EN without JavaScript', 'en', width);
    await page.screenshot({ path: `${dir}en-${width}-no-js.png` });
  }
  console.log(`PASS ${observations.length} observations; ${errors.length} browser/network errors`);
} finally { await browser.close(); }
