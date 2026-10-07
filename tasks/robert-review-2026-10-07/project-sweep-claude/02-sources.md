# 02 — привязка к исходникам

Общий принцип: одна проблема в общем компоненте = одна группа. Копи EN — `src/copy/cases/*.ts` (для learn, vet, pawly в том же файле через `t(en, ru)`), RU partner — отдельный `src/copy/ru/cases/partner-portal.ts`.

## Общие компоненты (одна правка = много мест)

| Группа | Кандидаты | Источник | Маршруты |
|---|---|---|---|
| G1 eyebrow тезиса | A01, A16 (часть) | `src/components/CaseThesis.astro:42` `ds-meta-xs case-thesis__label`; тексты — `thesis.label` в копи | все 5 кейсов, EN/RU |
| G2 стык тезиса | A22 | `CaseThesis.astro:56` `.case-thesis__text { margin-block-start: var(--flow-pair) }` = 12 px (`tokens.css:327`), при том что `ds-flow-heading` даёт `--flow-node` = 32 px (`global.css:114`). В vet тот же компонент в другой раскладке (`:84–95`) — отсюда разные стыки | agent-ops, partner, learn, pawly |
| G3 метки MetaList | A02 | `src/components/MetaList.astro:67,75` `ds-meta-xs` у `dt` | все 5 кейсов |
| G4 ссылки-значения MetaList и CaseNext | A36, A52 | `MetaList.astro:82` и `CaseNext.astro:59`: `<TextLink external>` без `type` → по умолчанию `inline` (`TextLink.astro:42`), постоянное подчёркивание (`:113`). Комментарий `MetaList.astro:33` фиксирует, что так задумано, — это расходится с эталоном главной | все 5 кейсов |
| G5 номера и цепочки шагов | A03 | `src/components/CaseSteps.astro:35,42–43`: `pad(i+1) · step.label`, `ds-meta-xs` | agent-ops, partner, vet, pawly |
| G6 размер тезиса шага | A32 | `CaseSteps.astro:45`: `ds-heading-4xl` при `variant=focus` или `layout=wide`, иначе `3xl` | agent-ops, partner против vet, pawly |
| G7 kicker обложки | A05, A44 | `src/components/CaseCover.astro:101,111` `ds-meta-xs case-opening__eyebrow`; тексты — `media.eyebrow` (`agent-ops-console.ts:388`, `partner-portal.ts:14`, `ru/partner-portal.ts:11`, `learn.ts:206`) | agent-ops, partner, learn |
| G8 два шаблона обложки | A31, A23, A21, A27 | `CaseCover.astro:103` (editorial: `ds-display-5xl` + лид `ds-heading-xl`) против `:113–114` (proof: `ds-display-7xl` + `ds-heading-4xl`) против `:150,174,196` (`7xl`/`6xl`). Agent-ops `layout: 'interlock'` | все 5 кейсов |
| G9 подпись «Next case» | A08, A39 | `CaseNext.astro:48` `ds-meta-xs case-next__label`; текст — `site.ts:108`, `[slug].astro:23` | все 5 кейсов |
| G10 стрелки в DiagramCanvas | A13, A28 | `src/components/DiagramCanvas.astro:111` (heading), `:386` (`.dg__heading` с border-bottom); подписи рёбер с «→» — в данных схем | partner, learn, vet |
| G11 карусель | A09, A14, A37 | `src/components/CaseCarousel.astro:56,59` (текстовые ← →), счётчик и border-bottom там же | vet, pawly |
| G12 CaseSpecimen | A04, A11 | `src/components/CaseSpecimen.astro` (таблица Style/Use/Metrics/Sample, строки `32/42 · 600`) | partner, learn, pawly |
| G13 CaseCallout | A16 (часть), A18 | `src/components/CaseCallout.astro:43,51,94` — нумерованные кружки-пины и `--list`; тексты меток со стрелками `partner-portal.ts:25` | agent-ops, partner, learn |
| G14 CaseRoutes | A06, A29 | `src/components/CaseRoutes.astro:9,13` (`0{i+1} · label`), `:33–34` (линии) | learn |
| G15 CaseNumbers | A17 | `src/components/CaseNumbers.astro:29–30` текстовая «→» в `ds-display-5xl` | agent-ops |

## Разовые места

| Кандидат | Источник | Маршруты |
|---|---|---|
| A07, A15, A30, A38 оглавление About | `src/pages/about.astro:35–38` (номер, «↓», `:66` `border-block`) | about EN/RU |
| A24, A33, A25 иерархия About | `about.astro:50` `SectionHead size="sm"` → `ds-heading-2xl` 24 px (`SectionHead.astro:33`); главная использует `lg` | about |
| A34, A43 404 | `src/pages/404.astro` (двуязычная, H1 через SectionHead 32 px, RU H2 48 px; без Navbar); «Let's talk» — `site.ts:100` | /404, /ru/404 |
| A41 технические aria-label | `id: 'source-in-context'` (`partner-portal.ts:44`, `ru/partner-portal.ts:39`), `id: 'proof-system'` (`pawly.ts:289`) попадают в aria-label через CaseStory | partner, pawly |
| A42 aria Navbar | `Navbar.astro` brand aria «Nikita Kanarev — NK» в обеих локалях | все |

## Текст (статусы, X2) — подробности на этапе 3

| Кандидат | Источник |
|---|---|
| A44 | `src/copy/cases/learn.ts:206` |
| A45 | `src/copy/cases/partner-portal.ts:18`, `src/copy/ru/cases/partner-portal.ts:14` |
| A46 | `partner-portal.ts:48` (+ evidence `ru/…:44`) |
| A47 | `vet-clinic.ts:71–72`, `pawly.ts:37,280,291` |
| A48 | `partner-portal.ts:53`, `pawly.ts:292` (EN-ярлык «Explore the EN demo»), `agent-ops-console.ts:403` |
| A49 | `learn.ts:263` |
| A50 | `src/copy/about.ts:78` |
| A40 | `partner-portal.ts:36`, `ru/…:32` |

## Отсеяно на этапе 2

- R1 clipped (104): visually-hidden «(external link…)», «Next case: …» — так и должно быть.
- T4 по подстрокам `dot`/`toggle` у display-классов — шум детектора.
- Footer border-top, «Copyright 2026» — сквозное на эталоне.
- X1 «Vet Clinic OS», имена продуктов в CaseNext — названия.
- A51 alt/aria «demonstration document», «950 rouble demo charge» — описание документального содержимого экрана (в UI там так и написано). Оставлено, но с низкой уверенностью: alt тоже публичная поверхность по CONTENT-RULES. Решение — владельцу.
- 404 двуязычная — архитектурное решение для статической выдачи, не ошибка перевода. Остаётся как P3 по порядку блоков.
