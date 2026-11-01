# PROMPT · Codex / Claude · Homepage Premium V3.1 focused corrections

**Purpose:** Correct only the independent V3 acceptance blockers, not a new portfolio redesign. Full verdict: [REVIEW.md](REVIEW.md).  
Repo: https://github.com/NikitaKanarev97/site-portfolio  
Reviewed implementation SHA: `c5fd121b86da8ebccf29110869d48d3d32f8531c`  
Implementation branch: `codex/homepage-premium-v3-2026-11-01`  
Independent review branch: `review/homepage-premium-v3-2026-11-01` (read-only reference; do not merge).  
Create separate `codex/homepage-premium-v3-1` or another isolated corrective branch from the reviewed implementation commit/head after checking branch divergence. Preserve all unrelated work.  
Evidence: `audit/portfolio-home-v3/stage-01/` and `audit/portfolio-home-v3/independent/`.

## Fix 1 — Mobile first fold must show meaningful real product proof (P0)

Current 360px EN/RU first fold has 17.6/11.7px of a dark image. At 390 EN only 61.6px of dark source; no recognisable approval action is seen. This is **not** the promised first-fold product evidence. Source screenshots:
- `audit/portfolio-home-v3/stage-01/screenshots/after/{en,ru}-360-first.png`
- `audit/portfolio-home-v3/stage-01/screenshots/after/{en,ru}-390-first.png`
- first Agent native stage `src/components/agent/AgentHome.astro` with existing `approval-consequences-mobile`.

Correct **mobile 360/390 layout**, not by shrinking H1 below the design system or deleting author identity / CV / email / allowed EN authorization. The first viewport should show a recognisable genuine product element: e.g., the beginning of the **$120 invoice credit panel**, not a featureless 12px black strip. Re-examine vertical rhythm, duplicate headings and copy priority, and the order of first case's mobile title/summary/native stage. A mobile-specific semantic composition is allowed; any visual reorder must preserve sensible assistive-technology reading order. Keep the authentic native source image, unretouched; no fake miniature/hero mockup, and no duplicated first cover. If meaningfully revealing the key decision at the fold causes cramping, produce 2 small real screenshot alternatives for independent selection instead of forcing a brittle CSS threshold.

Do not disturb 1440 desktop Option A, which substantially improves before/after. Preserve working anchors, image link/zoom semantics and built case pages.

## Fix 2 — Mobile hero CTAs must become deliberate (P1)

Current mobile primary 'Explore selected work' is dark while secondary CV/copy actions use red. Worse, the CV arrow drops out of alignment with its label and collides compositionally with Copy email. Also 1024 RU places copy email on a visually accidental third line. Inspect `src/pages/index.astro`, `TextLink`, `CopyEmail` and responsive `.hero__actions`.

Build a **stable, explicit grid or flex grouping** with clear primary/secondary hierarchy:
- primary selected-work link visually unmistakable and keyboard-accessible, not a fake button unless justified within existing DS;
- secondary CV and copy-email aligned on a deliberate row at 390 and 360; icons and focus/touch targets properly aligned, no hanging arrow or erratic wrapping;
- selectable address / EN authorization remain factual and readable, without turning the hero into a four-row contact form;
- intermediate 1024 RU gets an intentional layout if all three cannot fit in one row; no overflow / tiny text.
Use existing spacing/color tokens, not bespoke gradients/shadows/pills. Do not change unrelated navbar or shared component behavior across case pages.

## Fix 3 — 1024 RU Agent first-stage readability (P1)

At 1024 RU, native decision image is small next to a multi-line story headline. Compare the exact saved `ru-1024-first.png` with `ru-1440-first.png`. Test a clean wide proof stage beneath text at bp-md/bp-lg boundaries if that meaningfully improves hierarchy; don't change story facts, fake larger captured text, or stretch screenshot. Keep desktop 1440 accepted architecture and mobile 360/390 meaningfully intentional.

## Intentional non-fixes / backlog

- **Pawly frozen in full**: card, media, crop, text, alt, DOM, order, links and case page. Recheck actual screenshots/markup, not just Git diff.
- Vet currently uses old media. Do NOT update Vet artwork or text until source premium screen is independently accepted; log as a backlog, no invented clinical state or output.
- Inherited startup CLS 0.077 remains a separate work item if unchanged; avoid broad navbar redesign in corrective patch.
- Do not alter other four covers unless necessary to prevent a regression. Their existing accepted improvements should remain.
- No individual case page/other product repo/Figma/production/main merge modifications.

## Check and deliver

1. Record original SHA and screenshots before correction. Produce exact matched browser AFTER captures of 1440×900, 1024×900, 390×844, 360×800, EN/RU — first fold, first case and complete Home; screen-specific differences must be immediately visible in side-by-side comparisons.
2. Show full native context around financial action on at least one normal phone viewport without forcing a hard pixel magic number; name the actual visible elements.
3. Test navigation, case entry, CV, copy email success + failure, focus/keyboard, responsive image sources, loader/error fallback, reduced-motion, nav/menu, EN/RU, overflow, actual Pawly unchanged (including source and computed style).
4. Re-run npm run check/build and relevant repo scripts, browser QA, axe and if needed focus tests; log actual result, not a blanket all-pass.
5. Save `audit/portfolio-home-v3/stage-01/v3.1/REPORT.md`, matched screenshots and a short `REFERENCE-PAIRS.md` comparing V3.1 first screen to original Garri/HA/Dounar reference images already archived.
6. Commit + push separate corrective branch. Do not self-approve, merge to main, deploy production or edit Figma.

## Final acceptance question

Compare each relevant new first-fold screenshot with the actual saved strong portfolios: does the homepage now deliver **recognisable and compelling product design proof from its first screen** while preserving typographic confidence and honest product narrative? What is still behind those references? ChatGPT independently decides acceptance.
