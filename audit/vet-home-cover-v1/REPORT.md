# Vet Clinic Home Cover V1

2 November 2026, Europe/Moscow. Implemented for independent review. **No independent acceptance verdict, main merge, push, production deployment or Figma edits.**

[Open the evidence gallery](index.html) · [3-direction comparison board](comparison-board.jpg) · [source parity](comparisons/source-parity.jpg) · [Home peer covers](comparisons/peer-covers.jpg).

## Result and isolation

The Home Vet stage now presents one real Visit Record scene instead of three tall repeated role screens. Desktop shows the visit context, Quick Trace, clinical documentation, visibility labels and complete prescription including its calculation limitation. Phones show the actual narrow patient/visit/Quick Trace and first complete clinical field. One responsive image, one caption, one case-navigation link; no fabricated UI or medical functionality.

- Worktree: `D:/Claude-projects/sp-vet-home-cover-v1`.
- Branch: `codex/vet-home-cover-v1-2026-11-02`.
- Runtime base: `04ae0753342bfcd9289f5628d9ed814b2911a6df`, the latest B2B source-parity delivery on top of Home V3.1 and cover polish.
- The independent B2B acceptance at `317e3b7fdb5e54322646f1a1ef2cc63d70f619c1` differs from that base by **one acceptance document only**. No runtime changes are missing. [Archived verdict](context/b2b-parity-acceptance.md).
- [V3.1 independent acceptance](context/home-v31-acceptance.md), originally `5572d96114125e287f34d407db5a934492e353cf`, explicitly identifies the tall Vet mobile cover as backlog. Its accepted hero, actions, portrait and Agent decisions are preserved.
- [Home polish independent review](https://github.com/NikitaKanarev97/site-portfolio/blob/c8fa2fa5b866d5e6076b29fcd59be66477689aa2/audit/home-cover-polish/INDEPENDENT-REVIEW.md) approves Agent A, portrait and Home direction. Its B2B source blocker is closed by the above independent acceptance. These are prior reviewer verdicts, not assigned by this implementation.
- Original main checkout's four modified Learn task reports remain untouched. Other implementation/product worktrees were read only.

## Accepted product source

Repository: `NikitaKanarev97/veterinary-clinic`. Product merge **`3835c4ffe224a1077d131d2882878d3d373d56e5`**, titled “Merge accepted Veterinary Clinic premium redesigns for production”, explicitly records independently accepted key screens. Both requested deliveries are ancestors of it:

| Screen | Accepted delivery evaluated | Selection |
| --- | --- | --- |
| Visit Record Premium V1.3 | `5ae80f674170ab59d09bf3704fbface87d63e003`; application `2a8857ba6f7737cab2e4ff76404d4d2b1a547cbc` | Chosen: clinical documentation and prescribing decision share one genuine screen |
| Invoice Draft Premium V1 | `3112fc053f4ed76c65ddaabae7f28f06fb1db33e`; application `2a045b00964a2fd43968afdc099fb0bde002759b` | Evaluated as C: clear billing workflow, weaker representation of the clinical product |
| Discharge Preview Premium V1 | Included later in the same accepted chain; application `f6fd60ae7bcf631549beca9791c89ff626feba5e` | Actual normal desktop evidence inspected: strong publication decision, but document plus publication panel is more administrative than the clinician workspace |
| Owner Home Premium V1.1 | Included later in the same accepted chain ending `7266c19`; actual published desktop evidence inspected | Clear after-visit instructions and prescription; communicates owner consumption rather than creation of a clinical record |

The old individual delivery reports correctly say acceptance was pending when written. The subsequent accepted merge and its commit ancestry provide the later acceptance evidence. This does not reinterpret automated PASS as independent approval.

**No new product captures were necessary.** Exact archived November browser PNGs are copied under [sources/](sources/); no Veterinary source files or audit package were edited. Visit PNG bytes are checked against `git show 5ae80f6:<path>`, not merely copied from a mutable worktree. [Manifest](sources/manifest.json) records original paths, source SHA, SHA-256, exact crop rectangles and output hashes. [Media recipe](tools/media.mjs).

Final media are only rectangular excerpts followed by **lossless** WebP encoding. Four decoded outputs equal their source rectangles pixel for pixel. No scaling in export, compositing of UI, text replacement, screenshot CSS, hidden controls, retouch, invented medical data or September historical media. The existing portfolio ScreenSurface applies its normal presentation boundary; native content remains unaltered inside it.

Desktop crops: x=88, y=196, width=1264, height=674 EN / 694 RU. The 24px native white side gutters preserve breathing room. The lower boundary follows the complete Examination field and complete prescription; later fields are outside the excerpt. Mobile: x=0, y=110, 390×582 in both locales, retaining the patient bar through the complete complaint. Mobile does **not** claim to display the prescription or full private-note field.

## Three grounded directions, evaluated before choosing

[Rendered comparison board](comparison-board.jpg). Each candidate was placed in the identical BEFORE Home card at real 1440 and 390 viewports; candidate raw captures are in [screenshots/candidates/](screenshots/candidates/). They are exploration renders, not evidence that all three shipped. No UI contents were rearranged.

| Direction | Source / job communicated | 1440 Home scale | 390 Home scale | Decision |
| --- | --- | --- | --- | --- |
| A · Whole visit workspace | Visit V1.3: document the encounter, maintain private note and prepare discharge | Context is complete but the whole document distributes attention across fields, services and save actions | Native narrow view is still a long scroll of repeated fields | Reject: recreates the existing long-cover problem even with only one source screen |
| B · Focused clinical record | Same accepted Visit: document findings, distinguish clinic/owner fields, review the medication decision | One contiguous clinical scene. Full prescription and its weight/provenance/limitation remain; real document text provides clinical context | Patient, visit, clinic-only trace and complete owner-facing complaint; no compressed desktop table or stacked role screens | **Implement:** strongest clinical identity and most controlled information amount |
| C · Visit invoice | Invoice V1: check services/total and record payment received at the clinic | Full real billing context, two service lines, total and manual payment action. Clear, but more administration and price-list detail | Native narrow invoice remains long if context, total and action are retained together | Reject: good secondary case evidence, less distinctive clinical opening; no payment-processing capability is implied |

The final B adds only the established CaseScreen presentation boundary and a localized figure caption to the explored excerpt. At 1440 the 1264px source displays at 1184px (about 94% native scale); at 390 the 390px native source displays at 310px. At 360 it displays at 280px. This is overview evidence for browsing, not a claim that every supporting source label is full native size. Existing case navigation remains available for the complete story.

## Saved research and visual rationale

Read the saved [premium research](../../research/portfolio-premium-v3-2026-11-01/README.md), [reference matrix](../../research/portfolio-premium-v3-2026-11-01/REFERENCE_MATRIX.md), [Home research](../../research/portfolio-home-v3-2026-11-01/README.md), [section adaptation map](../../research/portfolio-home-v3-2026-11-01/03-REFERENCE-TO-SECTION.md), [V3.1 evidence](../portfolio-home-v3/stage-01/v3.1/REPORT.md), [cover polish](../home-cover-polish/REPORT.md) and [B2B source parity](../b2b-source-ui-v11/REPORT.md), plus the later independent acceptances above. No broad new web research was needed.

Actual archived Garri, Dounar and HA pixels were opened. [Reference contact sheet](comparisons/saved-benchmarks.jpg). These are the saved historical references, not new live-site captures.

| Archived reference | Specific observed principle | Applied to Vet / limitation |
| --- | --- | --- |
| [Garri focused transfer](../../research/portfolio-premium-v3-2026-11-01/references/thumbs/gr-swap1.jpg) | One substantial product artifact supports a clear decision; surrounding text does not compete with a screen mosaic | One real encounter and its prescription replace three role windows. Vet remains a denser clinical document than Garri's simple transfer input |
| [Dounar MyTeam opening](../../research/portfolio-premium-v3-2026-11-01/references/thumbs/dn-head.jpg) | Fast context followed by a large authentic product scene | Existing Vet title/outcome stay; actual patient/visit context appears inside the cover. No borrowed impact claims |
| [HA cover](../../research/portfolio-premium-v3-2026-11-01/references/thumbs/ha-cover.jpg) | Deliberate stage and breathing room make product evidence the visual subject | Existing sage stage, one coherent source plane and native white gutters. No imitation devices, 3D hardware or decorative medical visuals |
| Saved Tubik context, documented in the reference matrix | Art direction should express the actual subject | Real clinical documentation supplies the subject; no decorative medical imagery added. No new Tubik screenshot inspection is claimed |

## Matched real browser evidence

Fresh BEFORE build from unchanged runtime base; immutable `.tmp/before-dist` on local port 4433. AFTER is the final production build on port 4434. Same Chromium 151, DPR 1, locale and viewport per pair, reduced motion. Fonts and images decode before capture. Raw PNGs are real browser screenshots, unedited. Labeled JPEGs/boards are presentation sheets only.

| Locale / viewport | BEFORE first / full / Vet | AFTER first / full / Vet | Focused comparison |
| --- | --- | --- | --- |
| EN 1440×900 | [first](screenshots/before/en-1440-first.png) · [full](screenshots/before/en-1440-full.png) · [Vet](screenshots/before/en-1440-vet.png) | [first](screenshots/after/en-1440-first.png) · [full](screenshots/after/en-1440-full.png) · [Vet](screenshots/after/en-1440-vet.png) | [pair](comparisons/en-1440-vet.jpg) |
| RU 1440×900 | [first](screenshots/before/ru-1440-first.png) · [full](screenshots/before/ru-1440-full.png) · [Vet](screenshots/before/ru-1440-vet.png) | [first](screenshots/after/ru-1440-first.png) · [full](screenshots/after/ru-1440-full.png) · [Vet](screenshots/after/ru-1440-vet.png) | [pair](comparisons/ru-1440-vet.jpg) |
| EN 390×844 | [first](screenshots/before/en-390-first.png) · [full](screenshots/before/en-390-full.png) · [Vet](screenshots/before/en-390-vet.png) | [first](screenshots/after/en-390-first.png) · [full](screenshots/after/en-390-full.png) · [Vet](screenshots/after/en-390-vet.png) | [pair](comparisons/en-390-vet.jpg) |
| RU 390×844 | [first](screenshots/before/ru-390-first.png) · [full](screenshots/before/ru-390-full.png) · [Vet](screenshots/before/ru-390-vet.png) | [first](screenshots/after/ru-390-first.png) · [full](screenshots/after/ru-390-full.png) · [Vet](screenshots/after/ru-390-vet.png) | [pair](comparisons/ru-390-vet.jpg) |
| EN 360×800 | [first](screenshots/before/en-360-first.png) · [full](screenshots/before/en-360-full.png) | [first](screenshots/after/en-360-first.png) · [full](screenshots/after/en-360-full.png) | [pair](comparisons/en-360-vet.jpg) |
| RU 360×800 | [first](screenshots/before/ru-360-first.png) · [full](screenshots/before/ru-360-full.png) | [first](screenshots/after/ru-360-first.png) · [full](screenshots/after/ru-360-full.png) | [pair](comparisons/ru-360-vet.jpg) |

1024×900 and 768×1024 EN/RU first/full/Vet/protected captures are also included in the gallery and manifests. Tablet retains one centered native narrow panel below 1024. At 1024 the desktop excerpt is more reduced than at 1440; this is a browseable overview, with the case available for detailed reading.

Measured **whole card** height: EN390 2327.8 → 782.6px; RU390 2402.1 → 819.4px; EN360 2168.4 → 737.8px; RU360 2278.0 → 833.8px. These are layout measurements, not product impact metrics.

## Validation and regression evidence

| Check | Result / evidence |
| --- | --- |
| Astro typecheck | PASS, 143 files, zero errors/warnings; 163 existing hints. [log](logs/typecheck.txt) |
| Production build | PASS, 37 routes. [final build](logs/build.txt), [baseline build](logs/baseline-build.txt) |
| Scoped CSS | PASS, zero dead scoped rules on checked routes. [log](logs/css.txt) |
| Public content | PASS, zero forbidden project-status findings; includes built HTML. [log](logs/content.txt) |
| Home browser matrix | 10 EN/RU × 1440/1024/768/390/360 profiles; no overflow, page errors, failed resources or broken visible images; exactly one Vet image in each. [before](logs/before.json), [after](logs/after.json) |
| Source-image integrity | 4/4 lossless outputs exactly equal accepted source rectangles. [manifest](sources/manifest.json), [verification](logs/verification.json) |
| Protected Home DOM | Hero, Agent, B2B, Learn and Pawly hashes unchanged in all 10 profiles. [verification](logs/verification.json) |
| Protected visible geometry/styles | All visible descendant sizes, relative positions and selected computed styles identical in all 10 profiles; only absolute document Y changes below Vet. [results](logs/protected-geometry.json) |
| Protected captures | First viewport, Agent, B2B and Learn: 40/40 PNG pairs pixel-exact. Pawly: same DOM/visible geometry/style/source, but fractional document-Y rasterization changes; exact measured pixel differences and 0–1px screenshot-edge rounding retained, not reported as pixel-exact. [results](logs/verification.json) |
| Vet case cover | EN/RU 1440 and 390 real case-cover captures pixel-identical BEFORE/AFTER. [results](logs/browser-qa.json), [state captures](screenshots/states/) |
| Navigation / accessibility states | EN/RU 390 no-JS, reduced and normal motion: image loads, native keyboard focus indicator visible, Enter follows actual Vet case URL and renders its H1. [results](logs/browser-qa.json) |

Two harness issues were corrected before final results: the actual Learn Home ID is `work-learn`, and a lazy image must finish decoding before testing `complete`. Initial pixel-strict Pawly comparison was investigated with the additional exact visible-geometry/style checks; its subpixel raster differences are explicitly retained above. No product regression assertion was hidden.

Product changes are limited to `src/components/VetStage.astro`, new `src/components/vet/VetHome.astro`, new `src/copy/vet-home.ts` and four Home-only media files. Existing Home copy, index, hero, CTA hierarchy, WorkStage, CaseScreen, shared styles/tokens, Agent/B2B/Learn/Pawly source/media and Vet case media/data remain unchanged. DS changes document this Home-only composition; no token change or new motion.

Limitations: Chromium desktop/mobile emulation only; no new physical-device, Safari/Firefox, screen-reader or clinician study. At narrow widths this is a selected clinical excerpt, not the complete visit or a claim that the prescription appears on mobile. The broader Vet case still uses its existing case media, intentionally outside this task. No sitewide redesign or production verification is claimed.

## Final comparison question

**Clarity and composition: yes, the submitted evidence supports comparison alongside Agent Ops, B2B Partner Portal and TRASSIR Learn. Overall premium-quality acceptance remains for the independent reviewer.** [Matched peer sheet](comparisons/peer-covers.jpg), [EN desktop](screenshots/after/en-1440-vet.png), [RU desktop](screenshots/after/ru-1440-vet.png), [EN mobile](screenshots/after/en-390-vet.png), [RU mobile](screenshots/after/ru-390-vet.png).

Agent has one consequential approval; B2B has one ambiguity/comparison decision; Learn has one learning artifact. Vet now has one identifiable clinical encounter, instead of an unusually long role-screen strip. Against saved Garri it follows the focused-artifact principle; against Dounar it makes clinical context immediately visible; against HA it stages authentic UI with breathing room. It remains a denser professional document, with quieter art direction than HA and smaller supporting labels than the main prescription value. These are explicit tradeoffs, not a claim of equivalence to every reference.

**Remaining concrete request:** independent visual review of this Vet-only cover and its EN/RU desktop/mobile evidence. No merge or deployment is requested or performed by this package.

## Reproduce

From the isolated worktree, preserve `.tmp/before-dist` from the clean base before rebuilding AFTER. Serve it on port 4433 and final `dist` on 4434. `tools/capture.mjs before|after` creates the real matched matrix; `tools/candidates.mjs` creates the three exploration pairs; `tools/media.mjs` verifies/imports the archived accepted sources; `tools/verify.mjs`, `tools/protected-geometry.mjs` and `tools/browser-qa.mjs` check the scope; `tools/gallery.mjs` creates review sheets. Playwright is reused from the existing local QA environment (`D:/Claude-projects/b2b-dssl`), not added to application dependencies.
