# TRASSIR Learn Portfolio V3.1 — independent review fixes

2 November 2026. Base: `a1ae443b2162e3415ee1e6297b41026ddaa70780`.
Branch: `codex/trassir-learn-portfolio-premium-v3-2026-11-02`.
Existing worktree: `D:/Claude-projects/sp-learn-premium-v3`.

**Result: capture synchronization and verification fixes only.** The running page naturally reaches full-opacity hero media. No application implementation change was warranted by the investigation. V3 composition, copy, genuine product images, reference images and every other case remain unchanged. This is evidence for independent acceptance, not a claim of acceptance. Nothing was merged, deployed or edited in Figma.

## Corrected visual evidence

| Matched format | EN | RU |
|---|---|---|
| 1440 × 900 | [Comparison index](comparisons/en-1440.md) · [Corrected viewport](after/en-1440-viewport.png) | [Comparison index](comparisons/ru-1440.md) · [Corrected viewport](after/ru-1440-viewport.png) |
| 390 × 844 | [Comparison index](comparisons/en-390.md) · [Entire hero](after/en-390-learn-cover.png) | [Comparison index](comparisons/ru-390.md) · [Entire hero](after/ru-390-learn-cover.png) |
| Original V3 capture → corrected V3 capture | [1440](comparisons/en-1440-capture-fix.png) · [390](comparisons/en-390-capture-fix.png) | [1440](comparisons/ru-1440-capture-fix.png) · [390](comparisons/ru-390-capture-fix.png) |

Each index links matching viewport, full-page and entire-hero BEFORE/AFTER evidence. For continuity with the original review pack, freshly synchronized **design BEFORE** remains pinned V2.3 `4b9744da88864a896d6c2565e4c3baaf032ef175`, served from the existing `.tmp/baseline/dist`. **AFTER** is the unchanged V3 application from `a1ae443`, rebuilt in this worktree. Both use Chromium, DPR 1, identical dimensions/locale, production HTML and normal motion. The separately labelled **capture-fix** boards compare the archived V3 screenshots with the corrected V3 screenshots; their old side deliberately retains the timing defect. They do not imply a redesign.

All original screenshots, comparisons, benchmark references, provenance and source manifests are retained at their original paths. New evidence is additive under `v3.1/`; the only changed existing file is the capture script. [Integrity and 32 source-image SHA256 checks](logs/integrity.json).

## Exact cause of the washed-out hero

The old script took the first viewport after `networkidle`, `document.fonts.ready` and a fixed **2200 ms** timeout. Those conditions do not establish that the asynchronous Astro motion initialization and GSAP intro have finished. `initPage()` waits for fonts plus a requestAnimationFrame; `buildIntro()` creates a paused timeline, and a further fonts/frame boundary starts it. Hero descendants include the heading fade and two `CaseScreen` `fade-image` reveals. The media reveals last 1 second, staggered by 80 ms; their opacity and vertical offset are expected intermediate animation states.

The legacy timing reproduced the defect in an unmodified production page. At the last sample before capture, **2715 ms** after document start, the promise/Home/answer opacities were **0.8888 / 0.3112 / 0.0355**. The media transforms still translated vertically by **16.5305 / 23.1476 px**, and `will-change` remained `transform, opacity`. At **3763 ms**, without a gesture, style override or forced timeline completion, all three were opacity **1**, identity/no transform, and `will-change: auto`. They stayed there through the 6507 ms final sample. [Full time series and original check result](logs/lifecycle-diagnostic.json) · [Legacy reproduction image](logs/legacy-single-en.png).

Thus the apparent color loss was an early capture of a normal fade over the light page, not changed source pixels or a persistent low-opacity state. Later section captures were taken after the scroll sweep, image decode and further waits, explaining their correct colors. The report does not claim that users never see an entrance fade; it establishes that the fade completes and does not leave the media washed out.

The corrected [capture script](../capture.mjs) now uses [observable settlement](settled.mjs):

1. Observe the real `astro:page-load` lifecycle; load/decode assigned images and await fonts.
2. Wait for every intro target's **initialized inline opacity 1**, computed opacity 1, identity transform and released `will-change`. A pre-initialization computed opacity of 1 alone is insufficient.
3. Visit the page to trigger the relevant once-only reveals, then wait for their endpoints and completed diagram strokes.
4. Return to the top and require unchanged geometry/style across at least 350 ms of animation frames before capturing. Section captures use the same endpoint check.

No GSAP progress/finish call, forced opacity, reduced-motion substitution or animation-disabling screenshot option is used. The small sweep interval is only for visiting triggers; it is not the screenshot readiness criterion. Locale captures run sequentially. Unsettled motion or broken assigned images fail the run instead of silently producing acceptance evidence.

Normal entry, reload, locale navigation, browser history return, reduced-motion toggles and no-JS endpoints were verified. Two additional cases delay built JS requests by 1800 ms and still reach the same endpoint. [Detailed browser/lifecycle results](logs/browser.json).

## Why `missing: [""]` was false

The legacy expression `i.src && !i.naturalWidth` used the resolved DOM `src` property. For the closed MediaZoom's `<img data-media-zoom-image src="">`, that property resolves to the document URL and is truthy, while `naturalWidth` is 0 and `currentSrc` is empty. Mapping `currentSrc` therefore produced `[""]`. This is a dormant dialog image whose real source is assigned only when zoom opens, not missing page content. The old capture script could exit nonzero from this false positive despite empty page/network error arrays; the original report's unqualified normal-capture PASS is superseded here.

The new checker examines attributes and source selection, explicitly records this exact empty **closed** dialog placeholder in `ignored`, and checks every other image's completion and native dimensions. Corrected [AFTER checks](after/checks.json), [BEFORE checks](before/checks.json) and [320/360 checks](after/responsive-checks.json) all have `missing: []`, one documented ignored closed placeholder, no browser/console/HTTP errors and no page overflow. An assigned image with an empty `currentSrc` is still a failure; it is never removed by filtering out empty strings.

Meaningful guard fixtures establish that a broken assigned image, ordinary empty image and empty **open** MediaZoom image all fail. On every real zoom opening, the checker includes the loaded zoom image, confirms no ignored image remains and verifies its exact `currentSrc` against the clicked source. [Checker and browser verification](verify.mjs).

## Mobile verification

EN/RU at **320, 360 and 390**, plus 1440 desktop, passed in normal motion. At mobile widths, the graph fits containers **272 / 312 / 342 px** with identical scroll widths. All 13 text runs are inside the SVG; rendered font sizes are at least **12 px**, with five directional relationships intact. Both localized 320 px diagrams were visually inspected. This verifies the current diagram treatment, without changing its design.

| Width | Graph evidence | Zoom and navigation evidence |
|---|---|---|
| 320 | [EN](mobile/en-320-graph.png) · [RU](mobile/ru-320-graph.png) | [EN zoom](mobile/en-320-zoom.png) · [RU zoom](mobile/ru-320-zoom.png) · [EN menu](mobile/en-320-navigation.png) · [RU menu](mobile/ru-320-navigation.png) |
| 360 | [EN](mobile/en-360-graph.png) · [RU](mobile/ru-360-graph.png) | [EN zoom](mobile/en-360-zoom.png) · [RU zoom](mobile/ru-360-zoom.png) · [EN menu](mobile/en-360-navigation.png) · [RU menu](mobile/ru-360-navigation.png) |
| 390 | [EN](mobile/en-390-graph.png) · [RU](mobile/ru-390-graph.png) | [EN zoom](mobile/en-390-zoom.png) · [RU zoom](mobile/ru-390-zoom.png) · [EN menu](mobile/en-390-navigation.png) · [RU menu](mobile/ru-390-navigation.png) |

All eight locale/size cases verify six genuine source zooms (Home, answer, archive, programme, learner and recovery), decoded native dimensions, keyboard opening, focus containment and Escape/focus return. All five section anchors reach their target hash and align to the computed scroll margin within 2 px. Mobile menu containment/close/focus return, locale switching, browser Back and keyboard Next to the same-locale Vet route pass. Reduced-motion and no-JS at 320 retain every substantive chapter and a working original-image URL. [Complete metrics](logs/browser.json). Dense product screenshot text retains its genuine source treatment; the source/zoom remains available for inspection.

## Checks and reproduction

| Check | Result |
|---|---|
| `npm run check` | 0 errors, 0 warnings; 163 existing hints. [Log](logs/astro.log) |
| `npm run build` | 37 static pages, successful. [Log](logs/build.log) |
| `npm run check:content` | PASS, 0 findings across copy/CV/public and built HTML. [Log](logs/content.log) |
| `npm run check:css -- /work/learn/ /ru/work/learn/` | 0 dead scoped rules on both Learn routes and default checker routes. [Log](logs/css.log) |
| Corrected production captures | 4 BEFORE + 4 AFTER at 1440/390; 4 further AFTER at 320/360. Exit 0. [BEFORE log](logs/before-capture.log) · [AFTER log](logs/after-capture.log) · [Responsive log](logs/responsive-capture.log) |
| Focused browser verification | 8 normal-motion combinations, 48 source zooms, 40 anchors, 2 delayed/reload/toggle lifecycles, 4 fallback controls and checker fixtures. Exit 0. [Log](logs/browser.log) |
| Preservation | No changes under `src/`, `public/`, `ds/` or `research/`; original pack retained except corrected capture script; all 32 source hashes match. [Integrity](logs/integrity.json) |

From the existing review worktree, serve unchanged baseline `dist` on 4428 and rebuilt current `dist` on 4429. Existing Playwright runtime is used; no application dependency was added.

```powershell
$env:PW='file:///D:/Claude-projects/b2b-dssl/node_modules/playwright-core/index.mjs'
node audit/trassir-learn-portfolio-premium-v3/capture.mjs before http://127.0.0.1:4428
node audit/trassir-learn-portfolio-premium-v3/capture.mjs after http://127.0.0.1:4429
node audit/trassir-learn-portfolio-premium-v3/capture.mjs after http://127.0.0.1:4429 responsive
node audit/trassir-learn-portfolio-premium-v3/v3.1/verify.mjs
node audit/trassir-learn-portfolio-premium-v3/v3.1/compare.mjs
node audit/trassir-learn-portfolio-premium-v3/v3.1/integrity.mjs
```

The diagnostic legacy race can also be sampled with `v3.1/diagnose.mjs`; its occurrence depends on initialization timing, so not every run is expected to reproduce partial opacity. Capture/browser logs establish the new endpoint checks, rather than an arbitrary longer timeout.

Remaining request: independent visual acceptance of the linked corrected evidence. Browser scope is Chromium; this pass does not claim a new multi-browser or full screen-reader audit.
