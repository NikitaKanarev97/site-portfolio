/** Verify the shipped portfolio -> bilingual Learn handoff and reloads. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { verifyImages } from './lib/verify-images.mjs';

const require = createRequire(path.resolve(process.env.PLAYWRIGHT_REPO ?? '../b2b-dssl', 'package.json'));
const { chromium, devices } = require('playwright');
const origin = new URL(process.env.PORTFOLIO_ORIGIN ?? 'http://127.0.0.1:4322').origin;
const browser = await chromium.launch({ headless: true });
const failures = [];
const reports = [];
const ctaChecks = [];
const productRoutes = ['/home', '/search?q=ONVIF', '/catalog', '/material/onvif-not-found', '/trajectory/proekt', '/my', '/login', '/verify', '/practice?trajectoryId=proekt', '/assessment/intro?trajectoryId=proekt', '/history'];

const casePath = (lang) => lang === 'ru' ? '/ru/work/learn/' : '/work/learn/';

function hasDestination(url, pathname, language) {
  const languages = url.searchParams.getAll('lang');
  return url.origin === origin && url.pathname === pathname &&
    (language ? languages.length === 1 && languages[0] === language : languages.length === 0);
}

async function readCaseCtas(page, lang) {
  const anchors = await page.locator('#learn-cover .learn-cover__authorship a[href], #outcome .learn-outcome__links a[href]').all();
  const destinations = [
    { id: 'product-cover', pathname: '/prototypes/learn/home', language: lang },
    { id: 'product-outcome', pathname: '/prototypes/learn/home', language: lang },
    { id: 'landing-outcome', pathname: lang === 'en' ? '/prototypes/learn-landing/en/' : '/prototypes/learn-landing/' },
  ];
  assert.equal(anchors.length, destinations.length, 'Expected two product CTAs and one landing CTA');
  return Promise.all(destinations.map(async (destination, index) => {
    const anchor = anchors[index];
    const { href, target } = await anchor.evaluate((link) => ({ href: link.href, target: link.target }));
    assert(hasDestination(new URL(href), destination.pathname, destination.language),
      `${destination.id}: unexpected destination ${href}`);
    assert.equal(target, '_blank', `${destination.id}: expected a new tab`);
    return { ...destination, anchor, href, target };
  }));
}

async function verifyCaseClicks(lang, width) {
  const mobile = width === 390;
  const viewport = { width, height: mobile ? 844 : 1000 };
  const context = await browser.newContext({
    ...(mobile ? devices['iPhone 13'] : {}),
    viewport, deviceScaleFactor: 1, reducedMotion: 'reduce',
  });
  const browserErrors = [];
  context.on('page', (page) => {
    page.on('pageerror', (error) => browserErrors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') browserErrors.push(message.text());
    });
  });

  try {
    const page = await context.newPage();
    const source = new URL(casePath(lang), origin).href;
    assert.equal((await page.goto(source, { waitUntil: 'networkidle' })).status(), 200);
    assert.equal(page.url(), source, 'Case left the preview origin');
    assert.equal(await page.locator('html').getAttribute('lang'), lang, 'Case locale');
    const ctas = await readCaseCtas(page, lang);
    const check = { source, lang, viewport, mobile, ctas: [], browserErrors };
    ctaChecks.push(check);
    for (const { id, anchor, href, target, pathname, language } of ctas) {
      const [popup, response] = await Promise.all([
        page.waitForEvent('popup'),
        context.waitForEvent('response', {
          predicate: (reply) => reply.url() === href && reply.request().isNavigationRequest(),
        }),
        anchor.click(),
      ]);
      const recordDestination = async (status) => {
        await popup.locator('h1').first().waitFor();
        const url = new URL(popup.url());
        const htmlLang = await popup.locator('html').getAttribute('lang');
        assert.equal(status, 200, `${id}: HTTP status`);
        assert(hasDestination(url, pathname, language), `${id}: unexpected page ${url.href}`);
        assert.equal(htmlLang, lang, `${id}: HTML language`);
        return { url: url.href, httpStatus: status, htmlLang };
      };
      await popup.waitForLoadState('networkidle');
      const opened = await recordDestination(response.status());
      const reload = await popup.reload({ waitUntil: 'networkidle' });
      const reloaded = await recordDestination(reload?.status());
      assert.equal(page.url(), source, `${id}: opening the tab changed the case URL`);
      check.ctas.push({ id, href, target, opened, reloaded });
      await popup.close();
    }
    assert.deepEqual(browserErrors, [], 'Browser errors during CTA checks');
  } finally {
    await context.close();
  }
}

async function inspect(page, url, lang, width, kind) {
  const errors = [];
  const onError = (error) => errors.push(error.message);
  page.on('pageerror', onError);
  await page.setViewportSize({ width, height: 1000 });
  let response = await page.goto(new URL(url, origin).href, { waitUntil: 'networkidle' });
  // Same-document anchors have no navigation response. Reload their actual
  // destination to also prove that this deep link has a valid HTTP entry.
  if (!response) response = await page.reload({ waitUntil: 'networkidle' });
  const brokenImages = await verifyImages(page);
  const data = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    overflow: document.documentElement.scrollWidth - innerWidth,
    text: document.body.innerText,
    links: [...document.querySelectorAll('a[href]')].map((link) => link.getAttribute('href')),
  }));
  page.off('pageerror', onError);
  const label = `${lang} ${width}px ${url}`;
  if (response?.status() !== 200) failures.push(`${label}: HTTP ${response?.status()}`);
  if (data.lang !== lang) failures.push(`${label}: lang=${data.lang}`);
  if (data.overflow > 1) failures.push(`${label}: overflow ${data.overflow}px`);
  if (errors.length) failures.push(`${label}: ${errors.join(' | ')}`);
  if (brokenImages.length) failures.push(`${label}: missing images ${brokenImages.join(', ')}`);
  if (lang === 'en' && /[А-Яа-яЁё]/.test(data.text)) {
    failures.push(`${label}: Russian text: ${data.text.match(/[^\n]*[А-Яа-яЁё][^\n]*/g)?.join(' | ')}`);
  }
  if (!data.text.trim()) failures.push(`${label}: empty page`);
  if (kind === 'case') {
    const alternateCase = casePath(lang === 'en' ? 'ru' : 'en');
    if (!data.links.some((href) => hasDestination(new URL(href, page.url()), alternateCase))) {
      failures.push(`${label}: missing same-origin locale link ${alternateCase}`);
    }
    try {
      await readCaseCtas(page, lang);
    } catch (error) {
      failures.push(`${label}: ${error.message}`);
    }
  }
  reports.push({ url: page.url(), lang, width, overflow: data.overflow, kind });
  return data;
}

try {
  for (const lang of ['en', 'ru']) {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    for (const width of [360, 768, 1440]) {
      const home = await inspect(page, lang === 'ru' ? '/ru/' : '/', lang, width, 'home');
      assert(home.links.includes(`${lang === 'ru' ? '/ru' : ''}/work/learn`), 'Missing Learn card');
      await inspect(page, casePath(lang), lang, width, 'case');
      for (const route of productRoutes) {
        const url = new URL(`/prototypes/learn${route}`, origin);
        url.searchParams.set('lang', lang);
        await inspect(page, url.href, lang, width, 'product');
      }
      await inspect(page, `/prototypes/learn-landing/?lang=${lang}`, lang, width, 'landing');
    }
    // A link used inside the product must retain locale and survive refresh.
    await page.goto(`${origin}/prototypes/learn/home?lang=${lang}`, { waitUntil: 'networkidle' });
    const productLink = page.locator('a[href*="/catalog"]').first();
    await productLink.click();
    await page.waitForURL(/catalog/);
    assert.equal(new URL(page.url()).searchParams.get('lang'), lang, 'Product navigation lost locale');
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('html').getAttribute('lang'), lang, 'Reload lost locale');
    // Discover actual editorial routes from the shipped landing rather than
    // guessing filenames; query dispatch may canonicalise EN to /en/.
    const landing = await inspect(page, `/prototypes/learn-landing/?lang=${lang}`, lang, 1440, 'landing');
    const internal = [...new Set(landing.links.filter((href) => href?.startsWith('/prototypes/learn-landing/')))];
    for (const href of internal) await inspect(page, href, lang, 1440, 'landing-detail');
    await context.close();
    for (const width of [1440, 390]) {
      try {
        await verifyCaseClicks(lang, width);
      } catch (error) {
        failures.push(`${lang} ${width}px CTA clicks: ${error.message}`);
      }
    }
  }
  const manifest = JSON.parse(await readFile('public/prototypes/learn-manifest.json', 'utf8'));
  for (const route of manifest.routes) {
    await readFile(path.join('public/prototypes/learn', route.slice(1), 'index.html'));
  }
} catch (error) {
  failures.push(error.stack ?? String(error));
} finally {
  await browser.close();
}
await mkdir('.tmp/learn', { recursive: true });
await writeFile('.tmp/learn/integration-report.json', JSON.stringify({ chromium: browser.version(), reports, ctaChecks, failures }, null, 2));
const clickCount = ctaChecks.reduce((total, check) => total + check.ctas.length, 0);
console.log(`${reports.length} page/locale/viewport checks, ${clickCount} CTA clicks and reloads; ${failures.length} failures.`);
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
}
