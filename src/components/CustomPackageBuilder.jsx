"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { waLink } from '../lib/whatsapp';

const VIBES = [
    { id: 'squad', name: 'Squad / Friends Trek', icon: '🚙', desc: 'High energy, off-road convoy, late campfire' },
    { id: 'couple', name: 'Romantic Glamping', icon: '⛺', desc: 'Private pod, starlit dinner, sunrise cloud bed' },
    { id: 'solo', name: 'Solo Peace & Reset', icon: '🧘', desc: 'Meditation trails, stargazing, like-minded tribe' },
    { id: 'college', name: 'Student / College Batch', icon: '🎒', desc: 'Budget alpine tents, trail games, acoustics' },
    { id: 'corp', name: 'Corporate Offsite', icon: '💼', desc: 'Strategy outdoors, team challenges, premium dining' }
];

const DESTINATIONS = [
    { id: 'kolukkumalai', name: 'Kolukkumalai Sunrise (7,900 FT)', alt: 'Highest Peak' },
    { id: 'suryanelli', name: 'Suryanelli Tea Ridge', alt: 'Tea Hills' },
    { id: 'phantom', name: 'Phantom Head Peak', alt: 'Sunset Ridge' },
    { id: 'anayirangal', name: 'Anayirangal Lakeside', alt: 'Lakeside Camp' },
    { id: 'vagamon', name: 'Vagamon Pine Valley', alt: 'Pine Forest' },
    { id: 'wayanad', name: 'Wayanad 900 Kandi', alt: 'Rainforest' }
];

const STAYS = [
    { id: 'pods', name: 'Luxury Glass & Geodesic Pods', priceRange: '₹2,500 - ₹3,500' },
    { id: 'alpine', name: 'Weather-Proof Alpine Ridge Tents', priceRange: '₹1,500 - ₹2,000' },
    { id: 'treehouse', name: 'High-Canopy Treehouse Villa', priceRange: '₹3,000 - ₹4,500' },
    { id: 'mixed', name: 'Mixed Group Buyout', priceRange: 'Custom' }
];

const ACTIVITIES = [
    '4x4 Rugged Jeep Safari',
    'Guided Ridge Summit Hike',
    'Live BBQ & Acoustic Campfire',
    'Astrophotography & Stargazing',
    'Sunrise Mountain Yoga',
    'Tea Estate & Factory Tasting',
    'River Kayaking / Bamboo Raft',
    '4K Drone Cinematography'
];

export default function CustomPackageBuilder() {
    const [selectedVibe, setSelectedVibe] = useState('squad');
    const [selectedDests, setSelectedDests] = useState(['kolukkumalai', 'suryanelli']);
    const [selectedStay, setSelectedStay] = useState('pods');
    const [selectedActivities, setSelectedActivities] = useState(['4x4 Rugged Jeep Safari', 'Live BBQ & Acoustic Campfire', 'Guided Ridge Summit Hike']);
    const [nights, setNights] = useState(2);
    const [pax, setPax] = useState(4);
    const [leadName, setLeadName] = useState('');
    const [leadPhone, setLeadPhone] = useState('');
    const [budgetNotes, setBudgetNotes] = useState('');

    const toggleDest = (id) => {
        setSelectedDests(prev => 
            prev.includes(id) ? (prev.length > 1 ? prev.filter(d => d !== id) : prev) : [...prev, id]
        );
    };

    const toggleActivity = (act) => {
        setSelectedActivities(prev =>
            prev.includes(act) ? prev.filter(a => a !== act) : [...prev, act]
        );
    };

    const handleSendCustomQuote = (e) => {
        e.preventDefault();
        const vibeObj = VIBES.find(v => v.id === selectedVibe);
        const stayObj = STAYS.find(s => s.id === selectedStay);
        const destNames = selectedDests.map(d => DESTINATIONS.find(item => item.id === d)?.name).filter(Boolean);

        const customMessage = `🛠️ *CUSTOM EXPEDITION REQUEST — AANANDHAM.GO*\n\n` +
            `🎯 *Trip Vibe:* ${vibeObj?.name} ${vibeObj?.icon}\n` +
            `📍 *Destinations:* ${destNames.join(' + ')}\n` +
            `⏳ *Duration:* ${nights} Nights / ${nights + 1} Days\n` +
            `👥 *Group Size:* ${pax} Explorers\n` +
            `⛺ *Stay Preference:* ${stayObj?.name} (${stayObj?.priceRange || 'Custom'})\n` +
            `✨ *Requested Activities:* ${selectedActivities.join(', ')}\n\n` +
            `👤 *Lead Name:* ${leadName || 'Adventurer'}\n` +
            `📞 *Phone:* ${leadPhone || 'Not provided'}\n` +
            `📝 *Custom Notes/Budget:* ${budgetNotes || 'None'}\n\n` +
            `Please curate our custom itinerary and provide a tailored quote! 🏔️✨`;

        window.open(waLink(customMessage), '_blank');
    };

    return (
        <section
            id="custom-package"
            style={{
                position: 'relative',
                padding: '110px 24px',
                background: '#101E13',
                color: '#FFFFFF',
                overflow: 'hidden'
            }}
        >
            {/* Background Ambient Glow */}
            <div style={{
                position: 'absolute',
                top: '20%',
                left: '10%',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(213, 237, 85, 0.06) 0%, rgba(14, 24, 17, 0) 70%)',
                pointerEvents: 'none',
                filter: 'blur(60px)'
            }} />

            <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                
                {/* Section Header */}
                <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 60px' }}>
                    <div className="star-badge" style={{ color: '#E5A93B', justifyContent: 'center' }}>
                        <span className="star-icon">★</span> TAILORED EXPEDITIONS
                    </div>
                    <h2 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(34px, 5vw, 54px)',
                        fontWeight: '800',
                        color: '#FFFFFF',
                        letterSpacing: '-0.04em',
                        lineHeight: 1.1,
                        marginBottom: '18px'
                    }}>
                        Build your custom Kerala wilderness expedition
                    </h2>
                    <p style={{ fontSize: '15px', color: '#A2B6A6', lineHeight: 1.6 }}>
                        Customize your destinations, private 4x4 safaris, campsite pods, and barbecue nights. Our certified pathfinders curate a bespoke route within 15 minutes.
                    </p>
                </div>

                {/* Main Interactive Customizer Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '40px',
                    alignItems: 'start'
                }}>
                    
                    {/* Left Builder Controls */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '32px',
                        padding: '36px',
                        backdropFilter: 'blur(16px)'
                    }}>
                        {/* Step 1: Vibe */}
                        <div style={{ marginBottom: '32px' }}>
                            <label style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#E5A93B', display: 'block', marginBottom: '14px' }}>
                                1. SELECT TRIP VIBE
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                                {VIBES.map((vibe) => {
                                    const isSelected = selectedVibe === vibe.id;
                                    return (
                                        <div
                                            key={vibe.id}
                                            onClick={() => setSelectedVibe(vibe.id)}
                                            style={{
                                                padding: '12px',
                                                borderRadius: '16px',
                                                border: isSelected ? '2px solid #E5A93B' : '1px solid rgba(255, 255, 255, 0.1)',
                                                background: isSelected ? 'rgba(213, 237, 85, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                textAlign: 'center'
                                            }}
                                        >
                                            <div style={{ fontSize: '24px', marginBottom: '6px' }}>{vibe.icon}</div>
                                            <div style={{ fontSize: '12.5px', fontWeight: '700', color: isSelected ? '#E5A93B' : '#FFFFFF' }}>{vibe.name}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Step 2: Destination Multi-Select */}
                        <div style={{ marginBottom: '32px' }}>
                            <label style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#E5A93B', display: 'block', marginBottom: '14px' }}>
                                2. DESTINATIONS & PEAKS (CHOOSE 1 OR MORE)
                            </label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {DESTINATIONS.map((dest) => {
                                    const isSelected = selectedDests.includes(dest.id);
                                    return (
                                        <button
                                            type="button"
                                            key={dest.id}
                                            onClick={() => toggleDest(dest.id)}
                                            style={{
                                                padding: '9px 18px',
                                                borderRadius: '999px',
                                                border: isSelected ? '1px solid #E5A93B' : '1px solid rgba(255, 255, 255, 0.12)',
                                                background: isSelected ? '#E5A93B' : 'rgba(255, 255, 255, 0.05)',
                                                color: isSelected ? '#121613' : '#FFFFFF',
                                                fontSize: '13px',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <span>{dest.name}</span>
                                            {isSelected && <span>✓</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Step 3: Duration & Squad Size */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#E5A93B', display: 'block', marginBottom: '10px' }}>
                                    3. DURATION (NIGHTS)
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setNights(Math.max(1, nights - 1))}
                                        style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', fontSize: '18px', cursor: 'pointer' }}
                                    >-</button>
                                    <span style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF' }}>{nights} N / {nights + 1} D</span>
                                    <button
                                        type="button"
                                        onClick={() => setNights(nights + 1)}
                                        style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', fontSize: '18px', cursor: 'pointer' }}
                                    >+</button>
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#E5A93B', display: 'block', marginBottom: '10px' }}>
                                    4. EXPLORERS (PAX)
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setPax(Math.max(1, pax - 1))}
                                        style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', fontSize: '18px', cursor: 'pointer' }}
                                    >-</button>
                                    <span style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF' }}>{pax} Pax</span>
                                    <button
                                        type="button"
                                        onClick={() => setPax(pax + 1)}
                                        style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', fontSize: '18px', cursor: 'pointer' }}
                                    >+</button>
                                </div>
                            </div>
                        </div>

                        {/* Step 4: Stay & Accommodation Tier */}
                        <div style={{ marginBottom: '32px' }}>
                            <label style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#E5A93B', display: 'block', marginBottom: '14px' }}>
                                4. ACCOMMODATION & STAY STYLE
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                                {STAYS.map((stay) => {
                                    const isSel = selectedStay === stay.id;
                                    return (
                                        <div
                                            key={stay.id}
                                            onClick={() => setSelectedStay(stay.id)}
                                            style={{
                                                padding: '14px 16px',
                                                borderRadius: '16px',
                                                border: isSel ? '2px solid #E5A93B' : '1px solid rgba(255, 255, 255, 0.1)',
                                                background: isSel ? 'rgba(213, 237, 85, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <div style={{ fontSize: '13.5px', fontWeight: '700', color: isSel ? '#E5A93B' : '#FFFFFF', marginBottom: '4px' }}>
                                                {stay.name}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#A2B6A6', fontWeight: '600' }}>
                                                Est: <span style={{ color: '#FFFFFF' }}>{stay.priceRange}</span> / person
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Step 5: Activities Selector */}
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#E5A93B', display: 'block', marginBottom: '14px' }}>
                                5. CUSTOM EXPERIENCES INCLUDED
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                                {ACTIVITIES.map((act, i) => {
                                    const isChecked = selectedActivities.includes(act);
                                    return (
                                        <div
                                            key={i}
                                            onClick={() => toggleActivity(act)}
                                            style={{
                                                padding: '10px 14px',
                                                borderRadius: '14px',
                                                background: isChecked ? 'rgba(213, 237, 85, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                                                border: isChecked ? '1px solid #E5A93B' : '1px solid rgba(255, 255, 255, 0.08)',
                                                color: isChecked ? '#E5A93B' : '#A2B6A6',
                                                fontSize: '12.5px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            <span style={{ fontSize: '14px' }}>{isChecked ? '✓' : '+'}</span>
                                            <span>{act}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>

                    {/* Right Live Itinerary & Dispatch Panel */}
                    <div style={{
                        background: '#08120A',
                        border: '1px solid rgba(213, 237, 85, 0.25)',
                        borderRadius: '32px',
                        padding: '36px',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                        position: 'sticky',
                        top: '110px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
                            <div>
                                <span className="live-beacon"></span>
                                <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px', color: '#E5A93B', marginLeft: '8px', textTransform: 'uppercase' }}>
                                    LIVE CUSTOM ITINERARY PREVIEW
                                </span>
                            </div>
                            <span style={{ fontSize: '13px', color: '#A2B6A6', fontWeight: '700' }}>
                                {nights}N / {nights + 1}D
                            </span>
                        </div>

                        {/* Itinerary Timeline Preview */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ color: '#E5A93B', fontWeight: '800', fontSize: '13px', minWidth: '46px' }}>Day 1</div>
                                <div style={{ fontSize: '13px', color: '#A2B6A6', lineHeight: 1.5 }}>
                                    Basecamp check-in at Suryanelli ridge. Sunset walk to Phantom Head ridge & Night campfire with live BBQ.
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ color: '#E5A93B', fontWeight: '800', fontSize: '13px', minWidth: '46px' }}>Day 2</div>
                                <div style={{ fontSize: '13px', color: '#A2B6A6', lineHeight: 1.5 }}>
                                    4:30 AM 4x4 Jeep convoy to Kolukkumalai Sunrise Peak (7,900 FT). Cloud bed photography & organic tea tasting.
                                </div>
                            </div>
                            {nights >= 2 && (
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <div style={{ color: '#E5A93B', fontWeight: '800', fontSize: '13px', minWidth: '46px' }}>Day 3</div>
                                    <div style={{ fontSize: '13px', color: '#A2B6A6', lineHeight: 1.5 }}>
                                        Anayirangal lake trail walk & scenic transfer / outdoor departure brunch.
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Lead Input Fields */}
                        <form onSubmit={handleSendCustomQuote} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <input
                                    type="text"
                                    required
                                    placeholder="Your Name"
                                    value={leadName}
                                    onChange={(e) => setLeadName(e.target.value)}
                                    style={{
                                        padding: '12px 16px',
                                        borderRadius: '14px',
                                        background: 'rgba(255, 255, 255, 0.06)',
                                        border: '1px solid rgba(255, 255, 255, 0.12)',
                                        color: '#FFFFFF',
                                        fontSize: '13px',
                                        outline: 'none'
                                    }}
                                />
                                <input
                                    type="tel"
                                    required
                                    placeholder="WhatsApp Number"
                                    value={leadPhone}
                                    onChange={(e) => setLeadPhone(e.target.value)}
                                    style={{
                                        padding: '12px 16px',
                                        borderRadius: '14px',
                                        background: 'rgba(255, 255, 255, 0.06)',
                                        border: '1px solid rgba(255, 255, 255, 0.12)',
                                        color: '#FFFFFF',
                                        fontSize: '13px',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            <input
                                type="text"
                                placeholder="Any special requests or estimated budget? (Optional)"
                                value={budgetNotes}
                                onChange={(e) => setBudgetNotes(e.target.value)}
                                style={{
                                    padding: '12px 16px',
                                    borderRadius: '14px',
                                    background: 'rgba(255, 255, 255, 0.06)',
                                    border: '1px solid rgba(255, 255, 255, 0.12)',
                                    color: '#FFFFFF',
                                    fontSize: '13px',
                                    outline: 'none'
                                }}
                            />

                            <button
                                type="submit"
                                className="btn-lime"
                                style={{
                                    padding: '16px',
                                    fontSize: '14.5px',
                                    fontWeight: '800',
                                    marginTop: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px'
                                }}
                            >
                                <i className="fa-brands fa-whatsapp" style={{ fontSize: '18px' }}></i>
                                <span>Get Custom Quote on WhatsApp ↗</span>
                            </button>
                        </form>

                        <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '11.5px', color: '#8E9B92' }}>
                            ⚡ Instant response by our Munnar Camp Pathfinders within 15 minutes.
                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
}
