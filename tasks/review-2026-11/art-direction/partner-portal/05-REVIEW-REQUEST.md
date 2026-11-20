# Partner Portal — 2.5 Запрос на независимое визуальное ревью

Для ChatGPT. Дата: 20.11.2026. Этап 2.5 плана [PLAN-CHATS.md](https://github.com/NikitaKanarev97/site-portfolio/blob/2b1abcedb5d5af870594c69864ae69d271425e20/PLAN-CHATS.md): независимо сверить три варианта, сделанных в коде на 2.4, с **просмотренными кадрами** референсов и с [criteria.md](https://github.com/NikitaKanarev97/site-portfolio/blob/2b1abcedb5d5af870594c69864ae69d271425e20/tasks/review-2026-11/criteria.md) — не с описаниями Claude.

**Ссылки закреплены на коммитах:** публичный `site-portfolio` @ `2b1abced`, приватный `b2b-partner-portal` @ `257cf83` (ветки `stage-2-art-direction`). Кадры, код и референсы лежат в **приватном** репозитории — для ревью нужен доступ к нему, тот же, что на ревью 2.2.

## 1. Что читать

| Файл | Зачем |
|---|---|
| [03-DIRECTIONS.md](https://github.com/NikitaKanarev97/site-portfolio/blob/2b1abcedb5d5af870594c69864ae69d271425e20/tasks/review-2026-11/art-direction/partner-portal/03-DIRECTIONS.md) | что обещано: оси, ориентиры плотности и типографики, запреты, риски; раздел 11 — решения владельца |
| [04-COMPARISON.md](https://github.com/NikitaKanarev97/site-portfolio/blob/2b1abcedb5d5af870594c69864ae69d271425e20/tasks/review-2026-11/art-direction/partner-portal/04-COMPARISON.md) | что сделано, замеры, сравнение по осям, самопроверка подмены, референсы по областям |
| [04-QA.md](https://github.com/NikitaKanarev97/site-portfolio/blob/2b1abcedb5d5af870594c69864ae69d271425e20/tasks/review-2026-11/art-direction/partner-portal/04-QA.md) | сборка, smoke, контраст, фокус, шрифты, различимость SKU, ограничения demo |
| [01-PRODUCT-AUDIT.md](https://github.com/NikitaKanarev97/site-portfolio/blob/2b1abcedb5d5af870594c69864ae69d271425e20/tasks/review-2026-11/art-direction/partner-portal/01-PRODUCT-AUDIT.md), разделы 3.4 и 10 | неизменяемые бизнес-правила, base state |
| [criteria.md](https://github.com/NikitaKanarev97/site-portfolio/blob/2b1abcedb5d5af870594c69864ae69d271425e20/tasks/review-2026-11/criteria.md) | стоп-лист (п. 1), тест подмены (п. 2), сигнал шаблонности (п. 3), живые данные (п. 6, 6.1) |

## 2. Кадры вариантов

Base state: неизменённая фикстура, одно реальное `Add to cart` у `KX-2CB4046F2-I`, кадр после того, как погас тост. Chromium, масштаб 1.

| Вариант | Первый экран | Вся страница | «Price not confirmed» | Фокус |
|---|---|---|---|---|
| A «Ведомость» | [1440](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/shots/a-1440.png) · [390](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/shots/a-390.png) · [360](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/shots/a-360.png) | [1440](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/shots/a-1440-full.png) · [390](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/shots/a-390-full.png) · [360](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/shots/a-360-full.png) | [1440](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/shots/a-1440-unconfirmed.png) · [390](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/shots/a-390-unconfirmed.png) · [360](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/shots/a-360-unconfirmed.png) | [1440](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/shots/a-1440-focus.png) |
| B «Справочник» | [1440](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/shots/b-1440.png) · [390](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/shots/b-390.png) · [360](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/shots/b-360.png) | [1440](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/shots/b-1440-full.png) · [390](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/shots/b-390-full.png) · [360](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/shots/b-360-full.png) | [1440](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/shots/b-1440-unconfirmed.png) · [390](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/shots/b-390-unconfirmed.png) · [360](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/shots/b-360-unconfirmed.png) | [1440](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/shots/b-1440-focus.png) |
| C «Пульт заказа» | [1440](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/shots/c-1440.png) · [390](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/shots/c-390.png) · [360](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/shots/c-360.png) | [1440](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/shots/c-1440-full.png) · [390](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/shots/c-390-full.png) · [360](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/shots/c-360-full.png) | [1440](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/shots/c-1440-unconfirmed.png) · [390](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/shots/c-390-unconfirmed.png) · [360](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/shots/c-360-unconfirmed.png) | [1440](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/shots/c-1440-focus.png) |

Дополнительно: [различимость символов SKU в A, 3×](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/shots/a-sku-glyphs-3x.png) · [SKU в таблице A, 3×](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/shots/a-sku-3x.png) · [страница сравнения](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/shots/compare-page.png).

Для сравнения «как сейчас»: [прототип, base state A, 1440](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/before/base-A-catalog-ipcams-1440.png) · [390](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/before/base-A-catalog-ipcams-390.png).

## 3. Референсы (те же кадры, что на ревью 2.2)

| ID | Кадр | На что опирается |
|---|---|---|
| R1 Octopart | [кадр](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/references/raw/wb-octopart-1440.png) | A: числа вправо, валюта отдельно, плотность |
| R2 McMaster-Carr | [кадр](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/references/raw/wb-mcmaster-1440.png) | B: тонированный рельс, схемы, текстовая иерархия |
| R3 Finviz | [кадр](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/references/raw/finviz-screener-1440.png) | A: номер строки, цвет за немногими смыслами |
| R4 TradingView | [кадр](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/references/raw/tradingview-screener-1440.png) | B: тихие единицы |
| R5 ЧИП и ДИП | [кадр](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/references/raw/chipdip-search-1440.png) | C: степпер + одна кнопка, цвет на действии |
| R6 Farnell (архив 2024) | [кадр](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/references/raw/wb-farnell-results-1440.png) | A, C: количество и Add рядом, основание цены в заголовке |
| R7 Промэлектроника | [кадр](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/references/raw/promelec-search-1440.png) | C: подписанный остаток |
| M1 Лемана ПРО | [кадр](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/references/scrn/lemana-stores-list-cont-6a0cbbc5-0d28.webp) | B: состояние словами, без плашки |
| M2 METRO | [кадр](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/references/scrn/metro-product-price-6a3d206b.webp) | C: единица рядом с ценой |

Полный список и атрибуция — [references/README.md](https://github.com/NikitaKanarev97/site-portfolio/blob/2b1abcedb5d5af870594c69864ae69d271425e20/tasks/review-2026-11/art-direction/partner-portal/references/README.md).

## 4. Код и проверки

- Варианты: [src/screens/art-direction/](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/src/screens/art-direction) — `demo.ts` (общие данные и поведение), `VariantA/B/C.tsx` + `variant-a/b/c.css`, `Compare.tsx`, `routes.tsx`; подключение — [src/App.tsx](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/src/App.tsx).
- Съёмка и замеры: [capture.mjs](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/capture.mjs) → [capture.json](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/capture.json).
- Поведение: [smoke.mjs](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/smoke.mjs) → [smoke.json](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/257cf83e68fead99e60d3106fcf1e76751936f67/audit/stage-2-art-direction/variants/smoke.json).
- Локальный запуск: `npm install`, `npm run dev`, адрес `/b2b/art-direction` на порту, который покажет Vite. Публичного preview нет: деплой — только с разрешения владельца.

## 5. Что нужно от ревью

По **каждому** варианту — вердикт `PASS`, `TARGETED REVISION` или `REJECT` с доказательствами: ссылка на кадр и область экрана. Секции — как в PLAN-CHATS, 2.5:

1. Качество и характер: есть ли собственная визуальная идентичность или это аккуратный шаблон.
2. Читаемость и плотность: строка, первый экран, длинные названия, числа и единицы.
3. Навигация и контекст: шапка, контрагент, хлебные крошки, рельс фильтров.
4. Визуальная иерархия: что читается первым, одна ли главная кнопка в строке.
5. Компоненты: степпер или капсула, состояние «в корзине», вторичное состояние «Price not confirmed».
6. Доступность: контраст, фокус, зоны нажатия (замеры — 04-QA, раздел 3).
7. Адаптивность: 390 и 360 — доступ ко всем полям и действиям, высота строки.
8. AI-slop и стоп-лист (criteria, п. 1 и 3).
9. Сохранение UX и бизнес-правил: те же данные и тексты; неподтверждённая цена не добавляется; `Undo`; USD и `excl. tax` без налоговой строки (criteria 6.1). Пять разрешённых UX-изменений (U-A1, U-A2, U-B1, U-C1, U-C2) — только в demo.
10. Соответствие референсам: то, что заявлено взятым (04-COMPARISON, раздел 7), действительно видно и на кадре референса, и на кадре варианта.

Вопросы, по которым нужно отдельное мнение:
- держит ли A характер без цвета, или это «таблица Excel»;
- держится ли B на чём-то, кроме зелёного (самопроверка Claude: слабее всех);
- приемлема ли для C мобильная строка 219–223 px (один товар в первом экране);
- риск `0`/`O` в Fira Mono — блокирует A или это точечная доработка;
- нет ли в 04-COMPARISON и 04-QA утверждений сильнее, чем видно на кадрах.

Если ни один вариант не проходит — назвать конкретные провалы: по плану допускается один адресный следующий цикл. Claude отвечает таблицей исправлений, как на 2.2.1. Выбор направления — за владельцем.
