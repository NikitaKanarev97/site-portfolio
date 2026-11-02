/** Capture-side observation only: never finish GSAP, change opacity or disable motion. */
export async function observeLifecycle(page) {
  await page.addInitScript(() => {
    window.__learnCapture = { events: [], started: performance.now() };
    for (const name of ['DOMContentLoaded', 'astro:page-load', 'astro:after-swap']) {
      document.addEventListener(name, () => window.__learnCapture.events.push({ name, ms: performance.now() }));
    }
  });
}

export async function waitForMotion(page, selector = '[data-motion-intro]') {
  await page.waitForFunction(selector => {
    const root = document.querySelector(selector);
    if (!root) return false;
    const visible = e => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden';
    const targets = [...root.querySelectorAll('[data-motion="fade"], [data-motion="fade-image"], [data-motion="rise"], [data-motion="lines"]')].filter(visible);
    // Inline 1 proves initialization happened; pre-init computed opacity alone can be 1.
    return targets.length > 0 && targets.every(e => {
      const s = getComputedStyle(e);
      const m = new DOMMatrix(s.transform);
      return e.style.opacity === '1' && s.opacity === '1' && s.willChange === 'auto' && m.isIdentity;
    }) && [...root.querySelectorAll('[data-motion="draw"]')].filter(visible).every(e => {
      const s = getComputedStyle(e);
      return parseFloat(s.strokeDashoffset) === 0 && new DOMMatrix(s.transform).isIdentity;
    });
  }, selector, { timeout: 30000 });
  // Require unchanged geometry across multiple frames after the endpoint, including ancestors.
  await page.waitForFunction(selector => {
    const nodes = [document.body, document.querySelector(selector), ...document.querySelectorAll(`${selector} [data-motion]`)];
    const state = JSON.stringify(nodes.filter(Boolean).map(e => {
      const r = e.getBoundingClientRect(), s = getComputedStyle(e);
      return [r.x, r.y, r.width, r.height, s.opacity, s.transform, s.willChange];
    }));
    const previous = window.__learnStable;
    if (!previous || previous.selector !== selector || previous.state !== state) {
      window.__learnStable = { selector, state, since: performance.now() };
      return false;
    }
    return performance.now() - previous.since >= 350;
  }, selector, { polling: 'raf', timeout: 30000 });
}

/** Empty src resolves to the document URL in img.src; inspect attributes instead. */
export function imageInventory() {
  const missing = [], ignored = [], images = [];
  for (const i of document.images) {
    const src = i.getAttribute('src')?.trim() ?? '';
    const srcset = i.getAttribute('srcset')?.trim() ?? '';
    const dialog = i.closest('dialog[data-media-zoom]');
    if (i.matches('[data-media-zoom-image]') && dialog && !dialog.open && !src && !srcset && !i.currentSrc) {
      ignored.push({ reason: 'empty image in closed MediaZoom; source assigned on open', html: i.outerHTML });
      continue;
    }
    const record = { source: i.currentSrc || src || srcset || '(empty image source)', complete: i.complete, naturalWidth: i.naturalWidth, naturalHeight: i.naturalHeight };
    images.push(record);
    if (!record.complete || !record.naturalWidth) missing.push(record);
  }
  return { missing, ignored, images };
}

export async function decodeImages(page) {
  await page.evaluate(async () => {
    const assigned = [...document.images].filter(i => i.getAttribute('src')?.trim() || i.getAttribute('srcset')?.trim() || i.closest('picture')?.querySelector('source[srcset]'));
    for (const i of assigned) i.loading = 'eager';
    await Promise.all(assigned.map(i => i.decode().catch(() => {})));
    await document.fonts.ready;
  });
  const inventory = await page.evaluate(imageInventory);
  if (inventory.missing.length) throw Error(`Missing images: ${JSON.stringify(inventory.missing)}`);
  return inventory;
}

export async function preparePage(page) {
  await page.waitForFunction(() => window.__learnCapture?.events.some(e => e.name === 'astro:page-load'));
  await decodeImages(page);
  // Finish the entire intro naturally before scrolling or taking even the first viewport.
  await waitForMotion(page);
  for (let y = 0; y < await page.evaluate(() => document.documentElement.scrollHeight); y += 550) {
    await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), y);
    await page.waitForTimeout(80);
  }
  await waitForMotion(page, '.learn-case');
  await decodeImages(page);
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await waitForMotion(page);
  return page.evaluate(() => ({
    events: window.__learnCapture.events, settledAtMs: performance.now(),
    intro: [...document.querySelectorAll('[data-motion-intro] [data-motion]')].map(e => ({ motion: e.dataset.motion, opacity: getComputedStyle(e).opacity, transform: getComputedStyle(e).transform, willChange: getComputedStyle(e).willChange })),
  }));
}
