// Browser QA, BEFORE (4433) vs AFTER (4434): node qa.mjs → logs/qa.json; throws on the first failed assertion.
import { createRequire } from 'node:module'
import { mkdir, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import sharp from 'sharp'
const { chromium } = createRequire('D:/Claude-projects/b2b-dssl/package.json')('playwright')
const root = 'audit/pawly-home-cover-premium-v1/v1'
await mkdir(`${root}/after/states`, { recursive: true })
const protectedTrees = ['header', '.hero', '#work-agent-ops-console', '#work-partner-portal', '#work-learn', '#work-vet-clinic']
const settle = page => page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].filter(i => !i.closest('dialog')).map(async i => { i.loading = 'eager'; await i.decode().catch(() => {}) })) })
const browser = await chromium.launch()
const log = { protectedGeometry: [], casePage: [], interaction: [], lazy: [], pressed: [] }
try {
  // 1. Navigation, hero and the four other covers: every visible descendant's box and selected computed styles.
  for (const locale of ['en', 'ru']) for (const width of [1440, 1024, 768, 390, 360]) {
    const pair = []
    for (const port of [4433, 4434]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })
      await page.goto(`http://127.0.0.1:${port}/${locale === 'ru' ? 'ru/' : ''}`, { waitUntil: 'networkidle' })
      await settle(page)
      pair.push(await page.evaluate(sels => Object.fromEntries(sels.map(sel => {
        const card = document.querySelector(sel), box = card.getBoundingClientRect()
        return [sel, { html: card.outerHTML.length, nodes: [card, ...card.querySelectorAll('*')].map(el => {
          const r = el.getBoundingClientRect(), cs = getComputedStyle(el)
          if (r.width <= 1 || r.height <= 1 || cs.visibility === 'hidden' || cs.display === 'none') return null
          return [el.tagName, r.width, r.height, r.x - box.x, r.y - box.y, ...['display', 'gridTemplateColumns', 'gap', 'padding', 'color', 'backgroundColor', 'borderRadius', 'fontFamily', 'fontSize', 'lineHeight', 'objectFit'].map(k => cs[k])]
        }).filter(Boolean) }]
      })), protectedTrees))
      await page.close()
    }
    assert.deepEqual(pair[0], pair[1], `protected trees differ: ${locale}/${width}`)
    log.protectedGeometry.push({ locale, width, trees: protectedTrees, identical: true, nodes: Object.fromEntries(Object.entries(pair[1]).map(([k, v]) => [k, v.nodes.length])) })
  }
  // 2. The Pawly case page (Stage 3 scope) is untouched: full-page pixels BEFORE = AFTER. The one <video controls
  //    preload="none"> is masked: its native control bar differs even BEFORE vs BEFORE (logs/qa.txt).
  for (const locale of ['en', 'ru']) for (const width of [1440, 390]) {
    const bufs = []
    for (const [phase, port] of [['before', 4433], ['after', 4434]]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' })
      await page.goto(`http://127.0.0.1:${port}/${locale === 'ru' ? 'ru/' : ''}work/pawly/`, { waitUntil: 'networkidle' })
      await settle(page)
      const path = `${root}/logs/case-page-${phase}-${locale}-${width}.png`
      await page.locator('main').screenshot({ path, mask: [page.locator('main video')] })
      bufs.push(await sharp(path).raw().toBuffer({ resolveWithObject: true }))
      await page.close()
    }
    assert.deepEqual(bufs[0].info, bufs[1].info); assert.ok(bufs[0].data.equals(bufs[1].data), `Pawly case page changed ${locale}/${width}`)
    log.casePage.push({ locale, width, mainPixelIdentical: true, masked: 'main video (native controls nondeterministic)', htmlDiff: 'shared CSS bundle only', size: [bufs[0].info.width, bufs[0].info.height] })
  }
  // 3. Keyboard: Tab reaches title → record → CTA with a visible ring; Enter on the record opens the case. no-JS / reduce / normal.
  for (const locale of ['en', 'ru']) for (const mode of ['no-js', 'reduce', 'normal']) for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, javaScriptEnabled: mode !== 'no-js', reducedMotion: mode === 'reduce' ? 'reduce' : 'no-preference' })
    const page = await context.newPage()
    const errors = []; page.on('pageerror', e => errors.push(e.message))
    await page.goto(`http://127.0.0.1:4434/${locale === 'ru' ? 'ru/' : ''}`, { waitUntil: 'networkidle' })
    const card = page.locator('#work-pawly')
    await page.locator('#work-vet-clinic .featured-case__cta').focus()
    const stops = []
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('Tab')
      stops.push(await page.evaluate(() => { const a = document.activeElement, cs = getComputedStyle(a), card = a.closest('#work-pawly'); const ring = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0; return { inCard: !!card, cls: a.className, href: a.getAttribute('href'), label: a.getAttribute('aria-label') || a.textContent.trim(), ring, cardRing: card ? getComputedStyle(card).outlineStyle : null } }))
    }
    assert.ok(stops.every(s => s.inCard && s.href?.endsWith('/work/pawly')), `tab order ${locale}/${mode}/${width}: ${JSON.stringify(stops)}`)
    assert.ok(stops[0].ring && stops[1].ring, 'focus ring on title and record')
    assert.ok(stops[2].cardRing !== 'none', 'CTA focus rings the whole card')
    const record = card.locator('.case-screen__open')
    await record.focus()
    await card.screenshot({ path: `${root}/after/states/${locale}-${width}-${mode}-focus-record.png` })
    const img = await card.locator('img').evaluateAll(list => list.map(i => ({ src: i.currentSrc.replace(location.origin, ''), loaded: i.complete && i.naturalWidth > 0, alt: i.alt })))
    assert.ok(img.length === 2 && img.every(i => i.loaded && i.alt), `images ${JSON.stringify(img)}`)
    assert.ok(img[1].src.endsWith(`report-${locale}.webp`), 'locale-matched record')
    const motion = await card.locator('.featured-case__stage').evaluate(el => getComputedStyle(el).transitionDuration)
    await page.keyboard.press('Enter'); await page.waitForURL(/\/work\/pawly\/?$/)
    assert.equal(await page.locator('h1').count(), 1)
    log.interaction.push({ locale, mode, width, tabStops: stops.map(s => s.cls), images: img, stageTransition: motion, enterOpensCase: page.url(), errors })
    await context.close()
  }
  // 4. Real lazy loading: images are not fetched before the card nears the viewport, and load after scrolling to it.
  for (const locale of ['en', 'ru']) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
    const fetched = []; page.on('request', r => { if (r.url().includes('pawly-home-cover-v1')) fetched.push(r.url().split('/').pop()) })
    await page.goto(`http://127.0.0.1:4434/${locale === 'ru' ? 'ru/' : ''}`, { waitUntil: 'networkidle' })
    const atTop = [...fetched]
    await page.locator('#work-pawly').scrollIntoViewIfNeeded(); await page.waitForLoadState('networkidle')
    await page.locator('#work-pawly img').last().evaluate(i => i.decode())
    log.lazy.push({ locale, fetchedAtTop: atTop, fetchedAfterScroll: [...fetched] })
    assert.equal(atTop.length, 0, 'no cover media before scroll'); assert.equal(fetched.length, 2)
    await page.close()
  }
  // 5. Pressed CTA colour (pointer down) and hover lift, captured.
  for (const locale of ['en', 'ru']) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    await page.goto(`http://127.0.0.1:4434/${locale === 'ru' ? 'ru/' : ''}`, { waitUntil: 'networkidle' }); await settle(page)
    const cta = page.locator('#work-pawly .featured-case__cta'); await cta.scrollIntoViewIfNeeded()
    const rest = await cta.evaluate(a => getComputedStyle(a).color)
    await cta.hover(); await page.waitForTimeout(300)
    const lift = await page.locator('#work-pawly .featured-case__stage').evaluate(el => getComputedStyle(el).transform)
    await page.mouse.down(); await page.waitForTimeout(200)
    const pressed = await cta.evaluate(a => getComputedStyle(a).color)
    await page.locator('#work-pawly').screenshot({ path: `${root}/after/states/${locale}-1440-pressed.png` })
    await page.mouse.up()
    log.pressed.push({ locale, rest, pressed, hoverStageTransform: lift })
    assert.notEqual(rest, pressed)
    await page.close()
  }
} finally {
  await browser.close()
  await writeFile(`${root}/logs/qa.json`, JSON.stringify(log, null, 1) + '\n')
}
console.log(`PASS protected geometry ${log.protectedGeometry.length}/10 · case page pixels ${log.casePage.length}/4 · keyboard/no-JS/motion ${log.interaction.length}/12 · lazy ${log.lazy.length}/2 · pressed ${log.pressed.length}/2`)
