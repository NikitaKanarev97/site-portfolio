# CLAUDE IMPLEMENTATION BRIEF — Pawly Home Cover Premium V1

## Non-negotiable objective
Finish **Stage 2 / fifth of five** on kanarev.com by upgrading only the **Pawly home featured case cover**. Let the first five seconds communicate: care with a real dog, a real human, and a truthful UI showing *confirmed* pickup and return. This is consumer-service editorial craft, not an enterprise dashboard.

Target repo: `NikitaKanarev97/site-portfolio`
Read research: `audit/pawly-home-cover-premium-v1/references/RESEARCH.md`.
Research branch: `research/pawly-home-cover-premium-v1-2026-11-02`, research HEAD `caefffbc62e68c610c04744a4f32a6ea129a4774`.
Integration parent: `42baa852a12302d5f89c3776ea83a16b6e0e9aad`. Includes B2B/Vet/Agent accepted cover edits. **Do NOT branch from ongoing unaccepted TRASSIR Learn branch.**
Create implementation worktree/branch `claude/pawly-home-cover-premium-v1-2026-11-02` from the above **research HEAD**. Recheck branch state and worktree cleanliness. Isolate every change and never reset other worktrees.

## Source truth and mandatory inspection
1. Read `src/components/WorkStage.astro`, `src/components/FeaturedCase.astro`, `src/copy/featured-work.ts`, `src/copy/case-art.ts`, `src/copy/cases/pawly.ts`, `src/copy/ru/cases/pawly.ts`, `src/copy/cases/story.ts`, `src/components/CaseScreen.astro`, `src/pages/index.astro`.
2. Inspect real BEFORE screenshots from V3.1 (EN/RU desktop/mobile) in RESEARCH.md. Capture your own matching BEFORE from exact implementation base; do not mistake the case-page cover for the homepage cover.
3. **Open, do not just read filenames:** 4 current genuine product screenshots imported as PNG in `audit/pawly-home-cover-premium-v1/references/product/`. Original lifestyle photo already in `public/media/art-direction/pawly/`.
4. Inspect official Rover dog walking + Rover help screenshot; Wag dog-walk report card, SCRN 4 лапы Pet services, InDrive completed trip, Airbnb upcoming trip screenshots (exact evidence and links in RESEARCH.md). For each comparator note what is adapted and what MUST NOT be copied. Do not pretend stock screens or 2018 Wag visuals equal 2026 premium craft.
5. Check current Pawly **Order Details V1.1** source REPORT and accepted/current product states. The V1.1 screenshots are submitted for independent review — no false assumption they are merged or fully accepted. Resolve any changes since source pinned before publishing the cover.

## Desired composition; test A vs B, don't auto-select
**A — Completed return proof (preferred)**:
- Single authentic photo of dog at home with walker on left; truthful excerpt from revised Order Details (`Baikal is home` / `Байкал дома`) on right.
- UI excerpt must clearly show: completed/confirmed return, actual 14:52, pickup 14:05 and return 14:52 photos + labels; walker identity only if legible at card scale.
- The current prototype screenshots include `All screens` preview chrome and a bottom demo/sticky dock; selectively crop them **as a whole**, excluding these non-product bits and later payment/review/timeline material. Record source SHA, exact pixel crop bounds, scripts and resulting file hash.
- Desktop: photo ~55–60% visual width, proof ~40–45%, align upper boundaries, avoid dead vertical whitespace, photo face and dog's eyes visible. Preserve original source image aspect or make honest photographic crop. Existing rounded corners/design tokens.
- Mobile: photo first, one compact **focused** proof segment next, then existing portfolio CTA; photo remains dominant in first scan, screenshot large enough to read. Do not stack two full-page screens or make a 1400px scroll wall.
- The same return photo will appear in photo and product UI, which may reinforce causality but also visually duplicate it. Compare and document whether an adjusted honest crop mitigates this.

**B — Active walk / truth before return**:
- Show a compact accepted Active Service 'in progress' UI with received pickup proof, estimated return, return not yet confirmed.
- Do NOT pair an in-progress product with a *drop-off/return* image — this would be chronologically false. Use source-consistent pickup image or no photo. Do not label sample route as live.
- This alternative may be clearer and more product-specific depending on mobile readability; make actual 1440/390 EN/RU variants and choose by legibility, narrative truth, visual confidence and size.

**A/B proof**: export actual browser comparison boards using identical conditions. Do not force extra implementation if A passes clearly and B adds little, but document evidence that B was considered and tested.

## Copy and meaning
- Preserve true service boundary: **choosing a photo is only a draft; successful send updates confirmed return.** A completed report is a record of confirmed evidence, not live delivery tracking.
- No payment processing, no charge/hold claims, no published review/support/insurance claim, no verified third-party screening or safety guarantee, no live GPS/route or chat/call.
- New local cover headline only if necessary; use one short, natural product proposition in EN/RU without duplicating exterior title/outcome and photo caption. Suggested conceptual direction: `The handover is only complete when there is proof.` / `Возвращение подтверждает не обещание, а фото.` (not mandatory; avoid implying photo merely selected equals proof).
- Existing photo has a baked English footer; RU variant removes it. Verify no nonlocalized captions and no caption-text collisions.

## Boundaries
- Author **Pawly Home-only** component `src/components/pawly/PawlyHome.astro` if it simplifies isolation, and gate its usage to theme=pawly and usage=home. Other usages/case-page WorkStage must stay unchanged.
- Limit to local copy, local cover media/derived crops, and narrowly scoped CSS/components.
- Never modify actual Pawly app repo or case page; this is Stage 2, Stage 3 case update comes later.
- Do not touch accepted B2B, Agent, Vet covers, Site Hero, Learn cover, global typography/tokens, nav, all five project orders, Figma, main or production.

## Evidence and QA
At least EN/RU 1440, 390 and 360; tablet 768/1024 when layout breaks. Compare matched BEFORE/AFTER card alone, with adjacent TRASSIR/Vet context, and complete homepage for nav/layout. Include initial viewport and full card. Check keyboard Tab focus and Enter case navigation, no-JS, reduced motion, meaningful alt, real image loading, 0 overflow, 16px/DS radius consistency, light/dark if the site supports. 
Run typecheck, production build, content/CSS/lint and browser functional smoke. Do not claim PASS without outputs. Store actual screenshot captures, no Photoshop retouching. Assert hero and all four other covers unchanged via DOM or pixel comparison; note which baseline branch was used.

Deliver:
- `audit/pawly-home-cover-premium-v1/v1/REPORT.md`
- `audit/pawly-home-cover-premium-v1/v1/BENCHMARK.md` — **section-by-section** comparison to exact R1-R6 and genuine Pawly S1-S4, with honest quality gaps
- `audit/pawly-home-cover-premium-v1/v1/{before,after,comparisons,logs}/`
- Crop source manifest `audit/pawly-home-cover-premium-v1/v1/assets/PROVENANCE.md`
- Actual branch/implementation/report SHA, direct GitHub links, A/B decision, QA results, known limitations.

Commit and **push** implementation and report to the isolated implementation branch; do NOT self-approve. No merge / deploy / Figma edits. Independent ChatGPT review determines ACCEPTED / ACCEPTED WITH BACKLOG / REVISION REQUIRED. Do not start Stage 3 or 4.

## Hard review questions
1. Does a recruiter grasp: "a pet is safely home and there is a dated photo record" within 5 seconds?
2. Is the image to evidence relationship clear without duplicate/overlapping/miniaturized screenshots?
3. Is the cover a premium consumer mobile-product presentation, matching strong relevant competitor hierarchy, not a SaaS template?
4. Is it truthful about the demo and product's implemented states?
5. Is mobile naturally composed and compact at 360/390, with readable UI, and clearly distinct from four enterprise covers?
