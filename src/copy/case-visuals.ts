/** Editorial artwork, separate from the full evidence frames in each case. */
export type CaseSlug = 'agent-ops-console' | 'partner-portal' | 'learn' | 'vet-clinic' | 'pawly';
type Locale = 'en' | 'ru';
export interface Artwork {
  images: string[];
  /** Phone-width crop of the same product moment; replaces the first image below bp-md. */
  mobile?: string;
  /** One product moment centred on the canvas, instead of a layered composition. */
  moment?: boolean;
  /** A finished composition (scripts/build-home-covers.mjs) that fills the canvas. */
  composed?: boolean;
  alt: string;
  caption?: string;
}

const catalog = {
  'agent-ops-console': {
    folder: 'case-agent-ops',
    cover: ['cover/home-desktop.webp'],
    mobile: 'cover/home-mobile.webp',
    hero: ['consequence-preview.webp', 'consequence-preview-crop.webp'],
    en: {
      cover: 'Agent Ops: a $340 refund awaiting approval, with the customer, agent reason, policy, billing and history beside Reject and Approve.',
      hero: 'An action awaiting approval, with a close-up of the payment and exact message the customer will receive.',
      caption: 'Before approval: the payment, its destination and the exact customer message are visible together. Demonstration data.',
    },
    ru: {
      cover: 'Agent Ops: возврат $340 ждёт согласования; рядом клиент, обоснование агента, политика, биллинг и история, кнопки «Отклонить» и «Согласовать».',
      hero: 'Действие перед согласованием; крупно — выплата и точный текст сообщения клиенту.',
      caption: 'До согласования видны сумма выплаты, её получатель и точный текст сообщения клиенту. Данные вымышлены.',
    },
  },
  'partner-portal': {
    folder: 'case-dssl',
    cover: ['cover/home-desktop.webp'],
    mobile: 'cover/home-mobile.webp',
    hero: ['cover/resolution-center.webp'],
    en: {
      cover: 'B2B Partner Portal: three fulfillment plans compared by availability, completion date, shipments and delivery cost.',
      hero: 'Imported specification review: ambiguous, missing and changed product lines with a distinct next action for each.',
      caption: 'An imported specification becomes a workable order: exact matches proceed, exceptions keep their own next step. Demonstration data.',
    },
    ru: {
      cover: 'Партнёрский портал: три плана отгрузки — наличие, дата готовности, число отгрузок и стоимость доставки.',
      hero: 'Проверка спецификации: неоднозначные, отсутствующие и заменённые позиции с отдельным действием для каждой.',
      caption: 'Спецификация превращается в заказ: точные совпадения проходят дальше, исключения получают свой следующий шаг. Данные вымышлены.',
    },
  },
  learn: {
    folder: 'case-learn',
    cover: ['cover/home-desktop.webp'],
    mobile: 'cover/home-mobile.webp',
    hero: ['cover/material.webp'],
    en: {
      cover: 'TRASSIR Learn: resources ordered for the task at hand, with the full learning programmes in a separate column.',
      hero: 'An open ONVIF diagnostic guide with the product version, ordered checks and links to learning paths.',
      caption: 'The technical answer is available before sign-in. A version, ordered checks and links to the learning paths give it context. Demonstration content.',
    },
    ru: {
      cover: 'TRASSIR Learn: материалы по порядку для текущей задачи, полные программы подготовки — отдельной колонкой.',
      hero: 'Открытая инструкция по диагностике ONVIF: версия продукта, последовательность проверок и связи с учебными программами.',
      caption: 'Технический ответ доступен до входа: версия продукта, порядок проверок и связи с учебными программами. Демонстрационный контент.',
    },
  },
  'vet-clinic': {
    folder: 'case-vet',
    cover: ['cover/queue-moment.webp'],
    hero: ['visit-quick-trace-crop.webp'],
    en: {
      cover: 'Vet Clinic: today’s visits, with an emergency walk-in at the top of the queue and three records left open.',
      hero: 'Quick visit record: weight, medication and dose, with the draft saved and a short clinical note.',
      caption: 'A short record at the point of care: weight, medication, dose and a note. The full record remains a separate step. Fictional patient data.',
    },
    ru: {
      cover: 'Ветклиника: визиты на сегодня — экстренный пациент без записи первым в очереди, три записи не закрыты.',
      hero: 'Быстрая запись визита: вес, препарат, доза, сохранённый черновик и короткая заметка врача.',
      caption: 'Короткий след приёма: вес, препарат, доза и заметка. Полная карта остаётся отдельным шагом. Данные пациента вымышлены.',
    },
  },
  pawly: {
    folder: 'case-pawly',
    cover: ['cover/story.webp'],
    hero: ['cover/story.webp'],
    heroMobile: 'cover/story-phone.webp',
    en: {
      cover: 'Pawly, one walk in three screens: the owner sees Baikal out for a walk, the walker checks the drop-off photo, the report confirms the return at 14:52.',
      hero: 'Pawly, one walk in three screens: the owner sees who has Baikal and when to expect him home; the walker checks the drop-off photo before sending; the report confirms the return at 14:52 with both photos.',
      caption: 'Before, during and after one walk. A selected photo is not yet a confirmed return: the walker reviews it before sending, and the report counts only what was received. Local demo on invented data.',
    },
    ru: {
      cover: 'Pawly, одна прогулка в трёх экранах: владелец видит, что Байкал на прогулке, исполнитель проверяет фото возвращения, отчёт подтверждает возврат в 14:52.',
      hero: 'Pawly, одна прогулка в трёх экранах: владелец видит, с кем Байкал и когда его ждать; исполнитель проверяет фото возвращения до отправки; отчёт подтверждает возврат в 14:52 с обоими фото.',
      caption: 'До, во время и после одной прогулки. Выбранное фото ещё не подтверждает возвращение: исполнитель проверяет его до отправки, а отчёт учитывает только полученное. Локальное демо на вымышленных данных.',
    },
  },
} satisfies Record<CaseSlug, unknown>;

export function getCaseVisuals(slug: string, locale: Locale = 'en') {
  if (!(slug in catalog)) throw new Error(`Missing artwork for ${slug}`);
  const key = slug as CaseSlug;
  const entry = catalog[key];
  const root = `/media/${entry.folder}${locale === 'ru' ? '-ru' : ''}`;
  const copy = entry[locale];
  return {
    slug: key,
    // The featured three are finished compositions — the whole screen as
    // ground, key elements lifted over it (scripts/build-home-covers.mjs).
    // Vet and Pawly previews are one product moment each
    // (scripts/build-secondary-covers.mjs).
    cover: {
      images: entry.cover.map((file) => `${root}/${file}`),
      mobile: 'mobile' in entry ? `${root}/${entry.mobile}` : undefined,
      moment: !('mobile' in entry),
      composed: 'mobile' in entry,
      alt: copy.cover,
    } satisfies Artwork,
    hero: {
      images: entry.hero.map((file) => `${root}/${file}`),
      mobile: 'heroMobile' in entry ? `${root}/${entry.heroMobile}` : undefined,
      moment: 'heroMobile' in entry,
      alt: copy.hero,
      caption: copy.caption,
    } satisfies Artwork,
  };
}
