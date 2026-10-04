/**
 * Реестр кейсов — Site-portfolio
 *
 * US-20: портфолио растёт добавлением файла. Новый кейс — новый файл в
 * этой папке плюс строка здесь; маршрут src/pages/work/[slug].astro и
 * его вёрстка не трогаются.
 *
 * Контент-коллекции Astro не заводятся сознательно: слой текстов уже
 * живёт в src/copy/ по своей конвенции, и коллекция дала бы второй
 * носитель того же слоя ради одного кейса (ds/screens/case-dssl.md
 * §Решения карты №3).
 */
import { agentOpsConsole } from './agent-ops-console.ts';
import { partnerPortal, partnerPortalStory } from './partner-portal.ts';
import { vetClinic } from './vet-clinic.ts';
import { pawly } from './pawly.ts';
import { learn, learnStory } from './learn.ts';

/**
 * Порядок значим и совпадает с `home.featured.items`: из этого массива
 * разворачиваются sitemap.xml, hreflang и OG-карточки, и расхождение порядка
 * между реестром и главной было бы расхождением между картой сайта и сайтом.
 *
 * Порядок — решение владельца 2026-08-27, обоснование в
 * ds/screens/case-agent-ops.md §Что этот экран меняет на главной: убывание
 * доказательной силы, а не хронология. Agent Ops единственный прошёл полный
 * цикл на живом заказе — платный клиент, живые интервью, юзер-тест прототипа
 * и приёмка заказчиком.
 * 2026-09-09: по решению владельца Learn поставлен третьим — после
 * коммерческого Partner Portal, перед концептами Vet Clinic OS и Pawly.
 */
/** G wave 1: accepted B/C use ordered stories; the other three keep their legacy entry. */
export const cases = [
  { ...agentOpsConsole, theme: 'agent' as const, story: undefined },
  { ...partnerPortal, theme: partnerPortalStory.theme, story: partnerPortalStory,
    meta: { ...partnerPortal.meta, description: partnerPortalStory.cover.outcome } },
  { ...learn, theme: learnStory.theme, story: learnStory,
    meta: { ...learn.meta, description: learnStory.cover.outcome } },
  { ...vetClinic, theme: 'vet' as const, story: undefined },
  { ...pawly, theme: 'pawly' as const, story: undefined },
];

export type Case = (typeof cases)[number];
