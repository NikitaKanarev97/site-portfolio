// Группировка sweep.json по компоненту-источнику → logs/analysis.txt
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const L = join(dirname(fileURLToPath(import.meta.url)), '..', 'logs');
const R = JSON.parse(readFileSync(join(L, 'sweep.json'), 'utf8'));
const out = [];
const P = s => out.push(s);
const route = k => k.replace(/-(en|ru)-(1440|360)$/, '');
const cn = c => (c || '?').split(':')[0];
function group(cls, pick, filter = () => true, label = x => x.text) {
  const g = new Map();
  for (const r of R) for (const x of (pick(r) || [])) {
    if (!filter(x, r)) continue;
    const k = cn(x.comp);
    if (!g.has(k)) g.set(k, { routes: new Set(), n: 0, ex: new Set() });
    const e = g.get(k); e.routes.add(route(r.key) + '/' + r.key.split('-').slice(-2).join('-')); e.n++; if (e.ex.size < 8) e.ex.add(label(x, r));
  }
  P(`\n## ${cls}`);
  for (const [k, e] of [...g].sort((a, b) => b[1].n - a[1].n)) {
    const rs = [...new Set([...e.routes].map(x => x.split('/')[0]))].join(',');
    P(`- ${k} ×${e.n} [${rs}] :: ${[...e.ex].join(' | ')}`);
  }
}
const en1440 = r => r.key.endsWith('en-1440');
// inventory
P('## INVENTORY (en-1440)');
const comps = new Set(); R.filter(en1440).forEach(r => Object.keys(r.inventory).forEach(c => comps.add(c)));
const rs = R.filter(en1440);
P('comp | ' + rs.map(r => route(r.key)).join(' | '));
for (const c of [...comps].sort()) P(c + ' | ' + rs.map(r => r.inventory[c] || '').join(' | '));

group('T1 mono', r => r.T1, x => x.why.includes('mono'), x => `${x.text} (${x.fs}px ${x.ff})`);
group('T1 caps-tracked', r => r.T1, (x, r) => x.why.includes('caps-tracked') && r.key.endsWith('1440'), x => `${x.text} (${x.fs}px)`);
group('T1 num', r => r.T1, (x, r) => x.why.includes('num') && r.key.endsWith('1440'), x => x.text);
group('T1 dot-chain', r => r.T1, (x, r) => x.why.includes('dot-chain') && r.key.endsWith('1440'), x => x.text);
group('T2 busy sections (en-1440)', r => en1440(r) ? r.T2 : [], () => true, x => `n=${x.n} y=${x.y}: ${x.texts.slice(0, 6).join(' / ')}`);
group('T2 dup captions (1440)', r => r.key.endsWith('1440') ? r.T2dup : [], () => true, x => `"${x.cap}" ~ "${x.other}" ${x.sim}`);
group('T3 glyphs (1440)', r => r.key.endsWith('1440') ? r.T3 : [], () => true, x => `${x.k}:${x.text}${x.visible ? '' : '(hidden)'}`);
group('T4 (1440)', r => r.key.endsWith('1440') ? r.T4 : [], () => true, x => x.text);
group('C1', r => r.C1, () => true, x => `${x.src} cont=${JSON.stringify(x.container)}`);
group('C2 (1440)', r => r.key.endsWith('1440') ? r.C2 : [], () => true, x => `${x.src} bg=${x.bg} ${x.w}x${x.h}`);
group('L1 (1440)', r => r.key.endsWith('1440') ? r.L1 : [], () => true, x => `${x.sel} spread=${x.spread} n=${x.n}`);
group('L2 tight (all)', r => r.L2, x => x.flag, x => `${x.h} ${x.fs}px "${x.text}" gap=${x.gap} → ${x.next}`);
group('L5 (1440)', r => r.key.endsWith('1440') ? r.L5 : [], () => true, x => `${x.tag} ${x.sides} ${x.sel} w=${x.w} ${x.color}`);
group('X1', r => r.X1, () => true, x => (x.attr ? x.attr + ':' : '') + x.text);
group('X2 status (1440)', r => r.key.endsWith('1440') ? r.X2 : [], () => true, x => `${x.k}[${x.hit}] …${x.ctx}…`);
group('years (en-1440)', r => en1440(r) ? r.years : [], () => true, x => `${x.k}:${x.y} …${x.ctx}…`);
group('R1 small targets (360)', r => r.key.endsWith('360') ? r.R1.small : [], () => true, x => `${x.text} ${x.w}x${x.h}`);
group('R1 over (360)', r => r.key.endsWith('360') ? r.R1.over : [], () => true, x => `${x.sel} right=${x.right}`);
group('R1 clipped', r => r.R1.clipped, () => true, x => x.text);

// L2 heading gaps summary per case: sizes
P('\n## L2 heading→next gaps (en-1440, h1/h2 only)');
for (const r of R.filter(en1440)) P(`${route(r.key)}: ` + r.L2.filter(x => x.h !== 'H3').map(x => `${x.h}${x.fs}/${x.gap}`).join(' '));
// sections
P('\n## Sections (en-1440): comp h pt/pb');
for (const r of R.filter(en1440)) P(`${route(r.key)}: ` + r.sections.map(s => `${cn(s.comp).replace('.astro', '')}:${s.h}(${parseInt(s.pt)}/${parseInt(s.pb)})`).join(' '));
P('\n## Sections (en-360)');
for (const r of R.filter(r => r.key.endsWith('en-360'))) P(`${route(r.key)}: ` + r.sections.map(s => `${cn(s.comp).replace('.astro', '')}:${s.h}(${parseInt(s.pt)}/${parseInt(s.pb)})`).join(' '));
// H
P('\n## Headings (en-1440)');
for (const r of R.filter(en1440)) {
  const g = {}; r.H.forEach(h => { const k = `${h.tag}.${cn(h.comp).replace('.astro', '')}`; (g[k] ||= new Set()).add(`${h.fs}/${h.fw}`); });
  P(`${route(r.key)}: ` + Object.entries(g).map(([k, v]) => `${k}=${[...v].join(',')}`).join('  '));
}
P('\n## Headings (en-360)');
for (const r of R.filter(r => r.key.endsWith('en-360'))) {
  const g = {}; r.H.forEach(h => { const k = `${h.tag}.${cn(h.comp).replace('.astro', '')}`; (g[k] ||= new Set()).add(`${h.fs}`); });
  P(`${route(r.key)}: ` + Object.entries(g).map(([k, v]) => `${k}=${[...v].join(',')}`).join('  '));
}
// K1
P('\n## Links (en-1440): comp | cls | deco | labDeco | svg | inPara  (unique)');
const ks = new Map();
for (const r of R.filter(en1440)) for (const a of r.K1) {
  const k = `${cn(a.comp)} | ${a.cls} | ${a.deco}${a.bb ? '+bb' : ''}${a.bgimg ? '+bgimg' : ''} | ${a.labDeco} | svg=${a.svg} | para=${a.inPara}`;
  if (!ks.has(k)) ks.set(k, { n: 0, r: new Set(), ex: a.text || a.aria }); ks.get(k).n++; ks.get(k).r.add(route(r.key));
}
for (const [k, v] of ks) P(`${k} ×${v.n} [${[...v.r].join(',')}] "${v.ex}"`);
writeFileSync(join(L, 'analysis.txt'), out.join('\n'));
console.log('lines', out.length);
