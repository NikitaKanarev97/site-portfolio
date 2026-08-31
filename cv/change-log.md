# CV Change Log

Updated: 2026-08-31

## 2026-08-31 — positioning line: work is carried through to a working build

Source: `PLAYBOOK-upwork-positioning.md` §4, owner decision of 2026-08-31. The site is not rebuilt for a client audience; the only change to both public documents is one sentence about delivery.

- **Rewrote the last sentence of the summary in both languages.** It was `translating design decisions into semantic tokens, React prototypes and Storybook-ready component specifications`; it is now `carrying design decisions through to semantic tokens, React components and a deployed working build rather than a handoff file`. The claim is a differentiator inside the Product Designer role, not a change of role — `Design Engineer` stays on the `DO NOT CLAIM` list in `cv/fact-sheet.md`, and nothing about production systems, backend, auth or payments is implied.
- **Nothing else in the CV changed.** Headline, experience, selected work and skills are untouched; both PDFs and the plain-text resume were rebuilt from `resume-data.json` and `resume-data-ru.json`.
- **Line count held.** The English summary stays four lines and the sheet is unchanged in height; the Russian sentence was written shorter than the one it replaced, so the Russian sheet is 26 px shorter than before this edit.
- **Pre-existing overflow found, not introduced and not fixed here.** `.sheet` in `cv/styles-branded.css` is a fixed 297 mm with `overflow:hidden`, and both branded layouts exceed it: the English one by ~17 px (the footer line with the email is clipped in the PDF), the Russian one by ~97 px (the `Дополнительно` block, the CTA bar and the footer). The ATS layout fits. This predates the sentence above and is a separate fix.

## 2026-08-28 — hiring-readiness findings `L3-6` and `L3-7`

Source: `audit/hiring-readiness-2026-08-28.md`. Both were owner decisions, not editorial calls.

- **Split the overlapping freelance row into two entries (`L3-6`).** `Freelance Product Designer - Self-employed, Jan 2023 - Present` mixed paid client engagements with portfolio concepts while overlapping DSSL, so `3+ years` could be read as including personal projects. It is now `Product Designer - client work, Jan 2023 - Present` — paid engagements only, stating that the most recent contract closed in spring 2026 — plus a separate `Selected independent projects, 2026` holding Pawly and the portal reconstruction. The 2026-08-27 fix reworded the overlap; this one removes the ambiguity structurally.
- **Removed the CEFR label from English (`L3-7`).** `B2 (Upper-Intermediate)` became `professional working proficiency`. The level was **removed, not raised**: a self-reported CEFR grade is never verified by a recruiter but is filtered on, while the written English of the published cases reads above it. No score is claimed and none may be added — `C1` must not appear anywhere.
- Both changes are mirrored in the Russian CV and both PDFs were rebuilt. `cv/fact-sheet.md` carries the new rules, including that portfolio concepts must never sit under an employment row again.

## Feedback remediation

- Converted both the branded CV and ATS resume from two partially filled pages to one complete A4 page.
- Preserved the Product Designer positioning, B2B focus, summary and technical-fluency differentiator.
- Removed the incomplete phone number instead of guessing an international format.
- Made portfolio, LinkedIn and email visible as plain text as well as clickable links.
- Replaced `Spring 2026` with `Present` for the broader freelance/self-directed practice, while stating that current activity is portfolio work rather than implying the spring contract remains active.
- Renamed the overlapping role to `Freelance Product Designer - Self-employed` and rewrote the overlap explanation to remove the ambiguous word `afterwards`.
- Added `Available immediately` and removed `Visa sponsorship required` from the general CV.

## Experience and evidence

- Kept DSSL at four bullets and removed the reconstruction disclaimer from Experience.
- Added official company scale: 19 offices, 20+ warehouses and international partner presence.
- Rewrote the partner-portal bullet around four shipped workflow areas: specification upload, contract pricing, inventory and ordering.
- Added Agent Ops scope: three roles, 35 scoped artboards and delivery of the tested clickable core within one month.
- Kept the four Webflow sites as owner-confirmed end-to-end design and build work.
- Avoided revenue, conversion, adoption, efficiency and post-launch claims.

## Selected work

- Compressed Selected Work into a three-case proof strip instead of repeating full Experience paragraphs.
- Kept the shipped-versus-reconstruction disclosure only on the B2B Partner Portal case entry.
- Added Vet Clinic OS with its two-week scope, 44-screen sitemap, 13-screen prototype and 31 edge cases.
- Connected the Veterinary Doctor qualification to relevant vertical-SaaS domain expertise.

## Skills

- Reduced Skills to four groups and 26 defensible items.
- Replaced `Basic JavaScript and TypeScript` with `JavaScript and TypeScript (working knowledge)`.
- Removed the separate `AI-assisted workflows` identity.
- Kept only `Agent-driven prototype QA` and `Claude Code` inside Tools.

## Visual and ATS changes

- Preserved the editorial Manrope/JetBrains Mono typography, restrained orange accent and no-photo layout.
- Rebalanced the branded page into a clear header, Experience, three-case proof strip and two-column detail area.
- Kept ATS single-column with standard headings and fully visible URLs.
- Avoided typographic range dashes in the branded layout by using `at`, `to` and middle-dot separators; ATS keeps ASCII hyphens.
- Updated `public/cv.pdf` with the new one-page branded version.

## External work not performed

- LinkedIn copy is prepared in `cross-document-consistency.md`, but the public profile has not been edited without explicit action-time confirmation.
- LinkedIn remains the only open external blocker.

## Domain and review pass - 2026-08-27, later run

- Replaced the temporary Vercel URL with the connected custom domain `kanarev.com` across the header, all three case links and the closing CTA; `astro.config.mjs` already declared the same `site`.
- Removed the verbatim overlap between the summary and the first DSSL bullet: the summary now carries a shipped outcome, the bullet carries the named cross-functional counterparts.
- Branded layout now writes `Freelance Product Designer / Self-employed` instead of the ungrammatical `at Self-employed`.
- Moved `Agent-driven prototype QA` from Tools to Research, where the method belongs.
- Rewrote the language line as `English - B2 (Upper-Intermediate)` so the level stops colliding with the ` / ` list separator.
- Dropped `Kazakhstan / UTC+5` from Availability; it is already stated under the name.
- Tightened the Agent Ops meta from `Up to one month` to `1 month`.
- Anchored the closing CTA to the bottom of the sheet so the page no longer ends with an orphan gap above the footer.
- Branded header markup now derives the headline from `resume-data.json` instead of a hardcoded string.
