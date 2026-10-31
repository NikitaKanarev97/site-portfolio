# Screenshot geometry correction — 31 Oct 2026

Follow-up to owner review of `48d00e721524ce0648a952d21f80b5d6c332670d`. No self-approval, merge, production deployment or Figma changes.

## Fixed causes

- **White edge strips:** the old PortalShot fixed a border-box aspect ratio, then contain-fit the image into a smaller content box. Wide screenshots acquired several pixels of white letterboxing. Pictures now use block layout and intrinsic image height.
- **Blue corners cut on Home:** the added border/radius clipped the rectangular native selection edge. The native evidence variant adds neither a mask nor an extra border. The same correction protects the decision comparison inside the case.
- **Hero detail without inner padding:** the native DeltaRow has no padding of its own. Its presentation frame now supplies 16 px on every side on the exact documented product canvas (#F7F9FC). Native UI pixels remain unchanged.
- **Commerce fragments:** the complete owning cart line keeps its native 20 px canvas field and loses the redundant site border/mask. Cart summary is recaptured from its complete `.cart-bar__inner` module; the page-level top separator belongs to the excluded parent. A padded white frame provides clean natural margins. Thin cart/fulfillment lines use lossless WebP.
- **Selected fulfillment row:** the real product desktop CSS drew only a left inset shadow. It now draws an inset stroke-focus frame on all four sides; the following row cannot cover the bottom. Mobile card geometry and business logic stay unchanged.

## Product source

Local product commit: `c899933a0ebcd9520194887eeb929bda2805477f`, branch `codex/fulfillment-selection-frame`, based on accepted `6bbe1cd`. Files: `src/components/FulfillmentPlan/FulfillmentPlan.css`, `ds/components.md`. The same narrow patch is applied in the original product checkout; unrelated WIP is preserved. [Portable patch](product-selection-frame.patch). Product branch was not pushed and the public prototype was not deployed or replaced. Recaptured evidence records the actual corrected product commit in its manifests. Existing unaffected evidence retains its original provenance.

## Verification

- `npm run check`: 0 errors, 0 warnings. `npm run build`: 37 pages, complete.
- `npm run check:css -- /work/partner-portal/ /ru/work/partner-portal/`: 0 dead rules. `npm run check:content`: 0 findings.
- Product `npm run typecheck`: passes.
- `scripts/b2b-v2/check-geometry.mjs`: **20 states, 0 failures**. EN/RU × 1440/390 Home/case, intrinsic image ratios, unmasked native edges, at least 16 px fields for inset/panel content, and no horizontal overflow. All three real fulfillment selections in both locales and widths additionally pass screenshot pixel checks on all four sides. [Machine-readable checks](checks.json).
- Additional EN/RU Home/case checks at 360 px: zero overflow. [Results](mobile360.json).
- Inspected actual Chromium renders, not just exported assets. Only the affected surfaces were recaptured; the previous full-page matrix is retained as the baseline.

## Rendered captures

| Surface | EN 1440 | RU 1440 | EN 390 | RU 390 |
|---|---|---|---|---|
| Home preview | [After](after/en-1440-home.png) | [After](after/ru-1440-home.png) | [After](after/en-390-home.png) | [After](after/ru-390-home.png) |
| Hero commercial inset | [After](after/en-1440-detail.png) | [After](after/ru-1440-detail.png) | Hidden on mobile by existing composition | Hidden on mobile by existing composition |
| 05 · Commercial review | [After](after/en-1440-commerce.png) | [After](after/ru-1440-commerce.png) | [After](after/en-390-commerce.png) | [After](after/ru-390-commerce.png) |
| 06 · Fulfillment | [After](after/en-1440-fulfillment.png) | [After](after/ru-1440-fulfillment.png) | [After](after/en-390-fulfillment.png) | [After](after/ru-390-fulfillment.png) |

Reviewed baseline: [Home](https://github.com/NikitaKanarev97/site-portfolio/blob/48d00e721524ce0648a952d21f80b5d6c332670d/audit/b2b-case-v21/after/en-1440-home.png) · [hero](https://github.com/NikitaKanarev97/site-portfolio/blob/48d00e721524ce0648a952d21f80b5d6c332670d/audit/b2b-case-v21/after/en-1440-hero.png) · [commerce](https://github.com/NikitaKanarev97/site-portfolio/blob/48d00e721524ce0648a952d21f80b5d6c332670d/audit/b2b-case-v21/after/en-1440-commerce.png) · [fulfillment](https://github.com/NikitaKanarev97/site-portfolio/blob/48d00e721524ce0648a952d21f80b5d6c332670d/audit/b2b-case-v2/qa/after/closeup-en-1440-fulfillment.png).
