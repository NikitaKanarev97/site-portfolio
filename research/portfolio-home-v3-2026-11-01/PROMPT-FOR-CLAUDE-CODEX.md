# READY-TO-PASTE · Claude Code / Codex · Homepage Premium V3

Implement the FIRST STAGE of the personal portfolio redesign: the full **homepage** at https://kanarev.com, EN '/' and RU '/ru/'. This is an evidence-led visual and narrative upgrade, NOT a rebuild and NOT a redesign of the individual case pages.

## Repo, scope and immutable source

Repo: https://github.com/NikitaKanarev97/site-portfolio  
Research branch: research/portfolio-home-premium-v3-2026-11-01  
Primary source-base reviewed: main@561e6830392b6e9a25e61e30cafe394586df3ff4  
Research commit: read latest head of research branch, not an assumed frozen SHA.  
Create an isolated implementation branch (suggestion: redesign/portfolio-home-premium-v3) from the latest approved main/base after comparing SHA and ensuring no uncommitted/parallel work is overwritten. Do not merge research into main for this task. If main differs, document affected content before writing.

**Do not modify Pawly's cover or its source.** Pawly is the fifth/last case and its application work is ongoing. Its homepage image, crop, component, text, alt, CTA, position and route must remain unchanged. The first FOUR other covers — Agent Ops, B2B Partner Portal, TRASSIR Learn and Vet Clinic OS — may be improved, but only with accepted real native screen captures and grounded business details. Vet requires verification of latest accepted screen source, otherwise keep existing media.

## Read the committed research FIRST — it is the design brief

- research/portfolio-home-v3-2026-11-01/README.md
- 01-BASELINE-AND-PROBLEMS.md
- 02-DIRECTIONS-AND-DECISION.md
- 03-REFERENCE-TO-SECTION.md
- 04-STORYBOARD-CONTENT.md
- 05-VISUAL-SPEC-AND-ASSETS.md
- 06-QA-AND-ACCEPTANCE.md
- concepts/ (three directions × 1440 and 390 layouts, marked wireframes, NOT final product captures)
- VISUAL-REFERENCE-BOARD.html (image-to-image gallery)
- prior 57 screenshot research pack at research/portfolio-premium-v3-2026-11-01/ (SCREENSHOT_MANIFEST, references, baseline).

Review actual screenshot images, not filenames or description text only. The primary visual benchmarks are Dounar MyTeam, Garri Tonakanyan, HA Atlant Telecom, Anton Blinkov, Victor Vorontsov and Tubik. Use existing actual reference pictures; do not redo a broad web search or rely on Mobbin. Do not claim screenshots from reference sites you did not open.

## Implementation direction LOCKED: Option A — Editorial Bridge

Keep the strong current 'Complex systems. / Clear decisions.' and EN/RU equivalent, warm off-white base, #D43220 accent, NK navigation and restrained typography. Redesign hero-to-work transition so a visitor sees actual **recognizable product UI in or near the first viewport**, not only a photograph and five bare project names.

- On desktop (~1440×900), compact the current oversized portrait + five-link index into an elegant small byline/portrait and clearer work navigation. Build a meaningful 'Selected work → 01 Agent Ops' editorial transition and start its real consequence/approval UI stage in the first viewport, ideally at least ~180px visible by y=900. No duplicated fake hero device.
- On mobile (390/360), compose independently: identity → headline → short specificity and useful CTA → first true native mobile product image near the fold. Do not merely shrink the desktop grid. Keep EN/RU legible.
- Use a restrained single introduction/reveal, not scroll-jacking or giant animated carousels. Keep semantic navigation and accessible actions.
- If Option A cannot meet the visual target without unacceptable type shrink or cramped layout, report the screenshot problem and a B split-proof experiment; do NOT switch strategies or implement C mosaic unilaterally.

## Four cover improvement directions

1. **Agent Ops** — amount, customer message, human consequence together, approved native source and meaningful crop; paid client / tested accepted prototype phrasing, NOT launched user-impact metrics.
2. **B2B Portal** — source row, ambiguity, two SKU options, buyer decision; enlarge relevant real details; 41/48 is synthetic progress state not measured uplift.
3. **TRASSIR Learn** — reference-answer-now versus guided learning; avoid all-equal small screenshot cards. Use current accepted source/captures.
4. **Vet Clinic** — a clinical visit/record or medication verification that shows responsibility; MUST confirm accepted code SHA/real screen before replacing older screenshot, or preserve current.

**Pawly is a strict no-touch item, including its cover and position.** Do not fix/reformat it or adjust Pawly-specific media in this pass.

Then polish the remaining homepage modules *only where materially necessary*: selected-work sequencing, Webflow 4-demo strip, 3-step process and footer/contact. Preserve truthful roles and all working dialogs, CV/email, EN/RU links, routes, image zoom, motion and actual value statements. The approved case-page layouts and contents, app repos and design system must not be broadly revised.

## Development paths to inspect

src/pages/index.astro, src/components/FeaturedCase.astro, src/components/WorkStage.astro, src/components/{agent/AgentHome,portal/PortalHome,learn/LearnHome,VetStage}.astro, src/copy/home.ts, src/copy/ru/home.ts, src/copy/featured-work.ts, src/copy/cases/index.ts, src/styles/*, ds/screens/home.md, PageShell, Navbar, CopyEmail, ProjectDialog, and relevant image manifests.

## Deliverables and mandatory proof

1. Before implementation record the actual base SHA and take real Chromium BEFORE at 1440×900, 390×844, 360×800 (EN/RU) of first and full-page; capture all five cards including Pawly.
2. Implement Option A with source-based assets, no invented UI, no unsupported business numbers, no deceptive status claims. Record exact changed paths.
3. Take matched real browser AFTER first/full page and focused four cover sections, EN/RU, desktop/mobile; Pawly before/after unchanged. Show image-to-image comparison with the actual saved reference shots for EACH important section.
4. Run npm run check, npm run build, available lint and browser tests. Verify Work/Case/About/Contact links, CV, copy email, EN/RU, dialogs, keyboard, focus restore, reduced-motion, 360px overflow, responsive image decode, load/layout shifts.
5. Save audit/portfolio-home-v3/stage-01/REPORT.md, REFERENCE-PAIRS.md, screenshot gallery and logs; include SHA, reproducible commands, image-source provenance and limitations; commit and push isolated implementation branch.
6. **Do NOT self-approve, merge main, deploy production, modify Figma, touch other repositories or implement non-home case pages.** Submit for independent visual acceptance by ChatGPT.

## Required final answer from implementer

Answer separately with screenshot evidence: (A) Does the homepage now feel premium? (B) How close is it to the actually inspected Dounar/HA/Garri/Blinkov/Victor references, block by block? (C) Which sections still fall short and why? (D) Did Pawly remain unchanged? (E) Which tests and viewport captures were done, and what was not verified? No invented 'pixel perfect' or 'premium accepted' self-verdict.

Quality must come from meaningful composition, real product screens, legible UI, strong storytelling and honest proof — not the number of visual effects.
