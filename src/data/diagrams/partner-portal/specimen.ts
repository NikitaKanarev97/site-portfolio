import { portalSpecimen } from '../../../copy/common/partner-portal';
import type { Specimen } from '../../../copy/cases/story';
export function partnerPortalSpecimen(lang:'en'|'ru'): Specimen {
  const base=portalSpecimen(lang), ru=lang==='ru';
  const state=(family:string,id:string,label:string,russian:string,alt:string,altRu:string)=>({
    id,label:ru?russian:label,mediaId:`portal-${family}-${id}`,shot:{
      src:`/media/rebuild/partner-portal/${family}-${id}-288.webp`,
      srcNarrow:`/media/rebuild/partner-portal/${family}-${id}-288.webp`,
      alt:ru?altRu:alt,device:'panel' as const,nativeWidth:292,
    },
  });
  const resolution=base.sets[0];
  return {...base,groups:[{id:'intake',title:ru?'Строка и импорт':'Line and import'},{id:'commerce',title:ru?'Наличие и поставка':'Availability and supply'}],sets:[
    {...resolution,states:[resolution.states[0],resolution.states[1],
      state('resolutionrow','changed','Changed · confirm replacement','Изменён · подтвердить замену','Source line and quantity retained; superseded manufacturer code needs replacement confirmation','Исходная строка и количество сохранены; устаревший код требует подтверждения замены'),resolution.states[3]]},
    base.sets[1],base.sets[2],
    {id:'fulfillment',title:'FulfillmentPlan',group:'commerce',states:[
      state('fulfillmentplan','default','Default · compare shipment terms','Обычный · сравнить поставку','One shipment plan with stock, completion date, warehouse and delivery cost','План одной поставки: наличие, дата, склад и стоимость доставки'),
      state('fulfillmentplan','selected','Selected · choice remains visible','Выбран · выбор виден','Selected plan retains all shipment terms and selected action','Выбранный план сохраняет все условия и явно отмеченный выбор'),
      state('fulfillmentplan','unavailable','Unavailable · reason stated','Недоступен · причина названа','Plan unavailable because seven lines have no stock at this warehouse','План недоступен: семи строк нет на выбранном складе'),
    ]},
  ],caption:ru?'Четыре семейства · 13 состояний · настоящий UI на демоданных':'Four domain families · 13 states · actual UI on synthetic data'};
}
