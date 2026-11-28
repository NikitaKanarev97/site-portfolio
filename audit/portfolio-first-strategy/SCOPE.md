# Portfolio-first · scope экранов

28.11.2026 · PF-3 · **ACCEPTED WITH BACKLOG** — независимая приёмка ChatGPT по `959daadf`. Подтверждение владельца — отдельное решение (O1); ни приёмка, ни подтверждение не разрешают публикацию. Конечный scope до релиза: **10 основных экранов, максимум 11 с Assessment result.** Specification intake — только демо-состояние и в число экранов не входит. Заменяет scope PF-2 (`e4aa453b`). Экран без роли в [storyboard](STORYBOARDS.md) не перерабатывается. Требования к выбранным экранам не снижаются.

Статусы: **READY** · **REFINE** · **REDESIGN** · **DEMO ONLY** (состояние для клипа, без переработки маршрута) · **OPTIONAL** · **DEFER** (не делаем до релиза; возврат только по замечанию Design Lead на этапе 6).

## Сводка

| Продукт | Ядро | Сверх ядра | Отложено | Клипов |
|---|---|---|---|---|
| Partner Portal | **4**: Catalog, Product Details, Cart, Resolution Center | Specification intake — DEMO ONLY, не экран | Dashboard, Order Details | 3 |
| TRASSIR Learn | **3**: Home, Material Reader, Program | Assessment result — OPTIONAL | — | 1 |
| Agent Ops | **3**: Review Queue, Run Detail, Action Approvals — Final Design Refinement | — | Autonomy | 2 |
| **Итого** | **10** | максимум **11** — с Assessment result | | **6** |

Изменения против PF-2:
- **Agent Ops не считается визуально готовым.** Три экрана проходят отдельный этап 7A «Final Design Refinement» ([план](AGENT-OPS-REFINEMENT-PLAN.md)). Статус READY снят.
- **Autonomy → DEFER.** Здоровое состояние Agent Ops показывается внутри трёх выбранных экранов.
- **Agent Ops входит в состав релиза** с подачей без строки о происхождении (решение владельца 28.11). Публикация по-прежнему проходит 7.1 и P0. ~~Не готов к релизу — портфолио выходит без него.~~ *Уточнено 28.11 после ревью PF-3: исключить Agent Ops из релиза можно только отдельным решением владельца.*
- Клипов 6: Agent Ops даёт два клипа, а не 0–2.

После независимого ревью PF-3 (28.11):
- Вердикты ревью Stage 3.1.1–3.5 синхронизированы (таблица ниже). Catalog, Product Details и Cart приняты с backlog; следующий этап Codex — **Stage 3.6 Resolution Center**.
- Прежние ограничения в 13 и 14 экранов (PF-1, PF-2) больше не действуют. История решений — [STRATEGY §7](STRATEGY.md), [OWNER-INTERVIEW](OWNER-INTERVIEW.md).

## Пять видов готовности

Визуальная — соответствие направлению и Q1 по оценке исполнителя. Функциональная — сценарий клипа работает в сборке. Независимая приёмка — **записанный** вердикт ChatGPT / Design Director; отчёт исполнителя её не заменяет. Достоверность — классы утверждений модуля. Разрешение — запись в `evidence-inventory`. **Разрешение на разработку не равно разрешению на публикацию.**

### B2B Partner Portal (Layer 3, синтетика)

| Экран | Роль в storyboard | Визуальная | Функциональная | Независимая приёмка | Разрешение | Рекомендация |
|---|---|---|---|---|---|---|
| Catalog | Обложка, раздел 5 · решение 1, клип 1 | Перенесён, 3.2.3 | Работает | **3.2.3 ACCEPTED WITH BACKLOG** | P0 | **READY** · backlog → B6 |
| Product Details | Раздел 5 · решение 3, клип 3 | Перенесён, 3.4 | Работает | **3.3.1 и 3.4 ACCEPTED WITH BACKLOG** | P0 | **READY** · backlog → B6 |
| Cart | Раздел 5 · решение 3, клип 3 | Перенесён, 3.5 `b192a71` | Работает | **3.5 ACCEPTED WITH BACKLOG** | P0 | **READY** · backlog → B6 |
| Resolution Center | Раздел 5 · решение 2, клип 2 | Прежний язык | Работает на прежнем языке | — | P0 | **REDESIGN** · Stage 3.6, Codex |
| Specification intake | Состояние в клипе 2 | Прежний язык | Работает | — | P0 | **DEMO ONLY** · состояние внутри Stage 3.6, не экран |
| Dashboard, Order Details | — | — | — | — | — | **DEFER** |

Каноничный EN-маршрут Product Details и Cart пока в RUB, USD — в изолированной фикстуре (отчёты 3.4, 3.5). Для съёмки EN нужен сквозной USD-маршрут (B4).

### Статусы Stage 3 по результатам независимого ревью

Вердикты независимого ревьюера ChatGPT. Для 3.1, 3.2 и 3.2.1 — записанные в ответах на находки; для 3.1.1–3.5 — из диалогов ChatGPT 27.11.2026, в документацию синхронизированы 28.11.2026 (G2). Это вердикты ревьюера, а не самооценка Codex. Подробности сверх слова вердикта здесь не восстанавливаются. Принятые этапы не переоткрываются.

| Этап | Ветка · SHA | Результат независимого ревью | Что дальше |
|---|---|---|---|
| 3.1 Foundation | `stage-3-1-product-design-system` `129e89d` | **REQUEST CHANGES (Minor)**, Q1/Q2 partial | Закрыт этапом 3.1.1 |
| 3.1.1 Quality closure | `stage-3-1-1-quality-closure` `c7bc323` | **ACCEPTED WITH BACKLOG** | Backlog → B6 |
| 3.2 Catalog pilot | `stage-3-2-catalog-pilot-migration` `04f0247` | **REVISION REQUIRED**: Q1, Q2, Responsive partial; identity, art direction, plan — pass | Закрыт этапом 3.2.1 |
| 3.2.1 Quality closure | `stage-3-2-1-quality-closure` `8195b11` | Находка: перекрытие подписей RU 1024 (слово вердикта не записано) | Закрыт этапом 3.2.2 |
| 3.2.2 Responsive closure | `stage-3-2-2-final-responsive-closure` `a4efef1` | **REVISION REQUIRED** | Закрыт этапом 3.2.3 |
| 3.2.3 Typography closure | `stage-3-2-3-final-typography-closure` `620a088` | **ACCEPTED WITH BACKLOG** | Backlog → B6 |
| 3.3 Product Details V2 | `stage-3-3-product-details-refinement` `bc15b9c` | **REVISION REQUIRED** | Закрыт этапом 3.3.1 |
| 3.3.1 Product Details V2.1 | `stage-3-3-1-product-details-final-refinement` `551b1e5` | **ACCEPTED WITH BACKLOG** | Backlog → B6 |
| 3.4 Product Details migration | `stage-3-4-product-details-migration` `44756f5` | **ACCEPTED WITH BACKLOG** | Backlog → B6 |
| 3.5 Cart migration | `stage-3-5-cart-migration` `b192a71` | **ACCEPTED WITH BACKLOG** | Backlog → B6 |
| 3.6 Resolution Center | — | Следующий этап Codex | B3, приёмка G4 |

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
| Action Approvals | Раздел 3, клип 6 | Q1 PASS | Работает | Q2 PARTIAL — сохраняется до необходимых доказательств или отдельного решения о документированном ограничении (O4) | ⛔ | **REFINE** · 7A |
| Autonomy | — | Прежний язык | Работает | — | ⛔ | **DEFER** |

## Порядок по экранам

1. Codex: ~~ревью 3.4, 3.5, 3.2.3 (G2)~~ закрыто 28.11 → **Stage 3.6 Resolution Center** с демо-состоянием спецификации → сквозная интеграционная проверка и backlog → подготовка сценариев к съёмке. Номера после 3.6 Codex выбирает сам.
2. Claude, параллельно: Agent Ops 7A по отдельному implementation brief ChatGPT (G3).
3. Learn Program — после Partner Portal, не блокирует его.
