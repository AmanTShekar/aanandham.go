import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import { useListings } from '../hooks/useListings';
import DateRangeSelector from '../components/SearchWidget/DateRangeSelector';
import GuestSelector from '../components/SearchWidget/GuestSelector';
import PremiumListingCard from '../components/PremiumListingCard';
import EventModal from '../components/EventModal';
import { events, sightseeing, whyChooseUs, topSeoListings } from '../data/siteContent';
import Gallery from '../components/Gallery';
import PreviousEvents from '../components/PreviousEvents';
import { experiencesAPI } from '../services/api';
import SEO from '../components/SEO';

const HomePage = () => {
    const [searchParams] = useSearchParams() || [new URLSearchParams()];
    const [location, setLocation] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [liveEvents, setLiveEvents] = useState([]);
    const [activeEventIndex, setActiveEventIndex] = useState(0); // For dots
    const navigate = useNavigate();

    // Custom Hook for Data Fetching
    const { listings: featuredHotels, loading: loadingFeatured } = useListings();

    const eventsScrollRef = useRef(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await experiencesAPI.getAllExperiences();
                // Filter for Camping/Nature vibes
                const natureEvents = data.filter(e =>
                    ['Trek', 'Event', 'Camping', 'Glamping', 'Adventure'].includes(e.category) ||
                    e.title.toLowerCase().includes('camp') ||
                    e.title.toLowerCase().includes('trek')
                );

                if (natureEvents.length > 0) {
                    setLiveEvents(natureEvents);
                } else {
                    console.warn("No live events found in DB, using fallback static content.");
                    setLiveEvents(events);
                }
            } catch (error) {
                console.error("Failed to load live events, using fallback", error);
                setLiveEvents(events);
            }
        };
        fetchEvents();
    }, []);

    // Handle Scroll for Dots
    const handleEventScroll = () => {
        if (eventsScrollRef.current) {
            const scrollLeft = eventsScrollRef.current.scrollLeft;
            const firstCard = eventsScrollRef.current.firstElementChild;
            if (!firstCard) return;

            const gap = window.innerWidth < 768 ? 16 : 30;
            const cardWidth = firstCard.offsetWidth + gap;

            const index = Math.round(scrollLeft / cardWidth);
            setActiveEventIndex(Math.max(0, Math.min(index, liveEvents.length - 1)));
        }
    };

    const scrollEvents = (direction) => {
        if (eventsScrollRef.current) {
            const { current } = eventsScrollRef;
            const scrollAmount = 350 + 30; // card width + gap
            current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (location) params.append('search', location);
        if (checkIn) params.append('checkIn', checkIn);
        if (checkOut) params.append('checkOut', checkOut);
        if (guests) params.append('guests', guests);

        navigate(`/hotels?${params.toString()}`);
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh', overflowX: 'hidden' }}>
            <SEO
                title="Aanandham.go - Luxury Camping in Munnar, Suryanelli Tent Stays"
                description="The best luxury camping in Munnar. Book safe tent stays in Suryanelli, sunrise treks at Kolukkumalai, and glamping experiences with Aanandham."
                keywords="Munnar Camping, Suryanelli Tent Stay, Kolukkumalai Trek, Glamping Kerala, Munnar Tent Houses, Safe Camping Munnar, Aanandham"
            />
            <AnimatePresence>
                {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
            </AnimatePresence>

            {/* Hero Section - Fixed Overflow and Z-Index */}
            <div style={{
                minHeight: '100vh',
                width: '100%',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '120px 20px 60px 20px',
                backgroundColor: '#000'
            }}>
                {/* ... Hero Background & Content ... */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2670&q=80")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.5)',
                    zIndex: 0
                }}></div>

                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '1200px' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <h1 style={{
                            fontSize: 'clamp(48px, 6vw, 96px)',
                            fontWeight: '900',
                            color: 'white',
                            marginBottom: '24px',
                            letterSpacing: '-2px',
                            textShadow: '0 10px 40px rgba(0,0,0,0.6)',
                            textTransform: 'uppercase',
                            lineHeight: '0.9'
                        }}>
                            Experience Munnar
                        </h1>
                        <p style={{
                            fontSize: 'clamp(18px, 2vw, 24px)',
                            color: 'rgba(255,255,255,0.9)',
                            fontWeight: '300',
                            maxWidth: '700px',
                            margin: '0 auto 48px auto',
                            lineHeight: '1.6',
                            letterSpacing: '1px'
                        }}>
                            Verified <strong>Camping & Luxury Glamping in Munnar</strong>. Experience <strong>Suryanelli Tent Stays</strong> & <strong>Kolukkumalai Sunrise Treks</strong>.
                        </p>
                    </div>

                    {/* Premium Search/Booking Widget */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="search-widget-responsive"
                        style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(12px)',
                            borderRadius: '50px',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            padding: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.5)'
                        }}
                    >
                        {/* ... Search Inputs ... */}
                        {/* Location */}
                        <div style={{ flex: 1, padding: '14px 24px', position: 'relative', borderRight: '1px solid #ddd' }}>
                            <div style={{ fontSize: '12px', fontWeight: '800', marginBottom: '2px', color: '#000' }}>WHERE</div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    placeholder="Search destinations"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    style={{
                                        width: '100%', border: 'none', outline: 'none', fontSize: '14px', color: '#222', fontWeight: '400', background: 'transparent'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Check In/Out */}
                        <div style={{ flex: 1.5, padding: '14px 24px', position: 'relative', borderRight: '1px solid #ddd' }}>
                            <div style={{ fontSize: '12px', fontWeight: '800', marginBottom: '2px', color: '#000' }}>CHECK IN - OUT</div>
                            <DateRangeSelector
                                checkIn={checkIn}
                                checkOut={checkOut}
                                setCheckIn={setCheckIn}
                                setCheckOut={setCheckOut}
                            />
                        </div>

                        {/* Guests */}
                        <div style={{ flex: 1, padding: '14px 24px', position: 'relative' }}>
                            <div style={{ fontSize: '12px', fontWeight: '800', marginBottom: '2px', color: '#000' }}>GUESTS</div>
                            <GuestSelector guests={guests} setGuests={setGuests} />
                        </div>

                        {/* Search Button */}
                        <button style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            marginRight: '8px',
                            transition: 'transform 0.2s',
                            flexShrink: 0
                        }}
                            onClick={handleSearch}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <FaSearch size={18} />
                        </button>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}
                >
                    <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                        <FaChevronDown color="rgba(255,255,255,0.6)" size={24} />
                    </motion.div>
                </motion.div>
            </div>



            {/* Live Events Section (Premium Horizontal Scroll) */}
            <section className="section-responsive" style={{ background: '#0a0a0a', borderBottom: '1px solid #262626' }}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '50px' }}
                    >
                        <div style={{ marginBottom: '24px' }}>
                            <span style={{ color: 'var(--primary)', fontWeight: '700', letterSpacing: '2px', fontSize: '12px', textTransform: 'uppercase' }}>HAPPENING NOW</span>
                            <h2 style={{ fontSize: '48px', fontWeight: '800', color: 'white', marginTop: '8px' }}>Live in Munnar</h2>
                        </div>
                    </motion.div>

                    <div style={{ position: 'relative' }}>
                        <div
                            className="horizontal-scroll-container"
                            ref={eventsScrollRef}
                            onScroll={handleEventScroll}
                        >
                            {liveEvents.length > 0 ? (
                                liveEvents.map((evt, i) => (
                                    <motion.div
                                        key={evt._id || i}
                                        whileHover={{ y: -10 }}
                                        onClick={() => setSelectedEvent(evt)}
                                        className="events-scroll-card"
                                        itemScope
                                        itemType="http://schema.org/Event"
                                    >
                                        <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                                            <img
                                                src={evt.image}
                                                alt={evt.title}
                                                itemProp="image"
                                                loading="lazy"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                                            />
                                            <meta itemProp="startDate" content={new Date().toISOString()} />
                                        </div>
                                        <div className="event-card-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                                <div style={{ padding: '6px 12px', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--primary)', borderRadius: '8px', fontSize: '12px', fontWeight: '700' }}>
                                                    {evt.duration ? `${evt.duration}` : 'Event'}
                                                </div>
                                                <div style={{ padding: '6px 12px', background: 'var(--bg-glass)', color: 'white', borderRadius: '8px', fontSize: '12px', fontWeight: '700', border: '1px solid var(--border)' }} itemProp="offers" itemScope itemType="http://schema.org/Offer">
                                                    <meta itemProp="priceCurrency" content="INR" />
                                                    <span itemProp="price">₹{evt.price}</span>
                                                </div>
                                            </div>
                                            <h3 className="event-card-title" itemProp="name">{evt.title}</h3>
                                            <p style={{ color: '#a1a1aa', fontSize: '14px' }} itemProp="location" itemScope itemType="http://schema.org/Place">
                                                <span itemProp="name">{evt.location}</span>
                                                <meta itemProp="address" content="Munnar, Kerala" />
                                            </p>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div style={{ color: '#666', padding: '20px' }}>No live events at the moment.</div>
                            )}
                        </div>

                        {/* Dots Indicator */}
                        {liveEvents.length > 0 && (
                            <div className="mobile-only" style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '30px' }}>
                                {liveEvents.map((_, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            width: idx === activeEventIndex ? '24px' : '8px',
                                            height: '8px',
                                            borderRadius: '4px',
                                            background: idx === activeEventIndex ? 'var(--primary)' : '#333',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => {
                                            if (eventsScrollRef.current) {
                                                const firstCard = eventsScrollRef.current.firstElementChild;
                                                const gap = window.innerWidth < 768 ? 16 : 30;
                                                const cardWidth = firstCard ? firstCard.offsetWidth + gap : 380;
                                                eventsScrollRef.current.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
                                            }
                                        }}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Navigation Arrows */}
                        <button
                            onClick={() => scrollEvents('left')}
                            className="desktop-only"
                            style={{
                                position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)',
                                width: '48px', height: '48px', borderRadius: '50%', background: 'white', border: 'none',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                zIndex: 10
                            }}
                        >
                            <FaChevronLeft size={20} color="#222" />
                        </button>
                        <button
                            onClick={() => scrollEvents('right')}
                            className="desktop-only"
                            style={{
                                position: 'absolute', right: '-20px', top: '50%', transform: 'translateY(-50%)',
                                width: '48px', height: '48px', borderRadius: '50%', background: 'white', border: 'none',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                zIndex: 10
                            }}
                        >
                            <FaChevronRight size={20} color="#222" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Previous Events Section */}
            <PreviousEvents />

            {/* Gallery Section */}
            <Gallery />

            {/* Why Choose Annadnam */}
            {/* Why Choose Annadnam */}
            <section className="section-responsive" style={{ background: 'var(--bg-dark)' }}>
                <div className="container">
                    <div className="grid-2col-responsive">
                        <div>
                            <span style={{ color: 'var(--primary)', fontWeight: '700', letterSpacing: '2px', fontSize: '12px', textTransform: 'uppercase' }}>WHY ANNADNAM</span>
                            <h2 style={{ fontSize: '48px', fontWeight: '900', color: 'var(--text-main)', margin: '16px 0 32px 0', lineHeight: '1.1', whiteSpace: 'pre-line' }}>
                                {whyChooseUs.title}
                            </h2>
                            <p style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '40px' }}>
                                {whyChooseUs.description}
                            </p>

                            <div className="features-grid-responsive">
                                {whyChooseUs.features.map((feature, i) => (
                                    <div key={i}>
                                        <h4 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-main)' }}>{feature.title}</h4>
                                        <p style={{ color: 'var(--text-secondary)' }}>{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="feature-images-grid">
                            <img src={whyChooseUs.images[0]} alt="Luxury Glamping Tent in Munnar" loading="lazy" style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '24px', transform: 'translateY(40px)' }} />
                            <img src={whyChooseUs.images[1]} alt="Campfire and Stargazing at Suryanelli" loading="lazy" style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '24px' }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Sightseeing Section */}
            <section className="section-responsive" style={{ background: 'var(--bg-off-white)' }}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ textAlign: 'center', marginBottom: '60px' }}
                    >
                        <h2 style={{ fontSize: '40px', fontWeight: '800', marginBottom: '16px', color: 'var(--text-main)' }}>Explore the Unseen</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>Handpicked spots in Munnar and Suryanelli for the true explorer.</p>
                    </motion.div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                        {sightseeing.map((spot, i) => (
                            <motion.div
                                key={spot.id || i}
                                whileHover={{ y: -8 }}
                                style={{ height: '400px', borderRadius: '30px', position: 'relative', overflow: 'hidden', cursor: 'pointer', boxShadow: 'var(--shadow-lg)' }}
                            >
                                <img src={spot.image} alt={spot.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    padding: '30px',
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent)',
                                    color: 'white'
                                }}>
                                    <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>{spot.title}</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>{spot.location}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Hotels Section */}
            <div className="section-responsive" style={{ backgroundColor: 'var(--bg-dark)', textAlign: 'center' }}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 style={{ fontSize: '40px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '24px' }}>Recommended Camping & Tent Stays</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '20px', maxWidth: '600px', margin: '0 auto 60px auto' }}>
                            Experience the best of Munnar with our verified luxury tent selections.
                        </p>

                        {/* Featured Listings Grid - Now using Real DB Listings */}
                        <div className="listings-grid-responsive" style={{ marginBottom: '60px' }}>
                            {loadingFeatured ? (
                                <div style={{ color: 'var(--text-secondary)', padding: '40px' }}>Loading best stays...</div>
                            ) : (
                                featuredHotels && featuredHotels
                                    .filter(l => l.category === 'Camping' || l.category === 'Glamping' || l.title.toLowerCase().includes('camp') || l.title.toLowerCase().includes('tent'))
                                    .length > 0 ? (
                                    featuredHotels
                                        .filter(l => l.category === 'Camping' || l.category === 'Glamping' || l.title.toLowerCase().includes('camp') || l.title.toLowerCase().includes('tent'))
                                        .slice(0, 3)
                                        .map((listing, i) => (
                                            <PremiumListingCard key={listing._id} listing={listing} index={i} />
                                        ))
                                ) : (
                                    <div style={{ color: 'var(--text-secondary)' }}>No featured camping stays available.</div>
                                )
                            )}
                        </div>

                        {/* Explore More Button */}
                        <Link to="/hotels" style={{
                            display: 'inline-block',
                            backgroundColor: 'var(--primary)',
                            color: 'white',
                            padding: '18px 50px',
                            borderRadius: '50px',
                            fontSize: '18px',
                            fontWeight: '700',
                            textDecoration: 'none',
                            transition: 'all 0.3s',
                            boxShadow: '0 10px 30px rgba(212, 175, 55, 0.3)'
                        }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 15px 40px rgba(212, 175, 55, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 10px 30px rgba(212, 175, 55, 0.3)';
                            }}
                        >
                            View All Stays
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};


export default HomePage;
