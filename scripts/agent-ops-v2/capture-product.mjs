import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';
import { ruCaptureStrings } from './ru-capture-strings.mjs';
const { chromium } = await import(process.env.PW ?? 'playwright');
const origin = process.env.PRODUCT_ORIGIN ?? 'http://127.0.0.1:5290';
const root = process.env.PRODUCT_ROOT ?? 'D:/Claude-projects/sp-agent-ops-source';
const sha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const raw = '.tmp/agent-ops-v2-originals';
const out = 'public/media/rebuild/agent-ops/v2';
const specs = [
  ['review-queue', '/screens/review-queue', 'reviewer', '6cecdb73b3fc23f0465bf7bf6a84598f1a63733d'],
  ['run-detail', '/screens/run-detail?run=run-24a8-0917', 'reviewer', '6cecdb73b3fc23f0465bf7bf6a84598f1a63733d'],
  ['action-approvals', '/screens/action-approvals?approval=ap-5', 'shift-lead', '6cecdb73b3fc23f0465bf7bf6a84598f1a63733d'],
  ['policy-editor', '/screens/policy-editor', 'policy-owner', '6399f6a4a586783f4eb20df7a9d93cb6076b06ed'],
  ['policy-version-diff', '/screens/policy-version-diff', 'policy-owner', '030e5af7416ad52bd753271ad7147202b55cd41a'],
  ['quality-dashboard', '/screens/quality-dashboard', 'policy-owner', '00641af7706c0f941e5ee58f4da8ee9bf9bb94d6'],
  ['autonomy', '/screens/autonomy', 'policy-owner', '6cecdb73b3fc23f0465bf7bf6a84598f1a63733d'],
];
// Documentary full-content export: release existing scroll owners only.
// No UI text, colour, font, layout width, fixture or control is changed.
const fullContent = `html,body,#root,#root>div,[class*="_screen_"],[class*="_main_"],main,[data-pane]{height:auto!important;max-height:none!important;overflow:visible!important}
[data-pane]{flex:none!important} [data-dock]{position:static!important}`;
const only = process.env.SCREEN_ONLY?.split(',');
const entries = only ? JSON.parse(await readFile('audit/agent-ops-v2/capture-manifest.json', 'utf8')).entries.filter(entry => !only.includes(entry.screen)) : [];
const media = Object.fromEntries(entries.map(entry => [`${entry.locale}/${entry.key}`, { src: entry.src, width: entry.width, height: entry.height, cssWidth: entry.cssWidth ?? entry.bounds.width, cssHeight: entry.cssHeight ?? entry.bounds.height }]));
await mkdir(raw, { recursive: true });
const browser = await chromium.launch();
async function save(page, locator, key, context, trimAfterDock = false, canvasPadding = 0) {
  const bounds = await locator.boundingBox();
  if (!bounds || bounds.width < 100 || bounds.height < 40) throw new Error(`Empty capture: ${key}`);
  const original = `${raw}/${context.locale}/${key}.png`;
  const target = `${out}/${context.locale}/${key}.webp`;
  let buffer;
  if (trimAfterDock) {
    const dock = await locator.locator('[data-dock]').boundingBox();
    if (!dock) throw new Error('Missing approval decision dock');
    bounds.height = Math.min(bounds.height, dock.y + dock.height - bounds.y);
    // Locator capture includes the entire element beyond the viewport. A page
    // clip is viewport-limited in Chromium and would silently cut mobile actions.
    const complete = await locator.screenshot({ animations: 'disabled' });
    const completeSize = await sharp(complete).metadata();
    buffer = await sharp(complete).extract({ left: 0, top: 0, width: completeSize.width, height: Math.min(completeSize.height, Math.ceil(bounds.height * 2)) }).png().toBuffer();
    await writeFile(original, buffer);
  } else buffer = await locator.screenshot({ path: original, animations: 'disabled' });
  const nativeColor = await page.evaluate(() => getComputedStyle(document.querySelector('[class*="_screen_"]')).backgroundColor);
  const pipeline = sharp(buffer);
  if (canvasPadding) pipeline.extend({ top: canvasPadding * 2, bottom: canvasPadding * 2, left: canvasPadding * 2, right: canvasPadding * 2, background: nativeColor });
  await pipeline.webp({ quality: 88, effort: 6 }).toFile(target);
  const info = await sharp(target).metadata();
  if (Math.abs(info.height - (bounds.height + canvasPadding * 2) * 2) > 4) throw new Error(`Incomplete vertical capture: ${key}`);
  const entry = { ...context, key, bounds, pixels: { width: info.width, height: info.height }, original,
    originalSha256: createHash('sha256').update(buffer).digest('hex'),
    src: `/${target.replace(/^public\//, '')}`, width: info.width, height: info.height, cssWidth: info.width / 2, cssHeight: info.height / 2, density: 2,
    nativeCanvas: canvasPadding ? { cssPadding: canvasPadding, color: nativeColor, purpose: 'Neutral context outside the unchanged captured UI; no text or controls repainted' } : null,
    webpBytes: (await readFile(target)).length };
  entries.push(entry);
  media[`${context.locale}/${key}`] = { src: entry.src, width: info.width, height: info.height, cssWidth: entry.cssWidth, cssHeight: entry.cssHeight };
}
try {
  for (const [screen, route, role, acceptedCodeCommit] of specs.filter(([screen]) => !only || only.includes(screen))) {
    for (const locale of ['en', 'ru']) {
      await mkdir(`${raw}/${locale}`, { recursive: true });
      await mkdir(`${out}/${locale}`, { recursive: true });
      for (const width of [1440, 390]) {
        const viewport = { width, height: width === 1440 ? 900 : 844 };
        const context = await browser.newContext({ viewport, deviceScaleFactor: 2, reducedMotion: 'reduce', isMobile: width < 768, hasTouch: width < 768 });
        await context.addInitScript(r => sessionStorage.setItem('agent-ops.role', r), role);
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        await page.clock.setFixedTime(new Date('2026-08-25T07:12:00Z'));
        const path = `${locale === 'ru' ? '/ru' : ''}${route}`;
        await page.goto(origin + path, { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(locale === 'ru' ? 1700 : 600);
        if (locale === 'ru') {
          await page.evaluate(dictionary => {
            const walker = document.createTreeWalker(document.querySelector('#root'), NodeFilter.SHOW_TEXT);
            while (walker.nextNode()) {
              const node = walker.currentNode;
              const original = node.textContent;
              const translated = dictionary[original.trim()];
              if (translated) node.textContent = original.replace(original.trim(), translated);
            }
          }, ruCaptureStrings);
          await page.waitForTimeout(180);
        }
        await page.addStyleTag({ content: fullContent });
        await page.waitForTimeout(180);
        const captureContext = { screen, locale, viewport, role, route: path, sourceCommit: sha, acceptedCodeCommit,
          fixture: screen === 'action-approvals' ? 'ap-5 · Ferrum Logistics · $120 invoice credit · APAC' : screen === 'run-detail' ? 'run-24a8-0917 · Nordwind GmbH · $1,120 · EMEA' : 'fresh seeded session; no verdict or policy submitted',
          clock: '2026-08-25T07:12:00Z', capturedAt: new Date().toISOString(),
          scrollExport: fullContent, localeCompletion: locale === 'ru' ? 'scripts/agent-ops-v2/ru-capture-strings.mjs' : null, errors };
        await save(page, page.locator('#root'), `${screen}-${width === 1440 ? 'desktop' : 'mobile'}`, captureContext);
        if (screen === 'action-approvals') {
          await save(page, page.locator('section[data-pane]'), `approval-task-${width === 1440 ? 'desktop' : 'mobile'}`, { ...captureContext, crop: 'Complete selected task from header through the bottom of its decision dock; empty stretched canvas below the dock excluded' }, true, 24);
          await save(page, page.locator('[data-consequence]'), `approval-consequences-${width === 1440 ? 'desktop' : 'mobile'}`, captureContext, false, 24);
        }
        if (width === 390 && screen === 'run-detail') await save(page, page.locator('[data-pane="trace"]'), 'run-evidence-mobile', captureContext, false, 24);
        if (width === 390 && screen === 'policy-editor') await save(page, page.locator('section[class*="_plate_"]').first(), 'policy-boundary-mobile', captureContext, false, 24);
        if (width === 390 && screen === 'policy-version-diff') await save(page, page.locator('[data-rollout]'), 'policy-rollout-mobile', captureContext, false, 24);
        console.log(`${screen} ${locale} ${width}: ${entries.at(-1).width}×${entries.at(-1).height}`);
        await context.close();
      }
    }
  }
  await mkdir('src/data', { recursive: true });
  await writeFile('src/data/agent-ops-v2-media.json', JSON.stringify(media, null, 2) + '\n');
  await writeFile('audit/agent-ops-v2/capture-manifest.json', JSON.stringify({ repository: 'NikitaKanarev97/Agent-ops-console', sourceCommit: sha, entries }, null, 2) + '\n');
} finally { await browser.close(); }
