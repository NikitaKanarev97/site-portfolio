# Claude implementation brief · kanarev.com Premium Portfolio V3

## Mission

Refine **the existing** personal product-design portfolio at https://kanarev.com to the art-direction and storytelling standard demonstrated by the archived concrete screenshots of Ilya Dounar / MyTeam, HA / Atlant Telecom, Garri Tonakanyan, Anton Blinkov, Yuriy Malugin, Tubik / Mosby's Files and the other supplied references. **Do not rebuild it or replace the accepted cases.** The task is to make a reviewer notice the product, understand the design decision and see real interface craftsmanship within a fast first pass.

Repository: https://github.com/NikitaKanarev97/site-portfolio  
Research branch: research/portfolio-premium-v3-2026-11-01  
Original inspected main SHA: 561e6830392b6e9a25e61e30cafe394586df3ff4  
Implementation branch: redesign/portfolio-premium-v3 (create from the latest agreed base only after checking divergence; DO NOT overwrite others' work).  
Reference pack: research/portfolio-premium-v3-2026-11-01/ — README, AUDIT, REFERENCE_MATRIX, SCREENSHOT_MANIFEST, references/, baseline/.

## MUST READ before touching code

1. Existing decisions: research/portfolio-benchmark/README.md, references-detailed.md, ha-deep-dive.md; research/portfolio-rebuild-2026-10-03; current ds/screens, design tokens, research case blueprint.
2. Current code: src/pages/index.astro, src/components/FeaturedCase.astro, WorkStage.astro; src/pages/work/[slug].astro; src/components/{agent/AgentCase,portal/PortalCase,learn/LearnCase,CaseStory}.astro; src/copy/home.ts, src/copy/ru/home.ts; src/copy/cases/index.ts; src/styles/*.
3. All 57 saved pack images. Compare reference and portfolio screenshots **visually**, not from file names or descriptions alone. Prior captures are evidence of their dated builds; take new screenshots for the exact implementation baseline.
4. Source-of-truth story data and provenance for Agent Ops, B2B Partner Portal, TRASSIR Learn, Vet Clinic OS, Pawly. Do not fabricate content or product functions.

## Phased delivery. Stop after each gate for independent ChatGPT review.

### P0 — Stage 1: homepage first impression (main high-impact job)

Goal: Preserve the strong headline and minimalist EN/RU visual system, but make a real product-design artifact visible at/near first 900px on 1440 and by the first natural viewport transition at 390. Currently the hero's first viewport is primarily text, portrait and names of projects (baseline/agent-ops EN desktop/mobile). Show 1–2 grounded alternatives with matching screenshots, then implement the stronger one. Do not force a noisy carousel; no new false metrics, exaggerated oversized slogans or mini illegible screenshots.

Audit hero height, type width, visual weight, portrait purpose, product proof, CTA hierarchy, Work anchors and mobile order. Preserve identity, specialization, copy-email and CV. Test first-time visitor: who is the designer, what products, what exactly does he do, why investigate?

Reference comparison: Garri (gr-thesis.jpg, gr-swap1.jpg); HA (ha-cover.jpg); Dounar (dn-head.jpg); Blinkov homepage.

Deliver stage 1 as its own commit and BEFORE/AFTER at EN/RU 1440x900, 390x844, 360 width. Do not implement stages 2–3 before independent visual direction is accepted.

### P1 — Stage 2: selected-work gallery and page signature

Improve **five** featured previews: Agent Ops Console, B2B Partner Portal, TRASSIR Learn, Vet Clinic OS, Pawly. Keep the approved case order unless there is a documented user-value reason to change it. Give every card a distinct editorial 'proof moment' and a readable crop. At 1440 it must survive normal scale; at 390 use actual native mobile captures or intentional separate mobile composition, never a squeezed desktop table.

Allow rearranging content/crops/facts and moderate per-theme presentation changes. Keep one coherent design system, keyboard access, clear clickable surfaces, real screenshot zoom, titles, legible proof labels. Do not move or replace source screen data with invented marketing art.

Reference comparisons: HA (ha-phones), Garri (gr-comp), Polyakov / Bugash visual variation, Alex Dyakov annotation language. Explicitly record for each preview: what the reference solves, what we adopted, what is inappropriate.

Deliver Stage 2 with all five before/after previews 1440+390 EN/RU and separate short change log.

### P1 — Stage 3: case-story polish, **not a complete rewrite**

Agent Ops, B2B and Learn have recently upgraded case-scoped rendering and verified screens. Preserve meaningful decisions, claims and real artifacts. Focus on (a) first fold information and image scale, (b) 1–2 highest-impact explanations, (c) rhythm/whitespace/media framing, (d) mobile native evidence, (e) end-of-case summary and next project. Remove redundant paragraphs rather than just shortening words.

Check each case for six answers visible in fast scan: product and user; task and constraint; designer role; key decision; resulting behavior or true verified evidence; status/limitations. B2B example '41/48' is a demo progress state, **NOT outcome uplift**. Agent's historical figures are not post-redesign metrics. No fictional testimonials or awards.

**Vet/Pawly:** Do not replace images until accepted premium source screens and commit SHAs from veterinary-clinic/pawly are verified. The old September screenshots in baseline/historical are only historic evidence. Updating these two case stories is a dependent step after their refreshed case media are pinned.

References: Dounar (dn-head, dn-impact); Garri (gr-thesis); Tubik (tb-texture); HA (ha-aims, ha-flow, ha-components).

### P2 — Stage 4: micro-polish and stability

Only once high-impact screens are accepted: motion pacing, focus and reduced-motion, text wrapping, crop seams, image quality, responsive navigation, availability/authentication/link states, email copying, keyboard/zoom semantics, EN/RU language parity, SEO/OG links and performance. No broad animation rebuild.

## Rules / non-negotiable guardrails

- Do not change source business rules or synthetic/demo fixtures to suit visual presentation.
- Do not invent shipped status, revenue/engagement improvements, research participants, interviews, user counts, awards, quotes, product integrations or capabilities.
- Distinguish paid client project vs working prototype vs concept; follow src/copy and source evidence.
- Don't use Mobbin; SCRN is secondary because this deliverable is a web portfolio, not a native app. Primary comparators are the **actually viewed, saved web case studies**.
- Preserve source/case components wherever quality is already strong. Remove visual noise, gratuitous gradients/3D, nested cards, microscopic UI, excess empty space, badly cropped panels and generic AI decorative motifs.
- Responsive 1440, 1024 where layout changes, 390 and 360; EN/RU, touch/focus/hover/disabled/reduced-motion. Keep semantic headings, alt and zoom.
- NO merge to main; NO production deploy; NO Figma edits; NO changes to other repositories without separate authorization. NO self-acceptance.
- Keep work isolated and do not overwrite dirty worktrees, accepted work or latest teammates' commits.

## Technical and screenshot proof required at every stage

- Record exact base/head SHA, branch, changed paths and screenshot states.
- Fresh real-browser BEFORE and AFTER at matched viewport, locale, font-loading, seed/fixture, scroll position and data; first viewport and full-page, desktop/mobile; tablet if affected.
- Confirm images decode, no horizontal overflow or clipped CTAs, correct zoom originals, keyboard+Escape/focus restoration, valid navigation/contact, offline/error states when present, no console errors, proper reduced-motion behavior.
- npm run check, npm run build, lint if available, any existing content and visual browser scripts; list precise commands/results, no unsubstantiated 'passed'.
- Required deliverables at audit/portfolio-premium-v3/{stage}/: REPORT.md, matched PNG/WebP screenshots, REFERENCE_COMPARISON.md with **actual image-to-image** notes, console/test evidence and code commit links.
- Claude reports what it built but DOES NOT approve the visual quality; independent ChatGPT review decides ACCEPTED / ACCEPTED WITH BACKLOG / REVISION REQUIRED.

## Final visual quality question — mandatory

Answer with grounded screenshot evidence, per major section:

**Does this version actually stand alongside Ilya Dounar, HA Interactive, Garri Tonakanyan, Anton Blinkov, Yuriy Malugin, Tubik and other relevant premium portfolios in clarity, visual execution and demonstrated product thinking?**

A technical success or successful build is not proof. For each major section, record one reference screenshot, our matched screenshot, visual parity/shortfall, honest differences, and one decisive improvement (or pass). If the screenshot is unavailable, mark NOT VERIFIED. Stop if the result remains materially less polished; do not relabel it premium to close a ticket.
