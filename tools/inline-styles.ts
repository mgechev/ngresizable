import { writeFileSync, readFileSync } from 'fs';

let resizable = readFileSync('lib/ngresizable.component.ts').toString();
writeFileSync('lib/ngresizable.component.ts.bak', resizable);

const styles = readFileSync('lib/ngresizable.component.css');
resizable = resizable.replace(/styleUrls:\s*\[.*?\]/, `styles: [\`${styles}\`]`);

writeFileSync('lib/ngresizable.component.ts', resizable);
