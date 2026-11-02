# Pawly Home cover V1: benchmark

This compares the shipped cover with the references in [`../references/RESEARCH.md`](../references/RESEARCH.md), section by section. It is self-assessment for the independent reviewer, not acceptance.

**Boards**
- [`comparisons/benchmark-external.jpg`](comparisons/benchmark-external.jpg): R2 Rover, R3 Wag and Pawly at 1440
- [`comparisons/benchmark-mobile.jpg`](comparisons/benchmark-mobile.jpg): R2, R3, Pawly EN 390 and RU 360
- [`comparisons/benchmark-sources.jpg`](comparisons/benchmark-sources.jpg): S1–S4 beside fresh `main` captures
- [`comparisons/peers-en-1440.jpg`](comparisons/peers-en-1440.jpg) and [`peers-en-390.jpg`](comparisons/peers-en-390.jpg): all five Home covers

**What could not be reproduced on a board.** R1 (the Rover product image) refuses non-browser requests with 403. A browser fetch with a spoofed user agent was blocked by the session's safety policy, and I did not try to get around it. R4–R6 (SCRN) need the SCRN connector, which is not authorized in this session. Those comparisons rely on the images the research pack describes and links, not on side-by-side pixels here.

## 1. Lead image: R6 Airbnb (photo-first), BEFORE, S1 return photo

| | R6 Airbnb trip entry | BEFORE | AFTER |
|---|---|---|---|
| Subject | One confident photograph as the entry point | The same frame, plus a baked "…14:51" strip | The product's own uncaptioned frame. Dog's eyes and walker's face are visible at every width (16:10 on mobile, row-filling on desktop) |
| Role | Decorative and aspirational | "Lifestyle" image, but its caption contradicted the 14:52 record | **The evidence itself**, captioned "The return photo at 14:52 — the proof behind 'Baikal is home'" |
| Desktop share | Image-dominant | 832 px photo, with a 300 px dead band under it | 682 × 504 photo (60%), bottom-aligned with the record. No dead band |

**Adapted:** photo-first confidence, one image, generous radius, no overlay text.
**Not copied:** listing, price and discovery chrome, and any marketing headline over the photo.
**Gap:** Airbnb photography is shot and served at retina resolution. The only available frame is 800 × 597, so on a 2× display at 1440 it renders at ~0.59 device px per needed px and looks soft. BEFORE had the same limit. No higher-resolution original exists in `pawly@a327d73`.

## 2. Service record: R3 Wag report card, R5 InDrive completed ride, S1/S2

| | R3 Wag report card | R5 InDrive completed ride | AFTER (S1/S2 hero card) |
|---|---|---|---|
| Primary fact | Photo + icon badges (distance, poo, pee, door) | Completed status, then route and timestamps | **"Return confirmed" chip → "Baikal is home" → "Back at 14:52, confirmed by the return photo."** |
| Evidence | One photo, free-text note | Map, milestones | **Two dated handover photos:** Pickup 14:05 and Return 14:52, each with a check |
| Person | Walker avatar | Driver row | Marina K., "Your walker" |
| Noise | Five equal badges plus emoji | Fare, rating | None: payment, review, route and dock are cropped out |

**Adapted:** photos and timestamps together form a credible after-service record (R3), and a completed service reads as status first, then dated milestones (R5).
**Not copied:** Wag's badge row, pee/poo logging, tips and 2018 styling, and InDrive's map, fare and ratings. Pawly implements none of these as proof.
**At or above the benchmark:** for this one question ("is my dog home, and how do I know?") the Pawly card is clearer than R3. It gives one status, one time, and two photos that each carry a time. That comes from the product (Order Details V1.1), not from the cover.

## 3. Status chronology: R1/R2 Rover walk map and timing

| | R2 Rover | AFTER |
|---|---|---|
| Time | `Today 12:00 → Today 12:31` and total 1.1 mi / 30 min | Header "22 August · 45 min", Pickup 14:05, Return 14:52 |
| Map | Live GPS route | **Not shown.** Pawly's route is a static illustration ("Not a GPS track"), and the crop excludes it |

**Adapted:** a single walk record with plain, dated start and end.
**Not copied:** the map, distance and anything that implies live tracking. Rover green.
**Gap:** Rover's map gives a strong at-a-glance "proof of activity" visual that Pawly truthfully lacks. The cover makes up for it with photographs, not invented telemetry.

## 4. Mobile composition: R4 4 Лапы (SCRN), R5, BEFORE

| | BEFORE 390 | AFTER 390 | AFTER 360 |
|---|---|---|---|
| Card height | 1398 px (EN), 1430 (RU) | **926** (EN), **948** (RU) | **871** (EN), **920** (RU) |
| Order | Photo → caption → full old report with payment, receipt and review | Photo (16:10) → causal caption → status card | Same |
| Screenshot scale vs native 358 px card | Old full report, 342 × 807 px (0.88 of its 390 px capture) | **0.89**: body ≈13.3 px, headline ≈19.6 px | **0.80**: body ≈12 px, chip ≈11 px |
| First scan | Photo, then a document | Photo, then "Baikal is home", with the full card inside one 390 × 844 viewport ([board](comparisons/viewport-en-390.jpg)) | Card visible down to the walker row |

**Adapted:** a calm single column with one primary surface (R4) and status first (R5).
**Not copied:** 4 Лапы's accordions and insurance/vet services, or any phone bezel or device mock-up.
**Gap:** at 360 px the screenshot's smallest labels are about 11 px. They are readable but at the lower edge, below SCRN-native 1:1 legibility. Going larger would require dropping the stage inset entirely or re-rendering the product at 360. Re-rendering would no longer be an untouched excerpt of the 390 layout, so I did not do it.

## 5. Distinctness from the four B2B and clinical covers

[`peers-en-1440.jpg`](comparisons/peers-en-1440.jpg) and [`peers-en-390.jpg`](comparisons/peers-en-390.jpg): Agent Ops (graphite), Partner Portal (cool UI panels), TRASSIR Learn (navy) and Vet (sage UI) are all interface-led. Pawly is the only cover led by a photograph of a real dog and a person, on the warm `--surface-cover-pawly` sand that already exists, with a consumer card rather than a dense form. It shares their 16 px radii, stage inset, caption style and footer, so it stays in the same system.

## 6. Genuine product evidence S1–S4

| Ref | Used? | Why |
|---|---|---|
| S1 / S2 Order Details completed | **Yes**, hero card only | The one state that shows a *confirmed* return with photo proof. The crop is pixel-identical to S1 (EN). RU uses the current `main` label «Возврат» (S2 is one word stale, see PROVENANCE) |
| S3 Active Service walking | Tested as B, rejected | Truthful, but the outcome is not yet confirmed. Details in REPORT §A/B |
| S4 Walker Profile | No | Identity and "7 of 7 checks" are not return evidence. Adding them would invite a safety-guarantee reading |

## Honest overall position

- **At the benchmark:** the clarity of the record (one status, one time, two dated photos), truthfulness, the photo-to-evidence link, mobile compactness at 390, and distinctness from the peers.
- **Below the benchmark:** image sharpness on 2× screens (photo 800 px wide, record 716 px wide, shown at 682 and 454 CSS px). Label size at 360 (≈11 px). The duplicated return frame (large photo plus a 140 px thumbnail): the caption explains it as cause and effect, but a reviewer may still read it as repetition. There is also no motion or interaction storytelling of the kind Rover's map or Airbnb's transitions offer. The cover is a still excerpt.
