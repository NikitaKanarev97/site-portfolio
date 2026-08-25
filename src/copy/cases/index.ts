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
import { partnerPortal } from './partner-portal.ts';
import { vetClinic } from './vet-clinic.ts';

export const cases = [partnerPortal, vetClinic];

export type Case = (typeof cases)[number];
