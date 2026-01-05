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

    // Helper function to parse dates using local time components (same as booking creation)
    const parseLocalDate = (dateValue: Date | string): Date => {
      if (dateValue instanceof Date) {
        // Use local time components directly to avoid timezone conversion issues
        return new Date(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate(), 0, 0, 0, 0);
      } else {
        // Handle both ISO format (YYYY-MM-DDTHH:mm:ss.sssZ) and SQL format (YYYY-MM-DD HH:mm:ss)
        const parts = dateValue.split('T');
        const datePart = parts.length > 1 ? parts[0] : dateValue.split(' ')[0];
        const [year, month, day] = datePart.split('-').map(Number);
        return new Date(year, month - 1, day, 0, 0, 0, 0);
      }
    };

    allBookings.forEach(booking => {
      // Parse dates using local time components to match how they were saved
      const start = parseLocalDate(booking.startDate);
      const end = parseLocalDate(booking.endDate);
      
      // Iterate through each day in the booking range (excluding checkout day, as room is available on checkout day)
      const currentDate = new Date(start);
      while (currentDate < end) {
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

