import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const out = 'outputs/typography-robert';
const dist = `${out}/dist`;
const css = fs.readFileSync('ds/tokens.css', 'utf8');
const color = (name) => {
  const value = css.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1].trim();
  if (!value) throw new Error(`Missing token ${name}`);
  const ref = value.match(/^var\(--([\w-]+)\)$/);
  return ref ? color(ref[1]) : value;
};
const luminance = (hex) => hex.slice(1).match(/../g).map(v => parseInt(v, 16) / 255)
  .map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4)
  .reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
const pairs = [
  ...['text-link', 'text-link-hover', 'text-link-pressed', 'focus-ring-color', 'text-meta'].flatMap(fg =>
    ['surface-default', 'surface-subtle'].map(bg => [fg, bg, fg === 'focus-ring-color' ? 3 : 4.5])),
  ...['surface-inverse', 'surface-cover-agent', 'surface-cover-learn'].flatMap(bg =>
    ['text-link-on-inverse', 'text-link-pressed-on-inverse', 'focus-ring-color-on-inverse'].map(fg => [fg, bg, fg.startsWith('focus') ? 3 : 4.5])),
  ['text-default', 'surface-cover-portal', 4.5],
];
const contrasts = pairs.map(([fg, bg, min]) => {
  const a = luminance(color(fg)), b = luminance(color(bg));
  const ratio = (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
  return {fg, bg, foreground: color(fg), background: color(bg), ratio: +ratio.toFixed(2), min, pass: ratio >= min};
});
fs.writeFileSync(`${out}/contrast.json`, JSON.stringify(contrasts, null, 2));

const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const images = [];
for (const name of fs.readdirSync(`${dist}/og`).filter(n => n.endsWith('-onest.png'))) {
  const file = `${dist}/og/${name}`;
  const meta = await sharp(file).metadata();
  images.push({name, width: meta.width, height: meta.height, pass: meta.width === 1200 && meta.height === 630});
}
const preserved = [];
for (const id of ['work-agent-ops-console', 'work-partner-portal', 'work-vet-clinic']) {
  const region = {left: 600, top: 0, width: 600, height: 630};
  const old = await sharp(`public/media/linkedin/og/${id}.png`).extract(region).ensureAlpha().raw().toBuffer();
  const current = await sharp(`${dist}/og/${id}-onest.png`).extract(region).ensureAlpha().raw().toBuffer();
  preserved.push({id, sourceHash: hash(old), generatedHash: hash(current), identicalNativePixels: old.equals(current)});
}
const pages = [];
const walk = dir => {
  for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
    const file = path.join(dir, e.name);
    if (e.isDirectory()) walk(file);
    else if (e.name.endsWith('.html')) {
      const html = fs.readFileSync(file, 'utf8');
      const image = html.match(/property="og:image" content="([^"]+)"/)?.[1];
      if (!image) continue;
      const url = new URL(image, 'https://local.invalid');
      pages.push({page: path.relative(dist, file), image: url.pathname, exists: fs.existsSync(path.join(dist, url.pathname)), onest: url.pathname.endsWith('-onest.png')});
    }
  }
};
walk(dist);
fs.writeFileSync(`${out}/og-audit.json`, JSON.stringify({images, preserved, pages}, null, 2));
fs.writeFileSync(`${out}/check-scoped-css.cjs`, fs.readFileSync('scripts/check-scoped-css.cjs', 'utf8').replace(/\bdist\b/g, dist));
const pass = contrasts.every(r => r.pass) && images.every(r => r.pass) && preserved.every(r => r.identicalNativePixels) && pages.every(r => r.exists && r.onest);
console.log(JSON.stringify({pass, contrastPairs: contrasts.length, generatedOG: images.length, preservedNativeHalves: preserved.length, pageOG: pages.length}));
if (!pass) process.exitCode = 1;
