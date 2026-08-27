import { EMAIL, LINKEDIN, type SiteCopy } from '../site.ts';

/**
 * Имя владельца кириллицей.
 *
 * Латинское `NAME` остаётся в английской локали, в резюме и в LinkedIn —
 * там оно совпадает с документами. На русской версии имя читается сразу,
 * а не транслитерируется читателем обратно, поэтому написание своё.
 * Почта и адрес профиля не переводятся: это идентификаторы, не текст.
 */
export const NAME_RU = 'Никита Канарев';

/** Сквозные строки русской локали. URL прототипов остаются английскими. */
export const siteRu = {
  brand: NAME_RU,
  accessibility: {
    skipToContent: 'Перейти к содержимому',
    noscript:
      'Сайт работает без JavaScript: весь текст и все ссылки доступны. Скрипт отвечает только за движение.',
  },
  navigation: {
    label: 'Основная навигация',
    trigger: 'Меню',
    close: 'Закрыть меню',
    languageLabel: 'Язык',
  },
  nav: [
    { label: 'Работы', href: '/ru/#work' },
    { label: 'Обо мне', href: '/ru/about' },
    { label: 'Контакты', href: '/ru/#contact' },
  ],
  contact: {
    heading: 'Поговорим',
    lead: 'Если кейс выше ответил на ваш вопрос — или добавил новый.',
    email: EMAIL,
    links: [
      { label: 'LinkedIn', href: LINKEDIN, external: true },
      { label: 'Резюме (PDF)', href: '/cv-ru.pdf', external: false },
    ],
    copyLabel: 'Скопировать почту',
    copyHint: 'Скопировать в один клик',
    copiedLabel: 'Скопировано',
    announce: 'Адрес почты скопирован в буфер обмена',
    fallbackAnnounce:
      'Скопировать не удалось — адрес показан рядом с кнопкой, его можно выделить',
  },
  zoom: {
    label: 'Увеличенный скриншот',
    open: 'Открыть в полном размере',
    close: 'Закрыть',
  },
  footer: {
    location: 'Казахстан',
    utcLabel: 'UTC+5',
    timeZone: 'Asia/Almaty',
    timeLabel: 'местное время',
    copyright: '© 2026',
  },
} as const satisfies SiteCopy;
