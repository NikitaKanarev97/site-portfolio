import { defineDiagram } from '../schema';
/** Editorial reconstruction of current responsibilities. HA-FLOW-01. */
export const partnerPortalFlow = defineDiagram({
  kind:'flow',title:{en:'From XLS to order creation',ru:'От XLS к созданию заказа'},
  summary:{en:'Read imported lines. Unresolved identity requires buyer selection or correction and recheck. Cart separately reviews commercial change. Choose a supply plan, confirm terms, create an order. Source text after creation is not yet stored.',ru:'Прочитать импортированные строки. Нерешённое соответствие требует выбора или исправления и повторной проверки. Корзина отдельно проверяет коммерческие изменения. Выбрать план поставки, подтвердить условия, создать заказ. Исходный текст после создания пока не хранится.'},
  heading:{lead:{en:'User flow',ru:'Сценарий'},name:{en:'From XLS to order',ru:'От XLS к заказу'}},size:{w:149,h:56},
  nodes:[
    {id:'upload',type:'start',at:[0,10],w:18,label:{en:'Upload XLS',ru:'Загрузить XLS'}},
    {id:'read',type:'screen',at:[24,10],w:20,label:{en:'Read lines',ru:'Прочитать строки'}},
    {id:'issues',type:'decision',at:[51,4.5],label:{en:'Unresolved lines?',ru:'Есть нерешённые строки?'}},
    {id:'choose',type:'input',at:[46,32],w:26,label:{en:'Choose / correct',ru:'Выбрать / исправить'}},
    {id:'cart',type:'screen',at:[75,10],w:15,label:{en:'Cart',ru:'Корзина'}},
    {id:'delta',type:'decision',at:[97,4.5],label:{en:'Commercial change?',ru:'Коммерческая дельта?'}},
    {id:'accept',type:'input',at:[92,32],w:26,label:{en:'Accept / resolve',ru:'Принять / разрешить'}},
    {id:'plan',type:'screen',at:[122,10],w:26,label:{en:'Choose plan',ru:'Выбрать план'}},
    {id:'terms',type:'input',at:[122,32],w:26,label:{en:'Confirm terms',ru:'Подтвердить условия'}},
    {id:'done',type:'screen',at:[122,51],w:26,label:{en:'Order created',ru:'Заказ создан'}},
  ],edges:[
    {id:'upload-read',from:'upload',to:'read'},{id:'read-issues',from:'read',to:'issues'},
    {id:'issues-choose',from:'issues',to:'choose',exit:'b',enter:'t',answer:'yes'},
    {id:'choose-recheck',from:'choose',to:'issues',exit:'l',enter:'l',via:[[46,34.5],[46,12.5]]},
    {id:'issues-cart',from:'issues',to:'cart',exit:'r',enter:'l',answer:'no'},
    {id:'cart-delta',from:'cart',to:'delta'},
    {id:'delta-accept',from:'delta',to:'accept',exit:'b',enter:'t',answer:'yes'},
    {id:'accept-recheck',from:'accept',to:'cart',exit:'l',enter:'b',via:[[82.5,34.5]]},
    {id:'delta-plan',from:'delta',to:'plan',exit:'r',enter:'l',answer:'no'},
    {id:'plan-terms',from:'plan',to:'terms',exit:'b',enter:'t'},
    {id:'terms-done',from:'terms',to:'done',exit:'b',enter:'t'},
  ],mobile:{size:{w:29,h:175},nodes:[
    {id:'upload',at:[3,0],w:24},{id:'read',at:[3,11],w:24},{id:'issues',at:[7,24]},
    {id:'choose',at:[2,50],w:27},{id:'cart',at:[3,69],w:24},{id:'delta',at:[7,84]},
    {id:'accept',at:[2,111],w:27},{id:'plan',at:[3,134],w:24},{id:'terms',at:[3,152],w:24},{id:'done',at:[3,170],w:24},
  ],edges:[
    {id:'upload-read',exit:'r',enter:'t',via:[[29,2.5],[29,8],[15,8]]},
    {id:'read-issues',exit:'b',enter:'t'},{id:'issues-choose',exit:'b',enter:'t'},
    {id:'choose-recheck',exit:'l',enter:'l',via:[[0,52.5],[0,32]]},
    {id:'issues-cart',exit:'r',enter:'r',via:[[30,32],[30,71.5]]},
    {id:'cart-delta',exit:'b',enter:'t'},{id:'delta-accept',exit:'b',enter:'t'},
    {id:'accept-recheck',exit:'l',enter:'l',via:[[0,113.5],[0,71.5]]},
    {id:'delta-plan',exit:'r',enter:'r',via:[[30,92],[30,136.5]]},
    {id:'plan-terms',exit:'b',enter:'t'},{id:'terms-done',exit:'b',enter:'t'},
  ]},
});
