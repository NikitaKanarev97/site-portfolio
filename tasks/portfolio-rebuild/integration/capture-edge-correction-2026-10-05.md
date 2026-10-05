# Capture edge correction · 05.10.2026

The owner found a faint line above Marsik after the preceding UI cleanup. The prior geometry/CSS checks did not inspect every raster edge and missed it.

Reproduction: a composed source DOM capture was appended immediately after the original React screen. Its upper boundary was at CSS y=710.5. The first two physical screenshot rows included the adjacent original screen's boundary (100% tinted coverage). The cloned VisitHeader itself had border-top 0, box-shadow none and no pseudo-element. Isolating the capture at y=0 made those rows completely white without changing the product header.

Fix: compose selected panels in an opaque capture area at integer coordinates. Capture action bars in their natural document flow position so they cannot cover another selected panel. The narrow quick-trace cover also preserves the existing private note between the calculation and action bar. No source borders or words are painted over. Re-rendered 14 Vet assets: EN/RU, wide/narrow draft, saved and trace, plus narrow quick-trace covers.

The capture script now rejects a foreign horizontal line occupying over 90% of either of the first two raster rows and rejects intersecting selected panels. All refreshed captures passed.

Visual audit: 148 local raster images referenced by Home, About and five cases in both locales were reviewed in nine contact sheets, with separately enlarged top and bottom edges. Inventory: `capture-edge-inventory.json`. No further adjacent-screen edge artifact was found. Meaningful component/table borders remain part of their source UI. This is an image review and does not claim exhaustive functional testing of every prototype state.

Reproduction tools: `scripts/refresh-clean-ui-frames.mjs` and `scripts/audit-screen-captures.mjs`. Capture hashes are in `ui-cleanup-captures.json`. Portfolio build and responsive browser verification are repeated before release.

Release acceptance: build passed; 84 responsive route/width combinations passed in Chromium and 28 in WebKit (390/820, each route opened independently). No horizontal overflow, frame/image height mismatch or frame/action misalignment was found. All 148 image-edge inventory candidates were clear after the correction.
