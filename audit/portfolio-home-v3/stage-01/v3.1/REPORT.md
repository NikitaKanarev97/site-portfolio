# Homepage Premium V3.1 · implementation handoff

**2026-11-01 · Independent visual verdict pending — ChatGPT decides.**

Base: `c5fd121b86da8ebccf29110869d48d3d32f8531c` on
`codex/homepage-premium-v3-2026-11-01`. Corrective branch:
`codex/homepage-premium-v3.1-2026-11-01`.
Read the independent [review](https://github.com/NikitaKanarev97/site-portfolio/blob/806de5fcc64f8484138a9bef71703807bbf9163e/audit/portfolio-home-v3/independent/REVIEW.md)
and [V3.1 brief](https://github.com/NikitaKanarev97/site-portfolio/blob/806de5fcc64f8484138a9bef71703807bbf9163e/audit/portfolio-home-v3/independent/PROMPT-V3.1.md).
The review branch was read, not merged.

## Changes

1. **360/390 first fold:** retain the original identity, portrait, 36px DS headline,
   factual specialization, all actions, email and exact EN authorization. Tighten
   only the mobile grid/bridge rhythm using existing flow-pair. The first card
   alone uses `proofFirst`: title → real scene → explanatory outcome → footer.
   The scene now exposes the native financial-panel label and **$120** in all
   four phone first-fold captures. At EN390 the recipient is also visible.
   No image crop, replacement, retouch, duplicate cover or fixed viewport-height
   threshold is used. Scene width and source stay exactly as before on phones.
2. **Hero actions:** Work is heading-xl/accent with the existing down-arrow API.
   CV and Copy email are secondary, share a deliberate row below bp-xl and keep
   separate 48px targets. The selectable address has its own track below them.
   CSS subgrid keeps CopyEmail's wrapper and live feedback semantics intact.
   At 1440 all actions/address share the support rail. Scoped Home selectors
   center the link arrows; no shared TextLink/CopyEmail styling or logic changed.
3. **1024 Agent:** retain the title/outcome rail, give the genuine consequence
   image a wide field, then present supporting story below it. Image width grows
   from **421.0 to 806px in RU**, and from 514.3 to 806px in EN. Text uses the same
   DS roles. Only bp-xl returns to the accepted 2:5 story/image pairing.

Option A, typography, tokens, motion registry, first-four cover improvements,
case pages, navigation and other sections remain. The native Agent source now
precedes its explanation in DOM; the heading rail's wide-screen placement still
has a sensible reading sequence: project title, descriptive image/link, explanation.

Source changes: `src/pages/index.astro`, `src/components/FeaturedCase.astro`,
`src/components/agent/AgentHome.astro`; composition/API notes in
`ds/screens/home.md`, `ds/patterns.md`, `ds/components.md`.
Full [source patch](logs/source-diff.patch) and [provenance](logs/provenance.json).
The original checkout's unrelated Learn changes were left untouched in a separate
checkout; this branch was implemented in an isolated worktree.

## Matched real browser evidence

[Open the BEFORE/AFTER gallery](index.html). Each of eight EN/RU viewport pairs
contains the first fold, complete Agent card, complete Home and Pawly crop.
The first-fold and Agent pairs also have separate comparison JPEGs.

BEFORE was **newly built and captured from c5fd121**, then served from an immutable
`.tmp/before-dist` copy. AFTER uses the final corrective build. Chromium
151.0.7922.34, DPR 1, reduced motion, same locale/viewport per pair. Raw PNGs are
untouched; comparison JPEGs are labeled presentation sheets. The capture JSON's
HEAD identifies the base commit because capture preceded the delivery commit;
`provenance.json` records the exact corrective source and built-Home hashes.

| Locale / viewport | Native image visible BEFORE → AFTER | First fold pair |
| --- | ---: | --- |
| EN 1440×900 | 182.6 → 182.6px | [pair](comparisons/en-1440-first.jpg) |
| RU 1440×900 | 182.6 → 182.6px | [pair](comparisons/ru-1440-first.jpg) |
| EN 1024×900 | 182.3 → 158.3px, substantially wider image | [pair](comparisons/en-1024-first.jpg) |
| RU 1024×900 | 147.5 → 169.8px, substantially wider image | [pair](comparisons/ru-1024-first.jpg) |
| EN 390×844 | 61.6 → 160.0px | [pair](comparisons/en-390-first.jpg) |
| RU 390×844 | 118.4 → 216.8px | [pair](comparisons/ru-390-first.jpg) |
| EN 360×800 | 17.6 → 116.0px | [pair](comparisons/en-360-first.jpg) |
| RU 360×800 | 11.7 → 136.1px | [pair](comparisons/ru-360-first.jpg) |

At 1440 the image begins at the unchanged y=717.44. On phones the amount enters
the first fold; the entire action is not claimed to fit there. The separately
scrolled normal-size 390px captures show **both complete native panels**, including
recipient, next-invoice credit/no-cash consequence, timing and exact customer
message: [EN context](screenshots/states/en-390-native-context.png),
[RU context](screenshots/states/ru-390-native-context.png).

Actual saved Garri, HA and Dounar images were opened and compared with final
captures: [REFERENCE-PAIRS.md](REFERENCE-PAIRS.md). No claim of equivalent premium
quality or independent acceptance is made.

## Technical checks

| Check | Actual result / evidence |
| --- | --- |
| `npm run check` | 141 files; 0 errors, 0 warnings, 163 hints. [log](logs/astro-check.txt) |
| `npm run build` | 37 routes built. [log](logs/build.txt) |
| `npm run check:css` | No dead scoped rules. [log](logs/scoped-css.txt) |
| `npm run check:harmony` | No violations. [log](logs/harmony.txt) |
| `npm run check:content` | 0 findings, including built HTML. [log](logs/content.txt) |
| Browser QA | **54 passed, 0 failed**. Eight axe A/AA/best-practice scans: 0 violations. [results](logs/browser-qa.json) |
| Layout/keyboard QA | **16 passed**: EN/RU at 360, 390, 767, 768, 1023, 1024, 1439, 1440; 48px actions, arrow centers, intentional secondary row, focus order/outlines, native source selection, no overflow. [results](logs/layout-qa.json) |
| Raw captures | 8 BEFORE + 8 AFTER combinations; no missing images, uncaught errors or HTTP failures. [before](logs/before-capture.json), [after](logs/after-capture.json) |
| Protected covers | **32 comparisons unchanged**: Portal/Learn/Vet/Pawly × eight combinations. Exact DOM, complete selected computed-style properties, current image sources/alts and links. [results](logs/protected-covers.json) |
| Case documents | All 10 EN/RU case documents unchanged excluding inline style elements emitted by static Home-module imports. [results](logs/case-document-parity.json) |
| Media | All 8 used Agent/Pawly image files in these captures byte-identical to c5fd121. No changes anywhere in `public/` or copy sources. [hashes](logs/media-parity.json) |

Browser QA covers Work anchor, internal destinations and PDF payloads, keyboard
copy success, copy failure with selectable address/live fallback, four dialogs,
menu trap/Space/Escape, five real case transitions, case image zoom/focus return,
About and language switching. It also exercises normal/reduced motion, no JS,
slow and failed images with reserved geometry/alt fallback. Axe incomplete items
remain in its JSON for manual review. Layout QA verifies Work → CV → Copy keyboard
order and centered arrow/label geometry. No new runtime dependencies were added.

## Frozen areas and limitations

**Pawly:** no source, DOM, copy, alt, links, order, media or computed-style change
in all eight comparisons. Raw desktop captures are pixel-identical. Other raw
crops can differ by one raster row and subpixel text/image paint after upstream
page-length changes; they are not claimed pixel-identical. The separate registered
crops only diagnose fractional Y and never replace the raw captures; their maximum
mean channel difference is under 0.0041/255. [Measured details](logs/pawly-and-fold.json),
[computed-style snapshots](logs/pawly-computed-styles.json),
[registration offsets](logs/pawly-alignment.json).

**Vet:** existing old media/text/composition retained; media refresh remains
blocked on independent acceptance of its source. No clinical narrative invented.

**Startup CLS:** inherited nav initialization remains **0.0772219851 before and
after** for both locales under the same slow-image probe. No image-geometry shift
introduced. [comparison](logs/loading-comparison.json).

Evidence is Chromium on Windows, not physical-device Safari/Firefox validation.
The phone first fold still gives priority to the large author thesis, and its
native UI detail remains denser than HA's hardware-led cover. Full context is
one scroll away. Those are explicit visual-review considerations, not acceptance.

No merge, deploy, Figma edits or self-acceptance performed. Remaining concrete
request: **ChatGPT independently review the matched first folds, RU1024 Agent
pair, reference sheets and Pawly regression evidence, then issue the visual verdict.**

## Reproduce

Dependencies installed with `npm ci`; Playwright/axe use the existing
`D:/Claude-projects/b2b-dssl` installation (override `PLAYWRIGHT_REPO` as needed).
Serve the c5fd121 build on 4421 and corrective build on 4422 with
`node tools/serve.mjs <dist-directory> <port>` from this evidence directory, or
use the full repository-relative script path from the repository root. Run tools
from the repository root:

```powershell
$env:PORTFOLIO_ORIGIN='http://127.0.0.1:4421'
node audit/portfolio-home-v3/stage-01/v3.1/tools/capture.mjs before
$env:PORTFOLIO_ORIGIN='http://127.0.0.1:4422'
node audit/portfolio-home-v3/stage-01/v3.1/tools/capture.mjs after
node audit/portfolio-home-v3/stage-01/v3.1/tools/browser-qa.mjs
node audit/portfolio-home-v3/stage-01/v3.1/tools/layout-qa.mjs
node audit/portfolio-home-v3/stage-01/v3.1/tools/aligned-pawly.mjs
node audit/portfolio-home-v3/stage-01/v3.1/tools/regressions.mjs
node audit/portfolio-home-v3/stage-01/v3.1/tools/protected-covers.mjs
python -X utf8 audit/portfolio-home-v3/stage-01/v3.1/tools/compare.py
```
