# Partner Portal V2.1 — independent review handoff

**Later geometry correction:** [current follow-up report and captures](geometry/README.md). The original V2.1 comparison below is preserved as the reviewed baseline.

31 Oct 2026. Branch `redesign/b2b-portfolio-case-v2`; baseline `18f73639174cc9a4dbc0c30ba4d8963b0a1a4781`. Ready for independent visual review, **not self-approved**. No merge, production deployment or Figma changes.

## Changes

- Dedicated homepage cover uses the accepted row-19 comparison, 41/48 progress and native mobile review. The old three-camera picker is gone from EN/RU Home. Other project cards retain identical media URLs (compared after removing local-server origin).
- Case-specific cool-neutral surfaces (`#EDF2F8`, `#F3F6FA`) replace the oversized yellow hero and heavy black commerce band. Global cover colours for other cases are unchanged. Existing semantic typography and spacing remain.
- Desktop hero has a compact title, one dominant complete workspace and a complete native DeltaRow inset. The main workspace fits inside 1440×900, including its readiness bar. Phones get one complete task view, with no second tall screenshot or next-card sliver.
- Commercial review centres the complete owning cart-line and its summary. Native status edges remain meaningful UI; a uniform 20 CSS px field sampled from the product canvas gives the complete module breathing room. No UI pixel or commercial state was repainted.
- Verification keeps the accepted images with more space above. Human decision and fulfillment retain their accepted composition. The shallow archival Before remains a subordinate historical reference, without enlargement or fabricated replacement.
- Public prototype labels explicitly identify an earlier version. Synthetic-data explanation, trade-offs and seven-section structure remain.

## Checks

- `npm run check`: 0 errors, 0 warnings (163 informational hints in inherited cached JS files).
- `npm run build`: 37 pages, complete. `npm run check:content`: 0 findings.
- `npm run check:css -- /work/partner-portal/ /ru/work/partner-portal/`: 0 dead scoped rules, including both Home locales.
- Production build served through Astro preview. Real Chromium matrix: Home and case, EN/RU × 1440/390; zero runtime errors, broken images, screenshot upscaling or horizontal overflow. [Checks](after/checks.json).
- Existing `capture-page.mjs` normal-motion checks: zero failed requests, hidden text, broken/upscaled images or overflow. Raw screenshots stayed local to avoid a duplicate QA package; [compact results](motion-checks.json).
- Additional 360 px EN/RU Home/case checks: no overflow, keyboard focus outline visible, click on the homepage scene opens the matching locale case. [Results](interaction-checks.json).
- Inspected rendered hero, Home, commerce, full-page captures and local problem/verification/decision/fulfillment closeups in both locales and widths. Source images alone were not used as acceptance evidence.
- Token mirrors have identical SHA-256 hashes. `git diff --check` passes.

## Before / after

BEFORE was recaptured from a clean worktree at the reviewed commit, using the same final Chromium capture script and reduced-motion setting as AFTER. AFTER is the production build. Images are decoded and scrolled into view before capture. Original full-resolution PNGs are linked below; no third-party reference imagery was added.

| Surface | EN 1440 | RU 1440 | EN 390 | RU 390 |
|---|---|---|---|---|
| Homepage project preview | [Before](before/en-1440-home.png) · [After](after/en-1440-home.png) | [Before](before/ru-1440-home.png) · [After](after/ru-1440-home.png) | [Before](before/en-390-home.png) · [After](after/en-390-home.png) | [Before](before/ru-390-home.png) · [After](after/ru-390-home.png) |
| Case hero | [Before](before/en-1440-hero.png) · [After](after/en-1440-hero.png) | [Before](before/ru-1440-hero.png) · [After](after/ru-1440-hero.png) | [Before](before/en-390-hero.png) · [After](after/en-390-hero.png) | [Before](before/ru-390-hero.png) · [After](after/ru-390-hero.png) |
| Commercial review | [Before](before/en-1440-commerce.png) · [After](after/en-1440-commerce.png) | [Before](before/ru-1440-commerce.png) · [After](after/ru-1440-commerce.png) | [Before](before/en-390-commerce.png) · [After](after/en-390-commerce.png) | [Before](before/ru-390-commerce.png) · [After](after/ru-390-commerce.png) |
| Full case | [Before](before/en-1440-full.png) · [After](after/en-1440-full.png) | [Before](before/ru-1440-full.png) · [After](after/ru-1440-full.png) | [Before](before/en-390-full.png) · [After](after/en-390-full.png) | [Before](before/ru-390-full.png) · [After](after/ru-390-full.png) |
| Case first viewport | [Before](before/en-1440-viewport.png) · [After](after/en-1440-viewport.png) | [Before](before/ru-1440-viewport.png) · [After](after/ru-1440-viewport.png) | [Before](before/en-390-viewport.png) · [After](after/en-390-viewport.png) | [Before](before/ru-390-viewport.png) · [After](after/ru-390-viewport.png) |

Hero height, excluding the unchanged navbar: EN 1440 **1135 → 831 px**; RU 1440 **1175 → 864 px**; EN 390 **1524 → 776 px**; RU 390 **1646 → 856 px**.

## Prototype consistency — unresolved deployment dependency

Vercel metadata and a real-browser comparison confirm that `https://b2b-partner-portal-five.vercel.app/` serves `main@db7d1f30a69c08ccca7e142bbd596256190d1b7a`, while the case captures come from `6bbe1cd71a656414efcc90a98c61d1012c55be92`. The branch is 19 commits ahead. Same fixture, frozen clock, EN 1440×900:

- Dashboard: public version greets the buyer; accepted version shows the procurement workspace and explicit progress.
- Cart: public version separates toolbar, freshness and warning; its unpriced row still has a numeric line amount and the summary counts all 48 lines (₽1,541,520). Accepted version uses a single sheet, says Not confirmed in the line total and totals 43 priced lines (₽1,362,600). This is a material behavioural and visual mismatch, not just colour polish.
- [Public dashboard](prototype/public-dashboard.png) · [Accepted dashboard](prototype/accepted-dashboard.png) · [Public cart](prototype/public-cart.png) · [Accepted cart](prototype/accepted-cart.png). [Comparison data](prototype/comparison.json).

Recommendation: prepare a separately authorised **public demonstration deployment** from the accepted product commit (a distinct demo project/alias can preserve production), check EN/RU routes, reset the fixture and verify the full flow, then update portfolio URLs. No product deployment, merge, alias change or protected-Preview substitution was made here. Until then the case links explicitly say that the public version predates the displayed screens.

## Public-reference concern

12 third-party research PNGs were removed from the current tracked tree. Source URLs and attribution remain in [REFERENCES.md](../b2b-case-v2/references/REFERENCES.md); local research copies are outside the public repository. The capture script now requires an external private output directory. **Published Git history still contains the old files.** No history rewrite or force-push was performed. Historical removal, if required, needs a separate approved plan.

## Reproduce

Use `PW=file:///.../playwright/index.mjs`. Product capture additionally needs `PRODUCT_ROOT` pointing to a clean accepted checkout and `PRODUCT_ORIGIN` pointing to its dev server.

- `node scripts/b2b-v2/capture-v21.mjs`: complete native cart-line and DeltaRow captures; [manifest](captures/manifest.json).
- `node scripts/b2b-v2/capture-product.mjs workspace-top-390` then `node scripts/b2b-v2/build-media.mjs`: complete mobile review boundary.
- `node scripts/b2b-v2/review-v21.mjs <origin> before|after`: compact comparison matrix.
- `QA_OUT=.tmp/v21-motion node scripts/b2b-v2/capture-page.mjs <origin> after`: existing normal-motion checks.

Vercel branch Preview, if created by the authorised push, is reported separately with the verified commit. Final visual acceptance remains with ChatGPT.
