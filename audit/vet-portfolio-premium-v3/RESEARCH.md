# Vet Clinic OS V3 · actual product and case assessment

## Source-of-truth and branches
- Case V2.2: `redesign/vet-portfolio-case-v2@6463468a68164278fcb6dec78569721343464a52`. This research branch is based on it, not on older `main@561e6830392b6e9a25e61e30cafe394586df3ff4`.
- Working Vet application: `NikitaKanarev97/veterinary-clinic@3835c4ffe224a1077d131d2882878d3d373d56e5`. V2 screenshots trace to this source; this does not establish the deployed website SHA.
- Comparable independent cases: Agent V3 `dd717b0548dbd33d6ca21008dcb8fd796171b12d`, B2B V3 `b396a6036122461994811ed2afbe73d980e468b2` (currently under user review), Learn V3.1 `cbd12eb7ba8345f3d6a3db1d4c93c59b3a7a4498`. Do not pretend these are all merged in one branch.
- Inspected actual files: portfolio `src/components/vet/VetCase.astro`, `src/copy/cases/vet-v2.ts`, `src/data/diagrams/vet-clinic/role-flow.ts`, `audit/vet-portfolio-case-v2/{RESEARCH.md,MEDIA_MANIFEST.md,v2.2/REPORT.md}`; Vet product `CLAUDE.md`, `PROJECT.md`, real screens and audit structure; sibling V3 storyboards/reference maps and real opening screenshots.

## Screenshot-based BEFORE findings
1. B01/B02: V2.2 is strong, honest and uses a real clinical Visit Record (4.8 kg, 0.95 ml, statuses); DO NOT start over. Unlike S01/S03, the first fold largely omits role, authorship and project status. On phone the statement pushes the actual clinical proof down.
2. B04: responsibilities are expressed as three good but static text columns. The real information model—what flows to reception, what owner sees only after explicit publication, what never leaves the clinic—needs a small readable connected visual.
3. B03: the calculator has excellent inspectable arithmetic; explain the product decision (source, substitution, rounding, clinician review) instead of treating it as a generic screen illustration.
4. B05: invoice, full discharge preview, and desktop/phone owner create a long heavy screenshot stack. At browse scale the whole Discharge document is microscopic. Split into role decisions with one dominant proof each.
5. B06: the high-stakes critical cases (clinical-only note, blocked publication retaining previous version, missing-dose phone confirmation) are strongest evidence of product responsibility but are buried late.
6. B07: outcome is candid about limitations but largely general. Include concrete design decisions, product source and verified browser behavior; not fake adoption metrics.
7. H01/H02: real historical UI images exist, but are not a controlled matched BEFORE, research experiment, or proven operational pain. Use only as explicitly archival if it clarifies the decision.

## Thesis / differentiation
**One visit. Three perspectives. One reliable record.** Vet's narrative is clinical handoffs and deliberate information boundaries, NOT AI approvals (Agent), price certainty (B2B), or learning tracks (TRASSIR). One patient/visit runs through doctor, reception and owner, but the outputs and visibility differ. Reader should understand both rationale and actual implemented UI without reading a component catalogue.

## Product and research truth
- Practitioner input was recorded from **one practising veterinarian**. Product research also contains simulated artifacts: never imply a larger real interview sample, observational study, measured hospital efficiency or clinical outcomes.
- The “30 seconds” Quick Trace recording interval is a design constraint, not a measured speed reduction. Trace allows saving useful validated information before a full record; invalid partial prescriptions remain blocked.
- Dose example: patient weight 4.8 kg, formula/units 0.960 ml arithmetic rounded to 0.95 ml. No algorithmic safe dose recommendation or medical certification; formulations and rate require clinician judgement.
- Selected services total 1,500 RUB in demo. Reception marks status paid manually; no real payment processing, fiscal receipts, refunds, insurer flows or integrations.
- Saving clinical edits is not publishing an owner discharge. Owner sees only the explicitly published snapshot. Empty draft plan blocks re-publication while last published document remains. Private clinic note and diagnosis are not owner-facing; no invented notification or delivery channel.
- Absent published dose => do not guess; show clinic telephone action. The prototype uses browser-local state, not server-enforced access policies.
- Synthetic/demo patient, medications and finance; consistent EN/RU 4.8 kg / 0.95 ml and conditional 10-day recheck plan. No verified clinic adoption, commercial KPIs or regulatory compliance claims.

## Visual direction
Keep existing sage/teal Vet identity, shared Onest types, grid, metadata and CaseNext. Match S01/S03 in first-fold role/scope/evidence and R01/R03 in editorial argument, not in color or narrative. Use real large native screen evidence and a compact source-backed diagram; avoid colored left stripes, double frames, screenshot corner artifacts, uneven borders, arbitrary color, decorative card shells, tiny image mosaics and giant voids. A new chapter must prove a real product decision rather than repeat what the previous image showed.

## Provenance limits
All R images are old genuine third-party portfolio screenshots already stored by the user and visually opened for this research; not verified screenshots of today's live layouts. Every B/S/H asset is a real stored branch screenshot, not a newly generated V3 capture. Codex must capture fresh matched V3 BEFORE/AFTER with a real browser and document source states.