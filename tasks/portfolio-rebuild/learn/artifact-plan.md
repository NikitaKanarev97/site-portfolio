# Learn · паспорта до capture · 04.10.2026

## learn-content-model → HA-MAP-01 → блок shared-material

Тезис: справочник и программа ссылаются на один материал; чтение, завершение и попытка являются разными записями. Источник: PRD §4.2/5.3, sitemap MECE, текущие trajectories.ts / Player.tsx / MaterialPage.tsx. Происхождение: редакционная карта нынешней модели, не исторический PRD/снимок IA.

Точный состав: Question (вход, функция «найти ответ»), Programme (вход, «состав и порядок»), Material (общий объект, «версия + дата», «полный ответ»), Reading (History), Completion (явное действие в Player), Assessment (Neutral, отдельная попытка). Пять связей без стрелок: Question→Material; Programme→Material; Material→Reading; Material→Completion; Completion→Assessment. Номеров нет: это сущности, а не страницы.

Desktop: два входа сверху по краям, материал крупно в центре, три типа записи ниже; финальная геометрия 132×76 cells. Mobile: два входа вертикально, один материал, независимые reading/completion под ним, assessment последним; те же IDs/edges, финальная геометрия 31×112 cells, натуральный кегль. Иерархия и функциональные группы HA сохранены: спокойное поле, прямоугольные узлы, тонкая ортогональная гребёнка без наконечников, пунктир функций с подчёркиванием. Адаптация: сходящиеся входы и отсутствие фиктивных badges; compact mobile. Внешних links/глобальных страниц нет, поскольку они не объясняют тезис.

EN caption: Editorial content model. Two entrances, one material, separate records.
RU caption: Редакционная модель: два входа, один материал, отдельные записи.
Summary EN/RU хранится в data. Статика = полный конечный граф; draw once, без зависимости понимания от анимации. Итоговые кадры: shots/{en,ru}-1440-shared-material.png, shots/en-390-shared-material.png; comparison-reference-map.png.

## learn-content-theme → HA-DS-01 → блок content-language

Тезис: task colour остаётся в карточке/материале/программе; зачёт нейтрален, достоверность нейтральна, прогресс счётный. Источник: accepted product Card, TrustHeader, ProgressMeter; content.css / primitives.css; реальные Home routes; AssessmentIntro. Происхождение: specimens из текущей переработки, без реконструкции controls.

Первоначальный состав до capture: 3 Onest роли. Финальная документальная выборка после проверки доступного родного шрифта: 2 реальные Bold роли, Display/4xl 44/50.6 700 и Heading/3xl 32/43.2 700; Semibold не синтезируется. Палитра 5 semantic entries: Setup #0A66CE, Project #6D3EEA, Handover #D6207A, Explore #0E9E86, Neutral #3A4C66. Golos Text/JetBrains Mono видны в captures; не выдаются за Onest.

Правая группа tasks: Card Setup/Project/Handover/Explore с настоящими названиями, result и количеством единиц из Home (4 состояния контентного режима, не invented interaction states). Правая группа records: TrustHeader версия/дата/время и ProgressMeter position 3/11. Neutral показывается соседним отдельным крупным AssessmentIntro, а не миниатюрой целого экрана в листе. Весь выбранный материал доступен без JS.

Desktop: native CaseSpecimen 35:65; foundation left, реальные карточки в двух колонках справа; две компактные контекстные детали ниже. Таблица четыре колонки и реальные параметры; palette below; пунктир вокруг семейства. Не полный каталог после Portal. Mobile: foundation → Card modes с narrow 288 DOM → TrustHeader → ProgressMeter; neutral крупно следующим материалом. Типографика не уменьшается до miniature.

Сохранены HA: 4-column table, palette under it, более широкая область components, vertical states, dashed sets, естественная разная высота. Адаптации: 2 роли / 5 цветов / 3 семейства по смыслу Learn, task modes вместо generic disabled controls, native alpha и mobile DOM. Card переснят при 312 CSS desktop / 288 mobile (+4 bleed), чтобы текст оставался родным в фактической колонке. TrustHeader/ProgressMeter — компактные родные 288px в обеих версиях. Материал/landing рядом доказывают применение. EN caption: Real components. Task colours stay separate from result states.
RU caption: Реальные компоненты: цвет задачи отделён от состояния результата.
Статика/конец motion: все темы и обе детали открыты. Итоговые кадры shots/{en,ru}-1440-content-language.png, shots/en-390-content-language.png; comparison-reference-theme.png.

## Центр one-material — два контекста

Не отдельная нотация HA. Реальный `/material/onvif-not-found` и `/player/puskonaladka/2`: одинаковый material ID, заголовок, TrustHeader и тело; разный контекст и действия. Capture показывает первый рабочий viewport без изменения текста. Длинная статья не уменьшается целиком: отдельная третья остановка показывает настоящий конец того же материала с целой explicit-completion action. Mobile снимается заново; Player mobile может начинаться с открытого материала после естественного scroll к чтению, не с длинного списка sidebar. Один shared focus-stage, три остановки. Native list в reduce/no-JS/short/mobile. Финал — программа с explicit completion; reading не превращается в done. Запись вперёд/назад без ретайминга. Внешняя зависимость general marquee B-G-01 не разрешает менять runtime C.

Уточнение перед съёмкой Card: текущий Home использует MaterialRow, поэтому Card берётся из accepted Storybook `components-card--default` в четырёх contentMode. Args задают реальные названия/метаданные программ из trajectories.ts; это документированный fixture компонента, не снимок использования Card в нынешнем Home. Применение темы подтверждают реальные Material/Player и Home/landing. Никакой новый interaction state не рисуется.
