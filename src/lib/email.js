import { Resend } from 'resend';
import { generateGatePin, getCheckInLandmarkGuide, generatePassToken } from './accessControl';
import { buildGoogleCalendarUrl } from './calendarLink';
import { generateQrDataUri } from './qrGenerator';

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Automated Wilderness Booking Confirmation Email Dispatcher
 * Sends a high-contrast, premium HTML email voucher with:
 * - Scannable Digital Pass QR Code (Signed)
 * - 4-Digit Gate Access PIN
 * - 1-Click "Add to Google Calendar" and "Download iCal (.ics)"
 * - Direct PDF Pass & Check-In Portal Link
 * - Offline Landmark Navigation & 4x4 Convoy Details
 * - Meal & Provision Allocations
 */

export async function sendBookingConfirmationEmail(booking) {
    if (!booking || !booking.email) {
        console.warn('[EMAIL] ⚠️ No recipient email provided for booking:', booking?.id);
        return { success: false, reason: 'No recipient email' };
    }

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.EMAIL_FROM || 'Aanandham Wilderness <bookings@aanandham.in>';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aanandham.in';

    const gatePin = generateGatePin(booking.id, booking.dates);
    const landmarkGuide = getCheckInLandmarkGuide(booking.campsiteId || booking.package);
    const passToken = generatePassToken(booking.id);
    const passUrl = `${siteUrl}/pass/${booking.id}?token=${passToken}`;
    const icsUrl = `${siteUrl}/api/pass/${booking.id}/ics?token=${passToken}`;
    const googleCalUrl = buildGoogleCalendarUrl({
        title: booking.package || 'Aanandham Mountain Expedition',
        dates: booking.dates,
        location: `${landmarkGuide.hubName}, Suryanelli, Munnar`,
        description: `Official Aanandham Wilderness Booking (Ref: ${booking.id}). Smart Gate PIN: ${gatePin}. Arrive at Suryanelli Hub by 1:30 PM for 4x4 convoy.`,
        bookingId: booking.id
    });
    
    const qrImageUrl = await generateQrDataUri(passUrl, 260);

    const safeId = escapeHtml(booking.id);
    const safeName = escapeHtml(booking.name);
    const safePackage = escapeHtml(booking.package || 'Aanandham Mountain Camp');
    const safeDates = escapeHtml(booking.dates);
    const safeRoom = escapeHtml(booking.roomType || 'Alpine Glamping Tent');
    const safeMeal = escapeHtml(booking.mealSummary || `${booking.vegCount || 0} Veg + ${booking.nonVegCount || 0} Non-Veg BBQ`);
    const safeHub = escapeHtml(landmarkGuide.hubName);
    const safeParking = escapeHtml(landmarkGuide.parkingArea);
    const safePhone = escapeHtml(landmarkGuide.emergencyMarshalPhone);
    const safeOfflineNote = escapeHtml(landmarkGuide.offlineNote);

    const isConfirmed = booking.status === 'Confirmed' || booking.status === 'confirmed';
    const emailSubject = isConfirmed 
        ? `🏕️ Confirmed Wilderness Pass #${booking.id} - ${booking.package}`
        : `⏳ Booking Received (Pending Verification) #${booking.id} - ${booking.package}`;

    const badgeHtml = isConfirmed
        ? `<span class="badge" style="background: #D5ED55; color: #121613;">Official Wilderness Permit · Confirmed</span>`
        : `<span class="badge" style="background: #E5A93B; color: #121613;">⚠️ Pending Verification · In Progress</span>`;

    const headerTitle = isConfirmed
        ? `You're Headed to ${safePackage}!`
        : `Booking Received for ${safePackage}`;

    const pinBoxHtml = isConfirmed ? `
        <!-- GATE ACCESS PIN BOX -->
        <div class="pin-box">
            <div style="font-size: 11px; font-weight: 800; color: #A2B6A6; text-transform: uppercase; letter-spacing: 0.6px;">Smart Gate & Keypad PIN</div>
            <div class="pin-code">${gatePin}</div>
            <div style="font-size: 12px; color: #A2B6A6;">Active from 2:00 PM on your arrival date. Enter on barrier keypad.</div>
        </div>
    ` : `
        <!-- PENDING VERIFICATION NOTICE -->
        <div style="background: rgba(229, 169, 59, 0.12); border: 2px dashed #E5A93B; border-radius: 18px; padding: 20px; text-align: center; margin: 20px 0;">
            <div style="font-size: 11px; font-weight: 800; color: #E5A93B; text-transform: uppercase; letter-spacing: 0.6px;">⏳ Payment Verification In Progress</div>
            <div style="font-family: monospace; font-size: 28px; font-weight: 900; color: #E5A93B; letter-spacing: 6px; margin: 8px 0;">•••• (LOCKED)</div>
            <div style="font-size: 12px; color: #E2E8F0; line-height: 1.5;">Our camp coordinator is verifying your payment. Your official gate PIN and check-in pass will unlock automatically once approved.</div>
        </div>
    `;

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Wilderness Permit Pass - ${safeId}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #08110A; color: #FFFFFF; margin: 0; padding: 20px; -webkit-font-smoothing: antialiased; }
            .container { max-width: 600px; margin: 0 auto; background: #0E1A11; border-radius: 24px; overflow: hidden; border: 1px solid rgba(213, 237, 85, 0.25); box-shadow: 0 20px 50px rgba(0,0,0,0.6); }
            .header { background: #060E08; padding: 28px 24px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.08); }
            .badge { font-size: 11px; font-weight: 900; padding: 4px 14px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.8px; display: inline-block; }
            .content { padding: 24px; }
            .pin-box { background: #14261A; border: 2px dashed #D5ED55; border-radius: 18px; padding: 20px; text-align: center; margin: 20px 0; }
            .pin-code { font-family: monospace; font-size: 36px; font-weight: 900; color: #D5ED55; letter-spacing: 8px; margin: 6px 0; }
            .balance-box { background: ${Number(booking.balanceDue) > 0 ? 'rgba(229, 169, 59, 0.15)' : 'rgba(34, 197, 94, 0.15)'}; border: 1px solid ${Number(booking.balanceDue) > 0 ? 'rgba(229, 169, 59, 0.4)' : 'rgba(34, 197, 94, 0.4)'}; border-radius: 16px; padding: 14px 18px; margin-bottom: 20px; }
            .table-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13.5px; }
            .label { color: #A2B6A6; }
            .val { color: #FFFFFF; font-weight: 700; text-align: right; }
            .qr-card { background: #FFFFFF; border-radius: 18px; padding: 18px; text-align: center; margin: 20px 0; color: #121613; }
            .qr-card img { width: 180px; height: 180px; display: block; margin: 0 auto; }
            .cal-bar { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin: 20px 0 10px; }
            .cal-btn { background: #1C2D20; color: #D5ED55; font-size: 12px; font-weight: 800; text-decoration: none; padding: 8px 14px; border-radius: 10px; border: 1px solid rgba(213, 237, 85, 0.3); display: inline-block; }
            .footer { background: #060E08; padding: 20px; text-align: center; font-size: 12px; color: #59655D; border-top: 1px solid rgba(255,255,255,0.08); }
            .btn-primary { background: #D5ED55; color: #121613; font-weight: 900; font-size: 14px; text-decoration: none; padding: 14px 28px; border-radius: 12px; display: inline-block; margin-top: 10px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                ${badgeHtml}
                <h1 style="margin: 12px 0 0; font-size: 22px; color: #FFFFFF; font-weight: 800;">${headerTitle}</h1>
                <p style="margin: 6px 0 0; color: #A2B6A6; font-size: 13px;">Permit Reference: <strong style="color: #D5ED55;">${safeId}</strong></p>
            </div>

            <div class="content">
                
                <!-- ARRIVAL BALANCE STATUS -->
                <div class="balance-box">
                    <div style="font-size: 11px; color: #A2B6A6; font-weight: 800; text-transform: uppercase;">Check-In Settlement Status</div>
                    <div style="font-size: 16px; font-weight: 900; color: ${Number(booking.balanceDue) > 0 ? '#E5A93B' : '#22C55E'}; margin-top: 2px;">
                        ${Number(booking.balanceDue) > 0 ? `Collect ₹${Number(booking.balanceDue).toLocaleString('en-IN')} on Arrival` : '100% Fully Settled Online'}
                    </div>
                </div>

                ${pinBoxHtml}

                <!-- SCANNABLE MARSHAL QR CODE -->
                <div class="qr-card">
                    <img src="${qrImageUrl}" alt="Digital Pass QR Code" />
                    <div style="font-size: 13px; font-weight: 900; text-transform: uppercase; color: ${isConfirmed ? '#166534' : '#D97706'}; margin-top: 8px;">
                        ${isConfirmed ? 'Marshal Check-In QR Code' : 'Pass Verification QR Code'}
                    </div>
                    <div style="font-size: 11.5px; color: #59655D; margin-bottom: 8px;">
                        ${isConfirmed ? 'Present this QR code or screenshot to the Suryanelli Basecamp Marshal' : 'Scan to check live verification status on your digital pass portal'}
                    </div>
                    <a href="${passUrl}" class="btn-primary" style="display: block; text-align: center;">View & Track Live Wilderness Pass →</a>
                </div>

                <!-- 1-CLICK ADD TO CALENDAR -->
                <div style="text-align: center; margin: 18px 0; background: rgba(255,255,255,0.03); padding: 14px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.06);">
                    <div style="font-size: 11.5px; font-weight: 800; color: #D5ED55; text-transform: uppercase; margin-bottom: 8px;">Add Stay to Your Calendar</div>
                    <div class="cal-bar">
                        <a href="${googleCalUrl}" target="_blank" class="cal-btn">📅 Add to Google Calendar</a>
                        <a href="${icsUrl}" class="cal-btn">🍏 Apple / Outlook (.ics)</a>
                    </div>
                </div>

                <!-- ITINERARY & SQUAD SUMMARY -->
                <div style="background: rgba(255,255,255,0.04); border-radius: 16px; padding: 16px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.06);">
                    <div style="font-size: 11.5px; font-weight: 800; color: #D5ED55; text-transform: uppercase; margin-bottom: 10px;">Expedition Details</div>
                    <div class="table-row">
                        <span class="label">Lead Explorer:</span>
                        <span class="val">${safeName}</span>
                    </div>
                    <div class="table-row">
                        <span class="label">Stay Dates:</span>
                        <span class="val">${safeDates}</span>
                    </div>
                    <div class="table-row">
                        <span class="label">Stay Units:</span>
                        <span class="val">${safeRoom}</span>
                    </div>
                    <div class="table-row">
                        <span class="label">Squad Count:</span>
                        <span class="val">${Number(booking.guests || 2)} Campers (${Number(booking.adults || booking.guests || 2)} Adults${booking.children ? `, ${Number(booking.children)} Kids` : ''})</span>
                    </div>
                    <div class="table-row">
                        <span class="label">Kitchen Allocation:</span>
                        <span class="val">${safeMeal}</span>
                    </div>
                    <div class="table-row">
                        <span class="label">Total Fare:</span>
                        <span class="val">₹${Number(booking.total || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div class="table-row" style="border: none;">
                        <span class="label">Balance on Arrival:</span>
                        <span class="val" style="color: #D5ED55; font-size: 15px;">₹${Number(booking.balanceDue || 0).toLocaleString('en-IN')}</span>
                    </div>
                </div>

                <!-- OFFLINE 4x4 CONVOY DIRECTIONS -->
                <div style="background: rgba(255,255,255,0.04); border-radius: 16px; padding: 16px; border: 1px solid rgba(255,255,255,0.06);">
                    <div style="font-size: 11.5px; font-weight: 800; color: #D5ED55; text-transform: uppercase; margin-bottom: 8px;">4x4 Convoy & Landmark Guide</div>
                    <p style="font-size: 12.5px; color: #A2B6A6; margin: 0 0 6px;"><strong>Meeting Hub:</strong> ${safeHub}</p>
                    <p style="font-size: 12.5px; color: #A2B6A6; margin: 0 0 6px;"><strong>Parking:</strong> ${safeParking}</p>
                    <p style="font-size: 12.5px; color: #A2B6A6; margin: 0 0 8px;"><strong>Basecamp Marshal Hotline:</strong> ${safePhone}</p>
                    <p style="font-size: 11.5px; color: #E5A93B; margin: 0;">⚠️ <em>${safeOfflineNote}</em></p>
                </div>
            </div>

            <div class="footer">
                <p style="margin: 0 0 4px;">Aanandham Wilderness Stays · Suryanelli, Munnar, Kerala</p>
                <p style="margin: 0;">24/7 Mountain Dispatch: +91 94009 87654 · <a href="${siteUrl}" style="color: #D5ED55; text-decoration: none;">aanandham.in</a></p>
            </div>
        </div>
    </body>
    </html>
    `;

    // 1. If Resend API Key is configured, dispatch real email via Resend SDK
    if (apiKey) {
        try {
            const resend = new Resend(apiKey);
            const { data, error } = await resend.emails.send({
                from: fromEmail,
                to: [booking.email],
                subject: emailSubject,
                html: htmlContent
            });

            if (error) {
                console.error('[EMAIL] ❌ Resend API Error:', error);
                return { success: false, error };
            }

            console.info(`[EMAIL] ✅ Confirmation email sent to ${booking.email} (Message ID: ${data?.id})`);
            return { success: true, messageId: data?.id };
        } catch (err) {
            console.error('[EMAIL] ❌ Error sending email:', err);
            return { success: false, error: err.message };
        }
    }

    // 2. Fallback / Dev Log mode
    console.info(`[EMAIL SIMULATION] 📧 Email ready for ${booking.email} (Booking #${booking.id}, Gate PIN: ${gatePin}). Set RESEND_API_KEY in .env.local to send live emails.`);
    return { success: true, simulated: true, gatePin };
}
