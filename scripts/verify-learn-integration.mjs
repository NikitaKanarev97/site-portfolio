/** Verify the shipped portfolio -> bilingual Learn handoff and reloads. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { verifyImages } from './lib/verify-images.mjs';

const require = createRequire(path.resolve(process.env.PLAYWRIGHT_REPO ?? '../b2b-dssl', 'package.json'));
const { chromium } = require('playwright');
const origin = process.env.PORTFOLIO_ORIGIN ?? 'http://127.0.0.1:4322';
const browser = await chromium.launch({ headless: true });
const failures = [];
const reports = [];
const productRoutes = ['/home', '/search?q=ONVIF', '/catalog', '/material/onvif-not-found', '/trajectory/proekt', '/my', '/login', '/verify', '/practice?trajectoryId=proekt', '/assessment/intro?trajectoryId=proekt', '/history'];

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
    for (const required of [`/prototypes/learn/home?lang=${lang}`, `/prototypes/learn-landing/?lang=${lang}`, `${lang === 'en' ? '/ru' : ''}/work/learn/`]) {
      if (!data.links.some((link) => link === required || link === required.replace(/\/$/, ''))) failures.push(`${label}: missing link ${required}`);
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
      await inspect(page, `${lang === 'ru' ? '/ru' : ''}/work/learn/`, lang, width, 'case');
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
  }
  const manifest = JSON.parse(await readFile('public/prototypes/learn-manifest.json', 'utf8'));
  for (const route of manifest.routes) {
    await readFile(path.join('public/prototypes/learn', route.slice(1), 'index.html'));
  }
} finally {
  await browser.close();
}
await mkdir('.tmp/learn', { recursive: true });
await writeFile('.tmp/learn/integration-report.json', JSON.stringify({ reports, failures }, null, 2));
console.log(`${reports.length} page/locale/viewport checks; ${failures.length} failures.`);
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
}
