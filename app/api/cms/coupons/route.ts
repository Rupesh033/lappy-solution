import { NextResponse } from 'next/server';
import { hasAdminSession } from '@/lib/adminAuth';
import { INITIAL_COUPONS, Coupon } from '@/data/coupons';
import fs from 'fs';
import path from 'path';

const COUPONS_FILE = path.join(process.cwd(), 'data', 'couponsStore.json');

function getCoupons(): Coupon[] {
  try {
    if (fs.existsSync(COUPONS_FILE)) {
      const data = fs.readFileSync(COUPONS_FILE, 'utf8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading couponsStore.json:', err);
  }
  // Initialize with defaults if file doesn't exist
  saveCoupons(INITIAL_COUPONS);
  return INITIAL_COUPONS;
}

function saveCoupons(coupons: Coupon[]) {
  try {
    fs.writeFileSync(COUPONS_FILE, JSON.stringify(coupons, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing couponsStore.json:', err);
  }
}

// GET /api/cms/coupons - Return all coupons
export async function GET() {
  try {
    const coupons = getCoupons();
    return NextResponse.json({ coupons });
  } catch (error) {
    console.error('Failed to get coupons:', error);
    return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
  }
}

// POST /api/cms/coupons - Create new coupon
export async function POST(request: Request) {
  if (!hasAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { code, title, discountType, discountValue, minOrder, maxDiscount, audience, description, validUntil } = body;

    if (!code || !discountValue) {
      return NextResponse.json({ error: 'Coupon code and discount value are required' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();
    const coupons = getCoupons();

    if (coupons.some((c) => c.code === cleanCode)) {
      return NextResponse.json({ error: 'A coupon with this code already exists' }, { status: 409 });
    }

    const newCoupon: Coupon = {
      id: `coupon-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      code: cleanCode,
      title: title || cleanCode,
      discountType: discountType === 'fixed' ? 'fixed' : 'percentage',
      discountValue: Number(discountValue) || 0,
      minOrder: Number(minOrder) || 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      audience: audience === 'premium' ? 'premium' : audience === 'normal' ? 'normal' : 'all',
      description: description || '',
      isActive: true,
      validUntil: validUntil || undefined,
      timesUsed: 0,
      createdAt: new Date().toISOString(),
    };

    coupons.unshift(newCoupon);
    saveCoupons(coupons);

    return NextResponse.json({ success: true, coupon: newCoupon });
  } catch (error) {
    console.error('Failed to create coupon:', error);
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
  }
}

// PUT /api/cms/coupons - Update existing coupon
export async function PUT(request: Request) {
  if (!hasAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, code, title, discountType, discountValue, minOrder, maxDiscount, audience, description, isActive, validUntil } = body;

    if (!id) {
      return NextResponse.json({ error: 'Coupon ID is required' }, { status: 400 });
    }

    const coupons = getCoupons();
    const index = coupons.findIndex((c) => c.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    const updated = {
      ...coupons[index],
      code: code ? code.trim().toUpperCase() : coupons[index].code,
      title: title !== undefined ? title : coupons[index].title,
      discountType: discountType !== undefined ? discountType : coupons[index].discountType,
      discountValue: discountValue !== undefined ? Number(discountValue) : coupons[index].discountValue,
      minOrder: minOrder !== undefined ? Number(minOrder) : coupons[index].minOrder,
      maxDiscount: maxDiscount !== undefined ? (maxDiscount ? Number(maxDiscount) : undefined) : coupons[index].maxDiscount,
      audience: audience !== undefined ? audience : coupons[index].audience,
      description: description !== undefined ? description : coupons[index].description,
      isActive: isActive !== undefined ? Boolean(isActive) : coupons[index].isActive,
      validUntil: validUntil !== undefined ? validUntil : coupons[index].validUntil,
    };

    coupons[index] = updated;
    saveCoupons(coupons);

    return NextResponse.json({ success: true, coupon: updated });
  } catch (error) {
    console.error('Failed to update coupon:', error);
    return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 });
  }
}

// DELETE /api/cms/coupons - Remove coupon
export async function DELETE(request: Request) {
  if (!hasAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Coupon ID is required' }, { status: 400 });
    }

    let coupons = getCoupons();
    const initialLen = coupons.length;
    coupons = coupons.filter((c) => c.id !== id);

    if (coupons.length === initialLen) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    saveCoupons(coupons);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete coupon:', error);
    return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 });
  }
}
