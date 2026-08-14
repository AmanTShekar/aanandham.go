import { NextResponse } from 'next/server';

// Server-side secure admin validation
const VALID_PASSCODES = ['2026', 'aanandham', 'aanandham2026', 'wildadmin'];

export async function POST(request) {
    try {
        const body = await request.json();
        const { passcode } = body;

        if (!passcode) {
            return NextResponse.json({ success: false, message: 'Passcode required' }, { status: 400 });
        }

        const normalized = passcode.trim().toLowerCase();
        const isValid = VALID_PASSCODES.includes(normalized);

        if (isValid) {
            // Generate a time-limited session token
            const token = Buffer.from(`aanandham_admin_${Date.now()}_${Math.random().toString(36).substring(2)}`).toString('base64');
            return NextResponse.json({ success: true, token });
        } else {
            return NextResponse.json({ success: false, message: 'Invalid coordinator access key' }, { status: 401 });
        }
    } catch (e) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
