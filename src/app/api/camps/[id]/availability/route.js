import { NextResponse } from 'next/server';
import { getCampById } from '@/lib/campsData';
import { computeLiveAvailability } from '@/lib/pmsLiveAvailability';

export const dynamic = 'force-dynamic';

export async function GET(request, context) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('date') || searchParams.get('batch') || '';

    const camp = getCampById(id);
    if (!camp) {
      return NextResponse.json({ success: false, message: 'Camp not found' }, { status: 404 });
    }

    const liveData = await computeLiveAvailability({
      propertyId: camp.id,
      rooms: camp.rooms || [],
      dateStr
    });

    return NextResponse.json({
      success: true,
      propertyId: camp.id,
      interval: liveData.interval,
      rooms: liveData.rooms
    });
  } catch (err) {
    console.error('[API Camp Availability Error]', err);
    return NextResponse.json({ success: false, message: 'Failed to resolve live availability' }, { status: 500 });
  }
}
