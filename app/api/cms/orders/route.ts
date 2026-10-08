import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hasAdminSession } from '@/lib/adminAuth';

const toClientOrder = (order: { itemsJson: string } & Record<string, unknown>) => {
  let items: unknown[] = [];
  try {
    const parsed = JSON.parse(order.itemsJson);
    items = Array.isArray(parsed) ? parsed : [];
  } catch {}
  const rest = Object.fromEntries(Object.entries(order).filter(([key]) => key !== 'itemsJson'));
  return { ...rest, items };
};

export async function GET(request: Request) {
  if (!hasAdminSession(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ orders: orders.map(toClientOrder) });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const customerName = typeof body.customerName === 'string' ? body.customerName.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const address = typeof body.address === 'string' ? body.address.trim() : '';
    const requestedItems = Array.isArray(body.items) ? body.items : [];
    if (!customerName || !phone || !address || requestedItems.length === 0 || requestedItems.length > 25) {
      return NextResponse.json({ error: 'Customer, address, and at least one valid item are required.' }, { status: 400 });
    }

    const quantities = new Map<string, number>();
    for (const item of requestedItems) {
      const id = typeof item?.productId === 'string' ? item.productId : item?.id;
      const quantity = Number(item?.quantity);
      if (typeof id !== 'string' || !Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
        return NextResponse.json({ error: 'Invalid order item.' }, { status: 400 });
      }
      quantities.set(id, (quantities.get(id) ?? 0) + quantity);
    }

    const products = await prisma.product.findMany({ where: { id: { in: [...quantities.keys()] }, status: 'active', inStock: true } });
    if (products.length !== quantities.size) return NextResponse.json({ error: 'One or more products are unavailable.' }, { status: 409 });
    for (const product of products) {
      if (product.stockQuantity < (quantities.get(product.id) ?? 0)) {
        return NextResponse.json({ error: `${product.name} does not have enough stock.` }, { status: 409 });
      }
    }

    const items = products.map((product) => ({
      id: product.id, productId: product.id, name: product.name, price: product.price,
      quantity: quantities.get(product.id) ?? 0, image: product.image, category: product.category, sku: product.sku,
    }));
    const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const isUpi = body.paymentMethod === 'upi_qr';
    const isCod = body.paymentMethod === 'cod';
    if (!isUpi && !isCod) return NextResponse.json({ error: 'Unsupported payment method.' }, { status: 400 });
    const utrNumber = typeof body.utrNumber === 'string' ? body.utrNumber.trim() : null;
    if (isUpi && (!utrNumber || !/^[A-Za-z0-9-]{8,40}$/.test(utrNumber))) {
      return NextResponse.json({ error: 'Enter a valid UPI transaction reference.' }, { status: 400 });
    }

    const orderId = typeof body.orderId === 'string' && /^LS-[A-Za-z0-9-]{6,40}$/.test(body.orderId)
      ? body.orderId : `LS-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const order = await prisma.$transaction(async (transaction) => {
      for (const product of products) {
        const quantity = quantities.get(product.id) ?? 0;
        const updated = await transaction.product.updateMany({
          where: { id: product.id, stockQuantity: { gte: quantity }, inStock: true },
          data: { stockQuantity: { decrement: quantity } },
        });
        if (updated.count !== 1) throw new Error('Stock changed while placing this order.');
      }
      return transaction.order.create({
        data: {
          orderId, customerName, phone,
          email: typeof body.email === 'string' && body.email.includes('@') ? body.email.trim() : null,
          address, itemsJson: JSON.stringify(items), totalAmount,
          paymentMethod: isUpi ? 'UPI' : 'Cash on Delivery / Pickup',
          paymentStatus: isUpi ? 'Verification Pending' : 'Pending Payment',
          utrNumber, orderStatus: 'Confirmed', date: new Date().toISOString().slice(0, 10),
        },
      });
    });
    return NextResponse.json({ success: true, order: toClientOrder(order) }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Unable to place this order. Please try again.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!hasAdminSession(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    const { orderId, paymentStatus, orderStatus } = body;
    const paymentStatuses = new Set(['Pending Payment', 'Verification Pending', 'Paid', 'Rejected']);
    const orderStatuses = new Set(['Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled']);
    if (typeof orderId !== 'string' || (!paymentStatuses.has(paymentStatus) && !orderStatuses.has(orderStatus))) {
      return NextResponse.json({ error: 'Invalid order update.' }, { status: 400 });
    }
    const updated = await prisma.order.update({
      where: { orderId },
      data: {
        ...(paymentStatuses.has(paymentStatus) ? { paymentStatus } : {}),
        ...(orderStatuses.has(orderStatus) ? { orderStatus } : {}),
      },
    });
    return NextResponse.json({ success: true, order: toClientOrder(updated) });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
