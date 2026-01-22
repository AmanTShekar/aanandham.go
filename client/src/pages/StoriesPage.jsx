import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { siteContentAPI } from '../services/api';

const StoriesPage = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Parallax
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 200]);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const data = await siteContentAPI.getTravelStories();
                setStories(data);
            } catch (error) {
                console.error("Error fetching stories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStories();
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: '#000', color: 'white', paddingBottom: '60px' }}>
            <SEO
                title="Travel Stories & Guides | Aanandham.go Blog"
                description="Read our latest travel stories, camping guides, and trekking tips for Munnar, Vagamon, and Wayanad."
                keywords="Travel Blog, Kerala Camping Guide, Munnar Trekking Tips, Wayanad Glamping Stories"
            />

            {/* Hero Section with Parallax */}
            <div style={{
                position: 'relative',
                height: '60vh',
                minHeight: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                marginBottom: '60px'
            }}>
                <motion.div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'url("/images/why_choose_us/campfire.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.5)',
                    y: y,
                    scale: 1.1,
                    zIndex: 0
                }} />

                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 20px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span style={{ color: 'var(--primary)', fontWeight: '700', letterSpacing: '4px', fontSize: '14px', textTransform: 'uppercase' }}>OUR JOURNAL</span>
                        <h1 style={{ fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: '900', color: 'white', marginTop: '16px', letterSpacing: '-1px' }}>
                            Travel Diaries
                        </h1>
                        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '20px auto 0' }}>
                            Expert guides, hidden gems, and stories from the wild interact exclusively with nature.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container">

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px', color: '#666' }}>Loading stories...</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '40px' }}>
                        {stories.length > 0 ? (
                            stories.map((story, i) => {
                                const isInternal = story.link && story.link.startsWith('/');
                                const CardContent = (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        whileHover={{ y: -8 }}
                                        style={{ background: '#111', borderRadius: '24px', overflow: 'hidden', height: '100%', cursor: 'pointer', border: '1px solid #222' }}
                                    >
                                        <div style={{ height: '240px', position: 'relative', overflow: 'hidden' }}>
                                            <img
                                                src={story.image}
                                                alt={story.title}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                                                loading="lazy"
                                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                            />
                                            <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'var(--primary)', color: 'black', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                                {story.category}
                                            </div>
                                        </div>
                                        <div style={{ padding: '30px' }}>
                                            <div style={{ color: '#666', fontSize: '12px', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>{story.date}</div>
                                            <h3 style={{ fontSize: '22px', fontWeight: '700', color: 'white', marginBottom: '16px', lineHeight: '1.4' }}>{story.title}</h3>
                                            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--primary)', fontSize: '14px', fontWeight: '600' }}>
                                                Read Article <span style={{ marginLeft: '8px' }}>&rarr;</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );

                                return (
                                    <div key={story._id || i}>
                                        {isInternal ? (
                                            <Link to={story.link} style={{ textDecoration: 'none' }}>
                                                {CardContent}
                                            </Link>
                                        ) : (
                                            <a href={story.link} style={{ textDecoration: 'none' }}>
                                                {CardContent}
                                            </a>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#666', fontSize: '18px' }}>
                                No stories found. Check back later!
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StoriesPage;
