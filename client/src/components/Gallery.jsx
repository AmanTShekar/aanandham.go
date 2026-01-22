import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { siteContentAPI } from '../services/api';
// Fallback
import { galleryImages as staticImages } from '../data/siteContent';

const Gallery = () => {
    const [images, setImages] = useState([]);
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const yVal = useTransform(scrollYProgress, [0, 1], [0, -50]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const data = await siteContentAPI.getSiteImages();
                if (data && data.length > 0) {
                    setImages(data.map(img => ({ ...img, src: img.url, alt: img.title })));
                } else {
                    setImages(staticImages.map(url => ({ src: url, alt: "Gallery", title: "Experience" })));
                }
            } catch (error) {
                console.error("Gallery fetch failed, using fallback");
                setImages(staticImages.map(url => ({ src: url, alt: "Gallery", title: "Experience" })));
            }
        };
        fetchImages();
    }, []);

    // Bento Grid Area Mappings for 5 images
    // 0: Hero (2x2), 1: Tall Side (1x2), 2,3,4: Bottom Row (1x1 each)
    const gridAreas = [
        "span 2 / span 2",  // Item 0
        "span 2 / span 1",  // Item 1 (Tall)
        "span 1 / span 1",  // Item 2
        "span 1 / span 1",  // Item 3
        "span 1 / span 1"   // Item 4
    ];

    // Responsive styles using a style tag for cleaner media queries
    const styles = `
        .bento-grid {
            display: grid;
            grid-template-columns: 1fr;
            grid-auto-rows: 250px;
            gap: 16px;
        }
        @media (max-width: 768px) {
            .mobile-hidden-gallery {
                display: none !important;
            }
        }
        @media (min-width: 768px) {
            .bento-grid {
                grid-template-columns: repeat(2, 1fr);
                grid-template-rows: repeat(4, 250px);
            }
            .bento-item-0 { grid-area: 1 / 1 / 3 / 3; } /* Hero 2x2 */
            .bento-item-1 { grid-area: 3 / 1 / 5 / 2; } 
            .bento-item-2 { grid-area: 3 / 2 / 4 / 3; }
            .bento-item-3 { grid-area: 4 / 2 / 5 / 3; }
            .bento-item-4 { display: none; }
        }
        @media (min-width: 1024px) {
            .bento-grid {
                grid-template-columns: repeat(3, 1fr);
                grid-auto-rows: 240px;
            }
            .bento-item-0 { grid-column: span 2; grid-row: span 2; } /* Hero 2x2 */
            .bento-item-1 { grid-column: span 1; grid-row: span 2; } /* Tall Side */
            .bento-item-2 { grid-column: span 1; grid-row: span 1; }
            .bento-item-3 { grid-column: span 1; grid-row: span 1; }
            .bento-item-4, .bento-item-5, .bento-item-6, .bento-item-7 { display: block; grid-column: span 1; grid-row: span 1; }
        }
    `;

    return (
        <section ref={containerRef} className="section-responsive" style={{ background: '#0a0a0a', overflow: 'hidden' }}>
            <style>{styles}</style>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: '30px' }}
                >
                    <span style={{ color: 'var(--primary)', fontWeight: '700', letterSpacing: '3px', fontSize: '12px', textTransform: 'uppercase' }}>
                        Visual Journey
                    </span>
                    <h2 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: '800', color: 'white', marginTop: '16px' }}>
                        Capturing Moments
                    </h2>
                </motion.div>

                {/* Bento Grid */}
                <div className="bento-grid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {(() => {
                        const displayImages = images.length > 0 ? images.slice(0, 8) : [];
                        if (displayImages.length >= 2) {
                            const temp = displayImages[0];
                            displayImages[0] = displayImages[1];
                            displayImages[1] = temp;
                        }
                        return displayImages;
                    })().map((img, i) => (
                        <motion.div
                            key={i}
                            className={`bento-item-${i} ${i > 3 ? 'mobile-hidden-gallery' : ''}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            whileHover={{ scale: 0.98, transition: { duration: 0.3 } }}
                            style={{
                                borderRadius: '32px',
                                overflow: 'hidden',
                                position: 'relative',
                                cursor: 'default',
                                background: '#1a1a1a'
                            }}
                        >
                            <img
                                src={img.src || img.url}
                                alt={img.alt || img.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease' }}
                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            />

                            {/* Glassmorphism Overlay */}
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
                                opacity: 0,
                                transition: 'opacity 0.3s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                padding: '30px'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                            >
                                <motion.span
                                    initial={{ y: 20 }}
                                    whileInView={{ y: 0 }}
                                    style={{ color: 'var(--primary)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}
                                >
                                    Experience
                                </motion.span>
                                <h3 style={{ color: 'white', fontSize: '24px', fontWeight: '700', margin: 0 }}>
                                    {img.title || img.alt || 'Moment'}
                                </h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
            {/* Show More Button - Tightened spacing */}
            <div className="gallery-btn-wrapper" style={{ marginTop: '48px' }}>
                <Link to="/gallery" style={{ textDecoration: 'none' }}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            padding: '16px 40px',
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.3)',
                            borderRadius: '50px',
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        View Full Gallery
                    </motion.button>
                </Link>
            </div>

        </section >
    );
};

export default Gallery;
