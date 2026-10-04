/** Local browser acceptance: movement, fallbacks, lifecycle, screenshots and recordings. */
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
const require = createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const browser = await require('playwright').chromium.launch({ executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
const out = process.env.PILOT_OUT || 'research/portfolio-benchmark/shots/pilot-stage2';
const base = process.env.PILOT_BASE || 'http://127.0.0.1:4321';
mkdirSync(out, { recursive: true });
const report = [];
const pilot = `${base}/preview/agent-ops-pilot/`;
const settle = page => page.waitForTimeout(1600);
const diagnostics = page => page.evaluate(() => ({
  path: location.pathname, scroll: scrollY, height: document.documentElement.scrollHeight,
  overflow: document.documentElement.scrollWidth > innerWidth,
  broken: Array.from(document.images).filter(i => i.complete && !i.naturalWidth).map(i => i.currentSrc),
  pins: document.querySelectorAll('.pin-spacer').length,
  triggers: window.__dsMotionDebug?.().triggers,
  duplicateScenes: window.__dsMotionDebug?.().duplicateScenes,
  splitMasks: document.querySelectorAll('.ds-split-line').length,
  noindex: document.querySelector('meta[name="robots"]')?.content,
  motionBooted: window.__dsMotionBooted === true,
  counters: Array.from(document.querySelectorAll('.case-numbers__value')).map(el => el.textContent.trim()),
}));
const shotAt = async (page, selector, file) => {
  await page.locator(selector).first().evaluate(el => {
    const origin = el.closest('.pin-spacer') || el;
    scrollTo(0, origin.getBoundingClientRect().top + scrollY - 32);
  });
  await settle(page);
  await page.screenshot({ path: `${out}/${file}.png` });
};
for (const width of process.argv.includes('--regressions-only') ? [] : [1440, 1024, 390]) {
  for (const mode of ['full', 'reduce', 'nojs']) {
    const video = !process.argv.includes('--no-video') && mode === 'full' && width !== 1024;
    const viewport = { width, height: width === 390 ? 844 : 900 };
    const context = await browser.newContext({ viewport, javaScriptEnabled: mode !== 'nojs', reducedMotion: mode === 'reduce' ? 'reduce' : 'no-preference',
      ...(video ? { recordVideo: { dir: out, size: viewport } } : {}) });
    const page = await context.newPage(); const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(pilot, { waitUntil: 'networkidle' });
    if (mode !== 'nojs') await page.addStyleTag({ content: 'astro-dev-toolbar { display:none !important; }' });
    await settle(page);
    await page.screenshot({ path: `${out}/${width}-${mode}-cover.png` });
    const initial = await diagnostics(page);
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    // Real wheel events, down and up, with short pauses at the main scenes.
    for (let y = 0; y < height; y += 420) { await page.mouse.wheel(0,420); await page.waitForTimeout(160); }
    await settle(page);
    const afterScroll = await diagnostics(page);
    for (let y = height; y > 0; y -= 650) { await page.mouse.wheel(0,-650); await page.waitForTimeout(80); }
    if (mode === 'full') {
      for (const [name, selector] of [['sheet','.case-sheet'],['cause',':nth-match(.case-steps__step, 1)'],['workspace',':nth-match(.case-steps__step, 2)'],['approval',':nth-match(.case-steps__step, 3)'],['detail','[aria-label="Detail"]']]) {
        await shotAt(page, selector, `${width}-${name}`);
      }
      // Fast scroll and resizing: responsive contexts must not accumulate pins.
      await page.mouse.wheel(0,-100000); await page.waitForTimeout(400);
      await page.setViewportSize({ width: 1024, height: 900 }); await settle(page);
      const narrow = await diagnostics(page);
      await page.setViewportSize(viewport); await settle(page);
      const resized = await diagnostics(page);
      const beforeMasks = await page.locator('.ds-split-line').count();
      await page.setViewportSize({ width: width + 7, height: viewport.height }); await settle(page);
      await page.setViewportSize(viewport); await settle(page);
      const afterMasks = await page.locator('.ds-split-line').count();
      await shotAt(page, '.case-next', `${width}-next`);
      const returnPosition = await page.evaluate(() => scrollY);
      // Verify native View Transition groups actually animate during this click.
      await page.evaluate(() => {
        window.__transitionSamples = [];
        document.addEventListener('astro:after-swap', () => {
          for (const ms of [0,100,300]) setTimeout(() => window.__transitionSamples.push(document.getAnimations().map(a => ({
            name: a.animationName, pseudo: a.effect?.pseudoElement, duration: a.effect?.getTiming().duration,
          }))), ms);
        });
      });
      await page.getByRole('link', { name: 'Next case: Partner Portal', exact: true }).click();
      await page.waitForURL('**/preview/partner-portal-pilot/');
      await page.waitForTimeout(250);
      await page.screenshot({ path: `${out}/${width}-transition.png` });
      await settle(page);
      const transitionAnimations = await page.evaluate(() => window.__transitionSamples);
      await page.screenshot({ path: `${out}/${width}-portal.png` });
      await page.goBack(); await page.waitForURL('**/preview/agent-ops-pilot/'); await settle(page);
      const returned = await diagnostics(page);
      // Re-enter from a real link, then use browser history again.
      await page.getByRole('link', { name: 'Next case: Partner Portal', exact: true }).click();
      await page.waitForURL('**/preview/partner-portal-pilot/'); await settle(page);
      await page.goBack(); await settle(page);
      report.push({ width, mode, initial, afterScroll, narrow, resized, beforeMasks, afterMasks, returnPosition, returned, transitionAnimations, errors });
      await page.goto(`${base}/kit/`, { waitUntil: 'networkidle' }); await settle(page);
      const kitHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < kitHeight; y += 1200) { await page.mouse.wheel(0,1200); await page.waitForTimeout(50); }
      for (const [name, selector] of [['proof','.case-opening--proof'],['steps','.case-steps'],['callout','.case-callout'],['next','.case-next']]) await shotAt(page, selector, `kit-${width}-${name}`);
      report.push({ width, mode: 'kit', ...(await diagnostics(page)), errors: [...errors] });
    } else {
      await shotAt(page, ':nth-match(.case-steps__step, 3)', `${width}-${mode}-approval`);
      report.push({ width, mode, initial, afterScroll, errors });
      if (mode === 'reduce') {
        await shotAt(page,'.case-next',`${width}-reduce-next`);
        await page.getByRole('link', { name: 'Next case: Partner Portal', exact: true }).click();
        await page.waitForURL('**/preview/partner-portal-pilot/'); await settle(page);
        await page.screenshot({path:`${out}/${width}-reduce-portal.png`});
      }
      await page.goto(`${base}/kit/`, {waitUntil:'networkidle'}); await settle(page);
      for (const [name,selector] of [['steps','.case-steps'], ['callout','.case-callout']]) await shotAt(page,selector,`kit-${width}-${mode}-${name}`);
      report.push({ width, mode:`kit-${mode}`, ...(await diagnostics(page)), errors:[...errors] });
    }
    await context.close();
    if (video) await page.video().saveAs(`${out}/${width}-scroll-transition.webm`);
  }
}
// Published routes retain existing reveals, with no case pins injected.
for (const route of ['/', '/about/', '/work/partner-portal/', '/work/agent-ops-console/', '/ru/']) {
 for (const width of [1440,390]) {
  const page = await browser.newPage({viewport:{width,height:width===390?844:900}}); const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' }); await settle(page);
  await page.addStyleTag({content:'astro-dev-toolbar { display:none !important; }'});
  await page.screenshot({path:`${out}/regression-${width}-${route.replaceAll('/','-')}-opening.png`});
  await page.mouse.wheel(0,900); await settle(page);
  report.push({ route, width, ...(await diagnostics(page)), errors }); await page.close();
 }
}
writeFileSync(`${out}/${process.argv.includes('--regressions-only')?'regressions':'verification'}.json`, JSON.stringify(report,null,2));
const failures = report.filter(row => row.errors.length || row.overflow || row.initial?.overflow || row.initial?.duplicateScenes || row.resized?.duplicateScenes
  || (row.initial && row.mode !== 'nojs' && !row.initial.motionBooted)
  || Math.abs(row.returned?.scroll - row.returnPosition) > 2);
console.log(JSON.stringify(report,null,2));
await browser.close();
if (failures.length) throw new Error(`Motion acceptance failures: ${JSON.stringify(failures)}`);
