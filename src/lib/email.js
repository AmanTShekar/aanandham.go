import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resend } from 'resend';
import { generateGatePin, getCheckInLandmarkGuide, generatePassToken } from './accessControl.js';
import { buildGoogleCalendarUrl, buildICalFileString } from './calendarLink.js';
import { generateQrBuffer } from './qrGenerator.js';
import { generateBookingPassPdf } from './pdfGenerator.js';

// ── Resolve /public/logo.png as a Buffer for inline CID attachment ──
const __emailDir = path.dirname(fileURLToPath(import.meta.url));
const LOGO_PATH = path.resolve(__emailDir, '../../public/logo.png');
function readLogoBuffer() {
    try {
        if (fs.existsSync(LOGO_PATH)) {
            return fs.readFileSync(LOGO_PATH);
        }
    } catch (e) {
        // Logo not found — will fall back to URL reference
    }
    return null;
}

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

function resolveSiteUrl() {
    const raw = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://aanandham.in';
    if (!raw || raw.includes('localhost') || raw.includes('127.0.0.1')) {
        return 'https://aanandham.in';
    }
    return raw.replace(/\/+$/, '');
}

export async function sendBookingConfirmationEmail(booking) {
    if (!booking || !booking.email) {
        console.warn('[EMAIL] ⚠️ No recipient email provided for booking:', booking?.id);
        return { success: false, reason: 'No recipient email' };
    }

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.EMAIL_FROM || 'Aanandham.go team <bookings@aanandham.in>';
    const siteUrl = resolveSiteUrl();

    const landmarkGuide = getCheckInLandmarkGuide(booking.campsiteId || booking.package, booking);
    const passToken = generatePassToken(booking.id);
    const passUrl = `${siteUrl}/pass/${booking.id}?token=${passToken}`;
    const icsUrl = `${siteUrl}/api/pass/${booking.id}/ics?token=${passToken}`;
    const googleCalUrl = buildGoogleCalendarUrl({
        title: booking.package || 'Aanandham Mountain Expedition',
        dates: booking.dates,
        location: `${landmarkGuide.hubName}, Suryanelli, Munnar`,
        description: `Official Aanandham Wilderness Booking (Ref: ${booking.id}). Present your digital pass or QR upon arrival at ${landmarkGuide.hubName} by 1:30 PM for 4x4 convoy.`,
        bookingId: booking.id
    });


    // QR is ONLY in the PDF attachment (private) — never exposed via public URL in email

    // QR buffer still needed for the PDF attachment
    const qrBuffer = await generateQrBuffer(passUrl, 280);

    // Generate branded PDF pass attachment
    const pdfBuffer = await generateBookingPassPdf(
        { ...booking, id: booking.id },
        qrBuffer
    ).catch(err => {
        console.warn('[EMAIL] PDF generation failed, skipping attachment:', err.message);
        return null;
    });

    // Generate .ics calendar file — iOS Mail auto-shows "Add to Calendar", Gmail renders inline
    const now = new Date();
    const calStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14, 14, 0, 0);
    const calEnd   = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 15, 11, 0, 0);
    const icsContent = buildICalFileString({
        title: booking.package || 'Aanandham Mountain Expedition',
        location: `${landmarkGuide.hubName}, Suryanelli, Munnar, Kerala`,
        description: `Aanandham Wilderness Stay\\nBooking Reference: ${booking.id}\\nLead Camper: ${booking.name}\\nPresent your digital pass QR at ${landmarkGuide.hubName} by 1:30 PM for 4x4 convoy.`,
        bookingId: booking.id,
        startIso: calStart.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
        endIso:   calEnd.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    });

    // Production public URL for logo — works in all email clients (no attachment trick needed)
    const logoPublicUrl = 'https://aanandham.in/logo.png';

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

    const headerTitle = isConfirmed
        ? `You're Headed to ${safePackage}!`
        : `Booking Received for ${safePackage}`;

    const pendingNoticeHtml = isConfirmed ? '' : `
        <!-- PENDING VERIFICATION NOTICE -->
        <div style="background: rgba(229, 169, 59, 0.12); border: 2px dashed #E5A93B; border-radius: 18px; padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 11px; font-weight: 800; color: #E5A93B; text-transform: uppercase; letter-spacing: 0.6px;">⏳ Payment Verification In Progress</div>
            <div style="font-size: 13px; color: #E2E8F0; line-height: 1.5; margin-top: 8px;">Our camp coordinator is verifying your payment. Your official check-in pass will be activated and confirmed shortly.</div>
        </div>
    `;

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
        <meta charset="utf-8">
        <title>Booking Pass - ${safeId}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="light dark">
        <meta name="supported-color-schemes" content="light dark">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800;12..96,900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800;12..96,900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
            :root {
                color-scheme: light dark;
                supported-color-schemes: light dark;
            }
            body { 
                font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
                background-color: #08110A !important; 
                color: #FFFFFF !important; 
                margin: 0; 
                padding: 20px; 
                -webkit-font-smoothing: antialiased; 
            }
            h1, h2, h3, .brand-title { 
                font-family: 'Bricolage Grotesque', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; 
            }
            .container { 
                max-width: 660px; 
                margin: 0 auto; 
                background-color: #0E1A11 !important; 
                border-radius: 24px; 
                overflow: hidden; 
                border: 1px solid rgba(213, 237, 85, 0.25); 
                box-shadow: 0 20px 50px rgba(0,0,0,0.6); 
            }
            .header { 
                background-color: #060E08 !important; 
                padding: 32px 28px; 
                text-align: center; 
                border-bottom: 1px solid rgba(255,255,255,0.08); 
            }
            .badge { 
                font-size: 11px; 
                font-weight: 800; 
                padding: 5px 16px; 
                border-radius: 999px; 
                text-transform: uppercase; 
                letter-spacing: 0.8px; 
                display: inline-block; 
            }
            .content { 
                padding: 28px; 
                background-color: #0E1A11 !important;
            }
            .table-row { 
                display: flex; 
                justify-content: space-between; 
                padding: 10px 0; 
                border-bottom: 1px solid rgba(255,255,255,0.06); 
                font-size: 13.5px; 
            }
            .label { color: #A2B6A6 !important; }
            .val { color: #FFFFFF !important; font-weight: 700; text-align: right; }
            .footer { 
                background-color: #060E08 !important; 
                padding: 22px; 
                text-align: center; 
                font-size: 12px; 
                color: #59655D !important; 
                border-top: 1px solid rgba(255,255,255,0.08); 
            }
            /* Dark mode anti-inversion overrides for Gmail/Outlook */
            [data-ogsc] .container, [data-ogsb] .container { background-color: #0E1A11 !important; }
            [data-ogsc] .header, [data-ogsb] .header { background-color: #060E08 !important; }
            [data-ogsc] .footer, [data-ogsb] .footer { background-color: #060E08 !important; }
            [data-ogsc] .val, [data-ogsb] .val { color: #FFFFFF !important; }
            [data-ogsc] .label, [data-ogsb] .label { color: #A2B6A6 !important; }
        </style>
    </head>
    <body class="body" style="background-color: #08110A !important; color: #FFFFFF !important; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div class="container" style="background-color: #0E1A11 !important; max-width: 660px; margin: 0 auto; border-radius: 24px; overflow: hidden; border: 1px solid rgba(213, 237, 85, 0.25);">
            <div class="header" style="background-color: #060E08 !important; padding: 32px 28px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.08);">
                <a href="${siteUrl}" style="text-decoration: none; display: inline-block;">
                    <img src="${logoPublicUrl}" alt="Aanandham.go" width="76" height="76" style="display: block; margin: 0 auto 12px; border-radius: 18px; object-fit: contain;" />
                    <div class="brand-title" style="font-family: 'Bricolage Grotesque', 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 27px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 8px;"><span style="color: #FFFFFF !important;">Aanandham</span><span style="color: #D5ED55 !important;">.go</span></div>
                </a>
                <h1 style="font-family: 'Bricolage Grotesque', 'Plus Jakarta Sans', -apple-system, sans-serif; margin: 8px 0 0; font-size: 24px; color: #FFFFFF !important; font-weight: 800; line-height: 1.3;">${headerTitle}</h1>
                <p style="margin: 8px 0 0; color: #A2B6A6 !important; font-size: 13.5px;">Booking Ref: <strong style="color: #D5ED55 !important; font-family: monospace; letter-spacing: 0.8px; font-size: 14px;">${safeId}</strong></p>
            </div>

            <div class="content">
                
                <!-- 1. MAIN STAY & PAYMENT DETAILS (HERO) -->
                <div style="background-color: rgba(255,255,255,0.04); border-radius: 18px; padding: 24px; margin-bottom: 22px; border: 1px solid rgba(255,255,255,0.08);">
                    <div style="font-family: 'Bricolage Grotesque', 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 12px; font-weight: 800; color: #D5ED55; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 14px;">Stay Details</div>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #A2B6A6; vertical-align: middle;">Lead Guest:</td>
                            <td align="right" style="padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14.5px; font-weight: 700; color: #FFFFFF; text-align: right; vertical-align: middle;">${safeName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #A2B6A6; vertical-align: middle;">Dates:</td>
                            <td align="right" style="padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14.5px; font-weight: 700; color: #FFFFFF; text-align: right; vertical-align: middle;">${safeDates}</td>
                        </tr>
                        <tr>
                            <td style="padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #A2B6A6; vertical-align: middle;">Lodging:</td>
                            <td align="right" style="padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14.5px; font-weight: 700; color: #FFFFFF; text-align: right; vertical-align: middle;">${safeRoom}</td>
                        </tr>
                        <tr>
                            <td style="padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #A2B6A6; vertical-align: middle;">Guests:</td>
                            <td align="right" style="padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14.5px; font-weight: 700; color: #FFFFFF; text-align: right; vertical-align: middle;">${Number(booking.guests || 2)} Campers (${Number(booking.adults || booking.guests || 2)} Adults${booking.children ? `, ${Number(booking.children)} Kids` : ''})</td>
                        </tr>
                        <tr>
                            <td style="padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #A2B6A6; vertical-align: middle;">Meal Plan:</td>
                            <td align="right" style="padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14.5px; font-weight: 700; color: #FFFFFF; text-align: right; vertical-align: middle;">${safeMeal}</td>
                        </tr>
                        <tr>
                            <td style="padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #A2B6A6; vertical-align: middle;">Total Amount:</td>
                            <td align="right" style="padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; font-weight: 700; color: #FFFFFF; text-align: right; vertical-align: middle;">₹${Number(booking.total || 0).toLocaleString('en-IN')}</td>
                        </tr>
                        <tr>
                            <td style="padding: 14px 0 4px; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14.5px; font-weight: 700; color: #FFFFFF; vertical-align: middle;">Balance Payable at Check-In:</td>
                            <td align="right" style="padding: 14px 0 4px; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 18px; font-weight: 900; color: ${Number(booking.balanceDue) > 0 ? '#D5ED55' : '#22C55E'}; text-align: right; vertical-align: middle;">
                                ${Number(booking.balanceDue) > 0 ? `₹${Number(booking.balanceDue).toLocaleString('en-IN')}` : '✓ 100% Fully Paid Online'}
                            </td>
                        </tr>
                    </table>
                    ${Number(booking.balanceDue) > 0 ? `
                    <div style="margin-top: 16px; background-color: rgba(213, 237, 85, 0.08); border: 1px dashed rgba(213, 237, 85, 0.35); border-radius: 12px; padding: 14px 16px; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12.5px; color: #C8D8CB; line-height: 1.55;">
                        <div style="margin-bottom: 5px;">💳 <strong style="color: #FFFFFF;">Check-In Payment:</strong> The remaining balance of <strong style="color: #D5ED55;">₹${Number(booking.balanceDue).toLocaleString('en-IN')}</strong> is payable upon arrival at <strong style="color: #FFFFFF;">${safeHub}</strong>.</div>
                        <div style="color: #E5A93B; font-size: 12px; margin-top: 6px; line-height: 1.45;">
                            ⚠️ <strong>Mountain Network &amp; Cash Note:</strong> Mobile internet and UPI (GPay / PhonePe) can be erratic due to low mountain coverage, and ATMs past Munnar town are often unavailable. <em>We strongly advise carrying sufficient liquid cash or withdrawing from Munnar town before ascending.</em>
                        </div>
                    </div>
                    ` : ''}
                </div>

                ${pendingNoticeHtml}

                <!-- 2. DIGITAL PASS PORTAL CTA -->
                <div style="background-color: #0B150E; border: 2px solid rgba(213, 237, 85, 0.3); border-radius: 18px; padding: 26px 20px; text-align: center; margin: 0 0 22px;">
                    <div style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 10px; font-weight: 800; color: #D5ED55; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">★ Digital Pass Voucher ★</div>
                    <div style="font-size: 32px; margin-bottom: 6px;">🎫</div>
                    <div class="brand-title" style="font-family: 'Bricolage Grotesque', 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 18px; font-weight: 800; color: #FFFFFF; margin-bottom: 6px;">
                        ${isConfirmed ? 'Your Pass is Confirmed &amp; Ready' : 'Pass Issued · Pending Verification'}
                    </div>
                    <div style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 12.5px; color: #A2B6A6; margin-bottom: 18px;">
                        ${isConfirmed
                            ? 'Tap below to open your live digital pass with scannable QR code for check-in'
                            : 'Tap below to track your verification status and unlock your pass'
                        }
                    </div>
                    <a href="${passUrl}" style="display: inline-block; background-color: #D5ED55; color: #121613 !important; font-weight: 800; font-size: 15px; text-decoration: none; padding: 14px 34px; border-radius: 12px; letter-spacing: -0.2px; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;">
                        🏳️&nbsp; View Live Pass &amp; Check-In QR →
                    </a>
                    <div style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 11px; color: #59655D; margin-top: 12px;">
                        Secure signed link · Ref: <strong style="color: #A2B6A6; font-family: monospace;">${safeId}</strong> · Scannable QR also inside the attached PDF
                    </div>
                </div>

                <!-- 3. PICKUP & ARRIVAL GUIDE -->
                <div style="background-color: rgba(255,255,255,0.04); border-radius: 16px; padding: 20px; margin-bottom: 22px; border: 1px solid rgba(255,255,255,0.06); font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;">
                    <div style="font-family: 'Bricolage Grotesque', 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 12px; font-weight: 800; color: #D5ED55; text-transform: uppercase; margin-bottom: 12px;">🚙 Pickup &amp; Arrival Details</div>
                    <p style="font-size: 13.5px; color: #C8D8CB; margin: 0 0 8px; line-height: 1.5;"><strong style="color: #FFFFFF;">Pickup Point:</strong> ${safeHub}</p>
                    <p style="font-size: 13.5px; color: #C8D8CB; margin: 0 0 8px; line-height: 1.5;"><strong style="color: #FFFFFF;">Parking:</strong> ${safeParking}</p>
                    <p style="font-size: 13.5px; color: #C8D8CB; margin: 0 0 10px; line-height: 1.5;"><strong style="color: #FFFFFF;">Camp Support Hotline:</strong> ${safePhone}</p>
                    <p style="font-size: 12px; color: #E5A93B; margin: 0; line-height: 1.45;">⚠️ <em>${safeOfflineNote}</em></p>
                </div>

                <!-- 4. CALENDAR INVITE ATTACHMENT CARD (AT END) -->
                <div style="text-align: center; background: rgba(255,255,255,0.03); padding: 14px 18px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.06);">
                    <div style="font-size: 11px; font-weight: 800; color: #D5ED55; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">📅 Calendar Invite Attached</div>
                    <div style="font-size: 12px; color: #A2B6A6;">Open the attached <strong style="color:#FFFFFF;">aanandham-stay.ics</strong> file to sync your stay with Google Calendar, Apple Calendar, or Outlook.</div>
                </div>
            </div>

            <!-- WARM CLOSING MESSAGE -->
            <div style="background: linear-gradient(135deg, #121F16 0%, #0E1A11 100%); border-top: 1px solid rgba(213,237,85,0.15); padding: 28px 24px; text-align: center;">
                <div style="font-size: 22px; margin-bottom: 10px;">🏔️ 🌿 ✨</div>
                <h2 style="font-size: 20px; font-weight: 800; color: #FFFFFF; margin: 0 0 8px;">Enjoy Your <span style="color: #D5ED55;">Wilderness Escape!</span></h2>
                <p style="font-size: 13.5px; color: #A2B6A6; line-height: 1.7; margin: 0 0 16px; max-width: 480px; margin-left: auto; margin-right: auto;">
                    The mountains are waiting. Breathe in the fresh Munnar air, watch the sunrise from Kolukkumalai,
                    and let the forest reset your soul. We're getting everything ready for your stay.
                </p>
                <div style="display: inline-block; background: rgba(213,237,85,0.08); border: 1px solid rgba(213,237,85,0.25); border-radius: 14px; padding: 14px 22px; margin-bottom: 16px;">
                    <div style="font-size: 11px; font-weight: 800; color: #D5ED55; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">🏕️ Need anything before you arrive?</div>
                    <div style="font-size: 13px; color: #FFFFFF;">WhatsApp us anytime — <strong style="color: #D5ED55;">+91 90748 58014</strong></div>
                    <div style="font-size: 11.5px; color: #A2B6A6; margin-top: 4px;">Have questions about routes, weather, or meals? We're here for you.</div>
                </div>
                <div style="font-size: 12px; color: #59655D;">
                    📎 Your <strong style="color: #A2B6A6;">Booking Pass PDF</strong> and <strong style="color: #A2B6A6;">Calendar Invite (.ics)</strong> are attached below
                </div>
            </div>

            <div class="footer">
                <p style="margin: 0 0 4px;">Aanandham.go · Suryanelli, Munnar, Kerala</p>
                <p style="margin: 0;">Camp Hotline: +91 90748 58014 · <a href="${siteUrl}" style="color: #D5ED55; text-decoration: none;">aanandham.in</a></p>
            </div>
        </div>
    </body>
    </html>
    `;

    // 1. If Resend API Key is configured, dispatch real email via Resend SDK
    if (apiKey) {
        try {
            const resend = new Resend(apiKey);

            // Only PDF and .ics calendar are real attachments — logo and QR render via public URLs
            const attachments = [];
            if (pdfBuffer) {
                attachments.push({
                    filename: `wilderness-pass-${booking.id}.pdf`,
                    content: pdfBuffer,
                    content_type: 'application/pdf'
                });
            }
            if (icsContent) {
                attachments.push({
                    filename: `aanandham-stay-${booking.id}.ics`,
                    content: Buffer.from(icsContent, 'utf-8'),
                    content_type: 'text/calendar; method=PUBLISH'
                });
            }

            const { data, error } = await resend.emails.send({
                from: fromEmail,
                to: [booking.email],
                subject: emailSubject,
                html: htmlContent,
                ...(attachments.length > 0 ? { attachments } : {})
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

/**
 * Direct Contact Form Inquiry Email Dispatcher via Resend
 * Sends inquiry notification to bookings@aanandham.in and auto-acknowledgment to guest
 */
export async function sendContactInquiryEmail(inquiry) {
    if (!inquiry || !inquiry.email) {
        console.warn('[CONTACT EMAIL] ⚠️ No recipient email provided');
        return { success: false, reason: 'No recipient email' };
    }

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.EMAIL_FROM || 'Aanandham.go team <bookings@aanandham.in>';
    const adminDestEmail = 'bookings@aanandham.in';
    const siteUrl = resolveSiteUrl();
    const adminPhone = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '919074858014';
    const formattedPhone = adminPhone.length === 12 && adminPhone.startsWith('91')
        ? `+91 ${adminPhone.slice(2, 7)} ${adminPhone.slice(7)}`
        : `+${adminPhone}`;

    const safeName = escapeHtml(inquiry.name || 'Explorer');
    const safeEmail = escapeHtml(inquiry.email);
    const safePhone = escapeHtml(inquiry.phone || 'N/A');
    const safeType = escapeHtml((inquiry.inquiryType || 'General').toUpperCase());
    const safeGuests = escapeHtml(String(inquiry.guests || '2'));
    const safeDates = escapeHtml(inquiry.travelDates || 'Flexible');
    const safeMessage = escapeHtml(inquiry.message || 'No additional message provided.');
    const inquiryId = inquiry.id || `INQ-${Date.now().toString(36).toUpperCase()}`;

    const typeKey = (inquiry.inquiryType || 'general').toLowerCase();
    const typeMeta = {
        booking: { label: '⛺ Dome Glamp Stay', color: '#D5ED55', bg: 'rgba(213, 237, 85, 0.15)' },
        kolukkumalai: { label: '🌅 4x4 Sunrise Safari', color: '#E5A93B', bg: 'rgba(229, 169, 59, 0.15)' },
        custom: { label: '👥 Squad Offsite & Buyout', color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.15)' },
        general: { label: '💬 General Basecamp Query', color: '#A7F3D0', bg: 'rgba(167, 243, 208, 0.15)' }
    }[typeKey] || { label: `📌 ${safeType}`, color: '#D5ED55', bg: 'rgba(213, 237, 85, 0.15)' };

    if (!apiKey) {
        console.info(`[CONTACT EMAIL SIMULATED] Inbound inquiry from ${safeName} (${safeEmail}) - ${typeMeta.label}`);
        return { success: true, simulated: true, inquiryId };
    }

    try {
        const resend = new Resend(apiKey);

        // 1. Dispatch Notification Email to Basecamp Desk (bookings@aanandham.in)
        const adminHtml = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8" /></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0B150E; color: #FFFFFF; padding: 24px; margin: 0;">
            <div style="max-width: 600px; margin: 0 auto; background: #121F16; border: 1px solid rgba(213, 237, 85, 0.3); border-radius: 16px; padding: 32px;">
                <div style="display: inline-block; font-size: 11px; font-weight: 800; color: ${typeMeta.color}; background: ${typeMeta.bg}; border: 1px solid ${typeMeta.color}; padding: 4px 10px; border-radius: 999px; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 12px;">
                    ${typeMeta.label}
                </div>
                <h1 style="font-size: 24px; font-weight: 800; color: #FFFFFF; margin: 0 0 20px;">${safeName}</h1>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);"><td style="padding: 10px 0; color: #8E9B92; font-size: 13px;">Reference</td><td style="padding: 10px 0; color: #D5ED55; font-weight: 800; font-family: monospace;">${inquiryId}</td></tr>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);"><td style="padding: 10px 0; color: #8E9B92; font-size: 13px;">Expedition Category</td><td style="padding: 10px 0; color: ${typeMeta.color}; font-weight: 800;">${typeMeta.label}</td></tr>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);"><td style="padding: 10px 0; color: #8E9B92; font-size: 13px;">Guest Name</td><td style="padding: 10px 0; color: #FFFFFF; font-weight: 700;">${safeName}</td></tr>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);"><td style="padding: 10px 0; color: #8E9B92; font-size: 13px;">Email</td><td style="padding: 10px 0; color: #FFFFFF;"><a href="mailto:${safeEmail}" style="color: #D5ED55; text-decoration: none;">${safeEmail}</a></td></tr>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);"><td style="padding: 10px 0; color: #8E9B92; font-size: 13px;">Phone</td><td style="padding: 10px 0; color: #FFFFFF;"><a href="tel:${safePhone}" style="color: #FFFFFF; text-decoration: none;">${safePhone}</a></td></tr>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);"><td style="padding: 10px 0; color: #8E9B92; font-size: 13px;">Squad Size</td><td style="padding: 10px 0; color: #FFFFFF;">${safeGuests} Campers</td></tr>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);"><td style="padding: 10px 0; color: #8E9B92; font-size: 13px;">Target Dates</td><td style="padding: 10px 0; color: #E5A93B; font-weight: 700;">${safeDates}</td></tr>
                </table>

                <div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 18px; margin-bottom: 24px; border: 1px solid rgba(255,255,255,0.06);">
                    <div style="font-size: 11px; font-weight: 800; color: #8E9B92; text-transform: uppercase; margin-bottom: 8px;">Camper Notes & Requirements:</div>
                    <div style="font-size: 14px; color: #E2E8F0; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</div>
                </div>

                <div style="text-align: center; margin-top: 24px;">
                    <a href="mailto:${safeEmail}?subject=Re:%20Aanandham%20Wilderness%20Expedition%20Inquiry%20(${inquiryId})" style="background: #D5ED55; color: #0B150E; padding: 12px 24px; border-radius: 10px; font-weight: 800; text-decoration: none; display: inline-block;">Reply to Camper →</a>
                </div>
            </div>
        </body>
        </html>
        `;

        // 2. Dispatch Confirmation Receipt to Guest
        const guestHtml = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8" /></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0B150E; color: #FFFFFF; padding: 24px; margin: 0;">
            <div style="max-width: 600px; margin: 0 auto; background: #121F16; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 32px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="https://aanandham.in/logo.png" alt="Aanandham Wilderness" width="56" height="56" style="display:block;margin:0 auto 10px;border-radius:12px;object-fit:contain;" />
                    <div style="font-size: 11px; font-weight: 800; color: #D5ED55; letter-spacing: 2px; text-transform: uppercase;">AANANDHAM WILDERNESS BASECAMPS</div>
                    <h1 style="font-size: 24px; font-weight: 800; color: #FFFFFF; margin: 8px 0 0;">We Received Your Inquiry! 🏔️</h1>
                </div>

                <p style="font-size: 14.5px; color: #C8D8CB; line-height: 1.6;">
                    Hi <strong>${safeName}</strong>, thank you for reaching out to Aanandham Wilderness Stays. Our mountain expedition coordinators have received your inquiry for <strong>${safeType}</strong>.
                </p>

                <div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 18px; margin: 20px 0; border: 1px solid rgba(255,255,255,0.06);">
                    <div style="font-size: 12px; color: #8E9B92; margin-bottom: 4px;">Inquiry Reference: <strong style="color: #D5ED55; font-family: monospace;">${inquiryId}</strong></div>
                    <div style="font-size: 12px; color: #8E9B92; margin-bottom: 4px;">Campers: <strong style="color: #FFFFFF;">${safeGuests}</strong> · Dates: <strong style="color: #FFFFFF;">${safeDates}</strong></div>
                    <div style="font-size: 12px; color: #8E9B92;">Status: <strong style="color: #E5A93B;">Under Review by Ridge Marshals</strong></div>
                </div>

                <p style="font-size: 13.5px; color: #A2B6A6; line-height: 1.6;">
                    Our team typically responds within <strong>2 to 4 hours</strong> with customized availability, tent allocations, and 4x4 sunrise convoy details.
                </p>

                <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px; margin-top: 24px; text-align: center;">
                    <p style="font-size: 12.5px; color: #8E9B92; margin: 0 0 6px;">Need urgent ridge assistance or same-day check-in?</p>
                    <p style="font-size: 13px; color: #FFFFFF; font-weight: 700; margin: 0;">24/7 Mountain Dispatch: ${formattedPhone} · <a href="${siteUrl}" style="color: #D5ED55; text-decoration: none;">aanandham.in</a></p>
                </div>
            </div>
        </body>
        </html>
        `;

        // Send to admin desk and guest (no attachments needed — logo renders via public URL)
        const [adminResult, guestResult] = await Promise.allSettled([
            resend.emails.send({
                from: fromEmail,
                to: [adminDestEmail],
                replyTo: safeEmail,
                subject: `[INQUIRY] ${safeType}: ${safeName} (${safeGuests} Campers)`,
                html: adminHtml
            }),
            resend.emails.send({
                from: fromEmail,
                to: [inquiry.email],
                replyTo: adminDestEmail,
                subject: `🏔️ Aanandham Wilderness — We received your inquiry (Ref: ${inquiryId})`,
                html: guestHtml
            })
        ]);

        return {
            success: true,
            inquiryId,
            adminMessageId: adminResult.status === 'fulfilled' ? adminResult.value?.data?.id : null,
            guestMessageId: guestResult.status === 'fulfilled' ? guestResult.value?.data?.id : null
        };
    } catch (err) {
        console.error('[CONTACT EMAIL ERROR]', err);
        return { success: false, error: err.message };
    }
}
