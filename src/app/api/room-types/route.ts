import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const roomTypes = await prisma.roomType.findMany({
      orderBy: { id: 'asc' }
    });
    return NextResponse.json(roomTypes);
  } catch (error) {
    console.error('Error fetching room types:', error);
    return NextResponse.json([], { status: 500 });
  }
}

