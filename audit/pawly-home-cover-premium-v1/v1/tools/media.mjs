// Derived Home-cover media from untouched sources. Crops are whole rectangles of the product's own regions
// (measured in assets/source/capture.json, CSS px × 2); no pixel is redrawn. Writes logs/provenance.json.
// Usage: node audit/pawly-home-cover-premium-v1/v1/tools/media.mjs
import sharp from 'sharp'
import { createHash } from 'node:crypto'
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
const root = 'audit/pawly-home-cover-premium-v1/v1'
const src = `${root}/assets/source`
const out = 'public/media/pawly-home-cover-v1'
await mkdir(out, { recursive: true })
const sha = async f => createHash('sha256').update(await readFile(f)).digest('hex')

// Product photographs, byte-for-byte from Pawly main a327d73 public/assets/proof/ (served by pawly-fawn.vercel.app).
// Shipped media goes to public/; media used only by the rejected candidates stays in the audit.
const cand = `${root}/assets/candidates`
await mkdir(cand, { recursive: true })
const photos = [
  { from: `${src}/proof-handover-dropoff.webp`, to: `${out}/return-photo.webp`, origin: 'pawly@a327d73 public/assets/proof/handover-dropoff.webp' },
  { from: `${src}/proof-handover-pickup.webp`, to: `${cand}/pickup-photo.webp`, origin: 'pawly@a327d73 public/assets/proof/handover-pickup.webp' },
]
// [file, source capture, left, top, right, bottom] in device px of the 780 px wide @2x full-document capture.
const crops = [
  // A (shipped): the completed hero card to its own edges (CSS x 16–374, y 124–551; its 16 px corners match --radius-media).
  [`${out}/report`, 'order-details-completed', 32, 248, 748, 1102],
  // A1 candidate: "Walk report" title row (56–116) + the hero card + 12 px of page below it.
  [`${cand}/report-with-title`, 'order-details-completed', 0, 112, 780, 1126],
  // B candidate: "Baikal's walk" title row (56–116) + status card (116–374) + 12 px of page below.
  [`${cand}/walk`, 'active-service-walking', 0, 112, 780, 772],
]
const log = { photos: [], crops: [] }
for (const p of photos) {
  await copyFile(p.from, p.to)
  const m = await sharp(p.to).metadata()
  log.photos.push({ ...p, size: [m.width, m.height], sha256: await sha(p.to), identicalToSource: (await sha(p.from)) === (await sha(p.to)) })
}
for (const [name, capture, left, top, right, bottom] of crops) for (const locale of ['en', 'ru']) {
  const from = `${src}/${capture}-${locale}-390@2x-full.png`
  const to = `${name}-${locale}.webp`
  const region = { left, top, width: right - left, height: bottom - top }
  await sharp(from).extract(region).webp({ quality: 90, effort: 6 }).toFile(to)
  log.crops.push({ name, locale, from, fromSha256: await sha(from), region, cssRegion: { left: left / 2, top: top / 2, right: right / 2, bottom: bottom / 2 }, to, sha256: await sha(to) })
}
await writeFile(`${root}/logs/provenance.json`, JSON.stringify(log, null, 1) + '\n')
console.log(log.photos.map(p => `${p.to} ${p.size} identical=${p.identicalToSource}`).join('\n'))
console.log(log.crops.map(c => `${c.to} ${c.region.width}x${c.region.height} @${c.region.left},${c.region.top}`).join('\n'))
