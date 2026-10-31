# TRASSIR Learn V2.1 — current media, rounded frames and consistent fields

31 October 2026. Ready for independent review; design acceptance is not claimed.

Implementation branch: `codex/trassir-learn-case-v2`. Previous V2 commit:
`4c245bc94d1fc02937ec8057d78d29e27812bb1d`.

The owner reported tight screenshot crops and obsolete accent edges, then
required uniform rounded frames and good fields on every side. This update
finishes that correction in Learn. Other cases are deferred to a separate pass.

## What changed

- Incorporated the relevant portfolio `main` update `49d2fb0` into this review
  branch. Its embedded Learn export records the clean integrated product source
  `e9ac4b075c4c5251dc10891ad201ecbf5405b727`; that is also the current remote Learn main.
- Replaced every current-product image used in the case and Home entry with a
  fresh browser capture from that export. The English case now has genuine EN
  interface images; the Russian case has genuine RU images.
- Replaced tight raster rectangles with complete semantic regions: material
  header, progress/action panel, first curriculum group and passport, both
  progress cards, result with its next action, and one whole wrong-answer record.
- Removed the old partial count strips and old completion-build dependency.
  Completion now shows the current unit's complete panel and real next action.
- All screenshot frames, including the untouched historical archive, use the
  existing `radius-media` / `radius-lg` = **16 px** and `frame-inset` = **16 px
  below md / 24 px from md**, equal on all four sides. MediaZoom keeps the same
  16 px rounding and 16/24 px fields. Product controls retain their actual styling.
- Removed the 22 superseded root-level public crops. The new 44 lossless WebP
  frames (22 per language, DPR 2) total **1,880,034 bytes**. Original prepared
  evidence remains untouched in the audit folder.

## Every media family reviewed

[Complete EN/RU media review and source links](refresh-2026-10-31/MEDIA-REVIEW.md).
[Exact capture manifest, regions, native widths and state provenance](refresh-2026-10-31/capture-manifest.json).
Runtime manifest: `src/data/learn-v2-media.json`.

The historical `public/media/case-learn/before-catalog.webp` remains unchanged;
its portfolio frame now follows the same rounding and field rule. All other UI
shown by LearnCase and LearnHome comes from the current integrated product.

Native details are captured as whole DOM elements with 24 CSS px of transparent
field. Contiguous page excerpts preserve native gutters and end in the gap
between complete blocks. In the Reference header/brief/navigation excerpt, the
neighbouring article body is excluded during capture while its layout space is
preserved, so no partial paragraph leaks into the lower field. No displayed text,
score, control, colour or border is repainted. No translated text is overlaid.

Account states come from the actual mock sign-in. Assessment outcomes are reached
through the real completion and quiz controls: 14/20 with four wrong and two skipped
answers; 20/20 with all answers correct. The pre-exam session is copied into
separate contexts to capture the two independent outcomes. These are product
example states, not learning-impact metrics.

## Portfolio evidence

Each viewport image is exactly 1440×900 or 390×844. Full captures preserve the
whole rendered page after lazy images and existing reveals settle.

| Locale / size | Previous V2 viewport | Previous V2 full | Current viewport | Current full |
|---|---|---|---|---|
| EN · 1440×900 | [Open](qa/after/en-1440-viewport.png) | [Open](qa/after/en-1440-full.png) | [Open](refresh-2026-10-31/portfolio/en-1440-viewport.png) | [Open](refresh-2026-10-31/portfolio/en-1440-full.png) |
| RU · 1440×900 | [Open](qa/after/ru-1440-viewport.png) | [Open](qa/after/ru-1440-full.png) | [Open](refresh-2026-10-31/portfolio/ru-1440-viewport.png) | [Open](refresh-2026-10-31/portfolio/ru-1440-full.png) |
| EN · 390×844 | [Open](qa/after/en-390-viewport.png) | [Open](qa/after/en-390-full.png) | [Open](refresh-2026-10-31/portfolio/en-390-viewport.png) | [Open](refresh-2026-10-31/portfolio/en-390-full.png) |
| RU · 390×844 | [Open](qa/after/ru-390-viewport.png) | [Open](qa/after/ru-390-full.png) | [Open](refresh-2026-10-31/portfolio/ru-390-viewport.png) | [Open](refresh-2026-10-31/portfolio/ru-390-full.png) |

The original pre-V2 baseline remains in [qa/before](qa/before/).
Current section closeups are in [portfolio](refresh-2026-10-31/portfolio/).
Examples: [guided preparation](refresh-2026-10-31/portfolio/en-1440-guided-path.png),
[mobile workspace](refresh-2026-10-31/portfolio/en-390-workspace.png),
[assessment](refresh-2026-10-31/portfolio/en-1440-assessment.png).

## Verification

- `npm run check`: 0 errors, 0 warnings; 163 existing hints.
- `npm run build`: 37 pages, successful.
- `npm run check:content`: 0 findings.
- `npm run check:css -- /work/learn/ /ru/work/learn/`: 0 dead rules.
- [Capture checks](refresh-2026-10-31/portfolio/checks.json): EN/RU × 1440/390;
  zero page errors, failed requests, missing images or horizontal overflow.
- [Browser verification](refresh-2026-10-31/verification/verification.json):
  EN/RU × 320/375/768, equal four-sided frame fields, all visible screenshot
  frames at radius 16, rounded MediaZoom, responsive source selection, keyboard
  open/Escape/focus return, diagram disclosure, Home navigation, locale switch,
  local links and both no-JS cases. Eight live entry routes also return HTTP 200.
- Semantic tokens, motion registry and their mirrors are unchanged. Source Learn
  code is unchanged. No merge into main or production deployment was performed.

Reproduce product media with the bundled public export served as static files:

```powershell
python -m http.server 4415 --bind 127.0.0.1 --directory public
# In another terminal, with an installed Playwright runtime:
$env:PW = 'file:///D:/Claude-projects/b2b-dssl/node_modules/playwright-core/index.mjs'
node scripts/learn-v2/capture-current.mjs
```

Portfolio capture and verification scripts accept `QA_OUT` to preserve earlier
review evidence. Full routine logs remain locally in `tmp/learn/refresh-*.log`.

Human usability, learning impact and subject-matter accuracy remain separate
validation work. Other portfolio cases' media framing is the next requested
review scope, after this Learn case is finished.
