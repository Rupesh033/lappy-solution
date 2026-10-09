import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hasAdminSession } from '@/lib/adminAuth';

export async function GET() {
  try {
    const siteSettings = await prisma.siteSettings.findUnique({
      where: { id: 'default' },
    });
    const paymentSettings = await prisma.paymentSettings.findUnique({
      where: { id: 'default' },
    });

    const cleanSiteSettings = siteSettings ? {
      ...siteSettings,
      siteName: siteSettings.siteName || 'Lapiez',
    } : null;

    const cleanPaymentSettings = paymentSettings ? {
      ...paymentSettings,
      upiId: paymentSettings.upiId || 'lappy.solution@ybl',
      upiName: paymentSettings.upiName || 'LAPIEZ GARHWA',
    } : null;

    return NextResponse.json({
      siteSettings: cleanSiteSettings,
      paymentSettings: cleanPaymentSettings,
    });
  } catch (error) {
    console.error('Error fetching CMS settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!hasAdminSession(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    const { siteSettings, paymentSettings } = body;

    let updatedSite;
    let updatedPayment;

    if (siteSettings && typeof siteSettings === 'object') {
      const siteFields = ['siteName', 'tagline', 'logo', 'favicon', 'phone', 'whatsapp', 'email', 'address', 'timings', 'announcementText', 'maintenanceMode'];
      const safeSiteSettings = Object.fromEntries(
        Object.entries(siteSettings).filter(([key, val]) => siteFields.includes(key) && val !== undefined)
      );
      if (Object.keys(safeSiteSettings).length > 0) {
        updatedSite = await prisma.siteSettings.upsert({
          where: { id: 'default' },
          update: safeSiteSettings,
          create: { id: 'default', ...safeSiteSettings },
        });
      }
    }

    if (paymentSettings && typeof paymentSettings === 'object') {
      const paymentFields = ['upiId', 'upiName', 'codEnabled', 'gstRate', 'gstin'];
      const safePaymentSettings = Object.fromEntries(
        Object.entries(paymentSettings).filter(([key, val]) => paymentFields.includes(key) && val !== undefined)
      );
      if (Object.keys(safePaymentSettings).length > 0) {
        updatedPayment = await prisma.paymentSettings.upsert({
          where: { id: 'default' },
          update: safePaymentSettings,
          create: { id: 'default', ...safePaymentSettings },
        });
      }
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
