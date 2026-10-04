# Technical corrections before resuming visual work · 04 October 2026

Worktree: `C:/Users/kanar/.codex/worktrees/portfolio-art-direction-h/Site-portfolio`.
Branch: `codex/portfolio-art-direction-h-2026-10-04`.
Base checkpoint: `7d76b9114f0b30a4efe6d30a84bdc8c746fcb02b` (H4 visual source: `3cf9c54de09f77b4b496328af2c8b5f2f6e2af4c`).
Verified technical source commit: `574110a5b9d33760c82e6d461ade600c409f807c`.
Current preview: http://127.0.0.1:4397/ru/ (fresh normal dist, separate from frozen H4 preview 4395).

## Owner feedback addressed

- Home hero identifies Agent Ops as an example of AI oversight and explains the human decision before a $340 refund. Its entire frame opens the case. Every FeaturedCase surface and native Home frame opens its matching case, with explicit reading labels. Detail frames retain zoom; anchors are not nested.
- Agent Ops and Portal fit the complete native frame, frame fields, action row and caption in the focused scene. Old competing image width formulas were removed. One whole state remains visible; 0.25s numeric scrub smooths the incoming panel. Narrow/short/reduced/no-JS routes keep the natural list.
- Responsive restoration preserves the selected material after wrapping, pin refresh and reduced-motion changes. The refreshed trigger supplies the scroll origin; browser anchoring cannot undo an owned reflow. Normal anchoring returns on reader input or teardown.
- Portal/Learn explanation rows show number → rule → explanation on every width. Matching pins sit in the outer left field on larger screens, without covering native text. Labels flow rather than collide. Learn's coordinates match its new complete catalog row.
- Learn material and the Home material capture retain native pale-blue fields before the outer white frame. Completion shows the whole final section and whole action, without a half-cut curriculum row. Assessment retains 32px native fields above the complete heading and below the complete rules card. Landing ends at the hero boundary before the next heading. TrustHeader and ProgressMeter are complete native captures with true transparent outer corners. Archive catalog ends after the first complete row.
- Pawly compatibility has four relevant native screens: address/service area, candidates, profile/recorded limits, dated verification details. Phone slides have a compact width, four-count indicator and arrows. Rapid next/previous actions retain their intent; previous always leaves the final reachable stop. Keyboard, native scrolling and resize stay usable.
- Next Case preserves the whole Agent Ops lettering vertically, including ascenders and descenders.

## Evidence and verification

- `verification.json` / `verify.mjs`: 60 responsive profiles (Home + five cases; EN/RU; widths 320, 390, 768, 1024, 1440), plus 16 normal-motion profiles. Checks include horizontal overflow, native image loading, numbered rows, pins outside image bounds, Home link semantics, four-slide controls, frame/caption fit, a single visible state during forward/backward boundary exchanges, and marquee bounds.
- `lifecycle-verification.json` / `lifecycle.mjs`: Agent Ops and Portal in EN/RU across wide, tablet, phone and short windows, reduction and re-enabling of motion; selected material stays selected, transient widths clear, native anchoring is restored on reader input. Six normal-motion Pawly profiles verify rapid arrows, keyboard, resize and Agent Ops marquee; four no-JS profiles retain static content and native fallback links.
- `navigation-verification.json` / `navigation.mjs`: 18 clicks on the outer fields of the hero and five case cards (EN/RU desktop and RU phone) actually navigate to the relevant case. Three detail zoom checks open and close the native modal.
- `build.log`: 36 pages generated. `check.log`: 0 errors, 0 warnings (existing 262 hints). `css.log`: no dead scoped rules. `harmony.log`: no violations. Motion and token mirrors match byte-for-byte. `git diff --check` passed.
- `captures.json`: exact sources, selected native regions, dimensions, viewport and hashes. `capture.mjs`, `register-reused.mjs`, `manifest.mjs` reproduce/update this registry. Matching Learn and Pawly media manifests were updated. Native product UI was not repainted.
- `evidence/`: affected desktop/mobile sections, all desktop focused panels in both languages, and the full Agent Ops next-case field. Manual in-app browser checks covered actual Home navigation, Portal audit, Learn phone/desktop fields and Pawly controls.

## Resume visual work

Continue the existing chat **Интегрировать истории портфолио** from this same worktree and branch after receiving this technical handoff. Preserve these corrected link semantics, complete native captures, numbers, full frame/caption fit, four-screen Pawly sequence and unclipped Next Case. Continue the original visual objective on top of this source. No work was pushed, merged or deployed. The original D:/ checkout was not modified; using H sequentially avoids overwriting either task.
