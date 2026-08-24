# Home

**Маршрут:** `/`
**Размер:** desktop 1440×3582 (одна длинная страница, высота — сумма секций)
**Назначение:** полный скрининговый пакет, кейс DSSL крупной подачей, перечень трёх проектов, Development-слой, короткий About, контакт
**Источник:** `ia/sitemap.md` · `outputs/prd.md` §5.1–5.5 · `ia/authorization-copy.md`

**Жёсткое ограничение экрана:** скрининговый пакет — роль · специализация · право на работу · CV · email · вход в кейс — целиком в первых **2160 px** (SCR-02, SCR-06). Ниже по секциям проставлена накопительная высота, чтобы линию 2160 было видно глазом.

---

## Секции (сверху вниз)

### Nav (72px высота, sticky) · 0 → 72
- Wordmark: `[Имя Фамилия]` — левый край, отступ 120px
- Пункты меню, правый край, gap 32: `Work` · `About` · `Contact`
- **Три пункта, не четыре.** PRD IA-05 называет четыре, включая `Development`, но маршрута `/development` в v1.0 нет — пункт появляется вместе с ним в v1.1 (`NavDevelopment [v2]` в sitemap). Пункт, ведущий в никуда, — сломанная навигация
- `Work` — якорь на `FeaturedCase`, `About` — маршрут `/about`, `Contact` — якорь на `ContactBlock`
- Skip-link — первый интерактивный элемент документа, визуально скрыт до фокуса

### Hero (1440×800, вертикальный, padding 120 по бокам / 160 сверху) · 72 → 872
- **H1, 64px:** `[Имя Фамилия]`
- **Роль, 28px:** `Product Designer` — без грейда, отдельной строкой
- **Специализация, одна формулировка, 20px, ширина ≤ 720px:**
  «I design B2B products where the hard part is the constraint, not the canvas — legacy systems, several roles on one dataset, decisions with a real price.»
- **HeroAuthorization, 16px, одна строка:**
  «Based in Kazakhstan · open to relocation with visa sponsorship, remote in the meantime.»
  Дословно из `ia/authorization-copy.md`. Одна строка на десктопе, максимум две на 360 px
- **Ряд действий (горизонтальный, gap 16), 96px ниже:**
  - Primary: `Read the case: B2B Partner Portal →` — это `HeroCaseEntry`, даёт вход в кейс ещё до обложки
  - Secondary: `Download CV (PDF)`
  - Secondary: `Copy email` — копирование в один клик (SCR-07)

> На линии 872 px скрининговый пакет закрыт полностью. Запас до 2160 — 1288 px.

### FeaturedCase (1440×900, вертикальный, padding 120 по бокам) · 872 → 1772
- Eyebrow, 14px: `Selected work`
- **Обложка-плейсхолдер 1200×560** — серый прямоугольник; кликабелен весь блок целиком
- **Заголовок, 40px:** `B2B Partner Portal — DSSL`
- **Строка исхода, 20px:** «Partners order without a manager — on top of a legacy system that could not be replaced.»
- **Мета одной строкой, 14px:** `Distributor partner portal, redesign · 2024–2025 · Product Designer · Web, desktop-first`
- CTA-строка: `Read the case →`
- **Крупный вес обложки обязателен.** Это единственная кликабельная работа v1; крупная подача без клика читается как сломанная ссылка (WRK-01)

> Вход в кейс попадает в первые 2160 px дважды: кнопкой в Hero (872) и обложкой (1772). Требование SCR-06 закрыто с запасом.

### WorksList (1440×570, вертикальный, padding 120 по бокам) · 1772 → 2342
- **Заголовок-утверждение, 32px:** «Three more projects. Their cases are not written yet.»
- Подзаголовок, 16px: «Listed with what they were and why they are not open. The first full case is above.»
- **Три строки в табличной логике, некликабельные** (WRK-02, WRK-05). Каждая строка — горизонтальный Auto Layout, разделитель сверху 1px:
  - Колонка 1 (320px): **название**
  - Колонка 2 (280px): **тип проекта словами и год** (WRK-03) — не тег, не иконка
  - Колонка 3 (200px): **роль**
  - Колонка 4 (всё оставшееся): **две строки** + **названная причина умолчания** отдельной строкой 14px

**Строка 1 — RowVetClinic**
`Vet Clinic OS` · `B2B SaaS for veterinary clinics, desktop-first, 2025` · `Product Designer`
«Several roles working on one dataset: reception, doctor, manager. Emergency intake and weight-based dosing — where a wrong number has a price.»
*Not open yet: the visual pass isn't finished. It follows DSSL, by the same template.*

**Строка 2 — RowPawly**
`Pawly` · `Mobile marketplace for dog walking, iOS / Android, 2024` · `Product Designer`
«End-to-end: brief, research, personas, PRD, design system, 33 React components in Storybook.»
*Not open yet: same reason — the visual pass is behind the rest of the work.*

**Строка 3 — RowRuun**
`RUUN` · `DTC e-commerce, handmade brand, product configurator, 2023` · `Product Designer`
«Brand, commerce and product customization in one scope, built around a strategic constraint the client could not remove.»
*Not open yet: the case needs a careful telling of that constraint, and that takes longer than a visual pass.*

- **Строки не ссылки и не должны выглядеть ссылками.** Ни стрелки, ни подчёркивания, ни подъёма на hover. Hover-превью строк — `[v2]`
- Замечание на будущее: в v1.1 строка `Vet Clinic OS` становится ссылкой на `/work/vet-clinic-os`, разметка самой строки при этом не меняется

### DevelopmentStrip (1440×380, вертикальный, padding 120 по бокам) · 2342 → 2722
- **Заголовок, 24px — заметно мельче заголовка WorksList:** `Webflow development`
- Одна строка контекста, 16px: «Sites built in Webflow to someone else's design. Listed for completeness — this is not product work.»
- **Четыре карточки в ряд, gap 24, каждая шириной 264px:**
  - Превью-плейсхолдер 264×140
  - Название: `Common` / `Synk` / `Scrib3` / `Bloomblex`
  - Подпись 12px: `Role: Webflow development` — **на уровне каждой карточки, а не одной строкой на секцию** (DEV-02)
  - Живая ссылка на сборку, открывается в новой вкладке (DEV-04)
- **Проверка веса (DEV-03).** Обложка кейса 1200×560 = 672 000 px². Четыре превью 264×140 = 147 840 px² — 22% от обложки, укладывается в ограничение «не более четверти». Если превью начнут расти при правках, это число пересчитывается, а не оценивается на глаз
- **Позиция: ниже всех блоков про работы.** Порядок из sitemap: `FeaturedCase → WorksList → DevelopmentStrip`

### AboutShort (1440×340, вертикальный, padding 120 по бокам) · 2722 → 3062
- Заголовок, 32px: «How I work»
- Абзац, 20px, ширина ≤ 720px, 3–4 строки: подход в общих чертах — переформулировка задачи до решения, работа в чужих ограничениях, ИИ в собственном процессе
- Ссылка: `More about how I work →` → `/about`
- **Портрета здесь нет** — он живёт на `/about` и не на первом экране

### ContactBlock (1440×400, вертикальный, padding 120 по бокам, выравнивание по центру) · 3062 → 3462
- Заголовок, 40px: «Let's talk»
- Одна строка, 18px: «If the case above answered your question — or raised one.»
- **Email крупно, 32px, копируется в один клик** (SCR-07)
  - `CopyEmailFeedback`: после клика рядом появляется `Copied` через `aria-live="polite"`; место под строку зарезервировано заранее, чтобы блок не прыгал
- Ряд ссылок, gap 32: `LinkedIn` · `CV (PDF)`
- Блок присутствует на всех маршрутах в одинаковом виде (IA-06)

### Footer (1440×120, горизонтальный, padding 120 по бокам, space-between) · 3462 → 3582
- Левый край: `Kazakhstan · UTC+5 · 14:32 local time` — локальное время считается на клиенте; при отключённом JS остаётся `Kazakhstan · UTC+5`
- Правый край: `© 2026`
- ⚠ **Расхождение с PRD.** SCR-03 в PRD v1.0 указывает «Москва, MSK / UTC+3». Факт — Казахстан, UTC+5, зафиксирован решением владельца №1 от 24.08.2026. Здесь и во всех `ia/` — по факту

---

## Состояния экрана

### ~~IntroOverlay~~ — узел убран 24.08.2026
Полноэкранного слоя поверх Hero **не существует**. Вступление схлопнуто в первый такт reveal имени в Hero, поверх уже отрисованного контента: 900 мс, старт по `fonts.ready` с потолком 800 мс, пропуск любым вводом. Полное обоснование и судьба MOT-02/MOT-03 — `ds/motion-concept.md` §5.
- Прямой вход по любому URL кроме `/` — вступительного такта нет (`DirectEntryState`, MOT-04)
- Скролл при загрузке ≠ 0 либо `pageshow` с `persisted: true` — reveal не играет, страница в конечном состоянии (MOT-03)
- `prefers-reduced-motion` — reveal не играет, страница в конечном состоянии (MOT-01)
- Начальные состояния reveal скоупятся под `.js` и под `no-preference` — без JS текст виден целиком (TECH-02)

### ReducedMotionState
Все reveal и page transitions отключены через `gsap.matchMedia()`. Layout не меняется ни на пиксель — меняется только наличие движения. Полное зеркало по каждому движению — `ds/motion-concept.md` §8.

### NoScriptView
Все секции присутствуют в HTML до выполнения JS. Считаем текст: Hero ≈ 320 знаков, FeaturedCase ≈ 260, WorksList ≈ 900, DevelopmentStrip ≈ 180, AboutShort ≈ 300 — около 1960 знаков, порог TECH-02 в 1500 пройден. **Это расчёт по макету, а не замер**; проверяется `curl` на собранной странице.

### Пустое состояние — отсутствует, и это решение, а не пропуск
Пользовательских данных в продукте нет; все три перечня (`WorksList`, `DevelopmentStrip`, ссылки контакта) статичны и заполняются при сборке. Пустому состоянию неоткуда взяться: если карточка не отрисовалась — это ошибка сборки, а не состояние интерфейса. Экран отказа при этом показывать запрещено (TECH-15).

---

## Placeholder-контент

Тексты выше — рабочие заготовки на английском: v1.0 выходит на английском, RU-локаль в v1.0 — только каркас маршрутов и `hreflang`. На ревью нужно проверять тот текст, который реально встанет в вёрстку.

Факты взяты из `outputs/brief.md` (типы проектов, годы, роли) и `ia/authorization-copy.md` (строка права на работу — дословно, не пересказом).

**Что здесь заглушка и требует решения владельца:**
- `[Имя Фамилия]` — в артефактах проекта имя не зафиксировано ни разу
- Email и URL LinkedIn — тоже отсутствуют в артефактах
- Годы проектов (2023 / 2024 / 2025) — реконструированы по порядку в брифе, не подтверждены
