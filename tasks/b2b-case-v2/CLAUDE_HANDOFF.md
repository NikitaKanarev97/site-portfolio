# CLAUDE HANDOFF — B2B Partner Portal case V2 (editorial + visual redesign)

**Date:** 2026-10-31  
**Status:** Awaiting Claude implementation. The preceding portfolio V1 is **NOT visually approved**.  
**Repository:** `NikitaKanarev97/site-portfolio`  
**Starting branch:** `portfolio/b2b-case-visual-v1`, HEAD after this handoff.  
**Implementation branch to create:** `redesign/b2b-portfolio-case-v2`, from the starting branch HEAD.  
**Target routes:** `/work/partner-portal` and `/ru/work/partner-portal`.  
**Product source:** `NikitaKanarev97/b2b-partner-portal` @ accepted `redesign/cart-v2` commit `6bbe1cd71a656414efcc90a98c61d1012c55be92`. No merges/deploys.

## 0. Read these sources before design

In `site-portfolio`:
- Current case data / content: `src/copy/cases/partner-portal.ts`, `src/copy/ru/cases/partner-portal.ts`.
- Case renderer: `src/components/CaseStory.astro`, `CaseCover.astro`, `CaseShot.astro`, `CaseSteps.astro`, `CaseImpact.astro`, `CaseScreen.astro`.
- Design rules: `ds/story-contract.md`, `ds/screens/case.md` (prefer current contracts over historic notes).
- Raw accepted screenshot copies (17): `audit/b2b-case-refresh/sources/*.png` (EN/RU, desktop/mobile).
- Generated V1 WebP crops: `public/media/rebuild/partner-portal/2026/*.webp`, `public/media/rebuild/partner-portal/ru/2026/*.webp`. **Most need replacement; not source-of-truth.**
- Crop script `scripts/build-b2b-case-visuals.mjs` and `audit/b2b-case-refresh/crop-manifest.json` explain V1 failures.
- Actual Chromium V1 full-page captures: `audit/b2b-case-refresh/page-review/en-1440-full.png`, `en-390-full.png`, `ru-1440-full.png`, `ru-390-full.png` (plus smaller review WebPs and outcome closeups). Treat as BEFORE.
- Existing older row-story frames: `public/media/rebuild/partner-portal/line-*-wide.webp`, `line-*-narrow.webp`. **These are old material and not approved for reuse without recapture.**

In `b2b-partner-portal` (product screenshot evidence, accepted product iteration; check actual source first):
- Dashboard: `audit/dashboard-v3/after/en-1440-fold.png`, `ru-1440-fold.png`, `en-390-fold.png`, `ru-390-fold.png` (and `*-full.png`).
- Resolution Center: `audit/resolution-center-v2.1/after/candidate-en-1440-fold.png`, `candidate-ru-1440-fold.png`; `main-en-1440-fold.png`, `main-ru-1440-fold.png`; `completed-*-full.png`; mobile 390 counterparts.
- Catalog: `audit/catalog-v2.1/handoff/1-desktop-1440-en-default-catalog.png`, `3-desktop-1440-ru-dense-list.png`, `5-mobile-390-ru-default-listing.png`.
- Product Details: `audit/product-details-v2/after-1440-en-viewport.png`, `after-1440-ru-viewport.png`, `after-390-en-viewport.png`, `after-390-ru-viewport.png` and full-page images.
- Cart: `audit/cart-v2/after-1440-en-viewport.png`, `after-1440-ru-viewport.png`, `after-1440-en-change-viewport.png`, `after-1440-en-unpriced-viewport.png`, `after-390-en-viewport.png`, `after-390-ru-viewport.png`; full-page captures.
- Fulfillment: `audit/fulfillment-plans-v2/after/default-en-1440.png`, `default-ru-1440.png`, `default-en-390.png`, `default-ru-390.png`, plus expanded/selected states.
All screenshots are in the private repository, and the latest accepted product commit is supplied above.

## 1. User's explicit rejection: V1 is not visually acceptable

**Critical problem 1 — Cover:** current cover consists of three generic nearly identical camera candidates from an *old* screenshot. It says nothing about the enterprise product, procurement, complexity or designer's impact. Its framing, block proportions and composition look stale and weak. **Replace cover from scratch**, with a coherent authored editorial composition using the strongest *new* product screens. Show the procurement workflow and a meaningful decision (specification progress + actual line resolution or commercial change), not a random product list. No fake UI or generic marketing graphics. Inspect two viable compositions internally and deliver the stronger one.

**Problem 2 — arbitrary cut-offs:** the new Dashboard screenshot cuts into the `Recent orders` module, leaving its title/header and partial content stranded at the bottom. This is unacceptable. Every crop ends at a natural semantic boundary: either include the whole module with meaningful rows, or end clearly before it. Likewise every frame: keep card edges, headings, badges, CTAs, line-to-decision relationships, and breathing room. **Avoid raw image crops masquerading as a designed presentation.**

**Problem 3 — outdated/broken resolution media:** the candidate and source-row frames look like an old version. In one, the highlighted `4 MP full-colour bullet camera` row has a background selection that visually stops before the row's full width. Verify the latest product rendering and capture it afresh where necessary. Do not crop a defect into the portfolio. If the selection bug is only in an old screenshot, discard it. If actual in the product and relevant to portfolio evidence, fix minimally on a product review branch or select a clean, truthful state; do not invent an edited appearance.

**Problem 4 — insufficient negative space / edge touching:** even Product Details only looked passable; top breathing room is too small. Several other crops are too tight or semantically incomplete. Treat source captures as documentary material and compose clean, purpose-built plates: consistent visual margins, sufficient whitespace, natural aspect ratios and legible UI at the displayed size. Do not make complex 1440 UI illegible by shrinking it to 500px.

**Problem 5 — weak narrative value:** gallery-like screenshots and basic diagrams are not strong enough for a recruiter or a design lead. Show why each decision matters and what trade-off it solves. The case must be quick to skim, not a giant longread.

**Do not defend V1 or keep its hero because it is already implemented.** V1 serves as source context and BEFORE.

## 2. New creative direction

Intended editorial territory: premium international Product Design case study, sophisticated enterprise software, deliberate asymmetric grid, generous whitespace, strong type contrast, precise labeling, readable product evidence and purposeful mixed-scale shots.

A strong cover must make a reader understand in 3 seconds:
- This is a complex B2B **procurement workspace**, not a surveillance-camera storefront.
- A buyer resolves an imported specification and moves it toward an order.
- The design makes decisions, commercial certainty and next steps visible.

Create the cover composition from authentic accepted screens. Potential directions to evaluate:
A) dominant procurement-workspace capture (Dashboard current specification and progress), plus one separate focused decision card (Cart changed price OR Resolution choice) in an editorial layout; not fake layered browser windows;
B) a two-stage narrative composition: “unresolved specification → commercially ready order”, with real task states and strong hierarchy.
You may develop a better direction if evidence supports it. **No three interchangeable product options as the hero.**

Respect the existing site aesthetic, but make the cover look distinctly authored and portfolio-grade. Keep title/outcome legible on clean surface, never over screenshots. Mobile must have an independent composition, not a microscopic desktop stack.

## 3. Narrative, short enough to skim

Aim for roughly 350–500 words of main English story (EN / RU matched; adjust for readability), similar to current case. Prefer ~6–8 narrative modules, not 10+ fullscreen sections. One concrete concept per section, short body (typically <=35 words), captions <=12 words when feasible. Keep necessary product facts / attribution.

Recommended **story spine**; refine independently:
1. **Cover / promise:** from ambiguous requested SKUs to a traceable commercial decision.
2. **Why redesign:** existing storefront/promo-centered experience vs a buyer-first procurement workspace. One honest before/after, with the *new* dashboard fully framed.
3. **Architecture / task flow:** XLS and Quick Order into one source-linked specification, then matching, Cart, Fulfillment. Very compact map, not a huge diagram.
4. **One human decision:** representative ambiguous source row → candidate comparison → confirmed buyer choice; use latest Resolution Center and source trace. If the 3-up candidate UI is weak, represent it with a more meaningful close-up, not as hero.
5. **Product verification:** Catalog and Product Details; show technical identity, specs, buyer-specific price and availability, no false claims.
6. **Commercial review:** Cart change / unpriced state; this is a hero-grade *interaction pattern*. Show changed terms, approval and transparent totals together. Avoid an arbitrary 48-row table as main visual.
7. **Supply decision:** Fulfillment plan trade-off, timing, warehouse handoffs and delivery cost.
8. **Outcome and limits:** commercial redesign shipped; portfolio reconstruction with synthetic data; trade-offs (matching != compatibility, unknown price != 0, delivery only after plan); no fabricated post-launch metrics. Prototype CTA and next case.

You may combine sections to improve speed and rhythm. Do not simply duplicate every accepted screen full-width. Screens should earn their place.

## 4. Reference-first research (NO MOBBIN)

**Mobbin is banned for this and Agent Ops work: no connector/API/credits.** 
Use **SCRN** plus independently chosen high-quality B2B/enterprise and award-winning product case-study websites (strong actual visual storytelling, not just analogous shopping flows). Select only genuinely appropriate examples for: case hero/cover composition, editorial image treatment, narrative rhythm, and evidence-focused annotations.

Before implementing, save actual screenshots of chosen reference sections into this PRIVATE repo at `audit/b2b-case-v2/references/` with a compact `REFERENCES.md`: exact URL, capture file, the specific adopted design principle and why it fits this B2B product. Do not publish third-party screenshots in the public case or steal brand visuals. If SCRN fails, proceed with external sites, record failure once, never use Mobbin.

Keep research efficient: 4–6 excellent references > 40 generic images.

## 5. Asset production and visual framing standards

- **Reinspect accepted raw product captures** and recapture live app with real Chromium if the available image is stale, damaged, too small or compositionally unusable; ensure correct accepted commit / verified Preview.
- Capture source PNG BEFORE cropping; keep reproducible crop manifest and source attribution. Do not use screenshots that merely “look recent”.
- Rebuild all V1 assets you judge weak (especially cover, Dashboard, Resolution, Cart and Fulfillment). Product Details may be retained only after top padding and edge checks. Do not re-use prior V1 image mappings automatically.
- Make a shot-by-shot presentation spec: narrative purpose; source file/commit; desired crop; visible proof elements; EN and RU; displayed desktop and mobile sizes.
- Prefer full meaningful component with healthy outer margins over visually random partial table. No clipped `Recent orders` header, no orphaned labels, partial headings, cut CTAs, broken selected-state fills, or cropped card chrome.
- Desktop: crop with semantic boundaries, not a fixed X/Y rectangle for every screenshot. Preserve original resolution and legibility. Mobile: authentic RU/EN captures; independent framing and hierarchy. Use sharp/WebP assets optimized for site.
- When the interface is too complex for a single full screenshot, show **one large context shot plus one genuine macro crop** with visual separation; do not illegibly shrink both.
- Use a coherent paper/plate rhythm with deliberate padding / margins; avoid empty endless white scroll and an overlong persistent stage.
- No fabricated redesign outcomes, product screens, logos, user quotes, metrics, or deceptive composite changes. An editorial montage of REAL screenshots is fine if the source remains truthful.

## 6. Implementation constraints

- Implement only B2B Partner Portal case and its local media/components. Preserve all other four portfolio cases and site navigation.
- Maintain existing shared CaseStory contract / design system where reasonable. If custom cover or section presentation is needed, add *case-scoped* components/styles rather than globally altering `CaseCover` for all cases.
- EN and RU must have matching story structure but naturally adapted copy and localized screenshots.
- Preserve working prototype links, disclosure of synthetic data, role/team attribution and Next Case.
- No production deployment, no merge to `main`, do not modify Figma.
- **Claude owns production implementation; ChatGPT will be independent visual reviewer.**

## 7. QA and acceptance (do not self-approve)

After implementation:
1. Real browser BEFORE screenshots at 1440/390 EN/RU (existing V1 is available).
2. Real AFTER screenshots: 1440/390 EN/RU first viewport and full-page, plus cover hero closeups and at least 3 essential editorial shots, ideally with a browser-scrolling capture so lazy images/animations load.
3. Check that visible screenshot content matches committed source screenshot, contains no unwanted clipping, same-screen UI text remains readable, link works, and mobile has no horizontal overflow.
4. Verify typecheck, build and focused smoke. No unrelated large QA or long reports.
5. Save captures, crop manifest, reference library and concise report in `audit/b2b-case-v2/`. Include objective direct BEFORE/AFTER links.
6. Push the finished implementation branch `redesign/b2b-portfolio-case-v2`; find exact Vercel Preview tied to final commit if possible. No merge/deploy; handoff for ChatGPT independent review.

**The real measure of success:** A recruiter understands the value of the project in one minute; a Product Design Lead sees mature product judgment, real UI quality, constraints, decisions and trade-offs after scanning 2–3 minutes. The reader wants to open the prototype, not escape a slow wall of text and tiny screenshots.
