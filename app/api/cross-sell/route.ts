import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const revalidate = 3600; // Cachear 1 hora

export async function GET() {
  try {
    const [ort5L, bio5L, ort1L, bio1L] = await Promise.all([
      prisma.variant.findFirst({
        where: { sku: 'ORT-5L' },
        include: { product: true }
      }),
      prisma.variant.findFirst({
        where: { sku: 'BIO-5L' },
        include: { product: true }
      }),
      prisma.variant.findFirst({
        where: { sku: 'ORT-1L' },
        include: { product: true }
      }),
      prisma.variant.findFirst({
        where: { sku: 'BIO-1L' },
        include: { product: true }
      })
    ]);
    
    return NextResponse.json({ ort5L, bio5L, ort1L, bio1L });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching cross-sell variants' }, { status: 500 });
  }
}

