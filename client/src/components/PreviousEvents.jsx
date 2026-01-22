import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { siteContentAPI } from '../services/api';
// Fallback
import { previousEvents as staticPreviousEvents } from '../data/siteContent';
import { FaArrowRight } from 'react-icons/fa';
import RecapModal from './RecapModal';

const PreviousEvents = () => {
    const containerRef = useRef(null);
    const [selectedRecap, setSelectedRecap] = useState(null);
    const [previousEvents, setPreviousEvents] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await siteContentAPI.getPreviousEvents();
                if (data && data.length > 0) {
                    setPreviousEvents(data);
                } else {
                    setPreviousEvents(staticPreviousEvents);
                }
            } catch (error) {
                console.error("Error fetching previous events:", error);
                setPreviousEvents(staticPreviousEvents);
            }
        };
        fetchEvents();
    }, []);

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

                    {/* Responsive Layout: Scroll on Mobile, Bento Grid on Desktop */}
                    <div className={width < 768 ? "horizontal-scroll-container" : "bento-grid-container"}>
                        <style>{`
                            .bento-grid-container {
                                display: grid;
                                grid-template-columns: repeat(12, 1fr);
                                gap: 24px;
                                padding-bottom: 40px;
                            }
                            .bento-item {
                                position: relative;
                                border-radius: 32px;
                                overflow: hidden;
                                cursor: pointer;
                                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                            }
                            .bento-item:hover {
                                transform: translateY(-8px) scale(1.02);
                                box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                                z-index: 2;
                            }
                            /* Specific Spans for Bento Effect */
                            .bento-item:nth-child(1) { grid-column: span 8; height: 450px; }
                            .bento-item:nth-child(2) { grid-column: span 4; height: 450px; }
                            .bento-item:nth-child(3) { grid-column: span 4; height: 350px; }
                            .bento-item:nth-child(4) { grid-column: span 4; height: 350px; }
                            .bento-item:nth-child(5) { grid-column: span 4; height: 350px; }

                            @media (max-width: 1024px) {
                                .bento-item:nth-child(n) { grid-column: span 6; height: 350px; }
                            }
                        `}</style>

                        {previousEvents.map((evt, i) => (
                            <motion.div
                                key={evt.id || i}
                                className={width < 768 ? "previous-event-card" : "bento-item"}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => setSelectedRecap(evt)}
                                itemScope
                                itemType="http://schema.org/Event"
                            >
                                <div style={{ height: '100%', width: '100%', position: 'relative' }}>
                                    <img
                                        src={evt.image}
                                        alt={evt.title}
                                        itemProp="image"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    {/* Gradient Overlay */}
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)'
                                    }} />

                                    {/* Content */}
                                    <div style={{
                                        position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '30px',
                                        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
                                    }}>
                                        <div style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            background: 'rgba(255,255,255,0.1)',
                                            backdropFilter: 'blur(10px)',
                                            padding: '6px 16px',
                                            borderRadius: '100px',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            color: '#e0e0e0',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            marginBottom: '16px',
                                            width: 'fit-content'
                                        }}>
                                            <span itemProp="startDate">{evt.date}</span>
                                        </div>
                                        <h3 style={{
                                            fontSize: width < 768 ? '24px' : '32px',
                                            fontWeight: '800',
                                            color: 'white',
                                            marginBottom: '8px',
                                            lineHeight: '1.2',
                                            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                                        }} itemProp="name">
                                            {evt.title}
                                        </h3>
                                        <p style={{
                                            color: 'rgba(255,255,255,0.8)',
                                            fontSize: '16px',
                                            lineHeight: '1.5',
                                            marginBottom: '0',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }} itemProp="description">
                                            {evt.description}
                                        </p>
                                    </div>

                                    {/* Hover Reveal Icon (Desktop) */}
                                    {width >= 768 && (
                                        <div style={{
                                            position: 'absolute', top: '20px', right: '20px',
                                            background: 'white', borderRadius: '50%', width: '40px', height: '40px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            opacity: 0, transition: 'opacity 0.3s',
                                            className: 'hover-reveal'
                                        }}>
                                            <FaArrowRight color="black" />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    {/* Dots Indicator */}
                    {width < 768 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
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
                    )}
                </div>
            </section>
            <RecapModal event={selectedRecap} onClose={() => setSelectedRecap(null)} />
        </>
    );
};

export default PreviousEvents;
