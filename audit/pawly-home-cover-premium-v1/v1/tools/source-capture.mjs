// Fresh source captures of the deployed Pawly prototype (main a327d73 → pawly-fawn.vercel.app), read-only.
// Fixtures mirror pawly/audit/pawly-order-details-premium-v1/v1/harness.mjs at a327d73: the app's own default
// data with booking fields set to what finishProof() / the pickup transition write. Nothing is added.
// Usage: node audit/pawly-home-cover-premium-v1/v1/tools/source-capture.mjs
import { createRequire } from 'node:module'
import { mkdir, writeFile } from 'node:fs/promises'
const { chromium } = createRequire('D:/Claude-projects/b2b-dssl/package.json')('playwright')

const baseURL = process.env.PAWLY_URL ?? 'https://pawly-fawn.vercel.app'
const KEY = 'pawly-wire-data-v4'
const T0 = Date.parse('2026-08-22T13:20:00+03:00')
const out = 'audit/pawly-home-cover-premium-v1/v1/assets/source'
await mkdir(out, { recursive: true })

const pre = (d, booking = {}) => ({
  ...d, selectedWalkerId: 'marina', riskProfile: { ...d.riskProfile, answered: true },
  booking: { ...d.booking, status: 'active', pickupComplete: false, dropoffComplete: false, handoverPhase: 'pickup', returnPhotoRequested: false, walkerAcceptedId: 'marina', offer: undefined, photoDraft: undefined, settlement: undefined, cancellation: undefined, cancellationReason: '', replacement: undefined, ...booking },
  review: { rating: null, comment: '', flags: [], submitted: false },
})
const done = { status: 'completed', pickupComplete: true, dropoffComplete: true, handoverPhase: 'dropoff', photoDraft: { phase: 'dropoff', walkerId: 'marina', state: 'confirmed', attempt: 1 }, settlement: { gross: 950, fee: 171, net: 779, kind: 'walk' } }
const walking = { pickupComplete: true, handoverPhase: 'dropoff', photoDraft: { phase: 'pickup', walkerId: 'marina', state: 'confirmed', attempt: 1 } }
const shots = [
  { name: 'order-details-completed', route: '/app/order-details', fixture: d => pre(d, done) },
  { name: 'active-service-walking', route: '/app/active-service', fixture: d => pre(d, walking) },
]

const browser = await chromium.launch()
const facts = { baseURL, KEY, T0: new Date(T0).toISOString(), dsf: 2, width: 390, captures: [] }
try {
  const seed = await browser.newPage()
  await seed.goto(`${baseURL}/app/owner-home`)
  await seed.locator('article').first().waitFor()
  const base = JSON.parse(await seed.evaluate(k => localStorage.getItem(k), KEY))
  if (!base) throw new Error(`No ${KEY} in deployed app — fixture key changed`)
  facts.build = await seed.evaluate(() => [...document.scripts].map(s => s.src).filter(Boolean))
  await seed.close()
  for (const shot of shots) for (const locale of ['en', 'ru']) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', deviceScaleFactor: 2 })
    await context.addInitScript(([k, v]) => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem(k, v); sessionStorage.setItem('seeded', '1') } }, [KEY, JSON.stringify(shot.fixture(structuredClone(base)))])
    const page = await context.newPage()
    await page.clock.install({ time: T0 })
    const errors = []
    page.on('pageerror', e => errors.push(String(e)))
    await page.goto(`${baseURL}${locale === 'ru' ? '/ru' : ''}${shot.route}`)
    await page.locator('article').first().waitFor()
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.complete ? null : new Promise(r => { i.onload = i.onerror = r }))) })
    await page.clock.runFor(600)
    await page.waitForTimeout(400)
    const name = `${shot.name}-${locale}-390@2x`
    await page.screenshot({ path: `${out}/${name}.png` })
    // Geometry of the product's own regions, so crop bounds are measured, not eyeballed.
    const geo = await page.evaluate(() => {
      const r = el => el && (({ x, y, width, height }) => ({ x, y, width, height }))(el.getBoundingClientRect())
      const article = document.querySelector('article')
      return {
        url: location.href,
        h1: article.querySelector('h1')?.textContent.trim(),
        article: r(article),
        sections: [...article.querySelectorAll(':scope > *, :scope > * > section')].map(el => ({ tag: el.tagName, cls: el.className?.toString().slice(0, 60), text: el.innerText.slice(0, 80).replace(/\n/g, ' | '), ...r(el) })),
        proofs: [...article.querySelectorAll('figure[data-proof-status]')].map(f => ({ status: f.dataset.proofStatus, text: f.innerText.replace(/\n/g, ' | '), ...r(f) })),
        text: article.innerText.replace(/\n+/g, ' | ').slice(0, 900),
      }
    })
    // Full document: viewport grown to the document so the sticky dock sits after the content, not over it.
    const docHeight = await page.evaluate(() => document.documentElement.scrollHeight)
    await page.setViewportSize({ width: 390, height: docHeight })
    await page.waitForTimeout(200)
    await page.screenshot({ path: `${out}/${name}-full.png` })
    const full = await page.evaluate(() => [...document.querySelectorAll('article > *, article > * > section')].map(el => (({ y, height }) => ({ tag: el.tagName, y, bottom: y + height, text: el.innerText.slice(0, 40).replace(/\n/g, ' | ') }))(el.getBoundingClientRect())))
    facts.captures.push({ name, route: shot.route, locale, errors, docHeight, ...geo, full })
    console.log(name, geo.h1, errors.length ? errors : '')
    await context.close()
  }
} finally {
  await browser.close()
  await writeFile(`${out}/capture.json`, JSON.stringify(facts, null, 1) + '\n')
}
