import { defineStory, assertStoryPair, type CaseStory, type Specimen } from '../cases/story';
import { portalMap } from '../../data/diagrams/common/portal-map';
import { portalFlow } from '../../data/diagrams/common/portal-flow';
const path = '/media/rebuild/common/portal';
const pair = (en:string,ru:string) => ({en,ru});
export function portalSpecimen(lang:'en'|'ru'): Specimen {
  const ru = lang === 'ru';
  const alts: Record<string,string> = {
    'resolutionrow-ambiguous':'Исходная строка и количество, неоднозначное соответствие, вероятный товар и действие выбора',
    'resolutionrow-missing':'Исходная строка и количество сохранены, соответствия в каталоге нет; доступен запрос позиции',
    'resolutionrow-error':'Количество не прочитано, соответствие остаётся открытым; доступно исправление строки',
    'resolutionrow-confirmed-from-ambiguous':'Подтверждённая строка сохраняет исходный текст и прежний неоднозначный тип; доступна отмена',
    'fileupload-empty':'Настоящий блок загрузки XLS: описание поддерживаемых файлов и действие выбора файла',
    'fileupload-complete':'office_north_v8.xlsx прочитан: 48 строк, 41 точное совпадение, 7 требуют решения',
    'fileupload-error':'Файл не прочитан: первая строка без заголовка; названы причина и способ исправления',
    'availability-verified':'24 единицы на складе Moscow DC, отправка через два рабочих дня; наличие подтверждено',
    'availability-stale':'Последнее известное наличие: 24 единицы на Moscow DC и время ответа WMS; данные устарели',
    'availability-not-confirmed':'Наличие не подтверждено, WMS не ответила; отсутствие ответа не показано нулём',
    'quantitystepper-default':'Количество 12, доступны увеличение и уменьшение',
    'quantitystepper-at-minimum':'Количество ноль, уменьшение недоступно, увеличение доступно',
    'quantitystepper-disabled':'Количество 12, контрол недоступен без подтверждённой цены',
  };
  const state = (family:string, id:string, en:string, russian:string, alt:string, width?:number) => ({
    id, label:ru ? russian : en, mediaId:`portal-${family}-${id}`,
    shot:{ src:`${path}/${family}-${id}-288.webp`, srcNarrow:`${path}/${family}-${id}-288.webp`,
      alt:ru ? alts[`${family}-${id}`] : alt, device:'panel' as const, nativeWidth:(width ?? 288) + 4 },
  });
  return {
    title: ru ? 'Система закупки DSSL' : 'DSSL procurement system', fontFamily:'Inter',
    type:[
      {style:'Page',usage:pair('Page title','Заголовок'),size:32,lineHeight:42,weight:600,sample:pair('Orders','Orders')},
      {style:'Section',usage:pair('Section title','Раздел'),size:24,lineHeight:36,weight:600,sample:pair('Import','Import')},
      {style:'Row',usage:pair('Line title','Строка'),size:18,lineHeight:27,weight:600,sample:pair('Camera','Camera')},
      {style:'Body',usage:pair('Main text','Текст'),size:16,lineHeight:24,weight:400,sample:pair('Source row','Source row')},
      {style:'Status',usage:pair('State label','Статус'),size:12,lineHeight:18,weight:600,sample:pair('VERIFIED','VERIFIED')},
      {style:'Data',usage:pair('Tabular data','Данные'),size:11,lineHeight:16,weight:500,sample:pair('24 · 12 pcs','24 · 12 pcs')},
    ],
    colors:[
      {name:ru ? 'Действие' : 'Action',hex:'#2563eb'}, {name:ru ? 'Белый' : 'White',hex:'#ffffff'}, {name:ru ? 'Лист' : 'Sheet',hex:'#fafbfc'}, {name:ru ? 'Поле' : 'Ground',hex:'#e7eaf0'},
      {name:ru ? 'Текст' : 'Ink',hex:'#0f172a'}, {name:ru ? 'Тише' : 'Muted',hex:'#475569'}, {name:ru ? 'Успех' : 'Success',hex:'#166534'}, {name:ru ? 'Внимание' : 'Warning',hex:'#92400e'},
      {name:ru ? 'Ошибка' : 'Error',hex:'#b91c1c'}, {name:ru ? 'Информация' : 'Info',hex:'#0369a1'},
    ],
    groups:[{id:'intake',title:ru ? 'Импорт и разрешение' : 'Import and resolution'},{id:'commerce',title:ru ? 'Доступность и количество' : 'Availability and quantity'}],
    sets:[
      {id:'resolution',title:'ResolutionRow',group:'intake',states:[
        state('resolutionrow','ambiguous','Ambiguous · choose a match','Неоднозначность · выбрать товар','Original source line, quantity, ambiguous identity, plausible match and Choose action'),
        state('resolutionrow','missing','Missing · request an item','Не найдено · запросить позицию','Unchanged source row and quantity, no catalog match, Request item action'),
        state('resolutionrow','error','Error · fix the source line','Ошибка · исправить строку','Quantity column could not be read, source identity remains open and Fix line action is available'),
        state('resolutionrow','confirmed-from-ambiguous','Confirmed · original category retained','Подтверждено · исходный тип сохранён','Confirmed former ambiguous row, source text remains and Undo action is available'),
      ]},
      {id:'upload',title:'FileUpload',group:'intake',states:[
        state('fileupload','empty','Empty · choose an XLS file','Пусто · выбрать XLS','Real XLS file upload dropzone with supported file description and Choose file action'),
        state('fileupload','complete','Complete · seven decisions remain','Прочитан · семь решений впереди','office_north_v8.xlsx parsed, 48 lines read, 41 exact matches and 7 needing a decision'),
        state('fileupload','error','Error · fix the header','Ошибка · исправить заголовок','File cannot be read, row 1 has no header; reason and fix are stated'),
      ]},
      {id:'availability',title:'Availability',group:'commerce',states:[
        state('availability','verified','Verified stock','Подтверждённое наличие','24 pcs at Moscow DC, ships in 2 business days, verified commercial state',150),
        state('availability','stale','Stale · timestamp retained','Устарело · время сохранено','Last known stock 24 pcs at Moscow DC and WMS timestamp, explicitly stale',164),
        state('availability','not-confirmed','Not confirmed · no WMS response','Не подтверждено · WMS не ответила','Not confirmed stock, WMS no response; absence is not drawn as zero',126),
      ]},
      {id:'quantity',title:'QuantityStepper',group:'commerce',states:[
        state('quantitystepper','default','Default · 12','Обычное · 12','Quantity 12 with decrement and increment actions',138),
        state('quantitystepper','at-minimum','Minimum · decrement disabled','Минимум · уменьшение недоступно','Quantity zero, decrement disabled, increment remains available',138),
        state('quantitystepper','disabled','Disabled · unconfirmed price','Недоступно · цена не подтверждена','Quantity 12, control disabled while price is not confirmed',138),
      ]},
    ], caption:ru ? 'Состояния строки закупки, наличия и количества' : 'Procurement row, availability and quantity states',
  };
}
function story(lang:'en'|'ru'): CaseStory {
  const ru = lang === 'ru';
  return defineStory({ theme:'portal',plate:'light',
    cover:{title:'Partner Portal',outcome:ru ? 'Одна исходная строка — от файла до заказа.' : 'One source row, from file to order.',
      media:{variant:'screen',layout:'screen',items:[{src:'/media/case-dssl/cover/resolution-center.webp',alt:ru ? 'Исходные строки закупки, статусы сопоставления и действия покупателя' : 'Source procurement rows, matching states and buyer actions',device:'desktop'}]}},
    facts:ru ? [{term:'Клиент',value:'DSSL'},{term:'Год',value:'2024–2026'},{term:'Роль',value:'Единственный дизайнер в продуктовой команде'},{term:'Исходная работа',value:'Коммерческий редизайн отгружен'}] :
      [{term:'Client',value:'DSSL'},{term:'Year',value:'2024–2026'},{term:'Role',value:'Sole designer on the product team'},{term:'Original work',value:'Commercial redesign shipped'}],
    blocks:[
      {id:'shared-specification',type:'artifact',motion:'draw',evidenceId:'portal-scope',payload:{
        thesis:{label:ru ? 'Архитектура' : 'Architecture',thesis:ru ? 'Два входа, один список' : 'One specification, two ways in',body:ru ? 'Файл и ручной ввод сохраняют исходную строку. Подбор товара меняет интерпретацию рядом с ней, а не её происхождение. Здесь — семь выбранных экранов нынешнего MVP.' : 'File upload and manual entry retain the source row. Matching changes the interpretation beside it, never its provenance. These are seven selected screens from the current MVP.'},
        artifact:{data:portalMap,caption:ru ? 'Карта ключевых экранов закупки' : 'Map of the main procurement screens',source:{kind:'editorial',ref:'b2b-dssl/ia/sitemap.md; D007'}},
      }},
      {id:'buyer-decision',type:'artifact',motion:'draw',evidenceId:'portal-tradeoff',payload:{
        thesis:{label:ru ? 'Сценарий' : 'Flow',thesis:ru ? 'Решает покупатель' : 'The buyer resolves ambiguity',body:ru ? 'Импорт читает файл. Центр разрешения отвечает за соответствие товара. Корзина отдельно проверяет цену и наличие. Каждое условие имеет явный выход и возврат.' : 'Import reads the file. Resolution owns product identity. Cart separately reviews price and availability. Each condition has an explicit exit and return.'},
        artifact:{data:portalFlow,caption:ru ? 'Импорт → решение → заказ · редакционная схема нынешнего MVP' : 'Import → decision → order · editorial flow of the current MVP',source:{kind:'editorial',ref:'b2b-dssl/ia/flows/xls-to-order.mmd; D007–D010'}},
      }},
      {id:'domain-system',type:'specimen',motion:'static',evidenceId:'portal-domain',mediaId:'portal-specimens',payload:{
        thesis:{label:ru ? 'Система' : 'System',thesis:ru ? 'Статус задаёт шаг' : 'A state tells you what to do',body:ru ? 'Настоящие компоненты принятого каталога сохраняют исходную строку, понятную ошибку и коммерческий статус. Выборка состояний; UI на английском, как в исходном продукте.' : 'Actual accepted components keep source identity, actionable errors and commercial state visible. This is a selection of states. The source product UI remains in English.'},
        specimen:portalSpecimen(lang),
      }},
      {id:'source-in-context',type:'shot',motion:'reveal',evidenceId:'portal-domain',mediaId:'portal-application',payload:{
        shot:{layout:'desktop',items:[{src:'/media/case-dssl/polish-after-resolution.webp',alt:ru ? 'Исходная строка остаётся рядом с сопоставлением и действием покупателя' : 'Source identity stays beside the match and the buyer action',device:'desktop'}],caption:ru ? 'Сопоставление товара сохраняет исходную строку' : 'Product matching retains the source row'},
      }},
      {id:'shipped-redesign',type:'outcome',motion:'static',evidenceId:'portal-shipped',payload:{
        result:{label:ru ? 'Результат' : 'Outcome',thesis:ru ? 'Редизайн отгружен' : 'The commercial redesign shipped',body:ru ? 'Исходная работа завершена в DSSL. На экранах показаны сохранение исходной строки и обработка исключений на вымышленных данных закупки.' : 'The original work was delivered at DSSL. The screens show source identity and exception handling using synthetic procurement data.'},
        evidence:{label:ru ? 'Доказательство' : 'Evidence',text:ru ? 'Отгрузка подтверждена владельцем в публичной карте кейса; текущий accepted UI отдельно демонстрирует правила строки.' : 'Delivery is owner-confirmed in the public case record. The current accepted UI separately demonstrates the row rules.'},
        tradeoff:{label:ru ? 'Цена решения' : 'Trade-off',text:ru ? 'Покупатель вручную разрешает неоднозначность: данные не подтверждают совместимость за него.' : 'The buyer resolves ambiguity by hand. The data cannot confirm compatibility on their behalf.'},
      }},
    ],prototype:{label:ru ? 'Открыть продукт' : 'Open product',href:'https://b2b-partner-portal-five.vercel.app/'},
  });
}
export const commonPortal = {en:story('en'),ru:story('ru')};
assertStoryPair(commonPortal.en,commonPortal.ru);

