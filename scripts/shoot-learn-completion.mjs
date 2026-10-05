/** Capture the whole completion footer after its shared fill layout is fixed. */
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const { chromium } = createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright');
const origin = process.argv[2] ?? 'http://127.0.0.1:4476';
const fixture = JSON.parse(await readFile('../learn/audit/product-polish/evidence/07/state-marina-one.json', 'utf8'));
fixture.toasts = [];
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const report = [];
try {
  for (const lang of ['en', 'ru']) for (const width of [1440, 390]) {
    const variant = width === 1440 ? 'desktop' : 'mobile';
    const page = await browser.newPage({ viewport: { width, height: 1100 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
    await page.addInitScript(state => {
      sessionStorage.setItem('learn-prototype-v1', JSON.stringify(state));
      sessionStorage.setItem('learn-account-v2:' + encodeURIComponent(state.session.identifier), JSON.stringify(state));
    }, fixture);
    await page.goto(`${origin}/prototypes/learn/player/puskonaladka/2?lang=${lang}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('html').getAttribute('lang'), lang);
    await page.evaluate(() => {
      const ending = document.querySelector('[data-material-body]').lastElementChild;
      const nav = document.querySelector('div[class*="_stepNav_"]');
      const frame = document.createElement('div');
      frame.dataset.completionCapture = '';
      frame.style.cssText = `position:absolute;left:0;top:0;z-index:2147483647;inline-size:${innerWidth < 768 ? innerWidth : 960}px;padding:${innerWidth < 768 ? 16 : 24}px;box-sizing:border-box;display:grid;gap:32px;background:var(--surface-default);`;
      frame.append(ending, nav);
      document.body.append(frame);
    });
    const fields = await page.evaluate(() => {
      const nav = document.querySelector('[data-completion-capture] div[class*="_stepNav_"]');
      const action = nav.querySelector('div[class*="_nextAction_"]');
      const button = action.querySelector('button');
      const rect = n => n.getBoundingClientRect();
      return { nav: rect(nav).width, action: rect(action).width, button: rect(button).width,
        left: rect(button).left - rect(action).left, right: rect(action).right - rect(button).right,
        text: button.textContent.trim() };
    });
    assert(Math.abs(fields.left) < 1 && Math.abs(fields.right) < 1, JSON.stringify(fields));
    assert.equal(fields.text, lang === 'ru' ? 'Завершить и далее' : 'Complete and continue');
    const frame = page.locator('[data-completion-capture]');
    const text = await frame.innerText();
    const file = `public/media/rebuild/learn${lang === 'ru' ? '-ru' : ''}/completion-${variant}.webp`;
    const bytes = await frame.screenshot({ animations: 'disabled' });
    const info = await sharp(bytes).webp({ quality: 94 }).toFile(file);
    const entry = { id: `completion-${variant}`, file, locale: lang, source: page.url(),
      selection: 'Complete final material section and full native step navigation; completion button fills its action column.',
      viewport: { width, height: 1100 }, dpr: 2, width: info.width, height: info.height, text, fields,
      sha256: createHash('sha256').update(await readFile(file)).digest('hex') };
    report.push(entry);
    const manifest = lang === 'ru' ? 'tasks/portfolio-rebuild/integration/learn-story-ru-captures.json' : 'tasks/portfolio-rebuild/learn/captures.json';
    const entries = JSON.parse(await readFile(manifest, 'utf8'));
    const index = entries.findIndex(item => item.id === entry.id);
    assert(index >= 0, `Missing capture ${entry.id}`);
    entries[index] = entry;
    await writeFile(manifest, JSON.stringify(entries, null, 2) + '\n');
    await page.close();
    console.log(`${lang} ${variant}: ${info.width}×${info.height}, action fills ${fields.action}px`);
  }
} finally { await browser.close(); }
await mkdir('tmp/rounded-media', { recursive: true });
await writeFile('tmp/rounded-media/learn-completion.json', JSON.stringify(report, null, 2));
