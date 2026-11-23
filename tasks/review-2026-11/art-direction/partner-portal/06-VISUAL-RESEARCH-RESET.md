# Partner Portal — Visual Research Reset (после отклонения A/B/C)

## Ревизия V1.1 · 23.11.2026

**Research-only; ожидает независимой приёмки ChatGPT и решения владельца.** Продолжен пакет Claude, четыре замечания ревью обработаны без создания вариантов и без изменения продукта. Исторический обзор V1.0 ниже сохранён; его численные цели и рекомендации об удалении controls/навигации заменены этим дополнением. Исходные baseline-замеры и кадры сохранены.

### Что пересмотрено

1. **Разнообразие B2B-референсов.** Добавлены Ramp Purchase orders и Sentry Issue Stream из официальных материалов: изучены изображения целиком и значимые crops, сохранены происхождение и прямые ссылки. Ramp дополняет пакет закупочной таблицей с идентификацией, независимыми статусами и денежными колонками; Sentry — длинным техническим содержимым с отдельными сравнимыми атрибутами. Это документированные продуктовые скриншоты: у Sentry release-кадр 2025 года, только таблица; они не выданы за проверенные live-сессии 2026. Retool public demo открылся с пустой таблицей; Sentry Sandbox — с email/terms gate. Ограничения зафиксированы. Mobbin не использовался.
2. **Q1–Q13.** Критерии разделены на **A Hard requirements / B Visual benchmarks / C Design hypotheses**. Данные, действия, доступность, клавиатура и отсутствие overflow обязательны. Высоты строк, размеры desktop-controls, количество тонов/весов, доля акцента и координата первой строки — ориентиры для сравнения, без прежних жёстких численных целей. Координаты PP/Mercury/GitHub сохраняются как факты/оценки, но больше не доказывают равное UX-качество: блоки решают разные задачи.
3. **Visual / UX / business.** Удаление disabled пересматривает действующее продуктовое решение; дерево категорий даёт переходы к родителям и соседям, strip — к детям. Это не функциональные дубли. Qty/Add/In cart/Undo, существующие loading/stale retry и сравнимые техпараметры проверены по коду; перестройка поведения требует решения. USD и `excl. tax` уже утверждены для синтетического EN-демо, но это не разрешение переименовать рублёвые значения в доллары или изменить реальные налоги. Перенос фикстуры за пределы изолированного demo — отдельный scope.
4. **Идентичность.** Сопоставлены рабочие списки Partner Portal, Agent Ops и Learn на одной ширине и масштабе, включая neutral-диагностику. Закупочная строка, очередь разбора риска и каталог учебных материалов различаются задачей, композицией и взаимодействиями. **Необходимость менять Inter не доказана.** Самостоятельный характер можно развивать внутри нынешнего языка через продуктовую анатомию и иерархию. Это экспертный вывод по выбранным desktop-спискам, не объявление финального cross-product gate пройденным.

### Основа следующего композиционного этапа

- **Optimised Comparison Table:** сохранить отдельные колонки технических характеристик, проверить пропорции, числовую иерархию и вес действий.
- **Product-first Table:** дать больше места распознаванию модели/SKU и рассмотреть группировку вторичных метаданных рядом с именем, сохранив доступность значимых характеристик для сравнения между строками.

Это два способа организации одной информации в существующем языке Partner Portal, а не два новых стиля. Для обеих записаны задачи, подтверждающие кадры, сохраняемые данные, риски и наблюдаемые критерии сравнения. Победитель не назначен. Следующий этап не начат.

### Артефакты V1.1 — приватный репозиторий, коммит `9556cc930412cb841397f036b7e242703ba32e6a`

- [REPORT.md — четыре исправления, риски, ограничения, Evidence Index и Git diff summary](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/9556cc930412cb841397f036b7e242703ba32e6a/audit/stage-2-art-direction/visual-research-reset/REPORT.md)
- [RESEARCH.md — действующее дополнение §10](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/9556cc930412cb841397f036b7e242703ba32e6a/audit/stage-2-art-direction/visual-research-reset/RESEARCH.md#10-ревизия-v11)
- [REFERENCE-MAP.md](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/9556cc930412cb841397f036b7e242703ba32e6a/audit/stage-2-art-direction/visual-research-reset/REFERENCE-MAP.md) · [BASELINE-AUDIT.md — уточнения без изменения замеров](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/9556cc930412cb841397f036b7e242703ba32e6a/audit/stage-2-art-direction/visual-research-reset/BASELINE-AUDIT.md)
- [Атрибуция и ограничения кадров](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/9556cc930412cb841397f036b7e242703ba32e6a/audit/stage-2-art-direction/visual-research-reset/references/README.md)
- [Ramp — выбранный экран](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/9556cc930412cb841397f036b7e242703ba32e6a/audit/stage-2-art-direction/visual-research-reset/references/raw/v11-ramp-po-list.png) · [Sentry — выбранный экран](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/9556cc930412cb841397f036b7e242703ba32e6a/audit/stage-2-art-direction/visual-research-reset/references/raw/v11-sentry-issue-stream.png)
- [Три рабочих списка, одинаковый масштаб](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/9556cc930412cb841397f036b7e242703ba32e6a/audit/stage-2-art-direction/visual-research-reset/references/compare/v11-working-lists.png) · [neutral](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/9556cc930412cb841397f036b7e242703ba32e6a/audit/stage-2-art-direction/visual-research-reset/references/compare/v11-working-lists-neutral.png)
- [Результат проверки целостности](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/9556cc930412cb841397f036b7e242703ba32e6a/audit/stage-2-art-direction/visual-research-reset/references/v11-validation.json)

Доступ к ссылкам требует прав на приватный репозиторий. Здесь обновлён только этот текстовый обзор: приватные изображения, код, бизнес-данные и сторонние скриншоты в публичный repo не добавлены. Исходники продукта, ДС, маршруты, Figma, `main`, `stage-2-art-direction` и production не менялись; merge и deploy не выполнялись. Полное браузерное QA не запускалось: проверены исследовательские артефакты, ссылки, новые свидетельства и scope diff.

---

## Исторический обзор V1.0 — выводы ниже уточнены V1.1

Дата: 20–23.11.2026. Research-only. Владелец отклонил все три направления Stage 2.4 (A «Ведомость», B «Справочник», C «Пульт заказа»): A сухой и мелкий, B «много зелёного, старомодно», C — необоснованный красно-оранжевый и громоздкий мобильный; нынешний Partner Portal нравится владельцу больше всех трёх. Этот документ — публичный обзор нового исследования. **Кадры, референсы третьих лиц и замеры лежат только в приватном репозитории** (ссылки ниже, нужен доступ). Ничего из закрытых материалов DSSL здесь нет.

## Исходные точки

| Репозиторий | Исходный SHA | Research-ветка | Коммиты |
|---|---|---|---|
| `b2b-partner-portal` (приватный) | `257cf83` (`stage-2-art-direction`) | `research/stage-2-visual-reset` | пакет `d81e56f`, отчёт с закреплёнными ссылками `8e7bc80` |
| `site-portfolio` (публичный) | `640ede4f` (`stage-2-art-direction`) | `research/stage-2-visual-reset` | этот файл |

Код продукта, ДС, маршруты, Figma, `main` и production не тронуты.

## Что сделано

1. **Сначала текущий UI.** Каталог `IP cameras` (тот же base state: 8 товаров, `available first`, одна позиция в корзине, две «Price not confirmed») снят на 1440, 1024, 768, 390, 360 и в четырёх вторичных состояниях, с замерами.
2. **Две группы референсов раздельно:** функция (как устроен заказ из каталога) и визуальное качество (как выглядит сильный современный рабочий интерфейс). Архивные каталоги 2.2 оставлены только как UX-паттерны.
3. **15 просмотренных референсов**: рабочие экраны Mercury (демо-стенд, 3 экрана), GitHub Issues, Coinbase Explore, Ubiquiti Store (тот же домен — IP-камеры), CDW, LCSC; мобильные — веб-версии на 390 и экраны SCRN (Trading 212, Лемана ПРО, Revolut). Для Mercury — замеры `getComputedStyle`.
4. Linear, Stripe Dashboard, Shopify Admin, Attio **в пакет не вошли**: без входа открылись только маркетинговые страницы или документация без рабочих экранов. Это записано, а не заменено пересказом.

## Главные выводы

1. **Почему A/B/C не получились.** Функциональные архивные референсы (Octopart 2020, McMaster 2020, Farnell 2024, Finviz) стали визуальным источником; различие вариантов достигалось цветом и необычными шрифтами; отполированные компоненты заменены нативными `<select>` браузера; плотность стала главной метрикой (41 px ценой 13 px узкого шрифта).
2. **Что уже хорошо.** Оболочка и контекст контрагента, строка происхождения цены, рельс фильтров со счётчиками, миниатюры и SKU, `In cart · Undo` в строке, логика неподтверждённой цены, палитра с одним синим, доступный мобильный вариант. Высота зоны над таблицей — не проблема: первая строка на 338 px против ≈355 у Mercury и ≈337 у GitHub.
3. **Где реальные разрывы — в анатомии строки каталога:** колонка названия 164 px на 1440 (6 из 8 названий рвутся на 2–3 строки), разорванные единицы (`Fixed 2.8 / mm`), цена слева и наравне с остатком, контролы 44–46 px при мыши, неактивные степпер и кнопка у неподтверждённой цены.
4. **Что из A/B/C ценно только как UX:** название в одну строку за счёт ширины колонки, цена вправо с `excl. tax` в заголовке, число и единица без переноса, количество и действие одной группой.
5. **Рекомендация: точечная эволюция, а не новый визуальный редизайн.** Открытый вопрос для владельца: курс требует самостоятельного визуального языка продукта и теста подмены, а нынешняя палитра — стоковые Tailwind `slate` + `blue`, шрифт — Inter. Если идентичность нужна, сильные референсы держат её на собственном шрифте и анатомии строки, а не на цвете.

Must improve (без изменения логики): ширина названия; неразрывные значения; цена отдельной колонкой вправо; контролы 32–36 px на мыши и одна группа количество + действие; неподтверждённая цена без неактивных контролов; USD + `excl. tax` вместо ₽. UX-гипотезы H3–H5 (строка-сводка на телефоне, кнопка запроса цены, переключатель плотности) — только с согласия владельца.

## Приватные артефакты (закреплены на `8e7bc80`)

- [REPORT.md](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/8e7bc8091ff47b824e6c78d6a1fafca327c061a5/audit/stage-2-art-direction/visual-research-reset/REPORT.md) — отчёт, самопроверка, ограничения, **Evidence Index** с прямыми ссылками на все кадры
- [RESEARCH.md](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/8e7bc8091ff47b824e6c78d6a1fafca327c061a5/audit/stage-2-art-direction/visual-research-reset/RESEARCH.md) — Reference Pack, Visual Quality Benchmark, сравнение по блокам, Opportunity Map, выводы
- [BASELINE-AUDIT.md](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/8e7bc8091ff47b824e6c78d6a1fafca327c061a5/audit/stage-2-art-direction/visual-research-reset/BASELINE-AUDIT.md) — KEEP / IMPROVE / RETHINK текущего каталога
- [REFERENCE-MAP.md](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/8e7bc8091ff47b824e6c78d6a1fafca327c061a5/audit/stage-2-art-direction/visual-research-reset/REFERENCE-MAP.md) — секция → референс → решение
- [references/README.md](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/8e7bc8091ff47b824e6c78d6a1fafca327c061a5/audit/stage-2-art-direction/visual-research-reset/references/README.md) — атрибуция, статус использования

Изображения третьих лиц — без прав на публикацию; в этот репозиторий, на сайт и в кейс не переносятся.

## Следующий шаг

Независимая проверка ChatGPT и решение владельца о качестве исследования. Визуальные направления, исправление A/B/C, четвёртый вариант и выбор направления на этом этапе не делаются.
