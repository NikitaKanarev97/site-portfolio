# Existing motion inventory and disposition

Source: `ds/motion.js`, mirrored JS/CSS tokens, `animations.js`, shared and dedicated
case components. One orchestrator plus the accepted Agent reading helper; no Lenis.

| Pattern / trigger | Timing and implementation | Purpose | Audit / disposition |
|---|---|---|---|
| H1/section `reveal-text` | SplitText lines, 600ms power3.out, 80ms stagger, padded line masks, autoSplit | Typographic hierarchy | Visual behavior retained; generic spans keep accessible text instead of prohibited aria-label. Fonts/resize/reduce/no-JS/lifecycle tested |
| Editorial `lines` | 640ms custom .645,.05,.355,1, 40ms stagger | Case thesis | Retained; no paragraph-by-paragraph mask expansion |
| `fade` | 400ms power3.out, CSS initial opacity scoped under `.js` | Quiet text hierarchy | Retained; late-bundle regression corrected globally |
| `rise` | 400ms, 12px, grouped stagger | Lists/material grouping | Retained; content remains available without JS/reduce |
| `reveal-media` | 700ms expo.out, clip inset and optional scale1.06→1 | Media disclosure | Existing mode retained; no new use added |
| `fade-image` | 1s power3.out, y24→0, opacity | Native screenshot entrance | Retained; no late replay after static fallback |
| Intro container | fonts.ready or 800ms ceiling + rAF, explicit positions or 80ms steps | Title → supporting material | Rapid gesture skip exists for 900ms; no duration rewrite. Cold/warm/slow/blocked paths tested |
| Scroll reveals | top85%, once, grouped by movement; responsive diagrams rebuilt by media query | Reading sequence | Retained; forward/reverse/resize and complete visibility checked |
| Cover proof/interlock | 1s proof or 1.25s editorial interlock, y24/x96/rotation8, gate sequencing | Existing older cover composition | Kept registered; current dedicated case renderers predominantly use simpler native material. No new blanket motion |
| Agent V3 reading | CSS sticky plus one ScrollTrigger, current marker state outside screenshot | Explain request → consequence → decision | Retained; mobile/short/reduce/no-JS natural list; reversible state; no pin/spacer/scrub |
| Legacy focus/review/pin-swap | Registry-driven state exchange, scrub.25; responsive height gates; geometry observers | Older/kit scenes | Shared code retained; current five V3/V2 routes do not use the older focus-stage. Debug checks cover duplicate cleanup where applicable |
| Sheet | Fitting cover only; scale.98, opacity.65, scrub.3 | Older cover-to-sheet relationship | Retained registered mode, no new scenes |
| Draw/count | 700ms stroke; 1s numeric interpolation | Diagram relation / existing numbers | Retained; no fabricated outcomes or new counters |
| CaseNext marquee | 24s linear, visibility/tab controlled, static in reduce | Existing next-case title | Actual new case endings use the current simple CaseNext title; no marquee added |
| FeaturedCase hover | 160ms semantic CSS, whole preview y−4 and arrow x4, can-hover only | Link affordance | Retained; reduced state has no lift; press/focus colors remain |
| TextLink/buttons/copy | Semantic hover/state/press tokens, aria-live clipboard feedback | Immediate action feedback | Success and denied-clipboard fallback tested |
| Body pageOut/pageIn | 300ms exit/entrance, body y±16 and opacity; clear transform at endpoint | Ordinary navigation | Rapid links/reduce/history/interruptions inspected; no alternate architecture |
| Named case snapshots | Native View Transition snapshots timed from motion.caseTransition | Home→case and next-case continuity | Selected pair only, no body fade over snapshot; reduce/unsupported native navigation retained |
| MediaZoom / ProjectDialog | Native modal, no new decorative animation | Inspect full material | Fixed keyboard boundary and ProjectDialog abort/teardown; no scroll-controller addition |
| Video / clips | Visibility observers, native film controls or explicit loop toggle, codec fallback | Existing real product evidence | Offscreen/tab/reduce behavior inventoried; current V3 case evidence is primarily still media. No new autoplay |

## Lifecycle

`withMotionPreference()` remains the common motion gate. Page teardown kills intro,
reverts splits/matchMedia, kills ScrollTriggers, disconnects scene/video observers
and removes skip listeners. Existing fonts/epoch guards remain. Native body scroll
and browser history keep ownership of restoration. No new timing tokens needed.

The only orchestration change is the fallback guard: if the inline timeout already
removed `.js`, initialization settles before building structural scenes instead of
replaying intro and reveal animations over readable material. Matched videos and
80ms DOM samples are in `logs/late-bundle-*.json` and `motion-*/late-*`.

`logs/*interactions.json`, matrix logs and the lifecycle/stress results name the
actual scenarios covered. Registered legacy modes are not presented as observed
on routes that do not instantiate them. Physical iOS/Android and Firefox limits are
reported separately; emulation is not a physical-device test.
