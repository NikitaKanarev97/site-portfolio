import fs from 'node:fs';
const root = 'audit/vet-portfolio-case-v2/v2.1';
const before = JSON.parse(fs.readFileSync(`${root}/before/results.json`));
const after = JSON.parse(fs.readFileSync(`${root}/after/results.json`));
const regressions = JSON.parse(fs.readFileSync(`${root}/regressions/results.json`));
const retest = JSON.parse(fs.readFileSync(`${root}/regressions/retest/results.json`));
const count = after.results.reduce((n, r) => n + r.tests.length, 0);
const pair = (name, suffix) => `[before](before/${name}-${suffix}.png) / [after](after/${name}-${suffix}.png)`;
const lines = [
  '# Vet Clinic OS Portfolio Case V2.1 — Final Visual Refinement',
  '',
  '1 November 2026 · review branch `redesign/vet-portfolio-case-v2` · baseline `51e10a54624bc7796450bcac9f612494a1295cdf`.',
  '',
  '**Delivery status: implemented and verified; independent visual acceptance pending.** This is a targeted correction of the three review findings. The seven-section narrative, clinical decisions, outcome claims and EN/RU content equivalence remain intact. This report is implementation evidence, not self-approval.',
  '',
  '## Changes',
  '',
  '| Before | After | Why |',
  '|---|---|---|',
  '| Outcome inherited `overflow-wrap: anywhere`; the site typesetter binds the final phrase with nonbreaking spaces. At 360/390px, a 32px heading split ordinary words. | Existing `ds-heading-3xl` role: 24px below 768, 32px above; normal word wrapping, `word-break: normal`, no hyphenation, 26ch ceiling. Original 24/48px panel padding and exact heading wording retained. | The full phrase now fits its responsive column without breaking words or hiding overflow. |',
  '| Full desktop Visit Record dominated the cover and continued far below the initial viewport. | One genuine 848×347 CSS-px detail: complete owner-facing Plan and complete clinic-only Private note, including audience labels and exclusions. Both desktop widths render it at native size. Complete original remains independently inspectable. | The first viewport now makes one product decision legible: different audiences within one clinical record. |',
  '| Repeated accent links with persistent underlines competed with the narrative. | VetShot-only `text-subtle` action, plus cue, content-width hit area, 48px minimum target, visible focus ring and underline on hover/focus/press. | Keeps inspection discoverable while returning emphasis to the real UI and narrative. Product CTA and neighbouring links retain their styling. |',
  '',
  'Only desktop hero source/alt/caption changed. Below 1024px, the original mobile image, header, wording and caption remain; the shared secondary inspection styling is applied consistently. Home consumes the same hero data, so VetHome explicitly retains the original full desktop source and alt and suppresses the new case-only caption. The regression evidence verifies that preservation.',
  '',
  '## Matched browser evidence',
  '',
  `Chromium ${after.browser}; 900px viewport height; DPR 1; Europe/Moscow; reduced motion. Every pair uses the same browser/context settings and unmodified production-rendered pages. Before is a separate static build made from the clean reviewed commit before edits (port 5376); after is the final production build (5378). Fonts and images are decoded and the real scroll/reveal lifecycle is exercised before captures. No screenshot CSS, fabricated UI, substituted media or image stretching.`,
  '',
  '| Locale / width | First viewport | Full page |',
  '|---|---|---|',
];
for (const r of after.results) lines.push(`| ${r.locale.toUpperCase()} ${r.width} | ${pair(r.name, 'viewport')} | ${pair(r.name, 'full')} |`);
lines.push('', 'Affected-section pairs: hero framing, outcome typography and repeated inspection actions (clinical example). All other captured sections remain available in [before](before/) and [after](after/).', '', '| Locale / width | Hero | Outcome | Inspection action |', '|---|---|---|---|');
for (const r of after.results) lines.push(`| ${r.locale.toUpperCase()} ${r.width} | ${pair(r.name, 'hero')} | ${pair(r.name, 'outcome')} | ${pair(r.name, 'clinical')} |`);
lines.push('', '## Actual word wrapping', '', 'A per-word DOM Range check records line rectangles for every editorial h1/h2/h3. Unlike document overflow, it detects an ordinary word continuing on another line. The reviewed baseline reproduces exactly the reported three defects. After: **zero split heading words across all ten configurations**, with unchanged outcome copy.', '', '| Locale / width | Before outcome lines | After outcome lines |', '|---|---|---|');
for (const a of after.results) {
  const b = before.results.find(r => r.name === a.name);
  lines.push(`| ${a.locale.toUpperCase()} ${a.width} | ${b.refinement.outcomeLines.join(' / ')} | ${a.refinement.outcomeLines.join(' / ')} |`);
}
lines.push('', 'The baseline generic checks pass even where words break: zero overflow alone was insufficient. [Before measurements](before/results.json) and [after measurements](after/results.json) retain both word and overflow evidence.', '', '## Validation', '', '| Check | Result / evidence |', '|---|---|',
  '| `npm run check` | PASS · 0 errors, 0 warnings, 163 pre-existing hints. [log](astro-check.txt) |',
  '| `npm run check:content` | PASS · 0 findings on the final build. [log](content.txt) |',
  '| `npm run check:css` | PASS · no dead scoped rules. [log](css.txt) |',
  '| `npm run check:harmony` | PASS on default kit. [log](harmony-kit.txt) |',
  '| `npm run build` | PASS · 37 pages. [log](build.txt) |',
  '| Targeted harmony | PASS · both Vet routes × 1440/1280/768/390/360, zero violations. [log](harmony-vet.txt) |',
  `| Targeted browser QA | **${count}/${count} assertions pass**, ten locale/width configurations. No document/prose overflow, broken assets, runtime errors or scoped axe WCAG A/AA findings. Natural image aspect ratios, documentary width ceilings, metadata, product links/locales, next-case navigation and Back restoration verified. [log](browser-after.txt), [results](after/results.json) |`,
  '| Zoom and keyboard | Every visible image/full-screen trigger opens its intended source using pointer and Enter. Escape, focus containment, focus restoration and CTA focus pass. Separate full-record and keyboard-focus screenshots below. [interaction evidence](after/interaction-evidence.json) |',
  '| No JS / reduced motion | Both locales pass native no-JS image/link fallback and live motion preference changes. Public product destinations return success in EN/RU. [extra](after/extra.json) |',
  '| Media integrity | All original 52 manifest entries and file SHA-256 values remain identical to the reviewed commit. Exactly two lossless derivatives added. Raw crop pixels equal decoded WebP pixels. [preservation](regressions/preservation.json), [provenance](hero-provenance.json), [manifest](../MEDIA_MANIFEST.md) |',
  '', 'Complete-original access and restrained keyboard focus at every size:', '', '| Locale / width | Complete record, top / end | Inspection focus |', '|---|---|---|');
for (const r of after.results) lines.push(`| ${r.locale.toUpperCase()} ${r.width} | [top](after/${r.name}-complete-record-zoom.png) / [end](after/${r.name}-complete-record-zoom-end.png) | [focus](after/${r.name}-inspection-focus.png) |`);
lines.push('', '## Home and neighbouring cases', '',
  `Home: both locales at all five widths. Agent Ops, Partner Portal, Learn and Pawly: both locales at 1440/390. **${regressions.results.length}/${regressions.results.length} comparisons have identical content, links, image paths, normalized image geometry and document height; all have zero document overflow/runtime errors.**`,
  '',
  `The first strict screenshot run matched ${regressions.results.filter(r => r.identicalPixels).length}/26 full-page hashes. The two RU Pawly differences were confined to four rows of Chromium’s native video buffering track (202 pixels at 1440; 614 at 390), with identical page content/geometry. A targeted rerun loads the actual video fully, pauses at frame zero and allows native controls to settle: **${retest.results.filter(r => r.identicalPixels).length}/2 pixel-identical pairs**. Thus every comparison is supported by an exact matching pair. The first strict run correctly returned nonzero; it is retained, not relabelled as an all-identical initial pass. No media, controls or CSS was hidden to obtain the retest.`,
  '',
  '[Initial comparison measurements](regressions/results.json) · [initial log](regressions.txt) · [settled native-video retest](regressions/retest/results.json) · [retest log](regressions-retest.txt).',
  '',
  'Direct representative captures: [Home EN 1440 before](regressions/en-1440-home-before.png) / [after](regressions/en-1440-home-after.png); [Home RU 360 before](regressions/ru-360-home-before.png) / [after](regressions/ru-360-home-after.png); [Agent EN 1440 before](regressions/en-1440-agent-ops-console-before.png) / [after](regressions/en-1440-agent-ops-console-after.png); [Portal RU 390 before](regressions/ru-390-partner-portal-before.png) / [after](regressions/ru-390-partner-portal-after.png); [Pawly RU 390 settled before](regressions/retest/ru-390-pawly-before.png) / [after](regressions/retest/ru-390-pawly-after.png).',
  '',
  '## Final review questions',
  '',
  '**1. Is the Vet case genuinely premium and portfolio-ready?** The three named presentation defects are corrected and the implementation is ready for independent portfolio review. [Desktop](after/en-1440-viewport.png), [RU phone outcome](after/ru-360-outcome.png) and [full case](after/en-1440-full.png) provide the evidence. The implementation assessment is positive; “premium” acceptance belongs to the independent reviewer. This report does not self-approve the case.',
  '',
  '**2. Does it now match the visual/editorial quality of Agent Ops and Partner Portal?** The specific cover-quality gap has been addressed: the hero now presents a complete, readable information-boundary decision instead of the upper portion of a long form. Compare [accepted Agent reference](../references/agent-ops-console-1440-viewport.png), [accepted Portal reference](../references/partner-portal-1440-viewport.png) and [refined Vet](after/en-1440-viewport.png). The existing editorial narrative and truthful clinical evidence remain intact. It is a credible parity candidate; final comparative visual judgement remains open. The case does not acquire Agent’s validation history or new research claims through visual refinement.',
  '',
  '**3. Are all text wrapping, crops, spacing and responsive states consistently professional?** The tested Chromium matrix now has zero split editorial heading words, no prose/document overflow, intact screenshot proportions, native desktop hero geometry and preserved 24/48px outcome padding. All requested widths/locales, full-screen inspection and keyboard states have direct evidence above. Within that tested scope, the named defects are resolved. Independent judgement of the whole composition remains required; physical devices, Safari/Firefox and spoken screen-reader testing were not performed.',
  '',
  '## Reproduction and scope',
  '',
  'Use `npm ci` and the five repository commands above. To reproduce the exact before build, use a clean worktree at the reviewed SHA, build it and serve with `astro preview` on 5376. Serve the refined production build on 5378. Run `BASE_URL=http://127.0.0.1:5376 node audit/vet-portfolio-case-v2/v2.1/qa.mjs before` and the corresponding 5378 `after` command (set environment variables using the host shell). Run [interaction-evidence.mjs](interaction-evidence.mjs), [regressions.mjs](regressions.mjs) and, if native video buffering differs, `regressions.mjs --retest-buffered-media`. Playwright/axe use the existing external QA installation; no product dependency was added. Run [frame-hero.mjs](frame-hero.mjs) then the existing media-manifest builder to regenerate the two source-backed derivatives. [write-report.mjs](write-report.mjs) regenerates this report from the retained results.',
  '',
  'Harness notes: the initial development-server navigation assertion raced Astro’s swap; the final production harness waits for the actual h1. A rapid pointer-close/keyboard-reopen sequence originally raced the dialog’s asynchronous close cleanup; the harness now waits for that real cleanup and checks each decoded source. The regression inventory excludes the intentionally empty closed-dialog image. These were harness timing/inventory corrections; no shared navigation or zoom implementation was modified.',
  '',
  'No new product facts, feature claims, clinical values or metrics. Original 0.95ml / 1,500 RUB / publication data and synthetic-data disclosure are unchanged. No global design tokens, shared case components, main merge, deployment or Figma changes. Commit/push is limited to the requested review branch.',
  '',
);
fs.writeFileSync(`${root}/REPORT.md`, lines.join('\n'));
console.log('Report generated with direct matched evidence links.');
