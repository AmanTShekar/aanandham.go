import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const LOGO_PATH = path.resolve(__dir, '../../public/logo.png');

// ── Luxury Wilderness Color Palette (Matching aanandham.in) ──
const BG_DARK    = [8, 16, 11];        // #08100B Deepest obsidian forest
const CARD_BG    = [15, 28, 19];       // #0F1C13 Rich dark card
const CARD_INNER = [21, 38, 26];       // #15261A Card cell background
const CARD_LIGHT = [28, 48, 34];       // #1C3022 Highlight card
const LIME       = [213, 237, 85];     // #D5ED55 Signature Aanandham lime
const AMBER      = [245, 158, 11];     // #F59E0B Warm sunset amber
const GREEN      = [34, 197, 94];      // #22C55E Emerald verified green
const TEXT_WHITE = [255, 255, 255];    // #FFFFFF Pure white
const TEXT_MUTED = [162, 182, 166];    // #A2B6A6 Muted sage gray
const TEXT_DIM   = [110, 130, 115];    // #6E8273 Dim label gray
const BORDER_DIM = [38, 62, 45];       // #263E2D Subtle border
const BORDER_LIME= [213, 237, 85];     // Lime border

// Standard A4 Dimensions in Points (72 dpi)
const PAGE_W = 595.28;
const PAGE_H = 841.89;

/**
 * Generates an ultra-premium, luxury wilderness expedition pass PDF.
 * Designed to look like a high-end mountain sanctuary boarding permit.
 */
export async function generateBookingPassPdf(booking, qrBuffer) {
    return new Promise((resolve, reject) => {
        const chunks = [];

        const doc = new PDFDocument({
            size: [PAGE_W, PAGE_H],
            margins: { top: 0, bottom: 0, left: 0, right: 0 },
            info: {
                Title: `Aanandham Wilderness Permit — ${booking.id}`,
                Author: 'Aanandham.go Wilderness Stays',
                Subject: `Official Mountain Expedition Permit for ${booking.name || 'Explorer'}`,
                Keywords: 'Aanandham, Munnar, Glamping, Pass, Permit, Wilderness'
            }
        });

        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        const isConfirmed = ['confirmed', 'Confirmed'].includes(booking.status);
        const passRef = String(booking.id || 'BK-EXPEDITION').toUpperCase();

        // ═════════════════════════════════════════════════════════════
        // 1. BACKGROUND & OUTER PASSPORT FRAME
        // ═════════════════════════════════════════════════════════════
        doc.rect(0, 0, PAGE_W, PAGE_H).fill(BG_DARK);

        // Top Signature Lime Accent Bar
        doc.rect(0, 0, PAGE_W, 6).fill(LIME);

        // Main Pass Canvas Container (with margins)
        const C_X = 24;
        const C_Y = 24;
        const C_W = PAGE_W - 48; // 547.28 pt
        const C_H = PAGE_H - 48; // 793.89 pt

        // Pass Outer Card Background
        doc.roundedRect(C_X, C_Y, C_W, C_H, 20).fill(CARD_BG);
        doc.roundedRect(C_X, C_Y, C_W, C_H, 20)
           .lineWidth(1).strokeColor(BORDER_DIM).stroke();

        // ═════════════════════════════════════════════════════════════
        // 2. HEADER BRANDING & PERMIT CLASSIFICATION
        // ═════════════════════════════════════════════════════════════
        const HDR_Y = C_Y + 16;

        // Logo — Proportional 1:1, larger, perfectly centered
        if (fs.existsSync(LOGO_PATH)) {
            try {
                doc.image(LOGO_PATH, C_X + 20, HDR_Y, { fit: [54, 54], align: 'center', valign: 'center' });
            } catch (_) {}
        }

        // Clean, Bold Brand Title: Aanandham.go
        doc.font('Helvetica-Bold').fontSize(22).fill(TEXT_WHITE)
           .text('Aanandham', C_X + 86, HDR_Y + 14, { continued: true })
           .fill(LIME).text('.go');

        // Status Badge (Right aligned)
        const badgeW = 144;
        const badgeH = 26;
        const badgeX = C_X + C_W - badgeW - 20;
        const badgeY = HDR_Y + 14;
        const badgeBg = isConfirmed ? LIME : AMBER;
        const badgeText = isConfirmed ? '✓  PERMIT ACTIVE' : '⏳  PENDING APPROVAL';

        doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 13).fill(badgeBg);
        doc.font('Helvetica-Bold').fontSize(9).fill(BG_DARK)
           .text(badgeText, badgeX, badgeY + 8, { width: badgeW, align: 'center', characterSpacing: 0.5 });

        // ═════════════════════════════════════════════════════════════
        // 3. EXPEDITION BANNER CARD
        // ═════════════════════════════════════════════════════════════
        const EXP_Y = HDR_Y + 54;
        const EXP_H = 74;

        doc.roundedRect(C_X + 16, EXP_Y, C_W - 32, EXP_H, 14).fill(CARD_INNER);
        doc.roundedRect(C_X + 16, EXP_Y, C_W - 32, EXP_H, 14)
           .lineWidth(1).strokeColor(isConfirmed ? [45, 80, 55] : [80, 60, 30]).stroke();

        // Subtitle: Permit Reference
        doc.font('Helvetica-Bold').fontSize(8.5).fill(LIME)
           .text('OFFICIAL EXPEDITION VOUCHER & DIGITAL PASS', C_X + 32, EXP_Y + 14, { characterSpacing: 1.2 });

        // Expedition Package Title
        const pkgTitle = booking.package || 'Kolukkumalai Mountain Sunrise Expedition';
        doc.font('Helvetica-Bold').fontSize(16).fill(TEXT_WHITE)
           .text(pkgTitle, C_X + 32, EXP_Y + 28, { width: C_W - 190, ellipsis: true });

        // Location
        doc.font('Helvetica').fontSize(9).fill(TEXT_MUTED)
           .text('📍 Suryanelli Basecamp · Munnar, Kerala · 7,900 FT Ridge', C_X + 32, EXP_Y + 50);

        // Reference Box (Right side of banner)
        const refBoxW = 120;
        const refBoxX = C_X + C_W - 32 - refBoxW - 12;
        doc.roundedRect(refBoxX, EXP_Y + 12, refBoxW, 50, 10).fill(BG_DARK);
        doc.roundedRect(refBoxX, EXP_Y + 12, refBoxW, 50, 10).lineWidth(0.8).strokeColor(BORDER_DIM).stroke();

        doc.font('Helvetica').fontSize(7.5).fill(TEXT_DIM)
           .text('PASS REFERENCE', refBoxX, EXP_Y + 18, { width: refBoxW, align: 'center', characterSpacing: 0.8 });
        doc.font('Helvetica-Bold').fontSize(11).fill(LIME)
           .text(passRef, refBoxX, EXP_Y + 30, { width: refBoxW, align: 'center', characterSpacing: 1 });

        // ═════════════════════════════════════════════════════════════
        // 4. PERFORATED BOARDING DIVIDER
        // ═════════════════════════════════════════════════════════════
        const DIV_Y = EXP_Y + EXP_H + 16;

        // Cutout notches on left and right edge
        doc.circle(C_X, DIV_Y, 8).fill(BG_DARK);
        doc.circle(C_X + C_W, DIV_Y, 8).fill(BG_DARK);

        // Dashed tear line
        doc.save().dash(5, { space: 6 })
           .moveTo(C_X + 16, DIV_Y).lineTo(C_X + C_W - 16, DIV_Y)
           .lineWidth(1).strokeColor(BORDER_DIM).stroke().restore();

        // ═════════════════════════════════════════════════════════════
        // 5. TWO-COLUMN MAIN BODY (Details Left / Access Pass Right)
        // ═════════════════════════════════════════════════════════════
        const BODY_Y = DIV_Y + 16;
        const COL_PAD = 16;
        const LEFT_W  = 300;
        const RIGHT_W = (C_W - 32) - LEFT_W - COL_PAD; // ~199 pt
        const LEFT_X  = C_X + 16;
        const RIGHT_X = LEFT_X + LEFT_W + COL_PAD;

        // ── LEFT COLUMN: EXPEDITION MANIFEST ─────────────────────────
        doc.font('Helvetica-Bold').fontSize(9).fill(LIME)
           .text('EXPEDITION MANIFEST', LEFT_X + 4, BODY_Y, { characterSpacing: 1 });

        const manifestRows = [
            { label: 'LEAD EXPLORER', val: booking.name || 'Verified Explorer' },
            { label: 'STAY DATES', val: booking.dates || 'Scheduled Stay' },
            { label: 'LODGING SANCTUARY', val: booking.roomType || 'Alpine Glamping Dome Tent' },
            { label: 'SQUAD ROSTER', val: `${booking.guests || 2} Campers (${booking.adults || booking.guests || 2} Adults${booking.children ? `, ${booking.children} Kids` : ''})` },
            { label: 'KITCHEN PROVISIONS', val: booking.mealSummary || `${booking.vegCount || 0} Veg + ${booking.nonVegCount || 0} Non-Veg BBQ Dinner & Breakfast` },
            { label: 'TOTAL EXPEDITION FARE', val: `₹${Number(booking.total || 0).toLocaleString('en-IN')}` },
        ];

        let mY = BODY_Y + 16;
        for (const row of manifestRows) {
            doc.roundedRect(LEFT_X, mY, LEFT_W, 36, 8).fill(CARD_INNER);
            doc.roundedRect(LEFT_X, mY, LEFT_W, 36, 8).lineWidth(0.5).strokeColor(BORDER_DIM).stroke();

            doc.font('Helvetica-Bold').fontSize(7.5).fill(TEXT_DIM)
               .text(row.label, LEFT_X + 12, mY + 6, { characterSpacing: 0.6 });
            doc.font('Helvetica-Bold').fontSize(10).fill(TEXT_WHITE)
               .text(row.val, LEFT_X + 12, mY + 18, { width: LEFT_W - 24, ellipsis: true });

            mY += 41;
        }

        // Settlement Status Card (Bottom of left column)
        const balDue = Number(booking.balanceDue || 0);
        const balBg = balDue > 0 ? [45, 32, 12] : [14, 40, 24];
        const balBorder = balDue > 0 ? AMBER : GREEN;
        const balTitle = balDue > 0 ? 'BALANCE PAYABLE AT CHECK-IN' : 'PAYMENT STATUS';
        const balText = balDue > 0 
            ? `₹${balDue.toLocaleString('en-IN')} (UPI / Cash at Basecamp)`
            : '✓ 100% Fully Settled Online';

        doc.roundedRect(LEFT_X, mY, LEFT_W, 42, 8).fill(balBg);
        doc.roundedRect(LEFT_X, mY, LEFT_W, 42, 8).lineWidth(1).strokeColor(balBorder).stroke();

        doc.font('Helvetica-Bold').fontSize(7.5).fill(TEXT_MUTED)
           .text(balTitle, LEFT_X + 12, mY + 8, { characterSpacing: 0.8 });
        doc.font('Helvetica-Bold').fontSize(11).fill(balBorder)
           .text(balText, LEFT_X + 12, mY + 22);

        // ── RIGHT COLUMN: SMART ACCESS CONTROL & QR ─────────────────
        doc.font('Helvetica-Bold').fontSize(9).fill(LIME)
           .text('ACCESS CONTROL', RIGHT_X + 4, BODY_Y, { characterSpacing: 1 });

        // QR Code Card Container
        const QR_BOX_Y = BODY_Y + 16;
        const QR_BOX_H = 196;

        doc.roundedRect(RIGHT_X, QR_BOX_Y, RIGHT_W, QR_BOX_H, 12).fill(CARD_INNER);
        doc.roundedRect(RIGHT_X, QR_BOX_Y, RIGHT_W, QR_BOX_H, 12)
           .lineWidth(1).strokeColor(isConfirmed ? [45, 80, 55] : BORDER_DIM).stroke();

        doc.font('Helvetica-Bold').fontSize(7.5).fill(LIME)
           .text('MARSHAL VERIFICATION', RIGHT_X, QR_BOX_Y + 10, { width: RIGHT_W, align: 'center', characterSpacing: 1 });

        // QR Code Image
        const QR_IMG_SIZE = 120;
        const QR_IMG_X = RIGHT_X + (RIGHT_W - QR_IMG_SIZE) / 2;
        const QR_IMG_Y = QR_BOX_Y + 26;

        // Dark background plate for the QR
        doc.roundedRect(QR_IMG_X - 4, QR_IMG_Y - 4, QR_IMG_SIZE + 8, QR_IMG_SIZE + 8, 8).fill(BG_DARK);

        if (qrBuffer) {
            try {
                doc.image(qrBuffer, QR_IMG_X, QR_IMG_Y, { width: QR_IMG_SIZE, height: QR_IMG_SIZE });
            } catch (_) {}
        }

        // Small centered logo badge on the QR code
        if (fs.existsSync(LOGO_PATH)) {
            try {
                const BADGE_SZ = 18;
                const bX = QR_IMG_X + QR_IMG_SIZE / 2 - BADGE_SZ / 2;
                const bY = QR_IMG_Y + QR_IMG_SIZE / 2 - BADGE_SZ / 2;
                doc.circle(bX + BADGE_SZ / 2, bY + BADGE_SZ / 2, BADGE_SZ / 2 + 2).fill(BG_DARK);
                doc.image(LOGO_PATH, bX, bY, { width: BADGE_SZ, height: BADGE_SZ });
            } catch (_) {}
        }

        doc.font('Helvetica-Bold').fontSize(8).fill(TEXT_WHITE)
           .text('SCAN FOR INSTANT CHECK-IN', RIGHT_X, QR_BOX_Y + 158, { width: RIGHT_W, align: 'center' });
        doc.font('Helvetica').fontSize(7).fill(TEXT_MUTED)
           .text('Present to Suryanelli Marshal', RIGHT_X, QR_BOX_Y + 172, { width: RIGHT_W, align: 'center' });

        // Gate PIN Box (Below QR)
        const PIN_BOX_Y = QR_BOX_Y + QR_BOX_H + 12;
        const PIN_BOX_H = 80;
        const pinCode = (isConfirmed && booking.gatePin) ? String(booking.gatePin) : '••••';

        doc.roundedRect(RIGHT_X, PIN_BOX_Y, RIGHT_W, PIN_BOX_H, 12).fill(CARD_INNER);
        doc.roundedRect(RIGHT_X, PIN_BOX_Y, RIGHT_W, PIN_BOX_H, 12)
           .lineWidth(1.2).dash(3, { space: 3 })
           .strokeColor(isConfirmed ? LIME : AMBER).stroke().undash();

        doc.font('Helvetica-Bold').fontSize(7.5).fill(TEXT_MUTED)
           .text('SMART GATE & BARRIER PIN', RIGHT_X, PIN_BOX_Y + 10, { width: RIGHT_W, align: 'center', characterSpacing: 0.8 });

        doc.font('Helvetica-Bold').fontSize(22).fill(isConfirmed ? LIME : AMBER)
           .text(pinCode, RIGHT_X, PIN_BOX_Y + 26, { width: RIGHT_W, align: 'center', characterSpacing: 6 });

        doc.font('Helvetica').fontSize(7).fill(TEXT_DIM)
           .text('Enter on summit barrier keypad', RIGHT_X, PIN_BOX_Y + 58, { width: RIGHT_W, align: 'center' });

        // ═════════════════════════════════════════════════════════════
        // 6. 4X4 MOUNTAIN CONVOY & EXPEDITION GUIDELINES
        // ═════════════════════════════════════════════════════════════
        const CONVOY_Y = mY + 52;
        const CONVOY_H = 80;

        doc.roundedRect(C_X + 16, CONVOY_Y, C_W - 32, CONVOY_H, 12).fill(CARD_INNER);
        doc.roundedRect(C_X + 16, CONVOY_Y, C_W - 32, CONVOY_H, 12).lineWidth(0.8).strokeColor(BORDER_DIM).stroke();

        // 3 Feature Columns inside Convoy Card
        const col3W = (C_W - 32 - 32) / 3;
        const c1X = C_X + 24;
        const c2X = c1X + col3W + 8;
        const c3X = c2X + col3W + 8;

        // Col 1: Convoy Assembly
        doc.font('Helvetica-Bold').fontSize(8).fill(LIME)
           .text('🚙 4x4 CONVOY PICKUP', c1X, CONVOY_Y + 12, { characterSpacing: 0.5 });
        doc.font('Helvetica').fontSize(8).fill(TEXT_WHITE)
           .text('Suryanelli Hub @ 1:30 PM', c1X, CONVOY_Y + 26);
        doc.font('Helvetica').fontSize(7.5).fill(TEXT_MUTED)
           .text('Secure camper parking & jeep transit to mountain ridge.', c1X, CONVOY_Y + 40, { width: col3W });

        // Col 2: Wildlife & Forest Code
        doc.font('Helvetica-Bold').fontSize(8).fill(AMBER)
           .text('🌿 SANCTUARY PROTOCOL', c2X, CONVOY_Y + 12, { characterSpacing: 0.5 });
        doc.font('Helvetica').fontSize(8).fill(TEXT_WHITE)
           .text('Zero Litter · Silent Ridge', c2X, CONVOY_Y + 26);
        doc.font('Helvetica').fontSize(7.5).fill(TEXT_MUTED)
           .text('Strict eco-reserve guidelines. Carry warm layers (8-14°C night).', c2X, CONVOY_Y + 40, { width: col3W });

        // Col 3: 24/7 Dispatch
        doc.font('Helvetica-Bold').fontSize(8).fill(LIME)
           .text('📞 MOUNTAIN DISPATCH', c3X, CONVOY_Y + 12, { characterSpacing: 0.5 });
        doc.font('Helvetica-Bold').fontSize(8).fill(TEXT_WHITE)
           .text('+91 90748 58014', c3X, CONVOY_Y + 26);
        doc.font('Helvetica').fontSize(7.5).fill(TEXT_MUTED)
           .text('WhatsApp active 24/7 for convoy coordination & live route.', c3X, CONVOY_Y + 40, { width: col3W });

        // ═════════════════════════════════════════════════════════════
        // 7. LUXURY FOOTER & AUTHENTICATION STAMP
        // ═════════════════════════════════════════════════════════════
        const FOOT_Y = C_Y + C_H - 50;

        doc.rect(C_X + 16, FOOT_Y, C_W - 32, 1).fill(BORDER_DIM);

        doc.font('Helvetica-Bold').fontSize(8.5).fill(TEXT_WHITE)
           .text('Aanandham Wilderness Stays', C_X + 24, FOOT_Y + 12);
        doc.font('Helvetica').fontSize(7.5).fill(TEXT_MUTED)
           .text('Suryanelli · Kolukkumalai · Meesapulimala · Munnar, Kerala · aanandham.in', C_X + 24, FOOT_Y + 24);

        // Security Stamp (Right aligned)
        doc.font('Helvetica').fontSize(7).fill(TEXT_DIM)
           .text('CRYPTOGRAPHICALLY SIGNED VOUCHER · VALID AT MOUNTAIN GATES ONLY', C_X + 200, FOOT_Y + 18, { width: C_W - 224, align: 'right', characterSpacing: 0.4 });

        // Bottom Accent Lime Bar
        doc.rect(0, PAGE_H - 6, PAGE_W, 6).fill(LIME);

        doc.end();
    });
}

