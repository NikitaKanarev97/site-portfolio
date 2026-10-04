# Learn · media inventory · 04.10.2026

Сначала просмотрены существующие `public/media/case-learn{,-ru}` и read-only product dist. Архив каталога переиспользуется побайтово. Длинные прежние full-page кадры не подходят центральной сцене: нужны целые текущие первые рабочие панели с собственным mobile DOM, один material ID. Продуктовые assets исходной сборки не переписываются.

| ID / файл в public/media/rebuild/learn | Источник / версия / locale / fixture | Viewport / DPR / назначение | Новый capture |
|---|---|---|---|
| archive / archive-catalog.webp | case-learn/before-catalog.webp = original images/default-pages/3.png; RU | Исходный размер; desktop + detail mobile | Нет, reuse |
| answer / answer-{desktop,mobile}.webp | Current accepted dist; /material/onvif-not-found?lang=en; anonymous | 1440×1000 / 390×844, DPR2; панель reference | Да, native DOM |
| programme / programme-{desktop,mobile}.webp | /player/puskonaladka/2?lang=en; state-marina-one; ONVIF completion unchanged | 1440×1000 / 390×844, DPR2; тот же материал в программе | Да, native DOM |
| cover-programme / cover-programme-{desktop,mobile}.webp | /trajectory/puskonaladka?lang=en; anon; паспорт программы | 1440×1000 / 390×844 DPR2; деталь обложки | Да |
| theme-{setup,project,handover,explore} | Accepted Storybook Card default in 4 contentMode; EN args: real trajectories title/result/unit count | 800×600 viewport; native Card 312 / 288 CSS px, DPR2; 2px alpha bleed | Да; fixture компонента, не текущий Home |
| trust / trust-{desktop,mobile}.webp | Current Material TrustHeader, EN; version TRASSIR OS 4.3, date, reading time | Compact native width 288 at source viewport 320×1000, DPR2; 576×164 | Да, один компактный контекст в обеих версиях |
| progress / progress-{desktop,mobile}.webp | Current Player ProgressMeter, EN; position 3/11 | Compact native 288 at source viewport 320×1000, DPR2; 576×74 | Да |
| assessment / assessment-{desktop,mobile}.webp | Current /assessment/intro?trajectoryId=proekt, EN; state-marina-ready | 1024 / 390×1000 source; whole introduction + rules, desktop native symmetric gutters, ends before additional bank section; DPR2 2048×1476 / 716×1684 | Да; title/notice/rules целиком, без обрезки action |
| landing / landing-{desktop,mobile}.webp | accepted public/prototypes/learn-landing, EN | 1440 / 390 DPR2; first composition with native actions intact | Да |

UI-кадры сохраняют EN исходника в обеих локалях рассказа; переводится surrounding narrative/alt, geometry не дублируется. Права: собственные материалы автора/портфолио, демонстрационные технические тексты и иллюстрации. Reference HA остаётся в research, не public. Каталожные captures alpha с 2 CSS px bleed, родные контуры полностью сохранены. Onest Bold для foundation — побайтовая копия `landing/app/public/fonts/onest-bold.woff2` из существующего продукта, не новый набор; Golos/Mono остаются в реальных product captures.

Дополнительная съёмка: `completion-{desktop,mobile}.webp` — настоящий конец того же ONVIF материала в Player, целые Back и Complete and continue. `cover-answer-*` — полные version/title/lead, 2000×456 / 716×666 DPR2. `cover-*` — два отдельных исходных фрагмента в общей прозрачной композиции при одинаковом масштабе/DPR, 2736×1100 desktop / 716×1670 mobile. UI не дорисован. Промежуточные `cover-answer-*`, `cover-programme-*` сохранены как provenance композиции.

Markdown wireframe `ia/wireframes/materialpage.md` прочитан как исторический источник решений. Изображения исторического wireframe не найдены; текущий high-fidelity Screen/MaterialPage не назван wireframe. По процессному правилу case-plan на страницу вынесены диагноз и новая карта; ни реконструкция, ни поддельный «оригинал» не добавлены.

Финальные размеры, URL, fixture, hashes и источник каждой съёмки — captures.json / source-verification.json. Portfolio shots/запись central scene — tasks/portfolio-rebuild/learn/shots и motion, отдельно от site assets. Воспроизведение capture: `capture.mjs` → `capture-cards.mjs` → `refine-captures.mjs`; последние два корректируют selected native geometry и заменяют предварительные assets/inventory entries.
