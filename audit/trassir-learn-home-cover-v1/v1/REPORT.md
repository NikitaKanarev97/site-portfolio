# TRASSIR Learn — Home Cover V1

02 November 2026 · Implementation for independent ChatGPT review. **Acceptance pending.**

- Isolated branch: `codex/trassir-learn-home-cover-v1-2026-11-02`.
- Exact base: `02b974dea681be6c929517040a000998cf0ea857` (the supplied research branch).
- Exact runtime implementation SHA: `790d897657809c94d8e78f0f81b56d19c90016aa`.
- Integration parent: `42baa852a12302d5f89c3776ea83a16b6e0e9aad`.
- Worktree: `D:/Claude-projects/sp-learn-home-cover-v1`.
- [Evidence gallery](index.html) · [Benchmark / direct evaluation](BENCHMARK.md) · [Independent-review handoff](REVIEW-HANDOFF.md).

## Integration and protected scope

Fetched origin before choosing the base. Research HEAD 02b974d is a direct
continuation of the requested integration candidate. It contains B2B native-source
parity 04ae075, Vet Home 7991238 and Agent Ops 42baa85; ancestry was verified.
Local main 49d2fb0 and remote main 561e683 were also inspected. Local main's later
embedded-Learn refresh is a different line; it was neither imported into this
cover-only branch nor overwritten. Four pre-existing dirty task-report files in
the owner's original checkout were left untouched. No other worktree was reset,
stashed or edited.

Only runtime files LearnHome.astro and the new local src/copy/learn-home.ts change.
A dedicated composition map lives in ds/screens/home-learn-cover-v1.md. Shared
FeaturedCase, CaseScreen, ScreenSurface, LearnShot, WorkStage, global tokens,
hero, other covers, case pages, case copy, media manifest and product images
are unchanged from the exact base. Captured hero + Agent + B2B + Vet + Pawly DOM
SHA256 values match BEFORE in all ten responsive/locale states, including their
content and media attributes. [Verification](logs/verification.json).

## Result and A/B choice

Selected A — Connected Knowledge. The navy stage pairs one authentic ONVIF
reference with one separately labelled programme continuation. The source article
has its own version and diagnostic summary. The programme has genuine fixture
progress 3/11, current step 04 and explicit Continue. Neither opening a reference
nor clicking the portfolio image completes anything in the product. The source
screens are never presented as a single native app screen.

B retains the current task-led Home capture and two journey labels with the same
short new narrative. Actual A/B screenshots at 1440/390 in both locales are in
comparisons/candidates; labelled boards link from the gallery. B is 638px tall on
desktop, 872px EN / 907px RU on mobile. A is 793px / 779px desktop and 1153px /
1203px mobile. B wins compactness; A supplies direct evidence of the architecture,
which is the stated primary question. This selection is not independent acceptance.
See BENCHMARK.md for weaknesses and the comparison against the exact SCRN screens.

## Desktop, tablet and mobile

At 1440 the visual grid allocates approximately 2:1, with 768px reference and
366px programme images. Up to the existing bp-xl, a Home-local picture uses the
whole authentic mobile article header instead of compressing the wide article.
768/1024 show the two mobile fragments side by side. Phones stack them in reading
order. Original proportions, whole source boundaries and localized EN/RU assets
are retained. Transparent source details sit on the existing white surface, so
navy cannot leak through native text. No screenshot pixels were repainted, spliced,
filtered or newly generated. No new global tokens, motion or dependencies.

| Locale / viewport | BEFORE height px | AFTER height px | Horizontal overflow px | Final sources |
| --- | ---: | ---: | ---: | --- |
| EN 1440 | 638 | 793 | 0 | reference.webp + path-progress.webp |
| EN 1024 | 603 | 788 | 0 | answer-detail.webp + path-progress.webp |
| EN 768 | 831 | 742 | 0 | answer-detail.webp + path-progress.webp |
| EN 390 | 923 | 1153 | 0 | answer-detail.webp + path-progress.webp |
| EN 360 | 952 | 1120 | 0 | answer-detail.webp + path-progress.webp |
| RU 1440 | 641 | 779 | 0 | reference.webp + path-progress.webp |
| RU 1024 | 595 | 762 | 0 | answer-detail.webp + path-progress.webp |
| RU 768 | 831 | 742 | 0 | answer-detail.webp + path-progress.webp |
| RU 390 | 955 | 1203 | 0 | answer-detail.webp + path-progress.webp |
| RU 360 | 959 | 1142 | 0 | answer-detail.webp + path-progress.webp |

The headline, outcome, evidence footer and case CTA retain their accepted Home
structure. New concise story and labels are local to the cover. The unchanged
case origin explicitly describes the later work after DSSL/TRASSIR; the cover
adds no shipped-client, learning-effectiveness, certification-benefit or test-result
claim. Source progress is a fixture state, not a portfolio impact metric.

## Source attribution

All runtime imagery already exists in public/media/case-learn-v2/current/{en,ru}.
P0 desktop reference: reference.webp. Narrow header: answer-detail.webp. Supporting
programme: path-progress.webp. Product revision:
`e9ac4b075c4c5251dc10891ad201ecbf5405b727`.
The source manifest records ONVIF material and commissioning-path routes,
selectors, original rectangular bounds, native CSS widths and SHA256 hashes.
[Exact provenance](logs/source-provenance.json). Existing Home assets were used
only for B; the complete path and reference-mobile were also inspected as context.
No case media or existing manifest entries changed.

The three SCRN images were retrieved by exact screen ID and visually inspected
again in this session. Their unmodified returned images are in comparisons/references.
No visual claim is made for an unavailable reference or an uninspected Microsoft
screenshot. The supplied [research pack](../references/RESEARCH.md) remains intact.

## Browser evidence and technical outcomes

Final authoritative PNGs come from real Chromium renders, DPR 1, reduced motion,
1440/1024/768 × 900 and 390/360 × 844, EN/RU. BEFORE is a production build of the
exact original LearnHome and unchanged baseline runtime; AFTER is the final
production build. A separate output directory isolates the baseline build. Browser
version, URLs and complete measurements are in logs/before.json and after.json.
Both use equal conditions, eager-decoded images and a full-page reveal pass.
The in-app browser was also used to inspect the live layouts. Its early viewport
and HMR captures were superseded by the repeatable, stable browser captures.

Full-page, isolated cover, stage and adjacent-project context PNGs are in before/
and after/. Context images are plain rectangular crops of full-page evidence.
Comparison JPEGs are explicitly labelled derived boards. Nothing was retouched to
hide a defect. Keyboard/no-JS images are additional states, not matched BEFORE/AFTER.

- Typecheck: 0 errors, 0 warnings; 163 dependency/generated-code hints. Full output: logs/typecheck.txt.
- Production build: PASS, 37 routes; logs/build.txt. Baseline build: logs/before-build.txt.
- Public-content validation: 0 findings; logs/content.txt.
- Scoped CSS: 0 dead rules across checked routes; logs/css.txt.
- Ten locale/width states: zero overflow, browser errors, failed HTTP responses or broken images.
- Eight keyboard/motion flows: title → reference → programme → CTA; visible solid focus outlines;
  Enter opens the localized case; Back restores Home; reduced motion disables the shared hover lift.
- Four genuine JavaScript-disabled flows: both images and static narrative visible, CTA navigates.
- All four cover links preserve localized case destinations. Both screen links enter the case,
  rather than impersonating the pictured product buttons. [Full functional results](logs/verification.json).

Reproduce with tools/capture.mjs (PORTFOLIO_ORIGIN plus before/after/B), verify.mjs
and evidence.mjs. Playwright is reused from the existing local b2b-dssl QA install;
no portfolio dependency changed. The baseline and candidate source snapshots in
tools/ are audit inputs, not additional public components.

## Limitations and review request

Mobile's complete card is roughly 230–248px taller than BEFORE, and 281–296px
taller than B. At 360 its primary image is 280px wide. Native metadata and the
programme's reading note remain small. Desktop primary-body text is approximately
10.8px at 1440; sidebar annotations are smaller. Mobile shows the complete article
header, so the link to a programme is explained editorially rather than demonstrated
in its omitted sidebar. There is no new recruiter study or effectiveness measurement.

**The result still falls short of the strongest inspected premium references in
mobile scan speed and fine-text readability.** Its real product evidence,
distinct technical identity and explicit journey boundary justify handing A to an
independent reviewer; they do not justify claiming equal native-app polish or
self-acceptance. The reviewer should decide whether the architecture evidence is
worth the additional mobile height. No merge, production deployment, Figma edit,
Learn product/case edit or next-cover work was performed.
