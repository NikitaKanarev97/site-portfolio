// Real browser captures of the built Home: node capture.mjs <phase> <port> [widths]
// phase = before | after | cand-A | cand-B … ; writes <root>/<dir>/ and logs/<phase>.json
import { createRequire } from 'node:module'
import { mkdir, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
const { chromium } = createRequire('D:/Claude-projects/b2b-dssl/package.json')('playwright')
const [phase = 'before', port = '4433', list] = process.argv.slice(2)
const widths = list ? list.split(',').map(Number) : [1440, 1024, 768, 390, 360]
const heights = { 1440: 900, 1024: 900, 768: 1024, 390: 844, 360: 800 }
const root = 'audit/pawly-home-cover-premium-v1/v1'
const dir = phase.startsWith('cand') ? `${root}/comparisons/candidates/${phase.slice(5)}` : `${root}/${phase}`
await mkdir(dir, { recursive: true })
const hash = s => createHash('sha256').update(s).digest('hex')
const browser = await chromium.launch()
const results = []
try {
  for (const locale of ['en', 'ru']) for (const width of widths) {
    const height = heights[width] ?? 900
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: 'reduce' })
    const page = await context.newPage()
    const errors = [], failures = []
    page.on('pageerror', e => errors.push(e.message))
    page.on('response', r => { if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`) })
    await page.goto(`http://127.0.0.1:${port}/${locale === 'ru' ? 'ru/' : ''}`, { waitUntil: 'networkidle' })
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].filter(i => !i.closest('dialog')).map(async i => { i.loading = 'eager'; await i.decode().catch(() => {}) })) })
    const prefix = `${dir}/${locale}-${width}`
    const card = page.locator('#work-pawly')
    await card.screenshot({ path: `${prefix}-pawly.png` })
    if (!phase.startsWith('cand')) {
      await page.screenshot({ path: `${prefix}-full.jpg`, type: 'jpeg', quality: 85, fullPage: true })
      await page.screenshot({ path: `${prefix}-first.jpg`, type: 'jpeg', quality: 85 })
      // Initial viewport when a visitor lands on the card (title at the top of the screen).
      await page.evaluate(() => { const r = document.querySelector('#work-pawly').getBoundingClientRect(); scrollTo(0, scrollY + r.top - 24) })
      await page.waitForTimeout(100)
      await page.screenshot({ path: `${prefix}-pawly-viewport.png` })
      // Neighbouring context: the end of the Vet card, the whole Pawly card and what follows it.
      const clip = await page.evaluate(() => {
        const v = document.querySelector('#work-vet-clinic').getBoundingClientRect(), p = document.querySelector('#work-pawly').getBoundingClientRect()
        const y = scrollY + v.bottom - 320
        return { x: 0, y, width: innerWidth, height: scrollY + p.bottom + 200 - y }
      })
      await page.evaluate(() => scrollTo(0, 0))
      await page.screenshot({ path: `${prefix}-context.jpg`, type: 'jpeg', quality: 85, fullPage: true, clip })
    }
    const metrics = await page.evaluate(() => {
      const card = document.querySelector('#work-pawly'), r = card.getBoundingClientRect()
      return {
        overflow: document.documentElement.scrollWidth - innerWidth,
        pawlyHeight: Math.round(r.height),
        pawlyStage: (({ width, height }) => ({ width: Math.round(width), height: Math.round(height) }))(card.querySelector('.featured-case__stage').getBoundingClientRect()),
        cardOverflow: [...card.querySelectorAll('*')].filter(el => el.getBoundingClientRect().right > r.right + 0.5 || el.getBoundingClientRect().left < r.left - 0.5).map(el => el.className?.toString()).slice(0, 5),
        images: [...card.querySelectorAll('img')].map(i => ({ src: i.currentSrc.replace(location.origin, ''), rendered: [Math.round(i.getBoundingClientRect().width), Math.round(i.getBoundingClientRect().height)], natural: [i.naturalWidth, i.naturalHeight], alt: i.alt, radius: getComputedStyle(i).borderRadius })),
        brokenImages: [...document.images].filter(i => !i.closest('dialog') && (!i.complete || !i.naturalWidth)).map(i => i.src),
        links: [...card.querySelectorAll('a')].map(a => ({ href: a.getAttribute('href'), label: a.getAttribute('aria-label') || a.textContent.trim() })),
        text: card.innerText.replace(/\n+/g, ' | '),
        protected: Object.fromEntries(['.hero', '#work-agent-ops-console', '#work-partner-portal', '#work-learn', '#work-vet-clinic'].map(s => [s, document.querySelector(s)?.outerHTML])),
      }
    })
    metrics.protected = Object.fromEntries(Object.entries(metrics.protected).map(([k, v]) => [k, hash(v ?? 'MISSING')]))
    results.push({ locale, width, height, ...metrics, errors, failures })
    await context.close()
  }
} finally {
  await browser.close()
  await writeFile(`${root}/logs/${phase}.json`, JSON.stringify({ phase, port, browser: browser.version(), dpr: 1, reducedMotion: 'reduce', results }, null, 2) + '\n')
}
console.log(JSON.stringify(results.map(({ locale, width, overflow, pawlyHeight, errors, failures, brokenImages }) => ({ locale, width, overflow, pawlyHeight, errors: errors.length, failures: failures.length, broken: brokenImages.length }))))
