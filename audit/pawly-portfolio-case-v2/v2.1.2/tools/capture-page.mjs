// Pawly case page captures for V2.1.2, identical for BEFORE and AFTER (V2.1 tool + intermediate widths, plate/frame
// boxes per image, and 200% browser zoom: half the CSS viewport at DPR 2, which is what Chromium zoom renders).
// Usage: node capture-page.mjs <dist-dir> <out-dir> [port]
// Chromium, DPR 1, reduced motion (animations settle to their end state), fonts and images awaited.
// Per locale × width: first viewport, full page, the six chapters as named section captures at every width, page facts.
// V2.1: `media` records, per product image, its document rect and the rects of its label and caption; measure.py reads
// the image's visual field from the full-page pixels, so BEFORE and AFTER are measured the same way whatever the DOM.
import { createRequire } from 'node:module'
import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
const { chromium } = createRequire('D:/Claude-projects/PETS-walking/package.json')('playwright')

const [dist, out, port = '4391'] = process.argv.slice(2)
const here = path.dirname(fileURLToPath(import.meta.url))
await mkdir(out, { recursive: true })
const server = spawn(process.execPath, [path.join(here, 'serve.mjs'), dist, port], { stdio: 'ignore' })
await new Promise(r => setTimeout(r, 800))

const widths = [[1440, 900], [1279, 800], [1100, 800], [1024, 768], [900, 1000], [800, 1000], [768, 1024], [390, 844], [360, 800], [320, 640],
  // 200% zoom of a 1440 / 1024 / 768 window
  [720, 450, 2], [512, 384, 2], [384, 512, 2]]
const routes = { en: '/work/pawly/', ru: '/ru/work/pawly/' }
const facts = []
const browser = await chromium.launch()
try {
  for (const [locale, route] of Object.entries(routes)) for (const [width, height, dpr = 1] of widths) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce', deviceScaleFactor: dpr })
    const page = await context.newPage()
    page.setDefaultTimeout(20000)
    const errors = []
    page.on('pageerror', e => errors.push(String(e)))
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
    await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: 'load', timeout: 30000 })
    // Lazy media: walk the page once so every image decodes, then return to the top.
    await page.evaluate(async () => {
      document.querySelectorAll('img').forEach(i => { i.loading = 'eager'; i.decoding = 'sync' })
      for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight / 2) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)) }
      scrollTo(0, 0)
      await document.fonts.ready
      await Promise.race([Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r }))), new Promise(r => setTimeout(r, 8000))]); await Promise.race([Promise.all([...document.images].map(i => i.decode().catch(() => {}))), new Promise(r => setTimeout(r, 8000))])
    })
    await page.waitForTimeout(1500)
    const name = dpr === 1 ? `${locale}-${width}` : `${locale}-zoom200-${width * dpr}`
    await page.screenshot({ path: `${out}/${name}-viewport.png` })
    // Zoom runs keep only the overflow facts and the Return section (seam check); full pages at DPR 2 are not measured.
    if (dpr === 1) await page.screenshot({ path: `${out}/${name}-full.png`, fullPage: true })
    const info = await page.evaluate(() => ({
      docHeight: document.documentElement.scrollHeight,
      overflowX: document.documentElement.scrollWidth - innerWidth,
      brokenImages: [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.currentSrc || i.src),
      sections: [...document.querySelectorAll('section[id], [data-case-cover]')].map(s => ({ id: s.id || s.dataset.caseCover, top: Math.round(s.getBoundingClientRect().top + scrollY), height: Math.round(s.getBoundingClientRect().height) })),
      // Smallest rendered scale of any product capture: rendered CSS width / intrinsic width × 2 (captures are DPR 2).
      shots: [...document.querySelectorAll('main img')].map(i => ({ src: (i.currentSrc || i.src).replace(location.origin, ''), rendered: Math.round(i.getBoundingClientRect().width), natural: i.naturalWidth })).filter(s => s.rendered > 0),
      media: [...document.querySelectorAll('.pawly-cover img, .pawly-sheet img')].map(i => {
        const box = e => { if (!e) return null; const r = e.getBoundingClientRect(); return { x: Math.round(r.left + scrollX), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height) } }
        const fig = i.closest('figure'), sec = i.closest('section')
        return { src: (i.currentSrc || i.src).split('/').pop(), section: sec?.id || 'hero', img: box(i), frame: box(i.closest('.pawly-shot__frame')), plate: box(i.closest('.pawly-shot__plate')), label: box(fig?.querySelector('.pawly-shot__label')), caption: box(fig?.querySelector('.pawly-shot__caption, .pawly-stage__caption')) }
      }).filter(m => m.img.w > 0),
      firstViewportImages: [...document.querySelectorAll('main img')].filter(i => { const r = i.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0 && r.width > 0 }).length,
    }))
    const chapters = { hero: '[data-case-cover="case-pawly"]', choosing: '#choosing', handoff: '#handoff', exceptions: '#exceptions', return: '#return', settlement: '#settlement' }
    for (const [id, sel] of Object.entries(chapters)) {
      if (dpr !== 1 && id !== 'return') continue
      await page.locator(sel).first().screenshot({ path: `${out}/${name}-section-${id}.png` }).catch(e => errors.push(`section ${id}: ${e.message.split('\n')[0]}`))
    }
    facts.push({ name, route, width, height, errors, ...info })
    console.log(name, 'h', info.docHeight, 'overflowX', info.overflowX, 'broken', info.brokenImages.length, 'firstVpImgs', info.firstViewportImages, 'err', errors.length)
    await context.close()
  }
} finally {
  await browser.close()
  server.kill()
  await writeFile(`${out}/facts.json`, JSON.stringify(facts, null, 1) + '\n')
}
