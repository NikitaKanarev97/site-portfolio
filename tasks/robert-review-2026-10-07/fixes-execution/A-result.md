# Пакет A · стабильная передача

07.10.2026. Локальные правки завершены; чужие изменения сохранены. Copy B принят в текущем состоянии. Build/check/css/content/harmony, общая визуальная матрица, commit/push/deploy не запускались.

**Закрытые технические пункты:** M06, M07, M09, M10 (карусель/числа), M11–M13, M15–M16, M18 (композиция), M19, M20 (раскрытие), M21, M26–M27, M30, M35 (композиция), M37–M39, M40 (CaseRoutes), M41, M46.

- M06/M07/M09/M37: сняты eyebrows тезисов, номера/служебные цепочки шагов и дублирующие нижние captions. Шаг показывает H3 и один body (caption используется только при отсутствии body); единая роль ds-heading-3xl. Остальные метки — ds-meta-sm без uppercase/tracking-wide.
- M10/M11/M13/M15/M46: IconArrow в карусели и числах; Human review — компактный SVG человека. Действия в MetaList используют TextLink arrow. Ссылка продукта снята с перехода CaseNext и остаётся в фактах текущего кейса. CaseNext показывает одно переносимое название без marquee.
- M12/M16/M21/M41: annotations больше не включают белую карточку frame; остаются пины и их легенда без дополнительных линий. Zoom-ссылка имеет min-block-size space-12 (48 px); карусель сохраняет 48×48. У specimen сняты пунктирные рамки семейств.
- M18/M26/M27: обложки используют ds-display-6xl, ds-heading-xl и общий header 3:2 от bp-lg. На mobile cover Learn/Vet — один кадр; полноценные материалы остаются в рассказе. У LearnStage в cover нет дублирующего внутреннего заголовка; на Home пустой detail не рендерится. Пустой caption обложки также не создаёт узел/отступ.
- M19: Pawly return-boundary — три колонки с общими строками текста/телефонов через subgrid; короткий текст больше не стоит сбоку высокого телефона. Малые панели и отдельный телефон получают компактное поле вместо большого пустого холста. Сохранены целые изображения и native manual film.
- M20: таблица кеглей/палитра полностью сняты. Выбранные B доменные состояния остаются доступными в native details: desktop раскрыт с JS, mobile свернут; без JS раскрывается нативно. Смена размера обновляет open, toggle использует существующий data-case-route refresh в animations.js.
- M30/M35/M39/M40: имя секции берётся из thesis/title/caption, технический block.id не озвучивается. Все обычные итоги собраны в спокойное поле Result/Trade-off; крупный тёмный итог Agent сохранён. Кадры CaseRoutes стоят на CasePlate; декоративные линии списка/details убраны.
- M38: перед изменением просмотрен существующий `project-sweep-claude/evidence/partner-portal-en-1440-thesis-L2.png`. В текущем исходнике body уже использовал flow-node (32 px); этот общий стык сохранён, flow-pair к абзацу не добавлялся. Снят отдельный служебный label и выровнена ось текста.

**Изменённые исходники (только владение A):**

`src/components/Case{Cover,Steps,Thesis,Next,Routes,Numbers,Carousel,Screen,Callout,Specimen,Shot,Story,Impact}.astro`, `src/components/MetaList.astro`, `src/components/LearnStage.astro`, `src/components/VetStage.astro`.

**Локальная проверка:** 16/16 Astro transform + CSS parse; scoped git diff --check без ошибок. Это проверка синтаксиса компонентов, не общий Astro typecheck/build. Лог: `A-local-check.txt`.

**Адресная проверка браузером:** действующий dev `127.0.0.1:4410`, финальный прогон 19 проверок / 0 ошибок JS и assertions. Первичная ошибка геометрии Pawly исправлена; финальные изображения заменили промежуточные. Скрипт `A-targeted.mjs`, результат `A-targeted.json`.

| Маршрут | Размер / motion | Проверенные состояния |
|---|---|---|
| `/work/pawly/` | 360×900 / reduce | next карусели 1→2, кнопка 48×48; zoom второго слайда; Escape; возврат keyboard focus |
| `/work/learn/` | 360×900 / reduce | один кадр cover; specimen закрыт → открытие Enter; foundation отсутствует; native zoom target ≥44; кадр CaseRoutes на поле |
| `/ru/work/vet-clinic/` | 360×900 / reduce | один кадр cover |
| `/work/agent-ops-console/` | 1440×900 / обычное движение | is-focused; финальный decision после прокрутки; человек 48×48 и целая approval-card; один CaseNext title без marquee |
| `/work/pawly/` | 1440×900 / обычное движение | все три телефона return-boundary: одинаковая верхняя ось, ширина >200 px, положение ниже текста |

**Доказательства, адресно просмотрены:** `A-agent-focus-desktop.png`, `A-pawly-steps-desktop.png`, `A-learn-routes-mobile.png`. Полный EN/RU визуальный PASS не заявляется.

**Осталась общая приёмка координатора:** совместный EN/RU результат, общая геометрия и единый прогон build/check/css/content/harmony. Те же состояния карусели/zoom/финального gate повторять только при новом изменении/ошибке. Запрос по документации в его владении: синхронизировать `ds/components.md` (MetaList arrow; общие cover/step роли; CaseThesis без видимого label; compact phone сцены; CaseSpecimen без foundation с native details; CaseNext без marquee), `ds/story-contract.md` §Actual specimen и описание CaseNext в `ds/motion-concept.md`. Новых токенов/компонентов нет; IconArrow и токеновые зеркала не изменялись. Адресный запрос B по пустому learn.detail закрыт.
