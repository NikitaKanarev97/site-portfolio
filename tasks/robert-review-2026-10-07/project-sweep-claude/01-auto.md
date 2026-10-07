# 01 — автоматический сбор (без картинок)

Скрипты: `scripts/sweep.mjs` (сбор), `scripts/analyze.mjs` (группировка). Сырые данные: `logs/sweep.json`, сгруппированные: `logs/analysis.txt`, тексты: `logs/text/*.md`.
Покрытие: 8 маршрутов (6 из задания, 404 и главная как эталон) × EN/RU × 1440/360 = 32 прохода, все загрузились. Открыто картинок: 0.

Формат: компонент → маршруты → примеры. A-номер — ID кандидата для этапов 2–4.

## T1 «ИИ-подача» типографики — 245 узлов капса с разрядкой ≤ 13 px, 64 номера, 10 цепочек «·». Mono в HTML-тексте: **0**.
- A01 CaseThesis eyebrow (12 px, капс): все 5 кейсов — Challenge / A closer look / Outcome / Audit → direction / Architecture / Purchase logic…
- A02 MetaList dt (12 px, капс): все 5 кейсов — Client / Year / Role / Platform / Evidence / Prototype / Work / Shown
- A03 CaseSteps: метки «01 · Find the cause», «01 · Veterinarian · tablet», «02 · Reception · desktop» в agent-ops, partner, vet, pawly (нумерация и цепочки)
- A04 CaseSpecimen: заголовки спецификаций и строки `32/42 · 600`, `24 · 12 pcs`, «Style / Use / Metrics / Sample» в partner, learn, pawly
- A05 CaseCover kicker: «AI support · Billing · Human oversight», «DSSL · B2B procurement», «Work project · reinterpreted in 2026» в agent-ops, partner, learn
- A06 CaseRoutes: «01 · Reference», «02 · Programme», «The same ONVIF material» в learn
- A07 about.astro: оглавление «01 Constraints ↓» … «04» в about
- A08 CaseNext: «NEXT CASE» (12 px, капс) во всех кейсах
- A09 CaseCarousel: счётчик «1 / 3» в vet и pawly
- Эталон: на главной таких узлов только два, «Selected work» и «404», то есть кейсы заметно шумнее главной.

## T2 Микрошум
- A10 CaseStory: секции по 7–14 мелких узлов (eyebrow, номера 1/2/3/4, цепочки со стрелками, подписи) в agent-ops (A closer look, n=14), partner, learn, pawly
- A11 CaseSpecimen: до 44 мелких узлов в одной секции (таблица типографики Style/Use/Metrics/Sample): partner (n=44), learn (n=20), pawly (n=17)
- A12 Дубли подписи и соседнего текста: CaseImpact «screens · accepted prototype» ~ абзац (agent-ops); CaseSpecimen «Pending · no confirmation» ~ «Pending» (pawly); CaseRoutes «The same ONVIF material» ~ тезис (learn); CaseCover «Row 38: …» ~ «38» (partner)

## T3 Глифы — 179 вхождений
- A13 DiagramCanvas: текстовые «→» в подписях рёбер (Dashboard → XLS import …), 144 шт. в partner, learn, vet
- A14 CaseCarousel: кнопки «←» «→» текстом в vet и pawly
- A15 about.astro: «↓» в ссылках оглавления
- A16 CaseThesis / CaseCallout / CaseSteps / CaseStory (aria): «Audit → direction», «Promotion first → procurement tasks first», «Icons alone → named destinations», «Cause → promise → decision» в agent-ops, partner, learn
- A17 CaseNumbers: «→» между числами в agent-ops
- Footer «Copyright 2026» — словом, глифа © нет (не кандидат)

## T4 Ложные элементы управления
- A18 CaseCallout: `case-callout__dot` — точки-маркеры у списков в agent-ops, partner, learn (нужен кадр)
- A19 CaseSteps (pawly): текст «Press play to follow a demo send…» и MediaFrame с play (нужен кадр)
- Остальное — шум детектора: крупные display-классы совпали по подстроке «dot»/«toggle».

## C1 Карточка в карточке — автоматически 0
- Детектор не нашёл контейнеров с паддингом ≥ 12 px вокруг скруглённого медиа. Класс **не закрыт**: CasePlate / ScreenSurface рисуют поле вложенными слоями, а не через padding. Проверка кадром на этапе 4.

## C2 Слияние с сайтом
- A20 CaseScreen без подложки: белый фон предка совпадает с фоном body, у картинки нет рамки или тени. Места: agent-ops (clusters-framed, evidence), partner (legacy-dashboard, order-details), learn (answer-desktop 1280×861, programme-desktop, completion-desktop, archive-catalog). На главной то же (WorkStage handover), поэтому проверить кадром, не рисует ли рамку сам растр.

## L1 Оси
- A21 CaseCover (вариант proof, agent-ops): две панели обложки со ступенькой 50 px по верху.

## L2 Интервалы
- A22 CaseThesis: H2 48 px → абзац 25 px (порог 32), 26 мест в agent-ops, partner, learn, pawly. В vet те же H2 → 32–48 px: внутри одного компонента два разных стыка.
- A23 CaseCover: vet H1 64 px → лид 16 px; agent-ops H1 128 px → панели 24 px.
- A24 about: H1 96 px → оглавление 25 px. Эталон-главная: 112 → 29 (близко к порогу, но принято).
- A25 Секционные паддинги CaseSheet 192/192 на desktop и 128 на mobile совпадают с эталоном. У About секции с `padding-top: 48`, без 192 — проверить кадром ритм About.

## L4 Масса (высоты, EN 1440)
- A26 CaseSheet: agent-ops 6368, vet 6655, pawly 9826, learn 10320, partner 11330 px. Partner почти вдвое длиннее agent-ops, на 360 — 15654 px.
- A27 CaseCover: agent-ops 803, partner 813, pawly 1115, vet 1153, learn 1289 px; на 360 vet 2179 и learn 2008 px против 881 у agent-ops.

## L5 Линии
- A28 DiagramCanvas: border-bottom под заголовком схемы, тёмная линия 1152 px в partner, learn, vet
- A29 CaseRoutes: тёмная border-bottom у списка и светлая border-top у каждого `details` в learn
- A30 about: оглавление с линиями сверху и снизу на всю ширину 1280 px
- Footer border-top — сквозной, есть и на эталоне (не кандидат)

## H1/H3 Иерархия и шаблоны
- A31 CaseCover: H1 в agent-ops 128/800 (вариант proof) против 64/700 у остальных четырёх; лид 48 px против 20 px. Один элемент — два шаблона.
- A32 CaseSteps H3: 48/700 в agent-ops и partner против 32/600 в vet и pawly.
- A33 About: H2 разделов (SectionHead) 24/600 — меньше тезисов кейсов (48) и H2 главной (32 в SectionHead, 96 в FeaturedCase). H1 96 против 112 на главной.
- A34 404: H1 32 px, а H2 «Страница не найдена» — 48 px. Русский H2 крупнее английского H1.
- A35 CaseThesis: в одном месте agent-ops H2 64/700 при 48/700 везде.

## K1 Ссылки-действия
- A36 TextLink `ds-link--inline` (с постоянным подчёркиванием) вне абзаца: в MetaList и обложке всех 5 кейсов («Live, invented data», «Open the live demo», «Open the demo», «Explore the EN demo»). Это действия, а оформлены как ссылки в прозе.
- A37 CaseCarousel: у кнопок `border-bottom` и текстовые стрелки (vet, pawly)
- A38 about: ссылки оглавления без SVG, с «↓» и номером
- A39 CaseNext: «NEXT CASE» капсом и название, без IconArrow (svg=false) — расходится с остальными CTA
- Кнопка CopyEmail «Copy email» есть только на главной, в контакте кейсов её нет. Нужно уточнить, намеренно ли.

## X1 Язык
- A40 CaseSteps partner EN: «камера 4мп уличная» — цитата строки из файла клиента в EN-тексте (вероятно, документальная; проверить подачу).
- A41 CaseStory: aria-label «source-in-context», «proof-system» — технические ключи вместо подписей, partner и pawly, обе локали.
- A42 Navbar: aria-label «Nikita Kanarev — NK» в RU не переведён (мелочь).
- A43 404 двуязычная, и на /ru/404 EN-блок идёт первым; контакт «Let's talk» и title «Page not found» английские; Navbar отсутствует.
- Имена продуктов в MetaList («Vet Clinic OS») и CaseNext допустимы.

## X2 Статусы и даты
- A44 CaseCover learn: «Work project · reinterpreted in 2026» / «Рабочий проект · переосмысление 2026» — прямо запрещённый класс («reinterpretation»). **P1**.
- A45 MetaList partner: «Independent reconstruction on synthetic data» / «Самостоятельная пересборка на демоданных» — статусная плашка в метаданных. **P1**.
- A46 CaseThesis partner: «The frames here are my independent reconstruction on synthetic data: they show the decisions, not…», «…selects eight real screens from the reconstruction», «In the reconstruction, row 38…». Раскрытие внутри текста, но повторено 3+ раза, поэтому читается как оправдание.
- A47 MetaList: vet «Real clinic under NDA; all demo data invented»; pawly «One demo booking; no live GPS, upload or payments»; «Synthetic QA across seventeen EN/RU routes» — статусные строки в метаданных.
- A48 TextLink: «Open the live demo», «Open the demo», «Explore the EN demo», «Live, invented data», «Открыть прототип с вымышленными данными» — «demo» как ярлык работы.
- A49 CaseThesis learn: «The prototype demonstrates the mechanism; the question bank still needs ex…» — по смыслу правила это «ещё нужно проверить».
- A50 about: «most of these builds are prototypes on synthetic data rather than production systems under load» — самообесценивание в About.
- A51 alt/aria CaseScreen: «demonstration document», «950 rouble demo charge», MediaFrame «demo send» описывают экран, вероятно документально.
- Годы: «2024–winter 2026» (vet), «Working prototype · 2026», «September 2026 · EN/RU», «2026». Год под превью не повторяется. «Working prototype» — статусная пометка, кандидат к A47.

## R1 Mobile 360
- Горизонтального overflow нет ни на одном маршруте (scrollWidth = 360).
- A52 TextLink-действия высотой 22 px (Open the live prototype, Open the demo, Try Learn…) во всех кейсах: цели < 44 px.
- A53 CaseScreen: кнопки «Enlarge» высотой 19–34 px в learn и pawly.
- Обрезанные тексты (104) — это visually-hidden «(external link…)» и «Next case: …», ложное срабатывание.
