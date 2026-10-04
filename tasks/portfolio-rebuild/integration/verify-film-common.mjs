/** Real native-control playback, including JS disabled; never calls video.play(). */
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const base = process.argv.find(a => a.startsWith('--base='))?.slice(7) || 'http://127.0.0.1:4380';
const output = process.argv.find(a => a.startsWith('--output='))?.slice(9) || 'tasks/portfolio-rebuild/integration/film-common/verification.json';
const dir = 'tasks/portfolio-rebuild/integration/film-common';
const launchOnly = process.argv.includes('--launch');
mkdirSync(dir + '/shots', { recursive: true });
const req = createRequire('D:/Claude-projects/PETS-walking/package.json');
const browser = await req('playwright').chromium.launch({ executablePath: process.env.COMMON_CHROME || 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
const results = [], failures = [];
let activeVideo, activePhase;
const check = (ok, where, detail) => { if (!ok) failures.push({ where, detail }); };
async function state(video) {
  return video.evaluate(e => ({ paused: e.paused, ended: e.ended, time: e.currentTime, duration: Number.isFinite(e.duration) ? e.duration : null,
    readyState: e.readyState, source: e.currentSrc, controls: e.controls, loop: e.loop, autoplay: e.autoplay, poster: e.poster,
    decodedFrames: e.getVideoPlaybackQuality().totalVideoFrames, bound: Boolean(e.dataset.bound) }));
}
async function nativeToggle(page, video) {
  await video.scrollIntoViewIfNeeded();
  await video.evaluate(e => { const r = e.getBoundingClientRect(); if (r.bottom > innerHeight - 20) scrollBy(0, r.bottom - innerHeight + 20); });
  await page.waitForTimeout(150);
  await video.focus();
  await page.keyboard.press('Space'); // Chromium's native media control, stable at every viewport.
}
async function waitPlaying(page, time = 0.5) {
  await waitNative(page.locator('video[data-clip="film"]'), s => !s.paused && s.time > time && s.readyState >= 2 && s.decodedFrames > 0, 9000);
}
async function waitNative(video, predicate, timeout) {
  // Browser rAF polling is disabled with page JS; inspect native state from Node instead.
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (predicate(await state(video))) return;
    await new Promise(resolve => setTimeout(resolve, 120));
  }
  throw new Error('Native media state timeout');
}
async function boot(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => window.__dsMotionBooted);
  await page.evaluate(() => window.__qaTransitionFinished);
  await page.waitForTimeout(650);
}
async function contextFor(options) {
  const context = await browser.newContext(options);
  await context.addInitScript(() => {
    const start = document.startViewTransition;
    if (start) document.startViewTransition = function (...args) {
      const transition = start.apply(this, args); window.__qaTransitionFinished = transition.finished; return transition;
    };
  });
  return context;
}
try {
  for (const lang of ['en', 'ru']) for (const mode of launchOnly ? ['no-js'] : ['full', 'reduce', 'no-js']) {
    const context = await contextFor({ viewport: { width: mode === 'full' ? 1440 : mode === 'reduce' ? 390 : 360, height: mode === 'full' ? 1100 : 844 }, javaScriptEnabled: mode !== 'no-js', reducedMotion: mode === 'reduce' ? 'reduce' : 'no-preference' });
    const page = await context.newPage(), errors = []; page.on('pageerror', e => errors.push(e.message));
    const route = `/preview/film-common/${lang}/`; await page.goto(base + route, { waitUntil: 'networkidle' });
    if (mode !== 'no-js') await boot(page);
    const video = page.locator('video[data-clip="film"]'); await video.scrollIntoViewIfNeeded(); await page.waitForTimeout(600);
    activeVideo = video; activePhase = `${lang} ${mode} first play`;
    const row = { lang, mode, route, initial: await state(video) };
    const structure = await page.evaluate(() => ({ filmCount: document.querySelectorAll('video[data-clip="film"]').length,
      inline: Boolean(document.querySelector('#return-boundary .case-steps__step:nth-child(2) .case-screen video[data-clip="film"]')),
      steps: document.querySelectorAll('#return-boundary .case-steps__step').length,
      sourceTypes: [...document.querySelector('video[data-clip="film"]').querySelectorAll('source')].map(e => e.type),
      overflow: document.documentElement.scrollWidth - innerWidth, noindex: document.querySelector('meta[name="robots"]')?.content,
      canonical: document.querySelector('link[rel="canonical"]')?.href }));
    row.structure = structure;
    check(structure.filmCount === 1 && structure.inline && structure.steps === 3 && structure.sourceTypes.join(',') === 'video/mp4,video/webm' && !structure.overflow && structure.noindex.includes('noindex') && !structure.canonical, route, structure);
    check(row.initial.paused && row.initial.controls && !row.initial.loop && !row.initial.autoplay && row.initial.poster && row.initial.bound === (mode !== 'no-js'), route, row.initial);
    await nativeToggle(page, video); await waitPlaying(page); row.played = await state(video);
    check(row.played.source.endsWith('.mp4') && row.played.decodedFrames > 0, route, row.played);
    activePhase = `${lang} ${mode} pause`; await nativeToggle(page, video); await page.waitForTimeout(200); row.manualPause = await state(video);
    check(row.manualPause.paused, route, row.manualPause);
    if (launchOnly) {
      row.errors = errors; check(!errors.length, route, errors); results.push(row);
      console.log('clean native launch', lang, failures.length); await context.close(); continue;
    }
    await page.locator('#return-boundary .case-steps__step').nth(1).screenshot({ path: `${dir}/shots/${lang}-${mode}-inline.png` });
    activePhase = `${lang} ${mode} resume`; await nativeToggle(page, video); await waitPlaying(page, row.manualPause.time + 0.15);
    activePhase = `${lang} ${mode} end`;
    await waitNative(video, s => s.ended, 18000);
    row.ended = await state(video); check(row.ended.paused && row.ended.ended && Math.abs(row.ended.time - row.ended.duration) < 0.1, route, row.ended);
    row.errors = errors; check(!errors.length, route, errors); results.push(row); console.log('native', lang, mode, failures.length); await context.close();
  }
  for (const lang of launchOnly ? [] : ['en', 'ru']) {
    const context = await contextFor({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const page = await context.newPage(), errors = []; page.on('pageerror', e => errors.push(e.message));
    const route = `/preview/film-common/${lang}/`; await page.goto(base + route, { waitUntil: 'networkidle' }); await boot(page);
    const video = page.locator('video[data-clip="film"]'); await nativeToggle(page, video); await waitPlaying(page);
    const row = { lang, mode: 'lifecycle', beforeDeparture: await state(video) };
    await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(550); row.outside = await state(video);
    check(row.outside.paused, route, row.outside);
    await video.scrollIntoViewIfNeeded(); await page.waitForTimeout(550); row.returned = await state(video);
    check(row.returned.paused && Math.abs(row.returned.time - row.outside.time) < 0.1, route, row.returned);
    await nativeToggle(page, video); await waitPlaying(page, row.returned.time + 0.15);
    await page.emulateMedia({ reducedMotion: 'no-preference' }); await page.waitForTimeout(350); row.preference = await state(video);
    check(row.preference.paused && row.preference.time >= row.returned.time, route, row.preference);
    await nativeToggle(page, video); await waitPlaying(page, row.preference.time + 0.15);
    // This is explicitly a synthetic handler probe, not a physically hidden tab.
    await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
    await page.waitForTimeout(250); row.syntheticHidden = await state(video); check(row.syntheticHidden.paused, route, row.syntheticHidden);
    await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
    await page.waitForTimeout(250); row.syntheticVisible = await state(video);
    check(row.syntheticVisible.paused && Math.abs(row.syntheticVisible.time - row.syntheticHidden.time) < 0.1, route, row.syntheticVisible);
    await nativeToggle(page, video); await waitPlaying(page, row.syntheticVisible.time + 0.15);
    const handle = await video.elementHandle(); await page.locator('.case-next__link').focus(); await page.keyboard.press('Enter');
    await page.waitForURL(url => url.pathname === `${lang === 'ru' ? '/ru' : ''}/work/partner-portal/`); await boot(page);
    await page.waitForTimeout(2200); row.detached = await handle.evaluate(e => ({ paused: e.paused, connected: e.isConnected, bound: Boolean(e.dataset.bound) }));
    check(row.detached.paused && !row.detached.connected && !row.detached.bound, route, row.detached);
    await page.evaluate(() => { window.__filmPageLoaded = false; document.addEventListener('astro:page-load', () => window.__filmPageLoaded = true, { once: true }); });
    await page.goBack(); await page.waitForURL(url => url.pathname === route); await page.waitForFunction(() => window.__filmPageLoaded); await boot(page);
    row.back = { count: await page.locator('video[data-clip="film"]').count(), state: await state(page.locator('video[data-clip="film"]')) };
    check(row.back.count === 1 && row.back.state.paused, route, row.back); row.errors = errors; check(!errors.length, route, errors);
    results.push(row); console.log('lifecycle', lang, failures.length); await context.close();
  }
  // Existing carrier, separate from the new manual fixture.
  for (const lang of launchOnly ? [] : ['en', 'ru']) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } });
    const page = await context.newPage(); const route = `${lang === 'ru' ? '/ru' : ''}/work/vet-clinic/`; await page.goto(base + route, { waitUntil: 'networkidle' }); await boot(page);
    const video = page.locator('video[data-clip="loop"]').first(); await video.scrollIntoViewIfNeeded(); await page.waitForFunction(() => { const e = document.querySelector('video[data-clip="loop"]'); return !e.paused && e.readyState >= 2; }, undefined, { timeout: 9000 });
    const row = { lang, mode: 'existing-loop', route, playing: await state(video), sourceTypes: await video.locator('source').evaluateAll(es => es.map(e => e.type)) };
    check(row.playing.loop && !row.playing.controls && row.sourceTypes.join(',') === 'video/webm,video/mp4', route, row);
    const toggle = video.locator('xpath=ancestor::figure[1]').locator('[data-clip-toggle]'); await toggle.click(); await page.waitForTimeout(200); row.manualPause = await state(video); check(row.manualPause.paused, route, row);
    await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(300); row.outside = await state(video); check(row.outside.paused, route, row);
    await video.scrollIntoViewIfNeeded(); await page.waitForFunction(() => !document.querySelector('video[data-clip="loop"]').paused);
    row.reentry = await state(video); check(row.reentry.time < 2, route, row.reentry); results.push(row); console.log('existing loop', lang, failures.length); await context.close();
  }
  for (const lang of launchOnly ? [] : ['en', 'ru']) for (const viewport of [{ width: 1024, height: 900 }, { width: 1440, height: 600 }]) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' }); const page = await context.newPage(); const route = `/preview/film-common/${lang}/`;
    await page.goto(base + route, { waitUntil: 'networkidle' }); await boot(page);
    const row = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth - innerWidth, film: document.querySelector('video[data-clip="film"]').paused, staticSteps: document.querySelectorAll('[data-focus-state]').length }));
    check(!row.overflow && row.film && row.staticSteps === 3, route, row); results.push({ lang, mode: 'geometry', viewport, ...row }); await context.close();
  }
  for (const [source, mirror] of [['ds/tokens.css', 'src/styles/tokens.css'], ['ds/motion.js', 'src/scripts/motion.js']]) check(readFileSync(source).equals(readFileSync(mirror)), source, 'Mirror parity');
} catch (error) { failures.push({ where: activePhase || 'harness', detail: error.message, state: await state(activeVideo).catch(() => null) }); }
finally {
  await browser.close();
  writeFileSync(output, JSON.stringify({ base, nativeInput: 'Focused HTML video + trusted Space key, Chromium native controls; no scripted play/pause/seek', results, failures, limitations: ['Native playback tested in local Chromium 1243. No physical devices or other browser engines.', 'Document-hidden branch tested with an explicit synthetic visibility handler probe; a physically hidden tab was not verified.'], mediaFrameSha256: createHash('sha256').update(readFileSync('src/components/MediaFrame.astro')).digest('hex') }, null, 2) + '\n');
}
console.log(JSON.stringify({ observations: results.length, failures: failures.length }));
if (failures.length) process.exitCode = 1;
