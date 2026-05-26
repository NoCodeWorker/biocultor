/**
 * generate-product-webp.mjs
 * 
 * Convierte los WEBP reales de producto (descargados desde uploads/ del VPS)
 * en WebPs cuadrados 1200×1200 optimizados para señales SEO de Google:
 *   • Dimensiones: 1200×1200 (ratio 1:1 para miniaturas de SERP)
 *   • Calidad: 85
 *   • fit: cover (recorta manteniendo el aspecto visual del producto)
 */

import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MEDIA_DIR = path.join(__dirname, '..', 'public', 'media');

const CONVERSIONS = [
  // ── Té de Humus de Lombriz ──────────────────────────────────────────────
  { src: 'real-humus-1l-src.webp',  dest: 'te-humus-1l.webp',  alt: '1 Litro' },
  { src: 'real-humus-5l-src.webp',  dest: 'te-humus-5l.webp',  alt: '5 Litros' },
  { src: 'real-humus-10l-src.webp', dest: 'te-humus-10l.webp', alt: '10 Litros' },
  { src: 'real-humus-25l-src.webp', dest: 'te-humus-25l.webp', alt: '25 Litros' },

  // ── Purín Concentrado de Ortiga ─────────────────────────────────────────
  { src: 'real-ortiga-1l-src.webp',  dest: 'purin-ortiga-1l.webp',  alt: '1 Litro' },
  { src: 'real-ortiga-5l-src.webp',  dest: 'purin-ortiga-5l.webp',  alt: '5 Litros' },
  { src: 'real-ortiga-10l-src.webp', dest: 'purin-ortiga-10l.webp', alt: '10 Litros' },
  { src: 'real-ortiga-25l-src.webp', dest: 'purin-ortiga-25l.webp', alt: '25 Litros' },
];

async function run() {
  let ok = 0, fail = 0;
  for (const { src, dest, alt } of CONVERSIONS) {
    const srcPath  = path.join(MEDIA_DIR, src);
    const destPath = path.join(MEDIA_DIR, dest);
    if (!fs.existsSync(srcPath)) {
      console.warn(`⚠  Fuente no encontrada: ${src}  (saltar)`);
      fail++;
      continue;
    }
    try {
      await sharp(srcPath)
        .resize(1200, 1200, { fit: 'cover', position: 'centre' })
        .webp({ quality: 85 })
        .toFile(destPath);
      const kb = Math.round(fs.statSync(destPath).size / 1024);
      console.log(`✅  ${dest}  (${alt})  →  ${kb} KB`);
      ok++;
    } catch (err) {
      console.error(`❌  ${dest}: ${err.message}`);
      fail++;
    }
  }
  console.log(`\nResumen: ${ok} generados, ${fail} errores.`);
}

run();
