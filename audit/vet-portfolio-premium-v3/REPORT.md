# Vet Clinic OS — Portfolio Premium V3

**Implemented and submitted for independent visual and functional acceptance. No acceptance verdict is assigned by the implementer.**

2 November 2026 · Europe/Moscow. Branch: `codex/vet-clinic-portfolio-premium-v3-2026-11-02`.

- Research/base: **1edb887cdc237ebca2c99b29b1259bb40435605a**, a clean isolated worktree at `D:/Claude-projects/sp-vet-premium-v3`. [Base SHA](logs/base-sha.txt), [initial clean status](logs/base-status.txt). Original checkout's Learn task edits were not changed.
- Accepted V2.2 source baseline: **6463468a68164278fcb6dec78569721343464a52**. The research HEAD has no src/ds/public/package difference from it. BEFORE is its actual pre-edit production build, not published main or an unrelated image pack.
- Tested implementation commit: **29065c6729b28e70a3c9392b70e33a6ba013eacc**. The following evidence commit adds only this handoff; it does not change rendered source. The branch's final pushed HEAD is reported in the delivery message, avoiding a self-referential commit SHA inside its own report.
- Product source and fetched remote main: **3835c4ffe224a1077d131d2882878d3d373d56e5**, clean/read-only. The live deployment's SHA is not inferred.
- Siblings inspected separately: Agent V3 **dd717b0548dbd33d6ca21008dcb8fd796171b12d**, B2B V3 **b396a6036122461994811ed2afbe73d980e468b2** (in review), Learn V3.1 **cbd12eb7ba8345f3d6a3db1d4c93c59b3a7a4498**. No sibling merge/cherry-pick. Neighbor checks below compare the actual pages on this Vet baseline, not those independent V3 branches.

## Result

**One visit. Three perspectives. One reliable record.** The V2.2 Visit Record remains the dominant hero. V3 brings role, scope, year and working-browser disclosure into the first fold, then follows one encounter through source-led Quick Trace, an inspectable clinical calculation, a service invoice, explicit publication and the owner's care plan.

The old long handoff stack is replaced by ten editorial beats with different evidence scales. A connected information model exposes the two output gates and clinic-only fields. Private-note, blocked-publication and missing-dose specimens sit beside the decisions they explain. A separate process chapter explains research → model → reusable states; the conclusion distinguishes implementation, browser proof and unmeasured real-world impact. Both locales share one renderer and structural/media assertions.

The storyboard was adapted deliberately: a focused weight-entry detail and full Quick Trace inspection avoid another tall workspace; ready/blocked native publication rails replace the shrunken whole document, which remains fully inspectable; the Owner composition stays on white so the native white crops do not expose square corner artifacts on sage. Sage remains in the hero and model. No generated or redrawn screenshots, device shells, copied competitor branding, new global palette or new animation.

Review entry points: [14 comparison boards and native originals](comparisons/index.html), [benchmark assessment](BENCHMARK.md), [media provenance](MEDIA-PROVENANCE.md), [EN desktop opening](after/en-1440-viewport.png), [RU phone opening](after/ru-390-viewport.png).

## Q1 — Visual benchmark parity

The candidate implements the actually viewed hierarchy, directional-model, native-scale and state-family patterns. **It does not claim universal superiority or self-approve premium parity.** [BENCHMARK.md](BENCHMARK.md) records better / worse / justified exceptions for every significant chapter, with exact R/B/S originals and matched BEFORE/AFTER. The 14 boards make that assessment independently inspectable.

Specific caveats: added phone authorship moves the original product proof down about 50px at 390; full clinical and publication fine print still uses native zoom; the new Trace/Process chapters have no exact V2 predecessor, so their boards explicitly identify the nearest prior clinical/state evidence as a proxy. The process proof uses actual product behavior and documented contracts rather than an invented Figma process board or microscopic component mosaic.

## Q2 — Are functions, boundaries and states supported?

**Yes, within the browser-local implementation and explicitly stated limits.** The case's source, values and limitations align with the verified product modules, original media and fresh behavioral checks. It does not establish clinical safety, backend authorization, adoption or business outcomes.

| Public statement / boundary | Source and direct evidence | Scope / limitation |
|---|---|---|
| One visit supports clinician, reception and owner | `src/data/clinicData.tsx`, current role-screen modules; [information model](after/en-1440-roles.png) | Views demonstrate information architecture; not server-enforced RBAC. |
| Short useful trace precedes full record | `VisitQuickTrace` in `src/screens/ProductScreens.tsx`; [native entry](after/en-1440-trace.png), [invalid save](product-qa/en-390-invalid-trace.png), [tests](product-qa/results.json) | Thirty seconds is a design input, not measured productivity. Invalid prescriptions cannot be saved as partial records. |
| 4.8 kg, Meloxicam 0.5 mg/ml, illustrative 0.1 mg/kg → 0.960 → 0.95 ml | `src/data/doseCalculation.ts` and DoseCalculatorWorkspace; [native review](after/en-1440-clinical.png) | Arithmetic support; clinician checks formulation, indication, route and regimen. No safe-dose certification or recommendation. |
| Selected services → 1,500 RUB; manual paid status | `src/data/invoice.ts`, `screens/invoice-draft/InvoiceDraft.tsx`; [invoice](after/en-1440-invoice.png), [actual paid action](product-qa/en-1440-paid.png) | Synthetic total. No payment processing, fiscal receipt, insurer or financial integration. |
| Saving differs from publishing an owner snapshot | `src/data/discharge.ts` explicit allowlist and createDischargePublication; [ready/blocked pair](after/en-1440-publication.png), [UI publication tests](product-qa/results.json) | Owner reads only the reviewed published snapshot. No automatic delivery or notification. |
| Clinic-only private note/history/diagnosis are excluded from owner publication | `dischargeContent` allowlist; [private-note specimen](after/ru-390-roles.png), [snapshot field assertions](product-qa/results.json) | Reception also excludes clinical notes. The diagram is not a security certification. |
| Empty plan blocks update; prior published document remains | `createDischargePublication`, DischargePreview; [actual blocked state](product-qa/ru-390-blocked.png) | Later successful publication replaces the document; no document-history browser is claimed. Failure/offline retention is additionally supported by source guards and existing product audit; this new smoke specifically exercises the empty-plan block and saved-edit retention. |
| Missing dose asks for clinic confirmation before medication | `IncompleteOwnerPrescription` in ProductScreens; [actual missing-dose state](product-qa/en-390-missing.png) | No guessed amount, automatic treatment or invented delivery. |
| One real veterinary-practitioner input | Existing product brief and research provenance; [process chapter](after/en-1440-process.png) | Simulated artifacts are explicitly hypotheses, not more interviews or validation studies. |

All new images originate at the verified local product SHA. The original 56 V2 asset hashes remain intact, and all 20 additive WebPs decode to the exact pixels of their committed raw PNG rectangles. [Integrity results](media-integrity.json). Browser fixtures only change local browser state; product source remained clean.

## Matched browser captures

Chromium **151.0.7922.34**; 900px height, DPR 1, Europe/Moscow, real EN/RU route, reduced motion. BEFORE build was produced before edits and retained at .tmp/v3-before / port 5381; AFTER is the final production build at 5382. Fonts/images decoded, real scroll/reveal lifecycle exercised, returned to top. No screenshot-only CSS or substituted DOM. [Capture harness](capture-case.mjs), [before metrics](before/capture-results.json), [after metrics](after/capture-results.json).

| Locale / CSS width | First viewport | Full page | Final overflow |
|---|---|---|---|
| EN 1440 | [before](before/en-1440-viewport.png) / [after](after/en-1440-viewport.png) | [before](before/en-1440-full.png) / [after](after/en-1440-full.png) | 0px |
| EN 1280 | [before](before/en-1280-viewport.png) / [after](after/en-1280-viewport.png) | [before](before/en-1280-full.png) / [after](after/en-1280-full.png) | 0px |
| EN 1024 | [before](before/en-1024-viewport.png) / [after](after/en-1024-viewport.png) | [before](before/en-1024-full.png) / [after](after/en-1024-full.png) | 0px |
| EN 768 | [before](before/en-768-viewport.png) / [after](after/en-768-viewport.png) | [before](before/en-768-full.png) / [after](after/en-768-full.png) | 0px |
| EN 390 | [before](before/en-390-viewport.png) / [after](after/en-390-viewport.png) | [before](before/en-390-full.png) / [after](after/en-390-full.png) | 0px |
| EN 360 | [before](before/en-360-viewport.png) / [after](after/en-360-viewport.png) | [before](before/en-360-full.png) / [after](after/en-360-full.png) | 0px |
| EN 320 | [before](before/en-320-viewport.png) / [after](after/en-320-viewport.png) | [before](before/en-320-full.png) / [after](after/en-320-full.png) | 0px |
| RU 1440 | [before](before/ru-1440-viewport.png) / [after](after/ru-1440-viewport.png) | [before](before/ru-1440-full.png) / [after](after/ru-1440-full.png) | 0px |
| RU 1280 | [before](before/ru-1280-viewport.png) / [after](after/ru-1280-viewport.png) | [before](before/ru-1280-full.png) / [after](after/ru-1280-full.png) | 0px |
| RU 1024 | [before](before/ru-1024-viewport.png) / [after](after/ru-1024-viewport.png) | [before](before/ru-1024-full.png) / [after](after/ru-1024-full.png) | 0px |
| RU 768 | [before](before/ru-768-viewport.png) / [after](after/ru-768-viewport.png) | [before](before/ru-768-full.png) / [after](after/ru-768-full.png) | 0px |
| RU 390 | [before](before/ru-390-viewport.png) / [after](after/ru-390-viewport.png) | [before](before/ru-390-full.png) / [after](after/ru-390-full.png) | 0px |
| RU 360 | [before](before/ru-360-viewport.png) / [after](after/ru-360-viewport.png) | [before](before/ru-360-full.png) / [after](after/ru-360-full.png) | 0px |
| RU 320 | [before](before/ru-320-viewport.png) / [after](after/ru-320-viewport.png) | [before](before/ru-320-full.png) / [after](after/ru-320-full.png) | 0px |

| Chapter | Desktop 1440 | Phone 390 |
|---|---|---|
| hero | [EN desktop](after/en-1440-hero.png) · [RU desktop](after/ru-1440-hero.png) | [EN phone](after/en-390-hero.png) · [RU phone](after/ru-390-hero.png) |
| problem | [EN desktop](after/en-1440-problem.png) · [RU desktop](after/ru-1440-problem.png) | [EN phone](after/en-390-problem.png) · [RU phone](after/ru-390-problem.png) |
| roles | [EN desktop](after/en-1440-roles.png) · [RU desktop](after/ru-1440-roles.png) | [EN phone](after/en-390-roles.png) · [RU phone](after/ru-390-roles.png) |
| trace | [EN desktop](after/en-1440-trace.png) · [RU desktop](after/ru-1440-trace.png) | [EN phone](after/en-390-trace.png) · [RU phone](after/ru-390-trace.png) |
| clinical | [EN desktop](after/en-1440-clinical.png) · [RU desktop](after/ru-1440-clinical.png) | [EN phone](after/en-390-clinical.png) · [RU phone](after/ru-390-clinical.png) |
| invoice | [EN desktop](after/en-1440-invoice.png) · [RU desktop](after/ru-1440-invoice.png) | [EN phone](after/en-390-invoice.png) · [RU phone](after/ru-390-invoice.png) |
| publication | [EN desktop](after/en-1440-publication.png) · [RU desktop](after/ru-1440-publication.png) | [EN phone](after/en-390-publication.png) · [RU phone](after/ru-390-publication.png) |
| owner | [EN desktop](after/en-1440-owner.png) · [RU desktop](after/ru-1440-owner.png) | [EN phone](after/en-390-owner.png) · [RU phone](after/ru-390-owner.png) |
| process | [EN desktop](after/en-1440-process.png) · [RU desktop](after/ru-1440-process.png) | [EN phone](after/en-390-process.png) · [RU phone](after/ru-390-process.png) |
| outcome | [EN desktop](after/en-1440-outcome.png) · [RU desktop](after/ru-1440-outcome.png) | [EN phone](after/en-390-outcome.png) · [RU phone](after/ru-390-outcome.png) |

| Configuration | Product top BEFORE → AFTER | Final hero display size | Final product bottom |
|---|---|---|---|
| en 1440 | 287.7 → 290.0px | 992 × 564.4px | 854.5px |
| en 390 | 357.0 → 407.0px | 342 × 348.1px | 755.1px |
| en 320 | 357.0 → 433.0px | 272 × 276.9px | 709.8px |
| ru 1440 | 287.7 → 290.0px | 992 × 574.3px | 864.4px |
| ru 390 | 357.0 → 407.0px | 342 × 348.1px | 755.1px |
| ru 320 | 383.0 → 455.4px | 272 × 276.9px | 732.2px |

Full-page height is evidence, not a success KPI. V3 adds architecture/trace/process content while removing the long main-page discharge document.

| Capture | Full-page geometry |
|---|---|
| before en 1440 | 1440 × 10913px |
| before en 390 | 390 × 12775px |
| before ru 1440 | 1440 × 11069px |
| before ru 390 | 390 × 13185px |
| after en 1440 | 1440 × 11502px |
| after en 390 | 390 × 15937px |
| after ru 1440 | 1440 × 11602px |
| after ru 390 | 390 × 16356px |

## Checks and browser behavior

| Check | Actual result / evidence |
|---|---|
| `npm run check` | PASS · 148 files, 0 errors, 0 warnings, 163 existing hints. [log](logs/check.txt) |
| `npm run build` | PASS · 37 generated pages, plus copied public prototype assets. [log](logs/build.txt) |
| `npm run check:content` | PASS · zero prohibited status labels in checked public content / built HTML. [log](logs/check-content.txt) |
| `npm run check:css` | PASS · zero dead scoped selectors. [log](logs/check-css.txt) |
| `npm run check:harmony` | PASS · shared /kit invariant check. [log](logs/check-harmony.txt) |
| Targeted harmony | PASS · both Vet locales at all seven widths; full editorial budget counted, no overflow. [log](logs/harmony-vet.txt) |
| Final browser functional/a11y smoke | **1192/1192 assertions PASS**, including both locales × seven widths, keyboard/pointer zoom, all visible image/full-source zoom targets, Escape, focus containment/restoration, visible focus, anchors, actual language navigation, CTA/CaseNext, image geometry, metadata/OG and scoped axe WCAG A/AA. [results](browser-qa/results.json), [log](logs/browser-qa.txt) |
| Fallbacks / motion / zoom reflow | EN/RU no-JS content/source links/anchors, normal motion plus reduced-motion matrix; 200% equivalent desktop reflow at 720×450 CSS px / DPR 2. [screens](browser-qa/), [harness](qa.mjs) |
| Native product smoke | **76/76 assertions PASS**, EN/RU × 1440/390: actual publication, field exclusion, saved-edit retention, empty-plan block, old-owner snapshot, unavailable dose/call action, selected total, manual paid status and invalid Quick Trace save. [results](product-qa/results.json), [log](logs/product-smoke.txt) |
| Public product routes | 8/8 reachable rendered EN/RU routes with the actual patient. [results](live-product/results.json), [log](logs/live-links.txt) |
| Media provenance | 20 additive assets exact source pixels/hash; all 56 original asset hashes preserved; 8 sensitive source files unchanged and token mirrors identical. [log](logs/media-integrity.txt) |
| Neighbors | 20 full-page pairs: Home, Agent, Portal, Learn, Pawly × EN/RU × 1440/390. 19 raster-identical; one native video-buffer indicator differs, with identical DOM/content/source/geometry. [results](neighbors/results.json), [bounded difference](neighbors/difference-analysis.json) |

Neighbor exception is specifically **237 pixels** at x56–115 / y5727–5730 in the RU 390 Pawly native paused-video buffered-range bar. [Before context](neighbors/native-video-control-before.png), [after context](neighbors/native-video-control-after.png). Strict raster equality initially reports DIFF and is preserved; the follow-up structural audit confirms identical text, image/video sources, links and rectangles. No neighbor source was changed to force a pass.

The first narrow-text iteration exposed nonbreaking heading groups at 320px; copy and grid minima were corrected, then retested. Intermediate canonical/relative-URL, asynchronous zoom-close focus and navigation-selector assumptions were capture-harness issues; final checks exercise the real trailing-slash routes, wait for focus restoration and detect the actual visible menu trigger. [Initial narrow log](logs/iteration-harmony.txt), [early harness log](logs/initial-harness-browser-qa.txt), [focus iteration](iterations/focus-harness-results.json), [navigation iteration](logs/navigation-harness-initial.txt). No failed product behavior was reclassified as passing.

## Files and preservation

Implementation: `src/components/vet/{VetCase,VetShot}.astro`; new `src/copy/cases/vet-v3.ts` and RU counterpart; additive `src/data/vet-v3-media.json` and `public/media/case-vet-v3/{en,ru}/`; Vet-only dispatch imports in `src/pages/work/[slug].astro`; DS catalogue/pattern appendices and [composition map](../../ds/screens/case-vet-v3.md). [Exact 29 implementation paths](implementation-files.txt). The complete branch file inventory, including raw images and every report/capture/script, is [changed-files.txt](changed-files.txt).

Existing V2 copy/media/manifest, Home/VetHome, shared tokens and their mirrors, shared motion, navigation, MediaZoom and CaseNext remain unchanged. No dependency changes. The OG route continues using the existing genuine V2 product image; its project facts remain accurate. V3 title/description are localized. No main merge, production deployment, Figma action or self-acceptance.

## Reproduction

1. Create a clean worktree at 1edb887; install with npm ci, run npm run build, retain the generated dist as .tmp/v3-before. Serve with `node audit/vet-portfolio-premium-v3/serve.mjs .tmp/v3-before 5381` from a checkout containing the harness, or use an equivalent static server.
2. At the implementation source SHA, npm ci / npm run build; serve dist on 5382 with the same server. Run capture-case.mjs before / after.
3. The product checkout must be clean at 3835c4f; run its dev server on 5370, then capture-product.mjs and product-smoke.mjs. Existing external Playwright/axe from D:/Claude-projects/Agent-ops-console is used; it is not added as a portfolio dependency.
4. Run qa.mjs, verify-media.mjs, neighbors.mjs and neighbor-audit.mjs as applicable, then the repository checks. boards.mjs rebuilds the 14 boards and source gallery. write-media-provenance.mjs / write-report.mjs regenerate this handoff from the recorded results.

## Limits and requested independent acceptance

Verification used desktop Chromium, including real phone/tablet CSS layouts and a desktop 200% **equivalent reflow**, not the browser menu's zoom control or a physical device. Safari/Firefox, physical-device interaction and spoken screen-reader testing were not performed. Axe cannot evaluate medical content or text embedded in screenshots. Clinical safety, real-world efficacy, adoption, backend security and integrations are not established by these tests. Live product routing was observed, but its deployment SHA remains unverified.

The remaining request is **independent visual and functional acceptance of this branch**, especially the first fold, model, publication-state family, owner comparison and process evidence against the supplied originals. No production action is authorised by this delivery.
