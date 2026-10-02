/**
 * Образец карты прототипа для /kit. Продукт-заглушка, в кейсы не переносится.
 * Вайрфреймы из словаря блоков, связи — кривые из точки нажатия.
 * Второй ряд и часть связей обрезаны краем поля: прототип больше кадра.
 */
import { defineDiagram } from '../schema';

export default defineDiagram({
  kind: 'prototype',
  title: { en: 'Prototype map: client account', ru: 'Карта прототипа: кабинет клиента' },
  summary: {
    en: 'Clickable prototype of the client account: Home, Payments, Services, Plan and Manage screens, with tap targets linked to the screens they open.',
    ru: 'Кликабельный прототип кабинета клиента: главная, платежи, услуги, тариф и управление; точки нажатия связаны с экранами, которые они открывают.',
  },
  size: { w: 150, h: 64 },
  nodes: [
    { id: 'home', type: 'frame', at: [4, 4], label: { en: 'Home', ru: 'Главная' }, wire: ['bar', 'title', 'card', 'row*3', 'text', 'tabbar'] },
    { id: 'payments', type: 'frame', at: [34, 4], label: { en: 'Payments', ru: 'Платежи' }, wire: ['bar', 'title', 'tabs', 'row*4', 'tabbar'] },
    { id: 'services', type: 'frame', at: [64, 4], label: { en: 'Services', ru: 'Услуги' }, wire: ['bar', 'title', 'row*2', 'card', 'field', 'tabbar'] },
    { id: 'plan', type: 'frame', at: [94, 4], label: { en: 'Plan', ru: 'Тариф' }, wire: ['bar', 'title', 'field', 'row*4', 'button'] },
    { id: 'manage', type: 'frame', at: [124, 4], label: { en: 'Manage plan', ru: 'Управление' }, wire: ['bar', 'title', 'row*3', 'text*2', 'button'] },

    { id: 'profile', type: 'frame', at: [4, 52], label: { en: 'Profile', ru: 'Профиль' }, wire: ['bar', 'title', 'field*3'] },
    { id: 'messages', type: 'frame', at: [34, 52], label: { en: 'Messages', ru: 'Сообщения' }, wire: ['bar', 'tabs', 'card'] },
    { id: 'addMoney', type: 'frame', at: [64, 52], label: { en: 'Add money', ru: 'Пополнение' }, wire: ['bar', 'image'] },
    { id: 'letter', type: 'frame', at: [94, 52], label: { en: 'Send a letter', ru: 'Письмо' }, wire: ['bar', 'field', 'field'] },
  ],
  edges: [
    /* Хотспот стоит на блоке вайрфрейма, который нажимают: карточка,
       строка, кнопка, вкладка таб-бара. Связь за край кончается за полем
       вместе с отступом, иначе её обрыв виден. */
    { from: 'home', to: 'payments', hotspot: [21, 13] },
    { from: 'home', to: 'profile', hotspot: [20, 2.5] },
    { from: 'home', toPoint: [-8, 46], hotspot: [12, 26.5] },
    { from: 'payments', to: 'services', hotspot: [12, 39] },
    { from: 'payments', to: 'messages', hotspot: [6, 26.5] },
    { from: 'services', to: 'plan', hotspot: [21, 11.5] },
    { from: 'services', to: 'addMoney', hotspot: [12, 32.5] },
    { from: 'plan', to: 'manage', hotspot: [21, 17.5] },
    { from: 'plan', to: 'letter', hotspot: [12, 38] },
    { from: 'manage', to: 'letter', hotspot: [8, 33] },
    { from: 'manage', toPoint: [145, -10], hotspot: [21, 11.5] },
    { from: 'manage', toPoint: [160, 30], hotspot: [21, 21.5] },
  ],
});
