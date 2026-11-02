// Comparison boards from untouched browser captures (no retouching; only placed side by side with labels).
// Usage: node boards.mjs   (after capture.mjs before/after, cand-A1/B1/A2/B2 and peers.mjs)
import sharp from 'sharp'
import { mkdir, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
const root = 'audit/pawly-home-cover-premium-v1/v1'
const out = `${root}/comparisons`
await mkdir(out, { recursive: true })
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
const label = (text, width) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="44"><rect width="100%" height="100%" fill="#ffffff"/><text x="0" y="28" font-family="Segoe UI, Arial, sans-serif" font-size="20" font-weight="600" fill="#1d1d1b">${esc(text)}</text></svg>`)

/** Columns of [title, file]; each image keeps its own pixels, scaled only when maxHeight forces it. */
async function board(name, columns, { gap = 32, pad = 32, maxWidth } = {}) {
  const cells = []
  for (const [title, file] of columns) {
    if (!existsSync(file)) { console.log('skip missing', file); continue }
    let img = sharp(file); const m = await img.metadata()
    const w = maxWidth && m.width > maxWidth ? maxWidth : m.width
    const buf = await img.resize({ width: w }).png().toBuffer(); const mm = await sharp(buf).metadata()
    cells.push({ title, buf, w: mm.width, h: mm.height })
  }
  const width = pad * 2 + cells.reduce((s, c) => s + c.w, 0) + gap * (cells.length - 1)
  const height = pad * 2 + 44 + Math.max(...cells.map(c => c.h))
  let x = pad; const layers = []
  for (const c of cells) { layers.push({ input: label(c.title, c.w), left: x, top: pad }, { input: c.buf, left: x, top: pad + 44 }); x += c.w + gap }
  await sharp({ create: { width, height, channels: 3, background: '#ffffff' } }).composite(layers).jpeg({ quality: 88, mozjpeg: true }).toFile(`${out}/${name}.jpg`)
  console.log(name, width, height)
}

for (const locale of ['en', 'ru']) for (const width of [1440, 1024, 768, 390, 360]) {
  await board(`before-after-${locale}-${width}`, [[`BEFORE · ${locale.toUpperCase()} ${width}`, `${root}/before/${locale}-${width}-pawly.png`], [`AFTER · ${locale.toUpperCase()} ${width}`, `${root}/after/${locale}-${width}-pawly.png`]])
}
for (const locale of ['en', 'ru']) for (const width of [390, 360]) {
  await board(`viewport-${locale}-${width}`, [[`BEFORE · landing on the card`, `${root}/before/${locale}-${width}-pawly-viewport.png`], [`AFTER · landing on the card`, `${root}/after/${locale}-${width}-pawly-viewport.png`]])
}
for (const locale of ['en', 'ru']) {
  await board(`context-${locale}-1440`, [[`BEFORE · after Vet`, `${root}/before/${locale}-1440-context.jpg`], [`AFTER · after Vet`, `${root}/after/${locale}-1440-context.jpg`]], { maxWidth: 1000 })
  await board(`context-${locale}-390`, [[`BEFORE · after Vet`, `${root}/before/${locale}-390-context.jpg`], [`AFTER · after Vet`, `${root}/after/${locale}-390-context.jpg`]])
}
// A/B: round 1 (A1 header crop / B1 stretched photo) and round 2 (A2 / B2 fixed 4:3), plus the shipped A.
for (const locale of ['en', 'ru']) for (const width of [1440, 1024, 390, 360]) {
  await board(`ab-${locale}-${width}`, [
    [`A1 · report with title row`, `${out}/candidates/A1/${locale}-${width}-pawly.png`],
    [`B1 · active walk`, `${out}/candidates/B1/${locale}-${width}-pawly.png`],
    [`B2 · active walk, 4:3 photo`, `${out}/candidates/B2/${locale}-${width}-pawly.png`],
    [`A · shipped (card crop)`, `${root}/after/${locale}-${width}-pawly.png`],
  ], { maxWidth: width >= 1024 ? 900 : undefined })
}
// Peers: the five Home covers after the change (Pawly must read as the consumer one).
for (const width of [1440, 390]) for (const locale of ['en', 'ru']) {
  await board(`peers-${locale}-${width}`, ['agent', 'portal', 'learn', 'vet', 'pawly'].map(k => [k, `${root}/after/peers/${locale}-${width}-${k}.png`]), { maxWidth: width === 1440 ? 640 : undefined })
}
// Benchmark: genuine product sources (supplied S1–S4, fresh main captures), the shipped crops, public external refs.
// Third-party originals (R2 Rover, R3 Wag, fetched from the public URLs in RESEARCH.md) stay local in .tmp/; only boards are committed.
const refs = '.tmp/benchmark-refs', src = `${root}/assets/source`, ref = 'audit/pawly-home-cover-premium-v1/references/product'
await board('benchmark-sources', [
  ['S1 supplied · OD EN', `${ref}/order-details-completed-en-390.png`],
  ['S2 supplied · OD RU (stale label)', `${ref}/order-details-completed-ru-390.png`],
  ['main a327d73 · OD RU', `${src}/order-details-completed-ru-390@2x.png`],
  ['S3 supplied · walk 16:35', `${ref}/active-service-walking-en-390.png`],
  ['main a327d73 · walk 14:05', `${src}/active-service-walking-en-390@2x.png`],
  ['S4 supplied · profile', `${ref}/walker-profile-en-390.png`],
], { maxWidth: 390 })
await board('benchmark-external', [
  ['R2 Rover · walk map + timing', `${refs}/R2-rover-map.jpg`],
  ['R3 Wag · report card', `${refs}/R3-wag-report-card.jpg`],
  ['Pawly shipped · EN 1440', `${root}/after/en-1440-pawly.png`],
], { maxWidth: 760 })
await board('benchmark-mobile', [
  ['R2 Rover · walk map + timing', `${refs}/R2-rover-map.jpg`],
  ['R3 Wag · report card', `${refs}/R3-wag-report-card.jpg`],
  ['Pawly shipped · EN 390', `${root}/after/en-390-pawly.png`],
  ['Pawly shipped · RU 360', `${root}/after/ru-360-pawly.png`],
], { maxWidth: 420 })
