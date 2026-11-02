# B2B Partner Portal · Premium portfolio case V3 · Report

2 November 2026. Prepared for independent review. **Not self-approved; no merge, deploy or
Figma change.**

- Branch: `redesign/b2b-portfolio-premium-v3-2026-11-02`, isolated worktree, from verified
  baseline `bb7a0881f78cc1b5118a70d026863b55298a5262`.
- Product evidence: `b2b-partner-portal` @ `36be1d8` (new captures), with unchanged earlier
  frames from `6bbe1cd` and `c899933` — see [ARTIFACT-MAP](ARTIFACT-MAP.md).
- Agent Ops V3 (Codex) worktree and files were not touched.

Companion documents: [RESEARCH](RESEARCH.md) (baseline, provenance, section audit) ·
[REFERENCE-MAP](REFERENCE-MAP.md) · [STORYBOARD](STORYBOARD.md) ·
[ARTIFACT-MAP](ARTIFACT-MAP.md) · [MOTION](MOTION.md).

## What changed

The case now follows one procurement object instead of presenting a set of screens:

1. **Hero** — promise "From spreadsheet to purchase — without losing control of the
   decisions", the sole-designer line and *"The commercial redesign shipped at DSSL. The screens
   here are my later rebuild of its decisions on synthetic data, not the shipped release."* are
   all inside the first 1440 viewport. Workspace and DeltaRow are the accepted frames.
2. **01 Diagnosis** (new structure) — two archival frames of the original portal (dashboard;
   a newly cropped cart line with a one-click "Replace" justified by an AI hint that "may make
   mistakes", an empty price column and colour-only stock dots), each with Observed → Direction,
   zoomable to full size, then the built Dashboard as the direction.
3. **02 Architecture** (new) — an editorial HTML diagram: three ways in → Specification
   (provenance + four identity states, one resolver) → Cart (three freshness states, delta
   approved per line) → Fulfillment → Checkout/Order, with *Product identity / Commercial
   certainty / Fulfillment* bands. Real text in EN/RU, vertical on phones.
4. **03 Source line** (new evidence) — row 19 "nvr 8ch poe", 2 pcs, in four real states from one
   recorded session at 36be1d8: imported → compared and chosen → confirmed (still "was Ambiguous",
   Undo) → the cart line that names source row 19. Replaces the pre-V1.1 panel geometry.
5. **04–06** — accepted V2.1 media kept. Proofs now state limits (identity ≠ compatibility, ERP
   simulated, stock ≠ delivery promise); commerce gains a numbered decision chain; fulfillment
   names the five compared dimensions.
6. **07 Design system** (new) — eight semantic colours with values read from the product build,
   the type scale, and four families with real states: ResolutionRow (real queue rows, EN/RU),
   FileUpload, Availability, FulfillmentPlan (product Storybook).
7. **08 Process** (new) — four steps, each with its real artifact path, labelled as 2026 rebuild
   artifacts; original DSSL files are stated as not public.
8. **Outcome** — Shipped / Shown / Owned as separate claims, three costs, unchanged CTA and note.

Files: `src/components/portal/PortalCase.astro`, both copy files, the media registry (additive:
0 existing entries changed), `src/data/partner-portal-v3-tokens.json`,
`public/media/rebuild/partner-portal/v3/` (42 WebP), `ds/screens/case-dssl.md`,
`ds/components.md`, `scripts/b2b-v3/`. Not changed: `PortalShot`, `PortalHome`, tokens,
`animations.js`, `motion.js`, any other case.

## Section review

| Section | Reference | BEFORE problem | Design decision | AFTER evidence | Remaining gap |
|---|---|---|---|---|---|
| Hero | R4 `dn-head.jpg` | role and shipped/rebuild status below the fold | role + status note in first view, asymmetric layout kept | [01-hero](comparisons/01-hero-en-1440.jpg), `after/*-first-view.png` | note is small type; a reviewer may want it closer to the facts row style |
| 01 Diagnosis | R1 `dn-diag.jpg` | one tiny strip carried the argument | 2 archival frames × Observed → Direction, zoom | [02-diagnosis](comparisons/02-diagnosis-en-1440.jpg) | archival cart text is small at page scale (≈1/3 of source); readable only via zoom |
| 02 Architecture | R2 `ha-user-flow.png`, `ha-screen-map.png` | six words, no structure | stages + certainty bands, HTML both locales | [03-architecture](comparisons/03-architecture-en-1440.jpg) | no explicit decision diamonds or drawn return loop (HA has both); loop is a sentence |
| 03 Source line | product + R6 | stale geometry, two unrelated frames | four stages of one session incl. cart | [04-source-line](comparisons/04-source-line-en-1440.jpg), [motion](comparisons/16-motion-1440.jpg) | disabled-Apply state captured (`line-open`) but not shown on the page, only described |
| 04 Product | R5 (recorded text) | proofs restated features | proofs state boundaries | [05-verification](comparisons/05-verification-en-1440.jpg) | unchanged screenshot |
| 05 Commerce | R5 | two stacked images without reading order | numbered chain above modules | [06-commerce](comparisons/06-commerce-en-1440.jpg) | images still left-weighted at 1440 (native width, no upscale) |
| 06 Fulfillment | R5 | dimensions implicit | dimension chips | [07-fulfillment](comparisons/07-fulfillment-en-1440.jpg) | minimal change by intent |
| 07 Design system | R3 `ha-component-library.png`, `ha-components.jpg` | absent | foundation strip + four families, real states | [08-design-system](comparisons/08-design-system-en-1440.jpg) | type shown as numbers, not rendered in Inter; Storybook specimens are English on the RU page |
| 08 Process | R6 | absent | four artifact-backed steps | [09-process-outcome](comparisons/09-process-outcome-en-1440.jpg) | text-only; no artifact images (IA files are markdown/mermaid) |
| Outcome | — | categories implicit | Shipped / Shown / Owned | same board | — |

## Acceptance questions (my assessment, for the reviewer to verify)

- **Q1 Narrative.** Product, purpose, sole-designer role and shipped-vs-rebuild status are in
  the first viewport at 1440, 390 and 360 (EN/RU). The problem is stated in 01 right after facts.
- **Q2 Product thinking.** 02 shows how entries converge and which stage owns which certainty;
  03 proves traceability on one object; 07 shows the state model.
- **Q3 Premium benchmark.** Diagnosis and design system now follow the inspected R1/R3 structures.
  Architecture is cleaner but less expressive than R2 (no branches). Not claimed to exceed them.
- **Q4 Product evidence.** All UI is native product output; one fixture adjustment (six rows
  pre-resolved) is disclosed on the page and in ARTIFACT-MAP. No price change is attached to
  row 19 on the page, because the recorded session did not show one.
- **Q5 Ownership.** Hero, facts, 08 and Outcome; no testing, metrics or team claims invented.
- **Q6 Motion.** Registered names only; reduced-motion and no-JS show everything; no pins.
- **Q7 EN/RU.** Same structure (`assertPortalPair`), native RU product frames for the source line
  and ResolutionRow; Storybook specimens English in both, disclosed.
- **Q8 Integration safety.** See below.

## Verification (all run in this worktree)

| Check | Result | Log |
|---|---|---|
| `astro check` | 0 errors, 0 warnings, 163 hints (pre-existing) | [logs/astro-check.log](logs/astro-check.log) |
| `astro build` | 37 pages | — |
| `check:content` (CONTENT-RULES guard) | PASS, 0 findings. First run caught "independent reconstruction"; rephrased | [logs/check-content.log](logs/check-content.log) |
| `check:css` | 0 dead rules on all routes incl. `/work/partner-portal` | [logs/check-css.log](logs/check-css.log) |
| Page captures EN/RU × 1440/1024/768/390/360 | 0 runtime errors, 0 failed requests, 0 broken images, 0 upscaled frames, 0 horizontal overflow, 0 hidden text | [after/checks.json](after/checks.json), [before/checks.json](before/checks.json) |
| Behaviour | reduced motion, no-JS, zoom Enter/Escape + focus return, anchor, CTA/next/locale links, phone scrollers, navigation lifecycle | [logs/behaviour.json](logs/behaviour.json), [MOTION](MOTION.md) |
| Scope | 173 HTML pages byte-identical incl. Home and About. The 8 other case pages differ only in inlined CSS: markup identical, 0 non-Portal CSS rule differences (Astro inlines all `[slug]` route component styles, as before). 0 assets changed or removed | [logs/build-scope.json](logs/build-scope.json) |
| Product captures | 0 page errors, 0 failed resources in every session; Apply disabled → enabled recorded | `captures/line-manifest.json` |

Sizes: EN 1440 page 8,266 → 13,755 px; RU 1440 8,602 → 14,319; EN 390 10,881 → 19,205;
RU 390 11,611 → 20,111. Case text (incl. labels, captions, next-case block) EN 647 → 1,423
words, RU 589 → 1,271. The growth comes from three added sections the brief requires
(architecture, design system, process); it is a real cost for a fast scan.

## Known limitations

- Longer page (see above). The first viewport and section heads still give a fast scan, but a
  reviewer may prefer cutting 08 or folding 06 into 05.
- Architecture diagram has no decision branches; HA's flow is richer.
- Archival cart text is small at page scale; zoom is required for reading.
- Storybook specimens are in the product's English UI on the RU page; disclosed.
- Disabled-Apply state is evidenced in captures and described in copy but not displayed.
- Public prototype still predates these screens; CTA wording kept, destination unchanged.
- Not tested: physical devices, WebKit, Firefox, Lighthouse/field performance. No Vercel preview
  was verified from this environment.

## Three highest-value improvements

1. **The source line is now one real object** from file row to cart line, captured in one session
   on the accepted V1.1 UI — replacing stale panel geometry and two unrelated frames.
2. **Diagnosis is evidence-led**: archival screens of the original portal with explicit
   Observed → Direction pairs, including the previously unused cart evidence (one-click AI
   replacement, empty price column).
3. **The design system appears as product evidence**: real semantic values and real component
   states that carry the procurement logic, plus an architecture diagram that separates identity,
   commercial certainty and fulfillment.

## Reproduce

```
node scripts/b2b-v3/serve.mjs <product-dist-root> 5210 b2b/index.html   # product @36be1d8
node scripts/b2b-v3/serve.mjs <storybook-static> 5211
node scripts/b2b-v3/capture-line.mjs && node scripts/b2b-v3/capture-specimens.mjs
node scripts/b2b-v3/build-media.mjs
npx astro build && node scripts/b2b-v3/serve.mjs dist 4411
node scripts/b2b-v3/capture-page.mjs http://127.0.0.1:4411 after
node scripts/b2b-v3/first-view.mjs http://127.0.0.1:4411 after
node scripts/b2b-v3/qa-behaviour.mjs http://127.0.0.1:4411 http://127.0.0.1:4412   # 4412 = astro dev
node scripts/b2b-v3/build-scope.mjs <before-dist>
node scripts/b2b-v3/make-boards.mjs
```
