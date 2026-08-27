/** Browser-level EN/RU verification for every published portfolio route. */
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const playwrightRepo = process.env.PLAYWRIGHT_REPO ?? 'D:/Claude-projects/b2b-dssl';
const require = createRequire(path.join(playwrightRepo, 'package.json'));
const { chromium } = require('playwright');

const origin = process.env.PORTFOLIO_ORIGIN ?? 'http://127.0.0.1:4322';
const slugs = ['agent-ops-console', 'partner-portal', 'vet-clinic', 'pawly'];
const routes = [
  { path: '/', locale: 'en', switchPath: '/ru/', cv: '/cv.pdf' },
  { path: '/about', locale: 'en', switchPath: '/ru/about', cv: '/cv.pdf' },
  ...slugs.map((slug) => ({ path: `/work/${slug}`, locale: 'en', switchPath: `/ru/work/${slug}`, cv: '/cv.pdf' })),
  { path: '/ru/', locale: 'ru', switchPath: '/', cv: '/cv-ru.pdf' },
  { path: '/ru/about', locale: 'ru', switchPath: '/about', cv: '/cv-ru.pdf' },
  ...slugs.map((slug) => ({ path: `/ru/work/${slug}`, locale: 'ru', switchPath: `/work/${slug}`, cv: '/cv-ru.pdf' })),
];
const widths = [360, 375, 768, 1440];
const failures = [];

function fail(route, width, message) {
  failures.push(`${route} @ ${width}px: ${message}`);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ reducedMotion: 'reduce', colorScheme: 'light' });
const page = await context.newPage();
const consoleErrors = [];
page.on('console', (message) => {
  if (message.type() === 'error') consoleErrors.push(message.text());
});
page.on('pageerror', (error) => consoleErrors.push(error.message));

for (const route of routes) {
  for (const width of widths) {
    consoleErrors.length = 0;
    await page.setViewportSize({ width, height: 900 });
    const response = await page.goto(`${origin}${route.path}`, { waitUntil: 'networkidle' });
    if (!response || response.status() !== 200) fail(route.path, width, `HTTP ${response?.status() ?? 'no response'}`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(100);

    const result = await page.evaluate(({ locale, switchPath, cv }) => {
      const exactPath = (href) => {
        const url = new URL(href, location.origin);
        const pathname = url.pathname.length > 1 ? url.pathname.replace(/\/$/, '') : url.pathname;
        return `${pathname}${url.search}${url.hash}`;
      };
      const normalizedSwitch = switchPath.length > 1 ? switchPath.replace(/\/$/, '') : switchPath;
      const bodyText = document.body.innerText;
      const forbiddenRu = ['Open prototype', 'View case', 'About me', 'Selected work'];
      return {
        lang: document.documentElement.lang,
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        switchCount: [...document.querySelectorAll('a[href]')].filter((link) => exactPath(link.getAttribute('href')) === normalizedSwitch).length,
        cvCount: [...document.querySelectorAll('a[href]')].filter((link) => exactPath(link.getAttribute('href')) === cv).length,
        canonical: document.querySelector('link[rel="canonical"]')?.href ?? '',
        robots: document.querySelector('meta[name="robots"]')?.content ?? '',
        alternates: [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map((link) => link.getAttribute('hreflang')),
        cyrillicInEnglish: locale === 'en' && /[А-Яа-яЁё]/.test(bodyText),
        untranslatedRu: locale === 'ru' ? forbiddenRu.filter((phrase) => bodyText.includes(phrase)) : [],
      };
    }, route);

    if (result.lang !== route.locale) fail(route.path, width, `lang=${result.lang}`);
    if (result.overflow > 1) fail(route.path, width, `horizontal overflow ${result.overflow}px`);
    if (result.switchCount < 1) fail(route.path, width, `missing locale link to ${route.switchPath}`);
    if (result.cvCount < 1) fail(route.path, width, `missing CV link to ${route.cv}`);
    if (!result.canonical.startsWith('https://kanarev.com')) fail(route.path, width, `canonical=${result.canonical}`);
    if (/noindex|nofollow/i.test(result.robots)) fail(route.path, width, `robots=${result.robots}`);
    if (!result.alternates.includes('en') || !result.alternates.includes('ru') || !result.alternates.includes('x-default')) {
      fail(route.path, width, `hreflang=${result.alternates.join(',')}`);
    }
    if (result.cyrillicInEnglish) fail(route.path, width, 'Cyrillic text found in English page');
    if (result.untranslatedRu.length) fail(route.path, width, `untranslated UI: ${result.untranslatedRu.join(', ')}`);
    if (consoleErrors.length) fail(route.path, width, `console: ${[...new Set(consoleErrors)].join(' | ')}`);

    if (width === 1440) {
      await page.evaluate(() => {
        for (const image of document.images) image.loading = 'eager';
        window.scrollTo(0, document.documentElement.scrollHeight);
      });
      await page.waitForTimeout(500);
      const broken = await page.evaluate(() => [...document.images]
        .filter((image) => image.getAttribute('src') && image.complete && image.naturalWidth === 0)
        .map((image) => image.currentSrc || image.src));
      if (broken.length) fail(route.path, width, `broken images: ${broken.join(', ')}`);
    }
  }
}

const cvResponses = await Promise.all(['/cv.pdf', '/cv-ru.pdf'].map(async (pathname) => {
  const response = await context.request.get(`${origin}${pathname}`);
  return { pathname, status: response.status(), type: response.headers()['content-type'], bytes: (await response.body()).length };
}));
for (const cv of cvResponses) {
  if (cv.status !== 200 || cv.type !== 'application/pdf' || cv.bytes < 10_000) failures.push(`${cv.pathname}: ${JSON.stringify(cv)}`);
}

const shots = path.resolve('tmp', 'qa', 'portfolio-locales');
mkdirSync(shots, { recursive: true });
for (const width of [375, 1440]) {
  await page.setViewportSize({ width, height: 1000 });
  await page.goto(`${origin}/ru/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(shots, `ru-home-${width}.png`), fullPage: true });
  await page.goto(`${origin}/ru/work/agent-ops-console`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(shots, `ru-agent-top-${width}.png`), fullPage: false });
}

await browser.close();

console.log(`Verified ${routes.length} routes at ${widths.length} widths (${routes.length * widths.length} page states).`);
for (const cv of cvResponses) console.log(`${cv.pathname}: ${cv.status}, ${cv.type}, ${cv.bytes} bytes`);
if (failures.length) {
  console.error(`FAILURES (${failures.length})`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log('All locale, layout, image, console, metadata and CV checks passed.');
}
