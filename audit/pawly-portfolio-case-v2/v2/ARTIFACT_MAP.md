# Pawly Case V2 — artifact map

All paths are relative to this folder unless they start with `src/`, `public/` or `research/` (repository root).

## Source and media

| What | Where | Provenance |
|---|---|---|
| Case renderer | `src/components/pawly/PawlyCase.astro`, `src/components/pawly/PawlyShot.astro` | new, Pawly-only |
| Copy EN / RU | `src/copy/cases/pawly-v2.ts`, `src/copy/ru/cases/pawly-v2.ts` | new; old `pawly.ts` kept (still feeds the case registry, Home and next-case titles) |
| Route wiring | `src/pages/work/[slug].astro` (+6 / −1 lines) | the only edited existing file |
| Media index | `src/data/pawly-case-v2-media.json` | written by `tools/crops.py` |
| Published media | `public/media/pawly-case-v2/` — 13 slices × EN/RU + `pickup-photo.webp` (1.9 MB total, ≈0.9 MB per locale) | crops of `captures/product/*-full.png`; photo byte-copied from `pawly/public/assets/proof/handover-pickup.webp` @ `a327d73` |
| Crop manifest | [`captures/crops.json`](captures/crops.json) | per file: route, locale, fixture, source PNG + SHA256, device-px crop rectangle, page surface colour, sections, output size + SHA256 |
| Product capture facts | [`captures/product/captures.json`](captures/product/captures.json) + [`captures-partial.json`](captures/product/captures-partial.json) (UI-driven outcome screens, supersedes the seeded run for `order-details`, `walker-earnings`) | product SHA, seed slot/times, clock, per-shot DOM geometry, draft state, console errors |
| Raw product captures | [`captures/product/`](captures/product/) — `<state>-<locale>.png` (first 844 px) and `-full.png` (whole document), 390 × DPR 2 | local build of `a327d73` |
| Production parity | [`captures/production-parity/`](captures/production-parity/) | same three states from `pawly-fawn.vercel.app`: pixel-identical to local (EN/RU) |

## Tools (all re-runnable)

| Tool | Purpose |
|---|---|
| [`tools/product-capture.mjs`](tools/product-capture.mjs) | product states, one fixture and clock, UI-driven transitions |
| [`tools/crops.py`](tools/crops.py) | measured slices; edges must land on clean page surface; interior mode for the booking card |
| [`tools/edge-audit.py`](tools/edge-audit.py) | independent four-edge check of every published slice |
| [`tools/capture-page.mjs`](tools/capture-page.mjs) | BEFORE/AFTER page captures (same script, same settings) |
| [`tools/functional.mjs`](tools/functional.mjs) | 66 functional / accessibility checks, no-JS and motion-on captures |
| [`tools/scope-diff.py`](tools/scope-diff.py) | build-to-build scope proof |
| [`tools/boards.py`](tools/boards.py) | comparison boards (labels and scaling only) |
| [`tools/serve.mjs`](tools/serve.mjs) | static server for a built dist |

## Evidence

| Evidence | Where |
|---|---|
| BEFORE (base `3b4f9b5`), EN/RU × 1440/1024/768/390/360/320 | [`before/`](before/): `*-viewport.png`, `*-full.png`, `*-section-*.png` (1440, 390), [`facts.json`](before/facts.json) |
| AFTER, same matrix | [`after/`](after/): same names, [`facts.json`](after/facts.json) |
| AFTER no-JS and motion-on | [`after/functional/`](after/functional/) `*-nojs-full.png`, `*-390-nojs-viewport.png`, `*-motion-viewport.png` |
| First-viewport boards | [`comparisons/viewport-{en,ru}-{1440,1024,768,390,360,320}.jpg`](comparisons/) |
| Full-page boards | [`comparisons/full-{en,ru}-{1440,390}.jpg`](comparisons/) |
| Old vs fresh product media | [`comparisons/media-{active-service,walker-profile,order-details}.jpg`](comparisons/) |
| Benchmark boards | [`comparisons/benchmark-{hero,choosing,handoff,exceptions,return,settlement,mobile}.jpg`](comparisons/) |
| Logs | [`logs/`](logs/): `build.txt`, `typecheck.txt`, `css.txt`, `content.txt`, `functional.txt`, `after-capture.txt`, `edge-audit.txt`, `scope-dist-diff.txt` |
| References | [`../REFERENCES.md`](../REFERENCES.md) |
| Section map | [`SECTION_MAP.md`](SECTION_MAP.md) |
