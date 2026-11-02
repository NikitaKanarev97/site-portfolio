# TRASSIR Learn — Premium Portfolio V3

2 November 2026. Implemented and pushed for **independent visual review**. No design acceptance is claimed.

Branch: `codex/trassir-learn-portfolio-premium-v3-2026-11-02`.
Base: verified research HEAD `4b9744da88864a896d6c2565e4c3baaf032ef175` (remote branch verified unchanged before handoff).
Worktree: `D:/Claude-projects/sp-learn-premium-v3`.
Routes: `/work/learn/`, `/ru/work/learn/`.

## Review evidence

| Format | English | Russian |
|---|---|---|
| 1440×900 matched comparison + full pages | [EN desktop](comparisons/en-1440.md) | [RU desktop](comparisons/ru-1440.md) |
| 390×844 matched comparison + full pages | [EN mobile](comparisons/en-390.md) | [RU mobile](comparisons/ru-390.md) |
| AFTER first viewport | [EN 1440](after/en-1440-viewport.png), [EN 390](after/en-390-viewport.png) | [RU 1440](after/ru-1440-viewport.png), [RU 390](after/ru-390-viewport.png) |

[Section benchmark and eight chapter assessments](BENCHMARK.md) · [Asset provenance](ASSET-PROVENANCE.md) · [32 selected source variants with hashes](asset-manifest.json) · [29 comparison-board inputs](comparisons/manifest.json).

High-value evidence: [architecture desktop](after/en-1440-shared-material.png), [mobile architecture](after/en-390-shared-material.png), [programme and explicit action](after/en-1440-guided-path.png), [progress desktop](after/en-1440-workspace.png), [RU progress mobile](after/ru-390-workspace.png), [assessment/recovery desktop](after/en-1440-assessment.png), [assessment mobile](after/en-390-assessment.png), [outcome](after/en-1440-outcome.png).

Additional responsive viewport/full-page captures are in [after](after/): EN/RU at 320, 360, 768 and 1024. [Responsive dimensions and source selection](after/responsive-checks.json).

## What changed and why

The hero leads with the two-job promise; role, authorship and real DSSL/TRASSIR origin appear before documentary proof. One native navy task-led Home dominates, while a complete ONVIF answer supplies the second context. The mobile version retains both examples; introductory prose follows the product rather than pushing it down.

The course catalogue now supports a concrete argument about two work situations. The original Russian archive is explicitly labelled. A visible directional content model replaces the collapsed diagram: material identity is independent of programme membership, reading creates history, completion requires an action, assessment stores a separate attempt. The model's entities and relationships remain source-backed; geometry is compact enough for 320px, with a sequential tablet/mobile layout and accessible text transcript.

Reference and programme journeys have separate chapters and different image scale. A wide ONVIF header/diagnostic summary shows the immediate answer. The programme contract names workload and 11 ordered units, including assessment; a separate complete end-of-unit panel exposes the explicit action. Its archive-retention material is clearly identified as different from ONVIF.

The learner's actual 9-read / 3-of-11 specimen is dominant, followed by a smaller but legible native reader counterexample with 3 read and no programme credit. Assessment prioritizes 14/20 failure and the whole wrong-answer/source record. A separately labelled 20/20 pass follows recovery, preserving the same 16/20 threshold and document limitation. Retry text preserves both attempts, the 24-hour pause, completed-material and verified-company requirements; exhausted attempts are not reset.

Designed / implemented / checked outcomes distinguish delivery from impact. Explicit completion costs a click; independent records cost additional explanation. No learner uplift, interviews, subject-matter validation, accreditation, company rollout or original team exclusivity is invented. Demo/session/backend limitations remain accurate.

Motion uses only the existing reveal and Diagram draw lifecycle. No new motion timing, scroll pin, fake product-state transition, extra JS dependency or hidden essential narrative was added. Reduced-motion/no-JS endpoint has the same content. A Learn-local style fixes the inherited Next-case label contrast on the sage surface; the shared component remains unchanged.

## Changed source paths

- `src/components/learn/LearnCase.astro` — V3 chapter composition and case-local responsive/contrast rules.
- `src/copy/cases/learn-v3.ts` — new EN/RU case copy, built from the unchanged V2 media descriptions. Home continues to use V2 copy.
- `src/data/diagrams/learn/content-model.ts` — arrowed notation, compact desktop/mobile geometry; no model entity or relationship removed.
- `src/pages/work/[slug].astro` — replaces only the Learn copy imports with V3 EN/RU; the existing Russian wrapper reuses this renderer.
- `ds/screens/case-learn.md` — updated Learn composition map, media policy, responsive treatment and motion scope.
- `audit/trassir-learn-portfolio-premium-v3/` — benchmark, provenance, report, reproducible capture/verification/comparison scripts, exact browser evidence and full logs. [Complete changed-path inventory](logs/changed-paths.txt).

No public media bytes, source product code, homepage copy/composition, Agent/B2B/Vet/Pawly component, shared tokens, navigation, zoom implementation or motion registry were edited. The owner's original checkout retains its four pre-existing report changes. The separate Learn product checkout remains clean at `e9ac4b075c4c5251dc10891ad201ecbf5405b727`.

## Verification

| Check | Result / evidence |
|---|---|
| `npx astro check` | 0 errors, 0 warnings; 163 existing hints. [Full log](logs/astro-check.log) |
| `npm run build` | 37 static pages, successful. [Full log](logs/build.log) |
| `npm run check:content` | 0 findings across built public routes. [Full log](logs/content.log) |
| `npm run check:css -- /work/learn/ /ru/work/learn/` | 0 dead scoped rules on both routes; default checker routes also pass. [Full log](logs/css.log) |
| `npm run check:harmony -- /work/learn/ /ru/work/learn/ --base=http://127.0.0.1:4429 --widths=1440,1024,768,390,360,320` | No violations, including whole editorial-word counts 741 EN / 638 RU. Explicit 1150-word case budget accommodates the requested multi-chapter narrative; no content excluded except documentary diagram and next-case utility. [Full log](logs/harmony.log) |
| Normal-motion production capture | EN/RU × 1440/390 and additional 320/360/768/1024: 0 horizontal overflow, page errors, console errors, missing images or HTTP failures. [Main matrix](after/checks.json), [additional matrix](after/responsive-checks.json) |
| Focused browser verification | 12 locale/width cases + 2 no-JS cases; 3 keyboard image zooms each, actual current source, focus trap, Escape/focus return, source selection, 16px radius, equal 16/24px framed fields, no extra canvas frame, model fits, anchors, canonical/hreflang, locale switch and browser back. [Results](logs/browser-verification.json), [run log](logs/browser.log) |
| Accessibility | axe WCAG A/AA tags: 0 violations in Learn including CaseNext, all 12 combinations. `logs/axe-{locale}-{width}.json` retain full results. SVG text contrast is reported by axe as incomplete; separate computed-fill check covers node/field text and arrow contrast. [Contrast](logs/diagram-contrast.json). This is not a whole-site accessibility certification |
| Keyboard navigation | First Tab reaches skip link; index anchors have 48px height; Enter on Next opens same-locale Vet, EN/RU × 390/1440. [Results](logs/navigation-extra.json) |
| Static access | All seven substantive chapters and model visible with JS disabled; original screenshot fallback link returns 200. Reduced-motion and preference-toggle checks pass. [Control captures](controls/) |
| Protected surfaces | 20/20 fresh production controls byte-identical: Learn homepage entry and four neighboring case first viewports, EN/RU × 1440/390. Exact paired image paths and SHA256 values are in [browser results](logs/browser-verification.json). This measures those viewports, not every scroll state of each other case |
| Live product links | 8/8 HTTP 200 with expected localized text: Home, ONVIF answer, programme, landing, EN/RU. [URLs and samples](logs/browser-verification.json) |
| Git/content integrity | `git diff --check` passes. Original archive and all source image bytes stay unchanged; public product screenshots were visually inspected, including their existing document limitations. No prohibited project-status labels added. No merge, deploy or Figma write |

BEFORE was captured before implementation. Final matched BEFORE files were recaptured from an isolated **unchanged 4b9744d production build**, replacing dev captures so no Astro toolbar contaminates either side. Both phases use the same committed capture script, Chromium, DPR 1, normal motion, locale and viewport. Historical B1–B9 remain labelled historical. Comparison boards place complete source images side by side, with proportional scaling and external labels; no UI pixels are repainted.

## Reproduce

Run from this worktree. Build the pinned baseline in `.tmp/baseline`; serve its `dist` on 4428 and implementation `dist` on 4429. Playwright/axe are existing local QA runtimes, not added application dependencies.

```powershell
$env:PW='file:///D:/Claude-projects/b2b-dssl/node_modules/playwright-core/index.mjs'
node audit/trassir-learn-portfolio-premium-v3/capture.mjs before http://127.0.0.1:4428
node audit/trassir-learn-portfolio-premium-v3/capture.mjs after http://127.0.0.1:4429
node audit/trassir-learn-portfolio-premium-v3/capture.mjs after http://127.0.0.1:4429 responsive
node audit/trassir-learn-portfolio-premium-v3/verify.mjs
node audit/trassir-learn-portfolio-premium-v3/navigation.mjs
node audit/trassir-learn-portfolio-premium-v3/contrast.mjs
node audit/trassir-learn-portfolio-premium-v3/compare.mjs
node audit/trassir-learn-portfolio-premium-v3/provenance.mjs
```

## Known limits and requested review

- The complete page is longer than V2: EN 11,457px desktop / 15,386px mobile, RU 11,604 / 15,476. The visible architecture and larger genuine evidence explain the increase; full pages expose the cost. Mobile progress/results still require vertical reading.
- Fine product text in dense wide captures requires zoom, especially at tablet sizes. Mobile uses authentic localized narrow captures, without artificial enlargement of selected UI text. The mobile programme specimen is a passport, not the entire curriculum.
- Browser testing establishes interface/route behaviour, not measured learner outcomes or technical subject-matter correctness. Specialist usability and content/question-bank review remain future work. The training document does not establish official qualification.
- Screenshots reuse the pinned source as it stood at capture. Failure and pass are separate fixtures; the catalogue is an authentic archive whose exact historical capture date is not established.
- QA here uses Chromium and focused checks, not a complete multi-browser/screen-reader audit. SVG text contrast received a separate computed check; image-contained text is inspected visually rather than certified by axe.
- Final visual acceptance belongs to the independent reviewer. Review the four matched EN/RU comparisons, visible model, native progress scale and recovery ordering against the section benchmark. This branch has not been merged or deployed.
