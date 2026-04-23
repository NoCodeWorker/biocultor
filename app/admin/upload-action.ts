'use server';

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) {
    return { error: 'No se proporcionó ningún archivo.' };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate unique filename to avoid overwrites
  const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const extension = file.name.split('.').pop() || 'jpg';
  const filename = `${uniquePrefix}.${extension}`;

  const uploadDir = join(process.cwd(), 'public', 'uploads');
  
  try {
    // Ensure the uploads directory exists
    await mkdir(uploadDir, { recursive: true });
    
    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);
    
    // Return the public URL
    return { success: true, url: `/uploads/${filename}` };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { error: 'Error al guardar el archivo en el servidor.' };
  }
}
