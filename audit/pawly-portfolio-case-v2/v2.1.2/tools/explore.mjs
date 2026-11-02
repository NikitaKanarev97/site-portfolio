// V2.1.2 layout exploration: real renders of one chapter at one width, as built or with an alternative layout injected.
// Usage: node explore.mjs <dist> <out-dir> <spec.json>
// spec: [{ name, locale, width, section, css? }] — css is appended to the built page (the alternative), never shipped.
// Chromium, DPR 1, reduced motion, images decoded; writes <name>.png per entry plus <out>/explore.json with page heights.
import { createRequire } from 'node:module'
import { spawn } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
const { chromium } = createRequire('D:/Claude-projects/PETS-walking/package.json')('playwright')

const [dist, out, specPath] = process.argv.slice(2)
const spec = JSON.parse(await readFile(specPath, 'utf8'))
const here = path.dirname(fileURLToPath(import.meta.url))
await mkdir(out, { recursive: true })
const port = '4395'
const server = spawn(process.execPath, [path.join(here, 'serve.mjs'), dist, port], { stdio: 'ignore' })
await new Promise(r => setTimeout(r, 800))
const browser = await chromium.launch()
const rows = []
try {
  for (const s of spec) {
    const ctx = await browser.newContext({ viewport: { width: s.width, height: 900 }, reducedMotion: 'reduce', deviceScaleFactor: 1 })
    const page = await ctx.newPage()
    await page.goto(`http://127.0.0.1:${port}${s.locale === 'ru' ? '/ru' : ''}/work/pawly/`, { waitUntil: 'load' })
    if (s.css) await page.addStyleTag({ content: s.css })
    await page.evaluate(async () => {
      document.querySelectorAll('img').forEach(i => { i.loading = 'eager'; i.decoding = 'sync' })
      for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight / 2) { scrollTo(0, y); await new Promise(r => setTimeout(r, 40)) }
      scrollTo(0, 0); await document.fonts.ready
      await Promise.all([...document.images].map(i => i.decode().catch(() => {})))
    })
    await page.waitForTimeout(400)
    await page.locator(`#${s.section}`).screenshot({ path: `${out}/${s.name}.png` })
    const m = await page.evaluate(sel => ({
      doc: document.documentElement.scrollHeight,
      section: Math.round(document.querySelector(sel).getBoundingClientRect().height),
      overflowX: document.documentElement.scrollWidth - innerWidth,
      scales: [...document.querySelectorAll(`${sel} .pawly-shot img`)].map(i => +(i.getBoundingClientRect().width / (i.naturalWidth / 2)).toFixed(2)),
    }), `#${s.section}`)
    rows.push({ name: s.name, ...m }); console.log(s.name, JSON.stringify(m))
    await ctx.close()
  }
} finally {
  await browser.close(); server.kill()
  await writeFile(`${out}/explore.json`, JSON.stringify(rows, null, 1) + '\n')
}
