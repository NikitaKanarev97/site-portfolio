# CV QA Report

Run: 2026-08-27

This report deliberately separates document quality from sendability. The local bundle is materially improved, but the public LinkedIn mismatch and temporary portfolio domain still reduce application readiness.

## Automated and visual checks

| Check | Result | Evidence |
|---|---|---|
| ATS extraction order | PASS | ATS PDF extracts as name, headline, location, Portfolio, LinkedIn, Email, Professional Summary, Experience, DSSL, Freelance Product Designer, Selected Work, Skills, Education, Languages and Availability. |
| PDF pages | PASS | Branded: 1 A4 page. ATS: 1 A4 page. |
| PDF links | PASS | Portfolio, LinkedIn, email and all three case studies are clickable; URLs are also visible as text where print or text forwarding matters. |
| Live portfolio | PASS WITH EXTERNAL RISK | Portfolio root and the three linked case routes return HTTP 200. The Vercel URL is temporary and should be replaced before first application. |
| DSSL disclosure | PASS | Experience states only the shipped commercial redesign; Selected Work identifies the published case as a later reconstruction on synthetic data. |
| Agent Ops disclosure | PASS | The CV claims a tested, accepted prototype and does not claim a production launch or post-launch impact. |
| Dates | PASS WITH SCOPE NOTE | DSSL is Sep 2023-Mar 2026. Freelance is Jan 2023-Present because self-directed product work continues; the description does not imply the spring 2026 client contract is still active. |
| Unsupported metrics | PASS | No revenue, conversion, adoption, user-growth, time-saved or efficiency claims. Added numbers are scope facts from case sources or current official company context. |
| Specialist degree | PASS | Verified from the supplied diploma; qualification Veterinary Doctor is explicit. |
| Veterinary relevance | PASS | Vet Clinic OS is now a selected case and explicitly connects the domain expertise to product work. |
| Skills compression | PASS | Four groups, 26 defensible items. AI is integrated into Tools as agent-driven prototype QA; JavaScript and TypeScript use the qualifier `working knowledge`. |
| Sponsorship line | PASS | Removed from the master CV; it remains a required disclosure in application forms or a cover note. |
| Phone | PASS | The malformed number is removed rather than guessed. Email and LinkedIn remain sufficient contact routes. |
| Spelling and grammar | PASS | Recruiter-English and compression passes completed. Summary length remains 60 words. |
| Non-ASCII dashes | PASS | ATS uses ASCII hyphens. The branded layout avoids typographic range dashes by using `to`, `at` and middle-dot separators. |
| Visual desktop / A4 | PASS | Final pages rendered at 144 DPI with no clipping, overlap, orphan lines or unsafe margins. |
| Laptop readability | PASS | The branded page preserves a clear editorial hierarchy at 100%; ATS remains plain and single-column. |
| Mobile preview | PASS WITH EXPECTED ZOOM | Complete A4 bounds and hierarchy survive downscaling; detailed reading on a phone still requires zoom. |
| Print structure | PASS | Single A4 page, visible portfolio/email/domain text and no dependence on hidden link labels. |
| 10-second scan | PASS | Name, Product Designer, 3+ years, B2B/complex work, DSSL, portfolio and sole-designer ownership are visible above the fold. |
| LinkedIn consistency | FAIL / EXTERNAL ACTION | LinkedIn currently positions the candidate as a Webflow Developer and does not show DSSL. Public edits still require explicit owner confirmation at action time. |
| Custom portfolio domain | PASS | `kanarev.com` is connected and live; root, `/#work` and all four case routes returned HTTP 200. No CV output references the Vercel URL. |

## Recruiter scan simulation

### 10 seconds

- Nikita Kanarev, Product Designer with 3+ years.
- Specialisation: complex B2B products, workflows and design systems.
- Main commercial evidence: DSSL, sole designer in a 6-10 person team across three products.
- Portfolio, LinkedIn and email are visible as text.

Result: PASS.

### 30 seconds

Visible evidence: research-to-QA ownership, four partner-portal workflow areas, three products, a three-role NDA prototype delivered within one month, four end-to-end Webflow builds and three direct cases.

Result: PASS.

### 90 seconds

Differentiation: product ownership in legacy-heavy domains, credible separation of shipped work from reconstruction, system thinking, implementation literacy and veterinary domain expertise applied to vertical SaaS. Strongest cases to open: Agent Ops Console, B2B Partner Portal and Vet Clinic OS.

Result: PASS.

## Hiring-manager review

Perspective: European Head of Product Design hiring mid-level Product Designers. These scores are judgment calls, not automated acceptance signals.

| Dimension | Score / 10 | Rationale |
|---|---:|---|
| Positioning | 8.8 | Product Designer identity and B2B focus are immediate. |
| Experience | 8.4 | Commercial ownership is clear and compact; post-launch outcomes remain unavailable. |
| Credibility | 8.7 | Shipped, reconstructed, prototype and concept boundaries are separated. |
| Evidence | 8.3 | Scope facts now include roles, workflows, screens, artboards and delivery time without inventing impact. |
| Clarity | 8.8 | The one-page hierarchy removes the former stretched-page problem and limits duplication. |
| Visual hierarchy | 8.6 | Branded version stays editorial and calm; ATS is intentionally plain. |
| ATS | 8.8 | One column, standard headings, visible URLs and coherent extraction order. |
| Product maturity | 8.5 | Legacy constraints, system ownership, QA and trade-offs are evident. |
| International readiness | 7.3 | Strong local CV, but the Webflow-first LinkedIn and temporary domain weaken trust externally. |
| Portfolio integration | 8.0 | Three direct cases and plain-text URLs are strong; the temporary domain remains conspicuous. |

Document quality: approximately 8.5/10. Sendability remains lower until the two external actions are completed.

## Red-team review

| Rejection risk | Mitigation / remaining action |
|---|---|
| Five-month gap after DSSL | Ongoing freelance/self-directed work is explicit and Availability says `Available immediately`; do not imply an active client contract. |
| No business impact metrics | Scope facts replace responsibility-only bullets; no proxy metric is presented as impact. |
| Concept work looks commercial | The DSSL reconstruction is disclosed in Selected Work; Agent Ops is described as a prototype. |
| Webflow confuses positioning | One experience bullet and one tool mention only; Product Designer remains primary. LinkedIn still needs the same change. |
| AI looks like a separate identity | Separate AI group removed; only agent-driven prototype QA and Claude Code remain under Tools. |
| Veterinary degree looks unrelated | Vet Clinic OS now converts it into relevant domain expertise. |
| Sponsorship triggers an early filter | Removed from general CV; disclose where the application asks. |
| Missing phone | Intentional; malformed digits were a larger trust risk than omission. |
| LinkedIn contradicts the CV | OPEN - public profile must be updated before applications. |
| Temporary Vercel domain | OPEN - custom domain must replace it before applications. |

## Final status

- ATS extraction - PASS
- Links - PASS
- Dates and scope wording - PASS
- Portfolio disclosure consistency - PASS
- No unsupported metrics - PASS
- Spelling - PASS
- 10-second scan - PASS
- One-page layout - PASS
- Phone handling - PASS (removed)
- LinkedIn consistency - FAIL, external action required
- Custom domain - FAIL, external action required

The PDFs are internally coherent and substantially stronger. They are not yet rated as fully ready for first application because LinkedIn and the public portfolio domain remain inconsistent with the intended professional presentation.
