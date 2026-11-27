# Portfolio-first · отчёт

27.11.2026 · **STRATEGIC ROADMAP REFINEMENT — READY FOR INDEPENDENT REVIEW.** Ничего в этом пакете не утверждено. Решение принимает владелец после независимого ревью.

[STRATEGY](STRATEGY.md) · [SCOPE](SCOPE.md) · [STORYBOARDS](STORYBOARDS.md) · [EVIDENCE-AND-QUESTIONS](EVIDENCE-AND-QUESTIONS.md)

## Главный вывод

Визуальная проблема ревью 18.11 в части продуктов решена и доказана: три направления различимы (Blind Test 9/9, Cross-product PASS), качество выбранных экранов принято (Q1 9/9). Нерешённые проблемы лежат в другом слое: длина и подача кейсов, раскрытие роли, аргументация и допуск материалов. Действующий план тратит ресурсы этапов 3, 7 и 8 на перенос широкого набора экранов и стартовые страницы прототипов, которые кейсу не нужны.

Рекомендация: сохранить всё принятое, сузить работу над продуктами до 14 экранов, утвердить storyboard до следующей волны переносов и сделать клипы основным носителем решений.

## Карта изменений roadmap

| Этап / элемент | Статус | Причина |
|---|---|---|
| 0 · Критерии, позиционирование, рамки, inventory | **COMPLETED · CARRY FORWARD** | Основа всех проверок. criteria §10 дополняется бюджетами слов из STORYBOARDS |
| 1 · Срочные правки сайта | **COMPLETED** (ветка, в main не смержено) | Без изменений |
| 2.0–2.8.5 · Арт-дирекция трёх продуктов | **COMPLETED по существу · формальное закрытие BLOCKED** | Q1, Blind, Cross-product PASS. Ждут решения владельца 1 (Approvals) и P0 |
| P0 · NDA containment | **BLOCKED** | Решения владельца 2 и 3 Stage 2.8.5 |
| 3 · Partner Portal пилот — ДС Stage 3.1 | **COMPLETED · CARRY FORWARD** | Основа раздела ДС кейса |
| 3 · Catalog, Search (3.2–3.2.3) | **CARRY FORWARD** | Ждёт повторной независимой оценки |
| 3 · Product Details (3.3–3.4) | **CARRY FORWARD** | Codex, в работе, не прерывается |
| 3 · Перенос заказов, каталога, корзины целиком | **MODIFY** | Только экраны SCOPE: Cart, Order Details, Resolution Center, Specification intake |
| 3 · Своя стартовая страница прототипа | **DEFER** | Публичный прототип не обязателен |
| 3 · Production-деплой прототипа | **DEFER** | Нужен только для ссылки из кейса, решение владельца |
| **3.5 · Scope, интервью, storyboard (новый)** | **NEW** | Точка синхронизации, см. ниже |
| 4 · Система сайта и блоки истории | **MODIFY** | Добавить блоки «решение», «клип», «ДС-панель»; проверять различие подачи кейсов, не только продуктов |
| 5 · Кейс Partner Portal | **MODIFY** | Собирается по утверждённому storyboard, визуальному пакету и трём клипам; 450–600 слов |
| 6 · Внешний Design Lead | **CARRY FORWARD** | Ворота без изменений |
| 7 · Agent Ops | **MODIFY · публикация BLOCKED** | 4 экрана, 3 уже READY; 2 клипа; без раздела ДС и стартовой страницы |
| 8 · Learn | **MODIFY** | Сдвиг к реальной роли в DSSL при наличии доказательств; 4 экрана; 1–2 клипа |
| 9 · Интеграция и выкладка | **MODIFY** | Ссылки кейсов на прототипы необязательны; Cross-product Review включает страницы кейсов |
| Редизайн маршрутов вне SCOPE | **OUT OF SCOPE** | Нет роли в истории. Прототипы и функциональность не удаляются |
| Публичный интерактивный прототип как критерий готовности | **OUT OF SCOPE** | Заменён клипами |
| Ветка `redesign/policy-version-diff-v1` Agent Ops | **OUT OF SCOPE** для портфолио | Экран не входит в storyboard |

## Обновлённая последовательность

1. **Сейчас.** Независимое ревью этого пакета. Codex продолжает Stage 3.4 без изменений.
2. **Решения владельца.** Принятие scope; Approvals и P0 по Stage 2.8.5.
3. **3.5a · Интервью.** ChatGPT с владельцем по [вопросам первого раунда](EVIDENCE-AND-QUESTIONS.md#4-вопросы-владельцу--первый-раунд). Ответы классифицируются.
4. **3.5b · Утверждение storyboard.** Storyboard трёх кейсов уточняется по ответам. Владелец утверждает. Здесь же решается состав релиза (AO-7).
5. **3.6 · Доводка экранов.** Только SCOPE, по порядку SCOPE §4. Partner Portal первым (Codex), затем Learn и Agent Ops. Stage 3.4 закрывается своим ревью до 3.6.
6. **Этап 4 · Система сайта** с блоками под storyboard. Может идти параллельно 3.6.
7. **Визуальный пакет и клипы** каждого кейса из локальных и preview-сборок. USD-фикстура для EN до съёмки Partner Portal.
8. **Этап 5 · Кейс Partner Portal** → **этап 6 · внешний Design Lead.**
9. **Этапы 7–8** по итогам этапа 6.
10. **Этап 9 · Интеграция и финальная независимая приёмка**, затем живой лид. Merge и деплой — по слову владельца.

## Точка синхронизации с Codex

**Закрытие независимого ревью Stage 3.4.** До этого момента Codex работает по текущему поручению. После него следующий перенос в b2b-partner-portal выбирается из SCOPE §1, а не из исходного списка этапа 3. Предложение: следующим идёт Cart с USD-фикстурой и Order Details, потому что они не зависят от интервью. Resolution Center и Specification intake ждут ответов PP-2 и PP-3.

Этот пакет не меняет файлы b2b-partner-portal, Agent-ops-console и learn и не трогает рабочие деревья Codex.

## Открытые решения владельца

1. Принять Portfolio-first scope и карту изменений, полностью или с правками.
2. **Позиционирование.** Поручение 27.11 формулирует «Product designer who takes the design to code». 18.11 владелец выбрал «Product designer who turns design decisions into working interfaces» ([positioning.md](../../tasks/review-2026-11/positioning.md)). Рекомендация: оставить выбранное 18.11, смысл совпадает.
3. **Статус Stage 3.** Stage 2.8.5 фиксирует Stage 3 как заблокированный, при этом в b2b-partner-portal уже идут Stage 3.1–3.4. Нужна запись владельца с датой о том, когда и на каком основании запущен Stage 3.
4. Рамка Learn: коммерческий кейс о роли в DSSL или переработка с одной строкой контекста. Зависит от интервью.
5. Agent Ops в первом релизе или позже (AO-7).
6. Dashboard Partner Portal: седьмой экран или нет (PP-3).
7. Клипы: автовоспроизведение без звука или запуск по клику; ссылка на прототип в кейсе — оставить как дополнение или убрать.

## Ограничения этого исследования

- Новых исследований и поиска референсов не было. Из изображений открыты только два кадра бенчмарка. Закрытые кадры DSSL, Learn и Agent Ops не открывались, их статус взят из реестров.
- Приложения, сборки и браузерные тесты не запускались. Статусы экранов взяты из отчётов Stage 2.8.5 и Stage 3.x, а не из новой проверки.
- Тексты кейсов на сайте не перечитывались целиком; объём оценён по размеру файлов копии вместе с разметкой.
- Стоп-лист и Case identity в STRATEGY описывают подачу на уровне принципов. Визуальная проверка будет возможна после этапа 4.

## Источники

| Источник | Ветка | SHA |
|---|---|---|
| Site-portfolio, курс | `main` | `368fcd71cd` |
| Site-portfolio, база этой ветки: план, критерии, индексы 2.8.x | `codex/stage-2-8-4-nda-release` | `0ae938c0f6` |
| Решение по направлению Partner Portal | `codex/stage-2-5-partner-portal-direction-gate` | `24a848597a` |
| Stage 2.8.5 · Final Adjudication, Quality Matrix, решения владельца, готовность Stage 3 (приватно) | learn · `codex/stage-2-8-5-final-adjudication` | `9a12eb71ce` |
| Stage 2.8.4 · закрытие и inventory (приватно) | learn · `codex/stage-2-8-4-final-closure` | `cf1c03b93d` |
| Learn 2.7.2 · gate, реестр BEFORE | learn · `codex/learn-stage-2-7-2-facets` | `54648dd8d4` |
| Stage 3.4 · Product Details migration (приватно) | b2b-partner-portal · `codex/stage-3-4-product-details-migration` | `44756f52e1` |
| Stage 3.3.1 · Procurement First | b2b-partner-portal · `codex/stage-3-3-1-product-details-final-refinement` | `551b1e527a` |
| Stage 3.2.3 · Catalog | b2b-partner-portal · `codex/stage-3-2-3-final-typography-closure` | `620a088673` |
| Stage 3.1.1 · Foundation | b2b-partner-portal · `codex/stage-3-1-1-quality-closure` | `c7bc32355e` |
| Shift Board · Approvals | Agent-ops-console · `codex/stage-2-8-4-approvals` | `cd0d4d3e32` |
| Shift Board · direction gate | Agent-ops-console · `codex/stage-2-6-5-agent-ops-direction-gate` | `8f1c043fc8` |
| Бенчмарк портфолио, harmony-checklist | Site-portfolio, `research/portfolio-benchmark/` | в базе |
| Обратная связь ментора 02.10 и тимлида 18.11 | Локальные заметки и журнал сессии 18.11 | не в репозитории |

**Почему база — `0ae938c0`.** `main` не содержит записей этапов 0–2.8.x. Ветка `codex/stage-2-8-4-nda-release` — последняя в цепочке плана: в ней актуальный PLAN-CHATS, критерии и индексы, и это кандидат с очищенными NDA-материалами. Ветки Stage 2.8.5 в Site-portfolio нет: этот этап записан только в приватном learn.
