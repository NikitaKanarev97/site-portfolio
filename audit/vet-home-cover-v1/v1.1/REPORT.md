# Vet Home Cover V1.1 — caption spacing

2 November 2026, Europe/Moscow. Submitted for independent visual approval; no self-approval, merge, deployment or unrelated changes.

The owner clarified that desktop/mobile are alternative responsive states. The requested change is the gap **between the Visit Record screenshot and its caption**, not between two mockups.

One CSS declaration in `src/components/vet/VetHome.astro` changes `gap: var(--flow-pair)` to `gap: calc(var(--flow-pair) + var(--space-3))`. Existing DS tokens produce **12 → 24px**, adding exactly **12px** on desktop and mobile. No new token or global style.

The extra separation gives the caption a little more room beneath the screen without changing the image's size, alignment, crop, typography, sage stage, padding or hierarchy. No increase to 16px was needed. Whole card height increases by exactly 12px in each checked state.

## Actual matched screenshots

Chromium 151, DPR 1, reduced motion. Same local production preview, locale, viewport and fully decoded images. BEFORE was captured from final V1 before the CSS edit; AFTER from the rebuilt V1.1. Raw PNGs are unedited browser captures. JPEGs are labeled side-by-side review sheets only.

| State | BEFORE | AFTER | Comparison |
| --- | --- | --- | --- |
| EN 1440×900 | [PNG](before/en-1440-vet.png) | [PNG](after/en-1440-vet.png) | [before / after](comparisons/en-1440.jpg) |
| RU 1440×900 | [PNG](before/ru-1440-vet.png) | [PNG](after/ru-1440-vet.png) | [before / after](comparisons/ru-1440.jpg) |
| EN 390×844 | [PNG](before/en-390-vet.png) | [PNG](after/en-390-vet.png) | [before / after](comparisons/en-390.jpg) |
| RU 390×844 | [PNG](before/ru-390-vet.png) | [PNG](after/ru-390-vet.png) | [before / after](comparisons/ru-390.jpg) |

## Checks and scope

- Production build: PASS, 37 routes. [Log](logs/build.txt).
- Scoped CSS check: PASS, zero dead scoped rules. [Log](logs/css.txt).
- Four browser profiles: zero overflow/page errors; same image sources, rendered dimensions, stage padding and card width. Measured gap and card height increase exactly 12px. [Verification](logs/verification.json), [BEFORE metrics](before/manifest.json), [AFTER metrics](after/manifest.json).
- Git source diff against V1 baseline `24e0a22` changes only `src/components/vet/VetHome.astro`, one declaration. Other project covers, Vet case source/media and all Visit Record screenshots are unchanged. Additional files are only this micro-correction's capture recipe, screenshots, logs and report.
- `git diff --check`: PASS. No TypeScript or public copy changes, dependency changes or new motion; the V1 type/content checks remain applicable.

V1 existed as local working-tree changes. It was committed separately as `24e0a22` before the micro-correction, preserving a clean review boundary. V1.1 is the subsequent commit on the existing `codex/vet-home-cover-v1-2026-11-02` branch. Containing Git commit identifies final V1.1 evidence.

Remaining request: independent visual approval of the small caption-spacing change. Physical devices and additional browsers were not newly tested for this CSS-only correction.
