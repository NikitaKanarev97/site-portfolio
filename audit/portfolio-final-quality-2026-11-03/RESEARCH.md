# Live motion research · 3 November 2026

Started from the repository's `research/portfolio-benchmark/README.md`,
`references-detailed.md`, October frame archives and the current case-specific
Reference Maps. Those are historical references, not evidence of today's runtime.
Fresh Chromium recordings and timed screenshots are under `references/`.

Five useful sites were visited live: Blinkov, Malugin, Repponen, HA and Dounar.
All loaded with HTTP 200. No password was entered; no access control was bypassed.
Static pages and blocked case content are not described as inspected animations.

## Observed interactions

| Site / exact URL / section | Actual evidence | Timing / movement observed | Why it works / problem addressed | Adapt / do not copy |
|---|---|---|---|---|
| [Anton Blinkov](https://antonblinkov.com/) · entrance, animated proof list, case cards | [Video](references/blinkov/browser.webm), [0ms](references/blinkov/load-0.webp), [180ms](references/blinkov/load-180.webp), [500ms](references/blinkov/load-500.webp), [1800ms](references/blinkov/load-1800.webp), [scroll](references/blinkov/scroll-1250.webp); [case-card video](references/blinkov-case/browser.webm) | Proof statements rotate emphasis/position; media follows the introduction. The inspected card reports a 0.2s box-shadow transition; visual hover samples are 100ms then 500ms later, not a measured GSAP easing. Mobile reduced-motion capture still reports running animation objects | Specific proof and a clear case entry make the author's relevance scannable | Keep our direct project evidence and clear CTA. Do not copy rotating claims, infinite movement or reduced-motion shortcomings |
| [Malugin](https://malugin.me/) · project entry → [Smartcat](https://malugin.me/smartcat) | [Home video](references/malugin/browser.webm), [project video](references/malugin-smartcat/browser.webm), [rest](references/malugin-smartcat/rest.webp), [hover](references/malugin-smartcat/hover-400.webp), [case](references/malugin-smartcat/case.webp), [scroll](references/malugin-smartcat/case-scroll.webp) | Natural vertical scroll; project information is usable without waiting for a theatrical reveal. The inspected card's computed transform remains none, no Web Animations effect reported. This is evidence of restraint, not proof that the site has no JS animation anywhere | Compact orientation and immediate UI evidence reduce the time needed to understand a project | Preserve our editorial labels, native scrolling and visible images. Do not duplicate unrelated project copy, private-use icon glyphs or showreel |
| [Repponen](https://repponen.com/) · editorial overview → [M+ Museum](https://repponen.com/portfolio#m-plus) | [Overview video](references/repponen/browser.webm), [project video](references/repponen-project/browser.webm), [rest](references/repponen-project/rest.webp), [click](references/repponen-project/click-1500.webp), [section](references/repponen-project/section-1.webp), [mobile reduce](references/repponen-project/mobile-reduce.webp) | Project selection navigates to portfolio#anchor; the material remains in a continuous reading flow. Captured at 100, then 500, then 1500ms intervals after click. No measurable Web Animations effect on inspected target; do not infer easing from still frames | Persistent information hierarchy and real materials preserve orientation between overview and project | Keep ordinary links, browser history and clean source media. Do not import dense graphic compositions, decorative 3D marks or the reference's typography |
| [HA Interactive](https://hainteractive.com/) · horizontal work carousel, site navigation | [Video](references/ha/browser.webm), [initial](references/ha/load-1800.webp), [350ms after wheel](references/ha/scroll-350.webp), [1250ms after wheel](references/ha/scroll-1250.webp), [mobile reduce](references/ha/mobile-reduce.webp) | A vertical wheel changes the horizontal colored project scene; oversized repeated project names remain in motion. Navigation target reports a 0.6s color transition. Mobile reduce still reports running animation objects. WordPress's generic title does not mean a failed load: the actual HA portfolio was visible | Strong project identity and gesture feedback work for an agency showcase | Adapt only clear project separation. Do not copy wheel remapping, draggable stage, repeated text or heavy full-screen scenes into this reading-focused portfolio |
| [Ilya Dounar / MyTeam](https://ilyadounar.com/projects/myteam) · long-form project narrative | [Video](references/dounar/browser.webm), [overview](references/dounar/section-0.webp), [diagnosis](references/dounar/section-1.webp), [next section](references/dounar/section-2.webp), [mobile reduce](references/dounar/mobile-reduce.webp) | Real wheel scrolling through overview, diagnosis and structural shift. The recording supports stable staged reading, not a precise reveal duration/easing; no claim of inspected hover or hidden Full Story interaction | Clear section hierarchy connects the problem to concrete structural decisions | Retain each accepted case's story and source evidence. Do not copy the other project's outcomes, metrics or team history |

The page-level Blinkov runtime sample also measured several 2400ms transitions
with cubic-bezier(0.19,1,0.22,1). Their individual targets were not recorded, so
this is not attributed to a specific card or heading. HA's navigation probe
reported a running1000ms linear effect; it does not establish the carousel easing.

## Evidence quality and limits

`references/observations.json`, `details.json` and
`malugin-smartcat/observations.json` preserve requested URLs, destinations, selected
targets, timestamps, runtime observations and errors. Recordings are Playwright
browser videos, not simulations. Screenshot timestamps include screenshot overhead;
filenames such as `click-1500` are wait intervals, not guaranteed absolute time.

Initial automatic discovery sometimes selected a social/logo link, and the first
Malugin detail selector missed its relative href. Those attempts remain honestly
logged. The corrected Malugin/Smartcat capture follows the actual visible project
link. Repponen's corrected link goes to portfolio#m-plus. The HA/work probe clicked
the logo back home: it is **not** evidence of an inspected HA case.

Blinkov's `/tbank` showed a password form after the case-card click. Only its card,
navigation and password destination were observed; no hidden case motion was inspected.
Competitor touch gestures, full keyboard audits, contacts and browser history were
not exhaustively tested. Mobile/reduced snapshots are identified separately.

## Technical references for the decision

Consulted the primary [Lenis repository](https://github.com/darkroomengineering/lenis),
[GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) and
[gsap.matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia/) documentation.
The shipped portfolio keeps native scrolling: the observed reading interactions
do not establish a benefit that would justify a second scroll controller.

Third-party body prose is retained as length/fingerprint metadata rather than copied
into the report dataset. Videos, source URLs, titles, frames and runtime observations
remain intact. The short fingerprints describe the original observed text samples.
