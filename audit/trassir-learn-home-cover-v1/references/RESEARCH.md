# TRASSIR Learn — Home Cover Premium V1 · Research Pack (2026-11-02)

## Scope / source
- Target: TRASSIR Learn cover on the portfolio **homepage**, not full case and not Learn app.
- Baseline: portfolio commit `42baa852a12302d5f89c3776ea83a16b6e0e9aad` (accepted Agent Ops V1.1 integrated branch). Confirm current HEAD and protected branches before implementation.
- Source files: `src/components/learn/LearnHome.astro`, `LearnShot.astro`, `src/components/CaseScreen.astro`, `src/copy/cases/learn-v2.ts`, `src/data/learn-v2-media.json`, `src/components/FeaturedCase.astro`.
- Existing updated product media in `public/media/case-learn-v2/composition/{en,ru}/` and `public/media/case-learn-v2/current/{en,ru}/`. Source captures reference product SHA `e9ac4b075c4c5251dc10891ad201ecbf5405b727`.
- Earlier 2026 captures and storyboard: `audit/trassir-learn-case-v2/composition-v23/`, `audit/trassir-learn-case-v2/STORYBOARD.md` and `REPORT.md`.
- Existing V3.1 Home accepted in `review/homepage-premium-v3.1-accepted-2026-11-01`; accepted Vet / B2B / Agent Ops covers exist across branches. DO NOT overwrite them.

## Inspected BEFORE screenshots
- [EN 1440](https://github.com/NikitaKanarev97/site-portfolio/blob/42baa852a12302d5f89c3776ea83a16b6e0e9aad/audit/trassir-learn-case-v2/composition-v23/portfolio/en-1440-learn-cover.png)
- [EN 390](https://github.com/NikitaKanarev97/site-portfolio/blob/42baa852a12302d5f89c3776ea83a16b6e0e9aad/audit/trassir-learn-case-v2/composition-v23/portfolio/en-390-learn-cover.png)
- [RU 1440](https://github.com/NikitaKanarev97/site-portfolio/blob/42baa852a12302d5f89c3776ea83a16b6e0e9aad/audit/trassir-learn-case-v2/composition-v23/portfolio/ru-1440-learn-cover.png)
- [RU 390](https://github.com/NikitaKanarev97/site-portfolio/blob/42baa852a12302d5f89c3776ea83a16b6e0e9aad/audit/trassir-learn-case-v2/composition-v23/portfolio/ru-390-learn-cover.png)

### Findings
- Existing desktop standalone case screenshot has oversized TRASSIR Learn heading and good navy product entry + diagnostic article split. However the homepage `LearnHome.astro` **is a separate cover implementation**: prose + one native Home screenshot + two small labels. Verify the *actual homepage* at baseline; do not confuse case hero with home cover.
- The product story is **one source of knowledge for two different jobs**: reference answer NOW (no course completion for reading), and structured path with its own completion/assessment.
- Home task-category screenshot alone can look like a generic menu of four cards; without an article/path juxtaposition the key UX architecture is not self-evident.
- Mobile cover must not imitate a large educational app homepage. Prioritize readable concrete answer/path proof, small total height, and clear portfolio CTA.
- Avoid implying the new independent redesign is official shipped post-departure client work or that progress/learning impact was user-tested.

## Visually inspected local product source screens: authoritative P0
| ID | Exact real asset | Pattern, use and exclusion |
| --- | --- | --- |
| S1 | [Task-led Home EN desktop](https://github.com/NikitaKanarev97/site-portfolio/blob/42baa852a12302d5f89c3776ea83a16b6e0e9aad/public/media/case-learn-v2/composition/en/home-wide.webp) | Selection of site commissioning task and ONVIF answer. Strong category and navy identity. Don't let nav cards overwhelm core value. |
| S2 | [Task-led Home EN mobile](https://github.com/NikitaKanarev97/site-portfolio/blob/42baa852a12302d5f89c3776ea83a16b6e0e9aad/public/media/case-learn-v2/composition/en/home-mobile.webp) | Authentic mobile task selection. Alone cannot prove linked shared material/learning programme. |
| S3 | [ONVIF reference EN desktop](https://github.com/NikitaKanarev97/site-portfolio/blob/42baa852a12302d5f89c3776ea83a16b6e0e9aad/public/media/case-learn-v2/current/en/reference.webp) | Troubleshooting title, version, diagnostic summary, TOC and 'Included in programs'; best proof of article as independently useful source. Crop without loss of provenance. |
| S4 | [Learning path EN desktop](https://github.com/NikitaKanarev97/site-portfolio/blob/42baa852a12302d5f89c3776ea83a16b6e0e9aad/public/media/case-learn-v2/current/en/path.webp) | Purpose, syllabus, prerequisites/assessment and explicit 3/11 progress. Best proof of programme state; don't present as a different unrelated article. |
| S5 | [Reference EN mobile](https://github.com/NikitaKanarev97/site-portfolio/blob/42baa852a12302d5f89c3776ea83a16b6e0e9aad/public/media/case-learn-v2/current/en/reference-mobile.webp) | Reference header and diagnostic steps. Use focused authentic visible region; never squeeze 1482px height to thumbnail. |
| S6 | [Path EN mobile](https://github.com/NikitaKanarev97/site-portfolio/blob/42baa852a12302d5f89c3776ea83a16b6e0e9aad/public/media/case-learn-v2/current/en/path-mobile.webp) | 3/11 completed, current step + real continue. Don't imply opening the reference completes course progress. |
- Exact RU equivalents are under `/ru/` in source media; validate bilingual semantic parity.

## SCRN — inspected real screenshot pixels (supporting mobile hierarchy, not desktop design proof)
| Ref | Exact screen | Pattern adapted | Exclusion |
| --- | --- | --- | --- |
| R1 | [Yandex Practicum active course](https://scrn.gallery/app/practicum?screen=6a27f1eb742fff99d5f2c2c8) | Singular focal course, explicit progress and 'Continue' CTA; shows one clear next action. | Do not add invented progress state to Learn homepage or transplant playful art. |
| R2 | [Brilliant unit description](https://scrn.gallery/app/brilliant?screen=6a60097c1988545753a7b29d) | Learning outcome, scope and obvious entry into structured unit; clean information hierarchy. | Don't add gamification/streaks/coins. |
| R3 | [Ozon Job My learning](https://scrn.gallery/app/ozon-job?screen=6aa00ba21ee39bc45c24ab03) | Professional job-related courses grouped by practical context; hierarchy of tasks vs content. | Catalogue card tiles, decorative illustrations and promo blocks don't represent Learn's answer-now / programme-later distinction. |
- Weak/negative example inspected: [Ozon Job home](https://scrn.gallery/app/ozon-job?screen=6a97f8746087a0daaf813e01); many unrelated promos obscure training. Avoid.
- SCRN catalog is primarily mobile and consumer. This is not a claim that these apps' layouts equal B2B product quality.

## Desktop external context (secondary; do not invent screenshot inspection)
- Official [Microsoft Learn Training](https://learn.microsoft.com/en-us/training/) models module/course pathways and explicit progress.
- [Microsoft Learn documentation](https://learn.microsoft.com/en-us/docs/) is a separate information access mode from guided training.
- These are structural/IA references, not a claim we opened and verified a particular fixed screenshot. Prioritize P0 source images and the verified SCRN IDs.

## Section → reference → decision
| Section/state | Compare | Proposed design principle |
| --- | --- | --- |
| Outer cover / headline | Existing Home V3.1 + accepted B2B/Vet/Agent covers | Portfolio heading outside and unique blue/navy content surface inside. Avoid another enormous heading within stage. |
| Single story | S3 + S4 | Communicate **same resource, two journeys**. Article linked within path (ONVIF step 03), not two unrelated products. |
| Left / primary product content | S3 | Readable ONVIF technical answer, its version and real diagnostic value. |
| Right / supporting product content | S4/S6 | Real programme context, 3 of 11, current step or explicit assessment, not fake certification or fake success. |
| Task context | S1/S2 | Optional short label 'Commissioning' or existing task strip; avoid 4 equal mini-card labels dominating art. |
| Mobile hierarchy | S5/S6 + R1/R2 | First tell the one-line value proposition; then legible authentic source. Prefer short source excerpts or smaller linked learning-progress fragment rather than vertically immense full captures. |
| Localization | S3-S6 EN/RU | Source UI matches locale, no crossed-language screenshots or unnatural truncation. |
| CTA and semantics | Existing homepage card | Preserve click/hover/focus, keyboard and linked case page. No fake completion, promotion or outcomes. |

## Composition recommendations (to test)
- **A, preferred to test: Connected knowledge diptych.** One real ONVIF reference article, one real related learning path/progress; editorial linkage (outside UI) explains 'same resource, different rules'. Desktop visually weighted ~60/40, not three floating screenshots. Mobile: one dominant genuine article or a short native Home context paired with authentic linked programme fragment; do not squeeze text under 10px if possible. Each 'panel' is distinctly identified as a separate actual screen/state, never visually stitched into a fictional single product screenshot.
- **B, conservative: Task-first refinement.** Keep existing Home asset as hero; strengthen specificity and add minimal distinct programme evidence/context outside image only if useful. Might win if A becomes unreadably dense.
- Keep no more than two source UI surfaces in the cover. Product UI must remain legible at card size. Avoid excessive copy, fake dashboards, blue gradients, shiny glass, invented platform stats, mockup frames.
- Do not assume replacing current card is required: compare A/B honestly and retain existing if both worsen the outcome.

## Acceptance and deliverables
1. Capture current homepage BEFORE at EN/RU 1440/390/360 from exact integration branch with all 5 covers; make comparison crops.
2. Test both alternatives at 1440 and 390 EN/RU; record which truly wins (legibility, semantic clarity, cover height/rhythm).
3. Actual browser AFTER matched states EN/RU 1440/390/360 and tablet 768/1024. Full-homepage and adjacent cover evidence, no missing images.
4. Run type/content/CSS/build and navigation/focus/noJS/reduced motion, overflow, image loading.
5. Produce `audit/trassir-learn-home-cover-v1/v1/REPORT.md`, `BENCHMARK.md`, `before/`, `after/`, `comparisons/`, logs and base SHA/commit.
6. No self-acceptance, no merge, no production deploy, no Figma, no changes to Learn app, case page or other covers.
