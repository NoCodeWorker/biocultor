import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgPath = path.join(__dirname, '../public/favicon.svg');
const icoPath = path.join(__dirname, '../public/favicon.ico');

async function generateFavicon() {
  try {
    console.log('Cargando favicon.svg...');
    if (!fs.existsSync(svgPath)) {
      throw new Error(`El archivo original no existe en ${svgPath}`);
    }

    const sizes = [16, 32, 48];
    const pngBuffers = [];

    for (const size of sizes) {
      console.log(`Renderizando SVG a PNG ${size}x${size}...`);
      const buffer = await sharp(svgPath)
        .resize(size, size)
        .png()
        .toBuffer();
      pngBuffers.push(buffer);
    }

    console.log('Compilando buffers en formato ICO...');
    
    // Cabecera del ICO: 6 bytes
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0); // Reservado: 0
    header.writeUInt16LE(1, 2); // Tipo: 1 (Icono)
    header.writeUInt16LE(sizes.length, 4); // Número de imágenes

    const directoryEntries = [];
    let currentOffset = 6 + sizes.length * 16;

    for (let i = 0; i < sizes.length; i++) {
      const size = sizes[i];
      const pngBuffer = pngBuffers[i];
      const bufferSize = pngBuffer.length;

      const entry = Buffer.alloc(16);
      entry.writeUInt8(size === 256 ? 0 : size, 0); // Ancho
      entry.writeUInt8(size === 256 ? 0 : size, 1); // Alto
      entry.writeUInt8(0, 2); // Paleta: 0 (Sin paleta)
      entry.writeUInt8(0, 3); // Reservado
      entry.writeUInt16LE(1, 4); // Planos de color: 1
      entry.writeUInt16LE(32, 6); // Bits por píxel: 32 (RGBA)
      entry.writeUInt32LE(bufferSize, 8); // Tamaño del PNG
      entry.writeUInt32LE(currentOffset, 12); // Offset del PNG

      directoryEntries.push(entry);
      currentOffset += bufferSize;
    }

    const icoBuffer = Buffer.concat([
      header,
      ...directoryEntries,
      ...pngBuffers
    ]);

    fs.writeFileSync(icoPath, icoBuffer);
    console.log(`¡Éxito! Favicon tradicional (.ico) guardado en: ${icoPath}`);
    console.log(`Tamaño total del archivo .ico: ${icoBuffer.length} bytes`);
  } catch (error) {
    console.error('Error generando el favicon:', error);
    process.exit(1);
  }
}

generateFavicon();
