# Residual issues after release preflight (none blocks release)

| ID | Pri | Area | Issue | Evidence | Suggested action |
|---|---|---|---|---|---|
| S1 | P2 | Security / toolchain | 15 npm advisories (1 critical, 10 high) in build/dev toolchain; not exploitable in static deployment | [SECURITY-TRIAGE.md](SECURITY-TRIAGE.md) | Separate PR: non-major `npm audit fix` + full rebuild/QA; then planned Astro major upgrade. Re-assess before any SSR/adapter/image optimization |
| G1 | P2 | Process | `main` has no branch protection; merge gate is procedural only | GitHub API "Branch not protected" | Owner decides on requiring PR + Vercel status check |
| P1 | P3 | Performance | Simulated mobile Lighthouse LCP for Home slightly above 2.5 s; LCP element is the hero paragraph revealed by approved entrance motion | [PERFORMANCE.md](PERFORMANCE.md) | Review after collecting field CWV (Vercel Speed Insights / CrUX); do not change approved hero for a lab score |
| SEO1 | P3 | SEO | 142 of 146 embedded Learn prototype pages under `/prototypes/learn*` have no `noindex` and are not disallowed in robots.txt. Pre-existing on `main` | [logs/seo-dist.json](logs/seo-dist.json) | Decide whether demos should be indexable; if not, `Disallow: /prototypes/` or meta noindex in the sync script |
| SEO2 | P3 | SEO | `/preview/` and `/kit` are both robots-disallowed and `noindex`; disallow prevents crawlers from reading the noindex if already linked externally | robots.txt | Optional: keep noindex, drop Disallow |
| R1 | P3 | Repository | Release adds ~1.65 GB of audit evidence to git history (largest file 5.5 MB) | [logs/added-sizes.txt](logs/added-sizes.txt) | Future evidence: keep binaries out of git (artifact storage / LFS), reference by hash |
| M1 | P3 | Assets | 12 newly added `public/media` files are shipped but unreferenced (accepted alternates) | [logs/unreferenced-media.txt](logs/unreferenced-media.txt) | Owner confirms they are unused, then remove in a cleanup PR |
| A1 | P3 | Accessibility | Automated axe only; no manual screen-reader session (NVDA/VoiceOver), no physical iOS/Android, no toolbar 200% zoom | REPORT §B | Manual AT pass on Home + one case per locale |
| A2 | P3 | Accessibility / test coverage | WebKit: opening a dialog during an active native view transition not covered (Windows WebKit stalls) | V1.1 `logs/states-webkit-active-snapshot-dialog.log` | Verify on real Safari |
| W1 | P3 | Runtime (WebKit) | Focusing/hovering a MediaZoom link triggers Astro `prefetchAll`; WebKit lacks `<link rel=prefetch>`, so Astro falls back to `fetch()` without `catch`. If the page navigates while that full-size image is in flight, WebKit logs "Load failed … access control checks" as an unhandled rejection. Console-only, intermittent (1 of 3 smoke runs), pre-existing on `main` | logs/qa/qa-smoke-webkit.log vs r2/r3 | `data-astro-prefetch="false"` on zoom triggers (also avoids prefetching 2848-px images on hover) — product change for a later PR |
| W2 | P3 | Test stability (WebKit) | One transition sample (EN 1440 Agent→Portal) got 1 rAF sample with a 2.4 s finish on Windows WebKit; not reproduced in 2 reruns (316/316 each) | logs/qa/qa-transitions-webkit*.log | Treat as harness timing sensitivity; recheck on real Safari |
| B1 | P3 | Browsers | Firefox not installed; not verified | — | Run smoke on Firefox before or after release |
| C1 | info | Content | LinkedIn returns HTTP 999 to automation | `logs/` destinations | Owner opens the link manually once |
| H1 | info | Docs | Historical plans (`PLAN-CHATS.md`, `PLAYBOOK-site-portfolio.md`) describe superseded states | — | No action for release; do not implement their TODOs from this audit |
| T1 | info | Tooling | QA harness `shot()` does not create its output folder; fresh `QA_ROOT` fails captures until folders exist | this run's first matrix pass | Add `mkdir` in `common.mjs` next time the harness is touched |
| T2 | info | Tooling | 163 existing Astro hints | logs/check.log | Housekeeping |
