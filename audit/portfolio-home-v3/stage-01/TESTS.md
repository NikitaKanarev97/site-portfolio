# Reproduction and verification

Working directory: `D:/Claude-projects/sp-home-premium-v3`. Code: `d8544b7378123b5b7f5f3849d8872d20775531b8`.
Dependencies installed with `npm ci --no-audit --no-fund`; lockfile unchanged.
Node 24.18.0, Chromium 151.0.7922.34. QA reuses local Playwright and axe-core from
`D:/Claude-projects/b2b-dssl/node_modules`; no product dependency was added.
Set `PLAYWRIGHT_REPO` to another installed toolchain's project directory if needed.

## Required checks

| Command | Result | Full output |
| --- | --- | --- |
| `npm run check` | 0 errors, 0 warnings, 163 hints | [Astro](logs/astro-check.txt) |
| `npm run build` | 37 routes | [Build](logs/build.txt) |
| `npm run check:css` | 0 dead rules on every scanned route | [CSS](logs/scoped-css.txt) |
| `npm run check:content` | 0 findings | [Content](logs/content.txt) |
| `npm run check:harmony` | 0 violations in existing /kit 1440/1024/390 matrix | [Harmony](logs/harmony.txt) |
| `node audit/portfolio-home-v3/stage-01/tools/browser-qa.mjs` | 42 passed, 0 failed | [Structured results](logs/browser-qa.json) / [console](logs/browser-qa.txt) |
| `node audit/portfolio-home-v3/stage-01/tools/conversion.mjs` | Contact/visible focus + external-demo probes | [Results](logs/conversion.json) |
| `git diff --check` | passed | [Source patch](logs/source-diff.patch) |

There is no `lint` script in package.json. Harmony also prints the existing Node
DEP0190 deprecation warning in its preview launcher; it does not report a failed
rule. Historical cached Vite files contribute many Astro hints and are not edited.

## Browser checks actually performed

EN/RU × 1440×900, 390×844, 360×800:

- axe WCAG 2 A/AA, 2.1 AA and best-practice checks: **0 violations in all six scans**.
  Individual axe logs retain passes and items requiring manual review.
- Primary work anchor, actual CV PDF response/header, every internal destination.
- Keyboard Enter copies the real address; clipboard content and polite announcement
  match. Forced clipboard denial retains a selectable address and visible announcement.
- All four Webflow dialogs opened with Enter, Tab stays in the modal/browser focus
  cycle, Escape closes, focus returns to the trigger. Native Chromium may place
  focus on body/browser chrome between cycles; no background control is reached.
- Mobile menu Space/Tab/Shift+Tab/Escape, focus trap, return and 48px trigger target.
- Actual clicks through five cases, About and language switch. Agent case's existing
  image zoom opens from the keyboard and restores focus on Escape.
- Contact anchor/mailto and visible primary-link focus are additionally checked in
  EN/RU at 1440/390. External Webflow URLs are probed separately, not altered.

EN/RU × 390 additional real captures: normal motion, reduced motion, JavaScript
disabled, 600ms-delayed media and an intentionally blocked Agent image. No-JS
content/anchors stay present. Broken image retains alt and its reserved geometry.
No uncaught page errors or horizontal overflow were observed in these states.

Settled capture matrix additionally includes 1024×900: zero missing image decodes,
zero HTTP/page errors, zero overflow, one h1 in all eight configurations. All
photos/native product captures decode before saved screenshots.

## Layout shifts are reported, not omitted

[Loading comparison](logs/loading-comparison.json) repeats the same 600ms media
delay on baseline and implementation, both languages. Existing navbar fallback
initialization moves main by 72px; measured CLS is **0.0772219851 in both builds**.
Native product image width/height are unchanged across the delay. Normal-motion
samples measured approximately 0.00375/0.00380; reduced settled samples were 0.
These are controlled local observations, not field LCP/CLS or a Lighthouse score.

## Capture commands

Build implementation, then retain `npm run preview -- --host 127.0.0.1 --port 4412`.
For BEFORE, create a detached worktree at `7d4c51e`, install/reuse the same locked
dependencies, build, and retain its static preview on port 4413. The implementation
used `.tmp/home-v3-baseline` with its own `.astro` and `dist`; no competing build
writers shared an output directory.

```powershell
$env:PLAYWRIGHT_REPO='D:/Claude-projects/b2b-dssl'
$env:PORTFOLIO_ORIGIN='http://127.0.0.1:4413'
node audit/portfolio-home-v3/stage-01/tools/capture.mjs before
$env:PORTFOLIO_ORIGIN='http://127.0.0.1:4412'
node audit/portfolio-home-v3/stage-01/tools/capture.mjs after
node audit/portfolio-home-v3/stage-01/tools/browser-qa.mjs
node audit/portfolio-home-v3/stage-01/tools/aligned-pawly.mjs
node audit/portfolio-home-v3/stage-01/tools/regressions.mjs
python audit/portfolio-home-v3/stage-01/tools/compare.py
```

The final captures use static builds; exploratory dev captures were replaced.
After source corrections the required checks and relevant browser matrix were
repeated. Earlier harness issues (selecting a hidden duplicate About link and
assuming browser chrome is a background dialog control) were corrected; the final
scripts/logs are the reproducible result, not an invented all-pass summary.

Not verified: physical touch devices, Safari/Firefox, screen-reader operation,
field performance, current production pixels, live animation behavior of reference
sites, inaccessible/non-archived Blinkov/Victor visuals. Independent visual acceptance
remains required.
