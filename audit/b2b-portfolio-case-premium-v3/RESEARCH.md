# B2B Partner Portal · Premium V3 · Research and section audit

2 November 2026. Worktree `D:/Claude-projects/sp-b2b-premium-v3`, branch
`redesign/b2b-portfolio-premium-v3-2026-11-02`, from the verified baseline
`bb7a0881f78cc1b5118a70d026863b55298a5262`.

## Baseline verification

| Check | Result |
|---|---|
| `bb7a088` exists, is on `origin/codex/trassir-learn-home-cover-v1-2026-11-02` | yes |
| `origin/main` (`561e683`) is an ancestor of `bb7a088` | yes (48 commits ahead) |
| Source-parity commit `04ae075` is an ancestor of `bb7a088` | yes |
| Acceptance review `317e3b7` | only adds `INDEPENDENT-ACCEPTANCE.md` on top of `04ae075`; read via `git show`, not merged here |
| Agent Ops V3 (Codex) | `redesign/agent-ops-portfolio-premium-v3` @ `eb7b9e7`, own worktree `D:/Claude-projects/Site-portfolio-agent-premium-v3`. Not opened, not edited, not integrated |
| Main checkout | 4 unrelated uncommitted files under `tasks/learn-case/`; untouched (no reset, clean or stash) |

## Product sources and which commit each image comes from

The product repository is `NikitaKanarev97/b2b-partner-portal`. Three commits are
involved; they are **siblings**, not one line:

```
6bbe1cd  Cart V2 (accepted)            ← V2 case captures
├─ c899933  FulfillmentPlan comparison-row selected frame fix   ← V2.1 cart bar, fulfillment, commerce sheet
└─ 15007ae → 36be1d8  Resolution source-parity V1.1 (accepted)  ← V3 captures
```

`git diff c899933 36be1d8 -- src` touches only CandidateComparison.css,
FulfillmentPlan.css (one comparison-row rule), ResolutionCenter.css/.tsx.

| Case image | Commit | Still faithful? | Reason |
|---|---|---|---|
| `workspace-1280/-top-390` (hero) | 6bbe1cd | **yes** | V1.1 shell is `display: contents` while a row is collapsed; collapsed queue unchanged |
| `change-detail-390` (hero inset) | c899933 | yes | Cart DeltaRow not touched by V1.1 |
| `dashboard-*`, `product-*` | 6bbe1cd | yes | Dashboard, Product Details not touched |
| `commerce-sheet-*`, `cartbar-*` | c899933 | yes | Cart not touched |
| `fulfillment-*` | c899933 | yes | includes the selected-frame fix that 36be1d8 lacks |
| `decision-1280/390` | 6bbe1cd | **no** | old double border, panel blue edge, stacked candidate outlines — the defect V1.1 fixed |
| `confirmed-1280/390` | 6bbe1cd | geometry yes, but replaced | re-shot in the same V3 session so the four stages are one continuous object |

All V3 product images are new captures at **36be1d8** (`scripts/b2b-v3/capture-line.mjs`)
or from the product's Storybook built at 36be1d8 (`capture-specimens.mjs`). Each registry
entry in `src/data/partner-portal-v2-media.json` names its own commit.

**Correction of a first-pass note.** I first read the V2 confirmed row as "clipped at the
left (`ı, KX-…`)". The DPR-2 source shows the product's `↳` provenance glyph; it reads as
`ı,` only when scaled down. It is not a crop defect. Recorded here so the claim does not
travel into the report.

## Authorship and evidence boundaries (validated)

| Statement | Source | Use |
|---|---|---|
| Sole product designer | existing accepted case facts; owner chronology (DSSL Sep 2023 – Mar 2026) | hero role, facts, outcome |
| Commercial redesign shipped at DSSL | owner fact recorded 2026-08-24 (`ds/screens/case-dssl.md`, home map "shipped in full") | hero note, facts, outcome |
| Business results | NDA (memory `portfolio-positioning`) | stated as not claimed |
| Screens shown | later rebuild on synthetic data (`outputs/brief.md` §5.1, D013) | hero note, outcome |
| Original portal screenshots | `pages-default/` = original product evidence (brief §"Источники") | diagnosis, archival only |
| `pages-redesign/` | "previous redesign / historical evidence", not a baseline | not used |
| IA, flows, decision records | product repo, Aug–Oct 2026, i.e. the rebuild | process section, labelled as 2026 rebuild artifacts |
| User testing | none in this edition | not claimed |
| ERP | simulated in the rebuild (brief §5.2 "целевая гипотеза") | stated in 04 |

**Wording constraint found during checks.** `CONTENT-RULES.md` (binding per CLAUDE.md)
and `scripts/check-public-content.mjs` forbid the status phrase "independent
reconstruction". The brief's suggested sentence was therefore rephrased to *"The
commercial redesign shipped at DSSL. The screens here are my later rebuild of its
decisions on synthetic data, not the shipped release."* — same distinction, rule-compliant.

**Prototype freshness.** The deployed `b2b-partner-portal-five.vercel.app` was opened in
Chromium on 2 Nov 2026: bundle `index-_Dy68vCu.js`, Resolution Center renders without the
V1.1 `resolution-item` shell. It predates the 36be1d8 screens, so the existing CTA note
("the public version predates the screens shown here") stays. Destination unchanged.

## BEFORE capture conditions

Production build of `bb7a088` served statically; Chromium (Playwright from the product
repo), DPR 1, EN/RU × 1440 / 1024 / 768 / 390 / 360. `before/checks.json`: 0 errors, 0 failed
requests, 0 broken images, 0 upscaled frames, 0 overflow, 0 hidden text. Heights: EN 1440
8,266 px, RU 1440 8,602 px, EN 390 10,881 px, RU 390 11,611 px.

Note: `before/*-viewport.png` were taken 1.6 s after load and catch the hero intro mid-way.
Settled first views at 3.5 s are `*-first-view.png` in both phases and are the ones compared.

## Section audit (BEFORE → decision)

| # | Section | Should communicate | Currently communicates | Strong | Problems | Reference | Proposed change | Expected improvement | Verdict | Source / provenance | Protected |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | Hero | product, purpose, sole designer, shipped vs rebuild, the challenge | product + promise + real workspace + price-change inset | real Resolution Center as hero object; title on clean colour; accepted cool surface | role and shipped/rebuild status only in facts below the fold; "real product screens · synthetic data" note under the image | R4 `dn-head.jpg`; Linear (R5) | promise → "From spreadsheet to purchase…"; sole-designer line and shipped/rebuild note in the first view | recruiter reads role and status without scrolling | IMPROVE | workspace 6bbe1cd (faithful), delta c899933 | asymmetric layout, no 3-camera hero |
| — | Facts | role, period, status, prototype | same | compact | "Status" mixed shipped and rebuild | — | split into Role / Period / Shipped / Prototype | each fact one claim | IMPROVE | owner facts | 2024–2026 period |
| 01 | Problem → Diagnosis | old hierarchy vs procurement job, evidence → direction | thesis + small legacy strip + big "after" | honest archival BEFORE; good thesis | one tiny archival strip (1426×440) carries the whole argument; no explicit diagnosis | R1 `dn-diag.jpg` | two archival frames (dashboard, cart), each with Observed → Direction; zoom to full size; "after" as the built direction | three grounded symptoms instead of one assertion | REPLACE | `pages-default/Главная.png` (existing crop), `pages-default/Корзина.png` (new crop, no pixel edits) | no fictional old screen |
| 02 | System → Architecture | entries converge on one object; three kinds of certainty | six-word typographic strip | clean | no structure, no branches, no IA evidence | R2 `ha-user-flow.png`, `ha-screen-map.png` | HTML diagram: 3 ways in → Specification (provenance, 4 match states, one resolver) → Cart (3 freshness states, delta rule) → Fulfillment → Checkout/Order; identity / commercial / fulfillment bands; mobile vertical | architecture readable as a decision, not a list | REPLACE | `ia/sitemap.md`, `ia/flows/xls-to-order.mmd`, D007, D010 — editorial diagram, labelled | D007 one resolver |
| 03 | Human decision → Source line | one ambiguous line, buyer decides, stays traceable | compare panel + confirmed strip | right example (row 19) | panel shows pre-V1.1 geometry; confirmed strip separate session; no continuation | actual product; R6 thesis | four real stages of row 19 in one session: imported → compared & chosen → confirmed → cart line with source row 19 | strongest moment; traceability proven, not asserted | REPLACE | 36be1d8, `capture-line.mjs` | disabled Apply evidenced; nothing applied on select; Undo |
| 04 | Verification | identity ≠ price ≠ stock | screenshot + three proofs | readable shot | proofs did not state the limits (compatibility, ERP simulated, stock ≠ promise) | Stripe (R5) | keep shot, rewrite proofs as distinctions incl. ERP limitation | honest certainty boundaries | IMPROVE | product-1280 6bbe1cd | real figures |
| 05 | Commercial review | unknown ≠ zero; total excludes; next step blocked | band + two native modules | strong V2.1 section | two stacked images without a reading order | Ramp (R5) | numbered decision chain (line says it → total excludes it → next step waits) above the same modules | logic readable before the images | IMPROVE | c899933 | ₽1,362,600, 43 of 48 |
| 06 | Fulfillment | speed vs shipments vs cost, buyer chooses | large comparison | legible, accurate | dimensions implicit | Attio (R5) | add the five compared dimensions as chips; keep plate | reader knows what to compare | KEEP + small | c899933 | no guarantees invented |
| 07 | Design system | complex states designed once | absent | — | missing differentiator | R3 `ha-component-library.png`, `ha-components.jpg` | foundation strip (8 semantic colours with real values, type scale) + four families: ResolutionRow (real queue rows), FileUpload, Availability, FulfillmentPlan (Storybook) | system thinking shown with real states | NEW | 36be1d8 app + Storybook | no fake components |
| 08 | Process | what one designer owned and how | absent | — | ownership only asserted | R6 | four steps with their real artifact paths, labelled as 2026 rebuild artifacts | evidence-led ownership | NEW | product repo files | no invented testing |
| 09 | Outcome | shipped / shown / owned; costs; CTA | thesis + costs + CTA | honest costs | evidence categories implicit | — | three evidence categories + three costs + unchanged CTA | categories cannot be confused | IMPROVE | owner facts | CTA destination |
