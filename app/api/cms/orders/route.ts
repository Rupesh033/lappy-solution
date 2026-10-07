import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const order = await prisma.order.create({
      data: {
        orderId: body.orderId,
        customerName: body.customerName,
        phone: body.phone,
        email: body.email,
        address: body.address,
        itemsJson: typeof body.items === 'string' ? body.items : JSON.stringify(body.items),
        totalAmount: Number(body.totalAmount),
        paymentMethod: body.paymentMethod,
        paymentStatus: body.paymentStatus || 'Pending',
        utrNumber: body.utrNumber,
        orderStatus: body.orderStatus || 'Confirmed',
        date: body.date || new Date().toISOString().split('T')[0],
      },
    });
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { orderId, paymentStatus, orderStatus } = body;

    const updated = await prisma.order.update({
      where: { orderId },
      data: {
        ...(paymentStatus && { paymentStatus }),
        ...(orderStatus && { orderStatus }),
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
