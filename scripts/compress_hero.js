import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

let pngSourcePath = path.resolve('public/hero-bg.png');
let srcPath = path.resolve('public/te-de-humus-de-lombriz-biocultor.avif');
let tempPath = path.resolve('public/te-de-humus-de-lombriz-biocultor.temp.avif');

let compressionSource = srcPath;
if (fs.existsSync(pngSourcePath)) {
  console.log(`Found original PNG source at: ${pngSourcePath}`);
  compressionSource = pngSourcePath;
} else if (!fs.existsSync(srcPath)) {
  console.error(`Source file not found at: ${srcPath}`);
  process.exit(1);
}

const originalSize = fs.statSync(compressionSource).size;
console.log(`Source image (${path.basename(compressionSource)}) size: ${(originalSize / 1024).toFixed(2)} KB`);

console.log('Optimizing image with sharp using AVIF quality: 16...');
sharp(compressionSource)
  .avif({ quality: 16, effort: 4 })

  .toFile(tempPath)
  .then((info) => {
    const compressedSize = fs.statSync(tempPath).size;
    console.log(`Compressed image size: ${(compressedSize / 1024).toFixed(2)} KB`);
    console.log(`Saved ${((originalSize - compressedSize) / 1024).toFixed(2)} KB (${((1 - compressedSize / originalSize) * 100).toFixed(2)}% reduction)`);
    
    // Replace original file
    if (fs.existsSync(srcPath)) {
      fs.unlinkSync(srcPath);
    }
    fs.renameSync(tempPath, srcPath);
    console.log(`Successfully replaced/created ${srcPath} with the highly optimized quality: 22 AVIF version!`);
  })
  .catch((err) => {
    console.error('Error during compression:', err);
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    process.exit(1);
  });
