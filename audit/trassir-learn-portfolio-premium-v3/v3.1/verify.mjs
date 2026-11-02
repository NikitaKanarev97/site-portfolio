import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { observeLifecycle, preparePage, waitForMotion, decodeImages, imageInventory } from './settled.mjs';
const { chromium } = await import(process.env.PW ?? 'playwright');
const origin = process.argv[2] ?? 'http://127.0.0.1:4429';
const out = 'audit/trassir-learn-portfolio-premium-v3/v3.1';
await mkdir(`${out}/mobile`, { recursive: true });
const browser = await chromium.launch();
const results = [], lifecycle = [], controls = [];
const path = locale => `${locale === 'ru' ? '/ru' : ''}/work/learn/`;
const save = () => writeFile(`${out}/logs/browser.json`, JSON.stringify({ complete: false, results, lifecycle, controls }, null, 2));
try {
  // Verification guard: only the known empty CLOSED MediaZoom image is exempt.
  const fixture = await browser.newPage();
  await fixture.setContent('<dialog data-media-zoom><img data-media-zoom-image src=""></dialog><img id="empty" src=""><img id="broken" src="data:image/png;base64,invalid">');
  await fixture.locator('#broken').evaluate(i => i.decode().catch(() => {}));
  let inventory = await fixture.evaluate(imageInventory);
  assert.equal(inventory.ignored.length, 1);
  assert.equal(inventory.missing.length, 2);
  await fixture.locator('dialog').evaluate(d => d.showModal());
  inventory = await fixture.evaluate(imageInventory);
  assert.equal(inventory.ignored.length, 0);
  assert.equal(inventory.missing.length, 3);
  controls.push({ imageChecker: 'closed placeholder excluded; ordinary empty, broken assigned and empty open-dialog images all fail' });
  await fixture.close();

  for (const locale of ['en', 'ru']) for (const width of [320, 360, 390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 900 }, deviceScaleFactor: 1, isMobile: width < 768, hasTouch: width < 768 });
    const page = await context.newPage(), errors = [], failures = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('response', r => { if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`); });
    await observeLifecycle(page);
    await page.goto(origin + path(locale), { waitUntil: 'networkidle' });
    const settled = await preparePage(page);
    assert.equal(await page.locator('html').getAttribute('lang'), locale);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
    assert.equal((await page.evaluate(imageInventory)).missing.length, 0);
    const graph = page.locator(`[data-diagram-layout="${width < 1024 ? 'mobile' : 'desktop'}"]`);
    await graph.scrollIntoViewIfNeeded();
    await waitForMotion(page, '.learn-case');
    const model = await graph.evaluate(e => {
      const scroll = e.querySelector('.dg__scroll'), svg = e.querySelector('svg'), sr = svg.getBoundingClientRect();
      return { width: scroll.clientWidth, scrollWidth: scroll.scrollWidth, arrows: e.querySelectorAll('.dg-edge__head').length,
        transcript: [...e.querySelectorAll('.dg__a11y, .dg__legend, .dg__text')].map(n => n.textContent.trim()),
        text: [...svg.querySelectorAll('text')].filter(t => t.textContent.trim()).map(t => {
          const r = t.getBoundingClientRect(), matrix = t.getScreenCTM();
          return { text: t.textContent.trim(), renderedFont: parseFloat(getComputedStyle(t).fontSize) * Math.hypot(matrix.a, matrix.b),
            inside: r.left >= sr.left - 1 && r.right <= sr.right + 1 && r.top >= sr.top - 1 && r.bottom <= sr.bottom + 1 };
        }) };
    });
    assert.ok(model.scrollWidth <= model.width + 1, 'graph fits horizontally');
    assert.equal(model.arrows, 5);
    assert.ok(model.text.every(t => t.renderedFont >= 12 - 0.1 && t.inside), `graph text readable and unclipped ${locale} ${width}: ${JSON.stringify(model.text)}`);
    if (width < 768) await page.locator('#shared-material').screenshot({ path: `${out}/mobile/${locale}-${width}-graph.png` });

    const zooms = [];
    for (const selector of ['.learn-cover__home', '.learn-cover__answer', '.learn-archive', '.learn-programme', '.learn-learner', '.learn-recovery']) {
      const trigger = page.locator(`${selector} [data-zoom-trigger]`).first();
      await trigger.scrollIntoViewIfNeeded();
      await waitForMotion(page, '.learn-case');
      const img = trigger.locator('img');
      const source = await img.evaluate(i => i.currentSrc);
      await trigger.focus();
      await page.keyboard.press('Enter');
      const dialog = page.locator('[data-media-zoom][open]');
      await dialog.waitFor();
      await dialog.locator('img').evaluate(i => i.decode());
      assert.equal(await dialog.locator('img').evaluate(i => i.currentSrc), source);
      const openInventory = await page.evaluate(imageInventory);
      assert.equal(openInventory.missing.length, 0);
      assert.equal(openInventory.ignored.length, 0, 'open zoom source must be checked');
      await page.keyboard.press('Tab');
      assert.equal(await dialog.evaluate(d => d.contains(document.activeElement)), true);
      const dimensions = await dialog.locator('img').evaluate(i => ({ native: [i.naturalWidth, i.naturalHeight], rendered: [i.width, i.height] }));
      if (selector === '.learn-cover__home' && width < 768) await page.screenshot({ path: `${out}/mobile/${locale}-${width}-zoom.png` });
      await page.keyboard.press('Escape');
      assert.equal(await trigger.evaluate(e => document.activeElement === e), true);
      zooms.push({ selector, source: new URL(source).pathname, ...dimensions });
    }
    const anchors = [];
    for (const a of await page.locator('.learn-index a').all()) {
      const href = await a.getAttribute('href');
      await a.click();
      await page.waitForFunction(href => location.hash === href && Math.abs(document.querySelector(href).getBoundingClientRect().top - parseFloat(getComputedStyle(document.querySelector(href)).scrollMarginBlockStart)) < 2, href);
      assert.equal(await page.locator(href).isVisible(), true);
      anchors.push({ href, top: await page.locator(href).evaluate(e => e.getBoundingClientRect().top) });
    }
    if (width < 768) {
      const trigger = page.locator('[data-navbar-trigger]');
      await trigger.click();
      await page.keyboard.press('Tab');
      assert.equal(await page.locator('[data-navbar-panel]').evaluate(e => e.contains(document.activeElement)), true);
      await page.screenshot({ path: `${out}/mobile/${locale}-${width}-navigation.png` });
      await page.keyboard.press('Escape');
      assert.equal(await trigger.evaluate(e => document.activeElement === e), true);
      await trigger.click();
      await page.locator(`[data-navbar-panel] a[href="${path(locale === 'en' ? 'ru' : 'en')}"]`).click();
    } else await page.locator(`.navbar__desktop a[href="${path(locale === 'en' ? 'ru' : 'en')}"]`).click();
    await page.waitForURL(url => url.pathname.replace(/\/$/, '') === path(locale === 'en' ? 'ru' : 'en').replace(/\/$/, ''));
    await decodeImages(page);
    await waitForMotion(page);
    assert.equal(await page.locator('html').getAttribute('lang'), locale === 'en' ? 'ru' : 'en');
    await page.goBack({ waitUntil: 'networkidle' });
    await page.waitForFunction(locale => document.documentElement.lang === locale, locale);
    await decodeImages(page);
    await waitForMotion(page);
    await page.locator('.case-next__link').focus();
    await page.keyboard.press('Enter');
    await page.waitForURL(`**/${locale === 'ru' ? 'ru/' : ''}work/vet-clinic/`);
    assert.deepEqual(errors, []);
    assert.deepEqual(failures, []);
    results.push({ locale, width, settled, model, zooms, anchors, navigation: 'menu keyboard trap, Escape/return; locale switch; browser back; same-locale Next', errors, failures });
    await save();
    console.log(`${locale} ${width}: normal-motion endpoint, graph, 6 source zooms, anchors and navigation PASS`);
    await context.close();
  }

  for (const locale of ['en', 'ru']) {
    // Deliberately delay the built motion module: networkidle alone is not an intro signal.
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await observeLifecycle(page);
    await page.route('**/_astro/*.js', async route => { await new Promise(r => setTimeout(r, 1800)); await route.continue(); });
    await page.goto(origin + path(locale), { waitUntil: 'networkidle' });
    const delayed = await preparePage(page);
    assert.ok(delayed.intro.every(e => e.opacity === '1' && e.willChange === 'auto'));
    await page.reload({ waitUntil: 'networkidle' });
    const reloaded = await preparePage(page);
    assert.ok(reloaded.intro.every(e => e.opacity === '1'));
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await waitForMotion(page);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await waitForMotion(page);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await waitForMotion(page);
    lifecycle.push({ locale, delayed, reloaded, preferenceToggle: 'reduce → normal → reduce: all intro media opaque' });
    await context.close();
    for (const mode of ['reduced', 'no-js']) {
      const c = await browser.newContext({ viewport: { width: 320, height: 844 }, reducedMotion: 'reduce', javaScriptEnabled: mode !== 'no-js' });
      const p = await c.newPage();
      await p.goto(origin + path(locale), { waitUntil: 'networkidle' });
      await decodeImages(p);
      if (mode === 'reduced') await waitForMotion(p);
      for (const id of ['learn-cover','problem','shared-material','reference-path','guided-path','workspace','assessment','outcome']) assert.equal(await p.locator(`#${id}`).isVisible(), true);
      assert.equal(await p.locator('.learn-cover__home .case-screen').evaluate(e => getComputedStyle(e).opacity), '1');
      const source = await p.locator('.learn-cover__home a').getAttribute('href');
      assert.equal((await c.request.get(origin + source)).status(), 200);
      await p.screenshot({ path: `${out}/mobile/${locale}-320-${mode}.png` });
      controls.push({ locale, mode, width: 320, sections: 'all visible', heroOpacity: 1, sourceStatus: 200 });
      await c.close();
    }
    await save();
  }
  await writeFile(`${out}/logs/browser.json`, JSON.stringify({ complete: true, results, lifecycle, controls }, null, 2));
  console.log('8 normal-motion combinations, 2 delayed/reload/toggle lifecycles, 4 fallback controls and checker fixtures PASS');
} finally {
  await browser.close();
}
