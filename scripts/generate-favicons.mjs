import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SVG_SOURCE = 'public/favicon.svg';
const OUTPUT_DIR = 'public/media';

const SIZES = [
  { name: 'favicon-48.png', size: 48 },
  { name: 'favicon-96.png', size: 96 },
  { name: 'favicon-180.png', size: 180 },
  { name: 'favicon-192.png', size: 192 },
];

async function generateFavicons() {
  console.log('🚀 Iniciando generación de favicons PNG optimizados a partir del SVG...');
  
  if (!fs.existsSync(SVG_SOURCE)) {
    console.error(`❌ Error: El archivo origen ${SVG_SOURCE} no existe.`);
    process.exit(1);
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  try {
    for (const item of SIZES) {
      const outputPath = path.join(OUTPUT_DIR, item.name);
      
      await sharp(SVG_SOURCE)
        .resize(item.size, item.size)
        .png()
        .toFile(outputPath);
        
      console.log(`✅ Generado favicon: ${outputPath} (${item.size}x${item.size}px)`);
    }
    console.log('🎉 ¡Todos los favicons PNG se han generado con éxito!');
  } catch (error) {
    console.error('❌ Error durante el procesamiento de imágenes:', error);
    process.exit(1);
  }
}

generateFavicons();
