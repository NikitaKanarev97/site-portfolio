/** Editorial artwork, separate from the full evidence frames in each case. */
export type CaseSlug = 'agent-ops-console' | 'partner-portal' | 'learn' | 'vet-clinic' | 'pawly';
type Locale = 'en' | 'ru';
export interface Artwork {
  images: string[];
  alt: string;
  caption?: string;
  detailCrop?: { sourceWidth: number; sourceHeight: number; x: number; y: number; width: number; height: number };
}

const catalog = {
  'agent-ops-console': {
    folder: 'case-agent-ops',
    cover: ['cover/review-queue.webp'],
    hero: ['consequence-preview.webp', 'consequence-preview-crop.webp'],
    en: {
      cover: 'Agent Ops: a review queue grouped by financial exposure and repeating causes.',
      hero: 'An action awaiting approval, with a close-up of the payment and exact message the customer will receive.',
      caption: 'Before approval: the payment, its destination and the exact customer message are visible together. Demonstration data.',
    },
    ru: {
      cover: 'Agent Ops: очередь проверки с финансовым риском и кластерами повторяющихся причин.',
      hero: 'Действие перед согласованием; крупно — выплата и точный текст сообщения клиенту.',
      caption: 'До согласования видны сумма выплаты, её получатель и точный текст сообщения клиенту. Данные вымышлены.',
    },
  },
  'partner-portal': {
    folder: 'case-dssl',
    cover: ['cover/fulfillment.webp'],
    hero: ['cover/resolution-center.webp'],
    en: {
      cover: 'B2B Partner Portal: three fulfillment plans compared by delivery date, shipment count and cost.',
      hero: 'Imported specification review: ambiguous, missing and changed product lines with a distinct next action for each.',
      caption: 'An imported specification becomes a workable order: exact matches proceed, exceptions keep their own next step. Demonstration data.',
    },
    ru: {
      cover: 'Партнёрский портал: три плана поставки с датой, числом отправлений и стоимостью.',
      hero: 'Проверка спецификации: неоднозначные, отсутствующие и заменённые позиции с отдельным действием для каждой.',
      caption: 'Спецификация превращается в заказ: точные совпадения проходят дальше, исключения получают свой следующий шаг. Данные вымышлены.',
    },
  },
  learn: {
    folder: 'case-learn',
    cover: ['cover/home.webp', 'cover/trajectory.webp'],
    hero: ['cover/material.webp'],
    en: {
      cover: 'TRASSIR Learn: a task-based field guide alongside a structured learning path.',
      hero: 'An open ONVIF diagnostic guide with the product version, ordered checks and links to learning paths.',
      caption: 'The technical answer is available before sign-in. A version, ordered checks and links to the learning paths give it context. Demonstration content.',
    },
    ru: {
      cover: 'TRASSIR Learn: вход по рабочей задаче и отдельная учебная программа.',
      hero: 'Открытая инструкция по диагностике ONVIF: версия продукта, последовательность проверок и связи с учебными программами.',
      caption: 'Технический ответ доступен до входа: версия продукта, порядок проверок и связи с учебными программами. Демонстрационный контент.',
    },
  },
  'vet-clinic': {
    folder: 'case-vet',
    cover: ['cover/vet-day-queue.webp', 'visit-quick-trace-crop.webp'],
    hero: ['visit-quick-trace-crop.webp'],
    en: {
      cover: 'Vet Clinic: the veterinarian’s daily queue and a quick visit record.',
      hero: 'Quick visit record: weight, medication and dose, with the draft saved and a short clinical note.',
      caption: 'A short record at the point of care: weight, medication, dose and a note. The full record remains a separate step. Fictional patient data.',
    },
    ru: {
      cover: 'Ветклиника: очередь врача на день и быстрая запись визита.',
      hero: 'Быстрая запись визита: вес, препарат, доза, сохранённый черновик и короткая заметка врача.',
      caption: 'Короткий след приёма: вес, препарат, доза и заметка. Полная карта остаётся отдельным шагом. Данные пациента вымышлены.',
    },
  },
  pawly: {
    folder: 'case-pawly',
    cover: ['cover/return-confirmed.webp'],
    hero: ['handover-photo-review.webp'],
    en: {
      cover: 'Pawly: return confirmed at 14:52, with dated pickup and return photos in one report card.',
      hero: 'Pawly return photo review: the full selected image remains local until the walker sends it and the demo confirms receipt.',
      caption: 'A selected photo is not yet a confirmed return. The walker reviews the full image before sending. Local demo on invented data.',
    },
    ru: {
      cover: 'Pawly: возвращение подтверждено в 14:52; фотографии передачи и возвращения с датами в одной карточке отчёта.',
      hero: 'Проверка фото возвращения в Pawly: полный выбранный кадр остаётся локальным до отправки и подтверждения в демо.',
      caption: 'Выбранное фото ещё не подтверждает возвращение. Исполнитель проверяет полный кадр до отправки. Локальное демо на вымышленных данных.',
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
    cover: {
      images: key === 'agent-ops-console'
        ? [`/media/presentation/${locale}/agent-queue.png`]
        : key === 'learn'
          ? [`${root}/cover/home.webp`, `/media/presentation/${locale}/learn-program.png`]
          : entry.cover.map((file) => `${root}/${file}`),
      alt: copy.cover,
      // Bounds of the complete, real programme card in the browser capture.
      detailCrop: key === 'learn' ? {
        sourceWidth: 1800, sourceHeight: 945, x: 1429.2578125,
        y: locale === 'ru' ? 23.994140625 : 338.26171875,
        width: 320, height: locale === 'ru' ? 588.623046875 : 546.611328125,
      } : undefined,
    } satisfies Artwork,
    hero: { images: entry.hero.map((file) => `${root}/${file}`), alt: copy.hero, caption: copy.caption } satisfies Artwork,
  };
}
