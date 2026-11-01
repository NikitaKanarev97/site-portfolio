# Independent visual and narrative audit · 2026-11-01

## Reviewed evidence
- Source: src/pages/index.astro, src/components/FeaturedCase.astro, src/pages/work/[slug].astro, src/copy/cases/index.ts, agent-ops-v2.ts, partner-portal-v2.ts, Learn presentation capture, existing case data.
- 1440x900 and 390x844 EN/RU homepage viewport images: audit/agent-ops-v2/after. B2B homepage + case hero: audit/b2b-case-v21/after. Learn cover/section: audit/trassir-learn-case-v2/refresh-2026-10-31/portfolio.
- Earlier Vet/Pawly screenshots: audit/case-presentation (September): historical baseline only, **not** a representation of 1 November product redesigns.
- Observed comparison imagery: research/portfolio-benchmark/case-blueprint/img (Dounar, HA, Garri, Tubik, etc). The original detailed case research and screenshots predate this run.
- Live production was NOT captured. Accept only provisional judgments until fresh matching BEFORE evidence is supplied.

## Verdict
**PROMISING FOUNDATION — PREMIUM V3 REVISION REQUIRED for the portfolio shell.** Not a condemnation of the recently accepted individual case components. The 1440 homepage is clean and strong typographically, and substantive case scenes use authentic UI. Still, the first viewport does not show a decisive project visual, and across some case images product controls shrink below useful reading size. Need stronger art direction within the existing visual language, not more filler, arbitrary 3D or longer copy.

## Source-grounded findings

### P0 · Home: first-impression proof arrives too late
Image: baseline/agent-ops/en-1440-home-viewport.webp; mobile counterpart. Desktop first viewport is largely the two-line black/red slogan, identity, professional photo, compact project-name index and B2B positioning. At 390 it is even more text-led: heading, portrait/name links, explanatory copy, authorization, CV. In neither captured first viewport does the viewer see an actual case image.
**Risk:** beautiful editorial CV, not immediately an unusually strong product-design portfolio; delayed proof. Benchmark against Garri's near-immediate product scene, Anton Blinkov's result-led first impression and Victor's work index.
**Direction:** place a visually convincing first-work teaser/crop or unmistakable project proof near the fold without removing name/role/contact and without introducing a noisy animated showreel. Explore 1–2 implementations in the same grid; test at 1440x900 and 390x844, both locales. Do not arbitrarily reduce hero type to squeeze everything. Preserve clear hierarchy.

### P0 · Case media scale and narrative density
Image: baseline/b2b/en-1440-hero.png and baseline/learn/en-1440-learn-cover.png. B2B hero is professionally structured with a real procurement UI and a human-decision conflict, but key labels/controls on the large capture are very small when viewed at the normal page width. Learn's 'two ways to learn' hero is conceptually excellent, but the main image is a very busy UI within an outer field; the right supporting cards introduce a large blank area beneath the left stage at some scroll positions. On mobile native crops are markedly better than simple downscaling; preserve that practice.
**Direction:** one readable, intentional hero detail per major scene, backed by full-original zoom; define objective visual scale checks for important labels and avoid layering an extra mockup border on native browser/app chrome. Use Garri's scene-first presentation, HA's generous artifact fields, and Dounar's measured metadata.

### P0 · Truthful storytelling and editorial hierarchy
B2B currently has a concrete 41/48 synthetic example; this is task state, **not a measured business outcome**. Agent Ops correctly distinguishes historical vendor figures from prototype evidence, and identifies its user-tested/client-accepted state. Maintain this distinction. Across five cases, a 15–30-second recruiter read should answer product, user, problem, role, one major decision and deliverable/status. Avoid 'what I did' as generic portfolio boilerplate.
**Direction:** retain thesis-led sections; lead each section with one concrete design decision and one evidence image, not duplicated paragraphs/cropped screenshots. Use Dounar's compact fact row and impact framing only where verified facts exist.

### P1 · Case differentiation within one family
Current routing deliberately uses special cases for Agent Ops, Partner Portal and Learn, and shared CaseStory for Vet/Pawly. That is useful. Risk: five consecutive neutral blocks with giant headers can still feel repetitive on the home page if each preview follows the same framing and crop. Maintain shared type, rhythm, mobile behavior and navigation while designing one distinct proof composition per case.
**Direction:** cases can vary by proof: Agent Ops = human financial checkpoint; B2B = compare-and-confirm on an imported row; Learn = reference vs assessment; Vet = decision-support safety/clinical trace; Pawly = trust and walker/owner handoff. Do not fill space with abstract ornaments.

### P1 · Vet and Pawly media freshness
The historical repository captures from audit/case-presentation show 2026-09 snapshots, not proof of the recent premium product redesigns. Before updating the portfolio case presentation, confirm which current product screens are accepted, commit/SHA and image state in veterinary-clinic/pawly, then replace outdated media and readjust the narrative to match facts. Do not silently present an old UI as the new one.

### P1 · Evidence/credibility and conversion
Keep explicit 'sole product designer', scope, phase, date and concept vs shipped vs prototype language. Preserve fast CV / copy email and case navigation, EN/RU parity, working original-size image view, source/claim notes. Audit contact availability/location wording against the user's actual current public claims rather than inferring from screenshots.

### P2 · Motion and polish
Use one characteristic, restrained motion gesture (hero text/reveal, case preview handoff or image reveal) that improves reading order. Do NOT adopt HA's entire AJAX/carousel and scroll-gated navigation; this risks accessibility and obscures content. Protect reduced-motion, focus, keyboard navigation, performance and image LCP.

## Acceptance rubric (must be verified, not self-scored by implementer)
| Area | Requirement | Evidence |
|---|---|---|
| First 5 seconds | Immediately understandable specialization AND a strong product artifact | 1440x900 + 390x844 EN/RU captured first fold |
| Selected work | Each of five cases clearly distinguished; preview meaningful at normal viewport scale | 5 matched preview images, density/crop notes |
| Case overview | Product, user, problem, role, status, critical decision visible early | per-case screenshots + word scan |
| Section craft | Every major section meets at least one inspected visual benchmark by readability, whitespace, typography and intentional media | reference-to-section table with image pairs |
| Truth | No fictitious outcomes; fixture metrics distinguishable from commercial metrics | fact-check report and code review |
| Access | headings, zoom, dialogs, CTA, EN/RU, mobile, keyboard, reduced motion | browser assertions and captures |
| Non-regression | Current approved case scenes, functionality and mobile-native screenshots remain intact | exact before/after checks |

## Deferrals
- No site-wide redesign, unrelated SaaS product work, logo redesign, bespoke 3D movie or decorative 'AI premium' gradients as an audit deliverable.
- Do not merge/deploy/edit Figma or label this Accepted before independent review.
- Live screen snapshot still required: public kanarev.com/current production could differ from repository's recent audit captures.
