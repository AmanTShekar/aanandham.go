import { Pool } from 'pg';

let pgPool = null;

function getPgPool() {
  if (pgPool) return pgPool;
  const connectionString = process.env.PMS_DATABASE_URL || process.env.DIRECT_URL;
  if (!connectionString) return null;

  // Clean url and set ssl
  const cleanUrl = connectionString.replace(/[?&]sslmode=[^&]+/g, '');
  pgPool = new Pool({
    connectionString: cleanUrl,
    ssl: { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  pgPool.on('error', (err) => {
    console.warn('[PMS DB Pool Warning]', err?.message);
  });

  return pgPool;
}

const monthMap = {
  jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
  jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
};

export function parseBatchDateInterval(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const trimmed = dateStr.trim();
  
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const next = new Date(new Date(`${trimmed}T00:00:00.000Z`).getTime() + 86400000).toISOString().slice(0, 10);
    return { checkInDate: trimmed, checkOutDate: next };
  }

  const mFull = trimmed.match(/([A-Za-z]+)\s+(\d{1,2}),?\s*(\d{4})?\s*[–—-]\s*([A-Za-z]+)?\s*(\d{1,2}),?\s*(\d{4})/);
  if (mFull) {
    const m1 = monthMap[mFull[1].slice(0, 3).toLowerCase()];
    const d1 = mFull[2].padStart(2, '0');
    const y1 = mFull[3] || mFull[6];
    const m2 = mFull[4] ? monthMap[mFull[4].slice(0, 3).toLowerCase()] : m1;
    const d2 = mFull[5].padStart(2, '0');
    const y2 = mFull[6];
    if (m1 && m2 && y1 && y2) {
      return {
        checkInDate: `${y1}-${m1}-${d1}`,
        checkOutDate: `${y2}-${m2}-${d2}`
      };
    }
  }

  const mShort = trimmed.match(/([A-Za-z]+)\s+(\d{1,2})\s*[–—-]\s*(\d{1,2}),?\s*(\d{4})/);
  if (mShort) {
    const m1 = monthMap[mShort[1].slice(0, 3).toLowerCase()];
    const d1 = mShort[2].padStart(2, '0');
    const d2 = mShort[3].padStart(2, '0');
    const y = mShort[4];
    if (m1 && y) {
      return {
        checkInDate: `${y}-${m1}-${d1}`,
        checkOutDate: `${y}-${m1}-${d2}`
      };
    }
  }

  return null;
}

const NON_OCCUPYING_STATUSES = new Set([
  'cancelled',
  'canceled',
  'refunded',
  'failed',
  'expired'
]);

function toIstDateString(isoOrDate) {
  if (!isoOrDate) return null;
  const d = new Date(isoOrDate);
  if (isNaN(d.getTime())) return null;
  // Convert UTC timestamp to IST Date string YYYY-MM-DD
  const istTime = new Date(d.getTime() + (5.5 * 60 * 60 * 1000));
  return istTime.toISOString().slice(0, 10);
}

export async function fetchLivePropertyBookings(propertyId) {
  const pool = getPgPool();
  if (!pool) return [];

  const cleanId = String(propertyId || '').trim();
  const cleanSlug = cleanId.toLowerCase().replace(/^pkg-/, '');

  try {
    const res = await pool.query(
      `SELECT b.id, b."propertyId", b."roomId", b."roomType", b."arrivalDate", b."departureDate", b."totalUnits", b.status
       FROM "Booking" b
       WHERE (b."propertyId" = $1 OR b."propertyId" = $2 OR b."propertyId" = $3)
         AND LOWER(TRIM(b.status)) NOT IN ('cancelled', 'canceled', 'refunded', 'failed', 'expired')`,
      [cleanId, `pkg-${cleanSlug}`, cleanSlug]
    );
    return res.rows;
  } catch (err) {
    console.error('[fetchLivePropertyBookings error]', err?.message);
    return [];
  }
}

export async function computeLiveAvailability({ propertyId, rooms = [], dateStr }) {
  const interval = parseBatchDateInterval(dateStr) || {
    checkInDate: new Date().toISOString().slice(0, 10),
    checkOutDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10)
  };

  const bookings = await fetchLivePropertyBookings(propertyId);
  const { checkInDate, checkOutDate } = interval;

  const roomMap = {};

  for (const room of rooms) {
    const totalUnits = Math.max(0, Math.floor(Number(room.totalUnits) || 1));
    const matchingBookings = bookings.filter((b) => {
      const bIn = toIstDateString(b.arrivalDate);
      const bOut = toIstDateString(b.departureDate);
      if (!bIn || !bOut) return false;

      // Overlap check: bIn < checkOutDate && checkInDate < bOut
      if (!(bIn < checkOutDate && checkInDate < bOut)) return false;

      if (b.roomId && String(b.roomId).trim() === String(room.id).trim()) return true;
      const bName = String(b.roomType || '').toLowerCase().trim();
      const rName = String(room.name || '').toLowerCase().trim();
      return bName === rName;
    });

    let bookedUnits = 0;
    for (const b of matchingBookings) {
      bookedUnits += Math.max(1, Number(b.totalUnits) || 1);
    }

    const availableUnits = Math.max(0, totalUnits - bookedUnits);

    roomMap[room.id] = {
      id: room.id,
      name: room.name,
      totalUnits,
      bookedUnits,
      availableUnits,
      isAvailable: availableUnits > 0
    };
  }

  return {
    propertyId,
    interval,
    rooms: roomMap
  };
}
