# kanarev.com Homepage Premium V3 — implementation evidence

**01 November 2026 · Option A — Editorial Bridge · independent visual acceptance pending.**

Implementation branch: `codex/homepage-premium-v3-2026-11-01`.
Code commit: `d8544b7378123b5b7f5f3849d8872d20775531b8`.
Research/base HEAD: `7d4c51e66b45e357bf2e4a25b7ca278747e89bc3`.
Latest fetched `origin/main`: `561e6830392b6e9a25e61e30cafe394586df3ff4`.
Research HEAD and origin/main have identical `src/` and `ds/` before implementation.
The original checkout at `D:/Claude-projects/Site-portfolio` was left on its local
main with its four pre-existing modified Learn task documents intact. Implementation
uses the separate `D:/Claude-projects/sp-home-premium-v3` worktree.

Open [the screenshot gallery](index.html), [reference comparisons](REFERENCE-PAIRS.md),
[test evidence](TESTS.md), [media provenance](SOURCES.md) and [Pawly regression](COMPARE-PAWLY.md).

## Implemented

- Preserved the Onest headline, warm neutrals, vermilion accent, NK navigation and
  existing five-case order. Replaced the large portrait/five-link hero index with
  a compact author portrait linking to About, specific product-design copy and
  a real primary work anchor. CV, copy email and the selectable address remain
  visible; EN authorization is verbatim and its intentional absence in RU remains.
- Connected hero to the actual first case with a quiet Selected work / 01—05 seam.
  No duplicate hero screenshot, scroll-gated handoff or new animation system.
- Opt-in editorial headings/spacing affect the first four cards only. Agent uses
  the existing genuine financial-consequence shot; on phones the image precedes
  supporting explanation. Desktop keeps the full 806 CSS-pixel decision panel.
- Portal gives the genuine source-row/two-candidate selection more space. The
  synthetic 41/48 state remains product context, not a claimed measured improvement.
- Learn has one native task-led scene, two factual entry paths from existing copy,
  and one surrounding field instead of nested navy/warm frames.
- Vet keeps its existing media. The candidate new visit-record capture remains
  unaccepted in the research pack and was not imported or called current.
- Webflow stays secondary: four thumbnails in one desktop row, two on tablet,
  compact mobile rows. All four dialogs and progressive external anchors remain.
  Existing process, contact and footer copy/behavior were retained.
- Corrected invalid language-list roles on Home navigation only. Other route markup
  stays as it was; no global typography, palette, motion, case renderer or app changed.

Changed implementation paths: `src/pages/index.astro`, `src/copy/{home,ru/home}.ts`,
`src/components/{FeaturedCase,Navbar}.astro`,
`src/components/{agent/AgentHome,portal/PortalHome,learn/LearnHome}.astro`.
DS documentation: `ds/{components,patterns}.md`, `ds/screens/home.md`.
Tokens and motion sources/mirrors are unchanged.

## Matched browser evidence

Real headless Chromium **151.0.7922.34**, Windows, DPR 1, EN/RU, reduced-motion
for stable comparison. BEFORE is a clean detached worktree at the exact base,
served as a static build on port 4413. AFTER is the implementation static build
on 4412. Identical scripts, fonts, decoding waits, viewports and page states.
These are local source comparisons, not fresh production screenshots.

Eight configurations per phase: 1440×900, 1024×900, 390×844, 360×800, both locales.
Each has first viewport, full page, all five cards, Webflow, process, contact and
footer: **176 matched captures**, plus state, regression and reference comparisons.
Capture metadata is in [before](logs/before-capture.json) and
[after](logs/after-capture.json); all image hashes are in [the manifest](logs/image-hashes.json).
The capture HEAD field is the pre-commit base; [source provenance](logs/provenance.json)
binds the captured working source patch to the code commit above.

| Locale / viewport | BEFORE first product Y | AFTER first product Y | Native UI visible at fold |
| --- | ---: | ---: | ---: |
| EN 1440×900 | 1253.1 | 717.4 | 182.6 px |
| RU 1440×900 | 1253.1 | 717.4 | 182.6 px |
| EN 390×844 | 1494.5 | 782.4 | 61.6 px |
| RU 390×844 | 1454.0 | 725.6 | 118.4 px |
| EN 360×800 | 1526.0 | 782.4 | 17.6 px |
| RU 360×800 | 1516.7 | 788.3 | 11.7 px |
| EN 1024×900 | 1237.5 | 717.7 | 182.3 px |
| RU 1024×900 | 1234.1 | 752.5 | 147.5 px |

Full supporting results: [Pawly/fold measurements](logs/pawly-and-fold.json).
Every configuration has one h1, zero horizontal overflow, zero undecoded/broken
content images and zero captured page errors/HTTP failures.

## A — Does it feel premium?

The evidence shows a stronger editorial entrance: typography now leads directly
to one consequential product scene. The desktop fold target is met in both
languages while keeping the original headline size. This is an implementation
assessment, **not a visual acceptance verdict**. The independent reviewer decides.

## B — Closeness to the inspected references

[Ten image pairs](REFERENCE-PAIRS.md) compare actual final sections with saved
Garri, HA, Dounar and Tubik captures. Adapted strengths are clear hierarchy, one
dominant decision, contextual native UI and a distinct secondary work rhythm.
This is not an exact clone. HA's floating hardware, Garri's banking UI and Dounar's
documented outcome metrics are neither copied nor implied here.
Blinkov/Victor visual parity is **NOT VERIFIED**: this research pack has textual
notes/URLs but no equivalent saved pixel captures for these sections.

## C — Remaining limits for independent review

- At 360 px the real product only starts at the fold; its full decision requires
  a short natural swipe. RU retains a three-line 36px headline at this width.
  At 1024 RU the support column also gives the UI less width. No type was shrunk
  merely to hit a screenshot number.
- Portal/Learn microcopy inside native screenshots still benefits from opening
  the case and its zoom. The bigger homepage scenes improve visual hierarchy;
  they do not make every dashboard label readable at phone scale.
- Vet is deliberately the older existing presentation. No accepted replacement
  SHA was supplied. This iteration makes no new-media claim for it.
- In the 600 ms delayed-image check, the existing progressive mobile navigation
  changes from native fallback links to its initialized menu, moving main by
  72px. Measured CLS was **0.07722 before and after** in both locales. Image widths
  and heights remain reserved. This inherited startup behavior is recorded rather
  than hidden by the matched settled screenshots.
- Chromium viewport tests do not replace physical Safari/Firefox testing, assistive
  technology testing, field Core Web Vitals or an independent art-direction review.

## D — Pawly and case-page freeze

Pawly stays fifth, with unchanged source files, assets, text, alt, route, CTA,
specialized DOM and computed styles in all eight configurations. Raw page-image
diffs are not pixel-identical because upstream spacing changes the document's
subpixel raster position. The unmodified raw captures and diffs are retained;
the separate alignment diagnostic is explicitly labelled and explained in
[COMPARE-PAWLY.md](COMPARE-PAWLY.md). No Pawly-specific correction was made.

All ten EN/RU case HTML documents have identical content after excluding emitted
style tags. Home-only component CSS is included by existing static imports;
selectors stay scoped to Home. Individual page, story, renderer, media and product
files are unchanged. [Document parity evidence](logs/case-document-parity.json).

## E — Verification and handoff

Astro check: **0 errors / 0 warnings** (163 informational hints). Build: **37 routes**.
Scoped CSS: **0 dead rules on every scanned route**. Content: **0 findings**.
Harmony: **0 violations** in its existing /kit matrix. Browser: **42 checks passed**;
axe: **0 violations** on EN/RU at 1440/390/360. Tests cover all case transitions,
About/language/work/contact navigation, CV PDFs, email success/failure, dialogs,
menu/focus/keyboard, existing case zoom, motion/no-JS and loading/image failures.
See [TESTS.md](TESTS.md) for commands, exact coverage and limits.

No main merge, production deployment, Figma edit, external product edit or
self-approval. The remaining request is independent visual acceptance of this
branch and its evidence, including the explicit mobile/loading limitations.
