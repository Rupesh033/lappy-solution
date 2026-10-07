import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const themeSettings = await prisma.themeSettings.findUnique({
      where: { id: 'default' },
    });
    return NextResponse.json({ themeSettings });
  } catch (error) {
    console.error('Error fetching theme settings:', error);
    return NextResponse.json({ error: 'Failed to fetch theme' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const updated = await prisma.themeSettings.upsert({
      where: { id: 'default' },
      update: body,
      create: { id: 'default', ...body },
    });
    return NextResponse.json({ success: true, themeSettings: updated });
  } catch (error) {
    console.error('Error updating theme settings:', error);
    return NextResponse.json({ error: 'Failed to update theme' }, { status: 500 });
  }
}
