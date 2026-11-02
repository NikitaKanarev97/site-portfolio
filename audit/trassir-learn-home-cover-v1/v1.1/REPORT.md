# TRASSIR Learn — Final Home Cover V1.1

02 November 2026 · **Independent acceptance pending.** Final planned corrective iteration.

Branch: `codex/trassir-learn-home-cover-v1-2026-11-02`.
Reviewed V1 / exact BEFORE: `eeda0ddfbe3a151f9cf863390d59acc9078b33bf`.
Implementation, evidence and this report are committed together on that branch.

[Visual gallery](index.html) · [Height measurements](logs/heights.json) · [Functional verification](logs/verification.json) · [Source-pixel provenance](logs/source-provenance.json).

## Result

The mobile card is 183–211px shorter, approximately 16–18%, with larger programme
content and larger journey captions. Both journeys remain distinct: an immediate
ONVIF answer, followed by a programme taken at the learner's own pace. A short
sentence explains that the same guide belongs to the programme while progress is
tracked separately. The portfolio case CTA remains below the stage with its
existing 48px target and keyboard focus.

The approved desktop A composition is unchanged: **both 1440px cover PNGs are
byte-identical to the newly captured V1 BEFORE PNGs**, including layout, typography,
copy and selected source pixels. No additional visual direction was explored.

## Actual before / after heights and direct screenshots

Measured browser `#work-learn` bounds: the **whole card**, from the outer title
through the portfolio CTA, rather than only the navy stage. Decimal values are
rounded to 0.1px here; JSON retains the browser's exact values.

| Locale / width | V1 px | V1.1 px | Reduction | Raw BEFORE | Raw AFTER |
| --- | ---: | ---: | ---: | --- | --- |
| EN 1440 | 792.9 | 792.9 | 0 | [PNG](before/en-1440-cover.png) | [PNG](after/en-1440-cover.png) |
| EN 390 | 1153.0 | 969.9 | 183.1 / 15.9% | [PNG](before/en-390-cover.png) | [PNG](after/en-390-cover.png) |
| EN 360 | 1119.7 | 919.7 | 200.0 / 17.9% | [PNG](before/en-360-cover.png) | [PNG](after/en-360-cover.png) |
| RU 1440 | 778.7 | 778.7 | 0 | [PNG](before/ru-1440-cover.png) | [PNG](after/ru-1440-cover.png) |
| RU 390 | 1203.0 | 992.3 | 210.7 / 17.5% | [PNG](before/ru-390-cover.png) | [PNG](after/ru-390-cover.png) |
| RU 360 | 1142.1 | 942.1 | 200.0 / 17.5% | [PNG](before/ru-360-cover.png) | [PNG](after/ru-360-cover.png) |

Mobile with neighboring projects:

- EN 390: [BEFORE](before/en-390-context.png) / [AFTER](after/en-390-context.png).
- RU 390: [BEFORE](before/ru-390-context.png) / [AFTER](after/ru-390-context.png).
- EN 360: [BEFORE](before/en-360-context.png) / [AFTER](after/en-360-context.png).
- RU 360: [BEFORE](before/ru-360-context.png) / [AFTER](after/ru-360-context.png).

Full homepages at all six matched states are linked in the gallery. Example:
[EN desktop BEFORE](before/en-1440-full.png) / [AFTER](after/en-1440-full.png),
[RU mobile BEFORE](before/ru-390-full.png) / [AFTER](after/ru-390-full.png).
Labelled side-by-side comparisons: [EN 390](comparisons/en-390-before-after.png),
[RU 390](comparisons/ru-390-before-after.png). These boards are derived comparisons;
the individual cover/stage/full PNGs are unedited browser captures. Context PNGs
are straight rectangular crops of the full-page captures.

## Focused changes

- Below the existing 768px breakpoint, hide the repeated internal promise. Keep
  the original outer heading and a concise localized connection sentence.
- Make mobile journey captions 16px (`ds-body-base`, previously 14px metadata).
  English: “Answer now · ONVIF” and “Programme · at your own pace”. Russian:
  “Быстрый ответ · ONVIF” and “Программа · в своём темпе”.
- Reduce the introductory copy-to-screens gap from `flow-text` to `flow-pair`.
  Retain the 24px separation between the two product figures, their separate
  labels and white surfaces, original stage padding and article image scale.
- Select one new Home-only programme crop on phones through CaseScreen's existing
  `srcNarrow` API. Its contents are approximately **15.1% larger** than V1 at the
  same image width, because the redundant outer capture field is excluded.
  At 390px the image stays 310px wide; at 360px it stays 280px wide.

Only runtime files `src/components/learn/LearnHome.astro`,
`src/copy/learn-home.ts` and two new localized Home crop assets change.
The dedicated composition map is updated in `ds/screens/home-learn-cover-v1.md`.
No shared component, token, font, motion, dependency, original screenshot or
existing media-manifest entry changes. The case pages and product repository
are untouched.

## Authentic source and crop

Accepted source: `public/media/case-learn-v2/current/{en,ru}/path-progress.webp`,
732×730, product revision `e9ac4b075c4c5251dc10891ad201ecbf5405b727`.
The existing manifest retains the original route and selector provenance.

Each new image extracts exactly **x48 / y48 / width636 / height408** source pixels,
encoded as lossless WebP. The whole 3/11 row, current step 04 including both title
lines, and Continue from step 4 are retained in their native positions. The crop
ends in blank canvas below the whole button, before the reading-history note.
There is no scaling during asset creation, repainting, UI rearrangement or splice.

`tools/crop.mjs` asserts equality of **every decoded RGBA pixel** between the
output and its source rectangle. Both locales pass. Original source hashes,
output hashes and decoded-pixel hashes are in `logs/source-provenance.json`.
The complete source captures remain in place and are still displayed on desktop.

## Visual comparison with the inspected Reference Pack

Used the supplied [RESEARCH.md](../references/RESEARCH.md) and its archived actual
screens; no additional external research. Visually inspected both final mobile
locales at 360/390, desktop, the mobile neighbor context and the comparison boards.

- **Yandex Practicum — Active Course:** its clear focal course and Continue
  informed the scan hierarchy. The revised Learn programme now exposes its genuine
  progress, current step and whole next-action button without the competing
  reading-history paragraph. This is the largest visual improvement over V1.
  [Inspected reference](../v1/comparisons/references/R1-practicum.png).
- **Brilliant — Unit Description:** its separation of outcome, scope and learning
  entry supports keeping the answer and structured programme visually distinct.
  V1.1 uses two readable journey captions and removes the extra headline layer,
  so the white product surfaces become the primary evidence sooner.
  [Inspected reference](../v1/comparisons/references/R2-brilliant.png).
- **Actual TRASSIR Learn:** the technical ONVIF title, diagnostic intent, version
  and programme state remain authentic. The navy identity and approved desktop
  weighting are preserved. Programme text becomes easier to inspect while the
  reference title/body retain their previous scale.

Implementation assessment: the focused hierarchy and spacing now follow the
strong reference patterns and resolve V1's specific mobile weaknesses. This is
a portfolio excerpt of two real product states; it is not a claim of pixel
equivalence to those native apps or an independent quality approval.

## Verification

Fresh production builds for both states, served separately on 127.0.0.1:4405
(V1) and :4406 (V1.1). Real Chromium 151.0.7922.34, DPR 1, reduced motion,
1440×900 and 390/360×844. Fonts were ready, images decoded and page reveals
settled before each capture. URLs and actual source selections are recorded in
`logs/before.json` and `logs/after.json`.

- **Six matched EN/RU states:** zero horizontal overflow, broken images, page
  errors or HTTP failures. No newly overflowing text or line clamps; visual review
  confirms complete visible text. The existing Onest title's ink extends its line
  box, with `overflow: visible`; this is unchanged and does not truncate text.
- **Desktop Learn:** 1440px cover PNG buffers are exactly equal before/after.
- **Hero and other four covers:** exact DOM SHA256 equality in all six states;
  every rendered descendant retains identical local position and dimensions
  (maximum geometry delta **0px**). Desktop and all content above Learn also have
  identical PNG hashes. Lower mobile cards shift up by the intended height
  reduction; fractional page positions can change their raster-edge hashes.
- **Eight keyboard/motion flows:** EN/RU × 1440/360 × reduce/no-preference.
  Tab order remains title → article → programme → portfolio CTA. Every stop has
  a visible solid focus outline. Enter opens the localized case; Back restores
  Home. Reduced motion removes the shared hover lift. All four link destinations
  remain the localized portfolio case, not simulated product controls.
- **Four JavaScript-disabled flows:** EN/RU × 1440/360. Narrative, images and CTA
  remain available; clicking the CTA opens the case.
- **Typecheck:** 0 errors, 0 warnings, 163 pre-existing/generated dependency hints
  ([log](logs/typecheck.txt)).
- **Build:** PASS, 37 routes ([log](logs/build.txt)); [V1 build](logs/before-build.txt).
- **Content:** 0 findings across the built routes ([log](logs/content.txt)).
- **CSS:** 0 dead scoped rules on checked routes ([log](logs/css.txt)).
- **Git whitespace check:** PASS.

Reproduction tools: `tools/capture.mjs before|after` with `PORTFOLIO_ORIGIN`,
`tools/verify.mjs` with the two origins above, `tools/crop.mjs`, and
`tools/evidence.mjs`. They reuse the existing local Playwright install via
`PLAYWRIGHT_REPO` (default `D:/Claude-projects/b2b-dssl`); no dependency was added.
Stored console logs have trailing whitespace normalized for Git; screenshot
evidence and recorded measurements are unchanged.

## Acceptance questions and remaining limits

1. **Noticeably more compact?** Yes: 16–18% less card height, without uniformly
   reducing the UI. RU 390 saves slightly more than the approximate 200px target.
2. **Both journeys clear?** Yes: immediate technical answer and self-paced
   programme, with independent progress stated once and genuine programme proof.
3. **Reference hierarchy and craft?** The corrective implementation follows the
   inspected patterns: a clear focal action, concise editorial context and distinct
   evidence surfaces. Final visual acceptance remains with the independent reviewer.
4. **Actual blocking issues?** None found in the requested checks. Independent
   acceptance is pending; this report does not self-approve the cover.

Nonblocking backlog only: incidental article metadata/utility text remains
smaller than its main title/body because it is inside an authentic screenshot.
The 360px card remains 920–942px tall; further material reduction would remove
useful article evidence or compromise legibility. No additional redesign started.

No merge, deployment, Figma change, product-repository change or unrelated
portfolio-page edit. Only remaining request: independent acceptance of this
final corrective result.
