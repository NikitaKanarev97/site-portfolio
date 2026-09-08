/** Stage 09: verify the built case, actual clicks, image geometry and metadata. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const require = createRequire(path.resolve(process.env.PLAYWRIGHT_REPO ?? '../b2b-dssl', 'package.json'));
const { chromium } = require('playwright');
const origin = process.env.PORTFOLIO_ORIGIN ?? 'http://127.0.0.1:4322';
const out = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1');
const browser = await chromium.launch({ headless: true });
const report = { origin, checkedAt: new Date().toISOString(), pages: [], clicks: [], failures: [] };
const hash = (data) => createHash('sha256').update(data).digest('hex');
async function images(page) {
  return page.evaluate(async () => {
    const images = [...document.images].filter(i => i.getAttribute('src') || i.getAttribute('srcset'));
    return Promise.all(images.map(async i => {
      i.loading = 'eager';
      let error = '';
      try { await Promise.race([i.decode(), new Promise((_, reject) => setTimeout(() => reject(new Error('image timeout')), 15000))]); }
      catch (e) { error = String(e); }
      const rect = i.getBoundingClientRect();
      return { src: i.currentSrc, width: i.naturalWidth, height: i.naturalHeight, attrWidth: Number(i.getAttribute('width')), attrHeight: Number(i.getAttribute('height')), renderedWidth: rect.width, renderedHeight: rect.height, error };
    }));
  });
}
async function clickDestination(page, selector, lang, label) {
  const link = page.locator(selector).first();
  const href = await link.getAttribute('href');
  const popupPromise = page.waitForEvent('popup');
  await link.click();
  const popup = await popupPromise;
  await popup.waitForLoadState('networkidle');
  assert.equal(await popup.locator('html').getAttribute('lang'), lang, label);
  await popup.reload({ waitUntil: 'networkidle' });
  assert.equal(await popup.locator('html').getAttribute('lang'), lang, `${label} reload`);
  assert((await popup.locator('body').innerText()).trim().length > 100, `${label} empty`);
  report.clicks.push({ label, lang, href, destination: popup.url(), reload: true });
  await popup.close();
}
try {
  for (const lang of ['en', 'ru']) for (const width of [1440, 375]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    const prefix = lang === 'ru' ? '/ru' : '';
    const casePath = `${prefix}/work/learn/`;
    const response = await page.goto(origin + casePath, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200);
    assert.equal(hash(await response.body()), hash(await readFile(`dist${casePath}index.html`)), 'Preview must serve the new build');
    const imageReport = await images(page);
    assert.equal(imageReport.length, 11);
    for (const img of imageReport) {
      assert(!img.error, `${img.src}: ${img.error}`);
      const mediaPath = new URL(img.src).pathname;
      assert(mediaPath.startsWith(`/media/case-learn${lang === 'ru' ? '-ru' : ''}/`));
      assert.equal(hash(await (await context.request.get(img.src)).body()), hash(await readFile(`public${mediaPath}`)), 'Preview media must be current');
      assert.equal(hash(await readFile(`dist${mediaPath}`)), hash(await readFile(`public${mediaPath}`)), 'dist media must be current');
      if (!mediaPath.includes('/cover/')) {
        assert.equal(img.attrWidth, img.width, `${mediaPath} intrinsic width`);
        assert.equal(img.attrHeight, img.height, `${mediaPath} intrinsic height`);
        assert(Math.abs(img.renderedWidth / img.renderedHeight - img.width / img.height) < 0.01, `${mediaPath} cropped`);
      }
    }
    const metadata = await page.evaluate(() => ({
      lang: document.documentElement.lang,
      overflow: document.documentElement.scrollWidth - innerWidth,
      canonical: document.querySelector('link[rel=canonical]').href,
      alternates: [...document.querySelectorAll('link[hreflang]')].map(e => ({ lang: e.hreflang, href: e.href })),
      og: Object.fromEntries([...document.querySelectorAll('meta[property^="og:"]')].map(e => [e.getAttribute('property'), e.content])),
      captions: [...document.querySelectorAll('figcaption')].filter(e => e.textContent.trim()).map(e => e.textContent.trim()),
    }));
    assert.equal(metadata.lang, lang);
    assert(metadata.overflow <= 1);
    assert.equal(metadata.canonical, `https://kanarev.com${casePath}`);
    for (const [alternate, suffix] of [['en', '/work/learn/'], ['ru', '/ru/work/learn/'], ['x-default', '/work/learn/']]) {
      assert(metadata.alternates.some(a => a.lang === alternate && a.href === `https://kanarev.com${suffix}`));
    }
    assert.equal(metadata.og['og:url'], metadata.canonical);
    assert(metadata.og['og:title'].includes('TRASSIR Learn'));
    assert(metadata.og['og:image'].includes(`work-learn${lang === 'ru' ? '-ru' : ''}`));
    const ogResponse = await context.request.get(origin + new URL(metadata.og['og:image']).pathname);
    assert.equal(ogResponse.status(), 200);
    const ogSize = await sharp(await ogResponse.body()).metadata();
    assert.equal(ogSize.width, 1200);
    assert.equal(ogSize.height, 630);
    await writeFile(path.join(out, `og-${lang}.png`), await ogResponse.body());
    await page.screenshot({ path: path.join(out, `${lang}-${width}-top.png`) });
    for (const [name, selector] of [['cover', '.case-cover'], ['comparison', '.case-comparison'], ['decisions', '.case-decisions'], ['system', '.case-system']]) {
      const element = page.locator(selector);
      if (await element.count()) await element.screenshot({ path: path.join(out, `${lang}-${width}-${name}.png`) });
    }
    await page.screenshot({ path: path.join(out, `${lang}-${width}-full.png`), fullPage: true });
    const triggers = page.locator('[data-zoom-trigger]');
    assert.equal(await triggers.count(), 8);
    for (let i = 0; i < 8; i++) {
      const trigger = triggers.nth(i);
      const src = await trigger.getAttribute('data-zoom-src');
      await trigger.click();
      const dialog = page.locator('[data-media-zoom]');
      await dialog.waitFor({ state: 'visible' });
      const loaded = await dialog.locator('img').evaluate(async img => { await img.decode(); return { src: img.getAttribute('src'), width: img.naturalWidth, alt: img.alt }; });
      assert.equal(loaded.src, src);
      assert(loaded.width > 0 && loaded.alt.length > 10);
      if (i === 4) await page.screenshot({ path: path.join(out, `${lang}-${width}-zoom.png`) });
      if (i % 2) await page.locator('[data-media-zoom-close]').click();
      else await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'hidden' });
      assert(await trigger.evaluate(el => el === document.activeElement), 'Zoom returns focus');
    }
    for (const [selector, label] of [['.case-header a[href*="/prototypes/learn/home"]', 'header product'], ['.case-header a[href*="learn-landing"]', 'header landing'], ['.case-prototype a', 'body prototype']]) {
      await clickDestination(page, selector, lang, `${label} ${width}`);
    }
    if (width < 768) await page.locator('[data-navbar-trigger]').click();
    const otherPath = `${lang === 'en' ? '/ru' : ''}/work/learn/`;
    await page.locator(`[data-navbar] a[href="${otherPath}"]:visible`).click();
    await page.waitForURL(origin + otherPath);
    assert.equal(await page.locator('html').getAttribute('lang'), lang === 'en' ? 'ru' : 'en');
    await page.goto(origin + casePath, { waitUntil: 'networkidle' });
    await page.locator(`a[href="${prefix}/work/vet-clinic"]`).click();
    await page.waitForURL(/work\/vet-clinic/);
    assert.equal(await page.locator('html').getAttribute('lang'), lang);
    await page.goto(origin + `${prefix}/`, { waitUntil: 'networkidle' });
    const card = page.locator(`a[href="${prefix}/work/learn"]`);
    await card.scrollIntoViewIfNeeded();
    await images(page);
    await card.screenshot({ path: path.join(out, `${lang}-${width}-home-card.png`) });
    await card.click();
    await page.waitForURL(/work\/learn/);
    assert.equal(await page.locator('html').getAttribute('lang'), lang);
    assert.deepEqual(errors, []);
    report.pages.push({ lang, width, images: imageReport, zooms: 8, metadata, navigation: 'language, next case, home card passed', consoleErrors: errors });
    console.log(`${lang} ${width}: 11 images, 8 zooms, geometry, metadata, 3 demo links/reloads and navigation passed`);
    await context.close();
  }
  const response = await fetch(origin + '/sitemap.xml');
  const xml = await response.text();
  for (const prefix of ['', '/ru']) assert(xml.includes(`<loc>https://kanarev.com${prefix}/work/learn/</loc>`));
  assert(!xml.includes('/prototypes/'));
  report.sitemap = 'Both canonical case URLs; demos excluded';
} catch (e) {
  report.failures.push(e.stack);
  console.error(e);
  process.exitCode = 1;
} finally {
  await browser.close();
  report.status = report.failures.length ? 'fail' : 'pass';
  await writeFile(path.join(out, 'acceptance.json'), JSON.stringify(report, null, 2));
}
