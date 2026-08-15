import { NextResponse } from 'next/server';
import { getAdminPayload, getClientIp } from '@/lib/authConfig';
import { checkRateLimit } from '@/lib/redis';
import { getAllCamps } from '@/lib/campsData';
import { prisma, isPrismaConfigured } from '@/lib/prisma';

// In-memory override cache for admin-saved camps fallback
let campsOverride = null;

// ── GET: Public read of the camps catalog (Prisma DB if connected, fallback to cache/static) ──
export async function GET() {
    if (isPrismaConfigured && prisma) {
        try {
            const record = await prisma.campOverride.findUnique({
                where: { id: 'camps_catalog_v1' }
            });
            if (record && Array.isArray(record.data) && record.data.length > 0) {
                return NextResponse.json(record.data);
            }
        } catch (err) {
            console.error('Error reading camps from Prisma:', err);
        }
    }
    const camps = campsOverride || getAllCamps();
    return NextResponse.json(camps);
}

// ── POST: Bulk-sync camps catalog (admin only, validated, persists to DB) ──
export async function POST(request) {
    const ip = getClientIp(request);

    const rateLimit = await checkRateLimit(`ratelimit:admin_camps_write:${ip}`, 10, 60);
    if (!rateLimit.allowed) {
        return NextResponse.json({ success: false, message: 'Too many requests. Please wait.' }, { status: 429 });
    }

    if (!getAdminPayload(request)) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();

        if (!Array.isArray(body)) {
            return NextResponse.json({ success: false, message: 'Expected an array of camps.' }, { status: 400 });
        }
        if (body.length > 100) {
            return NextResponse.json({ success: false, message: 'Camps catalog too large.' }, { status: 400 });
        }

        // Validate every record — reject anything malformed (no partial trust)
        const valid = [];
        for (const camp of body) {
            if (!camp || typeof camp !== 'object') continue;
            const id = String(camp.id || '').trim();
            const title = String(camp.title || '').trim();
            if (!id || id.length > 80 || !title || title.length > 200) {
                return NextResponse.json({ success: false, message: 'Invalid camp record in payload.' }, { status: 400 });
            }
            valid.push(camp);
        }

        campsOverride = valid;

        if (isPrismaConfigured && prisma) {
            try {
                await prisma.campOverride.upsert({
                    where: { id: 'camps_catalog_v1' },
                    create: { id: 'camps_catalog_v1', data: valid },
                    update: { data: valid }
                });
            } catch (dbErr) {
                console.error('Error saving camps to Prisma DB:', dbErr);
            }
        }

        return NextResponse.json({ success: true, totalCount: valid.length });
    } catch (err) {
        console.error('Error saving camps:', err);
        return NextResponse.json({ success: false, message: 'Internal server error while saving camps' }, { status: 500 });
    }
}