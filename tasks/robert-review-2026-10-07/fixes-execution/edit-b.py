from pathlib import Path
import re
import shutil
import sys

root = Path(__file__).resolve().parents[3]
out = Path(__file__).resolve().parent

def edit(rel, fn):
    p = root / rel
    backup = out / 'B-before' / rel
    backup.parent.mkdir(parents=True, exist_ok=True)
    if not backup.exists():
        shutil.copy2(p, backup)
    text = p.read_text(encoding='utf-8')
    result = fn(text)
    p.write_text(result, encoding='utf-8', newline='')

def swap(s, pairs):
    for old, new in pairs:
        if old not in s:
            raise ValueError(f'Missing text: {old[:100]}')
        s = s.replace(old, new)
    return s

def learn(s):
    start = s.index('export function makeLearnStory')
    head, tail = s[:start], s[start:]
    tail = swap(tail, [
      ('Work project · reinterpreted in 2026', 'Technical learning'),
      ('Рабочий проект · переосмысление 2026', 'Техническое обучение'),
      ("        caption: t('One material: a quick answer and a step in a path.', 'Один материал: быстрый ответ и шаг программы.'),\n", ''),
      ('Open the prototype', 'Open product'), ('Открыть прототип', 'Открыть продукт'),
      ('Open the introduction', 'Open website'), ('Открыть представление продукта', 'Открыть сайт'),
      ('Audit → direction', 'Design direction'), ('Аудит → направление', 'Решение после аудита'),
      ('The archive leads with courses, ratings and rewards. I reframed entry around a question or programme, with the answer open to read without an account.', 'The archive leads with courses, ratings and rewards. Returning to my work at DSSL / TRASSIR, I reframed entry around a question or programme, with the answer open before sign-in. The screens use invented account and document data.'),
      ('Архивный каталог начинает с курсов, рейтингов и наград. Я перенёс вход на рабочий вопрос или программу: полезный ответ доступен ещё до авторизации.', 'В архивном каталоге сначала идут курсы, рейтинги и награды. Я вернулся к своей работе в DSSL / TRASSIR и сделал входом рабочий вопрос или программу: ответ можно прочитать до авторизации. Данные аккаунтов и документов на экранах вымышлены.'),
      ('Вход определён курсами', 'Каталог начинается с курсов'),
      ('One material, two entrances', 'A shared material connects reference and programme'), ('Один материал, два входа', 'Справочник и программа используют общий материал'),
      ('Two entrances, one material, separate records.', 'Materials, programmes and their reading and completion records.'), ('Два входа, один материал, отдельные записи.', 'Связи материалов, программ и записей чтения и завершения.'),
      ('Полный ответ имеет свой адрес, версию и дату. Учебный путь предложен рядом с ответом.', 'У ответа есть ссылка, версия и дата обновления. Рядом можно выбрать программу, в которую он входит.'),
      ('Reading does not finish a unit', 'Completion needs an explicit action'), ('Прочитать — ещё не завершить', 'Завершение нужно подтвердить'),
      ('Four task modes persist across contexts. Trust information stays neutral; programme position is a count.', 'Cards identify four tasks: setup, project, handover and product exploration. The material header shows its version and update date; the programme position is shown as 3 of 11.'),
      ('Четыре режима задачи сохраняются между контекстами. Достоверность нейтральна; позиция в программе выражена счётом.', 'Карточки различают пусконаладку, проектирование, сдачу объекта и обзор линейки. Над материалом указаны версия и дата обновления, а в программе — текущая позиция: 3 из 11.'),
      ('The prototype demonstrates the mechanism; the question bank still needs expert validation.', ''),
      ('Прототип показывает механику; банк вопросов ещё требует экспертной проверки.', ''),
      ('The landing introduces the same material and programme. A real product example carries the promise into the experience.', 'The landing shows an ONVIF answer and the programme contents before the reader opens the product.'),
      ('Лендинг знакомит с теми же материалом и программой. Реальный пример продукта переносит обещание в рабочий опыт.', 'На лендинге можно посмотреть ответ об ONVIF и состав программы перед переходом в продукт.'),
      ('Learn landing with a real material and programme preview', 'Learn landing with an ONVIF material and programme preview'), ('Лендинг Learn с реальными примерами материала и программы', 'Лендинг Learn с материалом об ONVIF и составом программы'),
      ('Модель работает, эффект не измерен', 'Справочник и программа связаны'),
      ('Both routes are built and checked in every state, at every screen size. Usability with specialists and learning outcomes are not yet measured.', 'The product includes finding an open technical answer and following a programme through explicit completion and assessment. Reading history, completed units and assessment attempts are recorded separately.'),
      ('Оба маршрута собраны и проверены во всех состояниях на всех размерах экрана. Юзабилити со специалистами и учебный эффект ещё не измерены.', 'Собраны поиск открытого технического ответа и прохождение программы с явным завершением и отдельным зачётом. История чтения, завершённые единицы и попытки зачёта учитываются отдельно.'),
      ("label: t('Cost', 'Цена решения')", "label: t('Trade-off', 'Компромисс')"),
      ('Explicit completion costs one extra action. In the prototype, progress lives in the browser; accounts and certificates are simulated.', 'Explicit completion adds an action after reading each unit.'),
      ('Явное завершение стоит одного лишнего действия. В прототипе прогресс живёт в браузере; аккаунт и сертификаты симулированы.', 'После чтения каждой единицы нужно отдельно подтвердить завершение.'),
      ("          nextEvidence: { label: t('Next evidence', 'Следующая проверка'), text: t('Test with specialists, validate the question bank, measure answer finding and programme continuation.', 'Тест со специалистами, проверка банка вопросов, замер поиска ответа и продолжения программы.') },\n", ''),
      ("t('Try Learn', 'Открыть Learn')", "t('Open product', 'Открыть продукт')"),
    ])
    tail = re.sub(r'            type: \[.*?            groups:', '            type: [], colors: [],\n            groups:', tail, count=1, flags=re.S)
    tail = re.sub(r"              \{ id: 'card-setup-project'.*?              \{ id: 'trust-header'", "              { id: 'task-cards', title: t('Task cards', 'Карточки задач'), group: 'tasks', states: cards.map(([id,en,ru]) => ({ id, label: t(en,ru), mediaId: `theme-${id}`, shot: shot(`theme-${id}`, `${en} task card`, `Карточка задачи: ${ru}`,316) })) },\n              { id: 'trust-header'", tail, count=1, flags=re.S)
    return head + tail.replace('are explicit. \',', 'are explicit.\',').replace('порог видимы. \',', 'порог видимы.\',')

def pawly(s):
    start = s.index('export function createPawlyStory')
    head, tail = s[:start], s[start:]
    tail = swap(tail, [
      ('Selected return photo, not sent; play the native recording of demo send and report.', 'Selected return photo before sending; video follows sending and opening the report.'),
      ('Выбранное фото возвращения ещё не отправлено; нативная запись демоотправки и перехода к отчёту.', 'Выбранное фото возвращения перед отправкой; видео показывает отправку и открытие отчёта.'),
      ('950 rouble demo charge', '950 rouble charge'), ('демонстрационная сумма 950 рублей', 'сумма 950 рублей'),
      ('Accepted Pawly ${en}; original English UI.', 'Pawly ${en} state.'), ('Принятый компонент Pawly: ${ru}; исходный UI на английском.', 'Состояние Pawly: ${ru}.'),
      ('Care, in three component families', 'Photo confirmation and walk events'), ('Забота в трёх семействах компонентов', 'Подтверждение фото и события прогулки'),
      (",state('photo-unavailable','Unavailable image · event stays recorded','Картинка недоступна · событие сохранено')", ''),
      (",state('timeline-pending','Pending','Ожидание'),state('timeline-photo','Event with a photo','Событие с фотографией')", ''),
      ("      {id:'info-note',title:'InfoNote',group:'care-evidence',wide:true,states:[state('note-hint','Hint','Пояснение'),state('note-warning','Warning','Предупреждение'),state('note-disclosure','Disclosure · explicit action','Раскрытие · явное действие')]},\n", ''),
      ('Selection, events and warnings: one family each.', 'Photo confirmation stays separate from the walk’s current step.'), ('Выбор, события и предупреждения — по семейству на каждое. Интерфейс каталога на английском.', 'Подтверждение фото отделено от текущего этапа прогулки. На кадрах — английский интерфейс.'),
      ('A familiar face. A clear return. Proof the dog is home.', 'An owner chooses a walker and receives confirmation that the dog is home.'), ('Знакомое лицо. Понятное возвращение. Подтверждение, что собака дома.', 'Владелец выбирает выгульщика и получает подтверждение возвращения собаки.'),
      (",{term:t('Evidence','Проверка'),value:t('Synthetic QA across seventeen EN/RU routes','Синтетические прогоны семнадцати маршрутов EN/RU')}", ''),
      ('and what has actually been received.', 'and what has actually been received. Characters and scenario data shown here are invented.'), ('и какое подтверждение уже получено.', 'и какое подтверждение уже получено. Персонажи и данные показанного сценария вымышлены.'),
      ('Compatible walker list for a 45-minute 950 rouble fixture.', 'Compatible walkers for a 45-minute walk costing 950 roubles.'), ('Подходящие исполнители для фикстуры 45 минут, 950 рублей.', 'Подходящие выгульщики для прогулки на 45 минут за 950 рублей.'),
      ('Press play to follow a demo send into the report.', 'The video follows sending the photo and opening the report.'), ('Нажмите воспроизведение: демоотправка ведёт к отчёту.', 'Видео показывает отправку фотографии и переход к отчёту.'),
      ('The same walk, one earning', 'The walk produces a single earning'), ('Одна прогулка — одно начисление', 'За прогулку начислено 779 рублей'),
      ("label:t('What is complete','Что завершено')", "label:t('Result','Результат')"),
      ("label:t('The boundary','Граница')", "label:t('Trade-off','Компромисс')"),
      ('One demo booking; no live GPS, upload or payments. Choosing and sending add a deliberate step.', 'Choosing the walker and sending a return photo each require an explicit action.'), ('Одна демобронь; без живого GPS, загрузки и платежей. Выбор и отправка требуют отдельного шага.', 'Выбор выгульщика и отправку фото возвращения нужно подтвердить отдельными действиями.'),
      (",nextEvidence:{label:t('Next question','Следующий вопрос'),text:t('Do owners and walkers understand these boundaries in a real task?','Понимают ли владельцы и исполнители эти границы в реальной задаче?')}", ''),
      ("t('Explore the EN demo','Открыть демо на русском')", "t('Open product','Открыть продукт')"),
    ])
    tail = re.sub(r'    type:\[.*?    groups:', '    type:[], colors:[],\n    groups:', tail, count=1, flags=re.S)
    return head + tail

def vet(s):
    start, end = s.index('export function makeVetStory'), s.index('export const vetClinic =')
    head, tail, rest = s[:start], s[start:end], s[end:]
    tail = swap(tail, [
      ('One visit. Different responsibilities.', 'The vet, receptionist and owner handle their parts of the visit.'), ('Один визит. Разные зоны ответственности.', 'Врач, администратор и владелец ведут свои части приёма.'),
      ("{term:t('Delivery','Результат'),value:t('Working prototype · 2026','Рабочий прототип · 2026')}", "{term:t('Year','Год'),value:'2026'}"),
      ("      {term:t('Data','Данные'),value:t('Real clinic under NDA; all demo data invented','Реальная клиника под NDA; все демо-данные вымышлены')},\n", ''),
      ('I separated a useful trace from the complete record.', 'The clinic is under NDA; names and clinical data shown here are invented. I separated a useful trace from the complete record.'), ('Я отделил полезный след от полной записи.', 'Клиника защищена NDA; имена и медицинские данные на экранах вымышлены. Я отделил полезный след от полной записи.'),
      ("caption:t('Each role gets only its part of the visit.','Каждая роль получает только свою часть визита.')", "caption:t('Prescription, invoice and published summary.','Назначение, счёт и опубликованная выписка.')"),
      ('One visit · three views', 'Visit handoff'), ('Один визит · три представления', 'Передача результатов приёма'),
      ('Veterinarian · tablet', 'Veterinarian'), ('Врач · планшет', 'Врач'), ('Reception · desktop', 'Reception'), ('Регистратура · desktop', 'Администратор'), ('Owner · phone', 'Owner'), ('Владелец · телефон', 'Владелец'),
      ('Diagnosis and private notes stay in the clinic; payment happens outside the prototype.', 'Diagnosis and private notes stay in the clinic.'), ('Диагноз и приватная заметка остаются в клинике; оплата происходит вне прототипа.', 'Диагноз и приватная заметка остаются в клинике.'),
      ('Saved does not mean published', 'Publication preserves the owner’s copy'), ('Запись и выписка живут отдельно', 'Публикация сохраняет выписку владельца'),
      ('A working path, with clear limits', 'The visit connects all three roles'), ('Рабочий путь с ясными границами', 'Результаты приёма доступны трём ролям'),
      ("label:t('Cost','Цена решения')", "label:t('Trade-off','Компромисс')"),
      ('Save and Publish are two actions, not one. The prototype keeps data in one browser and does not store past versions.', 'The doctor saves the record and publishes the owner’s summary in separate actions.'), ('Сохранение и публикация — два действия, а не одно. Прототип хранит данные в одном браузере и не хранит прошлые версии.', 'Врач отдельно сохраняет запись и публикует выписку для владельца.'),
      (",nextEvidence:{label:t('Next evidence','Следующая проверка'),text:t('Observe real handoffs, interrupted work and record recovery in a practice.','Наблюдать передачу, прерванную работу и восстановление записи в реальной практике.')}", ''),
      ("t('Open the demo','Открыть демо')", "t('Open product','Открыть продукт')"),
    ])
    return head + tail + rest

def portal(s, ru=False):
    end = s.index('assertStoryPair(partnerPortalStory') if ru else s.index('/**\n * Тексты кейса')
    tail, rest = s[:end], s[end:]
    pairs = [
      (",{term:'На кадрах',value:'Самостоятельная пересборка на демоданных'}", ''),
      ('Аудит → направление', 'Решение после аудита'), ('Промо первым → сначала задачи закупки', 'Сначала задачи закупки'), ('Только иконки → названные разделы', 'Разделы с названиями'),
      ('Один список для двух входов', 'Импорт и ручной ввод ведут в общий список'),
      ('Импорт XLS и быстрый заказ ведут в общий центр разрешения. Корзина, план поставки и оформление решают разные задачи. В иерархии выбраны восемь настоящих экранов пересборки.', 'Импорт XLS и быстрый заказ ведут в общий список разбора строк. Корзина, план поставки и оформление решают отдельные задачи. На карте — восемь ключевых экранов.'),
      ('Три кандидата на одну строку', 'Исходный запрос рядом с кандидатами'), ('Три кандидата, один выбор', 'Выбор второго кандидата'),
      ('У статуса есть явный шаг', 'Состояние подсказывает следующий шаг'),
      ('Принятые компоненты покрывают нерешённое соответствие, ошибки импорта, неопределённое наличие и выбор поставки.', 'Строка разбора сохраняет исходный запрос после выбора товара. Наличие показывает ответ склада, а план поставки — возможность отгрузки.'),
      ('Работа дошла до прода', 'Коммерческий редизайн выпущен'),
      ('Редизайн DSSL отгружен целиком. Кадры здесь — моя самостоятельная пересборка на демоданных: они показывают решения, а не бизнес-эффект.', 'Редизайн DSSL выпущен полностью. Для показанных экранов я пересобрал закупочный сценарий с вымышленными данными.'),
      ('Отгрузку подтверждаю я сам, публичных метрик нет. В пересборке строка 38 проходит путь от сопоставления до корзины.', 'Строка 38 проходит от выбора товара до корзины с исходным текстом и количеством.'),
      ("label:'Цена решения'", "label:'Компромисс'"),
      ("      nextEvidence:{label:'Следующая проверка',text:'Сохранять исходный текст строки в созданном заказе, затем измерить время и ошибки. Базовой бизнес-метрики пока нет.'},\n", ''),
      ('Открыть живой прототип', 'Открыть продукт'),
      ('Настоящее решение по строке 38', 'Выбор товара для строки 38'), ('Безопасный фрагмент исходной главной DSSL', 'Главная DSSL'), ('Настоящая строка корзины', 'Строка корзины'), ('Настоящий центр разрешения', 'Экран разбора строк'), ('Настоящий узкий центр разрешения', 'Узкий экран разбора строк'),
    ] if ru else [
      (",{term:'Shown',value:'Independent reconstruction on synthetic data'}", ''),
      ('Audit → direction', 'Design direction'), ('Promotion first → procurement tasks first', 'Procurement tasks first'), ('Icons alone → named destinations', 'Named destinations'),
      ('Two ways into one specification', 'Import and manual entry feed a shared specification'),
      ('This hierarchy selects eight real screens from the reconstruction.', 'The map shows eight key screens.'),
      ('Three candidates, one choice', 'The second candidate selected'),
      ('The accepted components cover unresolved matches, import errors, uncertain stock and supply choices.', 'Resolution rows retain the source request after a product is chosen. Availability records the warehouse response; shipment plans show whether supply is possible.'),
      ("label:'Outcome'", "label:'Result'"),
      ('The DSSL redesign shipped in full. The frames here are my independent reconstruction on synthetic data: they show the decisions, not business impact.', 'The DSSL redesign shipped in full. I rebuilt the procurement scenario shown here with synthetic data.'),
      ('The shipment is my own account, with no public metrics. In the reconstruction, row 38 runs from matching to Cart.', 'Row 38 runs from product choice to Cart with its source text and quantity intact.'),
      ("label:'Price of the solution'", "label:'Trade-off'"),
      ("      nextEvidence:{label:'Next check',text:'Keep the source text on created orders, then measure time and errors. There is no business baseline yet.'},\n", ''),
      ('Open the live demo', 'Open product'),
      ('Actual buyer decision', 'Buyer decision'), ('Safe crop of the original DSSL dashboard', 'DSSL dashboard'), ('Actual Cart product row', 'Cart product row'), ('Actual Resolution Center', 'Resolution Center'), ('Native narrow Resolution Center', 'Narrow Resolution Center'),
    ]
    return swap(tail, pairs) + rest

def agent(s, ru=False):
    start = s.index('import { agentOpsStory as en }') if ru else s.index('/* F · ordered checkpoint transfer */')
    head, tail = s[:start], s[start:]
    pairs = [
      ('$23,000', '$23 000'), ('Между обещанием и выплатой — человек.', 'Оператор проверяет обещания агента перед выплатой.'),
      ('Читать обещания, а не переписки', 'Проверять обещания агента'), ('Причина → обещание → решение', 'От причины к проверке обещания и решению'),
      ('Нет «да» — нет выплаты', 'Выплату одобряет человек'), ('У обещания нет опоры', 'Обещание требует подтверждения'),
      ('Вызов биллинга содержит сумму', 'Сумма выплаты видна в запросе к биллингу'),
      ("value:'NDA · B2B SaaS, биллинг'", "value:'B2B SaaS, биллинг'"),
      ("value:'Рабочий, вымышленные данные'", "value:'Открыть продукт'"),
      ('Открыть прототип с вымышленными данными', 'Открыть продукт'),
      ('Пользовательское тестирование определило доработки.', 'Заказчик защищён NDA; данные на экранах вымышлены. Пользовательское тестирование определило доработки.'),
      ("label:'Цена решения'", "label:'Компромисс'"), ('Шесть настоящих реплик прототипа', 'Шесть реплик переписки'), ('Две настоящие панели прототипа', 'Две панели продукта'),
    ] if ru else [
      ('Between a promise and a payout: a person.', 'An operator checks the agent’s promises before approving a payout.'),
      ('Read the promises, not the chats', 'Review the agent’s promises'), ('Cause → promise → decision', 'From cause to promise review and decision'),
      ("value: 'NDA · B2B SaaS, billing'", "value: 'B2B SaaS, billing'"),
      ("value: 'Live, invented data'", "value: 'Open product'"),
      ('Open the live prototype, on invented data', 'Open product'),
      ('User testing informed the revisions.', 'The client is under NDA; the screens use invented data. User testing informed the revisions.'),
      ("label: 'Outcome'", "label: 'Result'"), ("term: 'The trade-off'", "term: 'Trade-off'"),
      ('Two real prototype panels', 'Two product panels'), ('Six real prototype turns', 'Six conversation turns'),
    ]
    return head + swap(tail, pairs)

def portal_specimen(s):
    start = s.index('  const resolution=')
    return s[:start] + '''  const resolution=base.sets[0];
  return {...base,type:[],colors:[],groups:[{id:'intake',title:ru?'Выбор товара':'Product choice'},{id:'commerce',title:ru?'Наличие и поставка':'Availability and supply'}],sets:[
    {...resolution,states:[resolution.states[0],resolution.states[3]]},
    {...base.sets[2],states:[base.sets[2].states[0],base.sets[2].states[2]]},
    {id:'fulfillment',title:'FulfillmentPlan',group:'commerce',states:[
      state('fulfillmentplan','selected','Selected · choice remains visible','Выбран · выбор виден','Selected plan retains all shipment terms and selected action','Выбранный план сохраняет все условия и явно отмеченный выбор'),
      state('fulfillmentplan','unavailable','Unavailable · reason stated','Недоступен · причина названа','Plan unavailable because seven lines have no stock at this warehouse','План недоступен: семи строк нет на выбранном складе'),
    ]},
  ],caption:ru?'Выбор товара, подтверждение наличия и возможность поставки':'Product choice, stock confirmation and shipment availability'};
}
'''

if '--resume' not in sys.argv:
    edit('src/copy/cases/learn.ts', learn)
    edit('src/copy/cases/pawly.ts', pawly)
    edit('src/copy/cases/vet-clinic.ts', vet)
    edit('src/copy/cases/partner-portal.ts', portal)
edit('src/copy/ru/cases/partner-portal.ts', lambda s: portal(s, True))
edit('src/copy/cases/agent-ops-console.ts', agent)
edit('src/copy/ru/cases/agent-ops-console.ts', lambda s: agent(s, True))
edit('src/data/diagrams/partner-portal/specimen.ts', portal_specimen)
edit('src/copy/learn-vet-stage.ts', lambda s: swap(s, [
  ("title: ru ? 'Один материал' : 'One material'", "title: ru ? 'Ответ об ONVIF в справочнике и программе' : 'The ONVIF answer in the reference and programme'"),
  ("'Ответ в справочнике и тот же ресурс в учебной программе.'", "''"), ("'An answer in the reference, the same resource in a learning path.'", "''"),
]))
edit('src/copy/about.ts', lambda s: swap(s, [
  (' A named trade-off can be checked in conversation; a number without a baseline cannot.', ''),
  ('The boundary is the one I would give you in conversation: the front end and integration with an existing API, and most of these builds are prototypes on synthetic data rather than production systems under load.', 'My implementation scope is frontend and integration with an existing API.'),
  ('The boundary is judgment and evidence. ', ''),
]))
edit('src/copy/ru/about.ts', lambda s: swap(s, [
  (' Названный компромисс можно проверить в разговоре; число без базы — нельзя.', ''),
  ('Границу называю так же, как назвал бы в разговоре: фронтенд и интеграция с существующим API, и большинство таких сборок — прототипы на синтетических данных, а не продакшн под нагрузкой.', 'Моя область реализации — фронтенд и интеграция с существующим API.'),
  ('Граница проходит по суждению и доказательствам. ', ''),
]))
print('Edited 11 owned source files; baseline copies preserved in B-before.')
