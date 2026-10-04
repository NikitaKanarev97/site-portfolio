# Vet Clinic OS · передача D · 04.10.2026

Полный EN/RU preview готов к интеграционной приёмке. История одного визита связывает сохранённый след врача, счёт регистратуры и опубликованный документ владельца. Статус концепта виден в начале; результаты внедрения и клинической проверки не заявлены.

Checkout: `C:/Users/kanar/.codex/worktrees/vet-clinic-rebuild/Site-portfolio`.
Branch: `codex/vet-clinic-rebuild-2026-10-04`.
Base: `58002c398c3386c9df4b398f324ab07115c979f7`.
Точный итоговый commit ref передан в финальном ответе чата; в этом checkout его возвращает `git rev-parse HEAD`.

- [EN preview](http://127.0.0.1:4366/preview/vet-clinic-rebuild/en/)
- [RU preview](http://127.0.0.1:4366/preview/vet-clinic-rebuild/ru/)
- [Запись центральной сцены](motion/central.mp4): 16.87s, 440876 bytes, реальные wheel-переходы вперёд и назад. Исходный WebM и [таймлайн](motion/timeline.json) сохранены.

## Состав и область изменений

| Файл / область | Результат |
|---|---|
| `src/copy/cases/vet-clinic.ts` | `makeVetStory(lang)` и `vetClinicStory`; исторический public export сохранён |
| `src/copy/ru/cases/vet-clinic.ts` | `vetClinicStoryRu` + `assertStoryPair`; исторический export сохранён |
| `src/data/diagrams/vet-clinic/role-flow.ts` | Один flow с реальным условием публикации, ветвями и зонами ролей; отдельная mobile geometry |
| `public/media/rebuild/vet-clinic/` | 32 зарегистрированных изображения: 28 новых DOM capture/выборок, четыре переиспользованных; около 2.40 MB |
| `src/pages/preview/vet-clinic-rebuild/[locale].astro` | Два preview, native locale links, noindex, без canonical/sitemap |
| `ds/screens/case-vet.md` | Новая карта композиции; прежняя public-карта отмечена исторической |
| `tasks/portfolio-rebuild/vet-clinic/` | Паспорта, источники, медиа, фикстуры, проверки, кадры, запись и этот отчёт |

Пять блоков: ограничение окна → role-flow → три представления одного визита → границы сохранения/публикации → проверяемый итог и цена решения. Бюджет по harmony: EN 339, RU 298 слов. Общий schema/renderer/DS/motion, registry, главная и штатные routes не изменены. Работа осталась в собственном worktree; push/deploy не выполнялись.

## Источники и границы доказательства

Read-only продукт: `D:/Claude-projects/Veterinary-clinic`, HEAD `78772df6735d90d3ba79704fe51bb225cd927ebf`; accepted clinical polish `c2a65cc`, 13.09.2026. Текущие ProductScreens, clinicData, clinical CSS и DS совпадают с принятой клинической ревизией. Позднее удалены landing/showcase и обновлена локализация маршрутов. Для capture обслуживался уже существующий accepted dist; новая сборка в продукте не создавалась. Хеши исходников и наблюдаемого dist записаны отдельно в [source-verification.json](source-verification.json).

Приоритет владельца сохранён: реальная клиника под NDA, доменный ввод одного практикующего врача, концепт не внедрён. Все демо-данные, включая имя клиники, пациентов и суммы, вымышлены. 30 секунд — исходное ограничение, не замер интерфейса. Данные живут в одном браузере; viewport показывает роли/адаптив, а не синхронизацию устройств.

Свежая цепочка: вес 4.9 кг сохранён в 09:12 → назначение 1.00 мл → опубликован план 7 дней в 09:13 → сохранена правка 10 дней → владелец по-прежнему видит 7. Отдельные EN 8 и RU 6 проверок прошли, ошибок страницы нет. RU план введён реальным действием по-русски; для изображений использована его сохранённая фикстура. Несохранённый вес 4.9 после reload возвращается к 4.8; явное Save сохраняет 4.9. Старое обещание буфера восстановления исключено. Снимок публикации заменяется целиком; прошлые версии не хранятся.

Реестр утверждений: [evidence.md](evidence.md). Выбор и происхождение медиа: [media.md](media.md), [captures.json](captures.json). Сумма 1500 — итог двух демо-услуг, не Impact.

## Сверка с конкретными эталонами

| Эталон | Сохранено / осознанная адаптация | Кадры |
|---|---|---|
| HA-FLOW-01, `ha-user-flow.png` | Шапка и линия; старт с чертой; белые шаги; контурные input/decision/flowLink; ответы на выходящих связях; ортогональные стрелки и возврат. Свои действия/условие, одна история; зоны ролей добавлены. Роли видны в настоящих узлах внутри рамок | `shots/{en,ru}-{1440,390}-role-boundaries.png` |
| Деталь HA-DS-01, `ha-component-library.png` | Крупные реальные состояния; одна фикстура и масштаб внутри draft/saved. Полная библиотека не копируется. Published показан независимой границей с behind warning и целыми действиями, в общем native CaseCarousel | `shots/{en,ru}-{1440,390}-save-is-not-publish.png`, исходные WebP |
| Центральная передача | Реальный tablet1024 trace, целый desktop invoice, phone390 owner. Отдельный narrow source UI; цельные поля/действия. Сведения из подкадровых подписей перенесены в абзацы шагов для целого текста при высоте 820 | `shots/{en,ru}-{1440,1024}-focus-{100,750,1250}.png` |

Выбранные DOM-фрагменты не перерисованы. Source Inter/JetBrains Mono, цвета и состояния сохранены. Паспорта до capture и уточнения выбора: [artifact-plan.md](artifact-plan.md). Cover seed 4.8/0.95 явно отличается от центрального fixture 4.9/1.00.

Посмотрены верх, середина, итог и полные страницы EN/RU на desktop/mobile. Итоговые обзоры: `shots/{en,ru}-{1440,390}-overview.png`; полные страницы и секции лежат рядом. Mobile flow выстроен вертикально; queue показывает целую группу пациентов в клинике; owner — полный кабинет. Invoice nativeWidth 640 устраняет flex-кроп без изменения общего компонента.

## Приёмка

| Проверка | Результат / подтверждение |
|---|---|
| `npm run check` | 0 errors, 0 warnings; 101 existing hints · check.log |
| `npm run build` | 30 страниц · build.log |
| Scoped CSS, включая оба preview | 0 мёртвых правил · css.log |
| Harmony, EN/RU ×1440/1024/390/360, высоты900/600 | PASS · harmony.log, harmony-short.log |
| Browser matrix: EN/RU ×4 widths ×full/reduce/no-JS/short | 32 профиля, failures 0 · verification.json; нет overflow, broken media или page errors |
| Focus geometry: EN/RU ×1440/1024 ×900/820 ×3 остановки | 24 проверки, failures 0; натуральные пропорции изображений сохранены · focus-geometry.json |
| Lifecycle | Forward/reverse и быстрый wheel; resize; live reduce/full; Next/Back/Forward; одна central pin после возврата; mobile locale link · verification.json |
| Native fallback | Все три представления в потоке; все три состояния доступны в горизонтальной ленте; no-JS ArrowRight/wheel и Next/Back · verification.json, `shots/{en,ru}-360-no-js.png` |
| CaseNext | Hover/focus не останавливают строку; offscreen/reduce останавливают · extras.json |
| Демо EN/RU | HTTP 200 на обоих адресах · extras.json; свежая клиническая цепочка проверялась локально |
| Заморозка и provenance | 585 frozen files неизменны; token/motion mirrors равны; source HEAD/status/hashes и 32 media hashes совпадают · scope.json |

Headless Chromium при переключении страниц оставляет `document.visibilityState=visible`. Реальный focus/blur выполнен; пауза скрытой вкладки отдельным фактом приёмки не объявляется. CPU benchmark не проводился. Запись и encoding выполнялись отдельно от таких замеров.

## Пакет интегратору

Новый renderer может подключить экспорты `vetClinicStory` / `vetClinicStoryRu` из существующих copy-файлов и сохранить текущий native Next на Pawly. Registry, публичные routes, порядок кейсов и главная остаются областью G.

Блокирующих общих запросов нет. [D-G-01](common-requests.md) — необязательные заголовки group-рамок: frozen DiagramCanvas рисует только рамки. Сейчас роли читаются внутри реальных узлов; отдельные фиктивные header nodes не добавлены. Публичная интеграция и координационная приёмка этой версией не выполнялись.

Повторный preview из этого checkout:

```powershell
npm run build
npm run preview -- --host 127.0.0.1 --port 4366
```

Проверки воспроизводятся скриптами в этой папке. Для source capture сначала запустить `source-server.mjs`, затем `source-ru.mjs`, затем `capture.mjs`; источник должен сохранять записанный HEAD/accepted dist. Проверяющие скрипты используют уже установленный Playwright соседнего `b2b-dssl`, без изменения зависимостей портфолио.

## Capture delta после 4919971 · 04.10.2026

Исправлена съёмка мобильной ленты. Прогрев через `scrollIntoViewIfNeeded()` мог оставить её между панелями, а element screenshot — повторно сдвинуть. `visual.mjs --mobile-carousel-only` теперь прогревает ленту отдельно, возвращает её к нужной нативной остановке и ждёт восемь стабильных animation frames. В no-JS Chromium RAF callbacks не выполняются: там положение проверяется восемью внешними чтениями layout с интервалом 20 ms.

Пересняты только затронутые EN/RU `390-full`, `390-overview` и `390-save-is-not-publish`; кадр главы вырезан из того же full-page bitmap. Перед и после съёмки full-page подтверждены `scrollLeft=0`, index `1`, целая первая панель. Добавлены отдельные viewport-кадры `shots/{en,ru}-390-save-is-not-publish-{draft,saved,published}.png` при 390×900. Все шесть новых кадров, обе главы и оба full/overview открыты и визуально проверены: материал и подпись текущей панели целиком видны; соседний край соответствует нативной ленте.

[carousel-handoff.json](carousel-handoff.json) содержит фактические координаты до/после съёмки и узкую проверку EN/RU × normal/reduce/no-JS: шесть профилей, три остановки в каждом, failures/page errors 0. `scrollLeft` — `0 / 325 / 585`; JS index — `1 / 2 / 3`, в no-JS счётчик скрыт. Снимки draft/saved имеют x≈24…325, published — x≈89…390; изображения загружены, подписи внутри viewport.

Story, общий renderer/DS, public media, продукт-источник и STATE не изменены. Build/check/harmony и клиническая цепочка повторно не запускались: их результаты выше относятся к реализации `4919971ab2a75135fd4efa4a332a998eed292c0f`. D-G-01 остаётся необязательным. Delta сохранена отдельным локальным коммитом после этой реализации; push/deploy не выполнялись.
