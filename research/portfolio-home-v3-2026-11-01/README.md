# kanarev.com · Homepage Premium V3 · IMPLEMENTATION-READY RESEARCH

**Date:** 2026-11-01  
**Source code baseline:** `main@561e6830392b6e9a25e61e30cafe394586df3ff4`  
**This research branch:** `research/portfolio-home-premium-v3-2026-11-01`, branched from research pack commit `504dfe5b78f8067ffdd1a19cdd6956e0107106ab`.  
**Scope:** homepage only, `/` and `/ru/`: hero, first work transition, Agent Ops / Partner Portal / TRASSIR Learn / Vet Clinic case tiles, subordinate Webflow builds, How I work and footer/contact. **Do not change Pawly artwork, crop, media selection, renderer or case content.** Maintain its presence/order and current working link.  
**No changes to any case pages or underlying product applications.**

## Research-first workflow / Open in this order

1. **[01-BASELINE-AND-PROBLEMS.md](01-BASELINE-AND-PROBLEMS.md)** — what the real repository and existing screenshot evidence show; current copy and code contracts.
2. **[02-DIRECTIONS-AND-DECISION.md](02-DIRECTIONS-AND-DECISION.md)** — three concrete homepage alternatives, tradeoffs and selected architecture.
3. **[03-REFERENCE-TO-SECTION.md](03-REFERENCE-TO-SECTION.md)** — every block to named reference screen and observable UI behavior.
4. **[04-STORYBOARD-CONTENT.md](04-STORYBOARD-CONTENT.md)** — section order, sample verified EN/RU messages and claims guardrails.
5. **[05-VISUAL-SPEC-AND-ASSETS.md](05-VISUAL-SPEC-AND-ASSETS.md)** — grid, content scale, responsive composition, assets, motion and Pawly freeze.
6. **[06-QA-AND-ACCEPTANCE.md](06-QA-AND-ACCEPTANCE.md)** — browser snapshots, regressions, visual comparison rubric, evidence outputs.
7. **[PROMPT-FOR-CLAUDE-CODEX.md](PROMPT-FOR-CLAUDE-CODEX.md)** — ready-to-paste implementation task, explicitly based on this pack.
8. **[concepts/](concepts/)** — six **annotated schematic SVG layout studies** (3 directions × desktop/mobile) + diagram overview, not product screenshots.
9. **[VISUAL-REFERENCE-BOARD.html](VISUAL-REFERENCE-BOARD.html)** — local side-by-side gallery referencing archived, actual source screenshots from the existing research pack.

## Evidence and provenance

The full [previous pack](../portfolio-premium-v3-2026-11-01/README.md) contains **57 pre-existing screenshot files** (25 reference snippets, 4 HA high-res originals, 24 EN/RU desktop/mobile screenshots of Agent/B2B/Learn, and 4 old historical shots). Those are retained, referenced by relative path and **not copied a second time**. Their [file-level hashes and provenance](../portfolio-premium-v3-2026-11-01/SCREENSHOT_MANIFEST.md) are in source control.

Visible source examples actually opened by the reviewer included: current-pinned source Home EN 1440/390; Agent case EN 1440; B2B Home and cover EN 1440/390; Learn case cover EN 1440/390 and Workspace; historical Vet/Pawly; Garri thesis/transfer comparisons, Dounar MyTeam intro/impact/diagram, HA cover/aims/phones, Tubik Mosby, and NordProtect phone contextual photography. The reference library contains more shots than the individually opened examples; do NOT pretend every file was newly re-inspected visually in 2026-11-01.

**No new live Chromium capture of production kanarev.com was possible in this chat.** Previous repo captures are historical browser evidence, not a live production snapshot. Claude/Codex must take fresh BEFORE from an exact checked-out code base and compare with final AFTER in a real browser.

## This is NOT a redesign blank check

- Keep the strongest existing system: large, restrained type, `#D43220` accent, warm neutrals, five-product ordering, real native product captures, accessibility and compact product stories.
- The real defect is delayed product proof in the hero. Improve information priority, art direction, media scale and readability before effects.
- Don't make unsupported business impact claims, fake testimonials, duplicate hero cases or unrelated fake functionality.
- Premium means **specific, readable, differentiated and credible**, not many gradients or moving cards.
- Implementation must stop for independent visual acceptance; no merge, production deploy or Figma modifications.
