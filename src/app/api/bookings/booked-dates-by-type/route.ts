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
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/21eb7cda-305a-4391-a92f-7c2a923489c0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'booked-dates-by-type/route.ts:53',message:'Booking date range - BEFORE normalize',data:{bookingId:booking.id,startRaw:booking.startDate.toString(),endRaw:booking.endDate.toString(),startISO:start.toISOString(),endISO:end.toISOString()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      
      // Normalize dates to start of day (same approach as fully-booked-dates route)
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/21eb7cda-305a-4391-a92f-7c2a923489c0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'booked-dates-by-type/route.ts:60',message:'Booking date range - AFTER normalize',data:{startISO:start.toISOString(),endISO:end.toISOString(),startLocal:start.toString(),endLocal:end.toString()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      
      // Iterate through each day in the booking range (including checkout day to prevent new bookings on same day)
      // For a booking from Jan 4 to Jan 10, we want Jan 4-10 (6 nights + checkout day)
      const currentDate = new Date(start);
      let iterationCount = 0;
      while (currentDate <= end) {  // Changed from < to <= to include checkout day
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/21eb7cda-305a-4391-a92f-7c2a923489c0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'booked-dates-by-type/route.ts:67',message:'Loop iteration - BEFORE dateKey',data:{iterationCount,currentDateISO:currentDate.toISOString(),currentDateLocal:currentDate.toString(),endISO:end.toISOString(),endLocal:end.toString(),condition:currentDate <= end,currentDateTime:currentDate.getTime(),endTime:end.getTime()},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        
        // Use local date components to create dateKey (YYYY-MM-DD) to avoid timezone issues
        // This ensures dateKey matches the calendar day, not UTC day
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/21eb7cda-305a-4391-a92f-7c2a923489c0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'booked-dates-by-type/route.ts:77',message:'Loop iteration - AFTER dateKey',data:{iterationCount,dateKey,currentDateISO:currentDate.toISOString(),currentDateLocal:currentDate.toString(),currentDateYear:year,currentDateMonth:month,currentDateDay:day},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        
        if (!bookingsByDate.has(dateKey)) {
          bookingsByDate.set(dateKey, new Set());
        }
        bookingsByDate.get(dateKey)!.add(booking.roomId);

        // Move to next day - same approach as fully-booked-dates
        const beforeIncrement = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + 1);
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/21eb7cda-305a-4391-a92f-7c2a923489c0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'booked-dates-by-type/route.ts:94',message:'Loop iteration - AFTER increment',data:{iterationCount,beforeIncrementISO:beforeIncrement.toISOString(),afterIncrementISO:currentDate.toISOString(),endISO:end.toISOString(),conditionAfterIncrement:currentDate <= end},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        
        iterationCount++;
      }
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/21eb7cda-305a-4391-a92f-7c2a923489c0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'booked-dates-by-type/route.ts:99',message:'Loop exit - AFTER while',data:{iterationCount,currentDateISO:currentDate.toISOString(),endISO:end.toISOString(),condition:currentDate <= end},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
    });

    // #region agent log
    const allDateKeys = Array.from(bookingsByDate.keys()).sort();
    fetch('http://127.0.0.1:7242/ingest/21eb7cda-305a-4391-a92f-7c2a923489c0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'booked-dates-by-type/route.ts:99',message:'All dateKeys collected',data:{allDateKeys,totalRoomsOfType:roomIds.length},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    
    // Find dates where all rooms of this type are booked
    const fullyBookedDates: Date[] = [];
    const totalRoomsOfType = roomIds.length;

    bookingsByDate.forEach((bookedRoomIds, dateKey) => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/21eb7cda-305a-4391-a92f-7c2a923489c0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'booked-dates-by-type/route.ts:107',message:'Checking if dateKey is fully booked',data:{dateKey,bookedCount:bookedRoomIds.size,totalRooms:totalRoomsOfType,isFullyBooked:bookedRoomIds.size >= totalRoomsOfType},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'F'})}).catch(()=>{});
      // #endregion
      
      if (bookedRoomIds.size >= totalRoomsOfType) {
        // Parse dateKey (YYYY-MM-DD) using local time components to match how we created it
        const [year, month, day] = dateKey.split('-').map(Number);
        const date = new Date(year, month - 1, day, 0, 0, 0, 0); // month is 0-indexed, use local time
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/21eb7cda-305a-4391-a92f-7c2a923489c0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'booked-dates-by-type/route.ts:114',message:'Adding fully booked date',data:{dateKey,dateISO:date.toISOString(),dateLocal:date.toString(),dateYear:date.getFullYear(),dateMonth:date.getMonth(),dateDay:date.getDate()},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        
        fullyBookedDates.push(date);
      }
    });
    
    // #region agent log
    const finalDateKeys = fullyBookedDates.map(d => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }).sort();
    fetch('http://127.0.0.1:7242/ingest/21eb7cda-305a-4391-a92f-7c2a923489c0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'booked-dates-by-type/route.ts:125',message:'Final fully booked dates',data:{finalDateKeys,count:finalDateKeys.length},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'F'})}).catch(()=>{});
    // #endregion

    // Return dateKeys as strings instead of ISO strings to avoid timezone issues
    // This ensures the client receives the exact calendar dates that are booked
    const dateKeyStrings = fullyBookedDates.map(d => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    });
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/21eb7cda-305a-4391-a92f-7c2a923489c0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'booked-dates-by-type/route.ts:144',message:'Returning booked dates as dateKeys',data:{dateKeyStrings,count:dateKeyStrings.length},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    
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

