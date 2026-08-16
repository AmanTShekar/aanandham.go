import { NextResponse } from 'next/server';
import { INITIAL_ALL_CAMPS } from '@/lib/campsData';

// ── SMART LOCAL KNOWLEDGE BASE (0 API CALLS / ₹0 COST / 0ms LATENCY) ──
function getSmartLocalResponse(query) {
    const q = query.toLowerCase().trim();

    // 1. Campsite recommendation queries
    if (q.includes('sunrise') || q.includes('cloud') || q.includes('highest') || q.includes('kolukkumalai')) {
        return {
            text: "🌄 **Kolukkumalai Sunrise 4x4 Expedition** is our signature sanctuary!\n\nPerched at **7,900 FT**, it is the world's highest organic tea estate. You wake up directly above rolling cloud beds, followed by a guided sunrise ridge trek to Tiger Rock.\n\n• **Price:** Starts at ₹2,499/camper\n• **Stay:** Geodesic Sky Domes & Alpine Ridge Tents\n• **Inclusions:** 4x4 Jeep convoy, campfire BBQ buffet, and certified mountain marshals.",
            suggestedCampId: 'pkg-kolukkumalai',
            quickActions: [
                { label: 'Book Kolukkumalai ↗', action: 'OPEN_BOOKING', campId: 'pkg-kolukkumalai' },
                { label: 'View Details', action: 'VIEW_CAMP', campId: 'pkg-kolukkumalai' }
            ]
        };
    }

    if (q.includes('family') || q.includes('safe') || q.includes('women') || q.includes('kid') || q.includes('children') || q.includes('couple')) {
        return {
            text: "🛡️ **100% Verified Safe Wilderness Grounds**\n\nAll our Kerala campsites feature:\n• Gated private perimeters with 24/7 marshals\n• En-suite and modern western washrooms with running hot water\n• Geodesic Luxury Dome Pods for privacy\n• Zero-tolerance safety protocols with dedicated female coordinators.",
            suggestedCampId: 'pkg-suryanelli',
            quickActions: [
                { label: 'Explore Dome Pods', action: 'OPEN_BOOKING', campId: 'pkg-suryanelli' },
                { label: 'WhatsApp Coordinator', action: 'WHATSAPP' }
            ]
        };
    }

    if (q.includes('price') || q.includes('cost') || q.includes('rate') || q.includes('fare') || q.includes('how much') || q.includes('discount')) {
        return {
            text: "💰 **Transparent Pricing & Squad Discounts**:\n\n• **Alpine Weatherproof Tents:** ₹1,299 – ₹1,899 / person\n• **Geodesic Panoramic Sky Domes:** ₹2,499 – ₹3,499 / person\n• **Kids (5–11 yrs):** 50% off standard rate\n\n🎉 **Squad Group Discounts:**\n• **4+ Campers:** 10% Squad Discount\n• **8+ Campers:** 15% Tribe Discount\n\nAll fares include guided treks, campfire BBQ buffet, permits, and hot washroom facilities with **0% processing fees via direct UPI**.",
            quickActions: [
                { label: 'Check Live Rates', action: 'OPEN_BOOKING' },
                { label: 'Chat on WhatsApp', action: 'WHATSAPP' }
            ]
        };
    }

    if (q.includes('payment') || q.includes('upi') || q.includes('gpay') || q.includes('phonepe') || q.includes('pay') || q.includes('advance')) {
        return {
            text: "💳 **0% Processing Fee Payment Procedure**:\n\n1. Select your campsite, batch date & squad size.\n2. Choose **30% Advance Deposit** (to lock permits) or **100% Full Payment**.\n3. Scan our **Dynamic UPI QR Code** or tap 1-Click **Google Pay / PhonePe / Paytm** on mobile.\n4. Receive your official **Verified Digital Boarding Pass** with GPS map coordinates and immediate WhatsApp host sync.",
            quickActions: [
                { label: 'Reserve Spot Now', action: 'OPEN_BOOKING' }
            ]
        };
    }

    if (q.includes('pack') || q.includes('bring') || q.includes('clothing') || q.includes('temperature') || q.includes('cold')) {
        return {
            text: "🎒 **Essential Wilderness Packing Checklist**:\n\n• **Clothing:** Warm jacket / fleece (night temperatures drop to 10°C–14°C at high altitudes)\n• **Footwear:** Sturdy trekking shoes or sneakers with grip\n• **Gear:** Power bank, personal water bottle, flashlight/torch\n• **Toiletries:** Personal items and quick-dry towel\n\n*Note: High-density thermal sleeping bags, mattresses, pillows, and blankets are fully provided at the campsite!*",
            quickActions: [
                { label: 'Book Campsite', action: 'OPEN_BOOKING' }
            ]
        };
    }

    if (q.includes('food') || q.includes('bbq') || q.includes('barbecue') || q.includes('dinner') || q.includes('veg') || q.includes('meal')) {
        return {
            text: "🔥 **Campfire Gastronomy & Dining**:\n\n• **Evening:** Smoking hot live barbecue skewers (marinated chicken / spiced paneer) by the campfire.\n• **Dinner:** Authentic Kerala buffet (Rice, Chicken curry, Veg dishes, Chapatis, Dal, Salad).\n• **Morning:** Fresh hot Kerala breakfast (Idli/Dosa/Puttu, Sambar, Chutney, Tea/Coffee).\n\n*Pure vegetarian and Jain meal preparations are readily accommodated on request!*",
            quickActions: [
                { label: 'Add Live BBQ to Booking', action: 'OPEN_BOOKING' }
            ]
        };
    }

    // Default Fallback
    return {
        text: "🌲 **Welcome to Aanandham.go Wilderness Concierge!**\n\nI can help you:\n• Pick the best campsite (Sunrise views at Kolukkumalai, pine glamping at Vagamon, or rain canopy in Wayanad)\n• Calculate squad discounts and stay unit allocations\n• Guide you through 0-fee instant UPI bookings and packing guidelines.\n\nWhat kind of mountain experience are you looking for?",
        quickActions: [
            { label: '🌅 Sunrise Clouds (Kolukkumalai)', action: 'OPEN_BOOKING', campId: 'pkg-kolukkumalai' },
            { label: '🏕️ View All 11+ Camps', action: 'OPEN_BOOKING' },
            { label: '💬 WhatsApp Host', action: 'WHATSAPP' }
        ]
    };
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { message, conversationHistory = [] } = body;

        if (!message || typeof message !== 'string') {
            return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY;

        // If Gemini API Key is available in .env.local, use Google Gemini AI
        if (apiKey && process.env.GEMINI_API_KEY) {
            try {
                const promptContext = `You are "Aanandham Forest Concierge", an expert mountain camping assistant for Aanandham.go in Kerala, Western Ghats.
You know all details about:
- Kolukkumalai (7,900 FT, Munnar, world's highest tea estate, sunrise cloud bed, 4x4 Jeep convoys) - ₹2,499/pax
- Suryanelli Valley Ridge (Geodesic panoramic sky domes, sunset vistas) - ₹2,299/pax
- Vagamon Pine Glamping (Mist meadows, pine forest) - ₹1,699/pax
- Wayanad Rain Canopy (Deep forest treehouse & canopy trails) - ₹1,899/pax
- Squad discounts: 10% for 4+ campers, 15% for 8+ campers.
- Inclusions: Clean western washrooms, hot water, campfire live BBQ buffet, sleeping bags, mountain marshals.
- Payment: 100% free direct UPI with 30% advance permit lock or 100% full payment.

Respond in a warm, enthusiastic, concise, well-formatted markdown response with bullet points and emojis. Recommend specific campsites and offer instant booking assist.`;

                const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [
                            { role: 'user', parts: [{ text: `${promptContext}\n\nUser asked: "${message}"` }] }
                        ]
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    const aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (aiReply) {
                        return NextResponse.json({
                            success: true,
                            reply: aiReply,
                            source: 'gemini',
                            quickActions: [
                                { label: 'Reserve Campsite ↗', action: 'OPEN_BOOKING' },
                                { label: 'Connect on WhatsApp ↗', action: 'WHATSAPP' }
                            ]
                        });
                    }
                }
            } catch (geminiError) {
                console.error('Gemini API notice (falling back to smart local knowledge engine):', geminiError);
            }
        }

        // Fast & Reliable Smart Local NLP Knowledge Engine (0ms, 100% Free)
        const localResponse = getSmartLocalResponse(message);
        return NextResponse.json({
            success: true,
            reply: localResponse.text,
            suggestedCampId: localResponse.suggestedCampId || null,
            quickActions: localResponse.quickActions,
            source: 'local_engine'
        });

    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json({
            success: false,
            reply: "🌲 I'm here to help with your camping booking! You can ask about our campsites, pricing, squad discounts, or click below to open the booking engine directly.",
            quickActions: [
                { label: 'Open Booking Engine ↗', action: 'OPEN_BOOKING' }
            ]
        }, { status: 500 });
    }
}
