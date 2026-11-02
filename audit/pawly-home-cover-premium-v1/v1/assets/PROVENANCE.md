# Pawly Home cover V1: media provenance

Every shipped pixel comes from the Pawly prototype itself. No pixel is redrawn, retouched, recoloured or composited. Crops are whole rectangles of the product's own regions, and their bounds were measured from the DOM rather than chosen by eye. Machine-readable record: [`../logs/provenance.json`](../logs/provenance.json). Scripts: [`../tools/source-capture.mjs`](../tools/source-capture.mjs) and [`../tools/media.mjs`](../tools/media.mjs).

## Product source

| | |
|---|---|
| Repository | `NikitaKanarev97/pawly`, read-only, nothing written |
| Commit | `main` = `a327d73abb3e7872a6243301afc926de57dc868b`, the production redeploy of release merge `3242156` |
| Order Details | V1.1 `fb5c50a` (REPORT `9c88cec`, pointer `9bdae2e`) is an ancestor of `main`. `src/screens/OrderDetails.tsx` is unchanged between `9bdae2e` and `main` |
| Served from | `https://pawly-fawn.vercel.app` (production) |
| Fixture | The app's own default data, with the booking fields its own transitions write. Copied from `pawly/audit/pawly-order-details-premium-v1/v1/harness.mjs` at `a327d73`: `completed` (both handovers confirmed, `photoDraft.state = 'confirmed'`, dropoff complete) and `walking` (pickup confirmed, return pending). Clock `2026-08-22T13:20+03:00`, the app's `demoNow` |
| Capture | Chromium, viewport 390 × 844, DSF 2, reduced motion. Full-document shots grow the viewport to the document height, so the sticky dock sits after the content instead of over it |

### Source parity with the supplied references

| Supplied | Fresh `main` capture | Result |
|---|---|---|
| S1 `order-details-completed-en-390.png` (`8c1b5e1d…`) | `source/order-details-completed-en-390@2x.png` | **Pixel-identical** over the full first viewport. The shipped crop region is also identical ([log](../logs/source-parity.txt)) |
| S2 `order-details-completed-ru-390.png` (`7269a5f2…`) | `source/order-details-completed-ru-390@2x.png` | Differs in rows 820–833 only (742 px in the crop). The return label reads **«Возврат»** on `main`; S2 has «Возвращение». The change comes from Active Service V1.1 (`0faeb87`, `src/i18n/ownerPhrases.ts` `'Return': 'Возврат'`), which the release merge carried into Order Details. **The cover uses the current `main` wording.** |
| S3 `active-service-walking-en-390.png` (`501cab9b…`) | `source/active-service-walking-en-390@2x.png` | Same layout and copy. S3 shows pickup **16:35** / estimated **17:20** because it was captured on a different clock. Under the harness clock the same walk reads pickup **14:05** / estimated **14:50**, which matches the Order Details chronology (pickup 14:05, return 14:52) |

## Shipped media: `public/media/pawly-home-cover-v1/`

| File | Source | Operation | Size | SHA-256 |
|---|---|---|---|---|
| `return-photo.webp` | `pawly@a327d73:public/assets/proof/handover-dropoff.webp`. This is the drop-off proof frame the product shows as "Return 14:52" | Byte copy (hash equals the git blob and the production asset) | 800 × 597 | `fa557a29457ec7e3d80076b83d3f3564ebe21582657d76024f012ebfa6e3f324` |
| `report-en.webp` | `source/order-details-completed-en-390@2x-full.png` (`f2c510e2badfacde…`) | Crop `left 32, top 248, width 716, height 854` device px = CSS x 16–374, y 124–551: the completed hero card to its own edges. WebP q90 | 716 × 854 | `8c4ecd0c7e189d5b2cd46598d75cfbe84db5286786454f252407a86002e70514` |
| `report-ru.webp` | `source/order-details-completed-ru-390@2x-full.png` (`e93352b2214e9ba5…`) | Same rectangle | 716 × 854 | `580a3176e4875d4c64404e5e05f414456de30d7d3a283b600ca7a2c966b60831` |

The crop bounds come from `capture.json` (the `article > section` box). The card's own corner radius measures 32 device px = 16 CSS px, which equals `--radius-media`. `ScreenSurface` therefore clips exactly on the card's corners, and no grey page pixels show.

**Excluded by the crop:** the prototype's "All screens / Order details" host bar, the "‹ Walk report" title row, "How the walk went", the route illustration, Payment (950 ₽ booking total), "Your review" and the sticky "Rate the walk" dock. The cover therefore shows no money, review or route claim.

### Why the portfolio's previous photo is not used

`public/media/art-direction/pawly/handover-dropoff.webp` (`8a0536f9…`) is the same frame with a **baked caption "HANDOVER COMPLETE · BAIKAL SAFE HOME · 14:51"**. The product records the return at **14:52**, so the strip would contradict the record placed next to it. The RU file (`96f3ca3e…`) already crops the strip off. The product's own frame has no caption, works for both locales, and is the photo the record cites. Both old files remain in place, still used by the case page and untouched.

## Candidate-only media: `assets/candidates/`, not shipped

| File | Source / crop | Used by |
|---|---|---|
| `report-with-title-{en,ru}.webp` | Order Details full capture, `0,112 → 780,1126` ("‹ Walk report" row + hero card + 12 px of page) | Candidate A1 |
| `walk-{en,ru}.webp` | Active Service `walking` full capture, `0,112 → 780,772` ("‹ Baikal's walk" row + status card) | Candidates B1 and B2 |
| `pickup-photo.webp` | `pawly@a327d73:public/assets/proof/handover-pickup.webp`, byte copy, 900 × 900, `c7ec39e5…` | Candidates B1 and B2 (the chronologically correct photo for an in-progress walk) |

The candidate builds served these files from `public/media/pawly-home-cover-v1/` during the A/B round. After the decision they were moved here, so the site ships only the selected media.

## Third-party benchmark images

R2 (Rover map) and R3 (Wag report card) were downloaded from the public URLs in `references/RESEARCH.md`. They appear **only inside the comparison boards** (`comparisons/benchmark-*.jpg`), for review. The original files are not committed. They are benchmarks, not product evidence, and no pixel of theirs is used on the site.
