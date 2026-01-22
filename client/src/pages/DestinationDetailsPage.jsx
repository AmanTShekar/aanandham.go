import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { destinationsAPI, listingsAPI, experiencesAPI } from '../services/api';
import { FaMoneyBillWave, FaLanguage, FaCalendarAlt, FaMapMarkerAlt, FaCompass, FaChevronRight } from 'react-icons/fa';
import SEO from '../components/SEO';
import { motion, useScroll, useTransform } from 'framer-motion';
import AIItineraryGenerator from '../components/AIItineraryGenerator';

const DestinationDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [destination, setDestination] = useState(null);
    const [relatedStays, setRelatedStays] = useState([]);
    const [filteredStays, setFilteredStays] = useState([]);
    const [relatedExperiences, setRelatedExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [spotSearch, setSpotSearch] = useState('');
    const [stayFilter, setStayFilter] = useState('All');
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);

    const { scrollY } = useScroll();
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
    const heroScale = useTransform(scrollY, [0, 400], [1, 1.1]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const destData = await destinationsAPI.getDestinationById(id);
                setDestination(destData);

                // Fetch related content by location search
                const [stays, experiences] = await Promise.all([
                    listingsAPI.getAllListings(destData.name),
                    experiencesAPI.getAllExperiences()
                ]);

                setRelatedStays(stays);
                setFilteredStays(stays.slice(0, 4));
                setRelatedExperiences(experiences.filter(exp =>
                    exp.location.toLowerCase().includes(destData.name.toLowerCase())
                ).slice(0, 4));

            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        if (!relatedStays.length) return;

        let filtered = [...relatedStays];
        if (stayFilter !== 'All') {
            filtered = filtered.filter(stay => stay.category === stayFilter);
        }
        setFilteredStays(filtered.slice(0, 4));
    }, [stayFilter, relatedStays]);

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} style={{ width: 40, height: 40, border: '3px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%' }} />
        </div>
    );
    if (!destination) return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: 'white', textAlign: 'center' }}>
            <h2 style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', marginBottom: '20px' }}>Destination Not Found</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '30px', maxWidth: '400px', lineHeight: '1.6' }}>
                It looks like this destination link is invalid or outdated. Let's get you back on track.
            </p>
            <button
                onClick={() => navigate('/destinations')}
                style={{
                    padding: '12px 30px', background: 'var(--primary)', color: 'white',
                    border: 'none', borderRadius: '50px', fontWeight: 'bold', fontSize: '16px',
                    cursor: 'pointer'
                }}
            >
                Back to Destinations
            </button>
        </div>
    );

    return (
        <div style={{ backgroundColor: '#0a0a0a', color: 'white', minHeight: '100vh' }}>
            <SEO
                title={`${destination.name} - Premium Travel Guide | Aanandham.go`}
                description={destination.description}
                image={destination.image}
            />

            {/* Immersive Hero */}
            <div style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
                <motion.div style={{ position: 'absolute', inset: 0, opacity: heroOpacity, scale: heroScale }}>
                    <img src={destination.image} alt={destination.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 50%, #0a0a0a 100%)' }} />
                </motion.div>

                <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 2 }}>
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                        <span style={{ color: 'var(--primary)', fontWeight: '800', letterSpacing: '8px', textTransform: 'uppercase', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
                            Destination Guide
                        </span>
                        <h1 style={{ fontSize: 'clamp(64px, 12vw, 150px)', fontWeight: '900', fontFamily: 'var(--font-serif)', lineHeight: '0.8', marginBottom: '40px', letterSpacing: '-4px' }}>
                            {destination.name}
                        </h1>
                        <p style={{ fontSize: '24px', maxWidth: '700px', lineHeight: '1.5', color: 'rgba(255,255,255,0.7)', fontWeight: '300' }}>
                            {destination.description}
                        </p>
                    </motion.div>
                </div>

                {/* Quick Facts Floating Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    style={{
                        position: 'absolute', bottom: '40px', left: '0', right: '0', zIndex: 3
                    }}
                >
                    <div className="container">
                        <div style={{
                            background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)',
                            padding: '30px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '20px'
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <span style={{ color: 'var(--primary)', display: 'block', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '5px' }}>Best Visit</span>
                                <span style={{ fontWeight: '700' }}>{destination.bestTimeToVisit}</span>
                            </div>
                            <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)' }} className="hidden-mobile" />
                            <div style={{ textAlign: 'center' }}>
                                <span style={{ color: 'var(--primary)', display: 'block', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '5px' }}>Currency</span>
                                <span style={{ fontWeight: '700' }}>{destination.currency}</span>
                            </div>
                            <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)' }} className="hidden-mobile" />
                            <div style={{ textAlign: 'center' }}>
                                <span style={{ color: 'var(--primary)', display: 'block', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '5px' }}>Language</span>
                                <span style={{ fontWeight: '700' }}>{destination.language}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Content Sections */}
            <div className="container" style={{ padding: '100px 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '80px' }} className="destination-grid-responsive">
                    <div>
                        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ marginBottom: '80px' }}>
                            <h2 style={{ fontSize: '42px', fontFamily: 'var(--font-serif)', marginBottom: '30px' }}>The Essence of {destination.name}</h2>
                            <p style={{ fontSize: '20px', lineHeight: '1.8', color: 'rgba(255,255,255,0.7)', whiteSpace: 'pre-line' }}>
                                {destination.details}
                            </p>
                        </motion.section>

                        {/* Top Places Section */}
                        {destination.topPlaces?.length > 0 && (
                            <section style={{ marginBottom: '80px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                                    <h2 style={{ fontSize: '32px', fontFamily: 'var(--font-serif)' }}>Must-Visit Spots</h2>
                                    <div style={{ position: 'relative', width: '300px' }}>
                                        <FaMapMarkerAlt style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.6 }} />
                                        <input
                                            type="text"
                                            placeholder="Search spots..."
                                            value={spotSearch}
                                            onChange={(e) => setSpotSearch(e.target.value)}
                                            style={{
                                                width: '100%', padding: '12px 15px 12px 45px', borderRadius: '15px',
                                                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                                color: 'white', fontSize: '14px'
                                            }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gap: '30px' }}>
                                    {destination.topPlaces
                                        .filter(place => place.name.toLowerCase().includes(spotSearch.toLowerCase()))
                                        .map((place, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -30 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: i * 0.1 }}
                                                style={{
                                                    background: 'rgba(255,255,255,0.02)', borderRadius: '32px',
                                                    overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)',
                                                    display: 'flex', height: '240px'
                                                }}
                                                className="destination-grid-responsive"
                                            >
                                                <div style={{ flex: 1 }}>
                                                    <img src={place.image} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                                <div style={{ flex: 1.5, padding: '40px' }}>
                                                    <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '15px' }}>{place.name}</h3>
                                                    <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}>{place.description}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <aside>
                        <div style={{ position: 'sticky', top: '100px' }}>
                            <div style={{
                                background: 'rgba(212, 175, 55, 0.03)', padding: '50px',
                                borderRadius: '40px', border: '1px solid rgba(212, 175, 55, 0.1)'
                            }}>
                                <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '30px' }}>Plan Your Escape</h3>
                                <div style={{ display: 'grid', gap: '20px' }}>
                                    {destination.highlights?.map((h, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }} />
                                            <span style={{ fontSize: '18px', fontWeight: '500', color: 'rgba(255,255,255,0.8)' }}>{h}</span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => navigate(`/hotels?search=${encodeURIComponent(destination.name)}`)}
                                    style={{
                                        width: '100%', padding: '24px', marginTop: '50px',
                                        background: 'var(--primary)', border: 'none', borderRadius: '20px',
                                        color: 'white', fontWeight: '800', cursor: 'pointer',
                                        boxShadow: '0 10px 30px rgba(212, 175, 55, 0.3)', transition: 'all 0.3s',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    View Stays & Packages
                                </button>

                                <button
                                    onClick={() => setIsAIModalOpen(true)}
                                    style={{
                                        width: '100%', padding: '20px', marginTop: '15px',
                                        background: 'transparent', border: '1px solid var(--primary)', borderRadius: '20px',
                                        color: 'var(--primary)', fontWeight: '700', cursor: 'pointer',
                                        transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
                                        e.currentTarget.style.transform = 'translateY(-3px)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    <FaCompass /> Plan My Trip with AI
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Bento Gallery Section */}
                {destination.gallery?.length > 0 && (
                    <section style={{ marginTop: '100px' }}>
                        <h2 style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', marginBottom: '50px', textAlign: 'center' }}>Visual Journey</h2>
                        <div style={{
                            display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px', height: '600px'
                        }}>
                            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ gridColumn: 'span 8', gridRow: 'span 2', borderRadius: '32px', overflow: 'hidden' }}>
                                <img src={destination.gallery[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </motion.div>
                            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ gridColumn: 'span 4', borderRadius: '32px', overflow: 'hidden' }}>
                                <img src={destination.gallery[1]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </motion.div>
                            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ gridColumn: 'span 4', borderRadius: '32px', overflow: 'hidden' }}>
                                <img src={destination.gallery[2]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </motion.div>
                        </div>
                    </section>
                )}

                {/* Related Stays */}
                {relatedStays.length > 0 && (
                    <section style={{ marginTop: '120px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px', flexWrap: 'wrap', gap: '30px' }}>
                            <div>
                                <h2 style={{ fontSize: '42px', fontFamily: 'var(--font-serif)', marginBottom: '10px' }}>Premier Stays</h2>
                                <p style={{ color: 'rgba(255,255,255,0.5)' }}>Handpicked luxury accommodations in {destination.name}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {['All', 'Luxury', 'Resort', 'Homestay', 'Boutique'].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setStayFilter(cat)}
                                        style={{
                                            padding: '10px 20px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)',
                                            background: stayFilter === cat ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                            color: stayFilter === cat ? 'black' : 'white', fontWeight: '700', cursor: 'pointer',
                                            fontSize: '14px', transition: 'all 0.3s'
                                        }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                            {filteredStays.map((stay, i) => (
                                <Link to={`/listing/${stay._id}`} key={stay._id} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <motion.div
                                        whileHover={{ y: -10 }}
                                        style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', overflow: 'hidden', background: '#111' }}
                                    >
                                        <div style={{ height: '250px' }}>
                                            <img src={stay.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ padding: '30px' }}>
                                            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '10px' }}>{stay.title}</h3>
                                            <p style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '18px' }}>₹{stay.price.toLocaleString()} <span style={{ fontSize: '12px', color: '#666' }}>/ night</span></p>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
                {/* AI Itinerary Modal */}
                <AIItineraryGenerator
                    isOpen={isAIModalOpen}
                    onClose={() => setIsAIModalOpen(false)}
                    destination={destination}
                    spots={destination.topPlaces || []}
                    stays={relatedStays}
                />
            </div>
        </div>
    );
};

export default DestinationDetailsPage;
