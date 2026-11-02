# Vet Clinic Portfolio V3.1 — external-link alignment

2026-11-02 · branch `codex/vet-clinic-portfolio-premium-v3-2026-11-02` · base `864c4eadabe0d0b839010d06924d13a97b530370`.

Implemented and verified; **final visual acceptance remains with independent review**.

## Change

The browser confirmed the conflict: Vet's 48px links placed text at the top while centering the SVG, leaving the marker about 11px below the text's centre. `TextLink.astro` now centres one content group in the target. Inside that group, inline SVG alignment follows the font's x-height (`vertical-align: middle`), with the existing `space-2` gap. A nowrap boundary plus word joiner keeps the marker with the last word; the label permits normal wrapping. Resetting inherited `text-wrap: pretty` also prevents an orphaned SVG in Pawly RU at 320px.

No alignment translations, new tokens or page overrides. SVG geometry, destinations, new-tab hints, rel attributes, inline underlines, navigation states and directional hover motion remain. The DS catalog documents the shared treatment. Application changes are limited to `src/components/TextLink.astro` and `ds/components.md`.

## Evidence

Open [matched gallery](index.html) or [contact sheets](boards/). `before/` is the actual production build of the supplied base, captured before editing. `after/` is the final production build. Both use the same local origin, fonts, viewport, scale and capture routine.

- Home, Agent Ops Console, Partner Portal, TRASSIR Learn, Vet Clinic and Pawly; EN/RU; 1440/390/320 CSS px: **36 matched combinations**.
- **390 close-up pairs**, including normal, hover and keyboard focus; all three Vet inspection links and the final prototype CTA. Home's native dialog covers inline links; navigation and directional arrows are included.
- Primary captures use reduced motion for stability. Files named `motion` additionally capture normal/hover/focus with no motion preference. Narrow hover captures use a fine pointer; separate interaction QA uses real coarse-pointer/touch emulation.
- [Measurements](comparison.json), [interaction results](browser-qa/tests.json), [WebKit geometry](browser-qa/webkit.json), full [logs](logs/).

## Verification

| Check | Result |
|---|---|
| Matched geometry/content/media assertions | **753/753 pass**; 234 visible link instances |
| Keyboard, mouse, touch, target hit testing | **173/173 pass** |
| Vet targets | All four remain 48px on every viewport/locale |
| Wrapping | Marker follows the last text line with an 8px gap; no orphan |
| Reduced motion | No marker translation; effective transitions disabled |
| Real external activation | All Vet destinations opened; final CTA renders the localized product index |
| WebKit | All 36 combinations pass marker geometry checks |
| `npm run check` | 0 errors, 0 warnings; 163 existing hints |
| `npm run check:css` | Pass |
| `npm run check:content` | 0 findings |
| `npm run build` | Pass; 37 pages |
| `git diff --check` | Pass |

No dedicated lint script exists; Astro and repository CSS/content validation were used. Axe found no findings on TextLink nodes. Full-page scans also record unrelated `color-contrast` and `list` findings in the JSON files; this is not a claim of whole-site accessibility acceptance.

All section/heading rectangles match before/after. All 456 image instances retain source, alt, intrinsic and rendered dimensions; 36 matched control-image screenshots have identical SHA-256 hashes. No narrative, clinical copy, media, unrelated section source or dependencies changed.

Known baseline condition: Agent Ops and Partner Portal RU each have 7px document overflow at 320px, identical before/after. No new overflow. No merge, deployment or Figma edits performed.

## Reproduction

Serve a production build on `127.0.0.1:5391` using the parent `serve.mjs`. Run `capture.mjs before|after` and `motion.mjs before|after` against the corresponding build; run `qa.mjs`, `webkit.mjs`, `compare.mjs` and `gallery.mjs` after the final build. Playwright/axe are resolved from the existing local `D:/Claude-projects/Agent-ops-console` installation; no dependency was added.

Remaining request: independent visual acceptance of the matched gallery.
