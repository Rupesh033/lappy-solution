import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const siteSettings = await prisma.siteSettings.findUnique({
      where: { id: 'default' },
    });
    const paymentSettings = await prisma.paymentSettings.findUnique({
      where: { id: 'default' },
    });

    return NextResponse.json({
      siteSettings,
      paymentSettings,
    });
  } catch (error) {
    console.error('Error fetching CMS settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { siteSettings, paymentSettings } = body;

    let updatedSite;
    let updatedPayment;

    if (siteSettings) {
      updatedSite = await prisma.siteSettings.upsert({
        where: { id: 'default' },
        update: siteSettings,
        create: { id: 'default', ...siteSettings },
      });
    }

    if (paymentSettings) {
      updatedPayment = await prisma.paymentSettings.upsert({
        where: { id: 'default' },
        update: paymentSettings,
        create: { id: 'default', ...paymentSettings },
      });
    }

    return NextResponse.json({
      success: true,
      siteSettings: updatedSite,
      paymentSettings: updatedPayment,
    });
  } catch (error) {
    console.error('Error updating CMS settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
