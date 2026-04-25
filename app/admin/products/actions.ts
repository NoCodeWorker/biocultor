'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const SLUG_REGEX = /^[a-z0-9-]+$/;
const SKU_REGEX = /^[A-Z0-9-]+$/;

// Forma única que cumplen todas las acciones del admin de productos. Mantener
// las dos claves opcionales evita que TypeScript genere uniones que rompen el
// uso desde useActionState y el `if (result?.error)` en los componentes cliente.
export type ActionResult = { success?: boolean; error?: string };

export const initialActionState: ActionResult = { success: false, error: '' };

function revalidatePublic(slug?: string | null) {
  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/sitemap.xml');
  if (slug) {
    revalidatePath(`/producto/${slug}`);
    revalidatePath('/admin/products/[id]', 'page');
  }
}

function asString(value: FormDataEntryValue | null) {
  return typeof value === 'string' ? value.trim() : '';
}

function asOptionalFloat(value: FormDataEntryValue | null): number | null {
  const s = typeof value === 'string' ? value.trim() : '';
  if (!s) return null;
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

function asInt(value: FormDataEntryValue | null, fallback = 0): number {
  const s = typeof value === 'string' ? value.trim() : '';
  if (!s) return fallback;
  const n = parseInt(s, 10);
  return Number.isFinite(n) ? n : fallback;
}

// -----------------------------------------------------------------------------
// PRODUCT CRUD
// -----------------------------------------------------------------------------

export async function createProduct(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const name = asString(formData.get('name'));
  const slug = asString(formData.get('slug')).toLowerCase();
  const description = asString(formData.get('description'));
  const benefits = asString(formData.get('benefits'));

  if (!name || !slug || !description) {
    return { success: false, error: 'Nombre, slug y descripción son obligatorios.' };
  }
  if (!SLUG_REGEX.test(slug)) {
    return { success: false, error: 'Slug solo admite minúsculas, números y guiones (sin espacios).' };
  }

  const collision = await prisma.product.findUnique({ where: { slug } });
  if (collision) {
    return { success: false, error: `Ya existe un producto con slug "${slug}".` };
  }

  const product = await prisma.product.create({
    data: { name, slug, description, benefits },
  });

  revalidatePublic(slug);
  redirect(`/admin/products/${product.id}`);
}

export async function updateProduct(
  id: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const name = asString(formData.get('name'));
  const slug = asString(formData.get('slug')).toLowerCase();
  const description = asString(formData.get('description'));
  const benefits = asString(formData.get('benefits'));

  if (!name || !slug || !description) {
    return { success: false, error: 'Nombre, slug y descripción son obligatorios.' };
  }
  if (!SLUG_REGEX.test(slug)) {
    return { success: false, error: 'Slug solo admite minúsculas, números y guiones (sin espacios).' };
  }

  const collision = await prisma.product.findFirst({
    where: { slug, NOT: { id } },
  });
  if (collision) {
    return { success: false, error: `El slug "${slug}" ya lo usa otro producto.` };
  }

  const previous = await prisma.product.findUnique({ where: { id } });
  await prisma.product.update({
    where: { id },
    data: { name, slug, description, benefits },
  });

  revalidatePublic(slug);
  if (previous && previous.slug !== slug) revalidatePublic(previous.slug);
  return { success: true };
}

export async function deleteProduct(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return;

  // Variantes y orderItems se borran en cascada según el schema.
  await prisma.product.delete({ where: { id } });

  revalidatePublic(product.slug);
  redirect('/admin');
}

// -----------------------------------------------------------------------------
// VARIANT CRUD
// -----------------------------------------------------------------------------

type VariantInput = {
  sku: string;
  size: string;
  target: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  features: string;
  popular: boolean;
  imagePath: string | null;
};

function readVariantFromForm(formData: FormData): VariantInput | { error: string } {
  const sku = asString(formData.get('sku')).toUpperCase();
  const size = asString(formData.get('size'));
  const target = asString(formData.get('target'));
  const priceRaw = asOptionalFloat(formData.get('price'));
  const comparePrice = asOptionalFloat(formData.get('comparePrice'));
  const stock = asInt(formData.get('stock'), 0);
  const features = asString(formData.get('features'));
  const popular = formData.get('popular') === 'on' || formData.get('popular') === 'true';
  const imagePath = asString(formData.get('imagePath')) || null;

  if (!sku || !size || !target || priceRaw === null) {
    return { error: 'SKU, formato, audiencia y precio son obligatorios.' };
  }
  if (!SKU_REGEX.test(sku)) {
    return { error: 'SKU debe ser mayúsculas, números y guiones (ej. BIO-1L).' };
  }
  if (priceRaw < 0) {
    return { error: 'El precio no puede ser negativo.' };
  }

  return {
    sku, size, target,
    price: priceRaw,
    comparePrice,
    stock,
    features,
    popular,
    imagePath,
  };
}

export async function createVariant(productId: string, formData: FormData): Promise<ActionResult> {
  const parsed = readVariantFromForm(formData);
  if ('error' in parsed) return { success: false, error: parsed.error };

  const collision = await prisma.variant.findUnique({ where: { sku: parsed.sku } });
  if (collision) return { success: false, error: `Ya existe una variante con SKU "${parsed.sku}".` };

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return { success: false, error: 'Producto no encontrado.' };

  await prisma.variant.create({
    data: { productId, ...parsed },
  });

  revalidatePublic(product.slug);
  return { success: true };
}

export async function updateVariant(id: string, formData: FormData): Promise<ActionResult> {
  const parsed = readVariantFromForm(formData);
  if ('error' in parsed) return { success: false, error: parsed.error };

  const existing = await prisma.variant.findUnique({
    where: { id },
    include: { product: true },
  });
  if (!existing) return { success: false, error: 'Variante no encontrada.' };

  if (parsed.sku !== existing.sku) {
    const collision = await prisma.variant.findUnique({ where: { sku: parsed.sku } });
    if (collision) return { success: false, error: `Ya existe otra variante con SKU "${parsed.sku}".` };
  }

  await prisma.variant.update({
    where: { id },
    data: parsed,
  });

  revalidatePublic(existing.product.slug);
  return { success: true };
}

export async function deleteVariant(id: string): Promise<ActionResult> {
  const existing = await prisma.variant.findUnique({
    where: { id },
    include: { product: true },
  });
  if (!existing) return { success: false, error: 'Variante no encontrada.' };

  await prisma.variant.delete({ where: { id } });

  revalidatePublic(existing.product.slug);
  return { success: true };
}
