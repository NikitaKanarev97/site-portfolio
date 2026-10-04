# Pawly E · паспорта до capture · 04.10.2026

База 58002c398c3386c9df4b398f324ab07115c979f7. Источник строго read-only: D:/Claude-projects/PETS-walking, HEAD 06322ba; принятый runtime 7d975f0, catalogue 04 от 13.09.2026, acceptance 05/06. Кейс — самостоятельный концепт. Fixture датирован августом; это дата демонстрационной прогулки, не августовская версия UI.

## PAW-DS-01 · proof-system

Тезис: выбор изображения, зарегистрированное событие и предупреждение имеют разные значения. Эталон **HA-DS-01** — research/portfolio-rebuild-2026-10-03/references/ha-component-library.png (открыт целиком до capture).

Происхождение: настоящий принятый каталог `.tmp/pawly-walker-storybook`, компоненты src/components/{PhotoProof,TimelineRow,InfoNote}; новые DOM captures существующих states, без перерисовки UI или перевода его пикселей.

Точный состав (три матрицы, 11 states):

| Семейство | Состояния / story IDs | Группа |
|---|---|---|
| PhotoProof | pending, local, confirmed (compact), unavailable | care-evidence |
| TimelineRow | done, current, pending, with-nested-photo | care-evidence |
| InfoNote | hint, warning, disclosure | care-evidence |

Sending — состояние операции экрана, не выдуманный variant PhotoProof; показано в существующем return-proof фильме.

Раскладка: общий спокойный лист; foundation слева 35%, справа три отдельные матрицы с вертикальными states. После первой визуальной проверки от 04.10: одна общая группа care-evidence, PhotoProof/TimelineRow в двух колонках, InfoNote wide под ними. Это устраняет чрезмерную высоту первоначальных full-width групп. Foundation сокращён до двух реальных Inter ролей и трёх смысловых цветов. На mobile — foundation, затем последовательно PhotoProof, TimelineRow, InfoNote; все states доступны без JS. Никакого уменьшенного desktop-постера.

Сохранённые детали HA: одна поверхность, четыре колонки параметров/образцов, палитра под таблицей, пунктир вокруг семейства, естественная высота, вертикальная последовательность states и полный контраст продукта. Адаптации: три доменные семьи, компактная основа, отдельный реальный экран применения `order-details` до листа. Не повторяем 20 свотчей и чужие телеком-контролы.

Desktop captures: component width 343 CSS px (288 px responsive decorator для очень узкой доступной области), DPR2, transparent canvas, bleed 2 px. NativeWidth ограничивает увеличение. Для tile внутри nested TimelineRow ширина остаётся 165. Mobile не перестраивает controls руками — это их настоящий DOM со снятым ограничением внешнего story decorator, width 288 для читабельного размещения в 360px оболочке. Геометрия и значения компонента сохраняются.

EN caption: “Three families keep selection, events and warnings distinct. Accepted catalogue.”
RU caption: “Три семейства различают выбор, события и предупреждения. Принятый каталог.”
Summary: selected local photo is not confirmed; timeline pending is not completed; disclosure is an action, warning remains visible.
Конечный кадр: все 11 states видны; reveal только оболочки, без анимации состояния продукта. Проверить в сопоставимом масштабе с HA-DS-01, крупно углы и текст.

## PAW-RETURN-01 · return-boundary

Эталон HA-DS-01 не навязывает flow этому действию. Это применение настоящего UI, не новая схема. Active → local review → report. Переиспользуем September `active-service.webp`, `handover-photo-review.webp`, `order-details.webp` EN/RU. Целые mobile screens 390×844, DPR1.5; в подаче отдельные крупные шаги, nativeWidth 390. Все поля, фото, действия и подписи сохраняются. Report имеет две фотографии и 14:52; active обещает 14:50. Статичный fallback показывает обе границы без воспроизведения. EN: “Expected is not confirmed.” RU: “Ожидание ещё не подтверждение.”

## PAW-FILM-01 · existing return-proof

Переиспользуем существующий clip-return-proof MP4/WebM и poster, EN/RU. Около 11 секунд, реальные timestamp записи; без ускорения, loop и autoplay. Native controls через существующий MediaFrame film. Финал — report, оба события, затем в story показано одно начисление. Ограничение frozen ShotItem: film отсутствует, CaseScreen не передаёт его. До исправления G фильм — доступный native companion в собственном preview, ссылка из ранних facts. E-G-01 описывает точную интеграцию; renderer не копируем.

Фактическая приёмка E: full/reduce manual play подтверждён; без JS проверенный Chromium не получает metadata первого WebM (E-G-02), при этом poster/вся static sequence доступны. При ручном запуске фильм продолжает играть вне viewport (E-G-03); route departure останавливает, Back возвращает паузу. Эти ограничения не скрыты под общим PASS.

## PAW-COVER-01 / PAW-MATCH-01 / PAW-MONEY-01

Три разных текущих момента: walker profile / active / report. Cover screen phones, песочный цвет портфолио; мобильный cover показывает первые два момента, полный report ниже крупно. Подбор: реальные список и профиль в carousel, первый profile раскрывает потребности/пределы; дополнительный list доступен стрелкой. Деньги: один полный walker earnings screen, nativeWidth390, 950−171=779 как фикстура. Без декоративного финансового движения. Фото остаются внутри настоящего продукта, постановочные изображения и мерч не создаются.
