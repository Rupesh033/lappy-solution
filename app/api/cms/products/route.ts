import { NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { hasAdminSession } from '@/lib/adminAuth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const requestedLimit = Number(searchParams.get('limit'));
    const limit = Number.isInteger(requestedLimit) && requestedLimit > 0 ? Math.min(requestedLimit, 100) : undefined;

    const where: Prisma.ProductWhereInput = { status: 'active' };
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
      return {
        ...p,
        images: rich?.images && rich.images.length > 0 ? rich.images : [p.image],
        reviews: rich?.reviews || [],
        subcategory: rich?.subcategory || p.category,
        isScraped: rich?.isScraped || false,
        sourceUrl: rich?.sourceUrl || '',
      };
    });

    return NextResponse.json({ products: enrichedProducts });
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fallback to static PRODUCTS
    const { PRODUCTS } = await import('@/data/products');
    return NextResponse.json({ products: PRODUCTS });
  }
}

export async function POST(request: Request) {
  if (!hasAdminSession(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    if (typeof body.name !== 'string' || typeof body.category !== 'string' || typeof body.brand !== 'string' || !Number.isFinite(Number(body.price)) || Number(body.price) < 0) {
      return NextResponse.json({ error: 'Name, category, brand, and a valid price are required.' }, { status: 400 });
    }
    const slug = body.slug || (body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now());
    const sku = body.sku || (`LS-${body.category.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`);

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
        image: body.image,
        inStock: body.inStock ?? true,
        stockQuantity: Number(body.stockQuantity) || 10,
        sku,
        rating: Number(body.rating) || 4.5,
        featured: body.featured ?? false,
        status: 'active',
      },
    });

    return NextResponse.json({ success: true, product });
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
    const allowedFields = ['name', 'slug', 'category', 'brand', 'price', 'mrp', 'discount', 'specs', 'description', 'image', 'inStock', 'stockQuantity', 'sku', 'rating', 'featured', 'status'];
    const data = Object.fromEntries(Object.entries(body).filter(([key]) => allowedFields.includes(key)));
    if (Object.keys(data).length === 0) return NextResponse.json({ error: 'No valid product fields provided.' }, { status: 400 });

    const product = await prisma.product.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, product });
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

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
