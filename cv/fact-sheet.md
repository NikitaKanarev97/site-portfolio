# Nikita Kanarev - CV Fact Sheet

Updated: 2026-08-27

Status legend:

- `VERIFIED` - supported by the user-provided CV, an explicit owner decision in this repository, a published portfolio case source, or a certificate file.
- `NEEDS CONFIRMATION` - missing, internally inconsistent, or supported only by an unverified label.
- `DO NOT CLAIM` - contradicted by the available evidence or explicitly excluded by the portfolio.

## Identity

| Fact | Status | Evidence / permitted wording |
|---|---|---|
| Name: Nikita Kanarev | VERIFIED | Current CV and `src/copy/site.ts`. |
| Professional title: Product Designer | VERIFIED | Current CV and all portfolio case metadata. |
| Current location: Kazakhstan | VERIFIED | Owner decision recorded in `src/copy/site.ts` and `ia/open-questions.md`. |
| Time zone: UTC+5 | VERIFIED | `src/copy/site.ts`; IANA zone `Asia/Almaty`. |
| Open to relocation | VERIFIED | Owner decision in `src/copy/about.ts` and current CV. |
| Visa sponsorship required for relocation | VERIFIED, OMIT FROM MASTER CV | Owner decision in `src/copy/about.ts`. Disclose in application forms or a cover note; do not place it in the general CV because it acts as an early hard filter. |
| Available for international remote work | VERIFIED | `src/copy/about.ts`. |
| Available immediately | VERIFIED AS CURRENT APPLICATION STATUS | Added on 2026-08-27 while no active employment is listed. Reconfirm if availability changes. |
| Email: nikita.kanarev.dev@outlook.com | VERIFIED | Owner-confirmed value in `src/copy/site.ts`; current CV mail link. |
| LinkedIn: linkedin.com/in/nikita-kanarev | VERIFIED | Owner-confirmed value in `src/copy/site.ts`; current CV link annotation. |
| Phone: 8970120621 | NEEDS FORMAT CONFIRMATION; OMIT FROM CV | Supplied by the owner on 2026-08-27 as a Kazakhstan number. It contains 10 digits including the leading `8`, so it cannot be safely normalised to the usual international `+7` format without another digit. Do not publish an unusable contact number. |
| Portfolio URL: kanarev.com/#work | VERIFIED | Custom domain connected by the owner on 2026-08-27 and set as `site` in `astro.config.mjs`. Root, `/#work` and all four case-study routes returned HTTP 200 over HTTPS. Replaces the temporary Vercel URL. |

## Positioning and career narrative

| Fact | Status | Evidence / permitted wording |
|---|---|---|
| 3+ years of product-design experience | VERIFIED | Independent work starts Jan 2023; DSSL runs Sep 2023-Mar 2026. Use `3+ years`, not a higher rounded number. |
| B2B and complex workflows | VERIFIED | DSSL partner portal, Agent Ops Console, and Vet Clinic OS case sources. |
| Nearly three years as the sole designer in a cross-functional team | VERIFIED | DSSL Sep 2023-Mar 2026; current CV and partner-portal case. |
| End-to-end ownership from research through systems, handoff and QA | VERIFIED | Current CV; DSSL and portfolio case process sections. |
| Strong Figma / design-systems practice | VERIFIED | Portfolio cases document Figma systems, semantic tokens, component matrices, and Storybook parity. |
| Technical implementation literacy | VERIFIED | React prototypes, Storybook catalogues, HTML/CSS, repository delivery and QA are evidenced across the portfolio projects. |
| Senior Product Designer | DO NOT CLAIM | The requested positioning is mid-level / Product Designer, and no senior title is documented. |
| Design Engineer as primary identity | DO NOT CLAIM | Technical fluency is a differentiator, not the role. |

Recommended narrative:

> Product Designer with 3+ years of experience designing complex B2B products, including nearly three years as the sole designer in a cross-functional product team, with end-to-end ownership from research and system design through handoff and QA.

## Experience - DSSL

| Fact | Status | Evidence / permitted wording |
|---|---|---|
| Employer: DSSL | VERIFIED | Current CV and partner-portal case. |
| Title: Product Designer | VERIFIED | Current CV and partner-portal case. |
| Dates: Sep 2023-Mar 2026 | VERIFIED | Current CV; explicitly repeated in the partner-portal source. |
| Work mode: Remote | VERIFIED | Current CV. |
| Company scale: 19 offices and 20+ warehouses; partner presence across Russia, the CIS, Europe and Asia | VERIFIED COMPANY CONTEXT | Current official DSSL partner pages and company pages reviewed 2026-08-27. This describes company reach, not portal user count or Nikita's impact. |
| Sole / primary designer | VERIFIED | Current CV and partner-portal case (`Sole designer`). |
| Cross-functional team of 6-10 | VERIFIED | Current CV. Roles named: frontend, backend, product manager, QA, team lead. |
| Worked across three products | VERIFIED | Current CV: B2B partner portal, internal video learning platform, corporate site / product landings. |
| Scope: research, IA, flows, prototyping, design systems, handoff and QA | VERIFIED | Current CV; portfolio case process. |
| B2B partner portal commercial redesign shipped in full | VERIFIED | Portfolio disclosure says the commercial redesign shipped in full, every page. |
| Current portfolio screens are the exact shipped portal | DO NOT CLAIM | Portfolio disclosure says the case is a later rebuild from the original product and research, using synthetic data. |
| Partner portal redesigned around legacy pricing, stock and specification workflows | VERIFIED | Partner-portal case context, reframe and disclosure. |
| Internal learning platform: learner and authoring workflows, course catalogue, lessons, progress, tests, certificates, responsive use | VERIFIED | Current CV. No adoption or learning-outcome metrics are available. |
| Corporate site sections and product launch pages | VERIFIED | Current CV. |
| Business impact metrics | DO NOT CLAIM | Results are under NDA and the portfolio states that no baseline is available. |
| Revenue, conversion, adoption, user growth, percentage improvements or time saved | DO NOT CLAIM | No supporting evidence. |

## Experience - Freelance Product Designer / Self-employed

| Fact | Status | Evidence / permitted wording |
|---|---|---|
| Start date: Jan 2023 | VERIFIED | Current CV; owner chronology records web-design project work from January 2023 to September 2023, before DSSL. |
| Present status | RESOLVED BY SPLIT 2026-08-28 | The scope note is no longer carried by wording inside one row: client work and self-directed work are now two entries (finding `L3-6`). `Product Designer - client work, Jan 2023-Present` holds paid engagements only and says the most recent contract closed in spring 2026; `Selected independent projects, 2026` holds Pawly and the portal reconstruction. **Portfolio concepts must never sit under an employment row again** — that was the defect: `3+ years` could be read as including personal projects. |
| Agent Ops Console - NDA B2B SaaS client project | VERIFIED | Portfolio source and owner decision recorded in `src/copy/home.ts`. Work ended with a tested prototype accepted by the client; implementation was the client's responsibility. |
| Agent Ops Console scale: three roles, 35 scoped artboards, delivery within one month | VERIFIED | Published case source. Use as project-scope evidence; do not convert it into post-launch business impact. |
| Agent Ops Console shipped into production | DO NOT CLAIM | Case disclosure explicitly says the work ended at accepted prototype and claims no shipped result. |
| Vet Clinic OS - real private clinic, NDA, research + design system + working prototype | VERIFIED | Portfolio case. Not taken into production. |
| Vet Clinic OS scale: two weeks, 44-screen sitemap, 13-screen prototype, 31 edge cases | VERIFIED | Published case source. These are design-scope facts, not user or adoption metrics. |
| Vet Clinic OS production SaaS | DO NOT CLAIM | Case disclosure explicitly says it was not taken into production. |
| Pawly - independent product concept with a working prototype | VERIFIED | Portfolio case. No human validation, bookings, users, revenue, conversion or retention data. |
| Pawly production marketplace / live service | DO NOT CLAIM | Case disclosure explicitly calls it a concept, not a live service. |
| RUUN | DO NOT CLAIM in the master CV | The project was removed from the portfolio and has no current case-study proof. |
| Four Webflow marketing sites | VERIFIED | Current repository lists Common, Synk, Scrib3 and Bloomlex. |
| Webflow role: design and build, end to end | VERIFIED | Explicit owner decisions dated 2026-08-25 and 2026-08-27. Use `designed and built`. |
| Webflow production results or conversion metrics | DO NOT CLAIM | No evidence. Keep the work secondary to Product Design. |

## Selected work classification

| Work | Classification | Status / disclosure |
|---|---|---|
| Agent Ops Console | Commercial client work; prototype delivery | VERIFIED. Tested with current/future users and accepted by the client; not shipped by Nikita. |
| B2B Partner Portal at DSSL | Commercial shipped redesign + later portfolio reconstruction | VERIFIED. CV experience may state the commercial redesign shipped; Selected Work must state that the published case revisits the problem. |
| Vet Clinic OS | Client-informed independent prototype under NDA | VERIFIED. Research and working prototype; not production. |
| Pawly | Self-directed product concept | VERIFIED. No human validation or live-service outcomes. |
| RUUN | Removed / insufficient current proof | DO NOT CLAIM in master CV. |

## Education

| Fact | Status | Evidence / permitted wording |
|---|---|---|
| Google UX Design Professional Certificate (v.3), Coursera - issued 15 Dec 2025 | VERIFIED | Local Credly/Coursera certificate PDF; its Credly verification URL returned HTTP 200. |
| Coursera: Accelerate Your Job Search with AI - completed 15 Dec 2025 | VERIFIED, OMIT FROM MASTER CV | The owner-supplied Coursera verification URL is valid, but it verifies this six-hour Google course, not the full UX Professional Certificate. It does not strengthen the master Product Designer resume enough to justify a separate education line. |
| Yandex Practicum - Advanced UX/UI Design - 2024 | VERIFIED as owner-provided | Listed in the user-provided current CV. The exact official English programme title was not independently checked. |
| Pentaschool - professional retraining in Web & Interface Design, 530 hours - 23 Nov 2022 to 15 Jun 2023 | VERIFIED | Diploma and supplement supplied on 2026-08-27. Official programme: `Web Designer. Professional Course: Interface Design, Design and Animation`; qualification: `Graphic Interface Designer`. |
| Russian State Agrarian University-Moscow Timiryazev Agricultural Academy, Moscow - 2020 | VERIFIED | Higher-education diploma supplied on 2026-08-27. |
| Specialist Degree in Veterinary Medicine; qualification Veterinary Doctor | VERIFIED | Diploma states speciality `36.05.01 Veterinary Medicine`, specialist programme, qualification `Veterinary Doctor`, dated 30 Jun 2020. |
| BSc | DO NOT CLAIM | Contradicted by the supplied diploma; replace with Specialist Degree. |

## Skills safe to claim

### Product

- `VERIFIED`: Product design; information architecture; complex B2B workflows; responsive design; design systems; design tokens; component architecture; prototyping; handoff; QA.
- `VERIFIED`: Product framing; requirements and scope; interaction states and edge cases.

### Research

- `VERIFIED`: User interviews; workflow analysis; competitive research; cognitive walkthroughs; usability testing on prototypes.
- `VERIFIED WITH QUALIFIER`: Synthetic agent QA. It tests prototype behaviour, not user demand or adoption.
- `DO NOT CLAIM AS HUMAN RESEARCH`: Simulated interviews in concept work.

### Tools and technical

- `VERIFIED`: Figma; Storybook; React; HTML; CSS; Git/GitHub; Webflow; design tokens; component systems.
- `VERIFIED, USE CAREFULLY`: JavaScript / TypeScript - technical implementation literacy, not frontend-engineer positioning.
- `NEEDS CONFIRMATION`: FigJam as an interview-defensible daily tool; it is requested in the brief but not evidenced in the reviewed sources.
- `VERIFIED, PHRASE AS FUNDAMENTALS`: Accessibility fundamentals. Do not claim formal WCAG certification.

### AI-assisted methods

- `VERIFIED`: Agent-driven prototype QA and Claude Code as tools inside the product workflow.
- `DO NOT USE IN MASTER CV`: `forty-step playbook`, `multi-model pipeline`, or AI as a separate professional identity.

## Languages

| Fact | Status | Evidence / permitted wording |
|---|---|---|
| Russian - Native | VERIFIED | Current CV. |
| English - professional working proficiency | OWNER DECISION 2026-08-28 | The CEFR label was removed, not raised (finding `L3-7`, `audit/hiring-readiness-2026-08-28.md`). A self-reported `B2` is never verified by a recruiter but is filtered on, and the written English of the published cases reads above it. **No score is claimed and none may be added**: there is still no IELTS or equivalent, and `C1` must not appear anywhere. |

## Claims excluded from every CV version

- Revenue or conversion growth.
- Adoption, user-growth or retention claims.
- Time saved or efficiency improvement without a measured baseline.
- Any unsupported percentage.
- The published DSSL reconstruction as the exact shipped interface.
- Agent Ops Console or Vet Clinic OS as shipped production products.
- Pawly as a live company or marketplace.
- `Senior Product Designer`, `Design Engineer`, `Webflow Developer`, or `AI specialist` as the primary identity.

## Remaining external actions before first application

1. Bring the public LinkedIn headline, About and Experience into line with Product Designer positioning and add DSSL. This is a public-profile edit and requires owner confirmation at the moment of change.
2. Replace the temporary Vercel portfolio address with a custom domain, then update `resume-data.json` and rebuild the bundle.
3. A phone number is optional. If it is restored later, provide a complete international `+7` number first; the current incomplete digits must remain unpublished.
