/**
 * Тестовый кейс витрины /kit — модули страницы кейса (ds/screens/case.md).
 *
 * Содержимое — заглушки на настоящих кадрах из public/media. Ни одна строка
 * отсюда в кейсы не переносится: тексты кейсов пишутся на этапах 5 и 8–11.
 * Кадры подобраны под проверку модулей, а не под смысл: пара «десктоп +
 * телефон» собрана из двух разных продуктов, только чтобы показать
 * раскладку.
 *
 * Бюджет тот же, что у настоящего кейса: ≤ 450 слов на демо-кейс, тезис до
 * 60 знаков, абзац до 35 слов, подпись до 12 слов. Проверяет
 * scripts/harmony-check.mjs.
 */
import diagramMap from '../data/diagrams/kit/map.ts';
import diagramFlow from '../data/diagrams/kit/flow.ts';
import diagramPrototype from '../data/diagrams/kit/prototype.ts';
import diagramLibrary from '../data/diagrams/kit/library.ts';
import type { LegacyKitStory as CaseStory, CoverMedia, Shot } from './cases/story.ts';

const ao = '/media/case-agent-ops';

export const kitStory = {
  theme: 'agent',
  plate: 'dark',
  cover: {
    title: 'Agent Ops',
    outcome: 'Заглушка строки итога: что это за продукт и чем закончилась работа — одной строкой.',
    media: {
      variant: 'video',
      video: `${ao}/clip-review-decision`,
      poster: `${ao}/clip-review-decision-poster.webp`,
      alt: 'Заглушка ролика: решение по карточке в очереди проверки',
    },
  },
  facts: [
    { term: 'Клиент', value: 'NDA, B2B SaaS' },
    { term: 'Год', value: '2026' },
    { term: 'Роль', value: 'Единственный дизайнер' },
    { term: 'Платформа', value: 'Веб, десктоп' },
    { term: 'Срок', value: 'Месяц' },
    { term: 'Прототип', value: 'Открыть', href: 'https://example.com' },
  ],
  challenge: {
    label: 'Задача',
    thesis: 'Читать обещания, а не все разговоры',
    body: 'Заглушка абзаца задачи: два предложения о том, что мешало команде и почему старый способ проверки не работал.',
    numbers: [
      { value: '1 770', caption: 'разговоров в день' },
      { value: '71', caption: 'обещание среди них' },
      { value: '2,4 ч', caption: 'на ручную проверку' },
    ],
  },
  system: {
    label: 'Как устроено',
    thesis: 'Схема объясняет быстрее абзаца',
    body: 'Заглушка: кто участвует в процессе и что кому передаёт. Схема читается без абзаца.',
    diagrams: [{ data: diagramMap, caption: 'Карта экранов: вход, главная и пять разделов' }],
  },
  before: {
    label: 'Было → стало',
    thesis: 'Красным — то, что было сломано',
    body: 'Заглушка: старый экран с пометками проблем, следом тот же участок в новом виде.',
    issue: {
      src: `${ao}/cluster-detail-crop.webp`,
      alt: 'Заглушка: карточка кластера с суммой риска',
      marks: [
        { x: 30, y: 6, text: 'Заголовок не говорит, что делать' },
        { x: 18, y: 38, text: 'Сумма риска теряется среди цифр' },
        { x: 9, y: 76, text: 'Просроченный источник виден случайно' },
      ],
      caption: 'Было: карточка кластера до правки',
    },
    after: {
      layout: 'desktop',
      items: [{ src: `${ao}/correction.webp`, alt: 'Заглушка: экран правки ответа', device: 'desktop' }],
      caption: 'Стало: правка с причиной на одном экране',
    },
  },
  process: {
    label: 'Процесс',
    thesis: 'Процесс в кадрах',
    body: 'Заглушка: лента вайрфреймов, флоу и карт. Листается свайпом, кнопками и клавиатурой.',
    slides: [
      { diagram: diagramPrototype },
      { shot: { src: `${ao}/screen-index.webp`, alt: 'Заглушка: индекс экранов', device: 'desktop' } },
      { diagram: diagramFlow },
      { shot: { src: `${ao}/policy-version-diff.webp`, alt: 'Заглушка: сравнение версий', device: 'desktop' } },
    ],
    captions: [
      'Карта прототипа со связями',
      'Индекс всех экранов прототипа',
      'Флоу оплаты с развилками',
      'Сравнение версий политики',
    ],
  },
  steps: {
    label: 'Продукт по шагам',
    items: [
      {
        label: 'Очередь',
        layout: 'wide',
        thesis: 'Сверху очереди — больше денег под риском',
        body: 'Заглушка шага: что видит человек и почему порядок именно такой.',
        shot: { src: `${ao}/review-queue.webp`, alt: 'Заглушка: очередь проверки', device: 'desktop' },
      },
      {
        label: 'Карточка',
        thesis: 'Карточка обещания отвечает на три вопроса',
        body: 'Заглушка шага: сумма, срок и причина видны без прокрутки.',
        shot: { src: `${ao}/run-detail.webp`, alt: 'Заглушка: карточка прогона', device: 'desktop' },
      },
      {
        label: 'Автономия',
        thesis: 'Агент получает свободу по одной способности',
        body: 'Заглушка шага: лестница автономии и условия перехода на ступень выше.',
        shot: { src: `${ao}/autonomy.webp`, alt: 'Заглушка: лестница автономии', device: 'desktop' },
      },
    ],
  },
  moments: {
    label: 'Телефон',
    thesis: 'Десктоп и телефон в одном кадре',
    body: 'Заглушка: пара показывает раскладку модуля, кадры взяты из разных продуктов.',
    shot: {
      layout: 'pair',
      items: [
        { src: `${ao}/action-approvals.webp`, alt: 'Заглушка: согласование действий', device: 'desktop' },
        { src: '/media/case-pawly/owner-home.webp', alt: 'Заглушка: главный экран на телефоне', device: 'phone' },
      ],
      caption: 'Пара одной высоты: десктоп и телефон рядом',
    },
  },
  details: {
    label: 'Детали и система',
    thesis: 'Кадр и выноски',
    body: 'Заглушка: что значит каждая часть компонента. Ниже лист библиотеки из данных.',
    callout: {
      src: `${ao}/system-amount-figure.webp`,
      alt: 'Заглушка: матрица суммы риска',
      marks: [
        { x: 30, y: 21, text: 'Высокий риск — тёплый цвет' },
        { x: 30, y: 50, text: 'Средний — приглушённый' },
        { x: 80, y: 82, text: 'Кегль растёт вместе с суммой' },
      ],
      caption: 'Сумма риска: три уровня и три размера',
    },
    library: { data: diagramLibrary, caption: 'Лист библиотеки: типографика, цвета, наборы' },
  },
  result: {
    label: 'Итог',
    thesis: 'Три числа, за которые не стыдно',
    cards: [
      { value: '71', caption: 'из 1 770 проверяется вручную' },
      { value: '0,3', caption: 'ставки на всю проверку' },
      { value: '1', caption: 'причина вместо четырнадцати жалоб' },
    ],
    quote: { text: 'Заглушка цитаты пользователя — ставится только настоящая.', who: 'Роль, компания' },
    cost: { label: 'Цена решения', text: 'Заглушка: чем пришлось заплатить за решение, одной строкой.' },
  },
  prototype: { label: 'Живой прототип на выдуманных данных', href: 'https://example.com' },
} satisfies CaseStory;

/** Три обложки варианта «экран на цвете» — по одной на раскладку. */
export const kitCovers: {
  theme: CaseStory['theme'];
  title: string;
  outcome: string;
  media: CoverMedia;
  shot: Shot;
}[] = [
  {
    theme: 'portal',
    title: 'Partner Portal',
    outcome: 'Заглушка: раскладка screen — один десктопный экран целиком.',
    media: {
      variant: 'screen',
      layout: 'screen',
      items: [{ src: '/media/case-dssl/cart-change-review.webp', alt: 'Заглушка: проверка изменений заказа', device: 'desktop' }],
    },
    shot: {
      layout: 'desktop',
      items: [{ src: '/media/case-dssl/legacy-dashboard.webp', alt: 'Заглушка: прежний кабинет', device: 'desktop' }],
      caption: 'Светлая плашка: один десктопный экран',
    },
  },
  {
    theme: 'vet',
    title: 'Vet Clinic OS',
    outcome: 'Заглушка: раскладка screen-detail — экран и фрагмент рядом, не поверх.',
    media: {
      variant: 'screen',
      layout: 'screen-detail',
      items: [
        { src: '/media/case-vet/polish-after-queue.webp', alt: 'Заглушка: очередь врача', device: 'desktop' },
        { src: '/media/case-vet/dose-calculator-crop.webp', alt: 'Заглушка: расчёт дозы', device: 'desktop' },
      ],
    },
    shot: {
      layout: 'desktop',
      items: [{ src: '/media/case-vet/discharge-preview.webp', alt: 'Заглушка: выписка', device: 'desktop' }],
      caption: 'Светлая плашка: экран выписки',
    },
  },
  {
    theme: 'pawly',
    title: 'Pawly',
    outcome: 'Заглушка: раскладка phones — телефоны группой, одной высоты.',
    media: {
      variant: 'screen',
      layout: 'phones',
      items: [
        { src: '/media/case-pawly/owner-home.webp', alt: 'Заглушка: главный экран', device: 'phone' },
        { src: '/media/case-pawly/order-details.webp', alt: 'Заглушка: детали заказа', device: 'phone' },
        { src: '/media/case-pawly/walker-active-order.webp', alt: 'Заглушка: активная прогулка', device: 'phone' },
      ],
    },
    shot: {
      layout: 'phones',
      items: [
        { src: '/media/case-pawly/replacement-offer.webp', alt: 'Заглушка: замена выгульщика', device: 'phone' },
        { src: '/media/case-pawly/active-service.webp', alt: 'Заглушка: активная услуга', device: 'phone' },
      ],
      caption: 'Светлая плашка: два телефона',
    },
  },
];
