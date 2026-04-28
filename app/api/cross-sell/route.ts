import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const revalidate = 3600; // Cachear 1 hora

export async function GET() {
  try {
    const ort5L = await prisma.variant.findFirst({
      where: { sku: 'ORT-5L' },
      include: { product: true }
    });
    
    const bio5L = await prisma.variant.findFirst({
      where: { sku: 'BIO-5L' },
      include: { product: true }
    });
    
    return NextResponse.json({ ort5L, bio5L });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching cross-sell variants' }, { status: 500 });
  }
}
