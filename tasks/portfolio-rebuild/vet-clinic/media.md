# Media inventory · selection before capture, final registry below

Each actual capture is registered in captures.json with SHA256, route, locale, fixture, viewport/DPR and dimensions. Source files/build identity in source-verification.json. Own product design/demo data; no competitor assets in public. Sources are read only.

| ID | File / source | Locale · fixture · viewport/DPR | Purpose / new capture |
|---|---|---|---|
| vet-cover | public/media/case-vet{,-ru}/visit-quick-trace.webp, shoot-vet-frames 13.09 | EN/RU seed Marsik 4.8/0.95, viewer 1680x1000 DPR1.5, full .device | Reuse full tablet composition; current clinical UI matches. New narrow 390 capture required |
| vet-queue | public/media/case-vet{,-ru}/cover/vet-day-queue.webp | EN/RU seed, 1440x900 DPR1.5 | Reuse dense queue as contextual supporting scene; no reshoot whole product |
| vet-trace | new rebuild/vet-clinic/trace-{locale}-{wide,narrow}.webp | Marsik 4.9 saved 09:12, real record facts/services | New agreed fixture, central scene, true tablet/narrow DOM |
| vet-invoice | new invoice-{locale}-{wide,narrow}.webp | Same services, invoice unpaid, desktop 1440 / narrow390 DPR2 | New whole invoice document incl payer/total/action, same patient |
| vet-owner | new owner-{locale}.webp | Same publication v1 09:13, plan 7 days, phone390 DPR2 | New full meaningful phone panel; no invented device skin |
| vet-boundaries | draft/saved/publication-{locale}-{wide,narrow}.webp | draft4.9 stored4.8; saved4.9; plan10 days with published7 | New full status/action panels for states, counterpart locale |
| vet-role-flow | src/data/diagrams/vet-clinic/role-flow.ts | One EN/RU geometry, desktop/mobile | New editorial drawing per HA-FLOW-01; no raster competitor copy |
| vet-central-recording | tasks/portfolio-rebuild/vet-clinic/motion/central.* | EN1440 full scroll through own central scene | New browser recording after static review; not source research or performance benchmark |

Current source EN/RU localization is accepted; no stale “English only” statement. UI text remains its actual localized DOM. Product fonts/colors retained in images. Existing dose clip is reserved: it explains arithmetic, not role transfer, so not added to main narrative.

Final registry: captures.json contains32 files (28 new DOM captures/collages +4 reused accepted images), about2.40MB total public payload. Every file has SHA256, locale, fixture and provenance; new files also list source route, viewport, DPR and dimensions. Cover and queue reuse entries name their original file rather than inventing a new capture session.

Final selection adjustments are in artifact-plan.md: real narrow queue group, selected mobile weight/dose/actions; trace1024/390; whole invoice1440/390; selected owner phone details on wide and complete owner view on narrow. Publication wide keeps actual status, warning and whole action bar; narrow keeps the complete source panel. Product values are unchanged. Editorial gaps only separate intact DOM sections.

source-verification.json records current source-file hashes and observed accepted build assets independently. scope.json rechecks source Git state, those hashes and all32 exported media. Browser views emulate devices in one browser-local model; no hardware study or cross-device sync is implied.
