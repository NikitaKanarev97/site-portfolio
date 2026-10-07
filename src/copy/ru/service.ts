import type { ServiceRoute } from '../service.ts';
import { NAME_RU } from './site.ts';

/** The single host 404 serves both language prefixes, including without JS. */
export const notFoundRu = {
  meta: {
    title: `Страница не найдена — ${NAME_RU}`,
    description: 'Адрес не найден. Перейдите к работам, информации обо мне или резюме на русском и английском.',
  },
  heading: 'Страница не найдена',
  lead: 'В адресе может быть опечатка, или ссылка устарела. Работы, информация обо мне и резюме доступны по ссылкам ниже.',
  routesHeading: 'Продолжить просмотр',
};
export const serviceContactLeadRu = 'По вопросам проекта или неработающей ссылки напишите мне на почту.';
export const serviceRoutesRu: readonly ServiceRoute[] = [
  { label: 'Главная / работы', href: '/ru/#work', note: 'Пять продуктовых кейсов, контекст проектов и контакты.' },
  { label: 'Обо мне', href: '/ru/about/', note: 'Как я работаю и на каких условиях можно нанять.' },
  { label: 'Резюме (PDF)', href: '/cv-ru.pdf', note: 'Прямая ссылка на существующее русское резюме.' },
];
