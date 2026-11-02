# Pawly · Home Cover Premium V1 — UX / Visual Reference Pack
**Prepared:** 2026-11-02 · **research commit base:** `a3448dff623310212555116a213a87233a3de5f8` · **portfolio implementation baseline:** `42baa852a12302d5f89c3776ea83a16b6e0e9aad`.

## Scope and provenance
- Target: **Pawly cover on kanarev.com Home** only, fifth/last cover of Premium Portfolio V3 Stage 2; **not** Pawly product and **not** Pawly portfolio case page (Stage 3).
- In parallel Codex is finalizing TRASSIR Learn V1.1 on `codex/trassir-learn-home-cover-v1-2026-11-02`. Its work must stay isolated. Do **not** base Pawly on an unaccepted Learn branch or overwrite its changes. The integration baseline includes prior accepted B2B/Vet/Agent cover work. Recheck branch heads before making any writes.
- Current home architecture: `src/components/FeaturedCase.astro`, `src/components/WorkStage.astro` (Pawly currently has no dedicated Home component), `src/copy/featured-work.ts`, `src/copy/case-art.ts`, `src/copy/cases/pawly.ts`, `src/copy/ru/cases/pawly.ts`, `src/copy/cases/story.ts`, `src/components/CaseScreen.astro`, `src/pages/index.astro`.
- Pawly is an **independent self-initiated interactive mobile prototype** with synthetic/fixture evidence. It does NOT supply live GPS, messaging/calls, published reviews, payment processing, certification or real customer results. Do not add claims of production coverage, vetted safety guarantees, map freshness, payment charge, insurance, or tested client outcomes.
- Current portfolio Pawly media (`public/media/rebuild/pawly/`, `public/media/case-pawly/`) **predates the premium Pawly screen redesign**. Never silently present it as latest source. The separate source repo is `NikitaKanarev97/pawly`, checked at main `a327d73abb3e7872a6243301afc926de57dc868b`; individual premium review branches are the authoritative source until accepted and integrated. Order Details V1.1 is a submitted review, not presumed independently accepted.

## Actual portfolio BEFORE inspected (V3.1; confirm actual runtime matches on target branch)
- [EN 1440 current Pawly Home card](https://github.com/NikitaKanarev97/site-portfolio/blob/42baa852a12302d5f89c3776ea83a16b6e0e9aad/audit/portfolio-home-v3/stage-01/v3.1/screenshots/after/en-1440-work-pawly.png)
- [EN 390 current Pawly Home card](https://github.com/NikitaKanarev97/site-portfolio/blob/42baa852a12302d5f89c3776ea83a16b6e0e9aad/audit/portfolio-home-v3/stage-01/v3.1/screenshots/after/en-390-work-pawly.png)
- [RU 390 current Pawly Home card](https://github.com/NikitaKanarev97/site-portfolio/blob/42baa852a12302d5f89c3776ea83a16b6e0e9aad/audit/portfolio-home-v3/stage-01/v3.1/screenshots/after/ru-390-work-pawly.png)
- [EN original real photo](https://github.com/NikitaKanarev97/site-portfolio/blob/42baa852a12302d5f89c3776ea83a16b6e0e9aad/public/media/art-direction/pawly/handover-dropoff.webp) and [RU photo](https://github.com/NikitaKanarev97/site-portfolio/blob/42baa852a12302d5f89c3776ea83a16b6e0e9aad/public/media/art-direction/pawly/handover-dropoff-ru.webp)
- Current screenshot: [outdated return report](https://github.com/NikitaKanarev97/site-portfolio/blob/42baa852a12302d5f89c3776ea83a16b6e0e9aad/public/media/rebuild/pawly/en/order-details.webp).

### BEFORE strengths and weaknesses
- Desktop: impactful **real dog-and-walker photograph** adjacent to actual service proof. Good consumer warmth and distinctness from B2B covers. However the secondary phone is a **long old report** with tiny finance/legal/demo/review details; large empty whitespace under photo due phone column. "Charged 950 ₽" in old media and review-publication hints risk misrepresenting demo capabilities.
- Mobile: sharp human photo first, then complete oversized old report occupying most of card. It shifts from consumer product narrative to lengthy document reading, unlike compact SCRN native app storytelling. The current image repeats the same photo inside the report, adding visual redundancy.
- Protect: humane photo subject; authentic app states; returned confirmed only on actual photo send; one clear portfolio CTA; sober consumer palette; no fake product branding or visual effects. Do NOT introduce 3 overlapped devices.

## Inspected premium Pawly product evidence — files COPIED into this research branch
These are exact original PNG screenshots imported byte-for-byte from user's source repository, not retouched. The imported product screenshots include the **prototype's All screens host header** and sometimes a sticky navigation/action dock; those parts must be omitted from an editorial crop, not represented as app product UI.

| ID | Research-branch path | Exact upstream state and purpose |
| --- | --- | --- |
| S1 | [Order Details · completed EN](product/order-details-completed-en-390.png) | V1.1 AFTER **submitted for independent review**. `Baikal is home`, actual confirmed return 14:52, pickup/return photo pair 14:05/14:52, Marina K., dated record. **Primary candidate** because it actually proves safe-return evidence. |
| S2 | [Order Details · completed RU](product/order-details-completed-ru-390.png) | Same genuine state localized; verifies natural labels and no wrong-language image. |
| S3 | [Active Service · walking EN](product/active-service-walking-en-390.png) | Walking in progress, **estimated** return 17:20, accepted walker, **received pickup photo**, return still unconfirmed. Alternative **before return**, not a completed confirmation. |
| S4 | [Walker Profile · EN](product/walker-profile-en-390.png) | Portrait/identity/7 recorded checks, dog requirements/match and booked context. Supplementary, not an evidence of return. No external certification. |

Upstream:
- [Order Details V1.1 report](https://github.com/NikitaKanarev97/pawly/blob/a327d73abb3e7872a6243301afc926de57dc868b/audit/pawly-order-details-premium-v1/v1.1/REPORT.md) — important truth corrections: reviews saved **only in demo**, no publication or support messages; booking total ≠ authorized hold; cancelled-after-pickup cannot resolve via in-app contacting. NEVER use an old untrue payment/review excerpt.
- [Active Service V1.1 report](https://github.com/NikitaKanarev97/pawly/blob/a327d73abb3e7872a6243301afc926de57dc868b/audit/pawly-active-service-premium-v1/v1.1/REPORT.md) — photo and estimated-versus-confirmed truth, static route.
- [Walker Profile V1.1 report](https://github.com/NikitaKanarev97/pawly/blob/a327d73abb3e7872a6243301afc926de57dc868b/audit/pawly-walker-profile-premium-v1/v1.1/REPORT.md) — recorded limits/checks ≠ safety guarantee.
- Existing accepted photo is in the portfolio already, do not fetch random dog stock imagery.

## External and SCRN reference images I actually looked at
**For all reference assets:** use them as visual/UX benchmarks, not product evidence; do not copy screenshot pixels into the new interface. SCRN predominantly documents mobile UI. Vintage Wag images support **concept**, not 2026 premium styling.

| Ref | Exact inspected image | Useful pattern | What does not fit |
| --- | --- | --- | --- |
| R1 | [Official Rover Dog Walking product image — map/activity](https://www.rover.com/assets/ssr/a62a3d2303b0fa72479d.webp) · [source](https://www.rover.com/uk/dog-walking/) | Clear singular walking record, status and route metadata. Product-centered visual in a portrait mobile device. | Pawly has **static sample** route, no live GPS or distance; do not invent live telemetry or adopt Rover green. |
| R2 | [Official Rover map and timing screen](https://support-ie.rover.com/hc/article_attachments/32018091180308) · [feature explanation](https://support.rover.com/hc/en-us/articles/211587446-How-does-the-dog-walking-map-feature-work) | Clear chronology and post-walk summary, one primary event rather than many equal badges. | Rover's true walk map cannot be presented as Pawly live tracking. |
| R3 | [Wag! real report-card image](https://media.wagwalking.com/cdn-cgi/image/fit%3Dscale-down%2Cwidth%3D960%2Cquality%3D80/15393019561234566166) · [official report-card documentation](https://support.wagwalking.com/en_us/service-report-card-S1rkYA7A) | Photos + timeline/summary form a credible after-service record. | Old busy/emoji UI, pet-loo logging and tips are inappropriate; Pawly has no such implemented proof. |
| R4 | [SCRN · 4 лапы: Pet services](https://scrn.gallery/app/4lapy?screen=689a30e8c2421924166294e5) · [flow](https://scrn.gallery/app/4lapy?tab=flows&flow=689b8c3dc242192416697086) | Mobile service category hierarchy and calm single-column flow. Confirms consumer / pet context. | Not a walker verification/report screen. Avoid accordion style, insurance/vet services. |
| R5 | [SCRN · InDrive completed ride detail](https://scrn.gallery/app/indrive?screen=69bf164970040b66155f3ca3) · [flow](https://scrn.gallery/app/indrive?tab=flows&flow=69bf184a70040b66155f4df0) | A completed service shows route, dated milestones, duration and rider/caregiver context in a scannable hierarchy. | Taxis are not pet care; do not add map/ratings/payments absent from Pawly. |
| R6 | [SCRN · Airbnb upcoming trip entry](https://scrn.gallery/app/airbnb?screen=697f3bf563dd4951bcbcdc86) · [flow](https://scrn.gallery/app/airbnb?tab=flows&flow=697caa3cfbe185555022d124) | Premium travel photo-first visual confidence and useful service entry. | Home discovery/feed, reviews/listings and pricing are irrelevant to handover proof. |
- Old [Wag report as app screen](https://i.imgur.com/sfLDuI8.jpg) is secondary/historical; don't treat as a benchmark for contemporary UI craft.
- [Official Rover Cards functional definition](https://support.rover.com/hc/en-us/articles/211573246-What-are-Rover-Cards-and-how-do-I-send-them) explains one photo+summary and is supportive context, **not** evidence that Pawly has those same functions.

## Section / state → source → target design decision
| Area | References | Proposal and exclusion |
| --- | --- | --- |
| Homepage heading/outcome/CTA | V3.1 BEFORE + accepted adjacent covers | Keep case title outside visual stage; one short distinction about verifiable handover, not endless explanatory copy. CTA stays a real case link. |
| Primary human/animal image | Portfolio original photo, R6 | One strong authentic real dog + walker photograph: maintain face/lead, avoid severe crop and fabricated lifestyle shots. |
| Main product UI evidence | S1/S2 + R3/R5 | **One truthful compact hero excerpt** of completed Order Details: status, Baikal home, 14:52, handover photo proof, named walker if legible. DO NOT display old 'Charged'/'public review' promises. |
| Alternative during service | S3 + R1 | If selected, show "walk in progress" and **estimated** return with pickup photo. Do not imply returned until drop-off confirmation. |
| Desktop ratio | BEFORE + S1 + R6 | Start from photo-rich ~58% and product ~42%, adjust based on actual readable screenshot geometry. Photo and screen top align; don't force giant vertical screenshot or dead bottom space. |
| Mobile | BEFORE + R4/R5 | Art-directed *short* photo + a focused genuine UI region, not full scroll report. Keep first service fact and photo within plausible early visual scan. No three-device montage, no fake phone bezel. |
| Demo/product status | Source V1.1 reports | Copy cannot assert payments processed, GPS live, reviews public, contact support functional, guaranteed safe handover, insurance, certified walker. Demo/synthetic scope remains clear on the case page. |
| EN/RU | S1/S2 + existing photo EN/RU | True localized matching screenshot for both locales. Caption photo strip in EN removed for RU source; never bake untranslated words into RU composition. |
| A11y / full nav | FeaturedCase, WorkStage, CaseScreen | Working /work/pawly link, focus and reduced motion, no false UI buttons. If excerpt looks clickable, click opens case, not a fake live order. |

## Composition candidates — must visually test A vs B
**A: Completed handover / proof-first (recommended).**
- 1440: a single original lifestyle photo showing the dog + walker on left, one clearly framed cropped genuine completed Order Details screen on right. Crop app screenshot to native order header/status/photo proof, excluding prototype 'All screens' chrome, payment/review body/footer. No cut status, cropped time or detached image captions. Use source image exactly; browser captures are untouched, authored crop may be separate *derived media*, with original screenshot and crop spec/hash preserved.
- 390/360: 16:10 or equivalent high-impact portrait-aware photo with dog face visible, then a *compact* evidence excerpt (status/time/verified pickup + return photos), not the full order report. A case CTA beneath. The screen should be recognizably a genuine app screen, not a poster built from manually rewritten UI.
- Duplicate return photograph between hero and screenshot **must be evaluated**: if too repetitive, compare photo crop and evidence crop, rather than inventing replacement imagery.

**B: In-progress trust/status.**
- Use same original photo only if chronology isn't contradicted; source S3 states current walk and **return not confirmed**, so a *drop-off* hero photo would imply a future event. Use a matching **pickup** photo if available from the product (and provenance logged) or omit photo; do not pair logically incompatible states. Single source excerpt S3.
- B may be rejected as semantically inferior; document reason. A must not win by default if unreadable on mobile.

**Hard limits:** no three overlapping phones, no fake map/live tracking, no marketing promises, no oversized empty stage, no photo-caption-language mismatch, no stock or AI-generated animals. Use current real source and a small number of clean surfaces.

## Test / acceptance gate
- Inspect current actual site at EN/RU 1440/390/360 (plus 768/1024 where responsive changes), direct BEFORE, then A/B in same integration base.
- Desktop: photo+screen match ref R6 for editorial quality and R3/R5 for service evidence; phone content must read at working card size. Mobile: image subject, single primary proof, CTA and neighboring case context; avoid mobile height similar to long TRASSIR V1.
- Provenance: name every upstream screenshot SHA, route, fixture/status, and crop boundaries; don't mix EN/RU or stage states. Preserve copied product PNGs under `references/product/`; store further hero crops under `v1/assets/` only if derived with source attribution.
- Run typecheck, lint/content/CSS, production build, browser smoke, keyboard/focus, pressed, no-js/reduced motion, image loading and zero overflow. Compare original Hero and other 4 covers hashes on actual renders. No merge/deploy/Figma edits.
- Deliver `audit/pawly-home-cover-premium-v1/v1/{REPORT.md,BENCHMARK.md,before/,after/,comparisons/,logs/}` and commit+push. No self-acceptance; independent ChatGPT reviewer issues ACCEPTED / ACCEPTED WITH BACKLOG / REVISION REQUIRED.
