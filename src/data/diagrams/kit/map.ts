/**
 * Образец карты экранов для /kit. Продукт-заглушка, в кейсы не переносится.
 * Всё, что есть в нотации карты: точка входа, номера экранов, гребёнка,
 * функции в пунктирной рамке, внешняя ссылка, глобальные экраны вне дерева.
 */
import { defineDiagram } from '../schema';

export default defineDiagram({
  kind: 'map',
  title: { en: 'Screen map: client account', ru: 'Карта экранов: кабинет клиента' },
  summary: {
    en: 'Sign-in leads to Home; Home branches into Inbox, Requests, Payments and Services. Profile, Survey and Feedback are reachable from anywhere.',
    ru: 'Вход ведёт на главную; от неё ветки «Входящие», «Заявки», «Платежи» и «Услуги». Профиль, опрос и обратная связь доступны отовсюду.',
  },
  size: { w: 150, h: 70 },
  nodes: [
    { id: 'login', type: 'entry', at: [4, 12], label: { en: 'Sign in', ru: 'Вход' }, num: 1 },
    { id: 'home', type: 'screen', at: [20, 12], label: { en: 'Home', ru: 'Главная' }, num: 2 },

    { id: 'inbox', type: 'screen', at: [40, 4], label: { en: 'Inbox', ru: 'Входящие' }, num: 3 },
    { id: 'requests', type: 'screen', at: [40, 12], label: { en: 'Requests', ru: 'Заявки' }, num: 4 },
    { id: 'payments', type: 'screen', at: [40, 24], label: { en: 'Payments', ru: 'Платежи' }, num: 5 },
    {
      id: 'services',
      type: 'screen',
      at: [40, 40],
      label: { en: 'Services', ru: 'Услуги' },
      num: 6,
      actions: [{ label: { en: 'address filter', ru: 'фильтр по адресу' } }],
    },

    { id: 'alerts', type: 'screen', at: [64, 2], label: { en: 'Alerts', ru: 'Уведомления' }, num: 7 },
    { id: 'messages', type: 'screen', at: [64, 8], label: { en: 'Messages', ru: 'Сообщения' }, num: 8 },
    { id: 'thread', type: 'screen', at: [88, 8], label: { en: 'Thread', ru: 'Переписка' }, num: 9 },

    { id: 'history', type: 'screen', at: [64, 20], label: { en: 'Payment history', ru: 'История платежей' }, num: 10 },
    {
      id: 'methods',
      type: 'screen',
      at: [64, 30],
      label: { en: 'Payment methods', ru: 'Способы оплаты' },
      actions: [{ label: { en: 'pay on the bank site', ru: 'оплата на сайте банка' }, external: true }],
    },

    { id: 'schedule', type: 'screen', at: [64, 42], label: { en: 'Schedule', ru: 'Расписание' }, num: 11 },
    {
      id: 'service',
      type: 'screen',
      at: [64, 50],
      label: { en: 'Service', ru: 'Услуга' },
      actions: [
        { label: { en: 'connected services', ru: 'подключённые услуги' } },
        { label: { en: 'available to add', ru: 'доступные к подключению' } },
      ],
    },
    { id: 'stats', type: 'screen', at: [96, 48], label: { en: 'Statistics', ru: 'Статистика' }, num: 12 },
    {
      id: 'manage',
      type: 'screen',
      at: [96, 56],
      label: { en: 'Management', ru: 'Управление' },
      num: 13,
      actions: [
        { label: { en: 'change plan', ru: 'сменить тариф' } },
        { label: { en: 'pause service', ru: 'приостановить' } },
      ],
    },

    /* Глобальные экраны — вне дерева, связей к ним нет. */
    { id: 'profile', type: 'screen', at: [4, 32], label: { en: 'Profile', ru: 'Профиль' }, num: 14 },
    { id: 'survey', type: 'screen', at: [4, 39], label: { en: 'Survey', ru: 'Опрос' } },
    {
      id: 'feedback',
      type: 'screen',
      at: [4, 48],
      label: { en: 'Feedback', ru: 'Обратная связь' },
      num: 15,
      actions: [{ label: { en: 'feedback form', ru: 'форма отзыва' } }, { label: { en: 'book a call', ru: 'заказать звонок' } }],
    },
    { id: 'global', type: 'group', at: [118, 2], w: 30, h: 16 },
    { id: 'faq', type: 'screen', at: [121, 4], w: 24, label: { en: 'FAQ', ru: 'Вопросы' } },
    { id: 'contacts', type: 'screen', at: [121, 11], w: 24, label: { en: 'Contacts', ru: 'Контакты' } },
  ],
  edges: [
    { from: 'login', to: 'home' },
    { from: 'home', to: 'inbox', bend: 36 },
    { from: 'home', to: 'requests', bend: 36 },
    { from: 'home', to: 'payments', bend: 36 },
    { from: 'home', to: 'services', bend: 36 },
    { from: 'inbox', to: 'alerts', bend: 59 },
    { from: 'inbox', to: 'messages', bend: 59 },
    { from: 'messages', to: 'thread' },
    { from: 'payments', to: 'history', bend: 59 },
    { from: 'payments', to: 'methods', bend: 59 },
    { from: 'services', to: 'schedule', bend: 59 },
    { from: 'services', to: 'service', bend: 59 },
    { from: 'service', to: 'stats', bend: 91 },
    { from: 'service', to: 'manage', bend: 91 },
  ],
});
