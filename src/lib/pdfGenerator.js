import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const LOGO_PATH = path.resolve(__dir, '../../public/logo.png');

// Brand palette
const C = {
    dark:    '#0B150E',
    forest:  '#121F15',
    card:    '#1A2E1E',
    lime:    '#D5ED55',
    amber:   '#E5A93B',
    muted:   '#A2B6A6',
    white:   '#FFFFFF',
    border:  '#2A3E2E'
};

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
}

/**
 * Generates a fully branded Aanandham Wilderness Permit PDF.
 * Returns a Buffer with the complete PDF content.
 */
export async function generateBookingPassPdf(booking, qrBuffer) {
    return new Promise((resolve, reject) => {
        const chunks = [];

        const doc = new PDFDocument({
            size: [595, 842], // A4
            margins: { top: 0, bottom: 0, left: 0, right: 0 },
            info: {
                Title: `Aanandham Wilderness Permit — ${booking.id}`,
                Author: 'Aanandham.go',
                Subject: `Booking Confirmation for ${booking.name}`,
                Keywords: 'aanandham, wilderness, camping, pass, permit'
            }
        });

        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        const W = 595;
        const H = 842;
        let y = 0;

        // ── FULL PAGE DARK BACKGROUND ──────────────────────────────
        doc.rect(0, 0, W, H).fill(hexToRgb(C.dark));

        // ── SUBTLE GRID TEXTURE ────────────────────────────────────
        doc.save();
        doc.opacity(0.04);
        for (let gx = 0; gx < W; gx += 24) {
            doc.moveTo(gx, 0).lineTo(gx, H).stroke([255, 255, 255]);
        }
        for (let gy = 0; gy < H; gy += 24) {
            doc.moveTo(0, gy).lineTo(W, gy).stroke([255, 255, 255]);
        }
        doc.restore();

        // ── TOP LIME ACCENT BAR ────────────────────────────────────
        doc.rect(0, 0, W, 6).fill(hexToRgb(C.lime));

        y = 32;

        // ── LOGO + BRAND HEADER ────────────────────────────────────
        if (fs.existsSync(LOGO_PATH)) {
            try {
                doc.image(LOGO_PATH, (W / 2) - 28, y, { width: 56, height: 56 });
            } catch (e) { /* skip logo if unreadable */ }
        }
        y += 66;

        // Brand name
        doc.font('Helvetica-Bold')
           .fontSize(18)
           .fill(hexToRgb(C.white))
           .text('Aanandham', 0, y, { align: 'center', continued: true })
           .fill(hexToRgb(C.lime))
           .text('.go')
           .fill(hexToRgb(C.muted))
           .font('Helvetica')
           .fontSize(11)
           .text('Wilderness Stays · Suryanelli, Munnar, Kerala', 0, y + 22, { align: 'center' });

        y += 52;

        // ── STATUS BADGE ──────────────────────────────────────────
        const isConfirmed = ['confirmed', 'Confirmed'].includes(booking.status);
        const badgeColor = isConfirmed ? hexToRgb(C.lime) : hexToRgb(C.amber);
        const badgeText = isConfirmed ? '✓  OFFICIAL WILDERNESS PERMIT · CONFIRMED' : '⏳  PENDING VERIFICATION';
        const badgeTextColor = isConfirmed ? hexToRgb(C.dark) : hexToRgb(C.dark);
        const badgeW = 280;
        const badgeX = (W - badgeW) / 2;
        doc.roundedRect(badgeX, y, badgeW, 22, 11).fill(badgeColor);
        doc.font('Helvetica-Bold').fontSize(9).fill(badgeTextColor)
           .text(badgeText, badgeX, y + 7, { width: badgeW, align: 'center' });

        y += 34;

        // ── PACKAGE TITLE ─────────────────────────────────────────
        doc.font('Helvetica-Bold').fontSize(22).fill(hexToRgb(C.white))
           .text(booking.package || 'Aanandham Mountain Camp', 40, y, { width: W - 80, align: 'center' });
        y += 34;

        doc.font('Helvetica').fontSize(11).fill(hexToRgb(C.muted))
           .text('Permit Reference', 0, y, { align: 'center' });
        y += 14;
        doc.font('Helvetica-Bold').fontSize(14).fill(hexToRgb(C.lime))
           .text(booking.id, 0, y, { align: 'center', characterSpacing: 2 });
        y += 28;

        // ── SEPARATOR ─────────────────────────────────────────────
        doc.moveTo(40, y).lineTo(W - 40, y).strokeColor(hexToRgb(C.border)).lineWidth(1).stroke();
        y += 18;

        // ── QR CODE SECTION ───────────────────────────────────────
        if (qrBuffer) {
            const qrSize = 160;
            const qrX = (W - qrSize) / 2;
            // QR card background
            doc.roundedRect(qrX - 16, y - 12, qrSize + 32, qrSize + 50, 16).fill(hexToRgb(C.forest));
            // Lime border
            doc.roundedRect(qrX - 16, y - 12, qrSize + 32, qrSize + 50, 16)
               .lineWidth(1.5).strokeColor(hexToRgb(C.lime)).fillOpacity(0).stroke();
            doc.fillOpacity(1);

            doc.font('Helvetica-Bold').fontSize(8).fill(hexToRgb(C.lime))
               .text('★  OFFICIAL WILDERNESS PASS QR  ★', 0, y - 6, { align: 'center', characterSpacing: 1.5 });

            try {
                doc.image(qrBuffer, qrX, y + 8, { width: qrSize, height: qrSize });
            } catch (e) { /* skip QR if error */ }

            doc.font('Helvetica-Bold').fontSize(9.5).fill(hexToRgb(C.lime))
               .text('MARSHAL CHECK-IN QR · SCAN TO VERIFY', 0, y + qrSize + 16, { align: 'center', characterSpacing: 1 });

            y += qrSize + 52;
        }

        y += 8;

        // ── GATE PIN BOX ──────────────────────────────────────────
        if (isConfirmed && booking.gatePin) {
            doc.roundedRect(80, y, W - 160, 62, 12).fill(hexToRgb(C.forest));
            doc.roundedRect(80, y, W - 160, 62, 12)
               .lineWidth(1.5).dash(4, { space: 3 }).strokeColor(hexToRgb(C.lime)).stroke();
            doc.undash();

            doc.font('Helvetica-Bold').fontSize(9).fill(hexToRgb(C.muted))
               .text('SMART GATE & KEYPAD PIN', 80, y + 10, { width: W - 160, align: 'center', characterSpacing: 1 });
            doc.font('Helvetica-Bold').fontSize(28).fill(hexToRgb(C.lime))
               .text(booking.gatePin, 80, y + 26, { width: W - 160, align: 'center', characterSpacing: 10 });

            y += 74;
        }

        y += 8;

        // ── DETAILS TABLE ─────────────────────────────────────────
        doc.roundedRect(40, y, W - 80, 190, 14).fill(hexToRgb(C.forest));
        y += 16;

        doc.font('Helvetica-Bold').fontSize(9.5).fill(hexToRgb(C.lime))
           .text('EXPEDITION DETAILS', 56, y, { characterSpacing: 1.5 });
        y += 18;

        const rows = [
            ['Lead Camper', booking.name || '—'],
            ['Stay Dates',  booking.dates || '—'],
            ['Lodging',     booking.roomType || 'Alpine Tent'],
            ['Campers',     `${booking.guests || 2} Persons`],
            ['Kitchen',     booking.mealSummary || `${booking.vegCount || 0} Veg + ${booking.nonVegCount || 0} Non-Veg BBQ`],
            ['Total Fare',  `\u20b9${Number(booking.total || 0).toLocaleString('en-IN')}`],
            ['Balance Due', `\u20b9${Number(booking.balanceDue || 0).toLocaleString('en-IN')}`]
        ];

        for (const [label, value] of rows) {
            doc.moveTo(56, y).lineTo(W - 56, y).strokeColor(hexToRgb(C.border)).lineWidth(0.5).stroke();
            doc.font('Helvetica').fontSize(10).fill(hexToRgb(C.muted)).text(label, 56, y + 6);
            doc.font('Helvetica-Bold').fontSize(10).fill(hexToRgb(C.white)).text(value, 240, y + 6, { width: W - 240 - 56 });
            y += 22;
        }

        y += 16;

        // ── SEPARATOR ─────────────────────────────────────────────
        doc.moveTo(40, y).lineTo(W - 40, y).strokeColor(hexToRgb(C.border)).lineWidth(1).stroke();
        y += 16;

        // ── 4x4 CONVOY NOTE ───────────────────────────────────────
        doc.roundedRect(40, y, W - 80, 60, 10).fill(hexToRgb(C.forest));
        doc.font('Helvetica-Bold').fontSize(9).fill(hexToRgb(C.amber))
           .text('4x4 CONVOY & BASECAMP ARRIVAL', 56, y + 10, { characterSpacing: 1 });
        doc.font('Helvetica').fontSize(9.5).fill(hexToRgb(C.muted))
           .text('Arrive at Suryanelli Hub by 1:30 PM for 4x4 convoy allocation. Safe parking available. Coordinate via WhatsApp 24/7.', 56, y + 24, { width: W - 112 });
        y += 70;

        // ── BOTTOM FOOTER ─────────────────────────────────────────
        doc.rect(0, H - 52, W, 52).fill(hexToRgb(C.forest));
        doc.moveTo(0, H - 52).lineTo(W, H - 52).strokeColor(hexToRgb(C.border)).lineWidth(1).stroke();

        doc.font('Helvetica-Bold').fontSize(10).fill(hexToRgb(C.white))
           .text('Aanandham.go Wilderness Stays', 0, H - 40, { align: 'center' });
        doc.font('Helvetica').fontSize(8.5).fill(hexToRgb(C.muted))
           .text('+91 90748 58014  ·  bookings@aanandham.in  ·  aanandham.in', 0, H - 26, { align: 'center' });

        // ── BOTTOM LIME ACCENT BAR ────────────────────────────────
        doc.rect(0, H - 6, W, 6).fill(hexToRgb(C.lime));

        doc.end();
    });
}
