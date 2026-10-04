import { NextResponse } from 'next/server';
import { getAdminPayload, getClientIp } from '@/lib/authConfig';
import { checkRateLimit } from '@/lib/redis';
import { getCmsContent } from '@/lib/cmsContent';

// Editorial defaults are readable, but edits require a durable CMS write contract.
export async function GET(request) {
    const ip = getClientIp(request);
    const rateLimit = await checkRateLimit(`ratelimit:cms_content_read:${ip}`, 60, 60);
    if (!rateLimit.allowed) {
        return NextResponse.json({ success: false, message: 'Too many requests.' }, { status: 429 });
    }

    const content = getCmsContent();

    return NextResponse.json({
        success: true,
        data: content
    }, {
        headers: {
            'Cache-Control': 'no-store'
        }
    });
}

// ── POST: Reject non-durable editor writes ──
export async function POST(request) {
    const ip = getClientIp(request);
    const rateLimit = await checkRateLimit(`ratelimit:admin_cms_write:${ip}`, 20, 60);
    if (!rateLimit.allowed) {
        return NextResponse.json({ success: false, message: 'Too many write requests. Please wait.' }, { status: 429 });
    }

    if (!getAdminPayload(request)) {
        return NextResponse.json({ success: false, message: 'Unauthorized. Admin session required.' }, { status: 401 });
    }

    return NextResponse.json({ success: false, message: 'CMS editing is unavailable until a durable, authorized PMS write API is configured.' }, { status: 501 });
}
