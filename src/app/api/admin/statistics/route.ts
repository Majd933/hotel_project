import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get all bookings
    const bookings = await prisma.booking.findMany({
      include: {
        room: {
          include: {
            roomType: true
          }
        }
      }
    });

    // Get all rooms
    const totalRooms = await prisma.room.count();
    
    // Calculate statistics
    const totalBookings = bookings.length;
    
    // Calculate total revenue by currency
    const revenueByCurrency = bookings.reduce((acc, booking) => {
      const currency = booking.currency;
      if (!acc[currency]) {
        acc[currency] = 0;
      }
      acc[currency] += booking.totalPrice;
      return acc;
    }, {} as Record<string, number>);

    // Calculate upcoming bookings (future bookings)
    const now = new Date();
    const upcomingBookings = bookings.filter(booking => new Date(booking.startDate) >= now).length;
    
    // Calculate occupancy rate (simplified: bookings / total rooms for a period)
    // For a more accurate calculation, we would need to calculate based on specific dates
    const occupancyRate = totalRooms > 0 ? (totalBookings / totalRooms) * 100 : 0;

    // Get bookings by room type
    const bookingsByRoomType = bookings.reduce((acc, booking) => {
      const roomTypeName = booking.room.roomType.typeKey;
      if (!acc[roomTypeName]) {
        acc[roomTypeName] = 0;
      }
      acc[roomTypeName]++;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      totalBookings,
      totalRooms,
      upcomingBookings,
      occupancyRate: Math.round(occupancyRate * 100) / 100, // Round to 2 decimal places
      revenueByCurrency,
      bookingsByRoomType
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
