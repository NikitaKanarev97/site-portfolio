# Единый hover превью · 08.10.2026

| Before | After | Why |
| --- | --- | --- |
| Hover трансформирует WorkStage; фон Agent принадлежит родителю, остальные фоны WorkStage | Hover трансформирует общий featured-case__stage | Все пять визуальных превью движутся вместе с фоном |
| Reduced-motion сбрасывает transform через hover override | Движение только в can-hover + no-preference; reduce отключает переходы | Неподвижное доступное состояние без анимации |

Изменён только CSS FeaturedCase.astro и две спецификации ДС. Подъём -space-1 (-4 px), motion-hover; заголовок, outcome и footer неподвижны, CTA arrow +space-1 вправо. WorkStage, вложенные сцены и полные кейсы не менялись. Семантика ссылок и stretched target сохранены.

Проверка CUA: все пять тем, EN/RU, 1440×900 и 360×900 — 20 hover-проверок. Во всех stage matrix(1,0,0,1,0,-4), inner/head/foot transform none; CTA arrow вправо. Keyboard focus CTA Agent сохраняет solid outline и правильный href. Переполнения и ошибок browser console не обнаружено. Данные: hover-checks.json; визуальная проверка: agent-hover.png.

npm run build: успешно, 37 страниц. npm run check:css: 0 dead rules. Полные логи build.log и css.log. Astro type-check не повторялся для CSS-only правки; предыдущий прогон 08.10: 0 errors / 0 warnings. Reduced-motion проверен по условиям скомпилированного CSS; runtime-эмуляции в CUA нет.

Публикация: origin/main, коммит 3c4245429af3c667cce70996446b486bb662f2ed. Vercel dpl_HTSdW4C5YewYVWdneeovtkhoSMd4 — production READY, kanarev.com назначен. На https://kanarev.com/ru/ подтверждены Agent и Portal: общий stage -4 px, inner none, ошибок console нет. Данные production-checks.json, снимок production-agent-hover.png. Runtime logs/log drains отдельно не запрашивались.
