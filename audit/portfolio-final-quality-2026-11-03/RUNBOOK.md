# Reproduce the handoff

Source revisions and integration decisions: BASELINE.md. Application source at
`c4192c42728d4c937092cb0a7fc25b047af72624`; evidence is published in the same review
branch. Keep the original user's checkout and other worktrees intact.

From an isolated checkout of the review branch:

```powershell
npm ci
npm run check
npm run build
npm run check:content
npm run check:css
npm run preview -- --host 127.0.0.1 --port 4414
```

Use a free port; set `QA_BASE` if different. The matrix checks that served production
HTML equals this checkout's dist, so a busy port cannot silently audit another build.
Browser tools reuse the already installed Playwright/Chromium/WebKit/axe-core from
the neighboring Agent-ops-console tool installation. No product repo is modified.
`common.mjs`, axe injection and ffmpeg paths are explicit machine-local paths;
adjust those tooling paths when reproducing on another computer.

Representative commands, from the repository root:

```powershell
node audit/portfolio-final-quality-2026-11-03/matrix.mjs after
node audit/portfolio-final-quality-2026-11-03/interactions.mjs after
node audit/portfolio-final-quality-2026-11-03/browser-smoke.mjs chromium
node audit/portfolio-final-quality-2026-11-03/browser-smoke.mjs webkit
node audit/portfolio-final-quality-2026-11-03/late-bundle.mjs after
node audit/portfolio-final-quality-2026-11-03/motion-capture.mjs after
node audit/portfolio-final-quality-2026-11-03/supplemental.mjs
node audit/portfolio-final-quality-2026-11-03/performance.mjs
```

`WIDTHS`, `ROUTES`, `QA_BASE` optionally constrain a matrix run. `AXE_ONLY=1`
limits supplemental.mjs to the full axe matrix. `FINAL_CAPTURE=1` refreshes matched
page captures after each scan. Avoid simultaneous builds; performance runs were
performed after our other active browser suites finished.

`lifecycle.mjs` additionally expects the dev server on 4463 for the existing
`window.__dsMotionDebug` diagnostics. Firefox launch was attempted and its missing
binary recorded, rather than substituting a different browser. A real toolbar200%
zoom or physical device test is not claimed.

The Lighthouse CLI was reused from the existing npm tool cache. Default mobile
simulation ran on Home EN/RU and Agent, plus `--preset=desktop` on Home. Full reports,
exit codes and a compact summary are in logs/. Applied CDP throttling traces use
390×844, 150ms latency, 1.6Mbps download and 4× CPU; gzip traces can be decompressed
and loaded into Chrome's Performance panel.

`make-evidence.mjs` assembles existing real captures and extracts equal-time frames
from actual browser video. It does not repaint UI or create simulated motion.
Open index.html locally; its controls and image loading were browser-verified.
