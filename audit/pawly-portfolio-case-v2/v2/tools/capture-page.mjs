// Pawly case page captures, identical for BEFORE and AFTER.
// Usage: node capture-page.mjs <dist-dir> <out-dir> [port]
// Chromium, DPR 1, reduced motion (animations settle to their end state), fonts and images awaited.
// Per locale × width: first viewport, full page, every <section> with an id (1440 and 390 only), plus page facts.
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

const widths = [[1440, 900], [1024, 768], [768, 1024], [390, 844], [360, 800], [320, 640]]
const routes = { en: '/work/pawly/', ru: '/ru/work/pawly/' }
const facts = []
const browser = await chromium.launch()
try {
  for (const [locale, route] of Object.entries(routes)) for (const [width, height] of widths) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce', deviceScaleFactor: 1 })
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
    const name = `${locale}-${width}`
    await page.screenshot({ path: `${out}/${name}-viewport.png` })
    await page.screenshot({ path: `${out}/${name}-full.png`, fullPage: true })
    const info = await page.evaluate(() => ({
      docHeight: document.documentElement.scrollHeight,
      overflowX: document.documentElement.scrollWidth - innerWidth,
      brokenImages: [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.currentSrc || i.src),
      sections: [...document.querySelectorAll('section[id], [data-case-cover]')].map(s => ({ id: s.id || s.dataset.caseCover, top: Math.round(s.getBoundingClientRect().top + scrollY), height: Math.round(s.getBoundingClientRect().height) })),
      // Smallest rendered scale of any product capture: rendered CSS width / intrinsic width × 2 (captures are DPR 2).
      shots: [...document.querySelectorAll('main img')].map(i => ({ src: (i.currentSrc || i.src).replace(location.origin, ''), rendered: Math.round(i.getBoundingClientRect().width), natural: i.naturalWidth })).filter(s => s.rendered > 0),
      firstViewportImages: [...document.querySelectorAll('main img')].filter(i => { const r = i.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0 && r.width > 0 }).length,
    }))
    if ([1440, 390].includes(width)) {
      for (const s of info.sections) {
        if (!s.id || s.height < 40) continue
        const el = page.locator(`[id="${s.id}"], [data-case-cover="${s.id}"]`).first()
        await el.screenshot({ path: `${out}/${name}-section-${s.id}.png` }).catch(e => errors.push(`section ${s.id}: ${e.message.split('\n')[0]}`))
      }
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
