# 05 · Art-direction geometry, media plan and states

These are **starting composition ranges for implementation**, not pretended measurements of live production. Use the existing tokens and compare fresh browser captures; adjust actual values to preserve legibility, editorial rhythm and responsive correctness.

## Design identity — do not restyle without evidence
- Existing paper whites #FFFFFF / #F7F7F5 and deep ink #1B1B18 / #0D0D0B; strong link accent #D43220. Keep warm neutral mood and product-owned cover colors.
- Site is typography-led, not SaaS dashboard chrome. Avoid repeated borders, glowing gradients, badges, needless pills, stock illustrations and generic AI hero devices.
- Header keeps NK mark and simple links. Do not make navigation sticky without measurable use case.
- Never reduce accessible type below the existing DS just to make hero fit. Preserve line-height and optical spacing.
- One hero proposition; one primary work-action; CV/email remain discoverable. Explanatory microcopy must add specifics rather than repeat the headline.

## Desktop 1440 target (initial art-direction boundaries)
- Grid: max content around 1280px, roughly 80px outside margins at 1440; re-use ds-container rather than duplicate grid CSS.
- Nav 70–90px; identity row visually quiet, display 2 lines with controlled line width; all else subordinate.
- In first ~550–640px: title and concise byline/specialization/actions/portrait; transition to first case begins around ~610–750px. Target **recognizable authentic work pixels on 1440×900**. If not feasible while preserving elegance, record trade-off with B split proof alternative, do not hack by shrinking text.
- First native Agent stage width: large enough that selected decision UI is identifiable without zoom. A deep crop with meaningful text beats a broad overview of microscopic widgets.
- Subsequent case stage: let each source product define its design field, but keep consistent **outside alignment and editorial sequence**.

## Mobile 390/360 target
- Layout padding ~24px, 1-column and no horizontal overflow; no 2-column dashboard gallery or thumb strip before first work.
- Keep headline strong, likely 32–42px depending existing tokens and RU wrapping; do not arbitrarily override design system tokens in many places.
- Current portrait + five-item link menu is too tall to be the entire first mobile fold: try a compact 64–96px portrait in an author byline and move work index into the actual Selected work section.
- Sequence: person/role → thesis → specific one-line description → clear work entry → authentic mobile case preview. CV/email can sit near copy but must not be hidden only in menu.
- Image should be a genuine 390px product capture, preserve meaningful controls; choose important state before crop. At 360px specifically check long RU product names and email copy CTA.
- Desktop 2-column semantic fact layouts **must stack intentionally**, not shrink to 9px text.

## Distinct product stage design
| Project | Visual system and semantics | Target media | Do not |
|---|---|---|---|
| Agent | Slate/warm neutral field + an approval consequence. One eye-catching decision moment | Accepted `AgentHome` real shot, EN/RU/desktop/mobile source | Create fake glass panels or replace product UI |
| Partner Portal | Cool neutral/blue procurement field, source row conflict and choice | Existing `PortalHome` desktop decision + mobile workspace native | Downscale entire 1280 dashboard to 350px |
| Learn | Navy/task-led interface, contrasted immediate answer vs learning progress | Existing `LearnHome` approved V2 source, editorial framing | Too many equally small info cards |
| Vet | Calm sage/clinical clarity, one patient/visit checkpoint | Latest accepted vetted screen only; otherwise preserve current | Use historic Sept screenshot and call it new |
| Pawly | **FROZEN existing sand/pet imagery and screenshot** | Existing WorkStage media exactly as in source | **Modify or crop any Pawly-specific element** |

## Media files / preservation
- Reference images already archived under `research/portfolio-premium-v3-2026-11-01/references/`. Never publish competitors' images as portfolio artwork.
- Screenshots of late-October Agent Ops, B2B, Learn already archived under `research/portfolio-premium-v3-2026-11-01/baseline/`. They are review evidence; prefer **existing accepted /media/rebuild... source mappings** for the current Homepage.
- The 4 candidate covers can be recropped/composed from **actual native app captures** with recorded source SHA, language, role, fixture, viewport, state and image hash. Do not redraw application UI in CSS/Figma as if screenshot.
- `VetStage` has historic screenshot evidence in pack, not automatic permission for replacement. Need current source commit and accepted frame.
- Pawly: no new screenshot, media file, new CSS rule in Pawly renderer, change to its title or alt, or route. Generic shared CSS changes must leave its visual/clickable presentation functionally and visually stable. Assert image/crop baseline with actual browser screenshot.
- No external asset fetching at runtime for homepage without explicit need and license checks.

## Motion / affordances
- Keep intro animation restrained: type reveal followed by product stage entering naturally. Single visual emphasis, not 5 hero effects.
- Preserve stage CTA and original-size inspection. No nested click conflict; keyboard, Escape, focus return and reduced-motion should work.
- Use existing animation tokens/strategy; don't add autoplay video unless it materially proves a real product interaction with accessibility fallback.
- Hover signal should feel intentional: small lift or underline, not distort screenshot.
- Mobile menu 44px minimum touch target, existing 48px preference; working work anchor should respect scroll state.
- Keep selected-work content available without JS where possible, normal document scrolling, no scroll-gated case handoff.

## Constraints and no-go areas
- Do not touch source case pages, external product repos, product rules, generated data, case renderer internals except direct homepage preview components if required.
- No integration promises or made-up numbers. No moving Pawly higher, hiding it or replacing its art.
- No merge to main, no production deployment, no Figma. Visual acceptance comes from independent screenshots.
- Avoid large bundle/LCP penalties by eager-loading ONLY truly above-fold imagery; rest lazy. Prefer existing responsive source srcsets, aspect boxes and no layout shifts.
