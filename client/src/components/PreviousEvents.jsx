import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { previousEvents } from '../data/siteContent';
import { FaArrowRight } from 'react-icons/fa';
import RecapModal from './RecapModal';

const PreviousEvents = () => {
    const containerRef = useRef(null);
    const [selectedRecap, setSelectedRecap] = useState(null);

    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = () => {
        if (containerRef.current) {
            // Logic to determine active index based on scroll position if we targeted the scroll div
            const scrollContainer = containerRef.current.querySelector('.horizontal-scroll-container');
            if (scrollContainer) {
                const scrollLeft = scrollContainer.scrollLeft;
                const width = scrollContainer.offsetWidth; // Viewport width
                const index = Math.round(scrollLeft / (width * 0.8)); // 80vw assumption
                setActiveIndex(index);
            }
        }
    };

    // Attach scroll listener to the specific div is tricky with ref scoping here if we didn't attach ref to the div directly.
    // Let's modify the map to render the div with an ID or use a callback ref on the scroll container.
    // For simplicity, let's just make the dots work by modifying the scroll container render.

    return (
        <>
            <section ref={containerRef} className="section-responsive" style={{ background: '#0f0f0f', overflow: 'hidden' }}>
                <div className="container">
                    <div className="section-header-responsive">
                        {/* Header Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span style={{ color: 'var(--primary)', fontWeight: '700', letterSpacing: '2px', fontSize: '12px', textTransform: 'uppercase' }}>
                                Rewind
                            </span>
                            <h2 style={{ fontSize: '48px', fontWeight: '800', color: 'white', marginTop: '12px' }}>
                                Past Gatherings
                            </h2>
                        </motion.div>
                    </div>

                    <div
                        className="horizontal-scroll-container"
                        onScroll={(e) => {
                            const scrollLeft = e.target.scrollLeft;
                            const width = e.target.offsetWidth;
                            const index = Math.round(scrollLeft / (width * 0.8));
                            setActiveIndex(index);
                        }}
                    >
                        {previousEvents.map((evt, i) => (
                            <motion.div
                                key={evt.id}
                                className="previous-event-card"
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2, type: 'spring', stiffness: 50 }}
                                whileHover={{ y: -10 }}
                            >
                                <div style={{ height: '240px', overflow: 'hidden' }}>
                                    <img
                                        src={evt.image}
                                        alt={evt.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                    />
                                </div>
                                <div className="event-card-content">
                                    <div style={{
                                        display: 'inline-block',
                                        padding: '6px 14px',
                                        borderRadius: '50px',
                                        border: '1px solid #3f3f46',
                                        color: '#d4d4d8',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        marginBottom: '20px'
                                    }}>
                                        {evt.date}
                                    </div>
                                    <h3 className="event-card-title">
                                        {evt.title}
                                    </h3>
                                    <p style={{ color: '#a1a1aa', lineHeight: '1.6', marginBottom: '24px' }}>
                                        {evt.description}
                                    </p>
                                    <button style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '14px',
                                        fontWeight: '700'
                                    }}
                                        onClick={() => setSelectedRecap(evt)}
                                    >
                                        Recap <FaArrowRight size={12} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    {/* Dots Indicator */}
                    <div className="mobile-only" style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
                        {previousEvents.map((_, idx) => (
                            <div
                                key={idx}
                                style={{
                                    width: idx === activeIndex ? '24px' : '8px',
                                    height: '8px',
                                    borderRadius: '4px',
                                    background: idx === activeIndex ? 'var(--primary)' : '#333',
                                    transition: 'all 0.3s ease'
                                }}
                            />
                        ))}
                    </div>
                </div>
            </section>
            <RecapModal event={selectedRecap} onClose={() => setSelectedRecap(null)} />
        </>
    );
};

export default PreviousEvents;
