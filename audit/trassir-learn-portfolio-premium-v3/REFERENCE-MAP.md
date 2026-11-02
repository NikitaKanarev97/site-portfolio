# Reference pack — TRASSIR Learn V3

All relative paths below resolve to **already committed original image evidence**. No new or synthetic competitor screenshot is claimed; do not copy competitor pixels into the public case. Repository reference images and V2 BEFORE screenshots were **opened and visually inspected** during preparation. These paths are the asset index for Codex and the independent reviewer.

## A. External portfolio imagery already in repo
| ID | Exact opened image | Observed pattern | Use in Learn V3 | Not appropriate |
|---|---|---|---|---|
| R1 | [Garri / editorial thesis](../../research/portfolio-benchmark/case-blueprint/img/gr-thesis.jpg) | Small left chapter name, dominant right-side argument, deliberate typography and broad white space | The opening problem and a two-entrance learning proposition; readable one-screen headline and honest brief | Don't copy long text, people images, Yandex branding or claimed impact |
| R2 | [Kudinov / desktop + mobile](../../research/portfolio-benchmark/case-blueprint/img/ku-pair.jpg) | Product shown in two authentic formats, distinct areas and screen priority | The task-led Learn Home plus a real mobile proof, while keeping text large | Don't copy unrelated black background, prices, sales copy or render fake phone chrome |
| R3 | [HA / branch flow](../../research/portfolio-rebuild-2026-10-03/references/ha-user-flow.png) | Real directional connections, branch decisions, clear node and label hierarchy | Recompose **actual** Learn content model: question vs programme → resource → reading history OR deliberate completion → assessment | Not HA's onboarding/deposit specifics; don't turn the actual product into a banking flow |
| R4 | [HA / sitemap](../../research/portfolio-rebuild-2026-10-03/references/ha-screen-map.png) | Discrete structured nodes and hierarchy, enough white space to scan relationships | Supporting reference for material independence and routes, NOT a giant sitemap dump | No dozens of invented nodes, no microscopic graph |
| R5 | [HA / components](../../research/portfolio-benchmark/case-blueprint/img/ha-components.jpg) | Components/state families grouped in one composed system plate | Present source-backed Learn variants: two progress records and/or status meanings as an edited but genuine specimen selection | Do not reproduce generic token-sheet UI, shrink whole sheet or manufacture controls |
| R6 | [Dounar / outcome](../../research/portfolio-benchmark/case-blueprint/img/dn-impact.jpg) | Short, distinct evidence-backed impact blocks with quiet spacing | V3 ending: system delivered, explicit tradeoffs, verified browser behaviours; no figures without provenance | Dounar's 32K badges and +30% are NOT Learn data |
| R7 | [Kudinov / process transition](../../research/portfolio-benchmark/case-blueprint/img/ku-bag.jpg) | Transition from full product surface to contrasting process artifact | Shift from archive diagnosis to actual Learn information architecture (existing diagram) | Not historical hand sketches, which are unavailable for Learn |

Source context: [portfolio benchmark](../../research/portfolio-benchmark/README.md), [detailed cases](../../research/portfolio-benchmark/references-detailed.md), [HA references provenance](../../research/portfolio-rebuild-2026-10-03/references/README.md). Latest accepted Agent Ops V3 reference comparison lives **on separate branch**: [Agent V3 REFERENCE-MAP](https://github.com/NikitaKanarev97/site-portfolio/blob/redesign/agent-ops-portfolio-premium-v3/audit/agent-ops-portfolio-premium-v3/REFERENCE-MAP.md). It sets evidence and polish standards, **not** Learn's visual narrative.

## B. Real Learn BEFORE images (V2.3)
The source images below were opened as pixels; each represents *the current portfolio page*, not a hypothetical old Learn app design. Product capture provenance: [V2 media review](../trassir-learn-case-v2/refresh-2026-10-31/MEDIA-REVIEW.md), [runtime media map](../../src/data/learn-v2-media.json).

| ID | Actual screenshot | What it proves / issue |
|---|---|---|
| B1 | [EN 1440 hero](../trassir-learn-case-v2/composition-v23/portfolio/en-1440-learn-cover.png) | Actual home and complete answer header; product clear but authorship far down |
| B2 | [EN 390 hero](../trassir-learn-case-v2/composition-v23/portfolio/en-390-learn-cover.png) | Actual mobile home task tiles, missing second proof in first-screen structure |
| B3 | [EN 1440 architecture](../trassir-learn-case-v2/composition-v23/portfolio/en-1440-shared-material.png) | Strong source-backed content, but diagram hidden and **different** resources portrayed as Reference versus Learning |
| B4 | [EN 1440 guided path](../trassir-learn-case-v2/composition-v23/portfolio/en-1440-guided-path.png) | Real programme and completion CTA; two UI surfaces, similar treatment |
| B5 | [EN 1440 My Learning](../trassir-learn-case-v2/composition-v23/portfolio/en-1440-workspace.png) | 9 read/3 of 11 completed vs 3 read/no credit, rendered too small |
| B6 | [EN 1440 assessment](../trassir-learn-case-v2/composition-v23/portfolio/en-1440-assessment.png) | Real 14/20 failure, threshold 16/20, 20/20 pass, source-backed review; stacked equal panels |
| B7 | [EN 390 assessment](../trassir-learn-case-v2/composition-v23/portfolio/en-390-assessment.png) | Accurate real states, but tall repetitive mobile sequence |
| B8 | [Full EN 1440](../trassir-learn-case-v2/composition-v23/portfolio/en-1440-full.png), [Full EN 390](../trassir-learn-case-v2/composition-v23/portfolio/en-390-full.png) | Full-page V2 baseline. Matching RU source counterparts are in the same directory |
| B9 | [Archived catalogue, ORIGINAL](../../public/media/case-learn/before-catalog.webp) | Authentic source platform starting point; archive is RU-only and **not** a controlled comparable performance experiment |

## C. Section → real benchmark → planned proof
| V3 section | External source(s) | Source-backed Learn evidence | Design move |
|---|---|---|---|
| Hero | R1 + R2 | B1/B2 + `en/home-wide`, `en/answer-detail` | One dominant authentic dark-blue task canvas and one related, legible native proof; role/scope visible immediately |
| Original problem | R1 | B9 + B1 | One strong short diagnostic headline, the archive labelled as original; two real job questions rather than generic problem text |
| Architecture | R3 + R4 | `src/data/diagrams/learn/content-model.ts`, B3 | Main connected model visible (not tucked into collapsed details); explicitly separate reading, completion and assessment |
| Answer path | R2 | `en/reference`, `en/home-mobile` | Show how task entry yields standalone versioned answer; use a complete coherent excerpt |
| Guided path | R2 + R7 | B4, `en/path`, `en/completion` | One large programme contract plus one clean action detail, not two equally loud giant screenshots |
| Progress | R5 | B5, `en/learner`, `en/reader` | One large legible real learner state, one smaller truthful no-enrolment counterexample |
| Assessment | R5 + R6 | B6/B7, `en/failed`, `en/review`, `en/passed-score` | Fail → review/source → pass as **example states**, not fabricated journey of one attempt |
| Outcome | R6 | documented code and test results | Ownership, implemented UX logic, testing scope and tradeoff; avoid promotional metrics |

All example paths `en/*` above refer to keys in `src/data/learn-v2-media.json`; use `ru/*` for RU. Existing V2 media are freshly captured from Learn integrated main. **Use these before planning any reshoot**; if new crop, preserve full semantic DOM region and add provenance.

## D. Acceptance comparison
In `REPORT.md`, compare each V3 section against the **specific** R image and the actual B image, with stronger / weaker / justified-different plus an AFTER screenshot at the same scale. A CSS-complete page without that evidence fails visual review.
