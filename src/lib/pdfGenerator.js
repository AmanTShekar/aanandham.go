import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const LOGO_PATH = path.resolve(__dir, '../../public/logo.png');

// ── Brand Palette ────────────────────────────────────────────
const DARK   = [11, 21, 14];       // #0B150E
const FOREST = [18, 31, 21];       // #121F15
const CARD   = [22, 38, 26];       // #162619
const LIME   = [213, 237, 85];     // #D5ED55
const AMBER  = [229, 169, 59];     // #E5A93B
const MUTED  = [162, 182, 166];    // #A2B6A6
const WHITE  = [255, 255, 255];
const BORDER = [42, 62, 46];       // #2A3E2E
const GREEN  = [34, 197, 94];      // #22C55E

// ── Compact Custom Page Size (like an airline boarding pass) ──
const W = 595;   // A4 width
const H = 720;   // Compact height — not full A4

/**
 * Generates a compact, premium Aanandham Wilderness Pass PDF.
 * Single-page, boarding-pass style — clean and minimal.
 */
export async function generateBookingPassPdf(booking, qrBuffer) {
    return new Promise((resolve, reject) => {
        const chunks = [];

        const doc = new PDFDocument({
            size: [W, H],
            margins: { top: 0, bottom: 0, left: 0, right: 0 },
            info: {
                Title: `Aanandham Wilderness Pass — ${booking.id}`,
                Author: 'Aanandham.go',
                Subject: `Booking Pass · ${booking.name || 'Guest'}`,
            }
        });

        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        const isConfirmed = ['confirmed', 'Confirmed'].includes(booking.status);

        // ── BACKGROUND ───────────────────────────────────────────
        doc.rect(0, 0, W, H).fill(DARK);

        // ── TOP LIME BAR ─────────────────────────────────────────
        doc.rect(0, 0, W, 5).fill(LIME);

        // ── HEADER SECTION ───────────────────────────────────────
        const HDR_H = 110;
        doc.rect(0, 5, W, HDR_H).fill(FOREST);

        // Logo
        if (fs.existsSync(LOGO_PATH)) {
            try { doc.image(LOGO_PATH, 28, 18, { width: 50, height: 50 }); } catch (_) {}
        }

        // Brand name + tagline
        doc.font('Helvetica-Bold').fontSize(17).fill(WHITE)
           .text('Aanandham', 88, 22, { continued: true })
           .fill(LIME).text('.go')
           .font('Helvetica').fontSize(9.5).fill(MUTED)
           .text('Wilderness Stays · Suryanelli, Munnar, Kerala', 88, 44);

        // Status badge (right side)
        const badgeX = W - 168;
        const badgeColor = isConfirmed ? LIME : AMBER;
        const badgeLabel = isConfirmed ? '✓  CONFIRMED' : '⏳  PENDING';
        doc.roundedRect(badgeX, 20, 140, 22, 11).fill(badgeColor);
        doc.font('Helvetica-Bold').fontSize(9).fill(DARK)
           .text(badgeLabel, badgeX, 27, { width: 140, align: 'center' });

        // Package title
        doc.font('Helvetica-Bold').fontSize(14).fill(WHITE)
           .text(booking.package || 'Aanandham Mountain Camp', 28, 72, { width: W - 56 });

        // Reference
        doc.font('Helvetica').fontSize(9).fill(MUTED)
           .text('Permit Ref: ', 28, 92, { continued: true })
           .font('Helvetica-Bold').fill(LIME)
           .text(booking.id, { characterSpacing: 1 });

        // ── SEPARATOR DOTS ───────────────────────────────────────
        const sepY = 5 + HDR_H;
        doc.rect(0, sepY, W, 1).fill(BORDER);
        // Tear-line dashes
        doc.save().dash(4, { space: 5 }).moveTo(0, sepY).lineTo(W, sepY)
           .strokeColor(LIME).lineWidth(0.5).stroke().restore();

        // ── MAIN BODY: Two columns ────────────────────────────────
        const BODY_Y = sepY + 16;
        const COL1_X = 28;
        const COL2_X = W / 2 + 10;
        const COL_W  = W / 2 - 38;

        // LEFT COLUMN — Details table
        const details = [
            ['Lead Camper',  booking.name      || '—'],
            ['Stay Dates',   booking.dates     || '—'],
            ['Lodging',      booking.roomType  || 'Alpine Tent'],
            ['Squad Size',   `${booking.guests || 2} Persons`],
            ['Kitchen',      booking.mealSummary || `${booking.vegCount || 0}V + ${booking.nonVegCount || 0}NV BBQ`],
            ['Balance Due',  `\u20b9${Number(booking.balanceDue || 0).toLocaleString('en-IN')}`],
        ];

        let rowY = BODY_Y;
        doc.font('Helvetica-Bold').fontSize(8).fill(LIME)
           .text('EXPEDITION DETAILS', COL1_X, rowY, { characterSpacing: 1 });
        rowY += 14;

        for (const [label, value] of details) {
            doc.roundedRect(COL1_X, rowY, COL_W, 26, 5).fill(CARD);
            doc.font('Helvetica').fontSize(8).fill(MUTED)
               .text(label, COL1_X + 8, rowY + 5);
            doc.font('Helvetica-Bold').fontSize(9.5).fill(WHITE)
               .text(value, COL1_X + 8, rowY + 14, { width: COL_W - 16 });
            rowY += 30;
        }

        // ── RIGHT COLUMN — QR + Gate PIN ─────────────────────────
        let rightY = BODY_Y;

        // QR Code Card
        const QR_SIZE = 130;
        const QR_X = COL2_X + (COL_W - QR_SIZE) / 2;
        doc.font('Helvetica-Bold').fontSize(8).fill(LIME)
           .text('MARSHAL CHECK-IN QR', COL2_X, rightY, { width: COL_W, align: 'center', characterSpacing: 1 });
        rightY += 14;

        doc.roundedRect(QR_X - 8, rightY - 6, QR_SIZE + 16, QR_SIZE + 16, 10).fill(FOREST);
        doc.roundedRect(QR_X - 8, rightY - 6, QR_SIZE + 16, QR_SIZE + 16, 10)
           .lineWidth(1).strokeColor(LIME).fillOpacity(0).stroke().fillOpacity(1);

        if (qrBuffer) {
            try { doc.image(qrBuffer, QR_X, rightY, { width: QR_SIZE, height: QR_SIZE }); } catch (_) {}
        }
        rightY += QR_SIZE + 18;

        // Gate PIN
        if (isConfirmed && booking.gatePin) {
            doc.font('Helvetica-Bold').fontSize(8).fill(MUTED)
               .text('SMART GATE PIN', COL2_X, rightY, { width: COL_W, align: 'center', characterSpacing: 1 });
            rightY += 12;
            doc.roundedRect(COL2_X, rightY, COL_W, 36, 8).fill(CARD);
            doc.roundedRect(COL2_X, rightY, COL_W, 36, 8)
               .lineWidth(1).dash(3, { space: 3 }).strokeColor(LIME).fillOpacity(0).stroke().fillOpacity(1).undash();
            doc.font('Helvetica-Bold').fontSize(24).fill(LIME)
               .text(booking.gatePin, COL2_X, rightY + 8, { width: COL_W, align: 'center', characterSpacing: 8 });
            rightY += 46;
        }

        // ── CONVOY NOTE — full width ──────────────────────────────
        const convoyY = Math.max(rowY, rightY) + 14;
        doc.rect(0, convoyY - 10, W, 1).fill(BORDER);
        doc.roundedRect(28, convoyY + 4, W - 56, 44, 8).fill(CARD);
        doc.font('Helvetica-Bold').fontSize(8).fill(AMBER)
           .text('4x4 CONVOY & ARRIVAL', 42, convoyY + 10, { characterSpacing: 1 });
        doc.font('Helvetica').fontSize(9).fill(MUTED)
           .text(
               'Arrive at Suryanelli Hub by 1:30 PM · Smart parking available · 24/7 WhatsApp: +91 90748 58014',
               42, convoyY + 22, { width: W - 84 }
           );

        // ── PAYMENT STATUS BAR ────────────────────────────────────
        const balY = convoyY + 56;
        const balDue = Number(booking.balanceDue || 0);
        const balColor = balDue > 0 ? AMBER : GREEN;
        const balText  = balDue > 0
            ? `\u20b9${balDue.toLocaleString('en-IN')} Due on Arrival`
            : '100% Paid Online · No Balance Due';
        doc.roundedRect(28, balY, W - 56, 28, 7)
           .fill(balDue > 0 ? [40, 30, 10] : [10, 35, 20]);
        doc.font('Helvetica-Bold').fontSize(10).fill(balColor)
           .text(balText, 28, balY + 9, { width: W - 56, align: 'center' });

        // ── FOOTER ────────────────────────────────────────────────
        const footY = H - 42;
        doc.rect(0, footY, W, 42).fill(FOREST);
        doc.rect(0, footY, W, 1).fill(BORDER);

        doc.font('Helvetica-Bold').fontSize(9.5).fill(WHITE)
           .text('Aanandham.go Wilderness Stays', 0, footY + 8, { align: 'center' });
        doc.font('Helvetica').fontSize(8).fill(MUTED)
           .text('+91 90748 58014  ·  bookings@aanandham.in  ·  aanandham.in', 0, footY + 22, { align: 'center' });

        // ── BOTTOM LIME BAR ───────────────────────────────────────
        doc.rect(0, H - 5, W, 5).fill(LIME);

        doc.end();
    });
}
