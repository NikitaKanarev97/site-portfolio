import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const { chromium } = await import(process.env.PW ?? 'playwright');
const base = process.argv[2] ?? 'http://127.0.0.1:4429';
const baseline = process.argv[3] ?? 'http://127.0.0.1:4428';
const out = 'audit/trassir-learn-portfolio-premium-v3';
await mkdir(`${out}/controls`, { recursive: true });
const browser = await chromium.launch();
const results = [], neighbors = [], live = [];
const hash = b => createHash('sha256').update(b).digest('hex');
for (const locale of ['en', 'ru']) for (const width of [320, 360, 390, 768, 1024, 1440]) {
  const context = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage(), errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const path = `${locale === 'ru' ? '/ru' : ''}/work/learn/`;
  await page.goto(base + path, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('html').getAttribute('lang'), locale);
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(await page.locator('.learn-case').getAttribute('data-learn-version'), 'learn-v3');
  assert.equal(await page.locator('.learn-cover__answer').isVisible(), true, 'Supporting answer retained on every size');
  assert.equal(await page.locator('.learn-model details').count(), 0);
  const graph = page.locator(`[data-diagram-layout="${width < 1024 ? 'mobile' : 'desktop'}"]`);
  assert.equal(await graph.isVisible(), true);
  assert.ok(await graph.locator('.dg-edge__head').count() >= 5, 'Directional content relationships');
  const metrics = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth,
    diagrams: [...document.querySelectorAll('.dg__scroll')].filter(e => e.getBoundingClientRect().width).map(e => ({ width: e.clientWidth, scroll: e.scrollWidth })),
    imageAlts: [...document.querySelectorAll('.learn-case img')].every(i => !!i.alt),
    headings: [...document.querySelectorAll('.learn-case h1, .learn-case h2')].map(h => h.textContent),
    editorial: (() => { const clone = document.querySelector('.learn-case').cloneNode(true); clone.querySelectorAll('[data-story-document], .case-next, script, style, svg').forEach(e => e.remove()); return clone.textContent.trim().split(/\s+/).length; })()
  }));
  assert.equal(metrics.scroll, width, `Page overflow ${locale} ${width}`);
  assert.ok(metrics.diagrams.every(d => d.scroll <= d.width + 1), 'Graph fits without horizontal scrolling');
  assert.equal(metrics.imageAlts, true);
  const frames = await page.locator('.learn-case .case-screen').evaluateAll(els => els.map(e => ({
    radius: getComputedStyle(e).borderRadius,
    padding: ['Top', 'Right', 'Bottom', 'Left'].map(s => parseFloat(getComputedStyle(e)[`padding${s}`])),
    canvas: e.closest('[data-learn-presentation]')?.dataset.learnPresentation,
    source: e.querySelector('img')?.currentSrc,
  })));
  for (const f of frames) {
    assert.equal(f.radius, '16px');
    assert.ok(f.padding.every(p => p === f.padding[0]));
    assert.equal(f.padding[0], f.canvas === 'canvas' ? 0 : width >= 768 ? 24 : 16);
    if (f.source.includes('/current/') || f.source.includes('/composition/')) assert.ok(f.source.includes(`/${locale}/`));
  }
  for (const selector of ['.learn-cover__home', '.learn-learner', '.learn-recovery']) {
    const trigger = page.locator(`${selector} [data-zoom-trigger]`).first();
    await trigger.scrollIntoViewIfNeeded();
    await trigger.locator('img').evaluate(i => i.decode());
    const source = await trigger.locator('img').evaluate(i => i.currentSrc);
    await trigger.focus();
    const focus = await trigger.evaluate(e => ({ width: getComputedStyle(e).outlineWidth, style: getComputedStyle(e).outlineStyle }));
    assert.notEqual(focus.style, 'none');
    await page.keyboard.press('Enter');
    await page.locator('[data-media-zoom][open]').waitFor();
    assert.equal(await page.locator('[data-media-zoom-image]').getAttribute('src'), source);
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('[data-media-zoom]').evaluate(e => e.contains(document.activeElement)), true, 'Zoom focus trap');
    await page.keyboard.press('Escape');
    assert.equal(await trigger.evaluate(e => e === document.activeElement), true, 'Zoom returns focus');
  }
  for (const a of await page.locator('.learn-index a').all()) {
    const id = (await a.getAttribute('href')).slice(1);
    await a.click();
    assert.equal(await page.locator(`#${id}`).isVisible(), true);
    assert.equal(new URL(page.url()).hash, `#${id}`);
  }
  const localLinks = [...new Set(await page.locator('.learn-case a[href^="/"]').evaluateAll(aa => aa.map(a => a.getAttribute('href'))))];
  for (const href of localLinks) assert.equal((await context.request.get(base + href)).ok(), true, href);
  assert.ok((await page.locator('link[rel="canonical"]').getAttribute('href')).includes(path.replace(/\/$/, '')));
  assert.equal(await page.locator('link[hreflang="en"]').count(), 1);
  assert.equal(await page.locator('link[hreflang="ru"]').count(), 1);
  if (width < 768) {
    await page.locator('[data-navbar-trigger]').click();
    await page.locator(`[data-navbar-panel] a[href="${locale === 'en' ? '/ru' : ''}/work/learn/"]`).click();
  } else await page.locator(`.navbar__desktop a[href="${locale === 'en' ? '/ru' : ''}/work/learn/"]`).click();
  await page.waitForURL(url => url.pathname.replace(/\/$/, '') === `${locale === 'en' ? '/ru' : ''}/work/learn`);
  assert.equal(await page.locator('html').getAttribute('lang'), locale === 'en' ? 'ru' : 'en');
  await page.goBack({ waitUntil: 'networkidle' });
  await page.waitForFunction(expected => document.documentElement.lang === expected, locale);
  assert.equal(await page.locator('html').getAttribute('lang'), locale);
  await page.goto(base + path, { waitUntil: 'networkidle' });
  await page.addScriptTag({ path: 'D:/Claude-projects/b2b-dssl/node_modules/axe-core/axe.min.js' });
  const axe = await page.evaluate(async () => {
    const result = await axe.run('.learn-case', { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa'] } });
    return { violations: result.violations, incomplete: result.incomplete.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), passes: result.passes.length };
  });
  await writeFile(`${out}/logs/axe-${locale}-${width}.json`, JSON.stringify(axe, null, 2));
  assert.deepEqual(axe.violations, [], `axe ${locale} ${width}`);
  if ([390, 1440].includes(width)) {
    await page.screenshot({ path: `${out}/controls/${locale}-${width}-reduced.png` });
    await page.locator('.learn-model').screenshot({ path: `${out}/controls/${locale}-${width}-model-reduced.png` });
    // Toggle preference while mounted; no content may remain hidden.
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await page.locator('.learn-cover__promise').evaluate(e => getComputedStyle(e).opacity), '1');
  }
  assert.deepEqual(errors, []);
  results.push({ locale, width, metrics, frames, axeViolations: axe.violations.length, keyboard: '3 zooms: Enter, focus trap, Escape, return; anchors; locale and browser back', errors });
  await writeFile(`${out}/logs/browser-verification.json`, JSON.stringify({ results, neighbors, live, complete: false }, null, 2));
  await context.close();
  console.log(`${locale} ${width}: responsive, keyboard, links, localization, axe passed`);
}
for (const locale of ['en','ru']) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${base}${locale === 'ru' ? '/ru' : ''}/work/learn/`);
  for (const id of ['learn-cover','shared-material','reference-path','guided-path','workspace','assessment','outcome']) assert.equal(await page.locator(`#${id}`).isVisible(), true);
  assert.equal(await page.locator('.learn-model [data-diagram-layout="mobile"] svg').isVisible(), true);
  const source = await page.locator('.learn-cover__home a').getAttribute('href');
  assert.equal((await context.request.get(base + source)).ok(), true);
  await page.locator('.learn-model').screenshot({ path: `${out}/controls/${locale}-390-model-no-js.png` });
  await page.screenshot({ path: `${out}/controls/${locale}-390-no-js.png` });
  results.push({ locale, mode: 'no JS', content: 'all chapters and model visible; original image link HTTP 200' });
  await context.close();
}
// Fresh production controls from pinned baseline versus current: exact pixel hashes.
for (const locale of ['en','ru']) for (const width of [1440,390]) {
  for (const route of ['/', '/work/agent-ops-console/', '/work/partner-portal/', '/work/vet-clinic/', '/work/pawly/']) {
    const path = `${locale === 'ru' ? '/ru' : ''}${route}`;
    const context = await browser.newContext({ viewport: { width, height: width === 1440 ? 900 : 844 }, reducedMotion: 'reduce' });
    const pair = [];
    for (const [phase, origin] of [['before', baseline],['after',base]]) {
      const page = await context.newPage();
      const response = await page.goto(origin + path, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200, path);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(400);
      if (route === '/') await page.locator('#work-learn').scrollIntoViewIfNeeded();
      const file = `${out}/controls/${locale}-${width}-${route === '/' ? 'home-learn' : route.split('/')[2]}-${phase}.png`;
      const pixels = route === '/' ? await page.locator('#work-learn').screenshot({ path: file }) : await page.screenshot({ path: file });
      pair.push({ phase, file, sha256: hash(pixels) });
      if (phase === 'after' && route === '/') {
        await page.locator('#work-learn .learn-home a').click();
        await page.waitForURL(`**${locale === 'ru' ? '/ru' : ''}/work/learn/`);
        assert.equal(await page.locator('.learn-case').getAttribute('data-learn-version'), 'learn-v3');
      }
      await page.close();
    }
    neighbors.push({ path, width, equal: pair[0].sha256 === pair[1].sha256, pair });
    await context.close();
  }
}
for (const locale of ['en','ru']) {
  const context = await browser.newContext();
  for (const route of ['home', 'material/onvif-not-found', 'trajectory/puskonaladka', 'landing']) {
    const url = route === 'landing' ? `https://kanarev.com/prototypes/learn-landing/${locale === 'en' ? 'en/' : ''}` : `https://kanarev.com/prototypes/learn/${route}?lang=${locale}`;
    const page = await context.newPage();
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    assert.equal(response.status(), 200);
    const body = await page.locator('body').innerText();
    assert.match(body, locale === 'ru' ? /пусконалад|камер|программ|знать|уметь/i : /commission|camera|program|know how/i);
    live.push({ url, final: page.url(), status: response.status(), locale, sample: body.slice(0,150) });
    await page.close();
  }
  await context.close();
}
await writeFile(`${out}/logs/browser-verification.json`, JSON.stringify({ results, neighbors, live, complete: true }, null, 2));
await browser.close();
assert.ok(neighbors.every(n => n.equal), 'Neighbor screenshots must match pinned baseline');
console.log(`${results.length} focused checks; ${neighbors.length} unchanged controls; ${live.length} live routes passed`);
