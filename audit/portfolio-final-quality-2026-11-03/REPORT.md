# Portfolio Final Quality V1 · independent review handoff

**READY FOR INDEPENDENT REVIEW**

3 November 2026. Branch: `codex/portfolio-final-quality-2026-11-03`.
Tested implementation: **`c4192c42728d4c937092cb0a7fc25b047af72624`**.
Integrated BEFORE: `949255834395046e7681fefa5a97ed6e7ae50a04`.
The evidence publication commit is the branch HEAD reported in the final handoff;
its application source is identical to the implementation commit above.

No merge to main, production deployment, Figma change, product-repository edit or
self-approval. Independent review owns the premium-quality and release verdict.

## What changed and why

1. Integrated the intended Home/cover revisions and all five latest cases into one
   reproducible worktree. Old main was not used as a substitute. [Source SHAs and
   conflict decisions](BASELINE.md).
2. Fixed late JS re-hiding readable fallback content. On Home, Agent and Learn,
   BEFORE samples show7/10/10 frames with renewed hiding; identical delayed-network
   AFTER tests show0/0/0. Native scroll, existing choreography and tokens remain.
3. Shared keyboard traversal between MediaZoom and ProjectDialog, including WebKit's
   link-skipping policy. Added explicit project-dialog listener teardown.
4. Preserved accessible SplitText content: generic spans keep readable descendants,
   real headings keep one whole label. Removed the invalid group role from language li.
5. Applied the existing16 px media radius to Agent's captured outer canvas, preserving
   native inner UI. Fixed two specific RU tablet heading overflows with the accepted
   Agent word-boundary technique, shared as a text-only helper.
6. Fixed small-text contrast using existing semantic colors: light CaseNext labels,
   Portal captions and sequence indices. Shortened five Portal captions to the
   existing harmony ceiling without changing dates, prices or product consequences.

Full [findings/resolutions](FINDINGS.md), [surface matrix](CONSISTENCY-MATRIX.md),
[motion inventory](MOTION-INVENTORY.md), [live research](RESEARCH.md),
[benchmark decisions](MOTION-BENCHMARK.md). Start visual review in [the gallery](index.html).

## What was observed and what was preserved

Live Chromium recordings cover Blinkov's entrance/cards, Malugin's project→Smartcat,
Repponen's overview→M+ portfolio anchor, HA's horizontal scene and Dounar's MyTeam
reading flow. Blinkov's case was password-protected; hidden content was not inspected.
Recorded frame sequences, runtime timings and limitations are in RESEARCH.md.
No competitor motion was inferred from screenshots alone.

The transferable pattern is immediate orientation and readable real work. Existing
normal motion is retained; the concrete late-arrival defect is fixed at lifecycle
level. Lenis was not installed: no installed skill or measured benefit justified a
second scroll controller. This is not a claim of a Lenis A/B test.

Pawly V2.1.2 code, copy, manifests, screenshots and internal fields remain unchanged.
Accepted case structures, Home composition, product screenshots, source pixel colors,
TextLink SVG alignment, type scale, motion timings and native device/alpha contours
remain. No invented metrics, new project features or arbitrary hero redesign.

The six main pages now follow the documented surface-role system while keeping
their individual narratives. Matched evidence supports consistency; whether the
result reaches the requested premium benchmark is the independent reviewer's judgment.

## Verification scope

Actual routes: `/`, `/ru/`, `/about/`, `/ru/about/`, the five `/work/` case routes
and all five corresponding `/ru/work/` routes. Widths 1440/1280/1024/768/390/360/320,
short 1440×600 and a 720×450 DPR2 desktop reflow equivalent of 200% in 1440×900.
Toolbar zoom and physical-device behavior are not claimed.

| Check | Result / evidence |
|---|---|
| Astro check / production build |0 errors,0 warnings,163 existing hints;37 static pages. [Exit codes](logs/check-exits.json), [check](logs/check.log), [build](logs/build.log) |
| Public content |0 findings across copy/CV/public/built HTML. [Log](logs/content.log) |
| Scoped CSS |0 dead rules including all 14public routes. [Log](logs/css.log) |
| Harmony |0 violations on14 routes×1440/390 after five caption corrections. [Log](logs/harmony.log) |
| DS mirrors |Tokens and motion are byte-identical; no token values changed. [Integrity](logs/preservation.json) |
| Chromium responsive |98/98 after geometry fixes; final contrast/caption follow-up 28/28. [Full matrix](logs/after-chromium-matrix.json), [follow-up](logs/final-chromium-matrix.json) |
| WebKit responsive |42/42 at 1440/390/320; final focused 12/12. [Matrix](logs/after-webkit-matrix.json), [follow-up](logs/final-webkit-matrix.json) |
| Functional interactions |1018/1018: all visible zoom sources, source parity, keyboard containment/return, details, anchors, next/history, locale navigation, copy success/denial, project dialog, no-JS and blocked-bundle fallbacks. [Results](logs/after-chromium-interactions.json) |
| Final normal-motion smoke |Chromium 138/138 and WebKit 128/128, including final dialog traversal, mobile menu, next links, preference changes and runtime checks. Chromium includes open-menu/dialog axe checks. [Chromium](logs/chromium-smoke.json), [WebKit](logs/webkit-smoke.json) |
| Touch input |32/32 real emulated taps at360/390 in both locales: menu, copy feedback, project dialog, case entry, zoom/close,48px menu/close targets. [Results](logs/touch.json) |
| Automated accessibility |28/28 EN/RU desktop/mobile scans with0 WCAG A/AA violations found; incomplete/manual checks remain review tasks. [Full axe data](logs/accessibility.json) |
| Supplemental |218/218 checks: short/reflow geometry, rapid/interrupted navigation, preference during navigation, tab return,404, internal URLs, real PDF downloads. [Results](logs/supplemental.json) |
| Motion lifecycle / fonts |44/44: dev debug finds 0 duplicate scenes after preference/resize/navigation; delayed fonts retain visible content on all 14 routes. [Results](logs/lifecycle.json) |
| Motion recordings |Normal-motion Home/Agent/Learn entry/scroll/zoom and paired late-bundle recordings. [Before](motion-before/), [after](motion-after/), [late samples](logs/late-bundle-after.json) |
| Actual external navigation |Linked demos/Webflow sites loaded; LinkedIn returned 999 to automation. [Destinations](logs/destinations.json) |

The full responsive/functional suites ran after the first implementation. The last
contrast/caption changes received the focused responsive follow-up and full axe
matrix. The final runtime-only SplitText/WebKit changes received the 138/128 normal-
motion browser suites, fresh build/check and final motion recordings. The logs
retain each wave; counts are not presented as one simultaneous Cartesian run.

Reduced-motion visual pairs use the same language, viewport, DPR, route, scroll
position and interaction state. Normal-motion evidence is separately labelled;
no opacity override or forced GSAP completion is used to create a passing image.
Some screenshots settle by triggering once-only reveals through natural scrolling.
The capture harness checks observable endpoints and image decoding.

## Performance

Chrome CDP lab: cold contexts at 390×844, 150 ms latency, 1.6 Mbps download, 4× CPU
throttling. Native lazy loading is preserved; screenshot readiness helpers are not
used to force-load the whole page. A preliminary eager-load probe is explicitly
archived separately and excluded from the table below.

| Route | LCP | CLS | Entry long tasks / total | Maximum synthetic event | rAF p95 |
|---|---:|---:|---:|---:|---:|
| Home EN |2184 ms |0.0772 |4 /802 ms |No qualifying event |16.6 ms |
| Agent Ops EN |1208 ms |0 |4 /958 ms |88 ms |16.6 ms |
| Learn EN |1028 ms |0 |4 /782 ms |80 ms |16.6 ms |
| Pawly EN |1636 ms |0.0772 |4 /678 ms |88 ms |16.6 ms |

[Raw performance data](logs/performance.json), compressed real CDP traces
`logs/*-mobile-trace.json.gz`. These LCP/CLS samples are within 2.5 s / 0.1, but they
are single local lab observations. Entry has 4 long tasks per page under 4× CPU;
sampled sessions have 4–6 frames above 50 ms. This is not a guarantee of constant
frame rate on physical mobile hardware. Event Timing values describe the scripted
scroll/zoom session; they are **not field INP**. Home had no qualifying interaction.

All emitted JS bundles total 171,835 bytes raw / 66,422 bytes gzip; the Astro/GSAP main
bundle and existing component scripts remain the runtime. No package was added.
[Per-bundle sizes](logs/javascript-weight.json). No matched BEFORE lab run supports
a numerical performance-improvement claim.

Lighthouse uses its default simulated mobile throttling, separate from the applied
CDP network/CPU trace above. The final reports show performance 95 (Home EN), 94 (Home
RU), 98 (Agent mobile); accessibility/best practices/SEO are 100 in those runs. Home
LCP is 2.545 s EN / 2.661 s RU, CLS 0.079, TBT 0; Agent LCP 2.079 s, CLS 0, TBT 11 ms.
Home's marginally-above 2.5 s simulated LCP is a concrete non-blocking follow-up, not
hidden behind the 95 score. The LCP node is the editorial hero paragraph; no observed
regression justified changing the accepted entrance just to optimize one lab score.
Desktop Home scored 100/100/100/100. Raw Lighthouse reports and exact metrics are in `logs/lighthouse-*.json`.

## Limits and remaining backlog

- Firefox executable is absent; launch failure is recorded in
  [the environment log](logs/after-firefox-unavailable.json). Chromium and WebKit
  are real browser engines. No physical iOS/Android or screen-reader session.
- The 200% check is equivalent reflow, not a claim of manipulating browser toolbar zoom.
- LinkedIn blocks automated access with 999; URL correctness is visible, but a human
  can verify the actual profile. All other recorded linked destinations loaded 200.
- Existing Astro hints remain. Raster UI text/contrast is documentary evidence,
  not covered by DOM axe. Existing media/CV content was preserved; no new full OCR
  campaign or fabricated source-image validation is claimed.
- Dependency maintenance remains a separate concrete item: npm reports 15 advisories
  (1 critical, 10 high, 3 moderate, 1 low) in the unchanged lockfile. The critical
  [Astro/Sharp AVIF advisory](https://github.com/advisories/GHSA-26w7-cxv4-gfx2)
  requires processing attacker-supplied AVIF. This is a static build with local,
  trusted images and no public optimizer/SSR adapter; no such input path was found.
  That is a scope-based exposure assessment, not a claim that the dependencies are
  patched. Upgrade planning and a separate build-toolchain review remain before
  introducing untrusted media/SSR. [Audit output](logs/npm-audit.json).
- Laboratory results are environment-specific. No matched BEFORE performance run
  supports a numerical speedup claim; no field INP was measured.

The remaining request is independent visual/interaction review of this exact branch
and evidence, followed by the reviewer's acceptance decision. This handoff does not
declare the site accepted or production-ready.
