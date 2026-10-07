import { defineDiagram } from '../schema';
/** Selected screen hierarchy, not the sequential flow. HA-MAP-01. */
export const partnerPortalMap = defineDiagram({
  kind:'map', title:{en:'Selected procurement screens',ru:'Выбранные экраны закупки'},
  summary:{en:'Dashboard opens file import, Quick order, Cart and Order details. Both intakes share Resolution Center. Cart contains supply planning and checkout. Eight selected screens, not the entire product.',ru:'С главной доступны импорт файла, быстрый заказ, корзина и детали заказа. Оба входа ведут на общий экран сопоставления. В корзине доступны план поставки и оформление. Восемь выбранных экранов, не весь продукт.'},
  heading:{lead:{en:'Screen map',ru:'Карта экранов'},name:{en:'Procurement workspace',ru:'Рабочее место закупки'}},
  size:{w:146,h:61},
  nodes:[
    {id:'home',type:'entry',at:[61,0],w:24,label:{en:'Dashboard',ru:'Главная'},num:1},
    {id:'xls',type:'screen',at:[0,18],w:28,label:{en:'XLS import',ru:'Импорт XLS'},num:2},
    {id:'quick',type:'screen',at:[34,18],w:28,label:{en:'Quick order',ru:'Быстрый заказ'},num:3},
    {id:'resolve',type:'screen',at:[17,39],w:28,label:{en:'Resolution',ru:'Сопоставление'},num:4,actions:[{label:{en:'choose a match',ru:'выбрать товар'}},{label:{en:'correct source',ru:'исправить строку'}}]},
    {id:'cart',type:'screen',at:[79,18],w:26,label:{en:'Cart',ru:'Корзина'},num:5},
    {id:'plan',type:'screen',at:[69,39],w:28,label:{en:'Supply plan',ru:'План поставки'},num:6},
    {id:'checkout',type:'screen',at:[103,39],w:28,label:{en:'Checkout',ru:'Оформление'},num:7,actions:[{label:{en:'confirm terms',ru:'подтвердить условия'}}]},
    {id:'order',type:'screen',at:[113,18],w:32,label:{en:'Order details',ru:'Детали заказа'},num:8},
  ],
  edges:[
    {id:'home-xls',from:'home',to:'xls',exit:'b',enter:'t',via:[[73,11],[14,11]]},
    {id:'home-quick',from:'home',to:'quick',exit:'b',enter:'t',via:[[73,11],[48,11]]},
    {id:'home-cart',from:'home',to:'cart',exit:'b',enter:'t',via:[[73,11],[92,11]]},
    {id:'home-order',from:'home',to:'order',exit:'b',enter:'t',via:[[73,11],[129,11]]},
    {id:'xls-resolve',from:'xls',to:'resolve',exit:'b',enter:'t',via:[[14,31],[31,31]]},
    {id:'quick-resolve',from:'quick',to:'resolve',exit:'b',enter:'t',via:[[48,31],[31,31]]},
    {id:'cart-plan',from:'cart',to:'plan',exit:'b',enter:'t',via:[[92,31],[83,31]]},
    {id:'cart-checkout',from:'cart',to:'checkout',exit:'b',enter:'t',via:[[92,31],[117,31]]},
  ],
  mobile:{size:{w:29,h:136},nodes:[
    {id:'home',at:[3,0],w:24},{id:'xls',at:[3,17],w:24},{id:'quick',at:[3,31],w:24},
    {id:'resolve',at:[3,48],w:24},{id:'cart',at:[3,76],w:24},{id:'plan',at:[3,93],w:24},
    {id:'checkout',at:[3,107],w:24},{id:'order',at:[3,131],w:24},
  ],edges:[
    {id:'home-xls',exit:'b',enter:'t'},
    {id:'home-quick',exit:'l',enter:'l',via:[[0,2.5],[0,33.5]]},
    {id:'home-cart',exit:'r',enter:'r',via:[[29,2.5],[29,78.5]]},
    {id:'home-order',exit:'r',enter:'r',via:[[29,2.5],[29,133.5]]},
    {id:'xls-resolve',exit:'l',enter:'l',via:[[1,19.5],[1,50.5]]},
    {id:'quick-resolve',exit:'b',enter:'t'},
    {id:'cart-plan',exit:'b',enter:'t'},
    {id:'cart-checkout',exit:'l',enter:'l',via:[[1,78.5],[1,109.5]]},
  ]},
});
