# Agent Ops Portfolio V2 — independent visual review

31 October 2026. Branch `codex/agent-ops-portfolio-v2`. Ready for independent ChatGPT visual review; no self-approval, merge, production release, product deployment or Figma change.

The final commit and verified Vercel Preview URL are supplied in the implementation handoff. This worktree is `D:/Claude-projects/sp-agent-ops-v2`.

## Changes

- New Agent-only homepage composition uses the actual Action Approvals consequence scene. B2B V2.1 and the other project cards retain their text and media URLs.
- Dedicated EN/RU case replaces the long shared story with seven concise sections and all seven showcase screen types. Approximately 830 English / 720 Russian editorial words, excluding native image content. Historical client figures are labelled as history; the outcome remains a tested, client-accepted prototype.
- Real 390px responsive captures replace scaled desktop imagery. Long run/policy screens show complete meaningful native panels with full-screen inspection. Approval headers and all isolated panels have **24 CSS px of sampled native canvas inside the dark media boundary**. Desktop neutral plates add their own 24px external field; mobile avoids a second enclosing frame. Native UI corners, controls and state remain intact.
- Fresh localized OG media uses the same source captures and versioned URLs. The prototype link explicitly identifies the earlier public version.

## Screenshot provenance

[Complete image manifest](capture-manifest.json) · [28-state CSV](SCREENSHOT_PROVENANCE.csv) · [Code identity evidence](source-verification.json).

All 28 primary states were captured in real Chromium at 1440×900 and 390×844, EN/RU, density 2, frozen demo clock, seeded state and correct role. Fourteen native-panel derivatives reuse those states. Source originals remain at `.tmp/agent-ops-v2-originals`; the manifest records their SHA-256 hashes, route, role, fixture, time, DOM bounds and output dimensions. No product UI was recreated in CSS or stitched from different states.

Actual capture checkout: `NikitaKanarev97/Agent-ops-console@030e5af7416ad52bd753271ad7147202b55cd41a`. Each accepted screen tree is identical to its source pin:

| Screen | Accepted code pin |
| --- | --- |
| Review Queue V2 | `6cecdb73b3fc23f0465bf7bf6a84598f1a63733d` |
| Run Detail | `6cecdb73b3fc23f0465bf7bf6a84598f1a63733d` |
| Action Approvals V1.1 | `6cecdb73b3fc23f0465bf7bf6a84598f1a63733d` |
| Autonomy V1.1 | `6cecdb73b3fc23f0465bf7bf6a84598f1a63733d` |
| Quality Dashboard V1.2 | `00641af7706c0f941e5ee58f4da8ee9bf9bb94d6` |
| Policy Editor V1 | `6399f6a4a586783f4eb20df7a9d93cb6076b06ed` |
| Policy Version Diff V1.1 | `030e5af7416ad52bd753271ad7147202b55cd41a` |

`b391a07` and `8bb61ba` contain the approval/autonomy audit packages; `6cecdb7` commits the previously uncommitted accepted implementations unchanged. Shared later changes concern the Quality period/filters and Policy semantics. The actual capture SHA is always recorded, rather than inventing a merged product release.

**RU localization:** the accepted product contains a partial Russian dictionary. A [capture-only string completion](../../scripts/agent-ops-v2/ru-capture-strings.mjs) translates its remaining operational labels through actual DOM text nodes. Its hash is recorded. Technical identifiers, figures, fixtures, statuses and controls are preserved. Product source and deployment were not changed.

## Eight browser comparisons

The original twelve BEFORE PNGs are preserved byte-for-byte; [hash verification](verification-summary.json). Additional homepage first/full-page captures come from a clean worktree at the same baseline `b7a4051`, which contains the requested `48d00e7` reference and its subsequent B2B geometry fixes. AFTER captures use the production build, real scrolling, decoded images and normal motion. Large full-page mobile images remain PNG; other review exports are lossless WebP.

| Surface | EN 1440 | RU 1440 | EN 390 | RU 390 |
| --- | --- | --- | --- | --- |
| Home | [Before / after](comparisons/home-en-1440.md) | [Before / after](comparisons/home-ru-1440.md) | [Before / after](comparisons/home-en-390.md) | [Before / after](comparisons/home-ru-390.md) |
| Case | [Before / after](comparisons/case-en-1440.md) | [Before / after](comparisons/case-ru-1440.md) | [Before / after](comparisons/case-en-390.md) | [Before / after](comparisons/case-ru-390.md) |

## Verification

- `npm run check`: 0 errors, 0 warnings; 163 inherited informational hints from archived cached JS. `npm run build`: 37 pages.
- Public content check: 0 findings. Scoped CSS check: 0 dead rules on the changed routes and both Home locales. Token/motion mirrors remain byte-identical.
- [Browser matrix](after/checks.json): all eight Home/case × EN/RU × desktop/mobile states, no runtime errors, failed requests, broken media, hidden headings, upscaled screenshots or horizontal overflow. [Compact summary](verification-summary.json).
- [Interaction checks](interaction-checks.json): locale-correct homepage scene navigation, visible keyboard focus, native-panel/full-screen zoom, Escape/focus restoration and reduced-motion visibility.
- Actual rendered hero, homepage cover and investigation/policy/autonomy sections were inspected, including native and external media fields. Pixel-dimension guards verify the full vertical capture, so mobile decision buttons are not silently clipped by the browser viewport.

## Public prototype freshness

The current public product serves `main@2930e025daec5f6e4f07c5294823c5f1eabbb24b`, preceding the displayed accepted screens. Vercel metadata and an actual-browser read confirm the older approval composition. [Evidence](prototype-freshness.json). Both case locales say **Public prototype — earlier version** / **Публичный прототип — ранняя версия**. No product release or alias change was made.

## Reproduce

Set `PW` to an installed Playwright module URL; set `PRODUCT_ROOT` to the pinned clean product checkout and `PRODUCT_ORIGIN` to its local server. `capture-product.mjs` captures states; `refresh-panel-fields.mjs` reframes existing original panel exports without changing UI; `review-pages.mjs <origin> after` collects page comparisons; `summarize.mjs` checks parity, preservation and the eight-state results. These scripts live in `scripts/agent-ops-v2/`.

## Independent review focus

Read the real Preview in both locales at 1440 and 390, then use the eight comparisons. Assess narrative hierarchy, screenshot legibility, the inner dark media fields versus outer page spacing, completeness of approval actions, and the distinction between approved/applied/confirmed policy versions. Final visual acceptance belongs to the independent reviewer.
