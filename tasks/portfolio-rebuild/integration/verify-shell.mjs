/** G preparation: shell fallbacks/navigation and metadata, not acceptance of five new stories. */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const out = 'tasks/portfolio-rebuild/integration';
mkdirSync(out + '/shots', { recursive: true });
const base = process.argv.find(v => v.startsWith('--base='))?.slice(7) || 'http://127.0.0.1:4352';
const chrome = process.env.COMMON_CHROME || 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe';
const require = createRequire('D:/Claude-projects/b2b-dssl/package.json');
const browser = await require('playwright').chromium.launch({ executablePath: chrome });
const failures = [], metadata = [], profiles = [], assets = [], lifecycle = [];
const check = (condition, detail) => { if (!condition) failures.push(detail); };
const slugs = ['agent-ops-console', 'partner-portal', 'learn', 'vet-clinic', 'pawly'];
const publicRoutes = ['', '/ru'].flatMap(prefix => [prefix + '/', prefix + '/about/', ...slugs.map(slug => `${prefix}/work/${slug}/`)]);
const privateRoutes = ['/404.html', '/500.html', '/kit/', '/preview/common/', ...['en', 'ru'].flatMap(locale => ['agent-ops', 'partner-portal'].map(slug => `/preview/common/${locale}/${slug}/`)), '/preview/agent-ops-pilot/', '/preview/partner-portal-pilot/'];
try {
  const parseContext = await browser.newContext({ javaScriptEnabled: false });
  const parser = await parseContext.newPage();
  for (const route of [...publicRoutes, ...privateRoutes]) {
    const res = await fetch(base + route), html = await res.text();
    const data = await parser.evaluate(html => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return {
        lang: doc.documentElement.lang, title: doc.title, h1: doc.querySelectorAll('h1').length,
        canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute('href'),
        robots: doc.querySelector('meta[name="robots"]')?.getAttribute('content'),
        ogLocale: doc.querySelector('meta[property="og:locale"]')?.getAttribute('content'),
        ogAlternates: [...doc.querySelectorAll('meta[property="og:locale:alternate"]')].map(e => e.content),
        ogImage: doc.querySelector('meta[property="og:image"]')?.getAttribute('content'),
        alternates: [...doc.querySelectorAll('link[hreflang]')].map(e => ({ lang: e.hreflang, href: e.href })),
      };
    }, html);
    metadata.push({ route, status: res.status, ...data });
    const isPublic = publicRoutes.includes(route), isRu = route.startsWith('/ru/');
    check(res.ok && !!data.title && data.h1 === 1, { route, reason: 'route/title/h1', data });
    check(data.ogLocale === (data.lang === 'ru' ? 'ru_RU' : 'en_US'), { route, reason: 'OG locale' });
    if (isPublic) {
      check(!data.robots?.includes('noindex') && data.lang === (isRu ? 'ru' : 'en'), { route, reason: 'public locale/index' });
      check(data.canonical === 'https://kanarev.com' + route, { route, reason: 'canonical' });
      const pair = isRu ? route.slice(3) : '/ru' + route;
      check(data.alternates.length === 3 && data.alternates.some(a => a.lang === (isRu ? 'en' : 'ru') && a.href === 'https://kanarev.com' + pair), { route, reason: 'hreflang pair' });
      check(data.ogAlternates.length === 1 && data.ogAlternates[0] === (isRu ? 'en_US' : 'ru_RU'), { route, reason: 'OG alternate' });
    } else {
      check(data.robots?.includes('noindex') && !data.canonical && !data.alternates.length && !data.ogAlternates.length, { route, reason: 'private SEO' });
    }
    if (data.ogImage) {
      const local = new URL(data.ogImage).pathname;
      if (!assets.some(a => a.path === local)) {
        const image = await fetch(base + local);
        assets.push({ path: local, status: image.status, type: image.headers.get('content-type') });
        check(image.ok && image.headers.get('content-type')?.startsWith('image/'), { route, reason: 'OG image', local });
      }
    }
  }
  const sitemapText = await (await fetch(base + '/sitemap.xml')).text();
  const sitemap = await parser.evaluate(xml => {
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    return [...doc.getElementsByTagName('url')].map(e => ({ loc: e.getElementsByTagName('loc')[0]?.textContent, alternates: [...e.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'link')].map(l => l.getAttribute('hreflang')) }));
  }, sitemapText);
  check(sitemap.length === 14 && publicRoutes.every(route => sitemap.some(row => row.loc === 'https://kanarev.com' + route)) && sitemap.every(row => row.alternates.length === 3), { reason: 'sitemap', sitemap });
  const robots = await (await fetch(base + '/robots.txt')).text();
  check(/Disallow:\s*\/kit/.test(robots) && /Disallow:\s*\/preview/.test(robots) && /Sitemap:\s*https:\/\/kanarev.com\/sitemap.xml/.test(robots), { reason: 'robots', robots });
  for (const path of ['/cv.pdf', '/cv-ru.pdf']) {
    const res = await fetch(base + path), bytes = Buffer.from(await res.arrayBuffer());
    assets.push({ path, status: res.status, bytes: bytes.length, signature: bytes.subarray(0, 5).toString() });
    check(res.ok && bytes.subarray(0, 5).toString() === '%PDF-', { reason: 'CV', path });
  }
  await parseContext.close();
  for (const locale of ['en', 'ru']) for (const width of [1440, 1024, 390, 360]) for (const mode of ['full', 'reduce', 'no-js', 'blocked-js']) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: mode === 'full' ? 'no-preference' : 'reduce', javaScriptEnabled: mode !== 'no-js' });
    if (mode === 'blocked-js') await context.route('**/*', route => route.request().resourceType() === 'script' ? route.abort() : route.continue());
    const page = await context.newPage(), errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const route = locale === 'ru' ? '/ru/' : '/';
    await page.goto(base + route, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const enhanced = ['full', 'reduce'].includes(mode);
    if (enhanced) await page.locator('[data-navbar-ready]').waitFor({ state: 'attached' });
    const state = await page.evaluate(() => {
      const root = document.querySelector('[data-navbar]'), nav = root.querySelector('.navbar__desktop'), trigger = root.querySelector('[data-navbar-trigger]');
      return {
        overflow: document.documentElement.scrollWidth - innerWidth,
        ready: root.hasAttribute('data-navbar-ready'), nav: getComputedStyle(nav).display, trigger: getComputedStyle(trigger).display,
        links: [...nav.querySelectorAll('a')].map(a => ({ href: a.getAttribute('href'), height: a.getBoundingClientRect().height })),
        email: [...document.querySelectorAll('a[href^="mailto:"]')].filter(a => getComputedStyle(a).display !== 'none').length,
        cv: [...document.querySelectorAll('a[href$=".pdf"]')].map(a => a.getAttribute('href')),
        logo: root.querySelector('svg').getAttribute('viewBox'),
      };
    });
    const profile = { locale, width, mode, errors, ...state }; profiles.push(profile);
    check(!errors.length && state.overflow <= 0 && state.ready === enhanced && state.email > 0 && state.cv.includes(locale === 'ru' ? '/cv-ru.pdf' : '/cv.pdf'), { reason: 'shell profile', profile });
    check(state.nav === (width >= 768 || !enhanced ? 'block' : 'none') && (width < 768 && enhanced ? ['inline-flex', 'flex'].includes(state.trigger) : state.trigger === 'none'), { reason: 'nav presentation', profile });
    check(state.links.length === 5 && state.logo === '0 0 162 100', { reason: 'native links/logo', profile });
    if (!enhanced && width < 768) check(state.links.every(a => a.height >= 48), { reason: 'fallback tap targets', profile });
    if (mode === 'reduce' && [1440, 390].includes(width)) await page.screenshot({ path: `${out}/shots/shell-${locale}-${width}.png` });
    if (width === 390 && enhanced) {
      const trigger = page.locator('[data-navbar-trigger]'), panel = page.locator('[data-navbar-panel]');
      await trigger.click();
      check(await panel.isVisible() && await page.evaluate(() => document.body.classList.contains('ds-scroll-locked') && document.activeElement === document.querySelector('[data-navbar-panel] a')), { reason: 'open/focus', locale, mode });
      await page.keyboard.press('Shift+Tab');
      check(await page.evaluate(() => document.activeElement === [...document.querySelectorAll('[data-navbar-panel] a')].at(-1)), { reason: 'focus trap', locale, mode });
      await page.keyboard.press('Escape');
      check(await panel.isHidden() && await page.evaluate(() => document.activeElement === document.querySelector('[data-navbar-trigger]') && !document.body.classList.contains('ds-scroll-locked')), { reason: 'Escape/focus return', locale, mode });
      await trigger.click();
      await page.setViewportSize({ width: 1024, height: 600 });
      check(await panel.isHidden() && await trigger.getAttribute('aria-expanded') === 'false' && await page.evaluate(() => !document.body.classList.contains('ds-scroll-locked')), { reason: 'resize close', locale, mode });
      await page.setViewportSize({ width: 390, height: 600 });
      await page.emulateMedia({ reducedMotion: mode === 'full' ? 'reduce' : 'no-preference' });
      await trigger.click();
      await panel.locator(`a[href="${locale === 'ru' ? '/ru/about' : '/about'}"]`).click();
      await page.waitForURL(/\/about\/?$/);
      await page.locator('[data-navbar-ready]').waitFor({ state: 'attached' });
      check(!await page.evaluate(() => document.body.classList.contains('ds-scroll-locked')), { reason: 'navigation unlock', locale, mode });
      await page.goBack({ waitUntil: 'networkidle' });
      await page.locator('[data-navbar-ready]').waitFor({ state: 'attached' });
      await page.locator('[data-navbar-trigger]').click();
      check(await page.locator('[data-navbar-panel]').isVisible(), { reason: 'Back listener once', locale, mode });
      await page.keyboard.press('Escape');
      lifecycle.push({ locale, mode, resize: true, livePreference: true, nativeAbout: true, back: true, shortWindow: [390, 600] });
    }
    if (width === 360 && !enhanced) {
      await page.locator(`.navbar__desktop a[href="${locale === 'ru' ? '/ru/about' : '/about'}"]`).click();
      await page.waitForURL(/\/about\/?$/);
      check(await page.locator('.navbar__desktop').isVisible(), { reason: 'fallback destination', locale, mode });
      await page.goBack({ waitUntil: 'networkidle' });
      check(await page.locator('.navbar__desktop').isVisible(), { reason: 'fallback Back', locale, mode });
    }
    await context.close();
  }
  const context = await browser.newContext({ reducedMotion: 'reduce' }), page = await context.newPage();
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base + '/404.html', { waitUntil: 'networkidle' });
    check(await page.locator('[lang="ru"] a[href="/cv-ru.pdf"]').count() === 1 && await page.locator('a[href="/cv.pdf"]').count() >= 1, { reason: 'bilingual 404', width });
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), { reason: '404 overflow', width });
    await page.screenshot({ path: `${out}/shots/service-${width}.png`, fullPage: true });
  }
  const before = execFileSync('git', ['show', '936724beff3bb9a01c69381659dc808782cc7950:Images/logo-portfolio-v3-mono.svg'], { encoding: 'utf8' });
  const after = readFileSync('Images/logo-portfolio-v3-mono.svg', 'utf8');
  await page.setViewportSize({ width: 720, height: 220 });
  await page.setContent(`<style>body{margin:0;font:16px sans-serif;background:#eeeeeb;color:#282824;display:flex;gap:70px;padding:28px}section{flex:1}svg{display:block;height:90px;width:auto;margin-top:24px}</style><section>До: K без своего штриха${before}</section><section>После: отдельные N и K${after}</section>`);
  await page.screenshot({ path: `${out}/shots/logo-comparison.png` });
  await context.close();
  const mirrors = [['ds/tokens.css', 'src/styles/tokens.css'], ['ds/motion.js', 'src/scripts/motion.js']].map(([source, mirror]) => {
    const bytes = readFileSync(source), copy = readFileSync(mirror);
    const row = { source, mirror, equal: bytes.equals(copy), bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') };
    check(row.equal, { reason: 'DS mirror', row }); return row;
  });
  writeFileSync(out + '/shell-verification.json', JSON.stringify({ base, metadata, sitemap, robots, assets, profiles, lifecycle, mirrors, failures }, null, 2));
} finally { await browser.close(); }
console.log(JSON.stringify({ metadata: metadata.length, profiles: profiles.length, lifecycle: lifecycle.length, assets: assets.length, failures: failures.length }));
if (failures.length) process.exitCode = 1;
