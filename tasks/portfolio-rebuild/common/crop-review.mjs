import sharp from 'sharp';
for(const width of [1440,390]){
const file=`tasks/portfolio-rebuild/common/shots/partner-portal-${width}-domain-system.png`;
await sharp(file).extract({left:0,top:0,width,height:width===390?1300:1100}).png().toFile(`tasks/portfolio-rebuild/common/shots/partner-portal-${width}-foundation-detail.png`);
}
