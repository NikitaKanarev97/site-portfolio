// Fresh Pawly product captures for Case V2. Read-only against NikitaKanarev97/pawly main a327d73.
// Usage: node product-capture.mjs <pawly-dist> <out-dir> [filter]
//   <pawly-dist>  `vite build` of a327d73 (D:/Claude-projects/pawly-a327d73-dist), served with the app's own
//                 Vercel rewrite (every path → index.html). PAWLY_URL overrides the server (parity check vs production).
// One walk, one clock: every state uses the seed's own 14:00 slot (pickup 14:05, expected 14:50, return 14:52) and
// Playwright's clock at 22 Aug 2026 13:20 MSK, the app's demoNow. The 16:30 slot (16:35/17:22) is never used.
// Fixtures follow pawly/audit/*/harness.mjs at a327d73; after the seed every transition is driven through the UI.
// Output per shot: <name>.png (first 844 px), <name>-full.png (viewport grown to the document so the sticky dock
// sits after the content) and geometry in captures.json, so crops are measured from DOM boxes, not eyeballed.
import { createRequire } from 'node:module'
import { createServer } from 'node:http'
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
const { chromium } = createRequire('D:/Claude-projects/PETS-walking/package.json')('playwright')

const [dist, out, filter] = process.argv.slice(2)
const only = filter ? new RegExp(filter) : null
await mkdir(out, { recursive: true })
const KEY = 'pawly-wire-data-v4'
const T0 = Date.parse('2026-08-22T13:20:00+03:00')

const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.json': 'application/json', '.jpg': 'image/jpeg' }
const server = createServer(async (req, res) => {
  const p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '')
  let file = join(dist, p)
  try { if (!(await stat(file)).isFile()) throw 0 } catch { file = join(dist, 'index.html') }
  res.setHeader('content-type', types[extname(file)] ?? 'application/octet-stream')
  res.end(await readFile(file))
}).listen(5281, '127.0.0.1')
const baseURL = process.env.PAWLY_URL ?? 'http://127.0.0.1:5281'

// --- fixtures (pawly/audit/pawly-handover-photo-v1/v1/harness.mjs, pawly-replacement-offer-premium-v1/v1.2 noReserve) ---
const accepted = (d, booking = {}) => ({
  ...d, selectedWalkerId: 'marina', riskProfile: { ...d.riskProfile, answered: true },
  booking: { ...d.booking, status: 'active', walkerAcceptedId: 'marina', pickupComplete: false, dropoffComplete: false, handoverPhase: 'pickup', returnPhotoRequested: false, photoDraft: undefined, settlement: undefined, cancellation: undefined, cancellationReason: '', offer: undefined, replacement: undefined, ...booking },
  review: { rating: null, comment: '', flags: [], submitted: false },
})
const states = {
  // Owner choosing: the seed booking as a draft with the safety profile answered (walker-list v1.1 'regular').
  choosing: d => ({ ...d, selectedWalkerId: 'marina', riskProfile: { ...d.riskProfile, answered: true }, booking: { ...d.booking, status: 'draft', pickupComplete: false, dropoffComplete: false, returnPhotoRequested: false, replacement: undefined, offer: undefined, photoDraft: undefined, settlement: undefined } }),
  // Accepted, before pickup: photo 1 of 2 due.
  pickup: d => accepted(d),
  // Pickup confirmed, return due (owner Active Service / walker order during the walk).
  walking: d => accepted(d, { pickupComplete: true, handoverPhase: 'dropoff', returnPhotoRequested: true, photoDraft: { phase: 'pickup', walkerId: 'marina', state: 'confirmed', attempt: 1 } }),
}

// --- UI drivers (same network method as the product harness: the demo acknowledgement is a fetch of ?proof-attempt=N) ---
const ack = '**/assets/proof/*proof-attempt=*'
const stored = page => page.evaluate(k => JSON.parse(localStorage.getItem(k)), KEY)
const draft = async page => (await stored(page)).booking.photoDraft?.state
const waitDraft = async (page, s) => { for (let i = 0; i < 60 && await draft(page) !== s; i++) await page.clock.runFor(100); }
const toReview = async page => { await page.locator('[data-track="photo-select"]').click(); await page.waitForURL(/handover-photo-review/) }
const send = page => page.locator('[data-track="photo-send"]').click()
const steps = {
  none: async () => {},
  review: toReview,
  failed: async page => { await toReview(page); await page.route(ack, r => r.abort('failed')); await send(page); await waitDraft(page, 'failed') },
  retried: async page => { await toReview(page); await page.route(ack, r => r.abort('failed')); await send(page); await waitDraft(page, 'failed'); await page.unroute(ack); await send(page); await waitDraft(page, 'confirmed') },
  confirmed: async page => { await toReview(page); await send(page); await waitDraft(page, 'confirmed') },
  // The walk's outcome, reached in the same session: failed send → retry → confirmed, then the walker's own
  // "View earnings" action, or the owner's report route. Nothing about the settlement is seeded.
  earnings: async page => { await steps.retried(page); await page.locator('footer button').first().click(); await page.waitForURL(/walker-earnings/) },
  report: async (page, locale) => { await steps.retried(page); await page.goto(`${baseURL}${locale === 'ru' ? '/ru' : ''}/app/order-details`); await page.locator('article').first().waitFor() },
}

// [name, route, state, step]
const shots = [
  ['walker-list', '/app/walker-list', 'choosing', 'none'],
  ['walker-profile', '/app/walker-profile', 'choosing', 'none'],
  ['booking-review', '/app/booking-review', 'choosing', 'none'],
  ['replacement-no-reserve', '/app/replacement-offer', 'pickup', 'none'],
  ['walker-order-pickup', '/app/walker-active-order', 'pickup', 'none'],
  ['active-service-walking', '/app/active-service', 'walking', 'none'],
  ['walker-order-walking', '/app/walker-active-order', 'walking', 'none'],
  ['return-capture', '/app/handover-photo', 'walking', 'none'],
  ['return-selected', '/app/handover-photo', 'walking', 'review'],
  ['return-failed', '/app/handover-photo', 'walking', 'failed'],
  ['return-confirmed', '/app/handover-photo', 'walking', 'retried'],
  ['order-details', '/app/handover-photo', 'walking', 'report'],
  ['walker-earnings', '/app/handover-photo', 'walking', 'earnings'],
]

const browser = await chromium.launch()
const facts = { product: 'NikitaKanarev97/pawly', sha: 'a327d73abb3e7872a6243301afc926de57dc868b', baseURL, KEY, clock: new Date(T0).toISOString(), viewport: '390x844', dpr: 2, reducedMotion: 'reduce', captures: [] }
try {
  const seed = await browser.newPage()
  await seed.goto(`${baseURL}/app/owner-home`)
  await seed.locator('article').first().waitFor()
  const base = JSON.parse(await seed.evaluate(k => localStorage.getItem(k), KEY))
  await seed.close()
  facts.seed = { slot: base.booking.window, pickupAt: base.booking.pickupAt, backBy: base.booking.backBy, dropoffAt: base.booking.dropoffAt, total: base.booking.total }
  for (const [shot, route, state, step] of shots) for (const locale of ['en', 'ru']) {
    const name = `${shot}-${locale}`
    if (only && !only.test(name)) continue
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', deviceScaleFactor: 2 })
    await context.addInitScript(([k, v]) => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem(k, v); sessionStorage.setItem('seeded', '1') } }, [KEY, JSON.stringify(states[state](structuredClone(base)))])
    const page = await context.newPage()
    await page.clock.install({ time: T0 })
    const errors = []
    page.on('pageerror', e => errors.push(String(e)))
    page.on('console', m => { if (m.type() === 'error' && !/proof-attempt|Failed to load resource/.test(m.text())) errors.push(m.text()) })
    await page.goto(`${baseURL}${locale === 'ru' ? '/ru' : ''}${route}`)
    await page.locator('article').first().waitFor()
    await steps[step](page, locale)
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.complete ? null : new Promise(r => { i.onload = i.onerror = r }))) })
    await page.clock.runFor(1200) // RU overlay runs on a 500 ms interval
    await page.waitForTimeout(300)
    await page.screenshot({ path: `${out}/${name}.png` })
    const docHeight = await page.evaluate(() => document.documentElement.scrollHeight)
    await page.setViewportSize({ width: 390, height: docHeight })
    await page.clock.runFor(600)
    await page.waitForTimeout(300)
    await page.screenshot({ path: `${out}/${name}-full.png` })
    // Geometry in the grown viewport (= full-document coordinates, CSS px; multiply by 2 for the PNG).
    const geo = await page.evaluate(() => {
      const r = el => (({ x, y, width, height }) => ({ x: Math.round(x), y: Math.round(y), w: Math.round(width), h: Math.round(height) }))(el.getBoundingClientRect())
      const article = document.querySelector('article')
      const nodes = [...article.querySelectorAll('header, main > *, main > * > *, section, footer, figure, [role="status"], [role="alert"]')]
      return {
        url: location.pathname,
        h1: article.querySelector('h1')?.textContent.trim(),
        article: r(article),
        blocks: nodes.map(el => ({ tag: el.tagName.toLowerCase(), cls: (el.className?.toString() ?? '').replace(/_[a-z0-9]{5}_\d+/g, '').trim().slice(0, 40), text: el.innerText.replace(/\s+/g, ' ').slice(0, 70), ...r(el) })).filter(b => b.h > 0),
        text: article.innerText.replace(/\n+/g, ' | ').slice(0, 1600),
      }
    })
    const data = (await stored(page)).booking
    facts.captures.push({ name, route, locale, state, step, docHeight, draft: data.photoDraft?.state ?? null, pickupComplete: data.pickupComplete, dropoffComplete: data.dropoffComplete, errors, ...geo })
    console.log(name, '|', geo.url, '|', geo.h1, '| doc', docHeight, '| draft', data.photoDraft?.state ?? '-', errors.length ? errors : '')
    await context.close()
  }
} finally {
  await browser.close()
  server.close()
  await writeFile(`${out}/captures${only ? '-partial' : ''}.json`, JSON.stringify(facts, null, 1) + '\n')
}
