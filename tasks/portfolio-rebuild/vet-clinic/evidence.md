# Evidence · Vet Clinic OS

Source root D:/Claude-projects/Veterinary-clinic; HEAD 78772df6735d90d3ba79704fe51bb225cd927ebf, clean on intake and final verification. Accepted clinical code c2a65cc, 13.09.2026; later landing/showcase removal preserved. Base portfolio 58002c3. The existing accepted dist was served read only: no install, build or source writes. Current ProductScreens, clinicData, clinical CSS and DS match the accepted clinical revision; subsequent localization changes remove showcase/landing phrases and change the route guard. Source/current build hashes are recorded separately, without pretending a new build was made.

| ID | Claim / EN → RU | Type | Version / source | Boundary |
|---|---|---|---|---|
| vet-concept | Concept; not deployed in a clinic / Концепт; в клинике не внедрён | owner fact | Current public case-vet.md, owner decision 25.08.2026 | Real clinic under NDA; demonstration data and Lesnaya Clinic are invented |
| vet-domain | Conversations with one practising vet / Разговоры с одним практикующим врачом | owner fact | Current case map, header team | Domain input, no research team or representative study. Conflicts with old synthetic briefing/CLAUDE.md; owner fact wins |
| vet-window | Thirty seconds was the design constraint / Тридцать секунд — исходное ограничение | contextual brief | Existing owner-approved narrative / case-plan §4 | No measured new completion speed, adoption or clinical validation |
| vet-trace | Explicit Save writes the patient’s weight and trace / Явное сохранение пишет вес и след пациента | demo / code | ProductScreens VisitQuickTrace, clinicData per-patient storage | Browser localStorage only; no shared backend or cross-device sync |
| vet-roles | Invoice reads services, owner reads published snapshot / Счёт читает услуги, владелец — опубликованный снимок | demo / code | VisitRecord, InvoiceDraft, DischargePreview, useOwnerPet | Clinical/private fields excluded from invoice/owner, no authentication security claim |
| vet-publication | Saved edits do not rewrite published content / Сохранённые правки не переписывают опубликованное | demo / QA | 07-acceptance §2.1, PublishedDischarge content/revision | Current snapshot replaces previous; full version history not stored; no messages sent |
| vet-draft | Unsaved form edits disappear on reload / Несохранённые правки теряются при перезагрузке | code + fresh action verification | useState(stored); source-chain.json + source-chain-ru.json: 4.9 form returns to4.8 after reload; explicit Save persists4.9 | Old flow’s local buffer is a design intention, not implemented protection; do not imply recovery |
| vet-outcome | A working prototype separates record, billing and publication / Рабочий прототип разделяет запись, счёт и публикацию | qualitative deliverable | Accepted polish + fresh demo chain | Three viewports emulate devices; one physician input; not human outcome or medical safety |

Medical values are seed examples, not treatment advice. Engineering acceptance counts are not headline product impact. Original Figma is historical and has reverse-sync debt; current source DOM controls are used.

Fresh source checks: EN8 + RU6 pass, no page errors. Both publish plan7, save plan10 later and keep owner plan7. RU text is entered through the actual Russian form, then its real stored fixture is used for RU media. The bill is unpaid, with two seed services at900+600; 1500 is a demo total, not product impact. Captures and browser verification do not replace human research or clinical validation.

## Mobile capture correction · 04.10.2026

Capture-only delta after implementation `4919971ab2a75135fd4efa4a332a998eed292c0f`. The previous mobile chapter screenshot could show a track left between slides by image warm-up or element capture. The corrected script warms the carousel separately, selects the native stop, waits for stable layout/paint, takes viewport shots, and crops the chapter from the same full-page bitmap. Full/overview capture records first-stop `scrollLeft=0`, index `1`, before and after.

Six readable EN/RU draft/saved/published shots at 390×900 were opened and visually checked alongside the corrected chapters/full/overviews. [carousel-handoff.json](carousel-handoff.json) records six narrow normal/reduce/no-JS profiles, all three stops at `0 / 325 / 585`, loaded images and whole current image/caption, zero failures/page errors. JS counters read `1 / 2 / 3`; no-JS hides the counter and uses external layout polling because Chromium blocks RAF callbacks. These are screenshot handoff checks; story/product/source/STATE are unchanged. Earlier build/check/harmony and clinical verification were not rerun for this delta.
