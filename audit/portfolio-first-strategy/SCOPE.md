# Portfolio-first · scope экранов

28.11.2026 · PF-3 · **НА НЕЗАВИСИМОМ РЕВЬЮ.** Конечный scope до релиза. Заменяет scope PF-2 (`e4aa453b`). Экран без роли в [storyboard](STORYBOARDS.md) не перерабатывается. Требования к выбранным экранам не снижаются.

Статусы: **READY** · **REFINE** · **REDESIGN** · **DEMO ONLY** (состояние для клипа, без переработки маршрута) · **OPTIONAL** · **DEFER** (не делаем до релиза; возврат только по замечанию Design Lead на этапе 6).

## Сводка

| Продукт | Ядро | Сверх ядра | Отложено | Клипов |
|---|---|---|---|---|
| Partner Portal | **4**: Catalog, Product Details, Cart, Resolution Center | Specification intake — DEMO ONLY | Dashboard, Order Details | 3 |
| TRASSIR Learn | **3**: Home, Material Reader, Program | Assessment result — OPTIONAL | — | 1 |
| Agent Ops | **3**: Review Queue, Run Detail, Action Approvals — Final Design Refinement | — | Autonomy | 2 |
| **Итого** | **10** | максимум **11** | | **6** |

Изменения против PF-2:
- **Agent Ops не считается визуально готовым.** Три экрана проходят отдельный этап 7A «Final Design Refinement» ([план](AGENT-OPS-REFINEMENT-PLAN.md)). Статус READY снят.
- **Autonomy → DEFER.** Здоровое состояние Agent Ops показывается внутри трёх выбранных экранов.
- **Agent Ops входит в состав релиза** с подачей без строки о происхождении (решение владельца 28.11). Публикация по-прежнему проходит 7.1 и P0; не готов к релизу — портфолио выходит без него.
- Клипов 6: Agent Ops даёт два клипа, а не 0–2.

## Пять видов готовности

Визуальная — соответствие направлению и Q1 по оценке исполнителя. Функциональная — сценарий клипа работает в сборке. Независимая приёмка — **записанный** вердикт ChatGPT / Design Director; отчёт исполнителя её не заменяет. Достоверность — классы утверждений модуля. Разрешение — запись в `evidence-inventory`. **Разрешение на разработку не равно разрешению на публикацию.**

### B2B Partner Portal (Layer 3, синтетика)

| Экран | Роль в storyboard | Визуальная | Функциональная | Независимая приёмка | Разрешение | Рекомендация |
|---|---|---|---|---|---|---|
| Catalog | Обложка, раздел 5 · решение 1, клип 1 | Перенесён, 3.2.3 | Работает | Последний записанный вердикт — Stage 3.2 REVISION REQUIRED; 3.2.1 и 3.2.2 закрыты ответами на находки; вердикт по 3.2.3 не записан | P0 | **REFINE** · ждёт G2 |
| Product Details | Раздел 5 · решение 3, клип 3 | Перенесён, 3.4 | Работает | Композиция 3.3.1 названа принятой в отчёте 3.4 (запись исполнителя, вердикт в репозитории не найден); 3.4 ждёт ревью | P0 | **REFINE** · у Codex |
| Cart | Раздел 5 · решение 3, клип 3 | Перенесён, 3.5 `b192a71` | Работает | 3.5 ждёт ревью | P0 | **REFINE** · у Codex |
| Resolution Center | Раздел 5 · решение 2, клип 2 | Прежний язык | Работает на прежнем языке | — | P0 | **REDESIGN** · следующий перенос Codex |
| Specification intake | Состояние в клипе 2 | Прежний язык | Работает | — | P0 | **DEMO ONLY** |
| Dashboard, Order Details | — | — | — | — | — | **DEFER** |

Каноничный EN-маршрут Product Details и Cart пока в RUB, USD — в изолированной фикстуре (отчёты 3.4, 3.5). Для съёмки EN нужен сквозной USD-маршрут (B4).

### Статусы Stage 3 по записанным результатам ревью

Источник — документы веток `b2b-partner-portal`, 28.11.2026. Где вердикт ревьюера не записан, это так и указано. Принятые этапы не переоткрываются.

| Этап | Ветка · SHA | Последний записанный результат ревью | Где записан | Что дальше |
|---|---|---|---|---|
| 3.1 Foundation | `stage-3-1-product-design-system` `129e89d` | **REQUEST CHANGES (Minor)**, Q1/Q2 partial | ответ 3.1.1 | Закрыт ответом 3.1.1 |
| 3.1.1 Quality closure | `stage-3-1-1-quality-closure` `c7bc323` | Не записан | — | G2: подтвердить вердикт |
| 3.2 Catalog pilot | `stage-3-2-catalog-pilot-migration` `04f0247` | **REVISION REQUIRED**: Q1, Q2, Responsive partial; identity, art direction, plan — pass | ответ 3.2.1 | Закрыт ответом 3.2.1 |
| 3.2.1 Quality closure | `stage-3-2-1-quality-closure` `8195b11` | Находка: перекрытие подписей RU 1024 (слово вердикта не записано) | ответ 3.2.2 | Закрыт ответом 3.2.2 |
| 3.2.2 Responsive closure | `stage-3-2-2-final-responsive-closure` `a4efef1` | Не записан; следом открыт 3.2.3 по типографике | — | — |
| 3.2.3 Typography closure | `stage-3-2-3-final-typography-closure` `620a088` | Q1 и Responsive ждут повторной оценки | отчёт 3.2.3 | **G2** |
| 3.3 Product Details V2 | `stage-3-3-product-details-refinement` `bc15b9c` | Не записан; следом открыт 3.3.1 | — | — |
| 3.3.1 Product Details V2.1 | `stage-3-3-1-product-details-final-refinement` `551b1e5` | Не записан. Отчёт 3.4 называет композицию «independently reviewed» — это запись исполнителя | отчёт 3.4 | G2: подтвердить вердикт |
| 3.4 Product Details migration | `stage-3-4-product-details-migration` `44756f5` | READY FOR INDEPENDENT DESIGN REVIEW | отчёт 3.4 | **G2** |
| 3.5 Cart migration | `stage-3-5-cart-migration` `b192a71` | Prepared for independent design review | отчёт 3.5 | **G2** |

### Исторические кадры Partner Portal (Layer 1–2)

| Материал | Роль | Достоверность | Разрешение |
|---|---|---|---|
| P1 кадры исходного кабинета | Раздел 2 | V | Нет записи — ⛔ |
| P6 кадры прода + пересъёмка C2 | Раздел 4 | V | ⛔ |
| Figma: wireframe, варианты, схема, опросы, ДС | Разделы 3, 6 | V как дизайн; не доказательство внедрения | ⛔ |

### TRASSIR Learn (2026, демоданные)

| Экран | Роль | Визуальная | Функциональная | Независимая приёмка | Разрешение | Рекомендация |
|---|---|---|---|---|---|---|
| Home | Раздел 4 | Q1 PASS | Работает | Q1, Q2 PASS (2.8.5) | P0, L3–L4 | **READY** |
| Material Reader | Раздел 3, клип 4 | Q1 PASS | Работает | Q1, Q2 PASS | P0 | **READY** |
| Program | Раздел 3, клип 4 | Не входил в Q1 | Работает | — | P0 | **REFINE** · B8 |
| Assessment result | Опционально | Не входил в Q1 | Работает | — | P0 | **OPTIONAL** |

### Agent Ops (переработка 2026, синтетика)

| Экран | Роль | Визуальная | Функциональная | Независимая приёмка | Разрешение | Рекомендация |
|---|---|---|---|---|---|---|
| Review Queue | Раздел 1, клип 5 | Q1 PASS | Работает | Q1, Q2 PASS | ⛔ 7.1, P0 | **REFINE** · 7A |
| Run Detail | Раздел 2 | Q1 PASS | Работает | Q1, Q2 PASS | ⛔ | **REFINE** · 7A |
| Action Approvals | Раздел 3, клип 6 | Q1 PASS | Работает | Q2 PARTIAL | ⛔ | **REFINE** · 7A |
| Autonomy | — | Прежний язык | Работает | — | ⛔ | **DEFER** |

## Порядок по экранам

1. Codex: ревью 3.4, 3.5, 3.2.3 (G2) → Resolution Center с демо-состоянием спецификации → сквозная интеграционная проверка и backlog → подготовка сценариев к съёмке. Номера Codex выбирает сам.
2. Claude, параллельно: Agent Ops 7A после брифа ChatGPT.
3. Learn Program — после Partner Portal, не блокирует его.
