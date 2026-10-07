import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
  try {
    const body = await request.json();
    const { sections } = body; // Array of { id, position, isVisible }

    for (const s of sections) {
      await prisma.homepageSection.update({
        where: { id: s.id },
        data: {
          position: s.position,
          isVisible: s.isVisible,
        },
      });
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
