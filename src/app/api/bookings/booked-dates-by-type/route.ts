import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const typeKey = searchParams.get('typeKey');

    if (!typeKey) {
      return NextResponse.json(
        { error: 'typeKey is required' },
        { status: 400 }
      );
    }

    // Get the room type
    const roomType = await prisma.roomType.findFirst({
      where: { typeKey },
      include: {
        rooms: true
      }
    });

    if (!roomType) {
      return NextResponse.json(
        { error: 'Room type not found' },
        { status: 404 }
      );
    }

    // Get all room IDs of this type
    const roomIds = roomType.rooms.map(room => room.id);

    if (roomIds.length === 0) {
      return NextResponse.json({
        bookedDates: []
      });
    }

    // Get all bookings for rooms of this type
    const allBookings = await prisma.booking.findMany({
      where: {
        roomId: {
          in: roomIds
        }
      }
    });

    // Get unique dates where all rooms of this type are booked
    const bookingsByDate = new Map<string, Set<number>>();

    allBookings.forEach(booking => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      
      // Normalize dates to start of day
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      
      // Iterate through each day in the booking range (excluding checkout day)
      const currentDate = new Date(start);
      while (currentDate < end) {
        const dateKey = currentDate.toISOString().split('T')[0];
        
        if (!bookingsByDate.has(dateKey)) {
          bookingsByDate.set(dateKey, new Set());
        }
        bookingsByDate.get(dateKey)!.add(booking.roomId);

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    // Find dates where all rooms of this type are booked
    const fullyBookedDates: Date[] = [];
    const totalRoomsOfType = roomIds.length;

    bookingsByDate.forEach((bookedRoomIds, dateKey) => {
      if (bookedRoomIds.size >= totalRoomsOfType) {
        const date = new Date(dateKey);
        date.setHours(0, 0, 0, 0);
        fullyBookedDates.push(date);
      }
    });

    return NextResponse.json({
      bookedDates: fullyBookedDates.map(d => d.toISOString())
    });
  } catch (error) {
    console.error('Error getting booked dates by type:', error);
    return NextResponse.json(
      { error: 'Failed to get booked dates' },
      { status: 500 }
    );
  }
}

