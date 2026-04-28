import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(request: Request, { params }: { params: { filename: string } }) {
  const filename = params.filename;
  
  // Basic security: prevent path traversal
  if (!filename || filename.includes('..') || filename.includes('/')) {
    return new NextResponse('Not Found', { status: 404 });
  }

  try {
    const filePath = join(process.cwd(), 'public', 'uploads', filename);
    
    if (!existsSync(filePath)) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const buffer = await readFile(filePath);
    
    // Determine content type
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const mimeTypes: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'webp': 'image/webp',
      'avif': 'image/avif',
      'gif': 'image/gif',
      'svg': 'image/svg+xml'
    };
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': mimeTypes[ext] || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
