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

export async function fetchLivePropertyRooms(propertyId) {
  const pool = getPgPool();
  if (!pool) return [];

  const cleanId = String(propertyId || '').trim();
  const cleanSlug = cleanId.toLowerCase().replace(/^pkg-/, '');

  try {
    const res = await pool.query(
      `SELECT rt.id, rt.name, rt.capacity, rt."totalUnits", rt."basePrice", rt."weekendPrice",
              rt.description, rt.features, rt."inventoryType", rt."bedConfig", rt."roomSizeSqFt",
              rt."bathroomType", rt."pricingModel", rt.summary, rt.images
       FROM "RoomType" rt
       JOIN "Property" p ON p.id = rt."propertyId"
       WHERE (p.id = $1 OR p.id = $2 OR p.id = $3 OR p.slug = $1 OR p.slug = $3)
       ORDER BY rt."basePrice" ASC`,
      [cleanId, `pkg-${cleanSlug}`, cleanSlug]
    );
    return res.rows.map(r => ({
      id: r.id,
      name: r.name,
      capacity: r.capacity ? `${r.capacity} Persons` : '2 Guests',
      guestCapacity: r.capacity || 2,
      totalUnits: Number(r.totalUnits) || 1,
      price: Number(r.basePrice || 0),
      basePrice: Number(r.basePrice || 0),
      weekendPrice: r.weekendPrice ? Number(r.weekendPrice) : null,
      description: r.description || r.summary || '',
      features: Array.isArray(r.features) ? r.features : (typeof r.features === 'string' ? r.features.split(',').map(s => s.trim()).filter(Boolean) : []),
      inventoryType: r.inventoryType || 'PRIVATE_UNIT',
      bedConfig: r.bedConfig || '1 King Bed',
      roomSizeSqFt: r.roomSizeSqFt || 350,
      bathroomType: r.bathroomType || 'Ensuite Private Bathroom',
      pricingModel: r.pricingModel || (r.inventoryType === 'DORM_BED' ? 'PER_BED' : 'PER_ROOM'),
      images: Array.isArray(r.images) ? r.images : []
    }));
  } catch (err) {
    console.error('[fetchLivePropertyRooms error]', err?.message);
    return [];
  }
}

export async function fetchLivePropertyDetails(propertyId) {
  const pool = getPgPool();
  if (!pool) return null;

  const cleanId = String(propertyId || '').trim();
  const cleanSlug = cleanId.toLowerCase().replace(/^pkg-/, '');

  try {
    const res = await pool.query(
      `SELECT id, title, slug, category, region, location, altitude, "basePrice", rating,
              image, gallery, description, inclusions, exclusions, amenities,
              "checkInTime", "checkOutTime", "cancellationPolicy", "isActive",
              latitude, longitude, phone
       FROM "Property"
       WHERE (id = $1 OR id = $2 OR id = $3 OR slug = $1 OR slug = $3)
       LIMIT 1`,
      [cleanId, `pkg-${cleanSlug}`, cleanSlug]
    );
    return res.rows[0] || null;
  } catch (err) {
    console.error('[fetchLivePropertyDetails error]', err?.message);
    return null;
  }
}

export async function computeLiveMonthCalendar({ propertyId, rooms = [], yearMonth }) {
  const now = new Date();
  const [yStr, mStr] = String(yearMonth || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`).split('-');
  const year = parseInt(yStr, 10) || now.getFullYear();
  const month = parseInt(mStr, 10) || (now.getMonth() + 1);

  let effectiveRooms = rooms && rooms.length > 0 ? rooms : await fetchLivePropertyRooms(propertyId);
  const totalCapacity = (effectiveRooms || []).reduce((sum, r) => {
    return sum + Math.max(1, Number(r.totalUnits) || 1);
  }, 0) || 15;

  const bookings = await fetchLivePropertyBookings(propertyId);
  const daysInMonth = new Date(year, month, 0).getDate();
  const calendarMap = {};

  for (let day = 1; day <= daysInMonth; day++) {
    const dStr = String(day).padStart(2, '0');
    const mPad = String(month).padStart(2, '0');
    const dateIso = `${year}-${mPad}-${dStr}`;
    const nextDateIso = new Date(new Date(`${dateIso}T00:00:00.000Z`).getTime() + 86400000).toISOString().slice(0, 10);

    const activeOnDate = bookings.filter((b) => {
      const bIn = toIstDateString(b.arrivalDate);
      const bOut = toIstDateString(b.departureDate);
      if (!bIn || !bOut) return false;
      return bIn < nextDateIso && dateIso < bOut;
    });

    let bookedUnits = 0;
    for (const b of activeOnDate) {
      bookedUnits += Math.max(1, Number(b.totalUnits) || 1);
    }

    const remaining = Math.max(0, totalCapacity - bookedUnits);
    let status = 'available';
    let dotColor = '#22C55E';
    let badgeText = `${remaining} Units Left · Available`;

    if (remaining === 0) {
      status = 'sold_out';
      dotColor = '#EF4444';
      badgeText = 'Sold Out';
    } else if (remaining <= 2) {
      status = 'limited';
      dotColor = '#EF4444';
      badgeText = `Only ${remaining} Left · Almost Full!`;
    } else if (remaining <= 5) {
      status = 'filling_fast';
      dotColor = '#E5A93B';
      badgeText = `${remaining} Left · Filling Fast`;
    }

    calendarMap[dateIso] = {
      date: dateIso,
      remaining,
      totalCapacity,
      bookedUnits,
      status,
      dotColor,
      badgeText
    };
  }

  return {
    propertyId,
    yearMonth: `${year}-${String(month).padStart(2, '0')}`,
    totalCapacity,
    dates: calendarMap
  };
}

export async function computeLiveAvailability({ propertyId, rooms = [], dateStr }) {
  const interval = parseBatchDateInterval(dateStr) || {
    checkInDate: new Date().toISOString().slice(0, 10),
    checkOutDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10)
  };

  let effectiveRooms = rooms && rooms.length > 0 ? rooms : await fetchLivePropertyRooms(propertyId);
  const bookings = await fetchLivePropertyBookings(propertyId);
  const { checkInDate, checkOutDate } = interval;

  const roomMap = {};

  for (const room of effectiveRooms) {
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
      isAvailable: availableUnits > 0,
      price: room.price || room.basePrice,
      pricingModel: room.pricingModel,
      inventoryType: room.inventoryType,
      bedConfig: room.bedConfig,
      bathroomType: room.bathroomType
    };
  }

  return {
    propertyId,
    interval,
    rooms: roomMap
  };
}
