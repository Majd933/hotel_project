import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'startDate and endDate are required' },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    // Get all rooms with their room types
    const allRooms = await prisma.room.findMany({
      include: {
        roomType: true
      },
      orderBy: { id: 'asc' }
    });

    // Get all bookings that overlap with the date range
    // Note: checkout day (endDate) is available for new bookings, so we use > instead of >=
    const overlappingBookings = await prisma.booking.findMany({
      where: {
        OR: [
          // Booking starts before range ends and ends after range starts
          {
            AND: [
              { startDate: { lt: end } },
              { endDate: { gt: start } }
            ]
          }
        ]
      },
      select: {
        roomId: true
      }
    });

    // Get set of booked room IDs
    const bookedRoomIds = new Set(overlappingBookings.map(b => b.roomId));

    // Calculate availability count per room type
    const availabilityMap = new Map<string, { total: number; available: number }>();

    allRooms.forEach(room => {
      const typeKey = room.roomType.typeKey;
      const current = availabilityMap.get(typeKey) || { total: 0, available: 0 };
      current.total++;
      if (!bookedRoomIds.has(room.id)) {
        current.available++;
      }
      availabilityMap.set(typeKey, current);
    });

    // Get available rooms for each type
    const availableRooms = allRooms.filter(room => !bookedRoomIds.has(room.id));

    // Group available rooms by type
    const roomsByType = new Map<string, typeof availableRooms>();
    availableRooms.forEach(room => {
      const typeKey = room.roomType.typeKey;
      if (!roomsByType.has(typeKey)) {
        roomsByType.set(typeKey, []);
      }
      roomsByType.get(typeKey)!.push(room);
    });

    // Build response
    const availability: Record<string, { total: number; available: number; rooms: typeof availableRooms }> = {};
    availabilityMap.forEach((counts, typeKey) => {
      availability[typeKey] = {
        total: counts.total,
        available: counts.available,
        rooms: roomsByType.get(typeKey) || []
      };
    });

    return NextResponse.json({
      availability,
      allAvailableRooms: availableRooms,
      bookedRoomIds: Array.from(bookedRoomIds)
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}

