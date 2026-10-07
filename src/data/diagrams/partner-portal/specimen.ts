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
  return {...base,type:[],colors:[],groups:[{id:'intake',title:ru?'Выбор товара':'Product choice'},{id:'commerce',title:ru?'Наличие и поставка':'Availability and supply'}],sets:[
    {...resolution,states:[resolution.states[0],resolution.states[3]]},
    {...base.sets[2],states:[base.sets[2].states[0],base.sets[2].states[2]]},
    {id:'fulfillment',title:'FulfillmentPlan',group:'commerce',states:[
      state('fulfillmentplan','selected','Selected · choice remains visible','Выбран · выбор виден','Selected plan retains all shipment terms and selected action','Выбранный план сохраняет все условия и явно отмеченный выбор'),
      state('fulfillmentplan','unavailable','Unavailable · reason stated','Недоступен · причина названа','Plan unavailable because seven lines have no stock at this warehouse','План недоступен: семи строк нет на выбранном складе'),
    ]},
  ],caption:ru?'Выбор товара, подтверждение наличия и возможность поставки':'Product choice, stock confirmation and shipment availability'};
}
