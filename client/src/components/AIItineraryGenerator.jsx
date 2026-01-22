import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaCalendarAlt, FaTimes, FaMapMarkerAlt, FaClock, FaCheckCircle, FaUtensils, FaCamera, FaLeaf, FaCocktail, FaDownload } from 'react-icons/fa';

const AIItineraryGenerator = ({ isOpen, onClose, destination, spots, stays }) => {
    const [step, setStep] = useState('config'); // config, generating, result
    const [days, setDays] = useState(3);
    const [generatingText, setGeneratingText] = useState('');
    const [itinerary, setItinerary] = useState(null);
    const [progress, setProgress] = useState(0);

    const getActivityIcon = (type) => {
        switch (type) {
            case 'Food': return <FaUtensils />;
            case 'Explore': return <FaCamera />;
            case 'Nature': return <FaLeaf />;
            case 'Leisure': return <FaCocktail />;
            default: return <FaMapMarkerAlt />;
        }
    };

    const generationSteps = [
        "Analyzing top-rated spots in " + destination?.name + "...",
        "Optimizing travel routes for minimal transit time...",
        "Matching premier stays with local experiences...",
        "Crafting your bespoke luxury itinerary...",
        "Finalizing details and timing..."
    ];

    const generateItinerary = () => {
        setStep('generating');
        let currentStepIndex = 0;
        setProgress(0);

        const interval = setInterval(() => {
            if (currentStepIndex < generationSteps.length) {
                setGeneratingText(generationSteps[currentStepIndex]);
                setProgress((prev) => Math.min(prev + 20, 100));
                currentStepIndex++;
            } else {
                clearInterval(interval);
                // Create dummy itinerary based on actual data
                const mockItinerary = Array.from({ length: days }, (_, i) => ({
                    day: i + 1,
                    activities: [
                        { time: '09:00 AM', title: 'Signature Breakfast at ' + (stays[0]?.title || 'Resort'), type: 'Food', desc: 'Savor local delicacies with a view.' },
                        { time: '11:00 AM', title: 'Explore ' + (spots[i % spots.length]?.name || 'Local Landmark'), type: 'Explore', desc: 'Immerse yourself in the history and beauty.' },
                        { time: '01:30 PM', title: 'Authentic Keralan Lunch', type: 'Food', desc: 'A traditional feast served on a banana leaf.' },
                        { time: '03:30 PM', title: 'Discover ' + (spots[(i + 1) % spots.length]?.name || 'Nature Spot'), type: 'Nature', desc: 'Breathe in the fresh air and capture the vista.' },
                        { time: '07:30 PM', title: 'Gala Dinner & Evening Leisure', type: 'Leisure', desc: 'Unwind with premium hospitality.' }
                    ]
                }));
                setItinerary(mockItinerary);
                setStep('result');
            }
        }, 1200);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(10px)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
                }}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    style={{
                        background: '#111', width: '100%', maxWidth: '800px',
                        borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)',
                        maxHeight: '90vh', overflow: 'hidden', position: 'relative'
                    }}
                >
                    <button
                        onClick={onClose}
                        style={{ position: 'absolute', top: '25px', right: '25px', background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', zIndex: 10 }}
                    >
                        <FaTimes />
                    </button>

                    {step === 'config' && (
                        <div style={{ padding: '60px', textAlign: 'center' }}>
                            <div style={{ width: '80px', height: '80px', background: 'var(--primary)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', fontSize: '40px', color: 'black' }}>
                                <FaRobot />
                            </div>
                            <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '15px' }}>AI Itinerary Builder</h2>
                            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '40px' }}>Let our AI craft a perfect, localized experience for your stay in {destination?.name}.</p>

                            <div style={{ marginBottom: '40px' }}>
                                <label style={{ display: 'block', marginBottom: '15px', fontWeight: '700' }}>Duration of stay</label>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                                    {[1, 3, 5, 7].map(d => (
                                        <button
                                            key={d}
                                            onClick={() => setDays(d)}
                                            style={{
                                                padding: '15px 30px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)',
                                                background: days === d ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                                color: days === d ? 'black' : 'white', fontWeight: '800', cursor: 'pointer', transition: '0.3s'
                                            }}
                                        >
                                            {d} {d === 1 ? 'Day' : 'Days'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={generateItinerary}
                                style={{
                                    width: '100%', padding: '20px', background: 'var(--primary)',
                                    border: 'none', borderRadius: '15px', color: 'black', fontWeight: '800', fontSize: '18px', cursor: 'pointer'
                                }}
                            >
                                Generate My Itinerary
                            </button>
                        </div>
                    )}

                    {step === 'generating' && (
                        <div style={{ padding: '100px 60px', textAlign: 'center' }}>
                            <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 40px' }}>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                    style={{ position: 'absolute', inset: 0, border: '4px solid rgba(212,175,55,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}
                                />
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '800', color: 'var(--primary)' }}>
                                    {progress}%
                                </div>
                            </div>
                            <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '10px' }}>Crafting Magic...</h3>
                            <motion.p
                                key={generatingText}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ color: 'var(--primary)', fontWeight: '600', height: '24px' }}
                            >
                                {generatingText}
                            </motion.p>
                            <div style={{ width: '200px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', margin: '30px auto 0', overflow: 'hidden' }}>
                                <motion.div
                                    animate={{ width: `${progress}%` }}
                                    style={{ height: '100%', background: 'var(--primary)' }}
                                />
                            </div>
                        </div>
                    )}

                    {step === 'result' && (
                        <div style={{ overflowY: 'auto', maxHeight: '90vh' }}>
                            <div style={{ padding: '60px 60px 30px', background: 'linear-gradient(to bottom, rgba(212,175,55,0.1), transparent)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                                    <FaCheckCircle style={{ color: 'var(--primary)', fontSize: '24px' }} />
                                    <span style={{ fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '2px' }}>Itinerary Ready</span>
                                </div>
                                <h2 style={{ fontSize: '36px', fontWeight: '900' }}>Your {days}-Day {destination?.name} Escape</h2>
                            </div>

                            <div style={{ padding: '0 60px 60px' }}>
                                {itinerary?.map((day, idx) => (
                                    <div key={idx} style={{ marginBottom: '40px' }}>
                                        <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ width: '30px', height: '30px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>{day.day}</span>
                                            Day {day.day}
                                        </h3>
                                        <div style={{ borderLeft: '2px solid rgba(255,255,255,0.1)', marginLeft: '14px', paddingLeft: '30px' }}>
                                            {day.activities.map((act, i) => (
                                                <div key={i} style={{ marginBottom: '30px', position: 'relative' }}>
                                                    <div style={{ position: 'absolute', left: '-37px', top: '5px', width: '12px', height: '12px', background: 'var(--primary)', borderRadius: '50%', boxShadow: '0 0 10px var(--primary)' }} />
                                                    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                                                        <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary)', width: '80px', flexShrink: 0 }}>{act.time}</span>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                                                <span style={{ fontSize: '18px', color: 'var(--primary)' }}>{getActivityIcon(act.type)}</span>
                                                                <h4 style={{ fontSize: '18px', fontWeight: '700' }}>{act.title}</h4>
                                                            </div>
                                                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '1.5' }}>{act.desc}</p>
                                                            <span style={{ fontSize: '10px', padding: '4px 10px', background: 'rgba(212,175,55,0.1)', borderRadius: '10px', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: '800', marginTop: '10px', display: 'inline-block' }}>{act.type}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
                                    <button
                                        onClick={onClose}
                                        style={{
                                            flex: 2, padding: '20px', background: 'var(--primary)', color: 'black',
                                            border: 'none', borderRadius: '15px', fontWeight: '800', cursor: 'pointer'
                                        }}
                                    >
                                        Book This Trip
                                    </button>
                                    <button
                                        style={{
                                            flex: 1, padding: '20px', background: 'rgba(255,255,255,0.05)', color: 'white',
                                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', fontWeight: '800', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                                        }}
                                    >
                                        <FaDownload /> PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AIItineraryGenerator;
