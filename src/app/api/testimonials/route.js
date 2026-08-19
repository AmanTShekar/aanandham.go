import { NextResponse } from 'next/server';
import { getTestimonials, getActiveTestimonials } from '@/lib/testimonials';
import { getClientIp } from '@/lib/authConfig';
import { checkRateLimit } from '@/lib/redis';

// GET: public active testimonials (for the home page)
export async function GET(request) {
    const ip = getClientIp(request);
    const rateLimit = await checkRateLimit(`ratelimit:testimonials_public:${ip}`, 120, 60);
    if (!rateLimit.allowed) {
        return NextResponse.json({ success: false, message: 'Too many requests' }, { status: 429 });
    }

    return NextResponse.json({ success: true, testimonials: getActiveTestimonials(getTestimonials()) });
}