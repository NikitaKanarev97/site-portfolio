import type { CoverMedia, CaseStory, CaseTheme } from './cases/story';

/** Home and Next share the accepted registry order and the actual story cover. */
export function featuredWork(entries: { slug: string; story: CaseStory; theme: CaseTheme }[], locale: 'en' | 'ru') {
  const ru = locale === 'ru';
  const facts: Record<string, [string, string, string]> = ru ? {
    'agent-ops-console': ['2026', 'Платный заказ · прототип проверен и принят', 'Контроль решений ИИ, у которых есть реальные последствия.'],
    'partner-portal': ['2024–2026', 'Продуктовый дизайн · подбор товаров и оформление заказа', 'Сначала подобрать товар по исходной строке, затем оформить заказ.'],
    learn: ['2026', 'Продуктовый дизайн · справочник и учебные сценарии', 'Один материал — быстрый ответ и часть учебной программы.'],
    'vet-clinic': ['2026', 'Продуктовый дизайн · ролевые сценарии клиники', 'Один визит связывает врача, регистратуру и владельца.'],
    pawly: ['2026', 'Продуктовый дизайн · передача питомца и выплаты', 'Выбранное фото становится подтверждением после отправки.'],
  } : {
    'agent-ops-console': ['2026', 'Paid client · user-tested, accepted prototype', 'Human oversight for AI decisions with real consequences.'],
    'partner-portal': ['2024–2026', 'Product design · product matching and ordering', 'Match a product to the source row, then place the order.'],
    learn: ['2026', 'Product design · reference and learning flows', 'One material serves an answer and a learning path.'],
    'vet-clinic': ['2026', 'Product design · clinic role flows', 'One visit connects the vet, reception and owner.'],
    pawly: ['2026', 'Product design · pet handover and earnings', 'A selected photo becomes proof after it is sent.'],
  };
  return entries.map(({ slug, story, theme }) => {
    const [year, evidence, outcome] = facts[slug];
    const media: CoverMedia = slug === 'partner-portal' ? {
      variant: 'screen', layout: 'screen', items: [{
        src: `/media/rebuild/partner-portal/v2/${locale}/decision-1280.webp`,
        srcNarrow: `/media/rebuild/partner-portal/v2/${locale}/workspace-top-390.webp`,
        alt: ru ? 'Исходная строка и выбор закупщика в обновлённом разборе спецификации' : 'Source row and the buyer’s choice in the updated specification review',
        device: 'desktop',
      }],
    } : slug === 'agent-ops-console' ? {
      variant: 'screen', layout: 'screen', items: [{
        src: `/media/rebuild/agent-ops/v2/${locale}/approval-consequences-desktop.webp`,
        srcNarrow: `/media/rebuild/agent-ops/v2/${locale}/approval-consequences-mobile.webp`,
        alt: ru ? 'Сервисный кредит $120 в следующем счёте и сообщение клиенту до согласования' : '$120 invoice credit and the customer message before approval',
        device: 'desktop',
      }],
    } : story.cover.media;
    const shots = media.variant === 'proof' ? media.panels ?? [media.shot] : media.variant === 'screen' ? media.items : [];
    return {
      href: `${ru ? '/ru' : ''}/work/${slug}`, title: slug === 'agent-ops-console' ? 'Agent Ops Console' : story.cover.title, outcome,
      meta: [{ term: ru ? 'Проект' : 'Project', value: story.cover.title }, { term: ru ? 'Версия' : 'Version', value: year }, { term: ru ? 'Основание' : 'Evidence', value: evidence }],
      cta: ru ? 'Читать кейс' : 'Read the case', theme, media,
      cover: shots.map(shot => shot.src), coverAlt: shots.map(shot => shot.alt).join('; '),
    };
  });
}
