# Storyboard · V3

Thesis: **From spreadsheet to purchase — without losing control of the decisions.**
Reading order follows one procurement object, not a screen catalogue:
legacy diagnosis → architecture → one ambiguous source line → product and price →
commercial certainty → fulfillment → design system → ownership → outcome.

| # | Beat | One idea | Desktop composition | Phone composition | Evidence |
|---|---|---|---|---|---|
| 0 | Hero | B2B buying starts from a specification | Title left, promise + sole-designer line right, shipped-vs-rebuild note under the title; real Resolution Center workspace + price-change inset | One complete 390 workspace capture; inset hidden | `workspace-*` 6bbe1cd, `change-detail-390` c899933 |
| — | Facts | Role · Period · Shipped · Prototype | one row | 2×2 | owner facts |
| 01 | Diagnosis | The portal greeted buyers like a shop | Archival frame (8 col, zoomable) │ Observed → Direction (4 col), ×2; built Dashboard plate offset 3 col | stacked; archival frames open full size | `legacy-dashboard.webp`, `legacy-cart-alternative.webp` (new crop), `dashboard-*` |
| 02 | Architecture | Different ways in, one specification, one resolver | HTML diagram, 4 stages with quiet connectors + three certainty bands | Vertical stage list with vertical connectors, same text | editorial diagram from sitemap + XLS-to-order flow |
| 03 | Source line | The system proposes, the buyer decides | One plate, four rows: stage text (3 col) │ real capture (9 col) | Same four stages stacked, native 390 captures | row 19 at 36be1d8, one session |
| 04 | Product and price | Identity ≠ price ≠ stock | Plate 8 col + three distinctions | stacked | `product-*` |
| 05 | Commercial review | Uncertainty must never look like a price | Cool band; numbered chain (3 col each); native line + bar | stacked chain, native 390 modules | `commerce-sheet-*`, `cartbar-*` |
| 06 | Fulfillment | Same goods, three plans | Five compared dimensions as chips; full-width comparison | native 390 comparison stack | `fulfillment-*` |
| 07 | Design system | Complex states designed once | Foundation strip (8 semantic colours with values, type scale); ResolutionRow (name left, 4 states right); FileUpload 3-across; Availability (name left, 3 states); FulfillmentPlan 3-across | ResolutionRow native 390 cards; FileUpload and FulfillmentPlan as native horizontal scrollers | real queue rows 36be1d8; Storybook 36be1d8 |
| 08 | Process | One designer from old screens to working system | Four steps with their artifact paths | stacked | product repo files |
| 09 | Outcome | Shipped / Shown / Owned kept apart | Thesis left, three evidence items right; three costs; unchanged CTA | stacked | owner facts |
| — | Next case | shared `CaseNext` | unchanged | unchanged | — |

Rejected options: a pinned/scroll-jacked line scene (prefers a readable static sequence —
four stages of very different heights would jump); a single shrunken component board (the
HA case page itself loses readability at page scale); stitching a Cart price change onto
row 19 (the delta exists in code for that SKU, but it was not shown in the recorded session,
so it is not presented as part of the journey).
