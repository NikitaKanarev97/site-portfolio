# Vet Clinic OS portfolio V2 — research and direction

1 November 2026 · Europe/Moscow. Implementation candidate for independent review.

## Verified starting point

- Portfolio `origin/main`, fetched before editing: `561e6830392b6e9a25e61e30cafe394586df3ff4`.
- Product remote `main` and clean local source: `3835c4ffe224a1077d131d2882878d3d373d56e5`.
- Isolated portfolio worktree `D:/Claude-projects/sp-vet-v2`, branch `redesign/vet-portfolio-case-v2`. Existing uncommitted Learn task reports in the original portfolio checkout are untouched. Product is read-only. No Figma changes, merge or deployment is authorised.
- Before implementation, all five portfolio commands passed. Exact output: [baseline checks](checks/baseline/).

## Current case and implementation

Read both existing Vet copy files, shared CaseStory, EN `[slug]` and delegating RU route, CaseScreen/MediaZoom, Home/WorkStage/VetStage, the two old media directories, AGENTS/CLAUDE/CONTENT-RULES and DS contract/foundation/catalog/story contract/case map. Existing public Vet uses `makeVetStory()` and the shared block renderer; most of the much longer legacy copy object is no longer rendered.

The public case focuses on trace → invoice → published summary. Its screenshots still show 4.9 kg / 1.00 ml and older care wording. The current product uses 4.8 kg / 0.95 ml. The mobile diagram is especially tall, spends many viewports describing a simple responsibility split, and pushes important product evidence down. The saved trace appears in both cover and body. The new Visit Record and calculation review are absent. Narrow role panels are readable individually but do not show the scope or quality of the current clinical workspace. “Stopped being…” and a thirty-second trace can read as measured operational change unless qualified.

Live page captures, text and observed renderer versions are preserved in [references](references/): Vet `blocks-v1`, Agent `agent-v2`, Portal `portal-v2`, at 1440 and 390. The actual product URL loads the current Visit Record selector and normal values. This is a DOM/content check, not proof of the deployment's Git SHA; the media pack therefore records its verifiable local product SHA instead.

## Primary presentation benchmarks

Agent Ops Console: an explicit operational decision in the hero; large documentary crops; quiet numbered split headings; a six-step editorial flow rather than a complex diagram; side-by-side consequence and trade-off; real narrow captures; complete-image inspection. Its cover devotes a large area to a readable single task. Portal: horizontal title/promise, limited cool neutral field, asymmetric label/body grid, distinct evidence per section, complete native components and quiet outcome. The supplied existing media manifests document source geometry; their source-specific claims and commercial outcomes cannot be transferred to Vet.

Use the same Onest roles, semantic colours, container, 24/32/48 spacing and 96/128 module rhythm, shared navigation, MetaList, TextLink, CaseScreen/MediaZoom and CaseNext. Avoid a cover collage, tall flowchart, generic cards, decorative shells, excessive masks/shadows or a component-library appendix. Preserve neighbouring case files.

## Product evidence and state contracts

Studied registry, current screen modules and their implementation/state providers. Latest relevant merged evidence found:

| Screen | Latest evidence in current main | Narrative evidence / limits |
|---|---|---|
| Visit Record | `audit/visit-record-premium-v1/v1.3/` | Current weight/trace provenance, clinic-only fields and private note, prescription, selected services, explicit save-to-review. Report calls itself an independent acceptance handoff, not an approval. |
| Dose Calculator | `audit/vet-dose-calculator-v1/v1.2/` | Source-bound weight and formulation, editable clinician-entered rate, dimensional arithmetic and syringe rounding; recording differs from publishing. No verified therapeutic range or automated safety verdict. |
| Quick Trace | `audit/visit-quick-trace-v1/v1.1/` | A validated useful trace precedes the full record. Incomplete prescription drafts deliberately remain unsupported; do not claim partial invalid prescriptions can be saved. |
| Day Queue | `audit/vet-day-queue-v1/v1.1/` | Arrival/priority/unfinished records. Earlier pale screenshots were capture timing artifacts, not a visual state. Helpful context, lower priority than new clinical evidence. |
| Invoice | `audit/vet-invoice-draft-premium-v1/v1/` | Same per-patient services/total as clinician; manual paid status, reset on service changes. No payment processing, fiscal receipt, discounts or financial integration. |
| Discharge Preview | `audit/discharge-preview-premium-v1/v1/` | Explicit publication, owner preview, empty-plan block, stable previous publication during draft changes/failure; re-publication replaces the body, not a version-history browser. |
| Owner Home | `audit/vet-owner-home-premium-v1/v1.1/` | Latest visit provenance and unavailable-dose confirmation; actual published snapshot only. No private note, diagnosis, invoice or dosing arithmetic. Native clinic telephone action. |
| Owner Discharge | Current source + latest Owner Home/Discharge Preview cross-screen reports | Published document; browser print/PDF, no made-up delivery channel. |

Reports frequently defer independent visual acceptance. “Latest relevant merged version” is the defensible provenance; do not relabel these product iterations as independently certified or clinically accepted.

## Selected story and media direction

One clinical visit produces role-specific outputs. Hero: one complete current desktop Visit Record, with a real mobile context detail and complete-image inspection below the mobile breakpoint. A clean title/promise precedes it. Problem: a short, user-informed constraint and thirty seconds explicitly labelled a design constraint. Roles: three plain editorial columns with shared-output/private-information boundaries, stacked on mobile.

Clinical: the complete native Dose Calculator review panel on desktop and mobile, with the full input workspace linked for inspection. At 1280px the full workspace made arithmetic too small; native-size review resolved that during browser QA. Handoff: Invoice (services/total/status); Discharge Preview (owner document beside publication); native Owner Home (published plan, prescription, document and clinic contact). Responsive thinking uses the same Owner Home state at desktop and phone sizes. Critical states: clinic-only note, blocked publication retaining the old owner version, unavailable dose requiring a call. No dramatic V1.2/V1.3 comparison and no fabricated product UI.

Fresh DPR-2 screenshots from the verified clean current product replace the old set. Native boundaries remove only external ScreenViewer navigation/demo chrome. Crops are documented in the JSON and Markdown manifest; full captures remain inspectable. No CSS suppression, edited UI strings, treatment defaults, recolouring or retouching. Default plan is “Stop the drops. Recheck in 10 days if symptoms return” (localized seed in RU), with 4.8 kg / 0.95 ml throughout. Exception fixtures reuse the product audit's model states (empty saved plan / absent published concentration) without inventing a dose or changing the normal plan. An actual UI publication supplies the shared published snapshot.

## Factual and editorial guardrails

One practising veterinarian informed the work. Thirty seconds is an input constraint, never a measured saving. All patient, clinical and financial interface data are synthetic. Public copy describes demonstrated design/implementation, with no adoption, business results, new interview counts, clinical certification or security enforcement claim. These are role-specific views in a browser-local prototype, not verified backend access control. Main English prose aims at roughly 300–500 words; the natural RU equivalent uses the same evidence and structure. Outcome differentiates implemented flows from measured clinic impact. Independent acceptance remains open.
