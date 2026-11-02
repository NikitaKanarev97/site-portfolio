# Pawly V2.1.2 — media geometry, BEFORE (`ba611ba`) → AFTER

Measured by `tools/measure.py` from the DOM boxes `tools/capture-page.mjs` records (CSS px, DPR 1 captures).
- **Caption**: `below N (panel M)` = distance from the image's own bottom edge (N) and from the visible screen panel's
  bottom edge (M) to the caption's top. `beside` = the caption sits next to the screen: horizontal gap from the plate,
  and how far the label + caption block's centre sits from the panel's centre.
- **Plate field**: plate surface above / below the panel. **Uneven**: bottom − top, the unused height a stretched
  plate leaves under a shorter screen. **Scale**: rendered width / native (DPR 2 capture ÷ 2).
- Pixel-based fields (V2.1 method) are still in `before/` and `after/media-fields.json` (`panel`, `field`).

## Worst image-to-caption distance (Choosing and Return)

| locale | width | chapter | BEFORE | AFTER | AFTER: captions beside their screen |
|---|---|---|---|---|---|
| en | 1440 | choosing | 245 | 90 | 0 |
| en | 1440 | return | 354 | 93 | 0 |
| en | 1024 | choosing | 107 | 90 | 1 |
| en | 1024 | return | 111 | 92 | 1 |
| ru | 1440 | choosing | 268 | 90 | 0 |
| ru | 1440 | return | 332 | 93 | 0 |
| ru | 1024 | choosing | 108 | 90 | 1 |
| ru | 1024 | return | 101 | 92 | 1 |

## EN

| width | chapter | image | scale BEFORE → AFTER | caption BEFORE | caption AFTER | plate field BEFORE → AFTER | uneven BEFORE → AFTER |
|---|---|---|---|---|---|---|---|
| 1440 | choosing | `match-list-en.webp` | 0.93 → 0.93 | below 245 (panel 235) | below 90 (panel 80) | 64/219 → 64/64 | 155 → 0 |
| 1440 | choosing | `match-profile-en.webp` | 0.93 → 0.93 | below 210 (panel 200) | below 90 (panel 80) | 64/184 → 64/64 | 120 → 0 |
| 1440 | choosing | `match-review-en.webp` | 1.0 → 1.0 | below 82 (panel 80) | below 82 (panel 80) | 64/64 → 64/64 | 0 → 0 |
| 1440 | handoff | `role-owner-en.webp` | 1.0 → 1.0 | — | — | 64/64 → 64/64 | 0 → 0 |
| 1440 | handoff | `role-walker-en.webp` | 1.0 → 1.0 | — | — | 76/76 → 76/76 | 0 → 0 |
| 1440 | return | `proof-selected-en.webp` | 0.93 → 0.93 | below 354 (panel 343) | below 92 (panel 81) | 64/327 → 64/64 | 263 → 0 |
| 1440 | return | `proof-confirmed-en.webp` | 0.93 → 0.93 | below 314 (panel 302) | below 93 (panel 81) | 64/286 → 64/64 | 222 → 0 |
| 1440 | return | `proof-report-en.webp` | 0.93 → 0.93 | below 92 (panel 80) | below 92 (panel 80) | 64/64 → 64/64 | 0 → 0 |
| 1279 | choosing | `match-list-en.webp` | 1.0 → 1.0 | below 110 (panel 100) | below 90 (panel 80) | 83/84 → 64/64 | 1 → 0 |
| 1279 | choosing | `match-profile-en.webp` | 1.0 → 1.0 | below 90 (panel 80) | below 90 (panel 80) | 64/64 → 64/64 | 0 → 0 |
| 1279 | choosing | `match-review-en.webp` | 1.0 → 1.0 | below 82 (panel 80) | beside, gap 24, centre +0 | 64/64 → 64/64 | 0 → 0 |
| 1279 | handoff | `role-owner-en.webp` | 1.0 → 1.0 | — | — | 64/64 → 64/64 | 0 → 0 |
| 1279 | handoff | `role-walker-en.webp` | 1.0 → 1.0 | — | — | 76/76 → 76/76 | 0 → 0 |
| 1279 | return | `proof-selected-en.webp` | 1.0 → 1.0 | below 113 (panel 102) | below 91 (panel 80) | 86/86 → 64/64 | 0 → 0 |
| 1279 | return | `proof-confirmed-en.webp` | 1.0 → 1.0 | below 92 (panel 80) | below 92 (panel 80) | 64/64 → 64/64 | 0 → 0 |
| 1279 | return | `proof-report-en.webp` | 1.0 → 1.0 | below 92 (panel 80) | beside, gap 24, centre +0 | 64/64 → 64/64 | 0 → 0 |
| 1100 | choosing | `match-list-en.webp` | 1.0 → 1.0 | below 109 (panel 99) | below 90 (panel 80) | 84/83 → 64/64 | -1 → 0 |
| 1100 | choosing | `match-profile-en.webp` | 1.0 → 1.0 | below 90 (panel 80) | below 90 (panel 80) | 64/64 → 64/64 | 0 → 0 |
| 1100 | choosing | `match-review-en.webp` | 1.0 → 1.0 | below 82 (panel 80) | beside, gap 24, centre +0 | 64/64 → 64/64 | 0 → 0 |
| 1100 | handoff | `role-owner-en.webp` | 1.0 → 1.0 | — | — | 64/64 → 64/64 | 0 → 0 |
| 1100 | handoff | `role-walker-en.webp` | 1.0 → 1.0 | — | — | 76/76 → 76/76 | 0 → 0 |
| 1100 | return | `proof-selected-en.webp` | 1.0 → 1.0 | below 113 (panel 102) | below 91 (panel 80) | 86/86 → 64/64 | 0 → 0 |
| 1100 | return | `proof-confirmed-en.webp` | 1.0 → 1.0 | below 92 (panel 80) | below 92 (panel 80) | 64/64 → 64/64 | 0 → 0 |
| 1100 | return | `proof-report-en.webp` | 1.0 → 1.0 | below 92 (panel 80) | beside, gap 24, centre +0 | 64/64 → 64/64 | 0 → 0 |
| 1024 | choosing | `match-list-en.webp` | 0.95 → 0.95 | below 107 (panel 97) | below 90 (panel 80) | 83/81 → 64/64 | -2 → 0 |
| 1024 | choosing | `match-profile-en.webp` | 0.95 → 0.95 | below 90 (panel 80) | below 90 (panel 80) | 64/64 → 64/64 | 0 → 0 |
| 1024 | choosing | `match-review-en.webp` | 1.0 → 1.0 | below 82 (panel 80) | beside, gap 24, centre +0 | 64/64 → 64/64 | 0 → 0 |
| 1024 | handoff | `role-owner-en.webp` | 0.95 → 0.95 | — | — | 64/64 → 64/64 | 0 → 0 |
| 1024 | handoff | `role-walker-en.webp` | 0.95 → 0.95 | — | — | 75/76 → 76/75 | 1 → -1 |
| 1024 | return | `proof-selected-en.webp` | 0.95 → 0.95 | below 111 (panel 100) | below 91 (panel 80) | 85/85 → 64/64 | 0 → 0 |
| 1024 | return | `proof-confirmed-en.webp` | 0.95 → 0.95 | below 91 (panel 79) | below 92 (panel 80) | 64/64 → 64/64 | 0 → 0 |
| 1024 | return | `proof-report-en.webp` | 0.95 → 0.95 | below 92 (panel 80) | beside, gap 24, centre +0 | 64/64 → 64/64 | 0 → 0 |
| 900 | choosing | `match-list-en.webp` | 1.0 → 1.0 | below 74 (panel 64) | beside, gap 24, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 900 | choosing | `match-profile-en.webp` | 1.0 → 1.0 | below 73 (panel 63) | beside, gap 47, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 900 | choosing | `match-review-en.webp` | 1.0 → 1.0 | below 66 (panel 64) | beside, gap 24, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 900 | handoff | `role-owner-en.webp` | 1.0 → 1.0 | — | — | 48/48 → 48/48 | 0 → 0 |
| 900 | handoff | `role-walker-en.webp` | 1.0 → 1.0 | — | — | 48/48 → 48/48 | 0 → 0 |
| 900 | return | `proof-selected-en.webp` | 1.0 → 1.0 | below 75 (panel 64) | beside, gap 24, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 900 | return | `proof-confirmed-en.webp` | 1.0 → 1.0 | below 76 (panel 64) | beside, gap 47, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 900 | return | `proof-report-en.webp` | 1.0 → 1.0 | below 76 (panel 64) | beside, gap 24, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 800 | choosing | `match-list-en.webp` | 1.0 → 1.0 | below 74 (panel 64) | beside, gap 24, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 800 | choosing | `match-profile-en.webp` | 1.0 → 1.0 | below 73 (panel 63) | beside, gap 24, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 800 | choosing | `match-review-en.webp` | 1.0 → 1.0 | below 66 (panel 64) | beside, gap 24, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 800 | handoff | `role-owner-en.webp` | 1.0 → 1.0 | — | — | 48/48 → 48/48 | 0 → 0 |
| 800 | handoff | `role-walker-en.webp` | 1.0 → 1.0 | — | — | 48/48 → 48/48 | 0 → 0 |
| 800 | return | `proof-selected-en.webp` | 1.0 → 1.0 | below 75 (panel 64) | beside, gap 24, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 800 | return | `proof-confirmed-en.webp` | 1.0 → 1.0 | below 76 (panel 64) | beside, gap 24, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 800 | return | `proof-report-en.webp` | 1.0 → 1.0 | below 76 (panel 64) | beside, gap 24, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 768 | choosing | `match-list-en.webp` | 1.0 → 1.0 | below 74 (panel 64) | beside, gap 24, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 768 | choosing | `match-profile-en.webp` | 1.0 → 1.0 | below 73 (panel 63) | beside, gap 24, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 768 | choosing | `match-review-en.webp` | 1.0 → 1.0 | below 66 (panel 64) | beside, gap 24, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 768 | handoff | `role-owner-en.webp` | 1.0 → 1.0 | — | — | 48/48 → 48/48 | 0 → 0 |
| 768 | handoff | `role-walker-en.webp` | 1.0 → 1.0 | — | — | 48/48 → 48/48 | 0 → 0 |
| 768 | return | `proof-selected-en.webp` | 1.0 → 1.0 | below 75 (panel 64) | beside, gap 24, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 768 | return | `proof-confirmed-en.webp` | 1.0 → 1.0 | below 76 (panel 64) | beside, gap 24, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 768 | return | `proof-report-en.webp` | 1.0 → 1.0 | below 76 (panel 64) | beside, gap 24, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 390 | choosing | `match-list-en.webp` | 0.92 → 0.92 | below 66 (panel 56) | below 66 (panel 56) | 40/40 → 40/40 | 0 → 0 |
| 390 | choosing | `match-profile-en.webp` | 0.92 → 0.92 | below 66 (panel 56) | below 66 (panel 56) | 40/40 → 40/40 | 0 → 0 |
| 390 | choosing | `match-review-en.webp` | 1.0 → 1.0 | below 58 (panel 56) | below 58 (panel 56) | 40/40 → 40/40 | 0 → 0 |
| 390 | handoff | `role-owner-en.webp` | 0.92 → 0.92 | — | — | 40/40 → 40/40 | 0 → 0 |
| 390 | handoff | `role-walker-en.webp` | 0.92 → 0.92 | — | — | 40/40 → 40/40 | 0 → 0 |
| 390 | return | `proof-selected-en.webp` | 0.92 → 0.92 | below 67 (panel 56) | below 67 (panel 56) | 40/40 → 40/40 | 0 → 0 |
| 390 | return | `proof-confirmed-en.webp` | 0.92 → 0.92 | below 68 (panel 56) | below 68 (panel 56) | 40/40 → 40/40 | 0 → 0 |
| 390 | return | `proof-report-en.webp` | 0.92 → 0.92 | below 68 (panel 56) | below 68 (panel 56) | 40/40 → 40/40 | 0 → 0 |
| 360 | choosing | `match-list-en.webp` | 0.84 → 0.84 | below 66 (panel 56) | below 66 (panel 56) | 40/40 → 40/40 | 0 → 0 |
| 360 | choosing | `match-profile-en.webp` | 0.84 → 0.84 | below 66 (panel 56) | below 66 (panel 56) | 40/40 → 40/40 | 0 → 0 |
| 360 | choosing | `match-review-en.webp` | 0.91 → 0.91 | below 58 (panel 56) | below 58 (panel 56) | 40/40 → 40/40 | 0 → 0 |
| 360 | handoff | `role-owner-en.webp` | 0.84 → 0.84 | — | — | 40/40 → 40/40 | 0 → 0 |
| 360 | handoff | `role-walker-en.webp` | 0.84 → 0.84 | — | — | 40/40 → 40/40 | 0 → 0 |
| 360 | return | `proof-selected-en.webp` | 0.84 → 0.84 | below 68 (panel 57) | below 68 (panel 57) | 40/40 → 40/40 | 0 → 0 |
| 360 | return | `proof-confirmed-en.webp` | 0.84 → 0.84 | below 68 (panel 56) | below 68 (panel 56) | 40/40 → 40/40 | 0 → 0 |
| 360 | return | `proof-report-en.webp` | 0.84 → 0.84 | below 68 (panel 56) | below 68 (panel 56) | 40/40 → 40/40 | 0 → 0 |
| 320 | choosing | `match-list-en.webp` | 0.76 → 0.76 | below 58 (panel 48) | below 58 (panel 48) | 32/32 → 32/32 | 0 → 0 |
| 320 | choosing | `match-profile-en.webp` | 0.76 → 0.76 | below 57 (panel 47) | below 57 (panel 47) | 32/32 → 32/32 | 0 → 0 |
| 320 | choosing | `match-review-en.webp` | 0.82 → 0.82 | below 49 (panel 47) | below 49 (panel 47) | 32/32 → 32/32 | 0 → 0 |
| 320 | handoff | `role-owner-en.webp` | 0.76 → 0.76 | — | — | 32/32 → 32/32 | 0 → 0 |
| 320 | handoff | `role-walker-en.webp` | 0.76 → 0.76 | — | — | 32/32 → 32/32 | 0 → 0 |
| 320 | return | `proof-selected-en.webp` | 0.76 → 0.76 | below 60 (panel 49) | below 60 (panel 49) | 32/32 → 32/32 | 0 → 0 |
| 320 | return | `proof-confirmed-en.webp` | 0.76 → 0.76 | below 60 (panel 48) | below 60 (panel 48) | 32/32 → 32/32 | 0 → 0 |
| 320 | return | `proof-report-en.webp` | 0.76 → 0.76 | below 60 (panel 48) | below 60 (panel 48) | 32/32 → 32/32 | 0 → 0 |

## RU

| width | chapter | image | scale BEFORE → AFTER | caption BEFORE | caption AFTER | plate field BEFORE → AFTER | uneven BEFORE → AFTER |
|---|---|---|---|---|---|---|---|
| 1440 | choosing | `match-list-ru.webp` | 0.93 → 0.93 | below 268 (panel 258) | below 90 (panel 80) | 64/242 → 64/64 | 178 → 0 |
| 1440 | choosing | `match-profile-ru.webp` | 0.93 → 0.93 | below 233 (panel 223) | below 90 (panel 80) | 64/207 → 64/64 | 143 → 0 |
| 1440 | choosing | `match-review-ru.webp` | 1.0 → 1.0 | below 85 (panel 80) | below 85 (panel 80) | 64/64 → 64/64 | 0 → 0 |
| 1440 | handoff | `role-owner-ru.webp` | 1.0 → 1.0 | — | — | 64/64 → 64/64 | 0 → 0 |
| 1440 | handoff | `role-walker-ru.webp` | 1.0 → 1.0 | — | — | 85/85 → 85/85 | 0 → 0 |
| 1440 | return | `proof-selected-ru.webp` | 0.93 → 0.93 | below 332 (panel 320) | below 92 (panel 80) | 64/304 → 64/64 | 240 → 0 |
| 1440 | return | `proof-confirmed-ru.webp` | 0.93 → 0.93 | below 314 (panel 302) | below 93 (panel 81) | 64/286 → 64/64 | 222 → 0 |
| 1440 | return | `proof-report-ru.webp` | 0.93 → 0.93 | below 92 (panel 80) | below 92 (panel 80) | 64/64 → 64/64 | 0 → 0 |
| 1279 | choosing | `match-list-ru.webp` | 1.0 → 1.0 | below 110 (panel 100) | below 90 (panel 80) | 83/84 → 64/64 | 1 → 0 |
| 1279 | choosing | `match-profile-ru.webp` | 1.0 → 1.0 | below 90 (panel 80) | below 90 (panel 80) | 64/64 → 64/64 | 0 → 0 |
| 1279 | choosing | `match-review-ru.webp` | 1.0 → 1.0 | below 85 (panel 80) | beside, gap 24, centre +0 | 64/64 → 64/64 | 0 → 0 |
| 1279 | handoff | `role-owner-ru.webp` | 1.0 → 1.0 | — | — | 64/64 → 64/64 | 0 → 0 |
| 1279 | handoff | `role-walker-ru.webp` | 1.0 → 1.0 | — | — | 85/85 → 85/85 | 0 → 0 |
| 1279 | return | `proof-selected-ru.webp` | 1.0 → 1.0 | below 102 (panel 90) | below 92 (panel 80) | 74/74 → 64/64 | 0 → 0 |
| 1279 | return | `proof-confirmed-ru.webp` | 1.0 → 1.0 | below 92 (panel 80) | below 92 (panel 80) | 64/64 → 64/64 | 0 → 0 |
| 1279 | return | `proof-report-ru.webp` | 1.0 → 1.0 | below 92 (panel 80) | beside, gap 24, centre +0 | 64/64 → 64/64 | 0 → 0 |
| 1100 | choosing | `match-list-ru.webp` | 1.0 → 1.0 | below 109 (panel 99) | below 90 (panel 80) | 84/83 → 64/64 | -1 → 0 |
| 1100 | choosing | `match-profile-ru.webp` | 1.0 → 1.0 | below 90 (panel 80) | below 90 (panel 80) | 64/64 → 64/64 | 0 → 0 |
| 1100 | choosing | `match-review-ru.webp` | 1.0 → 1.0 | below 85 (panel 80) | beside, gap 24, centre +0 | 64/64 → 64/64 | 0 → 0 |
| 1100 | handoff | `role-owner-ru.webp` | 1.0 → 1.0 | — | — | 64/64 → 64/64 | 0 → 0 |
| 1100 | handoff | `role-walker-ru.webp` | 1.0 → 1.0 | — | — | 85/85 → 85/85 | 0 → 0 |
| 1100 | return | `proof-selected-ru.webp` | 1.0 → 1.0 | below 102 (panel 90) | below 92 (panel 80) | 74/74 → 64/64 | 0 → 0 |
| 1100 | return | `proof-confirmed-ru.webp` | 1.0 → 1.0 | below 92 (panel 80) | below 92 (panel 80) | 64/64 → 64/64 | 0 → 0 |
| 1100 | return | `proof-report-ru.webp` | 1.0 → 1.0 | below 92 (panel 80) | beside, gap 24, centre +0 | 64/64 → 64/64 | 0 → 0 |
| 1024 | choosing | `match-list-ru.webp` | 0.95 → 0.95 | below 108 (panel 98) | below 90 (panel 80) | 82/82 → 64/64 | 0 → 0 |
| 1024 | choosing | `match-profile-ru.webp` | 0.95 → 0.95 | below 90 (panel 80) | below 90 (panel 80) | 64/64 → 64/64 | 0 → 0 |
| 1024 | choosing | `match-review-ru.webp` | 1.0 → 1.0 | below 85 (panel 80) | beside, gap 24, centre +0 | 64/64 → 64/64 | 0 → 0 |
| 1024 | handoff | `role-owner-ru.webp` | 0.95 → 0.95 | — | — | 64/64 → 64/64 | 0 → 0 |
| 1024 | handoff | `role-walker-ru.webp` | 0.95 → 0.95 | — | — | 84/84 → 84/84 | 0 → 0 |
| 1024 | return | `proof-selected-ru.webp` | 0.95 → 0.95 | below 101 (panel 89) | below 91 (panel 79) | 74/73 → 64/64 | -1 → 0 |
| 1024 | return | `proof-confirmed-ru.webp` | 0.95 → 0.95 | below 92 (panel 80) | below 92 (panel 80) | 64/64 → 64/64 | 0 → 0 |
| 1024 | return | `proof-report-ru.webp` | 0.95 → 0.95 | below 92 (panel 80) | beside, gap 24, centre +0 | 64/64 → 64/64 | 0 → 0 |
| 900 | choosing | `match-list-ru.webp` | 1.0 → 1.0 | below 74 (panel 64) | beside, gap 24, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 900 | choosing | `match-profile-ru.webp` | 1.0 → 1.0 | below 73 (panel 63) | beside, gap 47, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 900 | choosing | `match-review-ru.webp` | 1.0 → 1.0 | below 69 (panel 64) | beside, gap 24, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 900 | handoff | `role-owner-ru.webp` | 1.0 → 1.0 | — | — | 48/48 → 48/48 | 0 → 0 |
| 900 | handoff | `role-walker-ru.webp` | 1.0 → 1.0 | — | — | 48/48 → 48/48 | 0 → 0 |
| 900 | return | `proof-selected-ru.webp` | 1.0 → 1.0 | below 76 (panel 64) | beside, gap 24, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 900 | return | `proof-confirmed-ru.webp` | 1.0 → 1.0 | below 76 (panel 64) | beside, gap 47, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 900 | return | `proof-report-ru.webp` | 1.0 → 1.0 | below 76 (panel 64) | beside, gap 24, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 800 | choosing | `match-list-ru.webp` | 1.0 → 1.0 | below 74 (panel 64) | beside, gap 24, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 800 | choosing | `match-profile-ru.webp` | 1.0 → 1.0 | below 74 (panel 64) | beside, gap 24, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 800 | choosing | `match-review-ru.webp` | 1.0 → 1.0 | below 69 (panel 64) | beside, gap 24, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 800 | handoff | `role-owner-ru.webp` | 1.0 → 1.0 | — | — | 48/48 → 48/48 | 0 → 0 |
| 800 | handoff | `role-walker-ru.webp` | 1.0 → 1.0 | — | — | 48/48 → 48/48 | 0 → 0 |
| 800 | return | `proof-selected-ru.webp` | 1.0 → 1.0 | below 76 (panel 64) | beside, gap 24, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 800 | return | `proof-confirmed-ru.webp` | 1.0 → 1.0 | below 76 (panel 64) | beside, gap 24, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 800 | return | `proof-report-ru.webp` | 1.0 → 1.0 | below 76 (panel 64) | beside, gap 24, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 768 | choosing | `match-list-ru.webp` | 1.0 → 1.0 | below 74 (panel 64) | beside, gap 24, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 768 | choosing | `match-profile-ru.webp` | 1.0 → 1.0 | below 74 (panel 64) | beside, gap 24, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 768 | choosing | `match-review-ru.webp` | 1.0 → 1.0 | below 69 (panel 64) | beside, gap 24, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 768 | handoff | `role-owner-ru.webp` | 1.0 → 1.0 | — | — | 48/48 → 48/48 | 0 → 0 |
| 768 | handoff | `role-walker-ru.webp` | 1.0 → 1.0 | — | — | 48/48 → 48/48 | 0 → 0 |
| 768 | return | `proof-selected-ru.webp` | 1.0 → 1.0 | below 76 (panel 64) | beside, gap 24, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 768 | return | `proof-confirmed-ru.webp` | 1.0 → 1.0 | below 76 (panel 64) | beside, gap 24, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 768 | return | `proof-report-ru.webp` | 1.0 → 1.0 | below 76 (panel 64) | beside, gap 24, centre +0 | 48/48 → 48/48 | 0 → 0 |
| 390 | choosing | `match-list-ru.webp` | 0.92 → 0.92 | below 66 (panel 56) | below 66 (panel 56) | 40/40 → 40/40 | 0 → 0 |
| 390 | choosing | `match-profile-ru.webp` | 0.92 → 0.92 | below 66 (panel 56) | below 66 (panel 56) | 40/40 → 40/40 | 0 → 0 |
| 390 | choosing | `match-review-ru.webp` | 1.0 → 1.0 | below 61 (panel 56) | below 61 (panel 56) | 40/40 → 40/40 | 0 → 0 |
| 390 | handoff | `role-owner-ru.webp` | 0.92 → 0.92 | — | — | 40/40 → 40/40 | 0 → 0 |
| 390 | handoff | `role-walker-ru.webp` | 0.92 → 0.92 | — | — | 40/40 → 40/40 | 0 → 0 |
| 390 | return | `proof-selected-ru.webp` | 0.92 → 0.92 | below 69 (panel 57) | below 69 (panel 57) | 40/40 → 40/40 | 0 → 0 |
| 390 | return | `proof-confirmed-ru.webp` | 0.92 → 0.92 | below 67 (panel 55) | below 67 (panel 55) | 40/40 → 40/40 | 0 → 0 |
| 390 | return | `proof-report-ru.webp` | 0.92 → 0.92 | below 68 (panel 56) | below 68 (panel 56) | 40/40 → 40/40 | 0 → 0 |
| 360 | choosing | `match-list-ru.webp` | 0.84 → 0.84 | below 65 (panel 55) | below 65 (panel 55) | 40/40 → 40/40 | 0 → 0 |
| 360 | choosing | `match-profile-ru.webp` | 0.84 → 0.84 | below 66 (panel 56) | below 66 (panel 56) | 40/40 → 40/40 | 0 → 0 |
| 360 | choosing | `match-review-ru.webp` | 0.91 → 0.91 | below 62 (panel 57) | below 62 (panel 57) | 40/40 → 40/40 | 0 → 0 |
| 360 | handoff | `role-owner-ru.webp` | 0.84 → 0.84 | — | — | 40/40 → 40/40 | 0 → 0 |
| 360 | handoff | `role-walker-ru.webp` | 0.84 → 0.84 | — | — | 40/40 → 40/40 | 0 → 0 |
| 360 | return | `proof-selected-ru.webp` | 0.84 → 0.84 | below 68 (panel 56) | below 68 (panel 56) | 40/40 → 40/40 | 0 → 0 |
| 360 | return | `proof-confirmed-ru.webp` | 0.84 → 0.84 | below 68 (panel 56) | below 68 (panel 56) | 40/40 → 40/40 | 0 → 0 |
| 360 | return | `proof-report-ru.webp` | 0.84 → 0.84 | below 68 (panel 56) | below 68 (panel 56) | 40/40 → 40/40 | 0 → 0 |
| 320 | choosing | `match-list-ru.webp` | 0.76 → 0.76 | below 59 (panel 49) | below 59 (panel 49) | 32/32 → 32/32 | 0 → 0 |
| 320 | choosing | `match-profile-ru.webp` | 0.76 → 0.76 | below 57 (panel 47) | below 57 (panel 47) | 32/32 → 32/32 | 0 → 0 |
| 320 | choosing | `match-review-ru.webp` | 0.82 → 0.82 | below 53 (panel 48) | below 53 (panel 48) | 32/32 → 32/32 | 0 → 0 |
| 320 | handoff | `role-owner-ru.webp` | 0.76 → 0.76 | — | — | 32/32 → 32/32 | 0 → 0 |
| 320 | handoff | `role-walker-ru.webp` | 0.76 → 0.76 | — | — | 32/32 → 32/32 | 0 → 0 |
| 320 | return | `proof-selected-ru.webp` | 0.76 → 0.76 | below 60 (panel 48) | below 60 (panel 48) | 32/32 → 32/32 | 0 → 0 |
| 320 | return | `proof-confirmed-ru.webp` | 0.76 → 0.76 | below 60 (panel 48) | below 60 (panel 48) | 32/32 → 32/32 | 0 → 0 |
| 320 | return | `proof-report-ru.webp` | 0.76 → 0.76 | below 60 (panel 48) | below 60 (panel 48) | 32/32 → 32/32 | 0 → 0 |
