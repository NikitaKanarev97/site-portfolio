# Application Adaptation Guide

Master positioning:

> Product Designer - B2B products, complex workflows, design systems

Keep the title `Product Designer` in almost every application. Adapt no more than 10-15% of the resume: the summary's third sentence, the order or emphasis of bullets, the selected-work descriptions, and the first items in each skills group.

## B2B SaaS / complex product role

Raise:

- B2B partner portal, Agent Ops Console and multi-role workflows.
- Legacy pricing, inventory, specification and operational constraints.
- Information architecture, workflow analysis and cross-functional ownership.
- Sole-designer scope in the 6-10 person DSSL team.

Suggested summary ending:

> Brings technical fluency to legacy-heavy B2B domains, translating multi-role workflows into clear information architecture, testable prototypes and implementation-ready systems.

Do not add:

- Unsupported business impact or efficiency claims.
- Agent Ops Console as a shipped product.
- The current DSSL case-study interface as the exact shipped interface.

## Design-system-heavy role

Raise:

- Figma, semantic tokens, component architecture and state coverage.
- Storybook, React prototypes and design-to-code parity.
- Shared patterns, handoff and engineering QA.
- Accessibility fundamentals.

Suggested summary ending:

> Builds semantic design systems that connect Figma, specifications, React prototypes and Storybook without creating separate sources of truth.

Consider moving `Tools` and `Technical` above `Research` in the skills section. Keep Product Design ownership first.

## Product Designer + prototyping role

Raise:

- Interactive prototypes, HTML/CSS, JavaScript/TypeScript (working knowledge) and React.
- Webflow as delivery evidence, not as the main professional identity.
- Agent-driven prototype QA and Claude Code as workflow tools.

Suggested summary ending:

> Uses technical implementation skills to make product decisions testable early and to hand engineering a system that needs less translation.

Do not change the headline to `Design Engineer`, `Webflow Developer` or `AI Product Designer` unless a specific role explicitly uses that title and the application is intentionally experimental.

## Europe

- Use the branded CV for direct outreach, referrals, recruiter conversations and email applications.
- Use the ATS resume for Workday, Greenhouse, Lever and LinkedIn applications.
- Keep `Kazakhstan - UTC+5 - Open to relocation` visible.
- Keep sponsorship out of the general CV. Disclose it accurately in the application form or cover note where work-authorisation questions are asked.
- Keep `Available immediately` while it remains true.
- Keep the Specialist Degree wording. Do not translate it to BSc.

## Canada / United States

- Prefer the ATS resume unless a recruiter asks for a designed CV.
- Rename the file with `Resume`, not `CV`, if tailoring the filename.
- Keep one column, no photo, no age, no marital status and no citizenship line.
- Keep the location as Kazakhstan and state sponsorship requirements plainly in the application form.
- A phone number is optional. Add one only after a complete international `+7` number is available.
- If an application asks for credential equivalency, describe the education as `Specialist Degree in Veterinary Medicine`; do not claim a US/Canadian bachelor's equivalency without an assessment.

## Domain and link updates

The current portfolio URL is temporary:

`https://kanarev.com/#work`

When the custom domain launches:

1. Update `cv/resume-data.json` only.
2. Run `npm run cv:build`.
3. Re-run link and PDF-annotation QA.
4. Replace the resume in application profiles and on the portfolio.

Do not keep both the Vercel and custom domains in the CV.
