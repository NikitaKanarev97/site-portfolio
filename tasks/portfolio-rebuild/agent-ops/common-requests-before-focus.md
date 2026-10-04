# F · common requests

One acceptance dependency is open: F-G-01 below. Frozen CaseStory, checkpoint, narrow panels, native Next and all evidence fields otherwise cover the reached composition. D-G-01 optional role zones is unrelated to F.

G-final integration: import agentOpsStory / agentOpsStoryRu from the existing case copy files and attach story/theme to the public entries after acceptance. Preview is /preview/agent-ops-rebuild/{en,ru}/; public registry/route/order is not changed in F.

## F-G-01 · preserve reading position on repeated live reduced-motion

Status: OPEN, needs sequential G common fix and F retest. Frozen common base a6faac3a3d10eb6601fcc34caa70a915bea5dab3. Shared src/scripts/animations.js and src/scripts/motion.js are unchanged. F does not add a route-specific motion/CSS workaround.

Affected: actual /preview/agent-ops-rebuild/{en,ru}/ on production http://127.0.0.1:4384, Chromium 1243, 1440×900. This is a technical lifecycle finding, not evidence of a client or business outcome.

Steps: load either locale, allow fonts and images to decode; read the enlarged promise scene at focus start +1300 px. Toggle prefers-reduced-motion reduce → no-preference three times, with 600 ms or 1800 ms settling after each toggle. Reproducer also exercises all currently visible materials before returning to promise, as the F matrix does. No wheel or key event occurs between toggles.

Expected: the current material remains at its viewport position (about 123 px); reduce removes the one pin and reveals the natural list, full recreates one pin. Both branches retain all text/UI.

Observed before final headline polish: some reduce transitions put promise.top at 653 px (RU, +530 px) or 672 px (EN, +548 px), showing the previous workspace instead. Returning to full restores ~123 px. Four independent locale/settle samples reproduced five bad reduce transitions; other transitions passed. Cold reduce/no-JS entry, normal scroll and Next/Back are unaffected. The final-copy matrix and reproduction in report.md are authoritative for the handoff.

Final-copy broad matrix: motion-verification.json/log, two RU reduce failures on cycles 1 and 2: promise.top 703.25 px instead of ~123.16 px (+580.09 px); scrollY 3450. Other profile/geometry/headline/Next/Back checks passed. Dedicated final RU reproduction is live-final-ru-reproduction.json/log; its screenshots carry the current copy.

Earlier evidence retained: motion-before-copy-verification.json (two RU failures); live-reproduction.json/log (both locales, both wait windows). The unchanged EN pilot control, pilot-live-reproduction.json/log, passed six reduce transitions in this sample. Therefore do not claim this is reproduced on every old pilot; F's valid material geometry exposes the shared lifecycle issue. No root cause is asserted from screenshots.

Shared investigation boundary: restoreFocusReading / focusReadingSnapshot and preference reflow in animations.js. Correction must preserve the reading material through the native list/pin rebuild, including browser scroll anchoring; no new design direction or timing is needed. G should reproduce on the final F exports and both locales, fix the common layer, then rerun the focused matrix, live cycles and resize/Next/Back checks. F acceptance remains conditional until that verification passes.
