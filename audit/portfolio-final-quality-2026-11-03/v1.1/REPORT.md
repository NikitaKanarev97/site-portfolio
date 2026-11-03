# Portfolio Final Quality V1.1 · Independent review handoff

3 November 2026. Correction prepared on
`codex/portfolio-final-quality-2026-11-03`, isolated worktree
`D:/Claude-projects/sp-final-quality-2026-11-03`. Baseline:
`69fa89864c179d7c9cb108af5de25522cf65f47d`.
**Not self-approved. Independent review remains the acceptance gate.**

## Change

Agent navigation now derives from `--surface-nav-agent` → `--surface-subtle`
(`#F7F7F5`); Portal derives from `--surface-nav-portal` →
`--surface-portal-editorial` (`#EDF2F8`). Current Home/hero, CaseNext, and native
group/old/new snapshots share these roles. Both navigation themes use light tone.
Agent Home no longer inherits inverse focus. Existing light label, arrow, hover,
pressed and keyboard rules supply the corresponding dark text and tomato focus.

Legacy `caseThemes`, historical cover tokens, documentary plates and source
screenshots keep their values. The accepted Learn, Vet and Pawly transition
rules, all motion timing/easing, media radius, RU text, source media and case
narratives are unchanged. See [source-wide audit](SOURCE-AUDIT.md).

The expanded tests also found a real mobile WebKit history issue: Home's saved
scroll coordinate could shift before motion initialization, which then preserved
the shifted value. `animations.js` now carries Astro's saved history coordinate
through font/layout cleanup. Normal named snapshots, duration/easing and body
transition choreography are unchanged. [Before trace](logs/history-webkit.log),
[corrected trace](logs/history-webkit-final.log), [detailed calls](logs/history-webkit.json).

## Independently inspectable evidence

- [Browser gallery: matched BEFORE/AFTER and every intermediate frame](index.html)
- [EN/RU × 1440/390/360 × Chromium/WebKit matrix](TRANSITION-MATRIX.md)
- [Chromium computed colors and native timing](after/chromium/results.json)
- [WebKit computed colors and native timing](after/webkit/results.json)
- [Actual captured-frame color comparisons](logs/frame-colors.json)
- [Evidence SHA-256 manifest](evidence-manifest.json)

Direct examples:

- [Before: Home → Agent, EN 1440, ~300ms](before/chromium/en-1440/home-to-agent-300ms.webp)
- [After: same path/frame](after/chromium/en-1440/home-to-agent-300ms.webp)
- [Before: Agent → Portal, RU 360, ~300ms](before/chromium/ru-360/agent-to-portal-300ms.webp)
- [After: same path/frame](after/chromium/ru-360/agent-to-portal-300ms.webp)
- [Chromium EN desktop continuous normal-motion video](after/chromium/en-1440/browser.webm)
- [Chromium RU 360 continuous normal-motion video](after/chromium/ru-360/browser.webm)
- [WebKit EN desktop continuous normal-motion video](after/webkit/en-1440/browser.webm)
- [WebKit RU 360 continuous normal-motion video](after/webkit/ru-360/browser.webm)

## Tested facts

Production build, served locally on port 4415; no reduced motion or animation
completion overrides in the transition recordings. Each engine ran both locales
at 1440, 390 and 360 CSS px, height 900 desktop / 844 mobile, DPR 1.
Windows x64, Chromium 153.0.8010.12 and Playwright WebKit 26.5;
[environment record](logs/environment.json).

For each configuration: keyboard Home → Agent, Home → Portal, then the complete
Pawly → Agent → Portal → Learn → Vet → Pawly cycle. This covers all four required
paths plus every edge in the five-case cycle.

| Validation | Result / output |
|---|---|
| Baseline reproduction | 8 Chromium transitions, EN 1440/RU 360; 20 expected color failures; no exceptions. [Baseline log](logs/before-chromium.log) |
| Native transition regression | 42 transitions / 316 assertions per engine; 632/632 total pass; no runtime exceptions. [Chromium](logs/after-chromium.log), [WebKit](logs/after-webkit.log) |
| Real raster comparisons | 48/48 pass at requested ~300ms out/in boundary; 280 frames analyzed across before/after. Current surface occupies >2% of frame; obsolete color <0.5%. [Output](logs/frame-colors.log) |
| Expanded browser state tests | 290/290 per engine; outputs below cover direct entry, history, scroll, interrupted navigation, keyboard, UI states, dialogs, reduce, no-JS, unsupported VT, delayed JS. |
| Existing browser smoke | Chromium 138/138, WebKit 128/128; no exceptions. [Chromium](logs/chromium-smoke.json), [WebKit](logs/webkit-smoke.json) |
| Typecheck | 0 errors, 0 warnings; 163 existing hints. [Output](logs/check.log) |
| Scoped CSS validation | All checked routes: 0 dead scoped rules. [Output](logs/check-css.log) |
| Production build | 37 routes built successfully. [Output](logs/build.log) |
| Public content validation | 0 findings; 156 public files, 183 built HTML examined. [Output](logs/content.log) |
| Lint | No lint command configured; Astro check and project CSS validator used. |
| DS and preserved inputs | Token mirrors byte-identical. Both motion files and public media unchanged from baseline. animations.js changes only the history coordinate lifecycle described above. |

Expanded state outputs: [Chromium JSON](logs/states-chromium.json),
[Chromium log](logs/states-chromium.log), [WebKit JSON](logs/states-webkit.json),
[WebKit log](logs/states-webkit.log). Each tests both locales and all three widths.
No-JS performs a real full-document Next Case navigation; unsupported native VT
performs client navigation; delayed JS holds the bundle for 3.2s and samples
readability before and after its arrival. Back/Forward waits for Astro page-load,
then checks actual body/intro opacity and restored Home scroll. Interruption uses
history while the real next-case animation is still running.

Measured light-surface contrast: title ≥15.34:1, label/arrow ≥5.60:1 across rest,
hover, keyboard focus and pressed; focus outline ≥4.36:1. Both changed CaseNext
themes have `data-tone=light`. Agent Home has no inverse-focus ancestor. Existing
browser smoke also exercises MediaZoom/ProjectDialog traps/return, mobile menu
and relevant axe rules. Color assertions supplement that existing accessibility
coverage; this is not a claim of a new full manual WCAG audit.

## Method and limitations

**Assumptions / inference, separated from measurements:** the supplied accepted
Home/hero palette and explicit Learn/Vet/Pawly approvals are the design target.
The exact internal WebKit reason for its viewport adjustment is not established;
the trace establishes when the coordinate diverges and verifies that retaining
Astro's saved coordinate fixes the tested history paths. Legacy colors are
classified from source call sites; the entire historical preview catalog was
not visually re-reviewed.

The capture harness observes the real `document.startViewTransition` result;
`ready` sets time zero and `finished` supplies observed completion. It samples
computed group/old/new backgrounds, native durations and body opacity per rAF.
Screenshots are requested at 0/100/300/600/1000ms without skipping, pausing,
slowing or finishing animation. Videos are continuous browser recordings.

Screenshot acquisition has real latency. WebKit is substantially slower and some
requests slip well past their nominal offset.
Every frame records its actual start/end window in results.json and the gallery.
Thus the filenames are **requested offsets, not exact rendered timestamps**.
Use the continuous videos and per-rAF samples alongside frames. Raster checks
are bounded observations at the captured frame, not proof about every pixel of
every millisecond. No blanket ban is applied to legitimate colors inside product
screenshots. Computed backdrop checks cover all sampled active native frames.

The accepted Learn hero is neutral and Pawly hero white while their transition
groups remain navy/sand; this is baseline behavior and deliberately preserved.
Agent Home's accepted mobile composition has transparent outer wrappers; its
desktop neutral scene was not expanded into a new mobile panel.

Test-harness development exposed several distinctions, with initial logs retained:
trailing slashes differ between direct and client routes; Back/Forward resolves
before Astro page-load; WebKit's Tab policy can skip anchors. Final tests account
for these without product changes. The history assertion compares the position
immediately before Enter, after natural keyboard focus scrolling. That adjustment
did not hide the mobile WebKit restoration defect; it remained reproducible until
the saved-coordinate lifecycle fix described above. The first generic hero expectation also
incorrectly assumed Learn/Pawly heroes match their approved navigation color;
it was corrected to baseline values before the final 632-assertion run.

The Windows WebKit runtime stalled on Escape when zoom was opened during an
active native snapshot. The final post-navigation menu/dialog test waits 1.15s
for the natural 1s animation to complete; no animation is advanced. Dialog
operation **during** an active native snapshot is a remaining runtime coverage
limitation, recorded in `logs/states-webkit-active-snapshot-dialog.log`. Normal
post-navigation dialogs, and separately interrupted navigation, are tested.
Results do not establish behavior on physical iOS Safari or other browser builds.

## Files and reproduction

Product/DS files changed: `ds/tokens.css`, mirrored `src/styles/tokens.css`,
`ds/foundation.md`, `ds/components.md`, `ds/screens/case.md`,
`ds/motion-concept.md`,
`src/copy/cases/story.ts`, `src/styles/global.css`, `CaseNext.astro`,
`src/scripts/animations.js`,
`FeaturedCase.astro`, `WorkStage.astro`, `agent/AgentHome.astro`,
`agent/AgentCase.astro`, `portal/PortalHome.astro`, `portal/PortalCase.astro`.
The existing audit `common.mjs` adds only `QA_ROOT` output isolation so V1 smoke
tests write here without overwriting the earlier evidence.
Full staged file inventory: [CHANGED-FILES.txt](CHANGED-FILES.txt).

With production preview running on port 4415, PowerShell:

```powershell
$env:QA_BASE='http://127.0.0.1:4415'
$env:QA_ROOT='audit/portfolio-final-quality-2026-11-03/v1.1'
node audit/portfolio-final-quality-2026-11-03/v1.1/transitions.mjs after chromium
node audit/portfolio-final-quality-2026-11-03/v1.1/transitions.mjs after webkit
node audit/portfolio-final-quality-2026-11-03/v1.1/states.mjs chromium
node audit/portfolio-final-quality-2026-11-03/v1.1/states.mjs webkit
node audit/portfolio-final-quality-2026-11-03/v1.1/frame-colors.mjs
node audit/portfolio-final-quality-2026-11-03/v1.1/make-evidence.mjs
```

The harness reuses V1's local Playwright/Chromium paths in `common.mjs`;
those paths must exist or be adapted on another machine. No dependency changes.

The two obsolete colors are absent from **current published Agent/B2B navigation
roles and sampled intermediate backdrops**, while legitimate legacy/product
colors remain intact. No merge, production deployment or Figma change performed.
