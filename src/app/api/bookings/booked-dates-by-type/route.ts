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
      
      // Iterate through each day in the booking range (including checkout day to prevent new bookings on same day)
      const currentDate = new Date(start);
      while (currentDate <= end) {
        // Use local date components to create dateKey (YYYY-MM-DD) to avoid timezone issues
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
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
        // Parse dateKey (YYYY-MM-DD) using local time components to match how we created it
        const [year, month, day] = dateKey.split('-').map(Number);
        const date = new Date(year, month - 1, day, 0, 0, 0, 0); // month is 0-indexed, use local time
        fullyBookedDates.push(date);
      }
    });

    // Return dateKeys as strings (YYYY-MM-DD) instead of ISO strings to avoid timezone issues
    const dateKeyStrings = fullyBookedDates.map(d => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    });

    return NextResponse.json({
      bookedDates: dateKeyStrings
    });
  } catch (error) {
    console.error('Error getting booked dates by type:', error);
    return NextResponse.json(
      { error: 'Failed to get booked dates' },
      { status: 500 }
    );
  }
}

