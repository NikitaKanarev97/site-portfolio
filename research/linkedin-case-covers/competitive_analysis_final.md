# Competitive analysis — LinkedIn case-cover direction

## Executive summary

The market splits between product-proof covers and promotional concept art. The highest immediate visual impact often comes from devices, perspective stacks and glossy 3D stages, but those devices make the UI smaller and distort the geometry a design lead wants to inspect. Text-first editorial covers communicate confidence and context, yet frequently fail to prove interface craft. The strongest transferable pattern is one dominant artifact with a short, highly legible message. Almost no competitor uses the cover to state role, validation level or outcome, even though these are decisive in hiring. Our system should therefore combine a real front-facing screen with editorial hierarchy and a case-specific background. Krea should create only the environment; the UI and text remain exact local assets.

## Decision

Each cover will contain:

1. Project name.
2. One-line problem or product definition.
3. Role/scope in compact metadata.
4. One evidence line that distinguishes shipped, accepted, validated or concept work.
5. One real hero screen, proportional and unobstructed.
6. A Krea-generated material backdrop tied to the case, with no fake UI or text.

## Case-specific evidence

| Case | Evidence line |
|---|---|
| Agent Ops Console | Paid client · user-tested · accepted |
| B2B Partner Portal | Commercial redesign · shipped in full |
| Vet Clinic OS | Real clinic · live interviews · two-week prototype |
| Pawly | 17 routed screens · 71 findings resolved · concept |

## Risks

- Generated backgrounds can become generic “future tech”; prompts must specify physical material and prohibit screens, neon, devices and text.
- More than one main screenshot will make dense B2B UI unreadable.
- Perspective or image-to-image generation on the UI will repeat the original geometry problem.
- Evidence labels must remain honest: prototype acceptance is not launch, and synthetic QA is not user validation.

## Sources

- [CareerFoundry — product-design portfolio examples](https://careerfoundry.com/en/blog/product-design/product-design-portfolios/)
- [UXfolio — product-designer portfolio examples](https://blog.uxfol.io/product-designer-portfolio-examples/)
- [UXfolio — UX portfolio examples](https://blog.uxfol.io/ux-portfolio-examples/)
- [Product Design Portfolios collection](https://www.productdesignportfolios.com/)
- Eight Behance references documented in `competitive_analysis.md`.

