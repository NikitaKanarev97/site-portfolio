# TRASSIR Learn — Premium Portfolio V3: research pack (2026-11-02)

Status: **pre-implementation research**, prepared from code, repository documents and opened pixel screenshots; **not an implemented design or independent acceptance**.

## Pinned source and boundaries
- Portfolio repository `NikitaKanarev97/site-portfolio`, base `561e6830392b6e9a25e61e30cafe394586df3ff4` (main at research time); research branch `research/trassir-learn-portfolio-premium-v3-2026-11-02`.
- Product repository `NikitaKanarev97/learn`, inspected main `e9ac4b075c4c5251dc10891ad201ecbf5405b727`. V2.3 portfolio proof is already based on this integrated source, EN and RU.
- Accepted-but-separate Agent Ops V3 review branch `redesign/agent-ops-portfolio-premium-v3` at `dd717b0548dbd33d6ca21008dcb8fd796171b12d`. Use as visual benchmark **read-only**, not a reason to cherry-pick unrelated changes. B2B V3 is concurrent: keep Learn work isolated.
- Public case routes: `/work/learn` and `/ru/work/learn`. Current renderer: `src/components/learn/LearnCase.astro`, media component `LearnShot.astro`; copy: `src/copy/cases/learn-v2.ts` plus `src/copy/ru/cases/learn-v2.ts`; media manifest `src/data/learn-v2-media.json`; original archive `public/media/case-learn/before-catalog.webp`.
- Existing V2.3 evidence: `audit/trassir-learn-case-v2/composition-v23/portfolio` (real EN/RU desktop/mobile sections and full-page). Capture provenance: `audit/trassir-learn-case-v2/refresh-2026-10-31/MEDIA-REVIEW.md` and `capture-manifest.json`. Product versions and author relationship: `learn/PROJECT-CONTEXT.md`, `learn/CLAUDE.md`; portfolio public language: `CONTENT-RULES.md`.

## What the real product does (source-checked)
Two jobs: specialist seeking an immediate technical answer, and specialist following a structured qualification-preparation programme. Task-led Home routes to reference article or programme. Material has independent URL/version/date, and can be referenced from programmes. `history` records reading, whereas `progress[].doneUnitIds` records explicit unit completion; opening/scrolling does **not** grant programme credit. A programme shows purpose, workload, ordered curriculum and assessment rules. Assessment fixes a stored attempt; failed state exposes score, threshold, retry/24-hour cooldown, practice and sources; passed state offers a training document. Demo stores within browser session, no backend/cross-device sync. Documentation and terminology must not suggest official DSSL qualification. Source facts: `learn/ia/sitemap.md`, `learn/PROJECT-CONTEXT.md`, current V2 copy and media.
Current demo captures show an 11-unit path; illustrative states include 9 read/3 of 11 completed and 3 read/no programme credit, and 14/20 unsuccessful vs pass mark 16/20; 20/20 successful. These are **product fixture numbers**, not real learner impact.

## Opened visual evidence: V2.3 BEFORE critique
Opened `en-1440-learn-cover.png`, `en-390-learn-cover.png`, `en-1440-shared-material.png`, `en-1440-guided-path.png`, `en-1440-workspace.png`, `en-1440-assessment.png`, `en-390-assessment.png` in actual pixels. See [reference map](REFERENCE-MAP.md) for exact links.
1. Hero: authentic task-led dark blue product stage + complete ONVIF resource header are credible, but design authorship and role sit below the first narrative anchor; there is no strong immediate WHY/WHO proof. Mobile first screen shows only task tiles, while the second real product context disappears.
2. Problem: the old catalogue is correctly archival, but explicit `archive → task → consequence` diagnostic composition can be stronger. Do **not** imply controlled A/B or that the archive represents a shipped BEFORE/AFTER pair from the same version.
3. Architecture: `learnContentModel` already represents the key breakthrough but is hidden in `details`, and paired Reference/Player screenshots depict **two different resources** (ONVIF vs archive retention). Do not claim those two screenshots show the **same** article; either choose true equivalent source states or explicitly explain that they demonstrate two contexts, and let the model show reuse.
4. Guided path: programme left + completion panel right provide concrete proof but are both UI cards of similar visual texture. Need stronger title, highlight commitment/next action without inventing an image.
5. Two progress records: two nearly identical, very small My Learning panels in a two-column layout; actual 9/3 and 3/none logic disappears when scanning. Make one readable focal panel plus compact counterexample, not a second miniature full page.
6. Assessment: authentic pass/fail + answer review is high-value, but mobile is a long stack of cards and paragraphs. Show failing recovery as hero evidence, pass as a secondary contrasting state, and connect the reviewed answer back to the source.
7. Ending: truthfulness/tradeoff is present but not sufficiently connected to user-visible consequence or end-to-end ownership. Browser QA is not customer impact.
Global: preserve neutral/cobalt original product aesthetics; no flashy learning gamification, exaggerated SaaS framing, generic template bento or decorative fake UI.

## Recommended V3 thesis and hero
**One knowledge system. Two distinct commitments.** Retain established public promise **"One knowledge system. Two ways to learn."** The editorial product argument: reference reading solves a present problem; programme completion records demonstrated steps. One content model supports both, without granting learning credit for a page view.
Top screen must communicate, quickly: TRASSIR Learn, specific user job, authored rework and role, supported UX outcome, one *large readable* current product stage and one supporting complete native proof. On mobile: text and evidence of dual entry before long contextual prose. No unverified KPI or customer rollout claim.

## Proposed sections and editorial rhythm
0. Hero — claim, role/origin, one large task-oriented Home, one complete answer/progress detail.
1. Old course-first entry → actual specialist jobs — one archived catalogue crop, two short job questions, one restrained improvement statement. Clear original/source attribution.
2. Two paths, one content architecture — **visible** `learnContentModel` connected diagram and one substantive reference resource, not hidden by default. Break reading vs completion rule visually.
3. From job to next step — authentic Home → ONVIF answer, programme choice; no four fake personas. Possible focal reader journey.
4. Committed learning — complete programme snapshot (11 units + pass rule) and independent `Complete and continue` proof; explicit cost/tradeoff.
5. Two honest progress records — one readable learner state 9/3/11 with a reader state 3/no-credit treated as a compact comparison; no invented percentage.
6. Assessment, recovery and results — failed 14/20 vs 16 threshold, actual reviewed error/source, passed 20/20 and training-document action. Avoid treating official accreditation as established.
7. Outcome/ownership — what was designed, what was technically checked, what remains unvalidated; one compact decision → evidence → tradeoff summary, prototype/landing links and existing CaseNext.

For a recruiter skim, chapter titles alone should convey the full story. Prefer ~5–7 substantial original screenshot instances plus purposeful paired details; can use more crops if each adds an independent fact. Target a clear reduction in repeated screenshot framing and prose compared to V2, not arbitrary image count. Each major chapter must use a different visual device: archival comparison, diagram, wide source excerpt, focal action, counterexample, results.

## Integrity and QA
- Product source and portfolio are separate; do not edit product app for case visuals or imply a released DSSL redesign. Original work at DSSL/TRASSIR is real; the shown 2026 work is a later author rework. Do not publicly downgrade it to a "concept" / "pet project" / "only prototype" status tag (`CONTENT-RULES.md`); equally no invented client sign-off, official credential, studies or KPI uplift.
- EN images must be actual EN, RU actual RU. No raster translation or synthetic UI data. Archive is genuinely RU in both locales; label its origin.
- If custom explanatory arrows or cards are added, they live outside actual captured UI. Mark newly created visual maps as editorial reconstructions, not photographed historical process.
- Preserve established 16 px screenshot radius, equal 16/24 px frame insets *unless* an intentional documented V3 variation is visibly better; no clipping, microscopic screenshots or overlapping floating cards.
- Test EN/RU at 1440, 1024, 768, 390, 360 and 320 as needed; matched BEFORE/AFTER 1440/390 at minimum, viewport + full page; zoom, focus, Escape, anchors, locale routing, links, reduced motion, no-JS access, no overflow, content validation, scoped CSS, Astro check and build. Scope only Learn case and its case-specific media/copy. No merge/deploy/Figma updates.
