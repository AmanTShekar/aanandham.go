// ── SERVER-SIDE PRICE AUTHORITY ──
// The server recomputes booking totals from the camps catalog so a client can
// never underpay by sending a forged `total` field. Mirrors the client pricing
// formula exactly (squad discount, children rate, per-person add-ons).
import { getAllCamps } from '@/lib/campsData';

// Canonical add-on catalog (id, price, perPerson) — matches the public booking engine
const ADDON_CATALOG = {
    bbq: { price: 450, perPerson: true },
    jeep: { price: 1200, perPerson: false },
    drone: { price: 1500, perPerson: false },
    yoga: { price: 250, perPerson: true },
    guitar: { price: 2000, perPerson: false }
};

export function parseRoomCapacity(capacity) {
    const m = String(capacity || '').match(/\d+/);
    return m ? parseInt(m[0], 10) : 4;
}

export function findCampAndRoom(campsiteId, roomId) {
    const camps = getAllCamps();
    const camp = camps.find(c => c.id === campsiteId) || null;
    if (!camp) return { camp: null, room: null };
    const room = camp.rooms.find(r => r.id === roomId || r.name === roomId) || null;
    return { camp, room };
}

// Recompute the exact total the customer must pay (in rupees)
export function computeBookingTotal({ camp, room, adults, children, addonIds = [] }) {
    const pricePerPerson = room?.price || camp?.price || 2499;
    const totalGuests = adults + children;

    const baseTotal = (pricePerPerson * adults) + (Math.round(pricePerPerson * 0.5) * children);
    const discountPercent = totalGuests >= 8 ? 15 : totalGuests >= 4 ? 10 : 0;
    const discounted = Math.round(baseTotal * (1 - discountPercent / 100));

    const addonTotal = addonIds.reduce((sum, id) => {
        const addon = ADDON_CATALOG[id];
        if (!addon) return sum;
        return sum + (addon.perPerson ? addon.price * totalGuests : addon.price);
    }, 0);

    return {
        total: discounted + addonTotal,
        discountPercent,
        baseTotal,
        pricePerPerson
    };
}

// Total guest capacity across all rooms of a camp (per date batch)
export function campGuestCapacity(camp) {
    if (!camp || !Array.isArray(camp.rooms) || camp.rooms.length === 0) return 40;
    return camp.rooms.reduce((sum, room) => {
        const units = Number(room.totalUnits) > 0 ? Number(room.totalUnits) : 1;
        return sum + (parseRoomCapacity(room.capacity) * units);
    }, 0);
}