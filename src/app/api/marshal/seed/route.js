import { NextResponse } from 'next/server';
import { addServerBooking, getStoredBookings, saveStoredBookings } from '@/lib/serverBookingStore.js';

export async function POST() {
    try {
        const sampleCampers = [
            {
                name: 'Aarav Sharma',
                email: 'aman.tshekar@gmail.com',
                phone: '+91 90748 58014',
                package: 'Kolukkumalai Sunrise Ridge Glamp (7,900 FT)',
                campsiteId: 'pkg-kolukkumalai',
                region: 'Munnar',
                dates: 'This Weekend (2D / 1N)',
                roomType: 'Geodesic Luxury Dome Pod',
                guests: 4,
                vegCount: 2,
                nonVegCount: 2,
                total: 9996,
                advancePaid: 2998,
                balanceDue: 6998,
                isBalancePaid: false,
                status: 'Confirmed',
                convoyTime: '02:30 PM Suryanelli 4x4 Convoy',
                notes: 'Requested sunrise viewing deck and warm fleece blankets.',
                attendanceRoster: [
                    { id: 1, name: 'Aarav Sharma (Lead)', present: true },
                    { id: 2, name: 'Pooja Sharma', present: true },
                    { id: 3, name: 'Kavya Sharma', present: true },
                    { id: 4, name: 'Aryan Sharma', present: true }
                ]
            },
            {
                name: 'Rohan Mehta & Squad',
                email: 'linoharidas@gmail.com',
                phone: '+91 98471 23456',
                package: 'Meesapulimala High Altitude Alpine Camp (8,600 FT)',
                campsiteId: 'pkg-meesapulimala',
                region: 'Munnar',
                dates: 'This Weekend (2D / 1N)',
                roomType: 'Weatherproof Alpine Quad Tents',
                guests: 6,
                vegCount: 2,
                nonVegCount: 4,
                total: 11994,
                advancePaid: 3598,
                balanceDue: 8396,
                isBalancePaid: false,
                status: 'Confirmed',
                convoyTime: '03:15 PM Trek Base Departure',
                notes: '6 members squad with acoustic guitars and warm clothing.',
                attendanceRoster: [
                    { id: 1, name: 'Rohan Mehta (Lead)', present: true, status: 'present', mealType: 'Veg' },
                    { id: 2, name: 'Rahul Joshi', present: true, status: 'present', mealType: 'Veg' },
                    { id: 3, name: 'Varun Nair', present: true, status: 'present', mealType: 'Non-Veg' },
                    { id: 4, name: 'Siddharth Roy', present: true, status: 'present', mealType: 'Non-Veg' },
                    { id: 5, name: 'Nikhil Menon', present: true, status: 'present', mealType: 'Non-Veg' },
                    { id: 6, name: 'Aditya Pillai', present: true, status: 'present', mealType: 'Non-Veg' }
                ]
            },
            {
                name: 'Ananya Iyer & Partner',
                email: 'vismayaanilkumar1101@gmail.com',
                phone: '+91 94470 88990',
                package: 'Suryanelli Tea Valley Cloud Camp',
                campsiteId: 'pkg-suryanelli',
                region: 'Munnar',
                dates: 'This Weekend (2D / 1N)',
                roomType: 'Cliffside Wooden Cottage Pod',
                guests: 2,
                vegCount: 2,
                nonVegCount: 0,
                total: 6998,
                advancePaid: 2099,
                balanceDue: 4899,
                isBalancePaid: false,
                status: 'Confirmed',
                convoyTime: '01:30 PM Early Batch',
                notes: 'Couple stay, pure vegetarian BBQ requested. Pod #2 pre-assigned.',
                attendanceRoster: [
                    { id: 1, name: 'Ananya Iyer (Lead)', present: true, status: 'present', mealType: 'Veg' },
                    { id: 2, name: 'Gautam Ram', present: true, status: 'present', mealType: 'Veg' }
                ]
            },
            {
                name: 'Vikram Sundaram & Friends',
                email: 'aman.tshekar@gmail.com',
                phone: '+91 97455 11223',
                package: 'Vagamon Pine Forest Eco Retreat',
                campsiteId: 'pkg-vagamon-pine',
                region: 'Vagamon',
                dates: 'This Weekend (2D / 1N)',
                roomType: 'Pine Canopy Safari Tent',
                guests: 3,
                vegCount: 1,
                nonVegCount: 2,
                total: 5997,
                advancePaid: 1799,
                balanceDue: 4198,
                isBalancePaid: false,
                status: 'Confirmed',
                convoyTime: '02:00 PM Vagamon Base Entry',
                notes: 'Need campfire acoustic guitar setup.',
                attendanceRoster: [
                    { id: 1, name: 'Vikram Sundaram (Lead)', present: true },
                    { id: 2, name: 'Sanjay Kumar', present: true },
                    { id: 3, name: 'Deepak Varma', present: true }
                ]
            }
        ];

        const existingBookings = await getStoredBookings();
        const created = [];

        for (const sample of sampleCampers) {
            const bookingId = `BK-SIM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
            const fullRecord = {
                id: bookingId,
                ...sample,
                source: 'Simulation Generator',
                createdAt: new Date().toISOString()
            };
            await addServerBooking(fullRecord);
            created.push(fullRecord);
        }

        return NextResponse.json({
            success: true,
            message: `Generated ${created.length} realistic simulation reservations!`,
            count: created.length
        });
    } catch (e) {
        console.error('Error seeding demo campers:', e);
        return NextResponse.json({ success: false, message: 'Failed to seed sample campers' }, { status: 500 });
    }
}
