// ── SERVER-SIDE PRICE AUTHORITY ──
// The server recomputes booking totals from the camps catalog so a client can
// never underpay by sending a forged `total` field. Mirrors the client pricing
// formula exactly (squad discount, children rate, per-person add-ons).
import { getAllCamps } from './campsData.js';
import { applyDiscounts } from './discountsCore.js';

// Canonical add-on catalog (id, price, perPerson) — matches the public booking engine
export const ADDON_CATALOG = {
    bbq: { id: 'bbq', name: 'Campfire Live Barbecue Platter', price: 450, perPerson: true },
    jeep: { id: 'jeep', name: 'Private 4x4 Off-Road Jeep Upgrade', price: 1200, perPerson: false },
    drone: { id: 'drone', name: '4K Drone Mountain Video Reel Shoot', price: 1500, perPerson: false },
    yoga: { id: 'yoga', name: 'Sunrise Mountain Yoga & Pranayama', price: 250, perPerson: true },
    guitar: { id: 'guitar', name: 'Acoustic Guitarist for Campfire Circle', price: 2000, perPerson: false },
    'ad-lunch-veg': { id: 'ad-lunch-veg', name: 'Optional Lunch (Vegetarian Meal)', price: 120, perPerson: true },
    'ad-lunch-nonveg': { id: 'ad-lunch-nonveg', name: 'Optional Lunch (Non-Vegetarian Meal)', price: 170, perPerson: true },
    'ad-live-bbq': { id: 'ad-live-bbq', name: 'Live BBQ (Per Piece / Portion)', price: 200, perPerson: false },
    'ad-forest-walk': { id: 'ad-forest-walk', name: 'Shola National Park Forest Walk', price: 300, perPerson: true },
    'ad-campfire-extra': { id: 'ad-campfire-extra', name: 'Extra Campfire Hour Duration', price: 500, perPerson: false }
};

export function parseRoomCapacity(capacity) {
    const m = String(capacity || '').match(/\d+/);
    return m ? parseInt(m[0], 10) : 4;
}

export function findCampAndRoom(campsiteId, roomId) {
    const camps = getAllCamps();
    const camp = camps.find(c => c.id === campsiteId || c.id?.toLowerCase() === String(campsiteId).toLowerCase()) || null;
    if (!camp) return { camp: null, room: null };
    const roomClean = String(roomId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const room = (camp.rooms || []).find(r => 
        r.id === roomId || 
        r.name === roomId || 
        r.name.toLowerCase().replace(/[^a-z0-9]/g, '') === roomClean ||
        r.id.toLowerCase().replace(/[^a-z0-9]/g, '') === roomClean
    ) || (camp.rooms && camp.rooms[0]) || null;
    return { camp, room };
}

// Recompute the exact total the customer must pay (in rupees)
// Squad-off and all other campaigns are applied from the admin-managed discount store.
export function computeBookingTotal({ camp, room, adults, children, addonIds = [], discounts = null }) {
    const pricePerPerson = room?.price || camp?.price || 2499;
    const totalGuests = adults + children;

    const baseTotal = (pricePerPerson * adults) + (Math.round(pricePerPerson * 0.5) * children);
    const discount = applyDiscounts({ baseTotal, guests: totalGuests, campsiteId: camp?.id || null, discounts });
    const discounted = discount.discountedTotal;

    const addonTotal = addonIds.reduce((sum, id) => {
        const addon = ADDON_CATALOG[id];
        if (!addon) return sum;
        return sum + (addon.perPerson ? addon.price * totalGuests : addon.price);
    }, 0);

    return {
        total: discounted + addonTotal,
        discountPercent: discount.discountPercent,
        discountAmount: discount.discountAmount,
        discountLabel: discount.discountLabel,
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