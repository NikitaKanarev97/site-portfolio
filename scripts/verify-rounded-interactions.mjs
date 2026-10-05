/** Zoom, resize, pinned frame bounds and native Learn completion navigation. */
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
const { chromium } = createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright');
const origin = process.argv[2] ?? 'http://127.0.0.1:4477';
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const checks = [], errors = [];
const fixture = JSON.parse(await readFile('../learn/audit/product-polish/evidence/07/state-marina-one.json', 'utf8'));
fixture.toasts = [];
try {
  for (const lang of ['en', 'ru']) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${origin}${lang === 'ru' ? '/ru' : ''}/work/agent-ops-console/`, { waitUntil: 'networkidle' });
    for (const width of [1440, 820, 390, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.waitForTimeout(250);
      const trigger = page.locator('.case-callout [data-zoom-trigger]');
      await trigger.scrollIntoViewIfNeeded();
      await trigger.click();
      await page.locator('[data-media-zoom-image]').evaluate(image => image.decode());
      const zoom = await page.locator('[data-media-zoom]').evaluate(dialog => {
        const image = dialog.querySelector('img'), surface = dialog.querySelector('.screen-surface');
        const css = getComputedStyle(image);
        return { open: dialog.open, src: image.currentSrc, radius: getComputedStyle(surface).borderTopLeftRadius,
          width: parseFloat(css.width), height: parseFloat(css.height), naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight,
          fits: surface.getBoundingClientRect().width <= dialog.querySelector('.media-zoom__viewport').clientWidth,
          background: getComputedStyle(surface).backgroundColor };
      });
      assert(zoom.open && zoom.fits && zoom.radius === '16px', JSON.stringify(zoom));
      assert(Math.abs(zoom.height - zoom.width * zoom.naturalHeight / zoom.naturalWidth) < 1, JSON.stringify(zoom));
      assert(zoom.src.includes(width < 768 ? '390.webp' : '1440.webp'), JSON.stringify(zoom));
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('dialog[open]').count(), 0);
      checks.push({ lang, width, kind: 'zoom', ...zoom });
      if (width >= 1440) {
        const stage = page.locator('.case-steps.is-focused');
        assert.equal(await stage.count(), 1);
        for (const progress of [0.05, 0.4, 0.72, 0.95]) {
          await stage.evaluate((node, fraction) => {
            const spacer = node.closest('.pin-spacer');
            scrollTo(0, spacer.getBoundingClientRect().top + scrollY + (spacer.offsetHeight - node.offsetHeight) * fraction);
          }, progress);
          await page.waitForTimeout(1100);
          const bounds = await stage.evaluate(node => {
            const samples = [];
            for (const step of node.querySelectorAll('.case-steps__step')) {
              if (parseFloat(getComputedStyle(step).opacity) < 0.9 || getComputedStyle(step).visibility === 'hidden') continue;
              const screen = step.querySelector('.case-screen'), shot = step.querySelector('.case-steps__shot');
              const s = screen.getBoundingClientRect(), p = shot.getBoundingClientRect(), field = node.getBoundingClientRect();
              samples.push({ bottom: s.bottom - p.bottom, right: s.right - p.right, width: s.width,
                fieldLeft: s.left - field.left, fieldRight: field.right - s.right,
                scene: step.dataset.scene, screenWidth: screen.offsetWidth, shotWidth: shot.clientWidth,
                screenTransform: getComputedStyle(screen).transform, shotTransform: getComputedStyle(shot).transform,
                shotPadding: getComputedStyle(shot).padding, stepTransform: getComputedStyle(step).transform });
            }
            return samples;
          });
          // The entering card translates inside the coloured stage; the outer
          // fields, rather than the invisible shot cell, are the safe boundary.
          assert(bounds.every(sample => sample.bottom <= 1 && sample.fieldLeft >= 15 && sample.fieldRight >= 15 && sample.width > 0), JSON.stringify({ width, progress, bounds }));
          checks.push({ lang, width, progress, kind: 'pinned bounds', bounds });
        }
      }
    }
    await page.close();
    for (const width of [390, 820, 1440]) {
      const player = await browser.newPage({ viewport: { width, height: 1000 } });
      await player.addInitScript(state => {
        sessionStorage.setItem('learn-prototype-v1', JSON.stringify(state));
        sessionStorage.setItem('learn-account-v2:' + encodeURIComponent(state.session.identifier), JSON.stringify(state));
      }, fixture);
      await player.goto(`${origin}/prototypes/learn/player/puskonaladka/2?lang=${lang}`, { waitUntil: 'networkidle' });
      const button = player.locator('div[class*="_nextAction_"] > button');
      const geometry = await button.evaluate(node => ({ width: node.offsetWidth, parentWidth: node.parentElement.offsetWidth }));
      assert(Math.abs(geometry.width - geometry.parentWidth) < 1, JSON.stringify(geometry));
      await button.click();
      await player.waitForURL('**/player/puskonaladka/3?lang=' + lang);
      const done = await player.evaluate(() => JSON.parse(sessionStorage.getItem('learn-prototype-v1')).progress.puskonaladka.doneUnitIds.includes('puskonaladka#2'));
      assert(done, 'Explicit completion records unit 2');
      checks.push({ lang, width, kind: 'completion navigation', ...geometry, done });
      await player.close();
    }
  }
  assert.equal(errors.length, 0, errors.join('\n'));
} finally {
  await browser.close();
  await mkdir('tmp/rounded-media', { recursive: true });
  await writeFile('tmp/rounded-media/interactions.json', JSON.stringify({ checks, errors }, null, 2));
}
console.log(`${checks.length} interaction checks passed; ${errors.length} browser errors`);
