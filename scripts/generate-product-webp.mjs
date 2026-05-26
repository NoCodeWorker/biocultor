/**
 * generate-product-webp.mjs
 * 
 * Convierte los JPGs de producto en WebP optimizados para las señales SEO:
 *   • Dimensiones: 1200×1200 (ratio 1:1 para miniaturas de SERP)
 *   • Calidad: 85 (equilibrio entre calidad visual y tamaño de archivo)
 *   • Formato de salida: /public/media/<nombre>.webp
 *
 * Uso:
 *   node scripts/generate-product-webp.mjs
 *
 * Requiere: sharp (ya incluido en las devDependencies de Next.js)
 */

import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const MEDIA_DIR = path.join(PUBLIC_DIR, 'media');

// Mapa explícito: JPG origen → nombre del WebP de destino
// ─────────────────────────────────────────────────────────
// TÉ DE HUMUS DE LOMBRIZ (te-humus-liquido-premium)
const CONVERSIONS_HUMUS = [
  { src: path.join(PUBLIC_DIR, '5 litros.jpg'),  dest: path.join(MEDIA_DIR, 'te-humus-5l.webp') },
  { src: path.join(PUBLIC_DIR, '1 litro.jpg'),   dest: path.join(MEDIA_DIR, 'te-humus-1l.webp') },
  { src: path.join(PUBLIC_DIR, '10 litros.jpg'), dest: path.join(MEDIA_DIR, 'te-humus-10l.webp') },
  { src: path.join(PUBLIC_DIR, '25 litros.jpg'), dest: path.join(MEDIA_DIR, 'te-humus-25l.webp') },
];

// PURÍN CONCENTRADO DE ORTIGA (purin-ortiga-concentrado)
// Mismas fotos de formato, nombres de destino distintos para URLs únicas.
// Google diferencia ambos productos en su índice por la URL de imagen.
const CONVERSIONS_ORTIGA = [
  { src: path.join(PUBLIC_DIR, '5 litros.jpg'),  dest: path.join(MEDIA_DIR, 'purin-ortiga-5l.webp') },
  { src: path.join(PUBLIC_DIR, '1 litro.jpg'),   dest: path.join(MEDIA_DIR, 'purin-ortiga-1l.webp') },
  { src: path.join(PUBLIC_DIR, '10 litros.jpg'), dest: path.join(MEDIA_DIR, 'purin-ortiga-10l.webp') },
  { src: path.join(PUBLIC_DIR, '25 litros.jpg'), dest: path.join(MEDIA_DIR, 'purin-ortiga-25l.webp') },
];

const ALL_CONVERSIONS = [...CONVERSIONS_HUMUS, ...CONVERSIONS_ORTIGA];

console.log('🌿 Generando imágenes WebP optimizadas para SEO de producto...\n');

for (const { src, dest } of ALL_CONVERSIONS) {
  try {
    await sharp(src)
      .resize(1200, 1200, {
        fit: 'contain',          // Respeta la proporción sin recortar
        background: { r: 255, g: 253, b: 248, alpha: 1 }, // cream-warm background
      })
      .webp({ quality: 85, effort: 6 })
      .toFile(dest);

    const destName = path.basename(dest);
    console.log(`  ✅ ${destName} generado`);
  } catch (err) {
    const srcName = path.basename(src);
    const destName = path.basename(dest);
    console.error(`  ❌ Error convirtiendo ${srcName} → ${destName}:`, err.message);
  }
}

console.log('\n✅ Conversión WebP completada. Archivos en /public/media/');
console.log('   Recuerda hacer deploy para que Googlebot pueda rastrear las imágenes.');
