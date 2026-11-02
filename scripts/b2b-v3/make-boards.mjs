/**
 * Partner Portal V3 — comparison boards from saved captures only.
 *   node scripts/b2b-v3/make-boards.mjs
 *
 * Each panel is an existing PNG/JPG (repository reference frame, BEFORE or AFTER
 * Chromium capture), proportionally resized to a common height and labelled in
 * a header strip. No pixels inside a panel are edited. JPEG output.
 */
import sharp from 'sharp';
import { existsSync, mkdirSync } from 'node:fs';

const ROOT = 'audit/b2b-portfolio-case-premium-v3';
const REF = {
  head: 'research/portfolio-benchmark/case-blueprint/img/dn-head.jpg',
  diag: 'research/portfolio-benchmark/case-blueprint/img/dn-diag.jpg',
  map: 'research/portfolio-rebuild-2026-10-03/references/ha-screen-map.png',
  flow: 'research/portfolio-rebuild-2026-10-03/references/ha-user-flow.png',
  lib: 'research/portfolio-rebuild-2026-10-03/references/ha-component-library.png',
  comp: 'research/portfolio-benchmark/case-blueprint/img/ha-components.jpg',
  thesis: 'research/portfolio-benchmark/case-blueprint/img/gr-thesis.jpg',
};
const B = name => `${ROOT}/before/${name}`;
const A = name => `${ROOT}/after/${name}`;

const BOARDS = [
  ['01-hero-en-1440', 900, [['R4 · Dounar project head', REF.head], ['BEFORE · settled first view', B('en-1440-first-view.png')], ['AFTER · settled first view', A('en-1440-first-view.png')]]],
  ['02-diagnosis-en-1440', 1100, [['R1 · Dounar UX diagnosis', REF.diag], ['BEFORE · 01 Problem', B('en-1440-section-problem.png')], ['AFTER · 01 Diagnosis', A('en-1440-section-diagnosis.png')]]],
  ['03-architecture-en-1440', 900, [['R2 · HA user flow', REF.flow], ['R2 · HA screen map', REF.map], ['BEFORE · 02 System', B('en-1440-section-system.png')], ['AFTER · 02 Architecture', A('en-1440-section-architecture.png')]]],
  ['04-source-line-en-1440', 1100, [['R6 · Garri thesis hierarchy', REF.thesis], ['BEFORE · 03 Human decision', B('en-1440-section-decision.png')], ['AFTER · 03 Source line', A('en-1440-section-decision.png')]]],
  ['05-verification-en-1440', 900, [['BEFORE · 04 Verification', B('en-1440-section-verification.png')], ['AFTER · 04 Product and price', A('en-1440-section-verification.png')]]],
  ['06-commerce-en-1440', 900, [['BEFORE · 05 Commercial review', B('en-1440-section-commercial-review.png')], ['AFTER · 05 Commercial review', A('en-1440-section-commercial-review.png')]]],
  ['07-fulfillment-en-1440', 900, [['BEFORE · 06 Fulfillment', B('en-1440-section-fulfillment.png')], ['AFTER · 06 Fulfillment', A('en-1440-section-fulfillment.png')]]],
  ['08-design-system-en-1440', 1300, [['R3 · HA component library', REF.lib], ['R3 · HA components', REF.comp], ['AFTER · 07 Design system (new)', A('en-1440-section-design-system.png')]]],
  ['09-process-outcome-en-1440', 900, [['BEFORE · Outcome', B('en-1440-section-outcome.png')], ['AFTER · 08 Process (new)', A('en-1440-section-process.png')], ['AFTER · Outcome', A('en-1440-section-outcome.png')]]],
  ['10-full-en-1440', 2400, [['BEFORE · EN 1440 full', B('en-1440-full.png')], ['AFTER · EN 1440 full', A('en-1440-full.png')]]],
  ['11-full-ru-1440', 2400, [['BEFORE · RU 1440 full', B('ru-1440-full.png')], ['AFTER · RU 1440 full', A('ru-1440-full.png')]]],
  ['12-full-en-390', 2400, [['BEFORE · EN 390 full', B('en-390-full.png')], ['AFTER · EN 390 full', A('en-390-full.png')]]],
  ['13-full-ru-390', 2400, [['BEFORE · RU 390 full', B('ru-390-full.png')], ['AFTER · RU 390 full', A('ru-390-full.png')]]],
  ['14-first-view-390', 900, [['BEFORE · EN 390', B('en-390-first-view.png')], ['AFTER · EN 390', A('en-390-first-view.png')], ['BEFORE · RU 360', B('ru-360-first-view.png')], ['AFTER · RU 360', A('ru-360-first-view.png')]]],
  ['15-mobile-sections-en-390', 1800, [['AFTER · 390 architecture', A('en-390-section-architecture.png')], ['AFTER · 390 source line', A('en-390-section-decision.png')], ['AFTER · 390 design system', A('en-390-section-design-system.png')]]],
  ['16-motion-1440', 700, [['Architecture · 180 ms', A('motion/architecture-intermediate.png')], ['Architecture · final', A('motion/architecture-final.png')], ['Source line · 180 ms', A('motion/decision-intermediate.png')], ['Source line · final', A('motion/decision-final.png')]]],
];

const escape = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
mkdirSync(`${ROOT}/comparisons`, { recursive: true });
for (const [name, height, panels] of BOARDS) {
  const GAP = 32; const HEAD = 56;
  const rendered = [];
  for (const [label, file] of panels) {
    if (!existsSync(file)) throw new Error(`missing ${file}`);
    const buffer = await sharp(file).resize({ height, withoutEnlargement: false }).png().toBuffer();
    const { width } = await sharp(buffer).metadata();
    rendered.push({ label, buffer, width });
  }
  const total = rendered.reduce((sum, p) => sum + p.width, 0) + GAP * (rendered.length + 1);
  const composites = [];
  let x = GAP;
  for (const panel of rendered) {
    const svg = `<svg width="${panel.width}" height="${HEAD}" xmlns="http://www.w3.org/2000/svg"><text x="0" y="36" font-family="Arial, sans-serif" font-size="26" fill="#1b1b1b">${escape(panel.label)}</text></svg>`;
    composites.push({ input: Buffer.from(svg), left: x, top: 8 });
    composites.push({ input: panel.buffer, left: x, top: HEAD + 8 });
    x += panel.width + GAP;
  }
  await sharp({ create: { width: total, height: height + HEAD + GAP, channels: 3, background: '#e9e9e6' } })
    .composite(composites).jpeg({ quality: 82 }).toFile(`${ROOT}/comparisons/${name}.jpg`);
  console.log(name, total, 'x', height + HEAD + GAP);
}
