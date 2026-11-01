# Independent art-direction acceptance · Homepage Premium V3

**Review date:** 2026-11-01  
**Implementation commit:** `c5fd121b86da8ebccf29110869d48d3d32f8531c` on `codex/homepage-premium-v3-2026-11-01`  
**Independent verdict: REVISION REQUIRED — targeted V3.1.**  
**Scope:** kanarev.com Home EN/RU only, real saved image evidence, actual changed source, QA and reference contact sheets. No live production review or physical-device browser testing claimed. This review branch preserves the implemented code unchanged and documents the decision.

## Evidence personally opened

- [BEFORE EN 1440](../stage-01/screenshots/before/en-1440-first.png) → [AFTER EN 1440](../stage-01/screenshots/after/en-1440-first.png)
- [BEFORE EN 390](../stage-01/screenshots/before/en-390-first.png) → [AFTER EN 390](../stage-01/screenshots/after/en-390-first.png)
- [AFTER EN 360](../stage-01/screenshots/after/en-360-first.png); [AFTER RU 360](../stage-01/screenshots/after/ru-360-first.png); [AFTER RU 1440](../stage-01/screenshots/after/ru-1440-first.png), [RU 1024](../stage-01/screenshots/after/ru-1024-first.png)
- After section crops in English 1440+390: `work-agent-ops-console`, `work-partner-portal`, `work-learn`, `work-vet-clinic`, `work-pawly`. RU mobile Portal and Learn.
- Code `src/pages/index.astro`, `src/components/FeaturedCase.astro`, `src/components/agent/AgentHome.astro` and submitted patch.
- Actual saved reference pair JPEGs [01](../stage-01/comparisons/01.jpg) / [02](../stage-01/comparisons/02.jpg) / [03](../stage-01/comparisons/03.jpg) / [05](../stage-01/comparisons/05.jpg) / [06](../stage-01/comparisons/06.jpg); original reference screenshots Garri, HA, Dounar from research pack.
- Submitted [REPORT](../stage-01/REPORT.md), [TESTS](../stage-01/TESTS.md), [PAWLY](../stage-01/COMPARE-PAWLY.md), [media source proof](../stage-01/SOURCES.md). Captured browser tests claimed and logs verified as submitted evidence; not independently rerun on a device.

## What passes visually

1. The main desktop typography/brand has not been casually reset. Real first work emerges immediately below the hero, unlike BEFORE where the first native UI started at y=1253px.
2. EN/RU 1440 actual image begins at y=717.4 (182.6px visible); a meaningfully stronger transition. Authentic non-generated native Agent approval screen, not a second invented mockup.
3. Agent: clear consequence pairing of $120 next-invoice credit and customer communication, good text + real scene at full section scale. Clean enough to match **intent** of Garri single-action example, though not equivalent visual theatricality.
4. Portal: source-row compare is better proportioned; content remains true to the synthetic 41/48 fixture and human confirmation. Mobile native capture readable at browsing scale.
5. Learn: simpler one-canvas shot and factual answer/learning alternatives. More focused, though still a moderately plain editorial field.
6. Pawly: same native art, exact specialized DOM/computed-styles/media hashes per submitted evidence, current links/order. Raw captures not pixel-identical due upstream fractional Y shift; registration diagnostic is transparent. No Pawly changes requested.
7. Successful submitted build/check/42 browser assertions, six axe scans zero violations, no overflow or broken image in tested viewports. Inherited delayed-navbar CLS 0.077 was before and after, not newly introduced.

## Why full premium acceptance is blocked

### P0 — Mobile first-frame proof is not meaningful

Image [EN390](../stage-01/screenshots/after/en-390-first.png) visibly shows only a narrow dark strip of Agent UI at the bottom; [EN360](../stage-01/screenshots/after/en-360-first.png) and [RU360](../stage-01/screenshots/after/ru-360-first.png) show only 17.6/11.7px of it. The submitted layout's first real product enters at y=782–788 on a 360×800 phone. It is technically 'near the fold' but a **dark sliver is not visible proof of product quality**. The client may still need to scroll, which is acceptable; however the FIRST fold should communicate a recognizable user action or at least the prominent financial consequence, not an anonymous line of black.

The $120 number and the 'what customer reads' structure appear only after the first fold in the 360 evidence; this does not yet match the actual first-impression strength of the archived Dounar/HA/Garri examples. Preserve large legible heading and author identity. Target real useful product content visible at 360/390, or a visually intentional transition that clearly previews the underlying native decision. Do not crop actual source to fake UI or squeeze type to force a numeric target. Reorder mobile first card microcopy versus real image if needed; ensure semantic DOM reading order and accessibility.

### P1 — Mobile action cluster has weak hierarchy / misaligned arrow

Images [EN360](../stage-01/screenshots/after/en-360-first.png), [RU360](../stage-01/screenshots/after/ru-360-first.png), [EN390](../stage-01/screenshots/after/en-390-first.png). `Explore selected work` is black while CV/copy email are red, so the secondary actions visually outrank the intended primary. The CV arrow appears lower/right of the link text and crowding with Copy email on mobile. The resulting two-tier CTA group reads improvised rather than art directed. Source: `src/pages/index.astro`, `.hero__actions { display:flex; flex-wrap:wrap; gap:0 var(--space-6) }`, generic `TextLink` and `CopyEmail` wrappers with `display:contents` under bp-md.

Require purpose-built stable two-row layout using existing semantic markup and tokens: primary Work action clearly primary, then CV + copy email aligned with their own arrows and tap areas; visible email line aligned independently, not accidental inline wrap. Audit 1440, 1024, 390, 360 EN/RU. No fake pill buttons or arbitrary new color system.

### P1 — 1024 RU scene balance

[RU1024](../stage-01/screenshots/after/ru-1024-first.png): long Agent story lines and narrow native comparison image make the proof cramped, while 'Copy email' is alone on a second CTA row. Polish the intermediate breakpoint responsibly, not by shrinking type; an intentional stacked story + readable wide stage may be better. Keep content/CTA order.

### P2 — The Vet section remains an inherited visual weak spot, not V3's technical defect

[1440 Vet](../stage-01/screenshots/after/en-1440-work-vet-clinic.png) and [390 Vet](../stage-01/screenshots/after/en-390-work-vet-clinic.png). The mobile preview is three very tall vertically stacked states, much heavier than other Home covers, with repeated patient context and a long page before CTA. This loses editorial efficiency and visual parity with Dounar/HA. But the source update is explicitly blocked pending a verified independently accepted product capture, so **do not silently change Vet screenshot or clinical narrative in V3.1**. Carry as separate media-refresh backlog after source approval.

### P2 — Startup CLS 0.077 remains unchanged

[Comparison](../stage-01/logs/loading-comparison.json) attributes layout shift to inherited nav initialization, not images introduced here. Record and plan later fix; do not build a new navigation system in this small V3.1.

## Benchmark conclusion

- **Garri**: similar confident typographic order and single design decision, but our first viewport/product integration is less art-directed and needs improved first action visibility.
- **HA**: authentic proof rather than theatrical hardware is appropriate to B2B, but the first fold still offers much weaker immediate visual evidence on phone.
- **Dounar**: case clarity and product metadata have improved; mobile above-fold proof still trails.
- **Tubik**: project-specific visual treatment differs intentionally; importing a paper-archive style into B2B would be wrong.
- **Blinkov/Victor**: pixel parity not verified. No claim.

**Answer to the key question:** Desktop has a convincingly professional, near-premium editorial direction; sections 1–3 are genuinely better. The **whole Home including 360px first impression is not yet independently accepted as top-tier/premium**. This is an addressable refinement, not a call for a new redesign.

## Next step

Use [PROMPT-V3.1.md](PROMPT-V3.1.md). The implementation remains untouched; no merge to main, production deploy or Figma edit authorized. After a branch push, independently review matched BEFORE/AFTER of the corrected first viewport/1024 hero and Pawly regression, with complete tests and only the changed sections.
