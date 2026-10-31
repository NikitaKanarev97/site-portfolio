# TRASSIR Learn Portfolio Case V2 — implementation handoff

31 October 2026. **Ready for independent ChatGPT visual review; not design acceptance.**

- Implementation branch: `codex/trassir-learn-case-v2`.
- Prepared package / BEFORE baseline: `023880b10dd155dcb158b3b28afa5d020bdf0c93`.
- Isolated worktree: `D:/Claude-projects/Site-portfolio-trassir-v2`.
- Existing routes: `/work/learn/`, `/ru/work/learn/`. No new case slug.
- No merge to main, production deployment, Figma edits or product-source edits.

## Visible changes

1. Light editorial cover: large native Onest title, two-path thesis and real task-led Home, with separate technical-answer and programme-progress details.
2. Seven concise story beats replace the old repeated module rhythm. The original archive remains intact; the content-model diagram remains available through a native disclosure.
3. Reference and Player show their actual contexts. The ONVIF and archive-depth screenshots are explicitly different examples, not falsely presented as the same article.
4. Programme, explicit completion, independent reading/completion records, failed/passed scores and source-based recovery each have relevant documentary proof.
5. Native mobile captures and focused details replace desktop billboards. Every screenshot remains inspectable with the existing keyboard-accessible MediaZoom.
6. Learn's Home entry, bilingual metadata and verified locale-specific product/landing links continue into the existing five-case architecture.

## Matching BEFORE / AFTER evidence

Real localhost Chromium captures, DPR 1, native Onest fonts. First-viewport images
are exactly 1440×900 and 390×844; full-page images preserve the complete page.
The page is scrolled before full capture so lazy images and registered reveals
settle. Screenshots are unretouched. These are **portfolio page** captures,
separate from the supplied product evidence.

| Locale / viewport | BEFORE viewport | BEFORE full page | AFTER viewport | AFTER full page |
|---|---|---|---|---|
| EN · 1440×900 | [Open](qa/before/en-1440-viewport.png) | [Open](qa/before/en-1440-full.png) | [Open](qa/after/en-1440-viewport.png) | [Open](qa/after/en-1440-full.png) |
| RU · 1440×900 | [Open](qa/before/ru-1440-viewport.png) | [Open](qa/before/ru-1440-full.png) | [Open](qa/after/ru-1440-viewport.png) | [Open](qa/after/ru-1440-full.png) |
| EN · 390×844 | [Open](qa/before/en-390-viewport.png) | [Open](qa/before/en-390-full.png) | [Open](qa/after/en-390-viewport.png) | [Open](qa/after/en-390-full.png) |
| RU · 390×844 | [Open](qa/before/ru-390-viewport.png) | [Open](qa/before/ru-390-full.png) | [Open](qa/after/ru-390-viewport.png) | [Open](qa/after/ru-390-full.png) |

Critical sections, both locales and widths: [AFTER folder](qa/after/).
Examples: [architecture desktop](qa/after/en-1440-shared-material.png),
[guided path mobile](qa/after/ru-390-guided-path.png),
[workspace desktop](qa/after/en-1440-workspace.png),
[assessment desktop](qa/after/en-1440-assessment.png).
Additional 320/375/768, Home, zoom, graph and no-JS evidence: [controls](qa/controls/).

## Source map and image integrity

All 23 prepared originals were visually inspected; all 23 Git blob hashes match
[ASSET_MANIFEST.json](ASSET_MANIFEST.json). No originals were changed.
The 22 published lossless WebP crops total **503,434 bytes**. Exact source
rectangles, dimensions and sizes are in
[`src/data/learn-v2-media.json`](../../src/data/learn-v2-media.json).
Reproduce with [`scripts/learn-v2/media.mjs`](../../scripts/learn-v2/media.mjs).

| Published proof | Prepared source |
|---|---|
| Hero Home | `01` desktop, `03` native mobile |
| Hero answer / reference | `04`, `06` native mobile |
| Hero progress / programme | `08`, `09` native mobile |
| Player context | `10`, `11` native mobile |
| Learner continuation / count detail | `13`, `14` native mobile |
| Reader history / no programme credit | `15`, separate native desktop details on mobile |
| Failed result / cooldown | `18`, `19` native mobile |
| Passed score region | `20`, `21` native mobile |
| Read-only recovery / source link | `22`, focused submitted-answer/source detail on mobile |
| Archive | Existing `public/media/case-learn/before-catalog.webp`, untouched |
| Explicit completion | Existing localized `public/media/rebuild/learn[-ru]/completion-mobile.webp`; visibly identified as an earlier working-build interaction detail |

The new core screenshots are authentic **Russian UI**, including on the English
case. The cover explains this. Source branches are separate design iterations;
the case does not claim they are one integrated public release. No translated
image overlays or synthetic product UI were made.

Programme/account document panels and the passed-result document area contain
old public-status disclaimers. Published crops select real programme, progress
or score regions outside those areas. Nothing is painted over. The passed
result is explicitly captioned as a score-region detail; its document button
is not fabricated.

## Verification

- `npm run check`: **0 errors, 0 warnings**; 163 existing hints (including archived generated task files).
- `npm run build`: **37 pages**, successful.
- `npm run check:content`: **0 findings**, source and built public content.
- `npm run check:css -- /work/learn/ /ru/work/learn/`: **0 dead rules**, including both changed case routes.
- [Matching capture checks](qa/after/checks.json): EN/RU × 1440/390, zero page errors, failed requests, broken images or horizontal overflow; fonts loaded.
- [Focused browser verification](qa/verification.json): EN/RU × 320/375/768, reduced-motion visible content, keyboard zoom/current responsive source, Escape/focus return, keyboard diagram disclosure, Home card navigation, locale switch, local image/next-case links, canonical/hreflang inventory; both mobile no-JS cases.
- Normal-motion graph disclosure also inspected at 390; [capture](qa/controls/en-390-model-motion.png).
- Semantic tokens and mirrored motion files remain byte-identical and unchanged. `git diff --check` clean.

Reproduce from the built local preview with an installed Playwright runtime:

```powershell
$env:PW = 'file:///D:/Claude-projects/b2b-dssl/node_modules/playwright-core/index.mjs'
npm run preview -- --host 127.0.0.1 --port 4405
# In another terminal:
node scripts/learn-v2/capture.mjs after
node scripts/learn-v2/verify.mjs
```

Full command logs are retained locally under `tmp/learn/`; concise browser
results and actual evidence are committed here.

## Live links and remaining boundaries

Verified in the browser on 31 October 2026: Home, ONVIF Material and the
commissioning Trajectory in EN/RU, plus both localized landing entries — eight
HTTP 200 routes. The live entry screens match the relevant updated direction.
The RU landing's real route is `/prototypes/learn-landing/`; `/ru/` returns 404
and is not used. EN landing is `/prototypes/learn-landing/en/`.

Portfolio CTA links describe the verified reference-library entry and product
introduction. A fresh integration of **all six** reviewed product branches is
not established here; no claim is made that the live app reproduces every
account/assessment state pictured in the case. No product source was modified
or deployed to resolve that separate dependency.

Human usability, subject-matter accuracy, learning impact, screen-reader and
physical-device testing are not established by this implementation. No business
metrics, interviews, official accreditation or launch claims were added.

Remaining requested action: independent ChatGPT comparison of these actual
rendered pages with the current Agent Ops Console V2 and Partner Portal V2.
