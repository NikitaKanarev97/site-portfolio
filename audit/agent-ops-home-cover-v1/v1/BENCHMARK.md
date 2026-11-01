# Agent Home V1 — verified benchmark

02.11.2026 · implementation recommendation, **independent acceptance pending**.

Raw sources are linked in [RESEARCH.md](../references/RESEARCH.md). [Gallery](index.html) exposes the matched browser captures and labeled side-by-side boards. Source images in `../references/` are archived reference material, never public portfolio media. [Provenance and hashes](logs/reference-provenance.json).

## Actual product screens — P0

| Reference | Relevant pattern and UX problem | Adapted in V1 | Explicitly not copied / remaining deviation |
| --- | --- | --- | --- |
| [S1 Action Approvals desktop](../../../public/media/rebuild/agent-ops/v2/en/action-approvals-desktop.webp) | Selected approval stays attached to queue, policy, billing, consequences and actions. Answers what is awaiting a person's decision. | Specific customer/credit story; a financial approval is the unit of oversight. | No miniature whole desktop, sidebar, queue totals or fabricated live counters. Cover loses the wider operational shell. |
| [S2 Approval Task desktop](../../../public/media/rebuild/agent-ops/v2/en/approval-task-desktop.webp) | Amount, request reason, policy and consequences lead to a clear human action in one genuine state. | Candidate A used this entire source. B's editorial copy preserves late delivery, limit and confirmation. | No panel stitching or relocated controls. Final B omits the policy field and approval controls; this is the main semantic shortfall. |
| [S3 Approval Task mobile](../../../public/media/rebuild/agent-ops/v2/en/approval-task-mobile.webp) | Native stacked sequence preserves the decision's facts at phone width. | Independently selected mobile source rather than a squeezed desktop; story precedes evidence. | Full task would create a 1443–1501px cover at 390px. No truncation of it is passed off as a complete decision. |
| [S4 Consequences desktop](../../../public/media/rebuild/agent-ops/v2/en/approval-consequences-desktop.webp) / [mobile](../../../public/media/rebuild/agent-ops/v2/en/approval-consequences-mobile.webp) | Invoice credit and exact customer-visible message stay together; before/after commitment is explicit. Prevents treating a credit as a cash refund or an already-sent email. | Final B uses these exact complete images, localized in EN/RU. Every internal source element is preserved. One proportional image, normal local radius, no new UI. | No repainting, new data, floating cards, shadow effects, or preview masquerading as completed approval. The fixture countdown from S2 is absent. |
| [S5 Review Queue desktop](../../../public/media/rebuild/agent-ops/v2/en/review-queue-desktop.webp) | Hierarchy separates cause clusters, individual runs and exposed commitments. Establishes B2B depth and prioritization. | Analytical restraint and a concrete decision boundary. | No unrelated exposure totals, synthetic KPI result claims or table decoration. Does not claim to show queue breadth. |

RU equivalents under `public/media/rebuild/agent-ops/v2/ru/` use the same source keys and are included in the source comparison boards. [EN desktop sources](comparisons/en-1440-source.jpg), [RU desktop](comparisons/ru-1440-source.jpg), [EN mobile](comparisons/en-390-source.jpg), [RU mobile](comparisons/ru-390-source.jpg).

## External benchmarks — P1 / P2

| Verified source | Pattern / UX problem | Adaptation | Exclusions / deviation |
| --- | --- | --- | --- |
| [R1 LangSmith Trace View, original article](https://www.langchain.com/blog/debugging-deep-agents-with-langsmith) · [inspected migrated PNG](../references/langsmith-migrated.png) | Selected trace has an unmistakable identity; evidence stays beside the investigated run. Dark surfaces have clear hierarchy. Prevents generic dashboard wallpaper. | One authentic operational scene, a specific $120 subject, restrained dark surfaces. | No trace tree, Polly overlay, debug controls or unrelated AI features. Final B has less on-screen decision context than LangSmith and S2. The old supplied URL failed; the current article resolves the same screenshot filename to its migrated CDN image. |
| [R2 Langfuse exact analytics PNG](https://langfuse.com/images/docs/llm-analytics.png) · [inspected copy](../references/langfuse.png) | Primary numbers remain distinct from labels and detailed rows. Helps the reader find the key fact before exploring density. | Native $120 focal point and quiet labels, consistent spacing. | No transplanted charts, model-cost stats, KPI mosaic or claimed post-launch results. Final is a decision preview; it does not match the breadth of a metrics workspace. |
| [R3 OKX, exact SCRN screen](https://scrn.gallery/app/okx?screen=6abf9673ad12d015b1eededb) · [inspected original](../references/scrn-okx.jpg) | Strong mobile title, short value summaries and discrete dark groups. A phone reader finds the number without understanding the full app. | Context before image, obvious $120, complete native mobile cards. | No referral identity, earnings, buttons, branding or consumer financial language. Source UI is still smaller than native OKX text on 360px. |
| [R4 T-Bank, exact SCRN screen](https://scrn.gallery/app/t-bank?screen=6acbc545d25ce79f7e713bc9) · [inspected original](../references/scrn-tbank.jpg) | Short explanatory summaries precede deeper data. Helps a mobile user understand what the values mean. | Concise decision explanation first, detail second; no repeated generic promise after image. | No banking palette, illustrations, decorative charts or card cloning. Agent's domain detail remains denser. |

Both SCRN IDs were directly opened with `get_screens(format=image)`; their original CDN images were subsequently archived. Metadata-only inspection was not used to infer their content. [Desktop side-by-side](comparisons/desktop-benchmarks.jpg), [mobile side-by-side](comparisons/mobile-benchmarks.jpg).

## Composition-by-composition assessment

| Element | Evidence and result | Benchmark assessment |
| --- | --- | --- |
| Outer title and rail | Existing heading/outcome rail unchanged on desktop; case title remains outside the stage on mobile. | Matches accepted Home typography; avoids making a native product screen a substitute for the case title. |
| Editorial subject | Named $120 credit, late delivery, agent boundary and human confirmation. Synthetic-data label in both locales. | More concrete than BEFORE. Provides the missing subject through editorial context, while S2 still proves it more directly inside the UI. |
| Native product visual | Exact complete S4, full dark canvas restored, no artificial composite. | Equals accepted source material; no claim to exceed its UI craft. |
| Scale and spacing | At 390 image width 310→342px; at 360, 280→312px. Desktop remains 806px. At 768, field changes reduce image 640→624px. | Better mobile prominence; tablet accepts a small image-scale reduction for uniform fields. Fine UI text remains a limitation. |
| Desktop balance | 2:5 split, one dark contiguous scene, existing semantic fields. Final cover +16px tall. | Restrained and consistent; less context-rich than LangSmith. |
| Mobile sequence | Title → short specific context → native scene → proof/CTA. EN 390 height −122px; RU −93px. | Adapts R3/R4's summary-first principle. Source amount is clear; supporting UI is denser and smaller than the consumer benchmarks. |
| Radius | Actual image anchor clips only outer background to existing radius-media, 16px, at all widths. | Owner correction included; inner product corners remain original. |
| Adjacent rhythm | Full BEFORE/AFTER Home PNGs show Portal, Learn, Vet and Pawly. Their DOM hashes match in all ten states. | Distinct Agent dark scene, B2B light choice, Vet clinical record preserved; no identical cover-template rollout. |
| Interaction | Existing title/image/CTA all lead to the localized case. Visible keyboard focus, real Enter and Back verified. | Clear portfolio navigation; screenshot approval buttons are not live controls. |

## Independent decision boundary

V1 improves the baseline's narrative, mobile width and vertical economy while retaining accepted product material. It **falls short of complete benchmark parity** in on-image policy/action context and native-size mobile secondary text. A stronger full-context direction exists in A, but its measured scrolling cost makes it a weaker Home cover in this iteration. ChatGPT should review the raw screenshots and choose the acceptance status; this document does not approve the implementation.
