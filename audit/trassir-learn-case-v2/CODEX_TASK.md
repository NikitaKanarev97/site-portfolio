# Codex handoff — TRASSIR Learn portfolio case V2 (implementation, not planning)

## Mission and limits

**Implement the final, portfolio-level visual and editorial upgrade of the EXISTING TRASSIR Learn case** at `/work/learn/` (EN) and `/ru/work/learn/` (RU). This is a site-portfolio case upgrade, **not** another redesign of the Learn product or a new case slug. The baseline portfolio already contains a functional Learn case and 5 case entries. Other flagship cases Agent Ops V2 and Portal V2 establish the desired design maturity. The source Learn screen redesigns were independently visually accepted, but not yet confirmed merged into a single deployed prototype.

**Implement in this run, do not stop at a research plan.** Reference package and source screenshots have been prepared in GitHub. Keep work cost proportional to one case. No more broad reference hunting.

## 0. Exact repository state, isolation and source files

- Portfolio repo: `NikitaKanarev97/site-portfolio`.
- **Prepared branch:** `codex/trassir-learn-case-v2-prep`; fetch and identify its exact HEAD. It descends from portfolio `main` commit `c96340edd6acddd5e689b038648e5156680ec42a`.
- Work in a **new isolated worktree** and a new implementation branch from the prepared branch, e.g. `codex/trassir-learn-case-v2`. Never reset, stash, force-push, overwrite local dirty main, merge unrelated branches, alter the accepted Agent/Portal implementation or change Figma.
- Read these prepared files COMPLETELY before changing code:
  1. `audit/trassir-learn-case-v2/REFERENCE_BOARD.md`
  2. `audit/trassir-learn-case-v2/STORYBOARD.md`
  3. `audit/trassir-learn-case-v2/ASSET_MANIFEST.json`
  4. Open visually the actual images in `audit/trassir-learn-case-v2/evidence/` (at minimum all 23 once; make decisions using them).
- Also read: `AGENTS.md`, `CLAUDE.md`, `CONTENT-RULES.md`, `ds/CONTRACT.md`, case/art direction docs, `src/copy/cases/learn.ts`, `src/copy/ru/cases/learn.ts`, `src/copy/cases/index.ts`, `src/copy/ru/cases/index.ts`, `src/pages/work/[slug].astro`, RU equivalent, `CaseStory.astro`, `src/components/agent/AgentCase.astro`, `src/components/portal/PortalCase.astro`, their CSS/shot components, `src/styles/tokens.css`, `src/scripts/motion.js`, and `ds/screens/case-learn.md`.
- **Important source revision:** `CONTENT-RULES.md` dated October 7 explicitly bans public “concept”/pet-project/disclaimer badges and synonymous devaluing statements, including alt/meta/images. It supersedes older Learn handoffs or copy that say to label the work an independent concept. Preserve truth about real DSSL/TRASSIR work and later author-led rework but never claim a commercial launch, employer accreditation, human participant studies or measured growth without evidence.

## 1. Immediate audit — preserve what already works

Inspect current rendered EN/RU Learn case, existing files and latest Agent Ops V2 and B2B Partner Portal V2 pages *before* rewriting. Current `makeLearnStory` in `learn.ts` is a substantial content/data starting point, not waste to delete. Verify which parts of current Learn case still serve the new story (existing knowledge-model diagram, archive catalogue, routes, media, UX argument). Keep useful content/diagram, discard repetitive text, outdated screenshots/crops or obsolete claims. If a custom `LearnCase.astro` renderer is needed for premium composition, make it case-scoped and adjust route dispatch only for slug `learn`. Shared `CaseStory`, motion foundations, global typography/tokens and other project cases should remain stable.

Do not create a second route. Home project card / next-case continuity, OG/meta, sitemap/hreflang and EN/RU remain correct.

## 2. Art direction: match the quality bar, not another project's aesthetics

Goal: an editorial portfolio story that works at two speeds: recruiter scans a full narrative from headings and images in under a minute; design manager can inspect purposeful UI evidence and trade-offs.

Concept: **"One knowledge system. Two ways to learn." / "Одна база знаний. Два пути к результату."**

Visual grammar:
- Native portfolio typography, strong H1 and concise supporting copy; light/cool-neutral page and large comfortable whitespace.
- A case-specific hero: calm text block above/alongside an art-directed **real UI composition** using Home as dominant visual, Material and Trajectory as secondary. Screens must be readable and not clipped arbitrarily; hero image should not look like a blurry generic SaaS banner.
- Evidence hierarchy: one convincing wide source screenshot per decision, a few intentional close-ups, paired comparison of Reference / Learning, no repetitive rows of identical full screenshots.
- Reuse original screenshot colors (dark blue Home + white Technical Material + neutral assessment) as visual dynamics rather than inventing a new app palette. Existing site brand/motion system must win over unrelated LMS visual motifs.
- Responsive 1440/390 and 768: intentionally choose different crops for mobile. Never shrink a 1440-wide screenshot to illegible 350px with interface labels that a reviewer cannot read; use native crops and supporting text with true context.
- Motions from the existing site only: subtle entrance, image reveal, registered transitions, reduced-motion respects visibility. No scrolljacking, autoplay, extraneous animation/3D, huge gradients.
- An unmistakable preview entry and sensible end CTA to the matching verified EN/RU prototype/landing, **without publishing**. Correct links to the currently deployed app must be validated, not simply assumed from the old case.

The real local Agent and Portal V2 cases are the primary stylistic benchmarks. External references and specific design usages are in the REFERENCE_BOARD; do not waste another full search iteration.

## 3. Story: follow prepared bilingual copy and section→image mapping

Implement the ordered STORYBOARD `00–07` (you may combine adjacent beats if a visibly stronger composition results, but preserve the logical proof):

0. Hero — product identity, role and 2-mode thesis, real staged UI.
1. Archived course-led entry point → task-oriented new Home (carefully labelled historical comparison).
2. Two ways in: fast technical answer vs structured preparation.
3. Shared material: Reference mode and Player use one technical article, different behavior; show content-model diagram where it adds explanatory value.
4. Learning path: visible programme promise, syllabus, progress, deliberate "Complete and continue".
5. Personal workspace: read history and done-unit count are independent; compare reader-only with learner.
6. Assessment and recovery: correct score vs passing threshold, unsuccessful vs successful, source-based review and permitted next actions.
7. Outcomes / trade-offs / next checks — only facts proven by code or browser QA, no fabricated user or commercial metrics.

EN and RU copy are fully drafted in `STORYBOARD.md`; improve language naturally, don't turn page into walls of copy, and don't invent new interviews or measured uplift. Each decision needs a visually legible real interface proof. Avoid reusing the same screen four times.

**Rules and honest claims:** 11 units, 20 questions, pass threshold 16, 2 tries and cooldown may be mentioned strictly as product rules in this example, never as externally validated outcomes. Separate passive reading from completed unit. Present historical employer work without reclassifying this authored work as a fictional client commission.

## 4. Media assembly — screenshots already transferred

- `audit/trassir-learn-case-v2/evidence/01…23.png` are already committed source screenshots, selected by ChatGPT from six accepted Learn branches. Exact paths and original commits are in the manifest. Do NOT have to fetch private Learn again to get these specific images.
- **They are RU captures from different, unmerged branches.** Don't relabel them as EN or one integrated live release. They are real visual design evidence. If an up-to-date EN version with the same UI is actually available in a separately verified integration build, use the local browser to capture genuine EN equivalents; do not fabricate translated text in image overlays. If not, English case can use authentically Russian images with a short honest caption explaining screenshot language. No fake EN screenshots.
- Historic image already in portfolio: `public/media/case-learn/before-catalog.webp` — keep untouched archive identity. It's not an apples-to-apples screen-state experiment.
- Optimize and art-direct only **selected** evidence for actual page: convert source PNG to clean WebP/AVIF as supported; size correctly, preserve text legibility; create dedicated desktop + mobile crops, not just resize; keep full originals in the audit folder. New published media in `public/media/case-learn-v2/` and optional localized variants if real local captures exist. Review crops yourself in browser. Do not copy all 23 into public build by default.
- The passed result screen contains demo/document disclaimer text. Check it and any other screenshots against the public content rules. Make an honest tighter crop or, only from real product source with accepted copy, capture a fresh shot; never paint over contradictory text to fabricate the UI.
- If publishing only a curated 8–11 core media placements is better, use fewer. Empty visual slots are not allowed; don't rely on broken old image paths.

## 5. Story implementation and page behavior

- Keep `slug=learn` and existing EN/RU route generation. If implementing `LearnCase`, add route dispatch for only `learn` in EN and RU pages, mirroring safe patterns from AgentCase/PortalCase. Do not touch unrelated case styles.
- Update new Learn case copy and home-card cover for both locales, ensuring same content structure, correct descriptions and alt text.
- Use real prototypes, but **verify freshness before representing them as the six accepted screens**. Old `/prototypes/learn/` may still reflect earlier Learn state. Do not modify or deploy the product source in this case task. Document if prototype integration is pending. Never claim the public app has the features just because the source captures do.
- Distinguish design outcome from product impact. No fictional customer quote, conversion rate, learning uplift, retention improvement, experiment, beta pilot or user testing. Internal pilot tests may be mentioned as QA evidence only.
- Link to learning product and landing in correct language if URLs are live and the experience is truthful, otherwise mark as integration dependency in the private report rather than fabricating functionality.
- Follow site `CONTENT-RULES.md` publicly; no "concept" labels in public copy, alt/meta/OG or displayed screenshots. Maintain accuracy about any training document as an authored interface, not state-approved certification.
- Accessibility: image alt conveys UI role, keyboard focus, links, headings order, contrast, reduced motion. Account for long RU phrases and 320/375 widths.

## 6. Focused verification and delivery; stop at independent review

Before editing capture matching current `/work/learn/` and `/ru/work/learn/` local browser BEFORE: viewport and full page at 1440×900 and mobile 390×844. After editing capture AFTER matched same sizes/locales. Also 768 breakpoint control, hero crop proofs and critical scroll sections. Use real localhost Playwright/browser (from installed project tooling) with same fonts loaded. These are **portfolio page screenshots**, separate from sourced Learn product screenshots above.

Use existing site commands from package.json for `check`, `build`, locale parity/content rules and minimal case-specific links/image checks. Zero new broken links, missing images, console errors and horizontal overflow. Verify screen links with no accidental cross-localisation. Don't consume time on a massive unrelated QA matrix.

Commit final implementation, optimized media and `audit/trassir-learn-case-v2/REPORT.md` (source map, before/after links, concise checks, limitations) to implementation branch `codex/trassir-learn-case-v2`; push to GitHub. **No merge into main, no production deploy, no Figma edits, no self-approval.** If preview exists, use only a confirmed real Vercel deployment tied to final commit; never guess a preview URL.

Handoff to independent ChatGPT visual review with commit SHA, exact local source/accepted assets, 1440/390 EN/RU BEFORE and AFTER, and 4–6 key visible improvements. The final review should compare the actual rendered case with current Agent Ops and Portal V2 case quality, not only a passing build.

**Now implement. Reference materials are already in this repository.**
