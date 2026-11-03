# 30-second recruiter screen · English site

Method: fresh Chromium visit to the candidate build (`astro preview`, exact SHA) at
1440×900 and 390×844, normal motion, no prior state; plus the rendered text of Home,
About and case entries. One reviewer's heuristic reading — not a user study.

| Question | Answer within ~30 s? | Where |
|---|---|---|
| 1. Who is this designer? | **Yes, first viewport.** "Nikita Kanarev · Product Designer", portrait, title tag "Nikita Kanarev — Product Designer" | Hero |
| 2. What products? | **Yes.** "I design decision-heavy products — from AI oversight and procurement to learning and clinical workflows." | Hero line under the headline |
| 3. Credible senior-level evidence? | **Mostly.** Each card shows a concrete product decision ("A $120 credit needs human approval", "41 / 48 … Seven lines still need the buyer") with real UI, plus an explicit evidence line. Agent Ops: "Paid client · user-tested, accepted prototype" (owner-confirmed fact, see memory record of 31 Aug 2026). Seniority is shown through the work, not stated in the title | Selected work 01–05 |
| 4. Which case to open? | **Yes.** Agent Ops Console is first and visible at the fold on desktop; "Explore selected work" anchors to the list; numbered 01–05 | Hero CTA, Selected work |
| 5. Contact / CV? | **Yes, first viewport.** CV (PDF), Copy email + visible address, location/availability line; repeated in "Let's talk" with LinkedIn | Hero, footer contact |

## Observations (no redesign proposed)

- R1 · P3 — On 390 px the staged entrance leaves the area below the headline blank for
  roughly 1–2 s before the hero text and CTAs appear (approved motion; settled state is
  complete). It also makes the hero paragraph the Lighthouse LCP element. Recorded as
  context for PERFORMANCE.md, not a defect.
- R2 · info — The role reads "Product Designer", not "Senior". Positioning is an owner
  decision; not changed.
- R3 · info — RU Home intentionally omits the location/availability line
  (`authorization: null`, comment: personal geographic details are not published in RU;
  identical on `main`). Not an EN/RU parity defect.
- About covers constraints, work authorization (Russian citizen, Armenia UTC+4, visa
  sponsorship required, remote now), honest-evidence policy and AI usage — consistent with
  Home and with the CV (same email/LinkedIn, see RELEASE-CHECKLIST).

## Content integrity

- No "concept"/status labels: `npm run check:content` 0 findings over copy, CV, public
  files and built HTML; CV PDFs text-checked separately (EN/RU, 1 page each).
- Email `nikita.kanarev.dev@outlook.com` and LinkedIn `https://www.linkedin.com/in/nikita-kanarev/`
  match the owner-confirmed contacts on all 14 routes and in both CVs.
- No new metrics were introduced by this release pass; case copy is byte-identical to the
  accepted sources except the five Portal captions V1 shortened (dates, prices and scope kept).

**Verdict for this check:** the English site answers all five questions within the first
screen or first scroll. Suitable for international sharing; no blocking finding.
