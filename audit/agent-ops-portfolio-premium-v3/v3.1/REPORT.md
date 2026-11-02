# Agent Ops Portfolio V3.1 — mobile typography correction

2 November 2026. **Ready for independent visual acceptance; no self-approval.**

Repository: `NikitaKanarev97/site-portfolio`. Branch: `redesign/agent-ops-portfolio-premium-v3`. Exact Before commit: `eb7b9e70c08123d6d72760043492981906022c4d`. Worktree: `D:/Claude-projects/Site-portfolio-agent-premium-v3`. Main and its existing Learn-report edits were left untouched.

## Changes

1. Replaced case-wide `overflow-wrap: anywhere` with `break-word` fallback for prose; heading roles explicitly use normal word wrapping. The shared build-time typographer also joined long final phrases with nonbreaking spaces (for example, «ответственного человека»). Removing `anywhere` alone produced overflow. The case-local `AgentHeadingText` helper preserves natural word boundaries with native `wbr` opportunities and spaces, without changing the shared typographer. It is used for the seven section titles and the commitment line, which also broke at 320px.
2. Below the existing bp-md, section titles interpolate at 8vw within the existing size-2xl / size-3xl bounds: 25.6px at 320, 28.8px at 360 and 31.2px at 390. Desktop type sizes, columns, spacing rules, motion and zoom code are unchanged. Normal word wrapping can redistribute words within desktop title lines; all first six section bounding dimensions remain identical at 1440 in both languages. The desktop first viewport is pixel-identical.
3. RU currency grouping uses U+00A0 in `$23 000`, `$1 120` and accessible `$18 430`. The large historical payout also has `white-space: nowrap`. Every visible editorial currency amount was measured on one line at all eight tested locale/width combinations; EN values remain intact as well.
4. Removed the repeated Outcome introductory paragraph from rendering. Its research → prototype → testing → acceptance explanation is already present in the immediately following process rows, Delivered / Validated / Confirmed blocks and scope boundary. No research, decision, screenshot or truthful outcome claim was removed. Mobile sheet text changes from 1,286 to 1,245 EN words and 1,122 to 1,091 RU words (whitespace-delimited DOM count). All seven sections remain.

All accepted native screenshots and their full-screen targets remain unchanged. No new dependency, animation, capability, result, metric, design-system token or product UI was introduced. EN/RU, home cover and every other case are preserved.

## Matched visual evidence

These are fresh, real Chromium production captures, not reconstructed Before images. Same viewport height, device scale 1, fonts, source media, reduced-motion preference and capture procedure in each pair. Reduced motion makes the typography comparison deterministic; normal-motion behavior is exercised separately. Complete pages, seven section captures and heading sheets are retained.

| Width | EN Before / After | RU Before / After | Purpose |
|---|---|---|---|
| 360 × 800 | [Matched set](comparisons/en-360.md) | [Matched set](comparisons/ru-360.md) | Required mobile |
| 390 × 844 | [Matched set](comparisons/en-390.md) | [Matched set](comparisons/ru-390.md) | Required mobile |
| 1440 × 900 | [Matched set](comparisons/en-1440.md) | [Matched set](comparisons/ru-1440.md) | Desktop preservation |
| 320 × 800 | [Matched set](comparisons/en-320.md) | [Matched set](comparisons/ru-320.md) | Stress test |

Each set links to the full page, first viewport, all seven sections, every heading and the next-case title. Very tall full-page captures use PNG because lossless WebP has a height limit; section and heading captures remain directly inspectable.

### Manual heading inspection

Every heading was inspected in the real Before and After heading sheets, including all seven section titles, hero/promise, operating-model branches, investigation steps, checkpoint stages, policy stages, autonomy states, disclosure, results and trade-off. See the [37-item EN/RU inventory](MANUAL-HEADINGS.md). Next-case title captures were inspected separately. No After heading has a mid-word split, isolated terminal punctuation, clipped end or horizontal escape. There are no fixed-height text crops.

Automated word-range measurements corroborate this inspection; they are not the visual verdict:

| Locale | 320 broken words Before → After | 360 | 390 | 1440 |
|---|---|---|---|---|
| EN | 3 → 0 | 2 → 0 | 1 → 0 | 0 → 0 |
| RU | 5 → 0 | 6 → 0 | 4 → 0 | 0 → 0 |

Examples corrected: EN `decision` / `person`; RU «обещания», «сообщение», «решение», «человека», «доказательствам», «люди». Policy titles were also inspected even where the original word-range count was zero: the 320 Before could put terminal punctuation on its own line.

[Before measurements](before/checks.json), [After measurements](after/checks.json), [asserted summary](summary.json), [currency comparison](currency-before-after.json).

## Verification

| Check | Result / evidence |
|---|---|
| Astro check | PASS: 0 errors, 0 warnings; 163 inherited informational hints. [Log](logs/check.log) |
| Production build | PASS: 37 pages. [Final log](logs/build-after.log), [Before log](logs/build-before.log) |
| Content validation | PASS: 0 findings, including built HTML. [Log](logs/content.log) |
| Scoped CSS | PASS: 0 dead rules. [Log](logs/css.log) |
| Existing harmony checks | PASS: no violations. [Log](logs/harmony.log) |
| Responsive typography | 8/8 combinations: no heading word splits, heading overflow, page overflow, broken images, page exceptions or HTTP failures. Seven section IDs and image sources preserved. [Summary](summary.json) |
| Currency | All four visible editorial amounts on one line in each combination. [After DOM measurements](after/checks.json) |
| Existing browser functional suite | 68/68 PASS, 0 runtime errors. [Results](functional.json), [log](logs/functional.log) |
| Other surfaces | 20/20 matched captures pixel-identical and DOM-identical: Agent homepage cover + Portal, Learn, Vet, Pawly; EN/RU at 1440 and 390. [Results and images](regression/checks.json) |
| Whole protected documents | 181/181 non-Agent built HTML documents identical after removing style blocks only. Eight case HTML files contain the changed case-scoped Agent CSS through the existing shared renderer; their actual document content is unchanged. [Per-document results](regression/documents.json) |
| Source hygiene | `git diff --check` PASS. No changes to shared tokens/motion, middleware, media assets, dependencies, other case copy or home components. |

The browser functional suite covers forward/reverse checkpoint guidance, complete sticky proof, keyboard zoom, focus trap/return, locale-correct media, complete policy inspection, native Quality disclosure, internal links, repeated reduced-motion toggles, tablet/mobile resize, anchor navigation, Astro route cleanup, browser-back restoration and complete reduced/no-JS rendering. Normal-motion and no-JS evidence is in `after/` alongside the matched static matrix.

## Reproduction

Use the existing dependencies and locally installed Playwright/Chromium, as the V3 harness does. No packages were added. Build before starting preview; use a free port. Run from the V3 worktree:

```text
npm run check
npm run build
npm run preview -- --host 127.0.0.1 --port 4416
node scripts/agent-premium-v3/v3.1/matrix.mjs after http://127.0.0.1:4416
node scripts/agent-premium-v3/v3.1/functional.mjs http://127.0.0.1:4416
npm run check:content
npm run check:css
npm run check:harmony
node scripts/agent-premium-v3/v3.1/summarize.mjs
```

Before was captured from the exact base build before source edits. A second detached checkout at `.tmp/v31-baseline` serves that same base on 4417 for `regression.mjs` and `supplement.mjs`. It reuses the installed dependencies through a junction, with separate build output. The supplementary scripts generate protected-surface comparisons and next-case/currency evidence. Build logs and final evidence are committed; temporary build output and checkout are excluded.

## Independent acceptance handoff

Implementation verification is complete in Windows Chromium. Physical mobile devices, Safari and Firefox were not exercised. Review the matched EN/RU sets, especially 320/360/390 Problem, Operating Model, Investigation, Checkpoint, Autonomy and Outcome, and decide visual acceptance independently. No merge to main, production deployment or self-approval was performed.
