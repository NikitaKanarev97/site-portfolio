# F · actual-case retest after accepted focus patch · 04.10.2026

**F-G-01 is CLOSED on actual F.** All required actual-case retest suites pass. The unchanged EN/RU story and media are ready for controller review and G-final integration. Owner artistic acceptance is not inferred from these technical observations.

Checkout: `C:/Users/kanar/.codex/worktrees/agent-ops-rebuild-f/Site-portfolio`, branch `codex/agent-ops-rebuild-f`. Submitted F payload: `3d35b7c88b89f36c72eaff315dec4bfc5dc887a5`. Accepted shared delta / new common base: `6e8f0e075916dec82a90831c7c2c78a38ea60e20`. Exact cherry-pick in actual F: `c950cb20ec9557f6a656dd8ed825c18b40970c88`. Only animations.js and motion-concept.md were imported; their raw SHA-256 matches the accepted values. No common file was edited afterwards. G proof/metadata was read, not cherry-picked.

Working own production origin: [EN](http://127.0.0.1:4384/preview/agent-ops-rebuild/en/) · [RU](http://127.0.0.1:4384/preview/agent-ops-rebuild/ru/). DEV registry checks used own 4385. New data lives only in retest-focus; original 3d35 failures/frames/logs remain unchanged as history. [Original report](../report-before-focus.md) and [original request](../common-requests-before-focus.md) retain the previous conditional handoff.

## Actual results

| Check | Actual coverage | Result / evidence |
|---|---|---|
| Original promise reproducer | EN/RU × 600/1800 ms, fonts + visible images decoded, focus start +1300, three reduce/full cycles | 24 switches, 0 failures, max top delta 0.1875 px; actual-final.json / exact.log |
| Native wheel / reading identity | Four real scenes, both locales/waits, three cycles; reverse/fast and new material after gesture | 36 observations, 96 switches, 0 failures, max top delta 0.59375 px; native-states.json / native.log |
| Full motion / lifecycle | 10 viewport/locale profiles; 64 stopped focus positions; 44 reverse/fast positions; live preferences, resizes, Next hover/focus and visible resize, native Next/Back/Forward/locale | 12 observations, 0 failures/page errors, whole loaded proof and active headings pass; motion-verification.json |
| Full/reduce/no-JS | 1440×900, 1024×900, 390×844, 360×800, 1440×600, both locales | 20 static profiles plus four no-JS native Next/Back scenarios, 0 failures; static-verification.json |
| Registry / anchor release | DEV actual GSAP + reading ResizeObserver instrumentation; preference cycles, resize, native navigation, Back | 30 snapshots, 0 duplicates/failures; max one pin/observer; zero reading observers on Next/away/Back; f-debug.json |
| Check / build / CSS | Actual checkout, preserved dependencies | 109 files, 0 errors/warnings, 101 existing hints; 32 pages/routes, 0 dead rules; check/build/css logs |
| Harmony | Both locales × 1440/1024/390/360 × heights 900/600 | 16 samples, 0 violations; harmony-900.log / harmony-600.log |
| Frozen integrity | All 630 previous manifest paths, no omissions; only the two accepted delta blobs permitted | 628 original blobs + two exact accepted blobs, 0 failures; audit.json |
| Payload / source / media | EN/RU copy and preview SHA-256, 186 immutable historical task files, 13 product files + clean HEAD/status, 30 proof HTTP responses | All unchanged; all 30 HTTP 200 match recorded/disk SHA-256; audit.json |
| Mirrors | ds/tokens.css ↔ src/styles/tokens.css; ds/motion.js ↔ src/scripts/motion.js | Exact byte equality; audit.json |
| Film adapter | Accepted G 14-observation regression at same shared bytes; MediaFrame unchanged | Proof hash and adapter verified; reused reference, not an actual F rerun; film-reference.json |

Back restores exact previous scrollY: EN 6517→6517, RU 6493→6493. Current material stays opaque/decoded; reduce removes the one pin and full restores the correct scene. New native input changes reading identity freely. The observer does not hold Next, route exit or Back. Full/reduce/no-JS preserve final values, complete panels, the separate $420/$340 fixtures, both approval actions and independent RU text.

The first DEV attempt did not load GSAP: the dependency URLs returned 504 Outdated Optimize Dep after tooling changed the Vite cache. It produced no runtime/debug hook and is retained as dev-stale-deps.json/log plus dev-diagnosis.log. Restarting only the own DEV process fixed the server condition; the verifier now waits for the actual hook. The completed registry run passes. This invalid attempt is not a residual case defect and does not replace the original historical F-G-01 failures.

The frozen common 6e8f0e0 catalog includes four newer coordination metadata blobs. The requested two-file import deliberately retains F's exact old PLAN-CHATS.md, integration/base.md, film-common-report.md and handoffs.json, just as the accepted G transfer did. They remain positively checked against original F-base blobs; fresh root metadata was read separately. audit.json records this catalog difference explicitly. No blanket metadata/common exclusions are used.

## Visual review and reproduction

Opened actual F native workspace/decision EN/RU and final RU before/reduce proof. The promise heading remains around 123 px in the natural reduced list, instead of the historical 703 px shift. Whole source panels, two human-stop strokes, fields, borders and rejected/approved actions retain the checkpoint composition. Case copy, preview route and public media bytes are identical to 3d35. Product captures were not repeated; no new art direction, UI artifact or case-specific motion override was introduced.

Current actual frames: [RU full promise](shots/actual-final-ru-1800-before.png), [RU reduced promise](shots/actual-final-ru-1800-reduce.png), [RU workspace](shots/native-ru-workspace-full.png), [RU decision](shots/native-ru-decision-full.png), [EN decision](shots/native-en-decision-full.png). All four native states have EN/RU full/reduce frames under shots/. Earlier checkpoint comparisons, static full pages and original native films remain valid for the unchanged visual material and are linked from the original report.

Reproduction: build this checkout, serve production on 4384, then run retest-focus/reproduce-exact.mjs --label=actual-final, verify-native.mjs, verify-matrix.mjs --no-shots and --static --no-shots, audit.mjs. Run own DEV server on 4385 after build/check, then verify-debug.mjs. Browser suites were sequential; no CPU/encoding probe ran with captures. G scripts were adapted only into F's task folder; verifier-provenance.json records sources, hashes and adaptations. Existing F geometry/headline checks were reused. G proof was never overwritten.

Local Chromium 1243 viewport emulation only. Physical devices, other engines, separate CPU/GPU performance and physical hidden-tab behaviour are not certified. The film hidden handler reference is explicitly synthetic. No new user-study or business-result claim follows from this technical retest.

## Integration handoff

G already has shared commit **6e8f0e075916dec82a90831c7c2c78a38ea60e20**. Do **not** cherry-pick F's duplicate import c950cb2 into G. Case payload chain is the original **3d35b7c88b89f36c72eaff315dec4bfc5dc887a5**, then the new owned proof/handoff commit containing this report. The final response supplies that exact final immutable ref; it can also be resolved on codex/agent-ops-rebuild-f. Owned case files are listed in ../files.txt; this retest's changed-file whitelist is files.txt.

After controller acceptance, G imports agentOpsStory / agentOpsStoryRu into public entries with agent theme and matching locale prototype links, then checks the real adjacent case and site-wide integration. Public registry/routes/order, home, STATE/CONTROL and publication remain for their authorised owners. F has no remaining common request. No push or deploy was performed.
