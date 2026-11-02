// Pawly Case V2 functional + accessibility checks on the built site. Usage: node functional.mjs <dist> <out-dir>
// Chromium. Writes <out>/functional.json and no-JS / motion-on captures. Every check records pass/fail with evidence.
import { createRequire } from 'node:module'
import { spawn } from 'node:child_process'
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const { chromium } = createRequire('D:/Claude-projects/PETS-walking/package.json')('playwright')
const [dist, out] = process.argv.slice(2)
await mkdir(out, { recursive: true })
const here = path.dirname(fileURLToPath(import.meta.url))
const srv = spawn(process.execPath, [path.join(here, 'serve.mjs'), dist, '4393'], { stdio: 'ignore' })
await new Promise(r => setTimeout(r, 800))
const base = 'http://127.0.0.1:4393'
const results = []
const check = (name, pass, evidence) => { results.push({ name, pass: !!pass, evidence }); console.log(pass ? 'PASS' : 'FAIL', name, typeof evidence === 'string' ? evidence : JSON.stringify(evidence).slice(0, 220)) }
const settle = page => page.evaluate(async () => {
  document.querySelectorAll('img').forEach(i => { i.loading = 'eager'; i.decoding = 'sync' })
  for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight / 2) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)) }
  scrollTo(0, 0)
  await Promise.race([Promise.all([...document.images].map(i => i.decode().catch(() => {}))), new Promise(r => setTimeout(r, 8000))])
})
// WCAG relative luminance contrast of an element's text colour against the first opaque ancestor background.
const contrastOf = (page, selector) => page.evaluate(sel => {
  const lum = c => { const [r, g, b] = c.match(/[\d.]+/g).slice(0, 3).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }); return 0.2126 * r + 0.7152 * g + 0.0722 * b }
  return [...document.querySelectorAll(sel)].slice(0, 6).map(el => {
    let bg = el, c
    while (bg && ((c = getComputedStyle(bg).backgroundColor) === 'rgba(0, 0, 0, 0)' || c === 'transparent')) bg = bg.parentElement
    const [a, b] = [lum(getComputedStyle(el).color), lum(c ?? 'rgb(255,255,255)')].sort((x, y) => y - x)
    return { text: el.textContent.trim().slice(0, 30), ratio: +((a + 0.05) / (b + 0.05)).toFixed(2), size: getComputedStyle(el).fontSize }
  })
}, selector)

const browser = await chromium.launch()
try {
  for (const locale of ['en', 'ru']) {
    const url = `${base}${locale === 'ru' ? '/ru' : ''}/work/pawly/`
    const L = s => `${locale}: ${s}`
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
    const page = await ctx.newPage()
    const errors = []; page.on('pageerror', e => errors.push(String(e)))
    await page.goto(url); await settle(page); await page.waitForTimeout(800)

    // Structure
    const outline = await page.evaluate(() => [...document.querySelectorAll('main h1, main h2, main h3')].map(h => `${h.tagName}:${h.textContent.trim().slice(0, 40)}`))
    check(L('one h1, chapters as h2'), outline.filter(h => h.startsWith('H1')).length === 1 && outline.filter(h => h.startsWith('H2')).length >= 6, outline)
    const lang = await page.evaluate(() => document.documentElement.lang)
    check(L('document language'), lang === locale, lang)
    const anchors = await page.evaluate(() => [...document.querySelectorAll('.pawly-clock a')].map(a => [a.getAttribute('href'), !!document.querySelector(a.getAttribute('href'))]))
    check(L('chapter index links resolve to sections'), anchors.length === 5 && anchors.every(([, ok]) => ok), anchors)
    const alts = await page.evaluate(() => [...document.querySelectorAll('main img')].map(i => i.alt.length))
    check(L('every case image has alt text'), alts.every(n => n > 20), alts)
    const media = await page.evaluate(() => [...document.querySelectorAll('.pawly-case img')].map(i => ({ src: i.currentSrc.split('/').pop(), ok: i.naturalWidth > 0 })))
    check(L('all case media load'), media.every(m => m.ok), media.filter(m => !m.ok))
    check(L('no page errors'), errors.length === 0, errors)

    // Keyboard: Tab order reaches index, screens and CTA, each with a visible focus ring.
    await page.evaluate(() => scrollTo(0, 0)); await page.mouse.click(5, 5)
    const stops = []
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press('Tab')
      stops.push(await page.evaluate(() => { const el = document.activeElement; const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); return { cls: String(el.className).slice(0, 34), text: (el.getAttribute('aria-label') || el.textContent).trim().slice(0, 32), outline: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0, h: Math.round(r.height), inView: r.top >= 0 && r.top < innerHeight } }))
    }
    const caseStops = stops.filter(s => /pawly|ds-pressable/.test(s.cls))
    check(L('keyboard reaches index links and screen links'), caseStops.some(s => s.cls.includes('pawly-clock__link')) && caseStops.some(s => s.cls.includes('pawly-shot__frame')), caseStops.map(s => s.cls.split(' ')[0]))
    check(L('focus ring visible on every case stop'), caseStops.every(s => s.outline), caseStops.filter(s => !s.outline))
    check(L('focused element scrolled into view (its top edge visible)'), caseStops.every(s => s.inView), caseStops.filter(s => !s.inView))
    const targets = await page.evaluate(() => [...document.querySelectorAll('.pawly-clock__link, .pawly-cta')].map(a => Math.round(a.getBoundingClientRect().height)))
    check(L('touch targets >= 44 px (index, CTA)'), targets.every(h => h >= 44), targets)

    // Index link moves focus target into view.
    await page.locator('.pawly-clock a[href="#return"]').click()
    await page.waitForTimeout(600)
    const ret = await page.evaluate(() => Math.round(document.querySelector('#return').getBoundingClientRect().top))
    check(L('index link scrolls to its chapter'), ret >= -2 && ret < 200, `#return top ${ret}px`)

    // MediaZoom: open from keyboard, Escape closes, focus returns to the trigger.
    const trigger = page.locator('#return .pawly-shot__frame').first()
    await trigger.focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(700)
    const open = await page.evaluate(() => { const d = document.querySelector('dialog[open], [data-media-zoom][open], .media-zoom[open]'); const img = document.querySelector('[data-media-zoom-image]'); return { open: !!d, src: img?.getAttribute('src')?.split('/').pop(), natural: img?.naturalWidth } })
    check(L('screen opens in MediaZoom'), open.open && /proof-selected/.test(open.src ?? ''), open)
    await page.keyboard.press('Escape'); await page.waitForTimeout(600)
    const after = await page.evaluate(() => ({ open: !!document.querySelector('dialog[open], .media-zoom[open]'), focus: String(document.activeElement.className) }))
    check(L('Escape closes and focus returns to the screen link'), !after.open && after.focus.includes('pawly-shot__frame'), after)

    // Contrast on the sand surfaces and captions.
    for (const [sel, min] of [['.pawly-stage__caption', 4.5], ['.pawly-band .pawly-body', 4.5], ['.pawly-band .pawly-shot__caption', 4.5], ['.pawly-shot__caption', 4.5], ['.pawly-label', 4.5], ['.pawly-clock__index', 4.5], ['.pawly-vocab__text', 4.5]]) {
      const c = await contrastOf(page, sel)
      check(L(`contrast ${sel} >= ${min}`), c.length && c.every(x => x.ratio >= min), c)
    }
    // External CTA opens a new tab safely and points at the locale's prototype.
    const cta = await page.evaluate(() => { const a = document.querySelector('.pawly-cta'); return { href: a.href, target: a.target, rel: a.rel } })
    check(L('prototype CTA'), cta.href.endsWith(locale === 'ru' ? '/ru/app' : '/app') && cta.target === '_blank' && cta.rel.includes('noopener'), cta)
    const forbidden = await page.evaluate(() => (document.documentElement.innerText + ' ' + document.title + ' ' + (document.querySelector('meta[name=description]')?.content ?? '')).match(/\bconcept(ual)?\b|концепт|pet[- ]project|пет-проект/gi))
    check(L('no forbidden status labels in text or meta'), !forbidden, forbidden)
    await ctx.close()

    // Rendered scale of every product screen at each width (1.0 = native 390 px).
    for (const [w, h] of [[1440, 900], [1279, 800], [1100, 800], [1024, 768], [900, 1000], [800, 1000], [768, 1024], [390, 844], [360, 800], [320, 640]]) {
      const c = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' }); const p = await c.newPage()
      await p.goto(url); await settle(p)
      const { scales, column } = await p.evaluate(() => {
        const c = document.querySelector('.pawly-sheet > .ds-container'); const cs = getComputedStyle(c)
        return { column: c.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), scales: [...document.querySelectorAll('.pawly-shot img')].map(i => +(i.getBoundingClientRect().width / (i.naturalWidth / 2)).toFixed(2)) }
      })
      // Floor: 0.8 of native, or the whole text column when the column itself is narrower than 0.8 × 390.
      const floor = Math.min(0.8, column / 390) - 0.01
      check(L(`${w}: screens at >= ${floor.toFixed(2)} of native (column ${column}px), never enlarged`), Math.min(...scales) >= floor && Math.max(...scales) <= 1.0, { min: Math.min(...scales), max: Math.max(...scales), column })
      // V2.1.2 rows (Choosing, Return): every caption is either beside its own screen (overlapping its rows) or under it,
      // at most 100 px below the image's own bottom edge; plates are as tall as their screen (equal field above and below).
      const rows = await p.evaluate(() => [...document.querySelectorAll('.pawly-steps .pawly-shot, .pawly-proof__grid .pawly-shot')].map(f => {
        const r = s => f.querySelector(s).getBoundingClientRect()
        const img = r('img'), cap = r('.pawly-shot__caption'), fr = r('.pawly-shot__frame'), pl = r('.pawly-shot__plate')
        const beside = cap.top < img.bottom && cap.bottom > img.top
        return { src: f.querySelector('img').getAttribute('src').split('/').pop(), beside, gap: beside ? null : Math.round(cap.top - img.bottom), uneven: Math.round((pl.bottom - fr.bottom) - (fr.top - pl.top)) }
      }))
      check(L(`${w}: row captions follow their own screen (beside, or <= 100 px below)`), rows.every(r => r.beside || (r.gap >= 0 && r.gap <= 100)), rows.map(r => `${r.src}:${r.beside ? 'beside' : r.gap}`))
      check(L(`${w}: row plates are content height (field below - above <= 2 px)`), rows.every(r => Math.abs(r.uneven) <= 2), rows.map(r => r.uneven))
      if (w >= 768) {
        // Handoff: the walker's role name sits on one line across the three questions wherever they share a row.
        const who = await p.evaluate(() => [...document.querySelectorAll('.pawly-compare__pair')].map(d => { const r = d.querySelectorAll('.pawly-compare__who')[1].getBoundingClientRect(); return { top: Math.round(r.top), left: Math.round(r.left) } }))
        // Only when the three questions stand side by side (three distinct columns); a single column has nothing to align.
        const sideBySide = new Set(who.map(x => x.left)).size > 1
        check(L(`${w}: handoff WALKER labels aligned across columns${sideBySide ? '' : ' (one column: n/a)'}`), !sideBySide || Math.max(...who.map(x => x.top)) - Math.min(...who.map(x => x.top)) <= 1, who)
      }
      if (w <= 390) {
        const fold = await p.evaluate(() => { const img = document.querySelector('.pawly-stage .pawly-shot img'); const r = img.getBoundingClientRect(); return { top: Math.round(r.top), visible: Math.round(Math.min(r.bottom, innerHeight) - r.top) } })
        check(L(`${w}: product screen inside the first viewport`), fold.top < h * 0.45 && fold.visible > h * 0.4, fold)
      }
      await c.close()
    }

    // No-JS: everything is present without the motion runtime.
    const nj = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false }); const np = await nj.newPage()
    await np.goto(url); await settle(np).catch(() => {})
    const hidden = await np.evaluate(() => [...document.querySelectorAll('.pawly-case [data-motion]')].filter(el => +getComputedStyle(el).opacity < 0.99).length)
    check(L('no-JS: no motion element left hidden'), hidden === 0, `${hidden} hidden`)
    await np.screenshot({ path: `${out}/${locale}-1440-nojs-full.png`, fullPage: true })
    const nj390 = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false }); const np2 = await nj390.newPage()
    await np2.goto(url); await np2.screenshot({ path: `${out}/${locale}-390-nojs-viewport.png` })
    await nj.close(); await nj390.close()

    // Motion on: after scrolling through and settling, nothing is left mid-animation or invisible.
    const mo = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const mp = await mo.newPage()
    await mp.goto(url)
    await mp.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 300) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)) } })
    await mp.waitForTimeout(2500)
    const stuck = await mp.evaluate(() => [...document.querySelectorAll('.pawly-case [data-motion]')].filter(el => +getComputedStyle(el).opacity < 0.99).map(el => String(el.className).slice(0, 30)))
    check(L('motion on: every animated element settles visible'), stuck.length === 0, stuck)
    await mp.evaluate(() => scrollTo(0, 0)); await mp.waitForTimeout(1500)
    await mp.screenshot({ path: `${out}/${locale}-1440-motion-viewport.png` })
    await mo.close()
  }
} finally {
  await browser.close(); srv.kill()
  await writeFile(`${out}/functional.json`, JSON.stringify(results, null, 1) + '\n')
  console.log(`${results.filter(r => r.pass).length}/${results.length} pass`)
}
