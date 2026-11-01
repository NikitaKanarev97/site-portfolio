# Agent Ops Home Cover V1 — Reference Pack / 2026-11-02

## Scope and baseline
- Target: **homepage featured case cover only** for Agent Ops Console, not the product, the case page, other covers, or the accepted V3.1 hero.
- Research base: portfolio `main` `561e6830392b6e9a25e61e30cafe394586df3ff4`.
- Accepted home/hero comparison state: `review/homepage-premium-v3.1-accepted-2026-11-01` (`5572d96114125e287f34d407db5a934492e353cf`).
- Main source: `src/components/agent/AgentHome.astro`, `AgentShot.astro`, `src/copy/cases/agent-ops-v2.ts`, RU counterpart, `src/data/agent-ops-v2-media.json`, `src/components/FeaturedCase.astro`.
- **Do not touch** prototype repo, case page, already accepted Vet/B2B cover branches. Portfolio main is NOT assumed to contain every accepted unmerged cover.

## Inspected real BEFORE shots (portfolio, accepted home V3.1)
- [EN desktop 1440](https://github.com/NikitaKanarev97/site-portfolio/blob/review/homepage-premium-v3.1-accepted-2026-11-01/audit/portfolio-home-v3/stage-01/v3.1/screenshots/after/en-1440-work-agent-ops-console.png)
- [EN mobile 390](https://github.com/NikitaKanarev97/site-portfolio/blob/review/homepage-premium-v3.1-accepted-2026-11-01/audit/portfolio-home-v3/stage-01/v3.1/screenshots/after/en-390-work-agent-ops-console.png)
- [RU mobile 390](https://github.com/NikitaKanarev97/site-portfolio/blob/review/homepage-premium-v3.1-accepted-2026-11-01/audit/portfolio-home-v3/stage-01/v3.1/screenshots/after/ru-390-work-agent-ops-console.png)
- [RU desktop 1440](https://github.com/NikitaKanarev97/site-portfolio/blob/review/homepage-premium-v3.1-accepted-2026-11-01/audit/portfolio-home-v3/stage-01/v3.1/screenshots/after/ru-1440-work-agent-ops-console.png)

### Observations, not aesthetic guesses
- Desktop: clear editorial split, white/light stage with isolated dark **consequences-only** image; title + body are legible. But the screenshot omits the selected approval's reason, policy and actual human action; to an unfamiliar recruiter it can resemble two generic account/email cards.
- Mobile: a tall dark, text-heavy image appears before the meaning-making story and pushes the explanation and CTA far down. The full case heading / summary below repeats part of the editorial headline. It is not unusable, but its first-contact story could be clearer.
- Strengths to preserve: real product material, strong contrast, sober Soft Carbon identity, clear $120/customer promise and English/Russian parity. This is an upgrade target, not permission to rebuild the component family.

## Real in-repository source screen evidence (inspected visually)
All from the accepted product footage/images already integrated into site-portfolio. Synthetic fixture data; NDA disclosure in case copy.

| ID | Actual screenshot | What it proves / layout use | What not to do |
| --- | --- | --- | --- |
| S1 | [Action Approvals full desktop](https://github.com/NikitaKanarev97/site-portfolio/blob/561e6830392b6e9a25e61e30cafe394586df3ff4/public/media/rebuild/agent-ops/v2/en/action-approvals-desktop.webp) | Queue + selected Ferrum Logistics $120 task + policy/billing/history + consequences + approve/reject. Real full screen context. | Do not shrink the entire dense screen until text is unreadable. |
| S2 | [Approval task desktop](https://github.com/NikitaKanarev97/site-portfolio/blob/561e6830392b6e9a25e61e30cafe394586df3ff4/public/media/rebuild/agent-ops/v2/en/approval-task-desktop.webp) | Strongest single contiguous scene: Ferrum Logistics, $120 human approval, why the agent asks, policy and customer consequence together. Preferred candidate subject. | Do not fabricate a new panel combining fields without provenance. |
| S3 | [Approval task mobile](https://github.com/NikitaKanarev97/site-portfolio/blob/561e6830392b6e9a25e61e30cafe394586df3ff4/public/media/rebuild/agent-ops/v2/en/approval-task-mobile.webp) | Native mobile state / reading order for the decision; suitable for a selectively framed excerpt. | Do not show the whole extremely tall asset at thumbnail scale. |
| S4 | [Consequences desktop](https://github.com/NikitaKanarev97/site-portfolio/blob/561e6830392b6e9a25e61e30cafe394586df3ff4/public/media/rebuild/agent-ops/v2/en/approval-consequences-desktop.webp) + [mobile](https://github.com/NikitaKanarev97/site-portfolio/blob/561e6830392b6e9a25e61e30cafe394586df3ff4/public/media/rebuild/agent-ops/v2/en/approval-consequences-mobile.webp) | Current exact visible screen; preserves invoice credit vs customer message relationship. | Avoid presenting only consequences when claim is human oversight if better single-frame alternative exists. |
| S5 | [Review Queue desktop](https://github.com/NikitaKanarev97/site-portfolio/blob/561e6830392b6e9a25e61e30cafe394586df3ff4/public/media/rebuild/agent-ops/v2/en/review-queue-desktop.webp) | Demonstrates risk severity and substantial B2B system scale / dense table. Reserve for alternative if task screen fails to convey enterprise depth. | Do not mix different fictitious cases into one fake workflow. |

Check existing RU equivalents under `public/media/rebuild/agent-ops/v2/ru/` before using any new crop.

## External screenshot benchmark (actual image opened, not only text search)
These benchmarks are about information hierarchy, not copying styles, UI, business flows, or data.

| ID | Real source and exact screenshot | Useful pattern | UX question solved | Inappropriate / adaptation |
| --- | --- | --- | --- | --- |
| R1 | [LangSmith · Trace view / Debugging Deep Agents (actual screen)](https://www.blog.langchain.com/content/images/2025/12/Screenshot-2025-12-09-at-7.29.41---PM.png) · [source article](https://www.blog.langchain.com/debugging-deep-agents-with-langsmith/) | Dark operational shell; one highlighted run, evidence details adjacent; context + action, not just decorative cards. | Does the first screenshot identify what is being inspected/decided? | This is trace debugging, not billing approvals; don't transplant a waterfall chart or invent tracing features. |
| R2 | [Langfuse · LLM Metrics & Analytics screenshot](https://langfuse.com/images/docs/llm-analytics.png) · [official page](https://langfuse.com/docs/metrics/overview) | Calm aggregation, large primary values, restrained labels and supporting details. | What remains visually legible at card scale? | Do not turn this story into generic KPI cards or claim unimplemented analytics. |
| R3 | [SCRN · OKX Referral Dashboard mobile screen](https://scrn.gallery/app/okx?screen=6abf9673ad12d015b1eededb) · [flow](https://scrn.gallery/app/okx?tab=flows&flow=6abf97acad12d015b1ef1bb3) | Dark mobile UI, clear primary value and strong spacing hierarchy across data cards. | Can the mobile cover communicate one number/action at a glance? | Financial referral product; unrelated flow, branding and metric vocabulary must not be copied. |
| R4 | [SCRN · T-Bank Analytics mobile screen](https://scrn.gallery/app/t-bank?screen=6acbc545d25ce79f7e713bc9) · [flow](https://scrn.gallery/app/t-bank?tab=flows&flow=6acbc5833a9c5127559195a3) | Short card summaries before deeper details; readable hierarchy on phone. | Is the portfolio's mobile crop an understandable summary rather than a miniaturized dashboard? | Light banking aesthetic not appropriate to Soft Carbon or AI governance. |

SCRN is mostly mobile consumer UI; **R3/R4 are supporting mobile principles only**, not direct visual approval of a desktop B2B cover. R1 + S1/S2/S3 are the stronger semantic comparisons.

## Section / state → reference → intended design
| Element / state | References | Intended adaptation |
| --- | --- | --- |
| Outer featured case (desktop) | BEFORE EN 1440 + S2 + R1 | Retain distinct editorial text/media composition. Make the screenshot show the human checkpoint: amount, reason/policy and consequence in a coherent real source. Avoid generic dashboard wallpaper. |
| Dark media stage (desktop) | S2 + S4 + R1 | Clear first focal point `$120` and agency/approval context. Use authentic contiguous source crop or single screenshot; no fake overlays inside UI. |
| Mobile ordering | BEFORE 390 + S3 + R3/R4 | Early contextual label/short narrative before or beside focused image; avoid image-first 500+px of unlabeled dark cards. Keep whole card understandable with normal scroll. |
| Responsive crop | S2/S3 + R3 | Deliberate independently framed desktop/mobile assets from real accepted product states; preserve readable key text, no truncation of primary value/context. |
| Copy & CTA | Accepted V3.1 + case copy | Avoid stacked duplicate promises, keep one clear preview hook and working case navigation; no copy that implies shipping an autonomous agent, real customer data or live monitoring. |
| EN/RU | Source en/ru equivalents | Match information hierarchy and semantic content; don't force the same text wrap. |
| Visual acceptance | S1/S2/R1/R3 and matching BEFORE/AFTER | Judge side by side at 1440, 390, 360; reject cosmetic-only change if context/readability do not improve. |

## Composition hypothesis (to test rather than blindly implement)
**Editorial / decision-first cover**, not a second Vet-like screenshot poster.
- Desktop stays a 2-column, asymmetrical story/scene composition. The main visual uses authentic *selected approval task* material (prefer S2) rather than only S4; the amount and human approval context should read as one checkpoint.
- Avoid 3 overlapping app windows, glossy 3D, gradients or KPI mosaic. Favor one strong truthful product surface, neutral surrounding stage, case title outside.
- Mobile: shorten the content before the image to label + one clear sentence; show a deliberately chosen focal crop from S3 or S4, not an extremely tall full product screenshot. Preserve a reachable case CTA and full product view through case page.
- Minimum proof for change: in a 5-second visual scan, unknown reviewer can answer (a) what this product is (b) what decision is at stake (c) what happens on approval.
- If baseline S4 performs best or new variants degrade legibility/height, do not force redesign: accept baseline or only a small correction with explicit evidence.

## Constraints / evidence
- Product hero images are **real assets from accepted project screenshots**, fixture/synthetic data, not real client screenshots. The case is under NDA.
- No claim of revenue saved, actual live deployments, automated policy outcomes or unverified metrics.
- Test desktop 1440, tablet 768/1024 when useful, mobile 390/360, EN/RU and keyboard/navigation/focus.
- Browser captures: card + full homepage, first viewport, exact BEFORE/AFTER. Compare to this actual reference pack section by section in `BENCHMARK.md`.
- Independent reviewer decides ACCEPTED / ACCEPTED WITH BACKLOG / REVISION REQUIRED. No merge, deploy or product/Figma changes.
