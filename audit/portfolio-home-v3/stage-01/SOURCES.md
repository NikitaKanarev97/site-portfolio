# Source imagery and claims

No new product screenshots, composites, UI redraws, image-generation output,
retouching or competitor assets were added to public media. All displayed product
images are reused from the pinned source base. `public/` and the three product
media manifests have no diff. [Selected image paths, SHA-256, bytes and alt text](logs/home-image-sources.json)
record every selected desktop/mobile Home source. [Evidence image hashes](logs/image-hashes.json)
cover the actual browser screenshots and reference pairs.

| Project | Actual source and provenance | State / limitations |
| --- | --- | --- |
| Agent Ops | `src/data/agent-ops-v2-media.json`; `audit/agent-ops-v2/capture-manifest.json`; product source `030e5af7416ad52bd753271ad7147202b55cd41a`, accepted code `6cecdb73b3fc23f0465bf7bf6a84598f1a63733d` | Same `approval-consequences-{desktop,mobile}` in EN/RU; reviewer role, seeded synthetic account, frozen fixture clock. Full invoice-credit/customer-message consequence. Existing capture-only RU completion is documented by the source manifest, not newly performed here |
| Partner Portal | `src/data/partner-portal-v2-media.json`; `audit/b2b-case-v2/captures/manifest.json`; source `6bbe1cd71a656414efcc90a98c61d1012c55be92` | Same `decision-1280` desktop and `workspace-top-390` mobile; row 19 alternatives and buyer choice. 1280/390 source viewports, DPR 2; no newly submitted product choice. 41/48 is fixture progress |
| TRASSIR Learn | `src/data/learn-v2-media.json`; `audit/trassir-learn-case-v2/refresh-2026-10-31/capture-manifest.json`; source `e9ac4b075c4c5251dc10891ad201ecbf5405b727` | Same `home-wide` / `home-mobile` EN/RU; task-led entry, anonymous/reference context. Existing DPR-2 semantic capture/canvas fields retained. Two path statements reuse `makeLearnCase(locale).paths` |
| Vet Clinic | Existing `VetStage.astro`, `case-art` and accepted base media mapping | No replacement. Candidate `5ae80f...` in the research pack is pending acceptance and is not represented as accepted/current |
| Pawly | Existing fifth-card story, WorkStage, photo/report media | Completely frozen: no media, crop, text, alt, CTA or route edits. See regression report |

Author thumbnail reuses `portrait-natural-v2-mobile.webp` unchanged, with a compact
responsive layout/crop. Webflow thumbnails remain the same four project previews;
their existing dialog role/stack descriptions are retained.

Facts: all works remain the owner's authored projects, with no public Concept/
pet-project status labels. No customer, launch, interview, metric, availability,
visa detail or commercial outcome was invented. Agent remains a user-tested,
client-accepted prototype; its financial UI figures are synthetic. Existing EN/RU
geography asymmetry is intentional and unchanged.

References: saved October captures under
`research/portfolio-premium-v3-2026-11-01/references/`, with original blob provenance
in that pack's `SCREENSHOT_MANIFEST.md`. Images used in comparisons remain inside
the audit/research tree and are not copied into portfolio content. Historical
reference screenshots are not called fresh captures or proof of current animation.
