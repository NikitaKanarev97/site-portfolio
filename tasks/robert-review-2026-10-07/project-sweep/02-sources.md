# Этап 2 — привязка и отсев

07.10.2026. Исходники не изменялись; поиск по классам/текстам из DOM, затем узкие фрагменты. Картинок открыто: 0.
1545 сырых записей сведены к 24 группам для проверки контекста/кадром. Группы ниже ещё не финальные находки.
DOM-компонент `BaseLayout` у About/404 — ближайший доступный scoped предок; фактический источник уточнён поиском.

| Группа | Класс | Источник | Область / тип | Дальнейшая проверка |
|---|---|---|---|---|
| A01 | T1 | src/components/CaseCover.astro:101,111 | Обложки Agent, Portal, Learn; общий компонент | Мелкие CAPS eyebrows |
| A02 | T1/T2 | src/components/CaseThesis.astro:42 | Все 5 кейсов; общий компонент | Повтор метки над/слева каждого тезиса |
| A03 | T1 | src/components/MetaList.astro:67 | Все 5 кейсов; общий компонент | CLIENT/YEAR/ROLE и статус в метаданных |
| A04 | T1/T2 | src/components/CaseSteps.astro:35,42 | Agent, Portal, Vet, Pawly; общий компонент | Общая метка + 01 · LABEL + подпись |
| A05 | T1 | src/components/CaseNext.astro:48 | Все 5 кейсов; общий компонент | NEXT CASE |
| A06 | T1/T3/L5/L2 | src/pages/about.astro:37,38,49,66,71 | About EN/RU, RU импортирует EN-шаблон | Номера, глифы ↓, линии; зазор 25px |
| A07 | T1 | src/components/CaseRoutes.astro:9,13 | Learn EN/RU; общий компонент | THE SAME ONVIF MATERIAL и 01 · REFERENCE |
| A08 | T1/T2 | src/components/CaseSpecimen.astro:16,29,32,39 | Portal, Learn, Pawly; общий компонент | Отличить каталог ДС от декоративного шума |
| A09 | T3 | src/components/CaseNumbers.astro:30 | Agent EN/RU; общий компонент | Текстовые стрелки в цепочке чисел |
| A10 | T3/K1 | src/components/CaseCarousel.astro:56,59,127 | Vet, Pawly EN/RU; общий компонент | Глифы стрелок; border — граница работающей кнопки |
| A11 | T3 | src/copy/cases/agent-ops-console.ts:416; src/copy/cases/learn.ts:221 | Agent, Learn и Portal; копи в общих story builders | Стрелки в редакционных labels/aria |
| A12 | T4 | src/components/CaseSteps.astro:53,187,190 | Agent, decision; общий компонент | Декоративный stop из двух i похож на pause |
| A13 | C2 | src/components/CaseScreen.astro:44,116 | Agent, Portal, Learn | Проверить действительный край изображения, не только фон предка |
| A14 | C1/C3 | src/components/CasePlate.astro:47,49,68; src/components/CaseCarousel.astro:201 | Сцены кейсов и карусели | Авто C1=0: порог площади пропускает большие поля |
| A15 | L1 | src/components/CaseCover.astro:336,364 | Agent; панели в одном ряду, top отличается на 50px | Кроп; геометрия трансформируемых панелей |
| A16 | L2 | src/components/CaseThesis.astro:66 | Agent, Portal, Learn, Pawly; общий компонент | 24–25px измеренного зазора после заголовка 48px |
| A17 | L2 | src/components/CaseNext.astro:80; src/components/CaseCover.astro:411 | Все кейсы; общий ритм | Стыки секций 452px при медиане 192px; вложенные секции отсечь |
| A18 | H1/H3/L4 | src/components/CaseThesis.astro:44; src/components/CaseCover.astro:101,112; src/components/CaseSpecimen.astro:14 | Все кейсы; разные variants | Все измеренные размеры/высоты в sweep.json; сравнить композицию |
| A19 | X1 | src/pages/404.astro:51 | /404 и /ru/404 | Явно двуязычная страница с lang=ru; не ошибка языка |
| A20 | X1 | src/copy/cases/partner-portal.ts (по цитате исходной строки) | Portal EN | Русский запрос внутри английского рассказа — цитата входных данных |
| A21 | X2 | src/copy/cases/learn.ts:206 | Learn EN/RU; общий story builder | Запрещённый статус в eyebrow, высокая уверенность |
| A22 | X2 | src/copy/cases/partner-portal.ts; src/copy/cases/vet-clinic.ts:72; src/copy/cases/pawly.ts:292 | Portal/Vet/Pawly | Статусное поле reconstruction; CTA demo; отделить факт о данных от статуса |
| A23 | R1 | src/components/CaseScreen.astro:44,84 | Learn/Pawly mobile | Зум-ссылки высотой 19–34px; часть внутри карусели за пределами текущего кадра |
| A24 | R1 | src/components/ServiceRoutes.astro (по классу service-routes); src/components/TextLink.astro | /404, /ru/404 mobile | Отдельные ссылки навигации 26px |

## Отсев автоматических записей

- T1: 71, 19, 38 — содержательные числа, а не номера разделов. Mono в видимом редакционном HTML не обнаружен.
- T3: DiagramCanvas — список связей для доступности и символы в диаграмме; скрытый список не считать видимыми редакционными стрелками.
- T4: Copyright содержит `copy`, но не является подсказкой копирования. Фраза Pawly «Press play» относится к работающему видео.
- L1: CaseSpecimen/CaseRoutes/CaseSteps часто стоят вертикально; большой spread при `sameRow=false` не доказывает сбитое выравнивание. LearnStage содержит два ряда: сравнивать только верхние карточки первого ряда.
- L2: отрицательный зазор в CaseCover/CaseSteps — элементы соседних колонок, не вертикальный стык. Вложенные секции не считать последовательными секциями страницы.
- L5: рамки таблицы specimen, строк раскрывающейся навигации и работающих кнопок выполняют функцию. Footer отделяет служебную область; сам факт линии не доказывает дефект.
- K1: skip-link появляется по focus; `.ds-link--inline` допускает подчёркивание внутри прозы. Border кнопок карусели не равен подчёркиванию CTA.
- X1: Vet Clinic OS, Next case: Vet Clinic OS — имя продукта. 404 явно показывает EN и RU с языковой разметкой. Русский запрос Portal — документальная цитата.
- X2: демонстрационный документ, вымышленные суммы, NDA и ограничения GPS/платежей — методологические факты; их нельзя механически удалить.
- R1: `.ds-visually-hidden` шириной 1px — доступный текст, а не обрезанный заголовок. Карусельные карточки справа находятся внутри горизонтальной прокрутки: body всех 14 mobile-состояний = 360px.

Точные строки копи и окончательное решение по оставшимся группам — этапы 3–4. Одна повторная проблема общего компонента будет одной строкой ISSUES.md.
