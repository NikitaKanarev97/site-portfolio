# Vet Clinic OS — case V2 composition

Authorised by the 1 November 2026 implementation brief. Both public locales share `vet/VetCase.astro`; copy is separate, media comes from `src/data/vet-v2-media.json`. No common renderer/token/motion changes.

1. Hero on existing `surface-cover-vet`: Onest title and promise, full current Visit Record. Mobile uses real 390px context detail, complete record linked separately. No device shell, overlays or collage.
2. Problem: quiet split text and one editorial constraint. Thirty seconds is not a result.
3. Roles: ordered three-column responsibility diagram, top rules and explicit output/privacy descriptions. Mobile is one ordered column. No nested cards.
4. Clinical: native calculation-review panels on desktop and mobile, with the complete input workspace linked for inspection. Formula, rounding, source and limitation remain visible. Visit Record is already the hero evidence; no duplicate gallery.
5. Handoff: invoice → publication preview → published owner plan. Each output has a different purpose. Owner desktop/mobile frames provide a genuine responsive comparison. Text has `flow-group` clearance from evidence.
6. States: clinical-only note, blocked publication, unavailable prescription. Complete native components, useful native widths and full source inspection. Mobile stacks them; no screenshot is squeezed into a decorative phone.
7. Outcome: implemented three-role flows and explicit information/state boundaries; measured impact is not claimed. Shared TextLink product CTA and CaseNext to Pawly.

Catalog: `VetCase`, `VetShot`, `VetHome` are case-scoped compositions of MetaList, CaseScreen/MediaZoom, TextLink and CaseNext. Existing semantic typography/surface/focus/spacing roles only. Captured geometry is documentary data. Images use natural height and a native CSS-width ceiling, not CSS cropping or fixed aspect-ratio boxes. Mobile source switches below bp-lg so tablet UI text remains readable; owner comparison uses genuine 390px screen.

Accessibility: one h1; sections labelled by h2; ordered responsibility diagram; descriptive localized alt/aria; native links with focus rings; existing zoom Escape/focus restoration; no new motion. Only registered `lines`, `fade`, `fade-image` attributes. No-JS sources remain plain links. EN/RU structural/media parity asserted at build time.
