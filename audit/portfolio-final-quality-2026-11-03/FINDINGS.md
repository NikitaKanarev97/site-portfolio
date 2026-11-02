# Prioritized findings

| ID / priority | Before / evidence | Resolution | Verification |
|---|---|---|---|
| F01 · P0 | Main omitted recent accepted-case work; testing main would compare obsolete pages | Isolated integration of exact intended revisions, conservative route/DS/Home conflict resolution | BASELINE.md; source byte comparisons; served HTML identity guard |
| F02 · P0 | Static fallback became visible ~2.1s after navigation; delayed bundle at ~6.5s then hid it again | Existing initPage settled branch also owns pages whose `.js` class was already released | Three real matched delayed-bundle recordings; BEFORE regression samples 7/10/10, AFTER 0/0/0 |
| F03 · P1 | Chromium's native dialog Tab sequence included body after last control | Shared visible-control boundary helper for MediaZoom and ProjectDialog; explicit abort/teardown for project dialogs | `native-dialog-focus-before.json`; every visible source zoom, Tab/Shift+Tab, Escape and return in interaction suite |
| F04 · P1 | Learn RU completion-rule heading at 768: 339px content in 312px column; Vet RU clinical thesis at 1024: 349px in 333px | Share existing accepted Agent word-break helper at those exact locations | Full responsive matrix, matched tablet detail evidence; no type/copy change |
| F05 · P1 | Agent screenshot canvases square beside equivalent16 px media boundaries | One radius-media clip at captured canvas edge | Matched hero/checkpoint and mobile evidence; unchanged media/full-source zoom |
| F06 · P1 | Language li had role=group, overriding listitem; axe list error on non-Home desktop pages and open mobile list | Remove overriding role; retain native li and existing language label | Final axe scan and mobile-menu verification; visual layout preserved |
| F07 · P1 | Next-case small label: #D43220 on Portal #F3E6AE =3.91:1 | Light-scene label uses existing text-subtle; hover/press/underline/arrow retain their roles | Matched ending capture and final axe scan |
| F08 · P1 | Portal captions and four line indices: #6E6E67 on #EFEFEC =4.45:1 | Existing text-subtle at the two shared caption/index selectors | Final axe scan; no source UI recoloring |
| F09 · P2 | Existing harmony command found five Portal captions beyond12 words | Shorter EN/RU captions retain current purchase, counted scope, source dates/prices and consolidation delay | Final content/harmony commands; screenshots retain complete native content |
| F10 · P1 | Normal-motion SplitText put aria-label on generic hero spans and hid their descendant line text | Only actual headings use auto whole labels; generic spans retain accessible line text | Normal-motion open-menu/zoom/project axe checks in both locales |

## Preserved / deliberate decisions

- No redesign of Home, heroes, case order, story sections, product themes or source screenshots.
- Pawly V2.1.2 components, media data, copy and measured internal breathing room unchanged.
- Native screen/device/alpha contours remain legitimate exceptions. No blanket16 px crop of UI.
- Existing TextLink SVG alignment, typography, accepted source captures and all product behavior retained.
- Native scrolling retained; no Lenis install, new animation primitive, cursor effect or extra pinning.
- Timing/easing tokens unchanged. Late delivery is fixed at lifecycle level, not by hiding evidence or disabling normal motion in captures.
- No merge to main, production deployment, Figma or product-repository edits; no self-approval.

## Limits / backlog

Firefox is unavailable in the installed Playwright cache; no claim of Firefox verification.
Physical iOS/Android and real assistive-technology sessions were not available.
LinkedIn returns999 to automated Chromium; the intended profile URL is present but
its authenticated/human destination cannot be verified by this run.
200% checks use a DPR2 desktop reflow equivalent; browser toolbar zoom is not claimed.
Existing 163 Astro hints remain. Field INP/CWV and production traffic are not measured
by local lab runs. Performance values and remaining concrete risks are in REPORT.md.

Dependency audit:15 inherited advisories, including the Astro/Sharp AVIF critical
advisory. No attacker-controlled AVIF processing path was found in this static,
local-media build; no claim of patched dependencies is made. This remains a
separate toolchain maintenance/review item, with primary advisory and full audit
linked from REPORT.md. Simulated Lighthouse Home LCP 2.545/2.661 s is also retained
as a measurable, non-blocking performance follow-up.

Original failed harness probes are retained where informative. Initial locale
selection assumed hreflang on navigation links; actual navigation uses visible EN/RU
links. The mobile focus region includes its close trigger in the Navbar root. Those
test-assumption corrections are not presented as product defects.
The first targeted capture retry also used a missing `final/` output directory;
the eight affected captures were rerun into `after/`. The final28-result matrix
combines the 20 valid numeric checks with those 8 fresh captures; provenance is in
`logs/final-matrix-summary.json`. No product failure was suppressed.
