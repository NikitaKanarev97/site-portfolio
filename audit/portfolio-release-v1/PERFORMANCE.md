# Performance · candidate `e434919b` (laboratory only)

All numbers are **local laboratory** measurements of the production build served by
`astro preview` on Windows. No field data (CrUX / RUM) exists for this candidate, so
**no field Core Web Vitals and no INP are reported**. Nothing here claims an improvement:
the application code is the code V1.1 measured.

## Lighthouse 12.8.2 — default mobile simulation (4× CPU, 150 ms RTT, ~1.6 Mbps), 3 runs each

| Route | Perf | A11y | BP | SEO | LCP (s) | FCP (s) | CLS | TBT |
|---|---:|---:|---:|---:|---|---|---:|---:|
| Home EN mobile | 95 / 95 / 95 | 100 | 100 | 100 | 2.596 / 2.589 / 2.593 | 1.657–1.659 | 0.079 | 0 ms |
| Home RU mobile | 94 / 94 / 94 | 100 | 100 | 100 | 2.664 / 2.665 / 2.668 | 1.657–1.659 | 0.079 | 0 ms |
| Home EN desktop | 100 | 100 | 100 | 100 | 0.574 | 0.407 | 0.005 | 0 ms |

Raw summary: [logs/lighthouse-summary.json](logs/lighthouse-summary.json); command:
[logs/qa/lighthouse.sh](logs/qa/lighthouse.sh).

**Is the earlier result reproducible? Yes.** V1 reported 2.545 s (EN) / 2.661 s (RU);
this run gives 2.59 s / 2.67 s with run-to-run spread under 10 ms. EN is ~50 ms higher than
V1's single sample — within environment variance, not attributable to a code change.

**Why it is above 2.5 s:** the LCP element is the hero paragraph
`p.hero__spec[data-motion="fade"]`. Lighthouse phases: TTFB ≈ 0.45 s, load delay 0,
load time 0, **render delay ≈ 2.14 s (EN) / 2.21 s (RU)**. It is text, so it is gated by the
approved staged entrance (fade-in after the headline reveal), not by network or bytes.
Changing it means changing accepted motion; per the brief this is not done for a lab score.

## Applied CDP throttling (existing `performance.mjs`) — 390×844, 4× CPU, 150 ms, 1.6 Mbps, cold

| Route | LCP | CLS | Entry long tasks / total | Max scripted event | rAF p95 | Frames > 50 ms |
|---|---:|---:|---|---:|---:|---:|
| Home EN | 2216 ms | 0.077 | 4 / 678 ms | no qualifying event | 16.6 ms | 6 / 385 |
| Agent Ops EN | 1324 ms | 0 | 4 / 1127 ms | 192 ms | 16.7 ms | 6 / 397 |
| Learn EN | 1104 ms | 0 | 4 / 840 ms | 136 ms | 16.7 ms | 4 / 391 |
| Pawly EN | 1644 ms | 0.077 | 4 / 738 ms | 112 ms | 16.7 ms | 5 / 452 |

Data: [logs/qa/performance.json](logs/qa/performance.json). Single cold sample per route.
"Max scripted event" is Event Timing during a scripted scroll/zoom session — **not INP**.
Agent's 192 ms (V1: 88 ms) is one sample under 4× CPU while other suites had just finished;
no code changed, so treat it as variance to recheck, not a regression claim.

## Distinctions

- **Laboratory LCP**: above. **Field CWV**: not available — enable Vercel Speed Insights or
  wait for CrUX after release to obtain them.
- **CLS**: 0.077–0.079 on Home/Pawly (< 0.1 "good" threshold in lab); 0 on Agent/Learn.
- **TBT**: 0 ms in all Lighthouse runs.
- **INP**: no field data exists; none claimed.
- **Motion smoothness**: rAF p95 ≈ 16.7 ms (60 Hz frame) with 4–6 frames > 50 ms during
  entry under 4× CPU. Not a guarantee for physical low-end phones.
- JS weight: [logs/qa/javascript-weight.json](logs/qa/javascript-weight.json).

**Release impact:** none blocking. Home mobile lab LCP ~0.1–0.17 s above 2.5 s, caused by
approved entrance timing; recorded as BACKLOG P1 with a field-data-first recommendation.
