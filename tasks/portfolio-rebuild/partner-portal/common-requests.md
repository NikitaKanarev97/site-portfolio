# Partner Portal · common requests

No blocking request at composition start. Frozen A supports ordered blocks, responsive diagrams, native specimens, focus scene and no-JS fallback. Product's missing post-order source snapshot is an evidence limitation, not a request to portfolio renderer.

## B-G-01 · Next marquee after repeated resize · P2

Frozen A runtime `src/scripts/animations.js`, `buildCaseScenes` marquee; reproduces in the actual B story. Case files do not patch it.

Repro on dev `http://127.0.0.1:4355/preview/partner-portal-rebuild/en/`: open at 1440×900; resize 390×844 → 360×844 → 1024×900 → 1440×900 → 390×844 → 1440×900, 650 ms after each; scroll Next into the center. Track transform stays `none` across a further 500 ms. Scroll 900 px above and re-enter: matrix starts changing. A fresh normal entry animates immediately. Hover/focus must keep movement running.

Evidence: `next-probe.json` (fresh entry versus resize); `motion-verification.json` final lifecycle record. All 10 motion viewport/locale profiles, focus resize ownership, native Next/Back/Forward and locale navigation pass. One marquee assertion fails after the resize sequence, with no runtime exceptions or duplicate scenes. The entire motion suite is not PASS.

Request G to synchronize marquee `inView` when a newly created/refreshed trigger is already active. Expected: title moves after resize and after Back without needing exit/re-enter, continues under hover/focus, rests under reduced motion; no pause control. Recheck in the shared layer before publication. Story composition/media/data are ready for integration; this shared lifecycle defect remains open.
