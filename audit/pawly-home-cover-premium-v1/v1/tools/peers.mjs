// The five Home covers, AFTER build (4434), for the peer-distinctness board. node peers.mjs
import { createRequire } from 'node:module'
import { mkdir } from 'node:fs/promises'
const { chromium } = createRequire('D:/Claude-projects/b2b-dssl/package.json')('playwright')
const dir = 'audit/pawly-home-cover-premium-v1/v1/after/peers'
await mkdir(dir, { recursive: true })
const cards = { agent: '#work-agent-ops-console', portal: '#work-partner-portal', learn: '#work-learn', vet: '#work-vet-clinic', pawly: '#work-pawly' }
const browser = await chromium.launch()
for (const locale of ['en', 'ru']) for (const [width, height] of [[1440, 900], [390, 844]]) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: 'reduce' })
  await page.goto(`http://127.0.0.1:4434/${locale === 'ru' ? 'ru/' : ''}`, { waitUntil: 'networkidle' })
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].filter(i => !i.closest('dialog')).map(async i => { i.loading = 'eager'; await i.decode().catch(() => {}) })) })
  for (const [k, sel] of Object.entries(cards)) await page.locator(sel).screenshot({ path: `${dir}/${locale}-${width}-${k}.png` })
  await page.close()
}
await browser.close()
console.log('peers captured')
