# Evidence index

No product file changed in the release pass, so no new UI screenshots or recordings were
made. Visual and motion evidence for this exact application source
(`e434919b60687f781eeb25d8f79ee995e42891b9`) is already committed and immutable at that SHA:

| Evidence | Path at `e434919b` |
|---|---|
| Matched BEFORE/AFTER navigation frames, gallery | `audit/portfolio-final-quality-2026-11-03/v1.1/index.html` |
| Continuous normal-motion videos (Chromium/WebKit, EN 1440 / RU 360) | `audit/portfolio-final-quality-2026-11-03/v1.1/after/*/*/browser.webm` |
| Evidence SHA-256 manifest | `audit/portfolio-final-quality-2026-11-03/v1.1/evidence-manifest.json` |
| Page captures, motion recordings, comparisons | `audit/portfolio-final-quality-2026-11-03/{after,motion-after,comparisons}/` and `index.html` |

This release pass re-ran the same harness and stores compact numeric results in
[`../logs/qa/`](../logs/qa/) (per-rAF computed transition colors as check lists, matrices,
interaction/state results, axe, performance, Lighthouse summary). Screenshots and videos
produced during this run were kept in the session scratchpad and not committed, to avoid
duplicating ~100 MB of binaries already present for the same source.
