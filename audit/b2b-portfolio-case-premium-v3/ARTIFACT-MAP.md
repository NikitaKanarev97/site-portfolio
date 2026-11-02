# Artifact map

Every image on the V3 route, where it comes from and what was done to it. Machine-readable
details (route, commit, element box, SHA-256 of the raw PNG, visible text) are in
`captures/line-manifest.json`, `captures/specimens/manifest.json` and the per-entry fields of
`src/data/partner-portal-v2-media.json`.

## New in V3

### Source line (03) and ResolutionRow specimens (07)

- Product: `b2b-partner-portal` @ `36be1d80277c536b94424ac49aa5ff82662d8ee7`, `vite build`
  served with SPA fallback. Clean product worktree `D:/Claude-projects/sp-b2b-source-ui-v11`;
  the dirty `D:/Claude-projects/b2b-dssl` checkout was not used.
- Seed: the product's own `audit/dashboard-v3/baseline-state.json`, clock frozen at
  2026-10-30 09:00 UTC, reduced motion, DPR 2, viewports 1280×1000 and 390×1400, EN and RU.
- Session for row 19 (`capture-line.mjs`): the six other open lines (27, 34, 38, 41, 44, 46)
  are marked resolved **in the seed**, so the same session can reach the Cart. Row 19 is then
  resolved only through real controls: row button → first radio → Apply → Resolved tab →
  Continue to cart. Recorded: Apply `disabled: true` before the choice, `false` after.
- Stages: `line-source` (collapsed row), `line-open` (panel, nothing chosen — evidence only),
  `line-choose`, `line-confirmed`, `line-cart` (cart line whose text names `source row 19`,
  SKU KX-7608NXI-K2, 2 pcs).
- ResolutionRow specimens `row-ambiguous` (row 44), `row-missing` (row 27), `row-changed`
  (row 34): separate context with the untouched baseline seed.
- Crop boundary: Playwright element screenshot of `[data-slot=resolution-row]` (collapsed),
  `[data-slot=resolution-item][data-row=19]` (expanded shell, V1.1) or
  `[data-slot=cart-line]`. Each element is scrolled to the viewport centre first, because the
  phone layout has a fixed progress bar (an earlier run let it cover row 44; fixed and
  re-verified on all 16 phone frames).
- Pixels: unchanged. WebP lossless re-encode only (`build-media.mjs`).

### Component specimens (07)

- Storybook built from the same 36be1d8 product tree; stories
  `components-domain-{availability,fileupload,fulfillmentplan}--*`. Element screenshot of
  `#storybook-root > *`, DPR 2. English UI on both locale pages (Storybook has no RU overlay);
  disclosed in the section note.
- Availability and FileUpload sources are identical in 6bbe1cd, c899933 and 36be1d8. The only
  FulfillmentPlan difference (c899933) is a `.plan-comparison-row[data-state=selected]` rule;
  the script asserts no such element exists in the captured card stories.
- Colour and type values (`src/data/partner-portal-v3-tokens.json`) are computed custom
  properties of the same Storybook iframe; rendered as swatches and numbers, not as Inter
  text (Inter is not loaded by the portfolio).

### Archival cart (01)

- Source: product repo `pages-default/Корзина.png` (original portal, owner-supplied
  evidence), SHA-256 `b9ef89db12c5e6d5ea70d3a6fe1225195e016a30623d18de2e39851cce308b0a`.
- Crop: `left 97, top 214, width 2160, height 604` (source px), one cart line and its
  "best alternative" block including the AI hint and Replace button. No retouching; the
  source already shows truncated product names and no prices or order numbers.
- Output `public/media/rebuild/partner-portal/v3/legacy-cart-alternative.webp` (q90).

### Architecture diagram (02)

- Type: **editorial diagram**, HTML/CSS, both locales, drawn for this case. Not an original
  2024 artifact and not a workshop photo.
- Sources: product `ia/sitemap.md` (16 MVP screens, three entries), `ia/flows/xls-to-order.mmd`
  and `quick-order.mmd`, decisions D007 (one specification, one resolver, identity-only
  statuses), D010 (Verified / Stale / Not confirmed + separate delta), D029 (delta approved per
  line).
- Simplified: Login, CounterpartySelect, OrderSuccess/Orders/OrderDetails omitted; Catalog →
  ProductDetails → back-to-line path folded into "Catalog & search"; ChangeReview → Resolution
  return loop written as a rule inside Cart instead of drawn.
- Desktop: four stages left to right, connectors as 1 px lines, three certainty bands.
  Phone: same nodes stacked, vertical connectors, no image scaling.

## Reused unchanged

| Key | Commit | Note |
|---|---|---|
| `workspace-1280`, `workspace-top-390` | 6bbe1cd | collapsed queue; V1.1 shell inactive |
| `change-detail-390` | c899933 | |
| `dashboard-1280/390`, `product-1280/390` | 6bbe1cd | |
| `commerce-sheet-*`, `cartbar-*`, `fulfillment-*` | c899933 | |
| `legacy-dashboard.webp` | archival | existing crop of `pages-default/Главная.png` |

No longer used on the route (files kept, registry untouched): `decision-*`, `confirmed-*`,
`unpriced-*`, `change-390`.

## V3.1 · 2 November 2026

Product source for every recaptured frame: `b2b-partner-portal` @
`8cb657922991e7b10556eec9a6ded8621c1ded71` (branch
`review/fulfillment-plan-selection-v31-2026-11-02`), which is `36be1d8` plus one commit
changing only `FulfillmentPlan.tsx`, `FulfillmentPlan.css` and `ds/components.md`.
`c899933` is superseded for the selected rule and not merged. Production build and
Storybook built from that commit; raw PNGs, manifests and SHA-256 in
`v3.1/captures/`. Encoder settings unchanged (lossless WebP), files replaced in place.

| Keys | Source | What changed |
|---|---|---|
| `fulfillment-1280`, `fulfillment-390` (EN/RU) | `v3.1/captures/fulfillment-manifest.json`, same session, seed and clip as V2 | product fix only; RU 1280 frame is 18 px taller because "Доставка без НДС" now wraps (source identical for this screen) |
| `spec-fulfillmentplan-selected` | Storybook 8cb6579 | left stripe removed. The other eight specimens re-shot from the same build are pixel-identical to V3 and were left untouched |
| `line-*`, `row-*` (EN/RU, 1280/390) | `v3.1/captures/line-manifest.json`, one session as in V3 | rounded cards (expanded card at 1280, every card at 390) clipped to the element box + 8 px of product surface; edge uniformity asserted. Square 1280 rows re-encode byte-identical |
| `legacy-cart-alternative.webp` | `pages-default/Корзина.png` (SHA-256 `b9ef89db…308b0a`), `v3.1/archive-crop.json` | crop `99, 220, 2152 × 598` inside the original white panel, replacing `97, 214, 2160 × 604` that took 5 px of page gutter on the right and 1 px on the left and top |

Untouched: every other registry entry (asserted by `scripts/b2b-v31/build-media.mjs`),
`legacy-dashboard.webp`, the 6bbe1cd and c899933 frames of hero, dashboard, product and
commerce.
