import type { CoverMedia, CaseStory, CaseTheme } from './cases/story';

/** Home and Next share the accepted registry order and the actual story cover. */
export function featuredWork(entries: { slug: string; story: CaseStory; theme: CaseTheme }[], locale: 'en' | 'ru') {
  const ru = locale === 'ru';
  const facts: Record<string, [string, string, string]> = ru ? {
    'partner-portal': ['2024–2026', 'Продуктовый дизайн · подбор товаров и оформление заказа', 'Сначала подобрать товар по исходной строке, затем оформить заказ.'],
    learn: ['2026', 'Продуктовый дизайн · справочник и учебные сценарии', 'Одна база знаний. Два пути к результату.'],
    'vet-clinic': ['2026', 'Продуктовый дизайн · ролевые сценарии клиники', 'Один визит связывает врача, регистратуру и владельца.'],
    pawly: ['2026', 'Продуктовый дизайн · передача питомца и выплаты', 'Выбранное фото становится подтверждением после отправки.'],
  } : {
    'partner-portal': ['2024–2026', 'Product design · product matching and ordering', 'Match a product to the source row, then place the order.'],
    learn: ['2026', 'Product design · reference and learning flows', 'One knowledge system. Two ways to learn.'],
    'vet-clinic': ['2026', 'Product design · clinic role flows', 'One visit connects the vet, reception and owner.'],
    pawly: ['2026', 'Product design · pet handover and earnings', 'A selected photo becomes proof after it is sent.'],
  };
  return entries.map(({ slug, story, theme }) => {
    const [year, evidence, outcome] = facts[slug];
    const media: CoverMedia = slug === 'vet-clinic' ? {
      variant: 'screen', layout: 'screen', items: [{
        src: `/media/case-vet-v2/${locale}/visit-full-desktop.webp`,
        srcNarrow: `/media/case-vet-v2/${locale}/visit-context-mobile.webp`,
        alt: ru ? 'Актуальная запись визита: клинический контекст, назначение и услуги' : 'Current Visit Record: clinical context, prescription and services', device: 'desktop',
      }],
    } : slug === 'partner-portal' ? {
      variant: 'screen', layout: 'screen', items: [{
        src: `/media/rebuild/partner-portal/v2/${locale}/decision-1280.webp`,
        srcNarrow: `/media/rebuild/partner-portal/v2/${locale}/workspace-top-390.webp`,
        alt: ru ? 'Исходная строка и выбор закупщика в обновлённом разборе спецификации' : 'Source row and the buyer’s choice in the updated specification review',
        device: 'desktop',
      }],
    } : story.cover.media;
    const shots = media.variant === 'proof' ? media.panels ?? [media.shot] : media.variant === 'screen' ? media.items : [];
    return {
      href: `${ru ? '/ru' : ''}/work/${slug}`, title: slug === 'vet-clinic' ? 'Vet Clinic OS' : story.cover.title, outcome,
      meta: [{ term: ru ? 'Проект' : 'Project', value: story.cover.title }, { term: ru ? 'Версия' : 'Version', value: year }, { term: ru ? 'Основание' : 'Evidence', value: evidence }],
      cta: ru ? 'Читать кейс' : 'Read the case', theme, media,
      cover: shots.map(shot => shot.src), coverAlt: shots.map(shot => shot.alt).join('; '),
    };
  });
}
