# Partner Portal · full EN/RU handoff · B · 04.10.2026

Ready for story integration and visual review. One shared motion request remains open: **B-G-01**, Next marquee after repeated resize. This report does not call the entire motion suite PASS. No push, deploy, shared DS/runtime edit, product edit or new chat.

Checkout: C:/Users/kanar/.codex/worktrees/partner-portal-rebuild/Site-portfolio
Branch: codex/partner-portal-rebuild
Base A: 936724beff3bb9a01c69381659dc808782cc7950
Local thematic commit: resolve with git rev-parse HEAD in this checkout; exact SHA is in the final chat handoff.

## Open the result

- [EN production preview](http://127.0.0.1:4354/preview/partner-portal-rebuild/en/)
- [RU production preview](http://127.0.0.1:4354/preview/partner-portal-rebuild/ru/)
- Dev reproduction for G: http://127.0.0.1:4355/preview/partner-portal-rebuild/en/
- Review screenshots: shots/en-1440-full.png, shots/ru-1440-full.png, shots/en-390-full.png, shots/ru-390-full.png. Individual cover, map, flow, central sequence, specimen, application and outcome frames accompany them.
- [Desktop scene](recording/1440-central-scene.mp4), [mobile sequence](recording/390-central-scene.mp4); original WebM, four frames per viewport and recording.json retained. Native wheel forward and reverse, no retiming or CPU emulation.

## What changed

Seven ordered story blocks: audit → selected screen hierarchy → purchase flow → one source row in three stages → domain specimen → narrow/desktop application → outcome. A single proof cover uses the same real decision panel in wide and native narrow layouts. Story exports are partnerPortalStory / partnerPortalStoryRu. Legacy exports remain intact; public routes still use their earlier composition.

The original commercial redesign shipped in full, by the owner's confirmation. The case retains DSSL, sole designer and product team, 2024–winter 2026 and roughly six active months across a long pause. Current frames are expressly an independent reconstruction on synthetic data. No human test, business uplift or QA count is presented as product impact.

Row 38 from office_north_v8.xlsx keeps source text «камера 4мп уличная» and original eight units. Native controls choose candidate KX-2CB4046F2-I; Confirmed remains separate from its Ambiguous matching category; Cart shows source row 38 and quantity eight. The separate native order run repeats that row choice through order creation. The new order stores SKU/quantity only: source text and row number are absent, and specification/cart lines are cleared. Global import metadata remains outside the order. Outcome states this limit and asks for post-order provenance validation plus time/error measurement, without a business baseline.

## Sources and media

Read-only D:/Claude-projects/b2b-dssl, clean HEAD 722b5c6d06a9ddcdc8bb813f84c60d0cac2e07e9. Used current components/decisions (D007–D010, D026, D029–D032), sitemap, XLS-to-order flow, wireframes, accepted product-polish/refinement evidence, source types/store/screens and actual built app/catalog. Sources.json records SHA256; all Common A catalog-source hashes match. Evidence.md lists claims and boundaries; media.md records each use; captures.json records native dimensions, text, fixture, hash and selected-row trace.

Twelve new WebP assets: Changed ResolutionRow and three FulfillmentPlan states; six wide/narrow row stages; two actual context viewports. Narrow source width 390, height 1400, DPR 2: whole cards and decision actions remain visible above fixed product progress chrome. Existing accepted A specimens and exact Inter/OFL are reused. No competitor pixels are in public media.

## Artifacts against the specific references

| ID | Reference | Retained details | Adaptation / comparison |
|---|---|---|---|
| B-IA | HA-MAP-01 | Rectangular screen hierarchy, no arrows, blue numbered squares inside top-right, dashed function frames and action rules | Eight selected real screens; separate native vertical mobile tree. shots/reference-shared-specification.png pairs the original and final composition at comparable width. |
| B-FLOW | HA-FLOW-01 | Start bar, rectangles, question diamonds, input parallelograms, yes/no tablets, orthogonal grey arrows, explicit return loops | One procurement scenario; identity and commerce gates; plan/terms/order end; native vertical mobile bypass paths. shots/reference-buyer-decision.png. |
| B-DS | HA-DS-01 | Foundation left, four-column type table and palette beneath; real vertical state matrices on right with dashed frames | Inter and ten product swatches; four families / 13 states, 35/65 at desktop; sequential mobile sheet; real alpha edges and natural width. shots/reference-domain-system.png. |
| B-LINE | Actual current UI | Original source text/quantity, selected SKU, independent matching/decision axes, Undo, source-row key, stock/price/quantity controls | Source row and panel exports, native adaptive mobile, frozen focus scene on desktop. No decorative provenance UI or invented post-order snapshot. |

Artifact-plan.md was written before captures; final geometry and fixed-footer capture adjustment were recorded there during review. References were opened and inspected, then final comparison sheets inspected. The map is selected editorial architecture, the flow an editorial reconstruction; neither is an original workshop artifact. Canonical CSF specimens deliberately use their own demo lines rather than pretending all 13 states belong to row 38.

## Validation

| Check | Result / evidence |
|---|---|
| Astro check | 0 errors, 0 warnings, 101 existing hints; check.log |
| Static build | 26 pages; build.log |
| Scoped CSS | 0 dead rules on both own previews; css.log |
| Harmony | Both locales at 1440/1024/390/360, height 900 and 600; no violations. EN 448 / RU 394 narrative words. harmony.log and harmony-short.log |
| Static reduce / no-JS | 20 viewport/locale profiles PASS; no page overflow, blank text, broken assets or pins; four families / 13 states; static-verification.json |
| Isolation / parity | Preview noindex, no canonical, outside sitemap; same EN/RU stable block/evidence/media IDs. Public legacy routes retained. Native footer locale link also works without menu JavaScript. |
| Full motion | 10 viewport/locale profiles PASS; desktop focus only at ≥1024×820; reduced mode removes all triggers/pins; rapid forward/back scroll, live preference switches and resize preserve content and avoid duplicate scenes. motion-verification.json |
| Navigation | Native Next/Back/Forward and locale transfer preserve story and focus ownership. Fresh Next continues through hover/focus. One assertion fails after repeated resize: B-G-01. |
| JS bundle blocked | Bootstrap's documented two-second fallback restores the full static story. Native locale and Back verified at 1440 and 390; fallback-verification.json |
| Lifecycle | Fresh Next hover/focus and CDP freeze/resume tested. Headless tabs remain document.hidden=false; physical hidden-tab acceptance is not claimed. |
| Product provenance | Native local product controls, 13 checkpoints, order-details reached; same row-38 choice retained until submission; no source storage writes. order-verification.json / order.log |
| Production probe | Four isolated EN profiles, 1440/390 × CPU 1/6. Local unthrottled network, one sample each, no concurrent capture/encoding. LCP 168–1020 ms, CLS 0–0.0043, rAF p95 18–22.6 ms. Diagnostic observations, not physical-device or field performance. production-probe.json |

## Open request and limits

**B-G-01 (P2):** after repeated breakpoint resize, Next track can stay at transform none until exit/re-entry. Normal entry runs; native link/history navigation works; no exception or duplicate scene. Repro and expected result: common-requests.md / next-probe.json. Shared runtime is frozen and belongs to G, so B does not patch it. G should resolve/recheck this before publication.

Desktop focus replaces panels of different natural height; a thin confirmed row is intentionally centered on the same field. Mobile always shows all three whole adaptive panels. The specimen selection is taller than HA's telecom control sheet because it preserves actual domain fields and actions. Product English UI is documentary source, while all case narration/labels/alt text are EN/RU.

Remote demo href is inherited; its current remote deployment was not certified by this local capture run. Original business results remain confidential. There is no physical-device or real-user verification in this handoff.

## Integration files

- src/copy/cases/partner-portal.ts; src/copy/ru/cases/partner-portal.ts — new story exports prepended, legacy untouched.
- src/data/diagrams/partner-portal/screen-map.ts, purchase-flow.ts, specimen.ts — own data only.
- src/pages/preview/partner-portal-rebuild/[locale].astro — own native EN/RU routes.
- public/media/rebuild/partner-portal/ — own captured product assets.
- ds/screens/case-dssl.md — active B map prepended, prior public map explicitly archived.
- tasks/portfolio-rebuild/partner-portal/ — source/evidence/passports, capture/check scripts, logs/JSON, review shots and recordings.

No registry, home, public route, shared renderer/schema/component/style/token/motion, package check, PLAN or STATE mutation. The source product is still clean. G can integrate the new exports and routes, resolve B-G-01 centrally and decide the public route switch separately.

Reproduce after npm ci: npm run check; npm run build; npm run check:css. Serve production at 4354 and dev at 4355. Run node tasks/portfolio-rebuild/partner-portal/verify-preview.mjs --static-only on 4354, and the same script --motion-only --base=http://127.0.0.1:4355. Its expected remaining failure is B-G-01. Run verify-fallback.mjs separately. Run record-scene.mjs and measure-production.mjs sequentially, with no capture/encoding during CPU probing. The source-capture and order-verification scripts are optional repeatable read-only product runs.
