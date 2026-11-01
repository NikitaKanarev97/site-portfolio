# 06 · Audit, browser QA and acceptance rubric

## BEFORE must be real, comparable and reproducible

1. Checkout the new implementation branch from the agreed latest base; record base SHA and verify clean worktree. Do not assume the research branch is production or currently merged main.
2. Take fresh Chromium BEFORE screenshots of '/' and '/ru/' at **1440×900, 390×844, 360×800** (1024 wide if intermediate layout touched). Capture first viewport + full-page + focused first four case previews + Pawly unchanged viewport.
3. Wait for fonts, images and stable animations; use pinned demo state/time if appropriate. Log the browser build, environment, viewport DPR and image hashes. Do not use historic research pictures as fresh before snapshots.
4. After implementation repeat exactly the same conditions for AFTER. No masking errors by art-directed croppings during QA.

## Technical QA
- Run npm run check, npm run build, applicable scoped CSS checks / content parity scripts, package lint if defined and browser smoke assertions. Record actual output, not a blanket pass claim.
- Check image decoding/404, layout overflow, art/caption legibility at normal device scale, no CLS from screenshots/media, mobile real native crops and LCP effect.
- Test links: Work anchor, all five cases, About, Contact, EN/RU, CV, copy email, Webflow demo dialogs, footer links. Keyboard focus, Enter/Space/Escape, dialog focus restoration, clear active states, touch targets, reduced-motion mode, screen reader alt/heading structure.
- Check issue states when relevant: broken image fallback, slow network/partial image loads, JS disabled where possible. Do not invent app UI error states absent on home.
- **Pawly freeze**: match exact existing media src, crop, alt, CTA, order, route, specialized markup plus matched 1440/390/360 screenshot pixel comparisons. A generic page spacing change can be accepted only if existing Pawly itself is untouched and readability not regressed.
- Check mobile text layouts in both languages; avoid jumping hero and clipping badges/labels, fixed-height hacks.
- Confirm image assets are from actual app builds with original SHA / EN-RU/state/role metadata. Vet new asset requires an accepted app snapshot and source commit.

## Independent section benchmark checklist (not generic 'looks premium')

| Section | Comparison image and decision question | Stop / revise if... |
|---|---|---|
| Main hero | our before vs Garri thesis vs HA cover | No discernible native work proof within desktop first viewport; mobile continues to be mostly five project names |
| Agent 01 | old real stage vs Garri decision | Still microscopic or duplicated as decorative hero + card |
| Portal 02 | B2B 1440/390 vs Garri comparison | Buyer difference or actual chosen action not understandable without zoom; 41/48 described as measured impact |
| Learn 03 | Learn 1440/390 vs Dounar diagrams | The two paths are not understandable at a glance, three small images compete |
| Vet 04 | latest actual source, old Sep baseline for historical context | Uses unsupported 'new' capture, old UI mislabelled or clinical context misleading |
| Pawly 05 | BEFORE Pawly vs AFTER Pawly | Any altered artwork, crop, content, route or broken interaction |
| Webflow demos | live BEFORE/AFTER vs old 'more' capture | Demos visually dominate products or role/capability wording is untrue |
| Process/footer | visible scans and keyboard/links | Bad hierarchy, fake claims, broken conversion or excessive decorative clutter |

## Evidence report

Create audit/portfolio-home-v3/stage-01/REPORT.md and matching:
- screenshots/before and screenshots/after for each EN/RU 1440/390/360 first+full; each of four eligible case tile closeups, Pawly regression;
- REFERENCE-PAIRS.md or contact sheets showing **real screenshot beside actual reference screenshot**, with per-section strengths, deficits, adapted decision and not-applicable features;
- TESTS.md/logs commands+results, source media mapping/SHAs, actual limitations and issues;
- COMPARE-PAWLY.md evidence that last cover was untouched;
- commit pushed only to isolated implementation branch; no self-approved claim.

## Reviewer verdict authority

Independent ChatGPT reviewer chooses ACCEPTED, ACCEPTED WITH BACKLOG, or REVISION REQUIRED after examining screenshots, code and report. A successful build does not imply parity with the screenshots of Garri, HA, Dounar, Blinkov or Victor. Explicitly answer: 'Is this premium? Does it match the relevant high-quality reference pages in typography, hierarchy, useful UI scale, legibility, art direction, and honest presentation?' with grounded image pair notes. If any relevant image source was not opened, mark NOT VERIFIED.
