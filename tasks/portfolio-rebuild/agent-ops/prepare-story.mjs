/** One-time editorial transfer from unchanged checkpoint; no shared edits. */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const marker='\n/* F · ordered checkpoint transfer */\n';
const enFile='src/copy/cases/agent-ops-console.ts',ruFile='src/copy/ru/cases/agent-ops-console.ts';
let en=readFileSync('src/copy/pilot/agent-ops.ts','utf8')
  .replace("from '../cases/story'", "from './story'")
  .replace("const PROTOTYPE = 'https://agent-ops-console.vercel.app';\n",'')
  .replaceAll('material','agentOpsMaterial')
  .replace('export const agentOpsPilot','export const agentOpsStory')
  .replace("value: 'User-tested, accepted'", "value: 'Paid client · user-tested, accepted'");
writeFileSync(enFile,readFileSync(enFile,'utf8').split(marker)[0]+marker+en);
let ru=readFileSync('src/copy/common/agent-ops.ts','utf8')
  .replace("import { agentOpsPilot as en } from '../pilot/agent-ops';", "import { agentOpsStory as en } from '../../cases/agent-ops-console';")
  .replace("from '../cases/story'", "from '../../cases/story'")
  .replace('const ru = defineStory', 'export const agentOpsStoryRu = defineStory')
  .replace('assertStoryPair(en,ru);','assertStoryPair(en,agentOpsStoryRu);')
  .replace('export const commonAgent = { en, ru };','')
  .replace('Обещание рядом с доказательством','Слова рядом с фактами')
  .replace('Обещание без опоры','У обещания нет опоры')
  .replace('Деньги ждут решения человека','Нет «да» — нет выплаты')
  .replace("value:'Web, desktop-first'", "value:'Web · компьютер и телефон'")
  .replace("value:'Проверен с пользователями, принят'", "value:'Платный заказ · проверен, принят'")
  .replace("value:'1,770'", "value:'1 770'")
  .replace("value:'2.4 h'", "value:'2,4 ч'")
  .replace('href:en.prototype.href', "href:'https://agent-ops-console.vercel.app/ru/'")
  .replace("prototype:{ ...en.prototype, label:", "prototype:{ ...en.prototype, href:'https://agent-ops-console.vercel.app/ru/', label:")
  .replace("const stepTexts =", `const localMedia = <T extends {src:string;srcNarrow?:string}>(shot:T):T => ({...shot, src:shot.src.replace('/media/pilot-agent-ops','/media/rebuild/agent-ops/ru'), ...(shot.srcNarrow ? {srcNarrow:shot.srcNarrow.replace('/media/pilot-agent-ops','/media/rebuild/agent-ops/ru')} : {})});\nconst stepTexts =`)
  .replace('shot: { ...item.shot, alt:', 'shot: { ...localMedia(item.shot), alt:')
  .replace('callout:{ ...block.payload.callout, alt:', 'callout:{ ...localMedia(block.payload.callout), alt:')
  .replace('shot:{ ...en.cover.media.shot, alt:', 'shot:{ ...localMedia(en.cover.media.shot), alt:')
  .replace('({ ...s, alt:i', '({ ...localMedia(s), alt:i');
writeFileSync(ruFile,(readFileSync(ruFile,'utf8').split(marker)[0]+marker+ru).trimEnd()+'\n');
mkdirSync('src/pages/preview/agent-ops-rebuild',{recursive:true});
writeFileSync('src/pages/preview/agent-ops-rebuild/[locale].astro',`---
import PageShell from '../../../layouts/PageShell.astro';
import CaseStory from '../../../components/CaseStory.astro';
import { agentOpsStory } from '../../../copy/cases/agent-ops-console';
import { agentOpsStoryRu } from '../../../copy/ru/cases/agent-ops-console';
import { site } from '../../../copy/site';
import { siteRu } from '../../../copy/ru/site';
export function getStaticPaths() { return ['en','ru'].map(locale => ({ params: { locale } })); }
const lang = Astro.params.locale as 'en' | 'ru';
const story = lang === 'ru' ? agentOpsStoryRu : agentOpsStory;
const next = { href: lang === 'ru' ? '/ru/work/partner-portal/' : '/work/partner-portal/', title: 'Partner Portal', theme: 'portal' as const, label: lang === 'ru' ? 'Следующий кейс' : 'Next case' };
---
<PageShell title={story.cover.title + (lang === 'ru' ? ' — перенос checkpoint' : ' — checkpoint transfer')} description={story.cover.outcome} lang={lang} siteCopy={lang === 'ru' ? siteRu : site} localePaths={{en:'/preview/agent-ops-rebuild/en/',ru:'/preview/agent-ops-rebuild/ru/'}} noindex canonical={false} current={lang === 'ru' ? '/ru/work' : '/work'}>
  <CaseStory story={story} lang={lang} id="agent-ops-rebuild" next={next} />
</PageShell>
`);
console.log('Prepared independent F EN/RU story exports and isolated preview.');
