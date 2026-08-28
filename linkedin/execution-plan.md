# LinkedIn Repositioning Execution Plan

Updated: 2026-08-28

## Current status

- Phase 0 — completed through the authenticated browser; the connector is search-only, so exact profile reading used the signed-in LinkedIn session.
- Phase 1 — completed; see `linkedin/before-state.md`.
- Phase 2 — completed with 28 vacancies across Europe, the US and Canada; see `linkedin/research/job-signal-matrix.md`.
- Phase 3 — completed; see `linkedin/change-set.md`.
- Phase 4 — completed against `cv/fact-sheet.md`, the master CV and published case disclosures.
- Phase 5 — substantially completed in the authenticated LinkedIn session: positioning, About, Experience, Projects, Skills, Education, Languages, portfolio contact and Services were updated.
- Phase 6 — authenticated QA completed; see `linkedin/after-state.md`.
- Remaining execution items: the legacy Open to Work record does not persist edits and likely needs deletion/recreation under LinkedIn's current three-role limit; Outlook passed mobile security and now awaits password submission plus email verification; LinkedIn's Featured validator still rejects the `kanarev.com` domain even though its live canonical/Open Graph metadata is correct.
- Phase 7 — pending distribution and measurement after the three remaining items are cleared.

## Phase 0 - Access and snapshot

1. Restart/reload the app so the LinkedIn MCP becomes available.
2. Confirm the connector can read the authenticated profile and edit only the intended account.
3. Export or record every current field: introduction, headline, About, Experience, Featured, Education, Certifications, Skills, Projects, Services, Recommendations, Languages and Open to Work preferences.
4. Save a local before-state and a section-by-section diff target.
5. Do not edit yet.

Acceptance: the exact current profile is known, including hidden/truncated content and current dates.

## Phase 1 - Recruiter audit

1. Score the current profile from 0-5 on searchability, role clarity, evidence, credibility, proof access, market fit and cross-document consistency.
2. Run a 10-second recruiter scan: what role, level, domain and risk are visible without expanding anything?
3. Identify every Webflow-first signal and decide whether to remove, rename or demote it.
4. Identify missing Product Designer signals, especially DSSL and complex workflow evidence.
5. Audit public visibility, custom URL, contact links and language profile settings.

Acceptance: every weakness maps to a specific profile field and a planned correction.

## Phase 2 - Keyword and job-family map

1. Build a controlled keyword list from 20-30 current vacancies split across Europe, Canada and the US.
2. Separate core keywords, adjacent keywords and vacancy-specific keywords.
3. Map each keyword to verified evidence in the Fact Sheet.
4. Reject keywords that cannot be defended in an interview.
5. Define a universal base profile and small market/vacancy adaptations.

Acceptance: no keyword exists only for search optimization; every one is evidenced in Experience, a case or a skill.

## Phase 3 - Content architecture

1. Finalize the headline after comparing 3-5 variants against the job-family map.
2. Draft About in two short paragraphs plus a proof CTA.
3. Draft DSSL Experience with one scope line and 3-4 evidence bullets.
4. Draft Freelance Product Designer with product work first and Webflow last.
5. Write titles/descriptions for Featured case links.
6. Select and order 20-30 Skills; map top skills to the relevant roles.
7. Normalize Education, Certifications, Languages and availability.
8. Decide whether Projects and Services add information or create duplication.

Acceptance: the complete draft passes the Fact Sheet and the recruiter 10-second scan before any live edit.

## Phase 4 - Cross-document consistency and red-team review

1. Compare every date, title, URL and shipped-status claim against CV and portfolio.
2. Ask skeptical questions: Was this exact design shipped? Was this a live product? Was the research human? Is the contract current? Are metrics business outcomes or build QA?
3. Remove duplicate process language and tool lists.
4. Check English for US/Canadian/European neutrality and recruiter readability.
5. Produce a final approved change set.

Acceptance: zero unsupported claims and zero contradictions across LinkedIn, CV and portfolio.

## Phase 5 - MCP execution

1. Apply changes section by section, beginning with Experience and ending with headline/About so the introduction reflects the correct current role data.
2. Add portfolio and case-study links with clear titles and descriptions.
3. Reorder Featured and Skills.
4. Update Open to Work preferences separately from public copy.
5. Avoid notifying the network about every historical edit unless the user explicitly wants that.

Acceptance: each live change matches the approved draft exactly.

## Phase 6 - QA

1. Read the profile while authenticated and, where possible, in public/logged-out view.
2. Check desktop and narrow/mobile presentation, truncation and the first visible lines.
3. Verify every link and media preview.
4. Re-run the recruiter score and 10-second scan.
5. Save an after-state and a final change log.

Acceptance: profile is searchable, credible, internally consistent and sends the viewer to the strongest proof in one click.

## Phase 7 - Distribution and measurement

1. Prepare three case-derived posts: Agent Ops problem reframe, DSSL system decision, Vet Clinic trade-off.
2. Request 2-3 evidence-specific recommendations.
3. Track profile views, search appearances, recruiter messages and portfolio clicks for 2-4 weeks.
4. Adapt headline/About only when data or target vacancies justify it.

Acceptance: optimization is judged by qualified recruiter interest and proof clicks, not follower count.

## Context strategy

Separate chats are not required for the current stage because the research, facts and execution plan are persisted in `linkedin/`. If authenticated execution becomes large, create one separate task for live MCP changes and keep this task as the audit/research record; do not split research, copy and facts across multiple unsynchronized chats.
