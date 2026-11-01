# Agent Ops Home Cover V1.1 — copy correction

02.11.2026 · independent review pending.

Branch: `codex/agent-ops-home-cover-v1-2026-11-02`.
Reviewed base: `7ad586661e2d3c73a3b470b7a73d8993dc96d84e`.

Only the `home.title` string changed in each locale:

| Locale | Before | After |
| --- | --- | --- |
| EN | The agent asks for $120. | A $120 credit needs human approval. |
| RU | Агент запрашивает $120. | Зачёт $120 требует согласования. |

The unchanged body, alt and authentic product screenshot describe a credit on
the next invoice, with no cash leaving the account. The new titles require
approval and do not imply it has occurred.

No component, layout, spacing, radius, asset, design token, other cover or case
page was edited. Longer titles wrap naturally within the existing composition.
Both built Agent case pages have identical before/after SHA256 hashes:
[case parity](logs/case-parity.json). Hero and four other cover DOM hashes,
image sources/dimensions, 16px radius and navigation links also match V1.

## Verification

Chromium 151.0.7922.34, DPR 1, reduced motion, loaded Onest fonts and decoded
images; real page scrolling initializes off-screen reveals. Raw AFTER PNGs
match V1's viewport dimensions and capture method. All six were inspected.
The existing site typographer inserts nonbreaking spaces; it was not changed.

| Locale | Viewport | Title lines | Horizontal overflow | Matched captures |
| --- | --- | ---: | ---: | --- |
| EN | 1440×900 | 2 | 0px | [V1](../v1/after/en-1440-cover.png) / [V1.1 AFTER](after/en-1440-cover.png) |
| EN | 390×844 | 2 | 0px | [V1](../v1/after/en-390-cover.png) / [V1.1 AFTER](after/en-390-cover.png) |
| EN | 360×800 | 2 | 0px | [V1](../v1/after/en-360-cover.png) / [V1.1 AFTER](after/en-360-cover.png) |
| RU | 1440×900 | 2 | 0px | [V1](../v1/after/ru-1440-cover.png) / [V1.1 AFTER](after/ru-1440-cover.png) |
| RU | 390×844 | 2 | 0px | [V1](../v1/after/ru-390-cover.png) / [V1.1 AFTER](after/ru-390-cover.png) |
| RU | 360×800 | 2 | 0px | [V1](../v1/after/ru-360-cover.png) / [V1.1 AFTER](after/ru-360-cover.png) |

No title clipping, broken images, browser errors or failed HTTP requests.
[Browser measurements](logs/browser.json), [repeatable capture script](capture.mjs).

- `npm run check`: 0 errors, 0 warnings, 163 existing hints. [Log](logs/check.txt).
- `npm run build`: PASS, 37 routes. [Log](logs/build.txt).
- `npm run check:css`: PASS. [Log](logs/css.txt).
- `npm run check:content`: 0 findings. [Log](logs/content.txt).
- `git diff --check`: PASS.

The correction is ready for independent review; no self-acceptance, merge,
deployment or Figma work is included.
