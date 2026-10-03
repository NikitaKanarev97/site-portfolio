import type { ServiceRoute } from '../service.ts';

/** The single host 404 serves both language prefixes, including without JS. */
export const notFoundRu = {
  heading: 'Страница не найдена',
  lead: 'В адресе может быть опечатка, или ссылка устарела. Работы, информация обо мне и резюме доступны по ссылкам ниже.',
  routesHeading: 'Продолжить просмотр',
};
export const serviceRoutesRu: readonly ServiceRoute[] = [
  { label: 'Главная / работы', href: '/ru/#work', note: 'Пять продуктовых кейсов, контекст проектов и контакты.' },
  { label: 'Обо мне', href: '/ru/about/', note: 'Как я работаю и на каких условиях можно нанять.' },
  { label: 'Резюме (PDF)', href: '/cv-ru.pdf', note: 'Прямая ссылка на существующее русское резюме.' },
];
