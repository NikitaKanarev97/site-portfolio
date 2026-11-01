# Vet Clinic OS — portfolio case V2

1 November 2026 · Europe/Moscow. **Implementation delivered for independent review. No visual acceptance verdict is assigned.**

## Source and delivery

- Portfolio baseline: `561e6830392b6e9a25e61e30cafe394586df3ff4`, fetched before work.
- Verified clean product source and remote main: `3835c4ffe224a1077d131d2882878d3d373d56e5`. Product source was not edited.
- [Tested implementation commit](https://github.com/NikitaKanarev97/site-portfolio/commit/aee011b29af48c923821fc9e1f5fc9c8506b77a1) · branch `redesign/vet-portfolio-case-v2`. This report and captures follow as a separate evidence-only commit.
- Isolated worktree: `D:/Claude-projects/sp-vet-v2`. Original portfolio checkout's unrelated Learn report edits are preserved. No main merge, production deployment or Figma edit.

## What changed

A dedicated EN/RU Vet renderer replaces the old trace → invoice → summary presentation. The story now explains a connected clinical visit, three responsibilities, sourced calculation, financial recording, explicit publication and post-visit care. One complete current Visit Record anchors the cover. The calculation panel is shown at native scale on desktop; the full input workspace remains inspectable. Invoice, Discharge Preview and Owner Home each demonstrate a different decision. Three actual exception states make information boundaries concrete.

The case uses existing Onest typography, semantic surfaces, spacing, MetaList, CaseScreen/MediaZoom, TextLink and CaseNext. Shared CaseStory and other case source files are unchanged. Vet's Home preview and cache-safe EN/RU OG cards are updated. Main English prose is **344 words**, excluding headings, facts, role-flow labels, captions and interface text. Russian is a complete equivalent with the same media structure; build-time parity is asserted.

No measured savings, adoption, additional interviews or clinical certification are claimed. One practising veterinarian informed the work. Thirty seconds remains a design constraint. Normal frames use 4.8 kg / 0.95 ml and the same conditional 10-day follow-up plan. All patient, clinical and financial values are synthetic. Source calculation limitations remain visible. The browser-local implementation demonstrates role-specific information views, not server-enforced permissions.

## Research and media

[RESEARCH.md](RESEARCH.md) records the old implementation, actual published Agent/Portal benchmarks, latest merged product reports and design direction. [MEDIA_MANIFEST.md](MEDIA_MANIFEST.md) maps every selected image to source repository/path/SHA, locale/state, viewport, dimensions, honest crop and narrative placement. [Machine-readable media](../../src/data/vet-v2-media.json) carries the same geometry and SHA-256 hashes.

The curated pack contains 52 fresh lossless DPR-2 WebP files (about 3.73 MiB across both locales, including full inspection sources). Native PNG acquisition and uncropped full-browser counterparts remain in [product-captures](product-captures/). Screens were not fabricated, retouched, recoloured or altered with screenshot-only CSS. No old Vet screenshot is rendered on either new case route or its Home preview.

The published product URL was opened in real Chromium and its Visit Record checked. Its deployed Git SHA cannot be established from that page, so all media provenance names the verified local source commit instead. This distinction is deliberate.

## Browser captures

Chromium 151.0.7922.34; viewport height 900px; DPR 1; Europe/Moscow; reduced motion. Both first viewport and full-page views are native browser captures. Every significant section is also available separately. Desktop/mobile sources switch below 1024px so tablet readers receive readable native narrow evidence.

| Width | EN first / full | RU first / full |
|---|---|---|
| 1440px | [first](final/en-1440-viewport.png) · [full](final/en-1440-full.png) | [first](final/ru-1440-viewport.png) · [full](final/ru-1440-full.png) |
| 1280px | [first](final/en-1280-viewport.png) · [full](final/en-1280-full.png) | [first](final/ru-1280-viewport.png) · [full](final/ru-1280-full.png) |
| 768px | [first](final/en-768-viewport.png) · [full](final/en-768-full.png) | [first](final/ru-768-viewport.png) · [full](final/ru-768-full.png) |
| 390px | [first](final/en-390-viewport.png) · [full](final/en-390-full.png) | [first](final/ru-390-viewport.png) · [full](final/ru-390-full.png) |
| 360px | [first](final/en-360-viewport.png) · [full](final/en-360-full.png) | [first](final/ru-360-viewport.png) · [full](final/ru-360-full.png) |

Useful section evidence: [clinical EN 1280](final/en-1280-clinical.png), [clinical RU 1440](final/ru-1440-clinical.png), [role flow EN 390](final/en-390-roles.png), [handoff EN 1440](final/en-1440-handoff.png), [handoff RU 768](final/ru-768-handoff.png), [critical states RU 360](final/ru-360-states.png), [outcome RU 360](final/ru-360-outcome.png), [native zoom EN 1440](final/en-1440-zoom.png). [Final capture directory](final/) contains all widths/locales/sections.

## Validation

| Check | Observed result / exact evidence |
|---|---|
| `npm run check` | PASS, 0 errors, 0 warnings; same 163 pre-existing hints as baseline. [log](checks/check-final.txt) / [baseline](checks/baseline/check.txt) |
| `npm run check:content` | PASS, 0 findings. [log](checks/content-final.txt) |
| `npm run check:css` | PASS, no dead scoped rules. [log](checks/css-final.txt) |
| `npm run check:harmony` | PASS on default kit. [log](checks/harmony-kit.txt) |
| Targeted harmony, both Vet routes × 5 widths | PASS, 0 violations. [log](checks/harmony-final.txt) |
| `npm run build` | PASS, 37 pages including the new localized OG endpoints. [log](checks/build-final.txt) |
| Case browser QA | **658/658 assertions pass**; 10 width/locale cases, zero document overflow, overflowing prose, broken assets or runtime errors. [log](checks/browser-final.txt), [results](final/results.json) |
| Native geometry and sourcing | All displayed frames preserve source aspect ratio, CSS-width ceiling and native narrow sources. 52 public image hashes verified. Same [results](final/results.json) |
| Zoom and keyboard | Every visible image and full-screen trigger opens the intended actual source; Enter, Escape, dialog focus containment, focus return and visible CTA focus pass. Same results; [zoom example](final/ru-360-zoom.png) |
| Scoped axe | Zero WCAG A/AA findings in the final Vet case at all 10 configurations. Same results |
| Navigation and metadata | Product URLs/locales, actual public destinations, next case, Back restoration, canonical, hreflang, title, description and OG asset pass |
| No JS / reduced motion | Both locales: no-JS image/link fallback, no overflow, live motion preference switch and visible content. [extra results](final/extra.json), [no JS RU](final/ru-360-nojs.png) |

### Adjacent pages and Home

A separately built, unchanged baseline worktree serves the exact portfolio main SHA on port 5372. EN/RU Learn and Pawly, plus EN Agent Ops and Partner Portal, are compared with the candidate at 1440/390. Unchanged Home cards are checked at both widths/locales. **21/28 raw screenshot hashes match exactly; 11/12 complete neighbouring-page captures match exactly.** The raw pixel-equality runner intentionally returns nonzero for remaining differences; it is not reported as an all-identical pass. [Full results](regressions/results.json), [full-run log](checks/regressions.txt), [Home retest](checks/regressions-home-retest.txt), [pixel difference measurements](regressions/pixel-differences.json).

Every one of the **16 unchanged Home cards** has exactly the same text, image paths, computed typography/colours and normalized element geometry: maximum measured delta **0 CSS px**. [Geometry verifier](verify-regression-geometry.mjs), [log](checks/regression-geometry.txt), [complete measurements](regressions/geometry.json). The redesigned earlier Vet card changes absolute document Y; screenshot clipping/rasterization can shift by a pixel despite identical local geometry. Before/After Pawly images were opened and show the same photo, document and text. Native videos are paused at the same frame for comparison; no screenshot CSS or replacement images are used. Remaining raw hash differences are retained as a limitation, not hidden or called byte-identical.

Home Vet evidence: [EN desktop](regressions/en-1440-vet-home.png), [RU phone](regressions/ru-390-vet-home.png). All four Home width/locale cases have zero overflow and current Vet media. Navigation/redirect definitions are unchanged.

### Findings corrected during this work

- A high hero image under the shared reveal attribute could remain invisible in the first viewport. Documentary media now stays visible without an intersection threshold.
- RU 360 outcome had 20px overflow from a grid min-content constraint. The case-scoped grid now allows wrapping; all final sizes show zero overflow.
- The cover inspection link needed stronger contrast on sage. The shared Next-case small label also failed contrast on the pre-existing Vet page; [baseline axe findings](regressions/results.json) confirm this. Both are corrected locally for Vet, without changing other case styles.
- The full calculator at 1280px made arithmetic too small. It was replaced with the entire native review panel beside the decision narrative; the complete input workspace is linked independently. [Final 1280 evidence](final/en-1280-clinical.png).
- The Owner comparison originally left a large blank area beside a full-height phone. It now shows the complete context/plan/prescription detail with the complete screen separately available.

Harness iterations are preserved in [iterations](iterations/). The first request-context OG fetch incorrectly used a relative URL; the final harness uses an absolute local URL. Back navigation assertions now wait for Astro's actual renderer swap rather than checking immediately after the URL changes. These were harness corrections; the navigation itself did not require a product-code fix.

## Reproduce

From this isolated worktree: `npm ci`; run the five portfolio commands, then `npm run preview -- --host 127.0.0.1 --port 5371`. Run `node audit/vet-portfolio-case-v2/qa.mjs`. Playwright/axe use the existing external QA installation (override `PLAYWRIGHT_PACKAGE_JSON`); no site dependency was added. For image acquisition, follow [MEDIA_MANIFEST.md](MEDIA_MANIFEST.md). For neighbouring comparisons, serve baseline SHA on 5372 and run `regressions.mjs`, then `verify-regression-geometry.mjs`. A nonzero strict pixel-identity result must be investigated, not silently accepted.

## Known limitations

Only Chromium emulation was used; no physical devices, Safari/Firefox or spoken screen-reader study. Automated axe and geometry checks are scoped evidence, not accessibility certification. Fine metadata in the full Visit Record and Discharge overview remains smaller than portfolio prose; full inspection is intentional. Critical calculation arithmetic now remains at native scale at 1280/1440. The page is still a long case: complete clinical/document evidence takes more space than compact Portal modules. The Home preview is an overview, not a claim that every small UI label is readable there. Historical preview routes and archived old media are preserved for compatibility; the new public EN/RU Vet routes use the fresh pack.

The product is browser-local, with synthetic medical data and no demonstrated backend permissions, clinical safety certification or payment integration. No user-research result beyond the verified input from one practising veterinarian is added. Measured clinic/business impact remains absent. Independent visual acceptance is still required.

## Independent visual acceptance questions

**Q1. Does this case now look and read like a premium international Senior Product Designer case study?**

The evidence supports a materially stronger candidate: [hero](final/en-1440-viewport.png), [native calculation and design rationale](final/en-1280-clinical.png), [role-specific handoff](final/en-1440-handoff.png) and [exception states](final/ru-360-states.png) show decisions, constraints and implementation boundaries rather than a UI gallery. Claims are qualified and sourced. This is the implementer's evidence-based assessment, **not self-approval**; the final judgement belongs to the independent reviewer.

**Q2. Is its visual and editorial quality comparable to the accepted Agent Ops Console and B2B Partner Portal cases, or does it still fall behind in specific sections?**

It uses the same actual editorial grammar: compare [Agent desktop](references/agent-ops-console-1440-viewport.png), [Portal desktop](references/partner-portal-1440-viewport.png), [Vet desktop](final/en-1440-viewport.png) and [Vet clinical](final/en-1280-clinical.png). Typography, clear native evidence, role flow and precise trade-offs are aligned. Vet is still slower to skim in the full Visit Record cover and publication section because the complete clinical document is tall; [full EN](final/en-1440-full.png) makes this visible. Its research/validation depth cannot be represented as Agent's user-tested/client-accepted outcome. Those are specific review trade-offs, not a parity verdict based on a successful build.

**Q3. Are the screenshots, whitespace, typography, responsive layout and image crops consistently professional across the entire page?**

Final native captures show consistent gutters, 48px text-to-evidence clearance, intact source proportions and real narrow frames: [1440](final/en-1440-full.png), [1280 calculation](final/en-1280-clinical.png), [768 RU](final/ru-768-full.png), [390 EN](final/en-390-full.png), [360 RU](final/ru-360-full.png). The final matrix has no measured text clipping/overflow, distorted images or failed loads; the [zoom evidence](final/ru-360-zoom.png) confirms complete inspection. The named fine-print/long-document trade-offs still need independent visual judgement. No major section is knowingly left broken or unreadable; this report does not turn those checks into an unconditional visual acceptance.
