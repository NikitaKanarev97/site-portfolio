import{readFile,writeFile}from'node:fs/promises';
const file='tasks/portfolio-rebuild/art-direction/art-review.html';let html=await readFile(file,'utf8');
html=html.replaceAll('две последствия','два последствия');
if(!html.includes('<h2>Точный край Portal</h2>'))html=html.replace('<section><h2>Native edge Learn</h2>','<section><h2>Точный край Portal</h2><p>Красная обводка самого native компонента. Внешний фон прозрачный; дополнительного скругляющего кропа и белой каймы нет.</p><img src="shots/scenes/availability-native-edge-1440.png" alt="Красная обводка точно по native контуру"></section><section><h2>Native edge Learn</h2>');
if(!html.includes('references/dounar-motion-sheet.jpg'))html=html.replace('<figure><figcaption>Garri · native UI / глава</figcaption>','<figure><figcaption>Dounar · архив homepage / TopNote. Black Forest просмотрен отдельно live.</figcaption><img src="references/dounar-motion-sheet.jpg"></figure><figure><figcaption>H · Learn: общий материал и два контекста</figcaption><img src="shots/scenes/shared-material.png"></figure><figure><figcaption>Garri · native UI / глава</figcaption>');
await writeFile(file,html);console.log('Updated private comparison gallery');
