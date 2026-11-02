# Pawly Portfolio Case V2 — Independent Research & Reference Pack
Date: 2026-11-02. **Research only. No case implementation, merge, deployment or Figma edits.**

## Frozen sources / branch strategy
- Portfolio research base: `b3249e642a7143d5d5251a412e79c9481532a2a1` (accepted Pawly Home Cover V1, branch `claude/pawly-home-cover-premium-v1-2026-11-02`). Research branch `research/pawly-portfolio-case-v2-2026-11-02`.
- Pawly product: `NikitaKanarev97/pawly`, `main` at `a327d73abb3e7872a6243301afc926de57dc868b` (current published demo; private repo). Verify no source movement before capturing.
- Accepted adjacent case visual benchmarks: Agent Ops V3 branch `redesign/agent-ops-portfolio-premium-v3` @ `dd717b0`; B2B V3.1 @ `085e7e0`; TRASSIR Learn V3.1 @ `cbd12eb7`. Vet Case V3 is **in progress separately**. These are references, **not necessarily merged** into portfolio `main`. Inspect branch graph; do not overwrite them.
- Existing case source: `src/copy/cases/pawly.ts` (`createPawlyStory()`), RU counterpart `src/copy/ru/cases/pawly.ts`, `src/components/CaseStory.astro`, `src/pages/work/[slug].astro`. No separate Pawly V2 renderer yet.

## Independently verified BEFORE problem
At portfolio `main`, `public/media/rebuild/pawly/en/active-service.webp` begins with the sample route map and `order-details.webp` still shows old "Return confirmed" arrangement. `walker-profile.webp` uses an older hierarchy. They do not match newer Pawly application evidence:
- `pawly/audit/pawly-order-details-premium-v1/v1.1/after/completed-en-390-fold.png`: new "Baikal is home" with two large dated handover photos.
- `pawly/audit/pawly-active-service-premium-v1/v1.1/after/`: status-first, different states and scroll behavior.
- `pawly/audit/pawly-walker-profile-premium-v1/v1.1/REPORT.md`: identity/compatibility/verification hierarchy.
The current `createPawlyStory` uses 3 old screens in its cover, a short compatibility carousel, expected/selected/confirmed sequence, tiny state specimens and a walker earnings section. Conceptually reasonable but image fidelity, composition, states, and owner/walker interaction need renewed product capture and visual storytelling. Avoid copying the accepted Home cover as the case hero unchanged; use it as a continuity motif and reveal different chapter detail.

## Source-of-truth product evidence, not marketing claims
- `pawly/audit/pawly-walker-list-premium-v1/v1.1/REPORT.md`: coverage then dog needs, human suitability and time-slot checks; changing time cannot waive risks. No fabricated reviews/credentials.
- `pawly/audit/pawly-walker-profile-premium-v1/v1.1/REPORT.md`: needs vs recorded handling limits; seven dated checks distinct from professional safety guarantees.
- `pawly/audit/pawly-booking-review-v1/v1.2/REPORT.md`: conditions/price/cancellation before confirmation; exactly 2h cutoff is in the 50% tier; no real payment.
- `pawly/audit/pawly-active-service-premium-v1/v1.1/`: status, expected return, photo receipt, no live GPS claim; unavailable/replacement/cancelled branches differ.
- `pawly/audit/pawly-walker-active-order-v1/v1.2/REPORT.md`: home access codes gated by pre-pickup checks, disabled before pickup; client-only demonstration, not production-grade server authorization.
- `pawly/audit/pawly-replacement-offer-premium-v1/v1.2/REPORT.md`: declining/expiry never invents a replacement; assigned/accepted states stay distinct; 60-second reserve deadline with explicit choice.
- `pawly/audit/pawly-handover-photo-v1/v1.1/REPORT.md`: "Sending failed · Photo saved"; selected photo is not sent; recovery; complete photo, no headless crop.
- `pawly/audit/pawly-order-details-premium-v1/v1.1/REPORT.md`: "Baikal is home" only when return received; review saved in demo, not published/sent; "Booking total" not "Funds on hold"; post-pickup cancellation has unresolved contact/support dependency.
- Current `pawly/src/data/` and `src/screens/` override historical screenshots/documentation where conflicting. Review both owner and walker roles.
- 950 ₽ owner walk, 171 ₽ illustrative platform fee (18%), 779 ₽ walker net; avoid suggesting actual money moved or real pay-outs. All people, checks, amounts, route, photos and operational outcomes are demonstration data; no real user research or safety proof.

## Story thesis and visual architecture
**Trust is not a badge. It is a sequence of confirmed actions.**
Core question: "What does the owner know before handing over the dog, what must the walker do, and which proof closes the loop?" Narrative is one walk, with two parties and distinct stages:
1. Situation/reframe: a dog, sometimes house keys, and owner not present; do not present this as a generic Uber marketplace.
2. BEFORE/decision: coverage + dog needs before matching; verified record != suitability. Walker List + Profile + Booking Review; show a negative gate/trade-off.
3. Owner/walker handoff: two roles see one booking, but their information priorities differ. Owner Active Service / Walker Active Order; home access is not shown before permitted; no fake messaging.
4. Failure/replacement: one real exceptional decision, e.g. declined reserve or photo sending failure; choose based on capture quality and product truth. Explicitly show that the service cannot silently reassign a walker.
5. Climax: selected photo -> sending -> confirmed return (or failed saved locally) -> owner Order Details with 14:05 pickup and 14:52 return, with the exact same fixture/time. The photo should anchor the story, not serve as decoration.
6. System + other side: a selected handful of PhotoProof, TimelineRow, status/dock components; a brief money/settlement paragraph only if needed to prove cross-role consistency.
7. Outcome: what the functional prototype demonstrates vs what remains untested. No invented interviews, live GPS, transactions, insurance, guaranteed replacements, reviews published or commercial KPIs.

Plan about **5–6 meaningful visual chapters**, not every application route. Target concise editorial copy (approx 300–500 EN words as direction, not an excuse to omit crucial provenance). No repeated hero/gallery/collage patterns.

## Opened saved visual benchmarks: exact screenshot, pattern, adaptation, non-goal
| Ref | Existing screenshot in portfolio repo | Strong pattern / UX problem solved | Adapt | Do not copy |
|---|---|---|---|---|
| H1 | `research/portfolio-benchmark/case-blueprint/img/ha-phones.jpg` | Three readable actual mobile screens with labels, unified stage, consistent scale | 2–3 screens in **one key Pawly chapter** where they tell sequential stages | Phone bezels everywhere, tiny screens on mobile |
| H2 | `research/portfolio-benchmark/case-blueprint/img/ha-components.jpg` and `research/portfolio-rebuild-2026-10-03/references/ha-component-library.png` | Authentic varied states + typography and clear grouping | PhotoProof/TimelineRow/critical state slices with real code provenance | Massive decorative library or fake "Figma design" |
| H3 | `research/portfolio-benchmark/case-blueprint/img/ha-sketch.jpg` | Distinct artefact texture/visual rhythm | Use genuine existing sketches/flows only if provenance confirmed | Fabricating historical Pawly sketches |
| H4 | `research/portfolio-benchmark/case-blueprint/img/np-hand.jpg` | Human context: mobile screen held in a real setting | At most one honest device-in-context composition when visual/rights allow | Photoshopped as if historical Pawly user testing |
| H5 | `research/portfolio-benchmark/case-blueprint/img/dn-diag.jpg` | Concrete diagnosis tied to a visible frame | Show problem → changed decision/evidence in an exact Pawly scenario | Generic coloured issue boxes or inventing BEFORE evidence |
| H6 | `research/portfolio-benchmark/case-blueprint/img/gr-comp.jpg` | Single clear thesis + readable mobile row | Editorial split heading then strong evidence visual | Six tiny Pawly screens side by side |
| H7 | `research/portfolio-benchmark/case-blueprint/img/tr-quote.jpg` | Editorial/lifestyle visual interlude, large media surfaces | One photo-led narrative break using genuine dog/handover imagery | Decorative photo grid, irrelevant testimonial |
| HC | `audit/pawly-home-cover-premium-v1/v1/comparisons/peers-en-1440.jpg` on cover branch `b3249e6` | Same site family, Pawly uniquely warm/photo-first while other 4 are UI-first | Preserve shared type/grid/caption/radii; differentiate consumer emotion | Alter accepted Homepage cover or duplicate its exact composition everywhere |

## Actual mobile-app references inspected (SCRN)
- `Yandex Go → Completing the trip`: https://scrn.gallery/app/yandex-go?tab=flows&flow=68934dd10e5c5c492a0bb82a . Opened screen `689334af0e5c5c492a0ae272` (map + state/action), and `689334b30e5c5c492a0ae2a4` (completed sheet). Adapt status/step chronology and single dominant action; do not pretend Pawly has actual GPS/trip telemetry.
- `Yandex Eats → Rating the courier and tipping`: https://scrn.gallery/app/yandex-eats?tab=flows&flow=6a5e3e8c19885457539ca99e . Opened screen `6a5e3dbc19885457539ca550`: post-service action hierarchy. Pawly reviews are only saved locally; **do not** describe sending/publishing/tipping.
- `4 Лапы → Питомец`: https://scrn.gallery/app/4lapy?tab=flows&flow=689b8c3dc242192416697086 . Opened screen `689a30e8c2421924166294e6`: light consumer card rhythm, pet context and service discovery. Do not import its medical/insurance services.
- SCRN references above were visually opened through the connector, **not copied as image files into this repo**; use links/IDs and only make local screenshots where authorized.

## Real category competitors (public documentation, verified 2026-11-02)
- Rover Cards: https://support.rover.com/hc/en-us/articles/211573246-What-are-Rover-Cards-and-how-do-I-send-them ; map privacy: https://support.rover.com/hc/en-us/articles/211587446-How-does-the-dog-walking-map-feature-work . They distinguish walk report, timestamp/photo and route. Crucial: even Rover docs say map is **not live tracking**; do not imply Pawly implements it.
- Wag! Report Card: https://support.wagwalking.com/en_us/service-report-card-S1rkYA7A and latest caregiver instructions https://support.wagwalking.com/en_us/how-do-i-fill-out-my-report-cards-pcg-r1cnQDA4c . The report card is an after-service accountability mechanism. Pawly's honest differentiation: exact return-photo state rather than unimplemented route/distance/poo/pee/insurance.
- Existing captured competitor comparison: `audit/pawly-home-cover-premium-v1/v1/comparisons/benchmark-external.jpg` on cover branch `b3249e6`. It juxtaposes actual Rover report, Wag report and Pawly accepted cover.

## Mapping: chapter → screen evidence → reference → visual treatment
| Chapter | Real Pawly evidence | References | Preferred treatment |
|---|---|---|---|
| Hero | Current Order Details "Baikal is home", actual return-photo asset | HC, H7, Wag | Different from Home cover: editorial product promise + decisive evidence, readable 390px evidence; photo with consistent 14:52 |
| 01 Situation | Existing PRD / owner context; no invented research | H4, H7 | Light photographic opening, short line of risk/context |
| 02 Compatibility | Walker List + Profile + Booking Review / blocked state | H1, H5, 4 Лапы | Guided 2-3 stage sequence; don't relegate key info to tiny carousel |
| 03 During | Owner Active Service + Walker Active Order | H1, Yandex Go | Role comparison (who needs to know what) with readable status, time and next action |
| 04 Failure | Replacement Offer or failed Photo Handover | H5, Yandex Go | Small branching decision, visually show failed vs successfully recovered state |
| 05 Proof | Photo selected → sent → Return confirmed 14:52 → Order Details | HC, Rover, Wag | Signature photographic and phone sequence with correct source geometry |
| 06 System/outcome | Real PhotoProof/TimelineRow states, synthetic QA, payout optional | H2, H6 | Compact authentic specimen + evidence/trade-off ending; no fake KPI |

## Hard visual/capture rules learned from the accepted B2B V3.1 and Pawly Home Cover
- Never crop through text, buttons, photos, status chips, shadows or rounded corners. A DOM element capture of a rounded card contains **rectangular** underlying corner pixels; include actual parent background/inset and assert consistent edges. No fake masks, CSS overlays, manual retouching.
- Archive original full-frame captures plus every crop rectangle, dimensions, DPR, source SHA and descriptive alt text. Screen bounds/crop must be reproducible by script.
- Protect faces, dogs, leashes, captions and subject anatomy: choose crop from actual media, not `object-fit: cover` guesswork. Do not enlarge low-res images above honest effective resolution.
- Preserve visual separation of screenshot vs caption, container inner padding vs outer gutters. Establish shared edge/grid anchors; audit all nested frames for double outlines, stray stripes, grey gutters, mismatched radii, and 1px thickness mismatch.
- Phone screen text must remain legible at 1440 **and at 390/360/320**. Prefer one native-width phone and scroll/step reveal over three illegible miniatures. No sideways scroll without visible/accessible cue.
- Mobile first viewport should reveal actual product behavior rather than only intro text; height and fold audited at each width. Keep focus-visible, no-JS/reduced-motion support and localized RU.
- Use **only** genuine source screenshots/fixtures; retain exact time and data parity across related slides. The two different demo clock contexts (14:05/14:52 vs 16:35/17:22) must never appear as one seamless walk.
- Actual screenshot capture and baseline QA required. Incomplete media, wrong data, microtype and unclipped device content block acceptance. Source UI changes require separate explicit scope and source-side tests, not merely painting over portfolio images.

## Open issues / honesty
- Pawly product repository is private; public case should not include dead GitHub links. Links for reviewers with permission may live in audit docs. The public CTA is `https://pawly-fawn.vercel.app/app`, check it is reachable and the state matches screenshots.
- The product is a **concept/demo**, not a commercial live dog-walking service; photos, qualifications, earnings and user identities are simulated/fixture-derived. No human validation established.
- Post-pickup cancellation without contact/support is unresolved. Product has a client-only home-access gate; don't represent it as actual safety/security certification.
- Do not change accepted Home cover, other cases, Figma, `main`, or production without approval.
