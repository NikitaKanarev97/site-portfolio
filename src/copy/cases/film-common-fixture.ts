/** G-only integration fixture; no E story or public registry migration. */
import { defineStory, assertStoryPair, type ShotItem } from './story';
export function filmCommonFixture(lang: 'en' | 'ru') {
  const t = (en: string, ru: string) => lang === 'ru' ? ru : en;
  const base = `/media/rebuild/common/film-fixture/${lang}`;
  const phone = (name: string, alt: string): ShotItem => ({ src: `${base}/${name}.webp`, alt, device: 'phone', nativeWidth: 390 });
  const before = phone('active-service', t('Demo: expected return at 14:50.', 'Демо: возвращение ожидается в 14:50.'));
  const poster = phone('clip-return-proof-poster', t('Local return photo before sending.', 'Локальное фото возвращения до отправки.'));
  const after = phone('order-details', t('Demo report: return received at 14:52.', 'Демоотчёт: возвращение получено в 14:52.'));
  return defineStory({
    theme: 'pawly', plate: 'light',
    cover: { title: t('A film inside the story', 'Фильм внутри истории'), outcome: t('Shared media verification fixture with Pawly on demonstration data.', 'Проверочный пример общего носителя с Pawly на демонстрационных данных.'),
      media: { variant: 'screen', layout: 'phones', items: [before, after] } },
    facts: [{ term: t('Source', 'Источник'), value: 'Pawly · EN/RU demo' }, { term: t('Status', 'Статус'), value: t('Integration fixture', 'Проверочный пример') }],
    blocks: [
      { id: 'return-boundary', type: 'steps', motion: 'static', evidenceId: 'film-common-adapter', payload: {
        label: t('Return sequence', 'Последовательность возвращения'), items: [
          { label: t('Before', 'До'), thesis: t('The expected return', 'Ожидаемое возвращение'), shot: before },
          { label: t('Manual film', 'Ручной фильм'), thesis: t('Choose when to watch', 'Посмотреть фильм'), body: t('Play the original demo recording. The still report below remains available.', 'Запустите исходную запись демо. Статичный отчёт ниже остаётся доступен.'), shot: { ...poster, video: `${base}/clip-return-proof`, film: true } },
          { label: t('After', 'После'), thesis: t('The received report', 'Полученный отчёт'), shot: after },
        ] } },
      { id: 'loop-regression', type: 'shot', motion: 'static', payload: {
        thesis: { label: t('Loop comparison', 'Сравнение с петлёй'), thesis: t('The existing clip mode', 'Обычная петля') },
        shot: { layout: 'phones', items: [{ ...poster, video: `${base}/clip-return-proof` }], caption: t('The same original recording, only for loop regression.', 'Та же исходная запись — только для проверки режима петли.') } } },
      { id: 'fixture-result', type: 'outcome', motion: 'static', evidenceId: 'film-common-runtime', payload: {
        result: { label: t('Boundary', 'Граница'), thesis: t('This verifies a shared carrier', 'Это проверка общего носителя') },
        evidence: { label: t('Material', 'Материал'), text: t('Original EN/RU recordings and posters copied without edits.', 'Исходные EN/RU записи и постеры скопированы без правок.') },
        tradeoff: { label: t('Scope', 'Область'), text: t('This fixture does not accept or publish the Pawly case.', 'Этот пример не означает приёмку или публикацию кейса Pawly.') },
      } },
    ],
  });
}
assertStoryPair(filmCommonFixture('en'), filmCommonFixture('ru'));
