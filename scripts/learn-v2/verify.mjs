/** Focused, real-browser checks of the delivered case, not source assertions. */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = await import(process.env.PW ?? 'playwright');
const origin = process.argv[2] ?? 'http://127.0.0.1:4405';
const out = 'audit/trassir-learn-case-v2/qa';
await mkdir(`${out}/controls`, { recursive: true });
const browser = await chromium.launch();
const results = [];
for (const locale of ['en', 'ru']) for (const width of [320, 375, 768]) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const path = `${locale === 'ru' ? '/ru' : ''}/work/learn/`;
  await page.goto(origin + path, { waitUntil: 'networkidle' });
  const dimensions = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }));
  assert.equal(dimensions.width, dimensions.scroll, `Overflow ${locale} ${width}`);
  assert.equal(await page.locator('.learn-case h1').count(), 1);
  assert.equal(await page.locator('html').getAttribute('lang'), locale);
  assert.equal(await page.locator('.learn-cover h1').evaluate(el => getComputedStyle(el).opacity), '1');
  assert.equal(await page.locator('.learn-cover h1').evaluate(el => getComputedStyle(el).fontFamily.includes('Onest')), true);
  const trigger = page.locator('.learn-cover__home [data-zoom-trigger]');
  const actualSource = await trigger.locator('img').evaluate(i => i.currentSrc);
  await trigger.focus();
  const focus = await trigger.evaluate(e => ({ style: getComputedStyle(e).outlineStyle, width: getComputedStyle(e).outlineWidth }));
  assert.notEqual(focus.style, 'none');
  await page.keyboard.press('Enter');
  await page.locator('[data-media-zoom][open]').waitFor();
  assert.equal(await page.locator('[data-media-zoom-image]').getAttribute('src'), actualSource);
  await page.screenshot({ path: `${out}/controls/${locale}-${width}-zoom.png` });
  await page.keyboard.press('Escape');
  assert.equal(await trigger.evaluate(e => e === document.activeElement), true, 'Zoom focus return');
  const summary = page.locator('.learn-model summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('.learn-model').getAttribute('open'), '');
  await page.locator('.learn-model').screenshot({ path: `${out}/controls/${locale}-${width}-model.png` });
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('.learn-model').getAttribute('open'), null);
  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  const alternates = await page.locator('link[hreflang]').evaluateAll(links => links.map(l => ({ lang: l.hreflang, href: l.href })));
  const localLinks = [...new Set(await page.locator('.learn-case a').evaluateAll(aa => aa.map(a => a.getAttribute('href')).filter(h => h?.startsWith('/') && !h.startsWith('//'))))];
  const failedLinks = [];
  for (const href of localLinks) { const response = await context.request.get(origin + href); if (!response.ok()) failedLinks.push(`${response.status()} ${href}`); }
  assert.deepEqual(failedLinks, []);
  assert.deepEqual(errors, []);
  await page.goto(origin + `${locale === 'ru' ? '/ru/' : '/'}`, { waitUntil: 'networkidle' });
  const homeCard = page.locator('#work-learn');
  await homeCard.scrollIntoViewIfNeeded();
  await homeCard.screenshot({ path: `${out}/controls/${locale}-${width}-home.png` });
  await homeCard.locator('.learn-home [href]').click();
  await page.waitForURL(`**${path}`);
  assert.equal(await page.locator('.learn-case').getAttribute('data-story-version'), 'learn-v2');
  if (width === 768) {
    await page.locator('.navbar__locale a').filter({ hasText: locale === 'en' ? 'RU' : 'EN' }).first().click();
    await page.waitForURL(url => url.pathname.replace(/\/$/, '') === `${locale === 'en' ? '/ru' : ''}/work/learn`);
    assert.equal(await page.locator('html').getAttribute('lang'), locale === 'en' ? 'ru' : 'en');
  }
  results.push({ locale, width, dimensions, focus, canonical, alternates, localLinks: localLinks.length, errors, zoom: 'keyboard/currentSrc/Escape/focus return', diagram: 'keyboard toggle', homeCard: 'opens same-locale V2' });
  await context.close();
}
for (const locale of ['en', 'ru']) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(origin + `${locale === 'ru' ? '/ru' : ''}/work/learn/`);
  assert.equal(await page.locator('.learn-cover h1').isVisible(), true);
  await page.locator('.learn-model summary').click();
  assert.equal(await page.locator('.learn-model').getAttribute('open'), '');
  const src = await page.locator('.learn-cover__home [data-zoom-trigger]').getAttribute('href');
  assert.equal((await context.request.get(origin + src)).ok(), true);
  await page.screenshot({ path: `${out}/controls/${locale}-390-no-js.png` });
  results.push({ locale, mode: 'no-JS', heading: 'visible', diagram: 'native disclosure', imageFallback: 'HTTP 200' });
  await context.close();
}
const context = await browser.newContext();
const page = await context.newPage();
const live = [];
for (const locale of ['en', 'ru']) for (const route of ['home', 'material/onvif-not-found', 'trajectory/puskonaladka', `../learn-landing/${locale === 'en' ? 'en/' : ''}`]) {
  const url = `https://kanarev.com/prototypes/learn/${route}${route.includes('landing') ? '' : `?lang=${locale}`}`;
  const response = await page.goto(url, { waitUntil: 'networkidle' });
  assert.equal(response?.status(), 200);
  const text = await page.locator('body').innerText();
  const expected = locale === 'ru' ? /пусконалад|камер|программ|знать|уметь/i : /commission|camera|program|know how/i;
  assert.match(text, expected);
  live.push({ requested: url, final: page.url(), status: response.status(), lang: locale, sample: text.slice(0, 180) });
}
await context.close();
await browser.close();
await writeFile(`${out}/verification.json`, JSON.stringify({ checked: '2026-10-31', results, live, scope: 'Portfolio case UI and live public entry routes; no claim of all six product branches integrated.' }, null, 2));
console.log(`${results.length} responsive/interaction/no-JS checks; ${live.length} live routes; passed`);
