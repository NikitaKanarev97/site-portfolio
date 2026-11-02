# B2B Partner Portal · Premium case V3.1 · Report

2 November 2026. Prepared for independent review. **Not self-approved. No merge to main, no
deploy, no Figma change.**

## Exact revisions

| Repository | Branch | Commit |
|---|---|---|
| `NikitaKanarev97/site-portfolio` | `redesign/b2b-portfolio-premium-v3-2026-11-02` | base `b396a6036122461994811ed2afbe73d980e468b2` → V3.1 `d5e9c303ac859b1be96ccab0831d1f64d3d1abbd` (this report is the commit after it) |
| `NikitaKanarev97/b2b-partner-portal` | `review/fulfillment-plan-selection-v31-2026-11-02` | `8cb657922991e7b10556eec9a6ded8621c1ded71`, parent `36be1d8` |

Product branch choice: `36be1d8` (Resolution Center V1.1) and `c899933` (Fulfillment
selected frame) are siblings from `6bbe1cd`. Their changes are disjoint: `c899933` touches
only one rule in `FulfillmentPlan.css` plus a note in `ds/components.md`, and
`36be1d8` touches only Resolution Center and CandidateComparison. `8cb6579` is `36be1d8` plus
one commit that changes `FulfillmentPlan.tsx`, `FulfillmentPlan.css` and
`ds/components.md`. That commit supersedes the `c899933` rule, so `c899933` was not merged.
Accepted Resolution V1.1 source is byte-identical, and the Fulfillment screen source
(`src/screens/fulfillment-plans`, i18n, tokens) is identical between `c899933` and `8cb6579`.

## Findings

Matched BEFORE/AFTER boards: `comparisons/` (V3 build vs V3.1 build, same script, same
viewport, reduced motion). Raw section shots: `before/sections/`, `after/sections/`
(EN/RU × 1440, 1440 @2x, 390, 360, 320). Full pages and first viewports:
`before/`, `after/` (EN/RU × 1440, 390, 360, 320; 1024 and 768 numeric checks only).

### P1-1 · Blue left border on the selected FulfillmentPlan: fixed in source

- Cause: legacy row `border-l-(length:--space-0-5) border-l-border-selected`; comparison
  row from 80rem `box-shadow: inset var(--stroke-focus) 0 …` (36be1d8) or a four-side inset
  (c899933).
- Fix (`8cb6579`): legacy Selected = selected surface + Selected badge + filled action.
  Comparison from 80rem: no shadow. No pseudo-element replaces it (probe:
  `::before`/`::after` content `none`).
- Focus vs selection: the row ring moved from `:focus-within` to `:has(:focus-visible)`.
  Pointer choice → outline `none`. Keyboard focus → `solid 2px` at all 4 widths × 2
  locales (`captures/fulfillment-manifest.json`, `captures/states/*-keyboard-focus.png`).
- Pixels, blue edge in device px (DPR 2):

  | Frame | BEFORE | AFTER |
  |---|---|---|
  | Storybook Selected specimen | left 3, others 0 | 0 / 0 / 0 / 0 |
  | Fulfillment 1280 selected row | top 6, right 4, bottom 4, left 4 | 0 / 0 / 0 / 0 (grey hairline only) |

### P1-2 · Uneven selected-plan border: fixed in source

- Cause, confirmed beyond the brief: the base rule
  `.plan-comparison-row[data-state=selected] { border-color: var(--border-selected) }`
  (specificity 0,2,0) outranked the desktop `border-top` rule. The top edge therefore
  painted 1 px blue plus the 2 px inset, which is the heavier top seen in V3.
- Fix: from 80rem the row is a table row. Every row, selected or not, has one 1 px
  `border-default` hairline on top (`border-top-color` reset in the media query). Below
  80rem the complete card keeps one 1 px `border-selected` edge on all four sides.
- Computed styles at 1440/1280: top `1px rgb(226,231,239)`, left `0px`, shadow `none`.
  At 390/360: all four sides `1px rgb(53,99,233)`, shadow `none`. Pixels at 390: 2 device
  px on every side, before and after.
- 200 % inspection: DPR 4 element shots `captures/states/*@4x-selected.png` (1440, 1280,
  390, 360, EN/RU).

### P1-3 · White square corners on the expanded source-line comparison: fixed at the cause

- Diagnosis from pixels: the product item is coherent. Its header band follows the card's
  8 px radius and the body and actions sit inside one border. The corner pixels of the V3
  image were (255,255,255) at 1280 and (247,249,252) at 390, i.e. the product surface
  behind the card. Cause: `capture-line.mjs` took an element screenshot of a rounded box,
  and an element screenshot is the bounding rectangle, so it kept four corner fragments
  of whatever lies behind. Product geometry was not changed.
- Fix (capture boundary): every rounded element is clipped to its box plus 8 px of the
  product surface that really surrounds it. The product keeps 12 px around every rounded
  card (the expanded card's margin at 1280, the queue gap at 390). The 8 px stays clear of
  the queue's own rounded corner, which sits on the 12 px line at 1280; the first 12 px
  attempt was rejected by the check below. At capture, every pixel of the outer 2 device
  px ring is asserted to be one uniform surface. All 16 framed captures pass. Square
  rows remain element screenshots.
- No masks, no rounding in the portfolio, no pixel edits. Same session and stages as V3
  (Apply recorded disabled → enabled; 0 page errors).
- Evidence: `comparisons/04-source-line-stage-02--*`, `captures/line-manifest.json`
  (`clip` per entry).

### P1-4 · Grey right edge on the archival cart: fixed (crop)

- Source `pages-default/Корзина.png`, SHA-256 `b9ef89db…308b0a`, unchanged. The cart panel
  is white from x 99 to 2250 (anti-aliased at 98 and 2251). x 2252+ is the original page's
  grey gutter (236,236,240). V3's crop `97, 214, 2160 × 604` included 5 px of gutter plus
  the anti-aliased column on the right, and 1 px on the left and top.
- New crop `99, 220, 2152 × 598`, inside the panel and below its rounded top corners. Every
  edge pixel is asserted ≥ 244. Same evidence: the unavailable line (red dot, empty price),
  the "best alternative" (green dot), the AI hint and Replace. No retouching. The zoom
  still opens the crop at full source resolution (`scripts/b2b-v31/crop-archive.mjs`,
  `archive-crop.json`).
- Evidence: `comparisons/02-archive-cart--*`.

### P1-5 · Mobile hero

- Phones: role and status share one brief under the rule; `role` and `note` are hidden
  below bp-md. The brief reads "Sole product designer. The commercial redesign shipped at
  DSSL; these screens are my later rebuild on synthetic data, not the shipped release."
  The RU version drops «коммерческий», which the facts row directly below repeats. Head
  gap `flow-pair`, top padding `flow-text`. Desktop: only the inset label changed
  (P2-8); the rest is pixel-identical.
- Share of the cover's product frame above an 844 px fold (`*/sections/report.json`):

  | | 390 | 360 | 320 |
  |---|---|---|---|
  | EN | 73 % → 100 % | 74 % → 100 % | 69 % → 100 % |
  | RU | 69 % → 100 % | 70 % → 99 % (3 px frame edge) | 64 % → 100 % |

  The first actionable row (row 19 · Ambiguous · Choose) is now inside the first screen.
  Before, the fold showed only app chrome (title, progress, tabs, filters).

### P1-6 · Architecture diagram: corrected to the real routes

- Sources, all byte-identical on product `main` @ `5aad49a` and at `8cb6579`:
  - `ia/sitemap.md`.
  - `ia/flows/quick-order.mmd`: SearchResults → Cart directly, or via ProductDetails.
  - `ia/flows/xls-to-order.mmd`.
  - D007: XLS and Quick Order are the two intakes of one specification; one resolver.
  - D029: a moved price or lead time is applied per cart line.
  - Built routes: `QuickOrder` navigates to `/resolution-center`; catalog rows and
    `ProductDetails` dispatch `add-cart-line`.
- Drawn now: XLS import + Quick order → merge bracket → Specification ("Resolved here:
  the buyer confirms every open line") → Cart ("Approved here: a moved price or lead time,
  on its own line") → Fulfillment ("the buyer picks a plan") → Checkout → Order.
  Catalog & search has its own labelled line, "Known product · picked in the catalog,
  nothing to resolve", running under Specification straight into Cart. Bands are
  unchanged: Product identity / Commercial certainty / Fulfillment.
- Phone layout: one left trunk with chevrons. Catalog & search joins as a branch between
  Specification and Cart, never through them. Every intake names its destination in words.
  Those words are visually hidden on desktop but kept for assistive tech.
- Not drawn: the old `ChangeReview → ResolutionCenter` edge of `xls-to-order.mmd`. D007 and
  D029 supersede it (a commercial delta never reopens identity). Also not drawn:
  `ResolutionCenter → Catalog → ProductDetails → back`, which the built Resolution screen
  doesn't link. The note names its sources and simplifications.
- Evidence: `comparisons/03-architecture--*`.

### P2-7 · Phone scrollers

- A localized cue under each sideways family ("3 states · scroll sideways →" / «3 состояния
  · прокрутите вбок →»), shown below bp-md and referenced by the scroller's
  `aria-describedby`. Native touch scroll, scroll-snap and the peeking next card are
  unchanged. Specimens are unchanged apart from the Selected recapture.
- Keyboard (`logs/links-keys.json`): all 4 scrollers are reached with Tab, show `solid 2px`
  outline, are described by the visible cue, and scroll with ArrowRight.

### P2-8 · Evidence and provenance

- Process steps carry an origin pill: "DSSL · original portal" for the archived screenshots,
  "2026 rebuild" for the others. Each pins file and commit as text: `ia/… · main @ 5aad49a`,
  `ds/DECISIONS.md · D007, D010, D026, D029 · main @ 5aad49a`,
  `src/components · Storybook · 8cb6579`.
- Not links: `github.com/NikitaKanarev97/b2b-partner-portal` returns 404 anonymously
  (private), so any public link would be dead for every visitor. The note says the
  repository is private. For reviewers with access:
  - `https://github.com/NikitaKanarev97/b2b-partner-portal/blob/5aad49a/ia/sitemap.md`
  - `…/blob/5aad49a/ia/flows/xls-to-order.mmd`
  - `…/blob/5aad49a/ia/flows/quick-order.mmd`
  - `…/blob/5aad49a/ds/DECISIONS.md`
  - `…/tree/8cb6579/src/components`
  - `…/tree/5aad49a/pages-default`
- Cover inset: label now "Cart · separate recording · a moved price waits for approval on
  its line". The alt says it was recorded separately from the row 19 session; that frame
  is the c899933 cart change-review capture. The four-stage session shows no price change.
- Outcome, NDA wording and facts are unchanged.

### Found during verification · RU 320 overflow (pre-existing in V3)

- At 320 the RU page's layout viewport grew to 327 px in BEFORE and in the first AFTER run.
  Cause: «Прослеживаемый» (279 px at heading-4xl in a 240 px box) and the typographer's
  no-break run «до работающей системы.» (298 px in 272 px).
- Fix: a soft hyphen in each word. It's invisible unless the line must break, so 360 and
  wider are unchanged.

## Benchmark comparison: images inspected directly in this session

| Ref | File | Section | Assessment after V3.1 |
|---|---|---|---|
| R1 | `research/portfolio-benchmark/case-blueprint/img/dn-diag.jpg` | 01 Diagnosis | Same grammar: evidence image and symptom → redesign pairs. Our archival frame now has a clean panel edge. R1 groups symptoms under coloured category headers; ours pairs per frame (by intent, V3). |
| R2a | `research/portfolio-rebuild-2026-10-03/references/ha-user-flow.png` | 02 Architecture | V3.1 closes V3's largest gap: real branches, a labelled route and arrowheads. Still no yes/no decision diamonds: the product's routing is by intake, not by a yes/no test, so none were invented. |
| R2b | `…/references/ha-screen-map.png` (5022 × 2835, inspected via R2a sibling notes and file metadata only, **not visually re-inspected this session**) | 02 | — |
| R3a | `…/references/ha-component-library.png` | 07 Design system | R3a is broader (type table, full palette, 10+ families). Ours deliberately shows four domain families with real states. V3.1 changes only the Selected specimen and the phone cue. |
| R3b | `research/portfolio-benchmark/case-blueprint/img/ha-components.jpg` | 07 | Not re-inspected this session; V3 note applies. |
| R4 | `research/portfolio-benchmark/case-blueprint/img/dn-head.jpg` | Hero | R4 is centred title + one line + facts row + one plate. Our phone hero now gives title, promise and a one-line role/status before a product plate whose first actionable row is in view. Desktop unchanged (asymmetric by intent). |
| R6 | `research/portfolio-benchmark/case-blueprint/img/gr-thesis.jpg` | Section heads | Split head (label │ thesis + body) unchanged. |

## Verification (run in the review worktree against the V3.1 build)

| Check | Result | Evidence |
|---|---|---|
| `astro check` | 0 errors, 0 warnings, 163 hints (same as V3) | `logs/astro-check.log` |
| `astro build` | 37 pages | — |
| `check:content` (CONTENT-RULES) | PASS, 0 findings | `logs/check-content.log` |
| `check:css` | 0 dead rules on all 29 routes incl. `/work/partner-portal` | `logs/check-css.log` |
| DS mirrors | `tokens.css`, `motion.js` byte-identical to `ds/` | — |
| Page captures EN/RU × 1440, 1024, 768, 390, 360, 320 | 0 runtime errors, 0 failed requests, 0 broken images, 0 upscaled frames, 0 hidden text, 0 horizontal overflow (BEFORE: RU 320 overflowed by 7 px) | `after/checks.json`, `before/checks.json` |
| Behaviour (V3 suite) | identical to V3 apart from origin. Reduced motion: 0 hidden. No-JS 1440/390: 0 hidden, 9 sections. Zoom Enter/Escape: focus returns. Navigation: 0 duplicates. Phone scrollers: 0 overflow | `logs/behaviour.json` |
| Links | 26 of 28 OK on EN+RU (anchors, internal, prototype CTA). The 2 others are the site footer's LinkedIn, which answers 999 to any automated client | `logs/links-keys.json` |
| Keyboard, phone scrollers | 4/4 focus, outline, described, scroll | `logs/links-keys.json` |
| Scope | 173 HTML pages byte-identical. The 8 other case pages differ only in Astro-inlined Portal CSS: markup identical, 0 non-Portal CSS differences (same mechanism as V3). 24 assets changed, all Partner Portal media; 0 added, 0 removed | `logs/build-scope.json` |
| Product typecheck / lint | `tsc -b` clean. `oxlint` 1 warning, pre-existing (`only-export-components`, line 26 unchanged) | — |
| Product build + Storybook | both pass at `8cb6579` (build log names the commit 8 times) | `logs/product/build.log` |
| Product Storybook smoke | 292 stories. First run: 1 failure, `sandboxes-procurement-pipeline--pipeline` "rendered nothing", unrelated to FulfillmentPlan. Two reruns: 0 failures. The 36be1d8 baseline: 0. Treated as transient, not hidden | `logs/product/smoke*.log` |
| Product coverage | PASS | `logs/product/coverage.log` |
| Product interaction probe | Fulfillment EN/RU × 1440/1280/390/360 × DPR 2/4: geometry, pointer reselection, keyboard focus, 0 page errors | `captures/fulfillment-manifest.json` |

## Limitations and remaining differences

- **RU Fulfillment 1280 frame is 18 px taller.** The column head «Доставка без НДС» now wraps
  to two lines; in the c899933 capture it fitted on one. Source is identical for this
  screen, and the difference is about 2 px of text width (likely the browser build used
  for the old capture). It's the verified build's real rendering, so it wasn't edited. A
  product-side width change for that column would be a separate decision.
- **Repository links:** the product repo is private, so references are text. Making it
  public, or publishing the IA and decision files, is the owner's decision.
- **Desktop source-line stage 02** is now a white queue slice containing the rounded card,
  matching the white strips of stages 01, 03 and 04. A reviewer may prefer a different
  presentation; pixels and geometry are the product's own.
- **The scroller cue** is also read to screen-reader users on desktop, where the three
  states sit side by side and don't scroll.
- **Not tested:** physical devices, WebKit, Firefox, Lighthouse, a Vercel preview.
- **R2b and R3b** were not visually re-opened in this session.

## Questions for the independent reviewer (no self-assessment of acceptance)

1. Premium level on desktop and mobile: see `comparisons/01`, `03`, `04` and the full pages
   in `after/`.
2. Section quality vs inspected references: see the benchmark table above.
3. The four border/corner/crop defects in browser screenshots: `comparisons/04`, `05`,
   `02`, `captures/states/`, and the pixel tables in P1-1 to P1-4.
4. Authenticity and traceability: every recaptured frame names `8cb6579` in
   `src/data/partner-portal-v2-media.json` and `ARTIFACT-MAP.md § V3.1`; raw PNGs with
   SHA-256 are in `captures/`.

## Reproduce

```
# product @ 8cb6579: npm run build && npm run build-storybook; serve dist under /b2b
node scripts/b2b-v3/serve.mjs <dir containing b2b/> 5310 b2b/index.html
node scripts/b2b-v3/serve.mjs <storybook-static> 5311
C=8cb657922991e7b10556eec9a6ded8621c1ded71; R=<product tree>
PW=file:///<playwright>/index.mjs PRODUCT_COMMIT=$C PRODUCT_ORIGIN=http://127.0.0.1:5310/b2b PRODUCT_ROOT=$R node scripts/b2b-v31/capture-fulfillment.mjs
OUT=audit/b2b-portfolio-case-premium-v3/v3.1/captures/specimens PRODUCT_COMMIT=$C SB_ORIGIN=http://127.0.0.1:5311 node scripts/b2b-v3/capture-specimens.mjs
OUT=audit/b2b-portfolio-case-premium-v3/v3.1/captures PRODUCT_COMMIT=$C PRODUCT_ROOT=$R PRODUCT_ORIGIN=http://127.0.0.1:5310/b2b node scripts/b2b-v3/capture-line.mjs
node scripts/b2b-v31/crop-archive.mjs $R && node scripts/b2b-v31/build-media.mjs
npx astro build && node scripts/b2b-v3/serve.mjs dist 4421      # BEFORE: build b396a60 → 4420
WIDTHS=1440,1024,768,390,360,320 node scripts/b2b-v3/capture-page.mjs http://127.0.0.1:4421 v3.1/after
node scripts/b2b-v31/shoot.mjs http://127.0.0.1:4421 v3.1/after && node scripts/b2b-v31/boards.mjs
OUT=audit/b2b-portfolio-case-premium-v3/v3.1 node scripts/b2b-v3/qa-behaviour.mjs http://127.0.0.1:4421 http://127.0.0.1:4412
OUT=audit/b2b-portfolio-case-premium-v3/v3.1 node scripts/b2b-v3/build-scope.mjs <before-dist>
node scripts/b2b-v31/qa-links-keys.mjs http://127.0.0.1:4421
```
