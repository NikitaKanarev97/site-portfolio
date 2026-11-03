# Portfolio navigation surface audit · 3 November 2026

Scope: source-wide search of `surface-cover-agent`, `surface-cover-portal`,
`caseThemes`, the two primitive hex values and inverse-focus hooks in `src/`.
All named files in the request were inspected before editing.

| Use | Classification and result |
|---|---|
| `global.css` group/old/new case-agent and case-portal | Current navigation: all six pseudos now consume the explicit navigation roles. |
| `CaseNext.astro` | Current navigation: `caseNavigationThemes` gives both projects light tone and current surface; existing light text, arrow, hover, active and focus rules apply. |
| `FeaturedCase.astro`, `AgentHome`, `AgentCase` | Current entry/hero: shared Agent role. Removed inverse focus from Home wrappers; ordinary text-default restored on wrapper. |
| `PortalHome`, `PortalCase` | Current entry/hero: shared cool silver-grey navigation role. Context bands, internal product colors and swatches remain documentary. |
| `WorkStage.astro` Home branch | Agent no longer receives inverse focus. Learn keeps it. |
| `WorkStage.astro` legacy cover branch | Portal butter canvas and Agent inverse focus remain appropriate to the unchanged legacy cover. Not used by the published dedicated Agent/Portal heroes. |
| `caseThemes`, `CaseCover.astro` | Legacy/kit/preview cover palette intentionally retained. Changing these globally would recolor those surfaces. |
| `CaseStory.astro` finale | Documentary/legacy dark editorial plate retained; current published routes use the dedicated case renderers. |
| `CaseArtwork.astro` / `MoreCases.astro` | Historical thumbnail palette retained. `MoreCases` is not imported/rendered by current Home; the live five project entries use FeaturedCase. |
| `tokens.css` graphite/butter primitives and `surface-review` | Legitimate retained semantic roles; old hex values are not globally deleted. |
| Product captures, native UI, source manifests and `public/` | No file changes. No recoloring or image reconstruction. |

Motion inspection: Astro selects the named source/destination snapshots in
`astro:before-preparation` and `astro:before-swap`; shared transitions bypass GSAP
body pageOut/pageIn. The browser suite records opacity=1 on body throughout all
84 native transitions. Native duration stays 1s, outgoing 0.3s, incoming 0.7s
after a 0.3s delay, with the existing easing. `withMotionPreference` disables GSAP
page choreography for reduce; CSS disables native snapshot animation. With no
View Transition support Astro fallback still loads readable pages on authored
surfaces. Both motion mirrors are unchanged. The one `animations.js` lifecycle
correction retains Astro's saved history scroll coordinate at before-preparation
and carries it through font/GSAP layout restoration, instead of sampling the
already shifted WebKit viewport. No choreography or timing change. The targeted
trace reproduced 1064→992 before the fix and 1064→1064 afterward, with/without zoom.

Current published Agent/B2B navigation contains no graphite/yellow portfolio
surface reference. Historical preview/kit palettes are intentionally distinct;
this report does not claim those legacy covers were redesigned or visually
revalidated across the full preview catalog.
