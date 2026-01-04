import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get all bookings with room and room type
    const allBookings = await prisma.booking.findMany({
      include: {
        room: {
          include: {
            roomType: true
          }
        }
      }
    });

    // Get all room types with count of rooms per type
    const allRooms = await prisma.room.findMany({
      include: {
        roomType: true
      }
    });
    const totalRoomsPerType = new Map<string, number>();
    allRooms.forEach(room => {
      const typeKey = room.roomType.typeKey;
      totalRoomsPerType.set(typeKey, (totalRoomsPerType.get(typeKey) || 0) + 1);
    });

    // Group bookings by date and room type
    const bookingsByDateAndType = new Map<string, Map<string, number>>();

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
        const roomType = booking.room.roomType.typeKey;

        if (!bookingsByDateAndType.has(dateKey)) {
          bookingsByDateAndType.set(dateKey, new Map());
        }

        const typeMap = bookingsByDateAndType.get(dateKey)!;
        typeMap.set(roomType, (typeMap.get(roomType) || 0) + 1);

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    // Find dates where all room types are fully booked
    const fullyBookedDates: Date[] = [];
    bookingsByDateAndType.forEach((typeMap, dateKey) => {
      // Check if all room types are fully booked
      let allTypesBooked = true;
      if (totalRoomsPerType.size === 0) {
        allTypesBooked = false;
      } else {
        totalRoomsPerType.forEach((totalCount, typeKey) => {
          const bookedCount = typeMap.get(typeKey) || 0;
          if (bookedCount < totalCount) {
            allTypesBooked = false;
          }
        });
      }
      
      if (allTypesBooked) {
        const date = new Date(dateKey);
        date.setHours(0, 0, 0, 0);
        fullyBookedDates.push(date);
      }
    });

    return NextResponse.json({
      fullyBookedDates: fullyBookedDates.map(d => d.toISOString())
    });
  } catch (error) {
    console.error('Error getting fully booked dates:', error);
    return NextResponse.json(
      { error: 'Failed to get fully booked dates' },
      { status: 500 }
    );
  }
}

