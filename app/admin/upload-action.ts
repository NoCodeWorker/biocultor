'use server';

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const ALLOWED_EXTS = new Set(['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'svg']);
const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
  'image/svg+xml',
]);
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

type UploadResult =
  | { success: true; url: string; error?: undefined }
  | { success: false; error: string; url?: undefined };

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  const file = formData.get('file');
  if (!(file instanceof File)) {
    return { success: false, error: 'No se proporcionó ningún archivo.' };
  }

  if (file.size === 0) {
    return { success: false, error: 'El archivo está vacío.' };
  }
  if (file.size > MAX_BYTES) {
    return { success: false, error: `Imagen demasiado grande (${(file.size / 1024 / 1024).toFixed(1)}MB). Máx ${MAX_BYTES / 1024 / 1024}MB.` };
  }

  const rawExt = (file.name.split('.').pop() ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const ext = ALLOWED_EXTS.has(rawExt) ? rawExt : '';
  if (!ext) {
    return { success: false, error: 'Extensión no permitida. Usa jpg, png, webp, avif, gif o svg.' };
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return { success: false, error: `Tipo MIME no permitido (${file.type || 'desconocido'}).` };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Nombre limpio: timestamp + random + ext sanitizada. Sin path traversal.
  const stamp = Date.now();
  const random = Math.round(Math.random() * 1e9).toString(36);
  const filename = `${stamp}-${random}.${ext}`;

  const uploadDir = join(process.cwd(), 'public', 'uploads');
  try {
    await mkdir(uploadDir, { recursive: true });
    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);
    return { success: true, url: `/uploads/${filename}` };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { success: false, error: 'Error al guardar el archivo en el servidor.' };
  }
}
