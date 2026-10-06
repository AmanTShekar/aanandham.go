import { NextResponse } from 'next/server';
import { getCampById } from '@/lib/campsData';
import { computeLiveAvailability, computeLiveMonthCalendar, fetchLivePropertyRooms, fetchLivePropertyDetails } from '@/lib/pmsLiveAvailability';

export const dynamic = 'force-dynamic';

export async function GET(request, context) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('date') || searchParams.get('batch') || '';
    const month = searchParams.get('month') || '';

    const camp = getCampById(id);
    const propertyId = camp?.id || id;

    // 1. If requesting live monthly calendar availability
    if (month) {
      const calData = await computeLiveMonthCalendar({
        propertyId,
        rooms: camp?.rooms || [],
        yearMonth: month
      });
      return NextResponse.json({
        success: true,
        propertyId,
        calendar: calData.dates,
        totalCapacity: calData.totalCapacity
      });
    }

    // 2. Regular batch/date interval availability
    const liveData = await computeLiveAvailability({
      propertyId,
      rooms: camp?.rooms || [],
      dateStr
    });

    const liveDetails = await fetchLivePropertyDetails(propertyId);

    return NextResponse.json({
      success: true,
      propertyId,
      interval: liveData.interval,
      rooms: liveData.rooms,
      property: liveDetails ? {
        checkInTime: liveDetails.checkInTime,
        checkOutTime: liveDetails.checkOutTime,
        cancellationPolicy: liveDetails.cancellationPolicy,
        inclusions: liveDetails.inclusions,
        exclusions: liveDetails.exclusions,
        amenities: liveDetails.amenities
      } : null
    });
  } catch (err) {
    console.error('[API Camp Availability Error]', err);
    return NextResponse.json({ success: false, message: 'Failed to resolve live availability' }, { status: 500 });
  }
}
