# Independent visual acceptance — Homepage Premium V3.1

**Date:** 2026-11-01  
**Implementation:** `codex/homepage-premium-v3.1-2026-11-01`, commit `43eb0b29372c50af616c71deed3139017adaf705`.  
**Reviewer verdict: ACCEPTED WITH BACKLOG.**

## Basis, not self-approval

Reviewed actual V3.1 `screenshots/before` and `screenshots/after` images at EN/RU 360, 390, 1024, 1440; first-fold scenes, Agent card; direct protected Pawly before/after EN 390 and RU 390; evidence report and source patch; authentic saved reference comparisons with Garri, HA and Dounar. Also visually reviewed the EN390 full-page screenshot; the full EN1440 PNG was too large for the connected file extraction, but 1440 first-viewport image, Agent section evidence and predecessor V3 full individual-section captures were visually examined. Did not independently rerun browser tests or visit production on a physical device. No fresh external reference capture is claimed.

Sources:
- [V3.1 REPORT](../REPORT.md)
- [V3.1 reference comparisons](../REFERENCE-PAIRS.md)
- [V3.1 EN360 first](../screenshots/after/en-360-first.png) / [RU360 first](../screenshots/after/ru-360-first.png)
- [V3.1 EN390 first](../screenshots/after/en-390-first.png) / [RU390 first](../screenshots/after/ru-390-first.png)
- [V3.1 RU1024 first](../screenshots/after/ru-1024-first.png)
- [V3.1 EN1440 first](../screenshots/after/en-1440-first.png)
- [Pawly protected-card comparison](../logs/protected-covers.json)

## Acceptance: what materially changed and now passes

### Mobile first fold — P0 fixed
EN360 visible native image grows 17.6 → **116px**; EN390 61.6 → **160px**. RU360 grows 11.7 → **136px**, RU390 118.4 → **217px**. More importantly, the actual native heading + the $120 credit are identifiable within the first viewport, not a dark sliver. No fabricated hero preview, changed product screenshot, tiny H1 or hidden user identity. In the full mobile sequence, Agent becomes readable and stays linked to its complete case.

### Hero CTA — P1 fixed
New selected-work link is a visually unmistakable accent primary with directional arrow; CV and email are secondary, aligned on one stable row, with the selectable email text underneath. The last version's dangling CV arrow and competing red actions no longer occur in inspected mobile screenshots. At 1440 the actions are intentionally aligned within supporting copy. The existing EN authorization text remains and must be verified for freshness separately before publishing.

### 1024 RU — P1 fixed
Agent financial impact and customer message now occupy a wide native stage at 806px, instead of the former ~421px reduced scene. The explanatory story moves underneath, so product evidence is more readable. Desktop 1440 retains the approved art direction and original two-column screen relationship.

### Protected work / implementation
Pawly source unchanged as mandated: direct before/after EN390 image check found no visual redesign; submitted 32 automated comparisons report identical DOM, chosen styles, sources, alts and routes for Portal/Learn/Vet/Pawly across EN/RU x 4 sizes. Raw PNG differences at some sizes are recognized as fractional document-position raster shifts, not hidden. No public media or case-page redesign. Submitted browser build/check, 54 browser assertions, 16 responsive checks, eight axe scans and regression/route tests passed per logs; not independently executed here.

## Premium benchmark verdict (not false equivalence)

- **Garri:** Comparable strength in readable headline hierarchy and one consequential product action. The portfolio has fewer expressive visual flourishes and a heavier type treatment; it is not pixel/style equivalent. Appropriate to a credible B2B designer home.
- **HA:** The source image and storytelling are much more restrained than HA's huge 3D hardware cover; here real unaltered B2B UI is preferable to theatrical but inaccurate device mockups. V3.1 now gives substantive native proof immediately on mobile.
- **Dounar:** Better first-work information and visible UI than V3; honest, brief case positioning. The source reference is a case opener rather than the same type of homepage, so no claim of identical composition.
- **Blinkov/Victor:** no direct captured pixel parity this run; not verified.

**Independent answer:** The homepage now meets the selected **premium editorial / product-proof standard** for a B2B Product Designer / Design Engineer portfolio at the validated viewports and languages. This is a deliberately restrained premium design, not an assertion that every block exceeds the cinematic art direction of all references. The three V3.1 acceptance blockers are resolved; another full-home redesign is not warranted.

## Accepted with backlog — NOT additional conditions to reopen V3.1

1. **Vet Clinic Home media:** current three-screen mobile preview is extremely long and repeats patient context; swap to a concise and stronger true recent accepted visit/clinical decision capture only once the veterinary product's independent acceptance and SHA are verified. This is the most meaningful remaining image improvement.
2. **Pawly:** untouched intentionally; refresh its preview/story only after its latest screens and case narrative are independently accepted. Not part of V3.1.
3. **Inherited navigation startup shift:** measured CLS 0.07722 in the delayed-image synthetic check, unchanged before/after. Address in separate focused performance ticket; do not recode whole navbar as a homepage design revision.
4. **Source/public copy and device evidence:** confirm publicly claimed work location/relocation availability is still true; independent physical Safari/Firefox/mobile touch and field Core Web Vitals remain unverified.
5. **Further visual distinction is optional:** future separate visual-polish batch may differentiate the four work sections more, but do not undo clear meaningful UI or introduce copied ornamental devices. There is no blocker requiring V3.2.

## Control / release

**Design verdict ONLY**. Do **not** interpret ACCEPTED WITH BACKLOG as permission for an automatic merge to `main`, production deploy, Figma edits, or changes to other product repos. Owner explicitly controls those steps. Research and reviewer files are in an isolated `review/` branch; application changes remain on `codex/homepage-premium-v3.1-2026-11-01`.

The portfolio homepage acceptance is separate from accepting the Vet/Pawly product screens and separate from synchronizing their case-page media.
