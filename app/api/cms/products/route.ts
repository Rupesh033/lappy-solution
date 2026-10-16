import { NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { hasAdminSession } from '@/lib/adminAuth';
import { invalidateInitCache } from '@/app/api/cms/init/route';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const requestedLimit = Number(searchParams.get('limit'));
    const limit = Number.isInteger(requestedLimit) && requestedLimit > 0 ? Math.min(requestedLimit, 100) : undefined;

    const where: Prisma.ProductWhereInput = { status: 'active' };
    if (id) {
      where.OR = [
        { id: id },
        { slug: id },
        { sku: id },
      ];
    } else if (slug) {
      where.slug = slug;
    } else {
      if (category && category !== 'All' && category !== 'All Products') {
        where.category = category;
      }
      if (search) {
        where.OR = [
          { name: { contains: search } },
          { brand: { contains: search } },
          { specs: { contains: search } },
          { sku: { contains: search } },
        ];
      }
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    // Enrich with gallery images, verified reviews & subcategory metadata
    const { PRODUCTS } = await import('@/data/products');
    const richMap = new Map(PRODUCTS.map(p => [p.sku, p]));
    const idMap = new Map(PRODUCTS.map(p => [p.id, p]));

    const enrichedProducts = products.map((p) => {
      const rich = richMap.get(p.sku) || idMap.get(p.id);
      return formatProductPayload(p, rich);
    });

    // If database returned products, DB is the authoritative catalog.
    // Only if DB returned 0 products (offline/unseeded), fallback to static PRODUCTS.
    let finalProducts = enrichedProducts;
    if (finalProducts.length === 0 && !id && !slug && !limit) {
      finalProducts = PRODUCTS.map(p => formatProductPayload(p));
    }

    return NextResponse.json({ products: finalProducts });
  } catch (error) {
    console.error('Error fetching products from DB, serving static fallback:', error);
    // Fallback to static PRODUCTS
    const { PRODUCTS } = await import('@/data/products');
    return NextResponse.json({ products: PRODUCTS.map(p => formatProductPayload(p)) });
  }
}

export function formatProductPayload(p: any, rich?: any) {
  let galleryImages: string[] = [];
  if (Array.isArray(p.images) && p.images.length > 0) {
    galleryImages = p.images
      .flatMap((s: any) => typeof s === 'string' && s.includes('|||') ? s.split('|||') : [s])
      .map((s: string) => String(s).trim())
      .filter(Boolean);
  } else if (typeof p.image === 'string' && p.image.includes('|||')) {
    galleryImages = p.image.split('|||').map((s: string) => s.trim()).filter(Boolean);
  } else if (typeof p.image === 'string' && p.image.startsWith('[')) {
    try {
      const parsed = JSON.parse(p.image);
      if (Array.isArray(parsed)) {
        galleryImages = parsed.map((s: string) => String(s).trim()).filter(Boolean);
      }
    } catch (e) {}
  } else if (rich?.images && rich.images.length > 0) {
    galleryImages = rich.images;
  } else if (p.image) {
    galleryImages = [p.image.trim()];
  }

  const primaryImage = galleryImages[0] || (typeof p.image === 'string' ? p.image.split('|||')[0].trim() : '') || '';

  return {
    ...p,
    image: primaryImage,
    images: galleryImages.length > 0 ? galleryImages : (primaryImage ? [primaryImage] : []),
    reviews: rich?.reviews || p.reviews || [],
    subcategory: rich?.subcategory || p.subcategory || p.category,
    isScraped: rich?.isScraped ?? p.isScraped ?? false,
    sourceUrl: rich?.sourceUrl || p.sourceUrl || '',
  };
}

export async function POST(request: Request) {
  if (!hasAdminSession(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    if (typeof body.name !== 'string' || typeof body.category !== 'string' || typeof body.brand !== 'string' || !Number.isFinite(Number(body.price)) || Number(body.price) < 0) {
      return NextResponse.json({ error: 'Name, category, brand, and a valid price are required.' }, { status: 400 });
    }
    const trimmedName = body.name.trim();
    const sku = body.sku || (`LS-${body.category.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`);

    // Duplicate Check: ensure no product with the same exact/case-insensitive name or SKU already exists
    const existing = await prisma.product.findFirst({
      where: {
        OR: [
          { name: { equals: trimmedName, mode: 'insensitive' } },
          { sku: sku }
        ]
      }
    });

    if (existing) {
      return NextResponse.json({
        error: `Duplicate Product Detected: A product with the name "${existing.name}" already exists in inventory (SKU: ${existing.sku}).`,
        isDuplicate: true,
        existingProduct: { id: existing.id, name: existing.name, sku: existing.sku, price: existing.price }
      }, { status: 409 });
    }

    const slug = body.slug || (trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now());

    const rawImages = Array.isArray(body.images) && body.images.length > 0
      ? body.images
      : (body.image ? [body.image] : []);
    const cleanGallery = rawImages
      .flatMap((img: any) => typeof img === 'string' && img.includes('|||') ? img.split('|||') : [img])
      .map((img: any) => String(img).trim())
      .filter(Boolean);
    const imageToStore = cleanGallery.length > 0 ? cleanGallery.join('|||') : (body.image || '');

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug,
        category: body.category,
        brand: body.brand,
        price: Number(body.price),
        mrp: Number(body.mrp) || Number(body.price),
        discount: Number(body.discount) || 0,
        specs: body.specs || '',
        description: body.description || body.specs || '',
        image: imageToStore,
        inStock: body.inStock === false || (body.stockQuantity !== undefined && Number(body.stockQuantity) <= 0) ? false : (body.inStock ?? true),
        stockQuantity: body.stockQuantity !== undefined && body.stockQuantity !== null && !isNaN(Number(body.stockQuantity)) ? Number(body.stockQuantity) : 10,
        sku,
        rating: Number(body.rating) || 4.5,
        featured: body.featured ?? false,
        status: 'active',
        gstRate: body.gstRate !== undefined ? Number(body.gstRate) : 18,
        hsnCode: body.hsnCode || '8471',
      },
    });

    invalidateInitCache();
    return NextResponse.json({ success: true, product: formatProductPayload(product) });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!hasAdminSession(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    const { id } = body;
    if (typeof id !== 'string') return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
    const allowedFields = ['name', 'slug', 'category', 'brand', 'price', 'mrp', 'discount', 'specs', 'description', 'image', 'inStock', 'stockQuantity', 'sku', 'rating', 'featured', 'status', 'gstRate', 'hsnCode'];
    const data: Record<string, any> = Object.fromEntries(
      Object.entries(body).filter(([key]) => allowedFields.includes(key))
    );
    if (Array.isArray(body.images) && body.images.length > 0) {
      const cleanGallery = body.images
        .flatMap((img: any) => typeof img === 'string' && img.includes('|||') ? img.split('|||') : [img])
        .map((img: any) => String(img).trim())
        .filter(Boolean);
      data.image = cleanGallery.join('|||');
    }
    if (Object.keys(data).length === 0) return NextResponse.json({ error: 'No valid product fields provided.' }, { status: 400 });

    if (data.price !== undefined) data.price = Number(data.price);
    if (data.mrp !== undefined) data.mrp = Number(data.mrp);
    
    // Explicit and consistent out-of-stock handling
    if (data.inStock !== undefined) {
      data.inStock = Boolean(data.inStock);
      if (data.inStock === false) {
        data.stockQuantity = 0;
      }
    }
    if (data.stockQuantity !== undefined) {
      data.stockQuantity = Number(data.stockQuantity);
      if (data.stockQuantity <= 0) {
        data.inStock = false;
        data.stockQuantity = 0;
      } else if (data.inStock === undefined) {
        data.inStock = true;
      }
    }
    if (data.inStock === true && (data.stockQuantity === undefined || data.stockQuantity <= 0)) {
      data.stockQuantity = 10;
    }

    if (data.discount !== undefined) data.discount = Number(data.discount);
    if (data.rating !== undefined) data.rating = Number(data.rating);
    if (data.gstRate !== undefined) data.gstRate = Number(data.gstRate);

    let product;
    try {
      product = await prisma.product.update({
        where: { id },
        data,
      });
    } catch {
      // Fallback: search by SKU, slug, or matching name (handles legacy ID mismatches)
      const found = await prisma.product.findFirst({
        where: {
          OR: [
            { id },
            { sku: id },
            { slug: id },
            ...(body.sku ? [{ sku: body.sku }] : []),
            ...(body.name && typeof body.name === 'string' ? [{ name: { equals: body.name.trim(), mode: 'insensitive' as const } }] : [])
          ]
        }
      });
      if (found) {
        product = await prisma.product.update({
          where: { id: found.id },
          data,
        });
      } else {
        return NextResponse.json({ error: 'Product not found in database.' }, { status: 404 });
      }
    }

    invalidateInitCache();
    return NextResponse.json({ success: true, product: formatProductPayload(product) });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!hasAdminSession(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const matchFilter: Prisma.ProductWhereInput = {
      OR: [
        { id },
        { sku: id },
        { slug: id }
      ]
    };

    try {
      await prisma.product.deleteMany({
        where: matchFilter
      });
    } catch (dbErr) {
      console.warn('Prisma hard delete failed, marking status deleted:', dbErr);
      await prisma.product.updateMany({
        where: matchFilter,
        data: { status: 'deleted' }
      }).catch(() => {});
    }

    invalidateInitCache();
    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
