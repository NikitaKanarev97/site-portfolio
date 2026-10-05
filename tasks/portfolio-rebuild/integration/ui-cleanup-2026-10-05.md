# UI cleanup · 05.10.2026

The owner authorized source application fixes and immediate production release.

- Vet Clinic OS source `f58fb858f3dd9227978c0fefe63ed186c30176cc`: VisitHeader no longer adds a lower rule. Trace facts retain their opening boundary and have no trailing rule on the final row, at one, two and four columns. The last invoice service no longer adds a second line before the total on mobile.
- Pawly source `91647ea8cfcf19719b1f6f1a191aa1903fd3b8b4`: explanatory owner footers flow after the document without a top rule. The full local-demo explanation remains above the review action; action-only footers keep sticky behavior.
- Portfolio CaseScreen separates its caption/open action by space, without an additional rule. Both locales refresh Vet cover, draft, saved, trace and narrow invoice, plus the complete Pawly report.

Captures come from the corrected product DOM. Selected Vet panels are cloned in source order; only the header's outer capture padding is removed to align the selected panels. No source borders, controls or words are overridden for screenshots. The Pawly capture mounts the source screen through its existing harness and gives it natural document height. Its real receipt action and full disclaimer remain visible.

Validation: both source builds and portfolio build passed. Prototype checks passed locally and in production: 36 route/locale/width combinations each, at 360/390/768/820/1024/1440. Portfolio geometry passed 84 combinations in Chromium and 28 in WebKit, across Home, About and five cases, EN/RU. Harmony passed all 84 combinations and the scoped CSS audit found no dead rules. Mobile Vet and Pawly cover captures were visually reviewed.

Production prototypes were confirmed READY on their public aliases with the source commits above. The portfolio production commit is recorded in Git history; release verification uses the public alias and the same geometry script.

Reproduce captures: `node scripts/refresh-clean-ui-frames.mjs` with source previews on 5261/5173. Reproduce source production checks: `node scripts/verify-prototype-ui.mjs https://veterinary-clinic-gules.vercel.app https://pawly-fawn.vercel.app`. Capture hashes and viewport sizes are recorded alongside this report in `ui-cleanup-captures.json`.
