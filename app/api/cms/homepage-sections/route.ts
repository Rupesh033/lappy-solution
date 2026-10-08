import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hasAdminSession } from '@/lib/adminAuth';

export async function GET() {
  try {
    const sections = await prisma.homepageSection.findMany({
      orderBy: { position: 'asc' },
    });
    return NextResponse.json({ sections });
  } catch (error) {
    console.error('Error fetching homepage sections:', error);
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!hasAdminSession(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();

    // 1. Single section update (e.g. changing title, subtitle, badge, productIds)
    if (body.section || body.sectionKey || body.id) {
      const s = body.section || body;
      const productIds = Array.isArray(s.productIds) ? JSON.stringify(s.productIds) : s.productIds;
      
      const updateData: any = {};
      if (s.title !== undefined) updateData.title = s.title;
      if (s.subtitle !== undefined) updateData.subtitle = s.subtitle;
      if (s.badge !== undefined) updateData.badge = s.badge;
      if (productIds !== undefined) updateData.productIds = productIds;
      if (s.position !== undefined) updateData.position = s.position;
      if (s.isVisible !== undefined) updateData.isVisible = s.isVisible;

      const whereClause = s.id ? { id: s.id } : { sectionKey: s.sectionKey };
      await prisma.homepageSection.update({
        where: whereClause,
        data: updateData,
      });

      const updated = await prisma.homepageSection.findMany({
        orderBy: { position: 'asc' },
      });
      return NextResponse.json({ success: true, sections: updated });
    }

    // 2. Bulk sections update (e.g. reordering, visibility changes)
    const { sections } = body;
    if (Array.isArray(sections)) {
      for (const s of sections) {
        const productIds = Array.isArray(s.productIds) ? JSON.stringify(s.productIds) : s.productIds;
        await prisma.homepageSection.update({
          where: { id: s.id },
          data: {
            title: s.title !== undefined ? s.title : undefined,
            subtitle: s.subtitle !== undefined ? s.subtitle : undefined,
            badge: s.badge !== undefined ? s.badge : undefined,
            productIds: productIds !== undefined ? productIds : undefined,
            position: s.position,
            isVisible: s.isVisible,
          },
        });
      }
    }

    const updated = await prisma.homepageSection.findMany({
      orderBy: { position: 'asc' },
    });

    return NextResponse.json({ success: true, sections: updated });
  } catch (error) {
    console.error('Error updating homepage sections:', error);
    return NextResponse.json({ error: 'Failed to update sections' }, { status: 500 });
  }
}
