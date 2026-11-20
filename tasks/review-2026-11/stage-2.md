# Этап 2 — отчёт

**Ветка:** `stage-2-art-direction` в обоих репозиториях · **Статус:** 2.0 готово, 2.1 — ждёт решения владельца по ключевому экрану. Merge, push, деплой не выполнялись.

## 2.0 — Base SHA и изоляция

| Репозиторий | Base | Почему | Где |
|---|---|---|---|
| site-portfolio | `2bd9a99a` — голова `origin/planning/stage-2-partner-portal-first-2026-11-20` | План этапа 2 лежит в этой ветке; этапы 0–1 в main не смержены (main на `368fcd71`), ветка плана их содержит | worktree `D:\Claude-projects\Site-portfolio-stage2` |
| b2b-dssl (`b2b-partner-portal`) | `a4a4611` — `origin/main` | Содержит `6bbe1cd` (Cart V2), который снимал этап 1; локальный `main` отстаёт (`db7d1f3`) | worktree `D:\Claude-projects\b2b-dssl-stage2` |

Рабочие каталоги владельца не тронуты: `Site-portfolio` (main, правки `cv/fact-sheet.md`, `HHH/letters/…`) и `b2b-dssl` (`redesign/cart-v2`, незакоммиченные правки). Ответ ревьюера (DIRECTION §9) не получен — не учитывается.

**Разделение материалов.** В публичный репозиторий идут только выводы и статусы. Кадры слоёв 1–2 остаются в `D:\Design\Cases\Case\`; новые кадры прототипа и закрытое приложение к аудиту — в приватном `b2b-dssl`, `audit/stage-2-art-direction/`.

## 2.1 — Product audit

[art-direction/partner-portal/01-PRODUCT-AUDIT.md](art-direction/partner-portal/01-PRODUCT-AUDIT.md). Решение владельца — в разделе 5 там же.
