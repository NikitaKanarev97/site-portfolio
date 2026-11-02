# Reference map

Every reference below was opened as an actual saved file in this repository before the
composition was decided. No third-party image was added to `public/`. The V2 SaaS captures
(Linear, Ramp, Stripe, Attio) were removed from the tracked tree in V2.1; they were **not**
re-opened as images in this pass — only the recorded observations in
`audit/b2b-case-v2/references/REFERENCES.md` were used, and they are marked as such.

| ID | Reference file | Observed pattern (from the image) | Applied to | What was adapted, not copied |
|---|---|---|---|---|
| R1 | `research/portfolio-benchmark/case-blueprint/img/dn-diag.jpg` | "Initial UX Diagnosis": symptoms grouped into three named categories above real UI; neighbouring panel "Diagnosis → Redesign" pairs each problem with its fix | 01 Diagnosis | Our pairs are *Observed → Direction* per archival frame, under the frame; no red category colouring (the site's palette has no error-red editorial role) |
| R2a | `research/portfolio-rebuild-2026-10-03/references/ha-user-flow.png` | Start bar, rectangles, yes/no diamonds, orthogonal grey arrows, explicit return loops | 02 Architecture | Kept left-to-right reading, quiet connectors, real stage names. **Not** adopted: diamonds and explicit return arrows — the loop is written as a rule inside Cart (gap, see REPORT) |
| R2b | `research/portfolio-rebuild-2026-10-03/references/ha-screen-map.png` | Login → Home → product areas as a comb of quiet connectors; blue numbered badges per screen; dashed frames group a screen's functions | 02 Architecture | Quiet connectors and white nodes on a grey field adopted; grouping expressed as three bands under the stages (Product identity / Commercial certainty / Fulfillment). Numbered badges not used: the diagram shows five stages, not a screen inventory |
| R3a | `research/portfolio-rebuild-2026-10-03/references/ha-component-library.png` | Type table, palette swatches with hex, dashed frames per family, real states stacked | 07 Design system | Palette with real hex values read from the product build; type scale compressed to one line (Inter is not loaded on the portfolio, so it is listed, not faked); families as labelled rows; no dashed purple frames |
| R3b | `research/portfolio-benchmark/case-blueprint/img/ha-components.jpg` | The same library as published inside the HA case page: one grey plate within site margins; at page scale most component text is no longer readable | 07 Design system | Taken as the counter-example: our states are shown at near-native size in labelled rows (FileUpload and FulfillmentPlan three-across, native horizontal scroll on phones) instead of one shrunken board |
| R4 | `research/portfolio-benchmark/case-blueprint/img/dn-head.jpg` | Centred title + one-line proposition + a single facts row (Client, Timeline, Industry, Team, Outcome, Challenge) before one product plate | Hero | Kept the asymmetric Portal hero; added role and shipped/rebuild status inside the first viewport instead of a centred metadata block |
| R5 | `audit/b2b-case-v2/references/REFERENCES.md` (recorded text only) | Linear: one dominant surface. Ramp: one procurement object per module. Stripe: excerpts on restrained plates. Attio: whole product context, controlled framing | Hero, 04, 05, 06 | Unchanged principles from V2; not re-verified visually in this pass |
| R6 | `research/portfolio-benchmark/case-blueprint/img/gr-thesis.jpg` | Small uppercase label in the left column, a large statement thesis on the right, quieter support paragraph below | Section heads, 03, 08 | Existing split head (label │ thesis + body) kept |

Comparison boards (reference │ BEFORE │ AFTER) are in [comparisons/](comparisons/).
