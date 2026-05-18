import fs from 'fs';
import path from 'path';

const POST_REGEX = /## POST \d:.*?\r?\n\*\*Palabra Clave Principal:\*\* (.*?)\r?\n\*\*GEO Objetivo:\*\*.*?\r?\n\*\*(?:Estructura AI|Estructura ADR-002):\*\*.*?\r?\n+### Título \(H1\): (.*?)\r?\n\r?\n([\s\S]*?)(?=\r?\n---|\r?\n## POST \d|$)/g;

const content1 = fs.readFileSync(path.join(__dirname, '../docs/blog-posts-jardin-cesped.md'), 'utf-8');
const content2 = fs.readFileSync(path.join(__dirname, '../docs/blog-posts-paisajismo.md'), 'utf-8');

let match;
let count = 0;
while ((match = POST_REGEX.exec(content1)) !== null) {
  count++;
  console.log(`Match 1: ${match[2]}`);
}
console.log(`Found ${count} in file 1`);

count = 0;
while ((match = POST_REGEX.exec(content2)) !== null) {
  count++;
  console.log(`Match 2: ${match[2]}`);
}
console.log(`Found ${count} in file 2`);
