/** Public B/C migration and B-G-01 regression. Does not rewrite owners' review evidence. */
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const out = 'tasks/portfolio-rebuild/integration/wave-1';
mkdirSync(out + '/shots', { recursive: true });
const base = process.argv.find(a => a.startsWith('--base='))?.slice(7) || 'http://127.0.0.1:4352';
const mode = process.argv.find(a => a.startsWith('--mode='))?.slice(7) || 'all';
const selectedRoutes = process.argv.find(a => a.startsWith('--routes='))?.slice(9).split(',');
const output = process.argv.find(a => a.startsWith('--output='))?.slice(9);
const req = createRequire('D:/Claude-projects/b2b-dssl/package.json');
const browser = await req('playwright').chromium.launch({ executablePath: process.env.COMMON_CHROME || 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
const failures = [], profiles = [], next = [], routes = [], mirrors = [];
const check = (ok, where, detail) => { if (!ok) failures.push({ where, detail }); };
const pathFor = (slug, lang) => `${lang === 'ru' ? '/ru' : ''}/work/${slug}/`;
const slugs = ['partner-portal', 'learn'];
async function boot(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => window.__dsMotionBooted === true);
}
async function sample(page, selector = '.case-next__track') {
  return page.locator(selector).last().evaluate(e => {
    const r = e.getBoundingClientRect(), root = e.closest('.case-next');
    return { transform: getComputedStyle(e).transform, inView: r.bottom > 0 && r.top < innerHeight,
      y: scrollY, top: r.top, bottom: r.bottom, width: innerWidth, height: innerHeight,
      link: root?.querySelector('a')?.getAttribute('href'), debug: window.__dsMotionDebug?.() };
  });
}
async function movement(page, where, expected = true) {
  const before = await sample(page); await page.waitForTimeout(350); const after = await sample(page);
  check(expected ? before.transform !== after.transform : before.transform === after.transform, where, { expected, before, after });
  return { before, after, moving: before.transform !== after.transform };
}
try {
  if (mode !== 'next') {
    for (const slug of slugs) for (const lang of ['en', 'ru']) for (const width of [1440, 1024, 390, 360]) for (const kind of ['full', 'reduce', 'no-js', 'short']) {
      const height = kind === 'short' ? 600 : 900, route = pathFor(slug, lang), where = `${route} ${width}x${height} ${kind}`;
      const context = await browser.newContext({ viewport: { width, height }, reducedMotion: kind === 'reduce' ? 'reduce' : 'no-preference', javaScriptEnabled: kind !== 'no-js' });
      const page = await context.newPage(), errors = []; page.on('pageerror', e => errors.push(e.message));
      const response = await page.goto(base + route, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready); if (kind !== 'no-js') await boot(page);
      await page.locator('.case-story img').evaluateAll(es => es.forEach(e => e.loading = 'eager'));
      await page.waitForFunction(() => [...document.querySelectorAll('.case-story img')].every(e => e.complete && e.naturalWidth));
      const length = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < length; y += 650) { await page.evaluate(y => scrollTo(0, y), y); await page.waitForTimeout(25); }
      await page.waitForTimeout(700);
      const state = await page.evaluate(() => {
        const focus = document.querySelector('[data-motion="focus-stage"]');
        return { lang: document.documentElement.lang, overflow: document.documentElement.scrollWidth - innerWidth,
          stories: document.querySelectorAll('[data-story-version="blocks-v1"]').length,
          canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
          noindex: document.querySelector('meta[name="robots"]')?.content,
          ids: [...document.querySelectorAll('[data-block-type]')].map(e => ({ id: e.id, type: e.dataset.blockType, evidence: e.dataset.evidenceId, media: e.dataset.mediaId })),
          broken: [...document.querySelectorAll('.case-story img')].filter(i => !i.complete || !i.naturalWidth).map(i => i.currentSrc),
          focus: Boolean(focus?.classList.contains('is-focused')),
          spacers: document.querySelectorAll('.case-steps .pin-spacer').length,
          states: [...document.querySelectorAll('[data-focus-state]')].map(e => ({ title: e.querySelector('h3')?.textContent.trim(), opacity: +getComputedStyle(e).opacity, visibility: getComputedStyle(e).visibility, height: e.getBoundingClientRect().height })),
          sets: [...document.querySelectorAll('[data-specimen-set]')].map(e => ({ id: e.dataset.specimenSet, states: e.querySelectorAll('[data-specimen-state]').length })),
          next: document.querySelector('.case-next__link')?.getAttribute('href'),
          locale: [...document.querySelectorAll('.navbar__locale a')].map(e => e.getAttribute('href')),
          h1: document.querySelectorAll('main h1').length,
        };
      });
      const expectedFocus = kind === 'full' && width >= 1024;
      check(response.ok() && state.lang === lang && state.stories === 1 && state.ids.length === 7 && state.h1 === 1, where, 'Complete localized public story');
      check(!state.overflow && !state.broken.length && !errors.length, where, { state, errors });
      check(state.canonical === 'https://kanarev.com' + route && !state.noindex?.includes('noindex'), where, 'Public SEO');
      check(state.focus === expectedFocus, where, 'Focus breakpoint');
      if (!expectedFocus) check(state.states.length === 3 && state.states.every(s => s.opacity === 1 && s.visibility === 'visible' && s.height > 0), where, 'Whole native fallback');
      check(state.next === pathFor(slug === 'partner-portal' ? 'learn' : 'vet-clinic', lang), where, 'Ordered native Next');
      check(state.locale.includes(pathFor(slug, lang === 'en' ? 'ru' : 'en')), where, 'Equivalent locale');
      check(state.sets.length === 4 && state.sets.reduce((n, s) => n + s.states, 0) === (slug === 'partner-portal' ? 13 : 6), where, 'Product specimen composition');
      if (expectedFocus) {
        const start = await page.locator('[data-motion="focus-stage"]').evaluate(e => (e.closest('.pin-spacer') || e).getBoundingClientRect().top + scrollY - 24);
        state.stops = [];
        for (const offset of [100, 750, 1250, 750, 100]) {
          await page.evaluate(y => scrollTo(0, y), start + offset); await page.waitForTimeout(450);
          const active = await page.locator('[data-focus-state]').evaluateAll(es => es.map((e, index) => ({ index, opacity: +getComputedStyle(e).opacity, visibility: getComputedStyle(e).visibility })).filter(e => e.opacity > .99 && e.visibility === 'visible'));
          const expected = offset === 100 ? 0 : offset === 750 ? 1 : 2;
          check(active.length === 1 && active[0].index === expected, where, { offset, active }); state.stops.push({ offset, active });
        }
      }
      if (kind === 'reduce' && [1440, 390].includes(width)) {
        await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(150);
        await page.screenshot({ path: `${out}/shots/${slug}-${lang}-${width}-cover.png` });
        for (const id of slug === 'partner-portal' ? ['shared-specification', 'domain-system', 'shipped-redesign'] : ['shared-material', 'content-language', 'honest-result']) {
          const section = page.locator('#' + id); await section.scrollIntoViewIfNeeded(); await page.waitForTimeout(700);
          await section.screenshot({ path: `${out}/shots/${slug}-${lang}-${width}-${id}.png` });
        }
      }
      profiles.push({ route, width, height, kind, ...state, errors }); await context.close();
      console.log('profile', where, failures.length);
    }
    for (const slug of slugs) {
      const pair = profiles.filter(p => p.route.endsWith(`/work/${slug}/`) && p.kind === 'reduce' && p.width === 1440);
      check(JSON.stringify(pair[0].ids) === JSON.stringify(pair[1].ids), slug, 'EN/RU stable identity');
    }
    const context = await browser.newContext({ javaScriptEnabled: false }), parser = await context.newPage();
    const allSlugs = ['agent-ops-console', 'partner-portal', 'learn', 'vet-clinic', 'pawly'];
    for (const lang of ['en', 'ru']) for (const slug of allSlugs) {
      const route = pathFor(slug, lang), html = await (await fetch(base + route)).text();
      const data = await parser.evaluate(html => {
        const d = new DOMParser().parseFromString(html, 'text/html'); return { stories: d.querySelectorAll('[data-story-version="blocks-v1"]').length, canonical: d.querySelector('link[rel="canonical"]')?.href, noindex: d.querySelector('meta[name="robots"]')?.content,
          locale: [...d.querySelectorAll('link[hreflang]')].map(e => ({ lang: e.hreflang, href: e.href })), og: d.querySelector('meta[property="og:locale"]')?.content };
      }, html);
      routes.push({ route, ...data });
      check(data.stories === (slugs.includes(slug) ? 1 : 0) && data.canonical === 'https://kanarev.com' + route && !data.noindex?.includes('noindex'), route, 'Public migration / legacy fallback');
      check(data.locale.length === 3 && data.og === (lang === 'ru' ? 'ru_RU' : 'en_US'), route, 'SEO pair');
    }
    const sitemap = await (await fetch(base + '/sitemap.xml')).text();
    check((sitemap.match(/<loc>/g) || []).length === 14 && !sitemap.includes('/preview/') && !sitemap.includes('/kit'), 'sitemap', 'Unchanged public slugs');
    await context.close();
    for (const [source, mirror] of [['ds/tokens.css', 'src/styles/tokens.css'], ['ds/motion.js', 'src/scripts/motion.js']]) {
      const bytes = readFileSync(source), equal = bytes.equals(readFileSync(mirror)); mirrors.push({ source, mirror, equal, sha256: createHash('sha256').update(bytes).digest('hex') }); check(equal, source, 'Byte parity');
    }
  }
  if (mode !== 'profiles') {
    const suite = slugs.flatMap(slug => ['en', 'ru'].map(lang => pathFor(slug, lang)));
    suite.push('/preview/common/en/agent-ops/', '/preview/common/ru/agent-ops/', '/kit/');
    for (const route of suite.filter(route => !selectedRoutes || selectedRoutes.includes(route))) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      await context.addInitScript(() => {
        const start = document.startViewTransition;
        if (!start) return;
        // Observe the actual transition promise; returned objects and behaviour stay native.
        document.startViewTransition = function (...args) {
          const transition = start.apply(this, args);
          window.__qaNativeTransitionFinished = transition.finished;
          return transition;
        };
      });
      const page = await context.newPage(), errors = []; page.on('pageerror', e => errors.push(e.message));
      await page.goto(base + route, { waitUntil: 'networkidle' }); await boot(page); await page.waitForTimeout(700);
      const link = page.locator('.case-next__link').last(), track = page.locator('.case-next__track').last();
      const results = { route, sizes: [], inViewSizes: [] };
      // Exact B sequence starts before reaching Next. A final entry must run immediately.
      for (const width of [390, 360, 1024, 1440, 390, 1440]) { await page.setViewportSize({ width, height: width < 768 ? 844 : 900 }); await page.waitForTimeout(650); }
      await link.scrollIntoViewIfNeeded(); await page.waitForTimeout(500); results.resizedEntry = await movement(page, route + ' resized entry');
      await link.hover(); results.hover = await movement(page, route + ' hover');
      await link.focus(); results.focus = await movement(page, route + ' focus');
      for (const width of [1024, 1440, 390, 360, 1024, 1440]) {
        await page.setViewportSize({ width, height: width < 768 ? 844 : 900 }); await page.waitForTimeout(650);
        const state = await sample(page); results.sizes.push(state);
        if (state.inView) results.inViewSizes.push(await movement(page, route + ' already visible ' + width));
      }
      await link.scrollIntoViewIfNeeded(); await page.waitForTimeout(450); results.finalSize = await movement(page, route + ' final size');
      const above = await track.evaluate(e => e.getBoundingClientRect().top + scrollY - innerHeight - 350);
      await page.evaluate(y => scrollTo(0, y), above); await page.waitForTimeout(350); results.outside = await movement(page, route + ' outside viewport', false);
      await link.scrollIntoViewIfNeeded(); await page.waitForTimeout(450); results.reentry = await movement(page, route + ' reentry');
      await page.emulateMedia({ reducedMotion: 'reduce' }); await page.waitForTimeout(500); await link.scrollIntoViewIfNeeded(); results.reduce = await movement(page, route + ' live reduce', false);
      await page.emulateMedia({ reducedMotion: 'no-preference' }); await page.waitForTimeout(650); await link.scrollIntoViewIfNeeded(); results.resume = await movement(page, route + ' live full');
      const destination = await link.getAttribute('href'); await link.click();
      await page.waitForURL(url => url.pathname.replace(/\/$/, '') === destination.replace(/\/$/, '')); await boot(page);
      await page.evaluate(() => window.__qaNativeTransitionFinished);
      results.destination = page.url(); await page.goBack({ waitUntil: 'networkidle' }); await boot(page); await page.waitForTimeout(650);
      check(new URL(page.url()).pathname === route, route, 'Back path');
      await page.locator('.case-next__link').last().scrollIntoViewIfNeeded(); await page.waitForTimeout(450); results.back = await movement(page, route + ' Back');
      await page.goForward({ waitUntil: 'networkidle' }); await boot(page);
      await page.evaluate(() => window.__qaNativeTransitionFinished);
      await page.goBack({ waitUntil: 'networkidle' }); await boot(page); await page.waitForTimeout(650);
      await page.locator('.case-next__link').last().scrollIntoViewIfNeeded(); await page.waitForTimeout(450); results.forwardBack = await movement(page, route + ' Forward/Back');
      if (route.startsWith('/work/') || route.startsWith('/ru/work/')) {
        const target = route.startsWith('/ru/') ? route.slice(3) : '/ru' + route;
        await page.locator(`.navbar__desktop a[href="${target}"]`).click(); await page.waitForURL(url => url.pathname === target); await boot(page);
        results.locale = page.url(); check(await page.locator('[data-story-version="blocks-v1"]').count() === 1, route, 'Native locale remains new story');
      }
      check(!errors.length, route, errors); results.errors = errors;
      next.push(results); await context.close(); console.log('Next', route, failures.length);
    }
  }
} finally {
  await browser.close();
  writeFileSync(output || `${out}/${mode === 'next' ? 'next' : mode === 'profiles' ? 'profiles' : 'browser'}-verification.json`, JSON.stringify({ base, profiles, routes, mirrors, next, failures }, null, 2));
}
console.log(JSON.stringify({ profiles: profiles.length, next: next.length, failures: failures.length }));
if (failures.length) process.exitCode = 1;
