import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useListings } from '../hooks/useListings';
import DateRangeSelector from '../components/SearchWidget/DateRangeSelector';
import GuestSelector from '../components/SearchWidget/GuestSelector';
import PremiumListingCard from '../components/PremiumListingCard';
import EventModal from '../components/EventModal';
import { siteContentAPI, experiencesAPI } from '../services/api';
// Fallback data
import { events as defaultEvents, sightseeing as defaultSightseeing } from '../data/siteContent';
import PreviousEvents from '../components/PreviousEvents';
import Gallery from '../components/Gallery';
import SEO from '../components/SEO';


const destinations = [
    {
        name: 'Athirappilly',
        img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Athirappilly_Waterfalls.jpg',
        desc: 'Witness the majesty of the "Niagara of India", a thundering cascade amidst lush rainforests.',
        detailedDescription: 'Athirappilly Falls, situated on the Chalakudy River, is the largest waterfall in Kerala. Standing 80 feet tall, it creates a spectacular curtain of water that thunders down into the river below. The surrounding Sholayar ranges are a biodiversity hotspot, home to endangered hornbills and diverse flora.',
        highlights: ['80ft Waterfall', 'Rainforest Trek', 'Biodiversity Hotspot', 'Bahubali Filming Location'],
        galleryImages: [
            'https://commons.wikimedia.org/wiki/Special:FilePath/Athirappilly_Water_falls_Top_View.jpg',
            'https://commons.wikimedia.org/wiki/Special:FilePath/Athirappilly_Waterfalls_in_2010_January_-_View_from_Top_01.jpg'
        ]
    },
    {
        name: 'Munnar',
        img: 'https://commons.wikimedia.org/wiki/Special:FilePath/TEA_GARDEN_MUNNAR.JPG',
        desc: 'Endless rolling hills of emerald tea gardens, misty mountains, and cool climate.',
        detailedDescription: 'Munnar is a haven of peace and tranquility, famous for its sprawling tea plantations, pristine valleys, and mountains. Once the summer resort of the British Government in South India, it offers breathtaking views and a cool climate year-round.',
        highlights: ['Tea Museum', 'Eravikulam National Park', 'Mattupetty Dam', 'Top Station'],
        galleryImages: [
            'https://commons.wikimedia.org/wiki/Special:FilePath/Munnar_Top_station.jpg',
            'https://commons.wikimedia.org/wiki/Special:FilePath/Top_Station_Cliffs_at_Munnar.jpg'
        ]
    },
    {
        name: 'Wayanad',
        img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Wayanad_scenery.JPG',
        desc: 'A green paradise of wildlife sanctuaries, spice plantations, and ancient caves.',
        detailedDescription: 'Wayanad is a picturesque plateau nestled among the mountains of the Western Ghats. It is known for its waterfalls, caves, spice plantations, and wildlife. The Edakkal Caves contain ancient petroglyphs dating back to the Neolithic age.',
        highlights: ['Edakkal Caves', 'Banasura Sagar Dam', 'Wayanad Wildlife Sanctuary', 'Chembra Peak'],
        galleryImages: [
            'https://commons.wikimedia.org/wiki/Special:FilePath/Edakkal_caves.JPG',
            'https://commons.wikimedia.org/wiki/Special:FilePath/Edakkal_Caves_Inside_1.jpg'
        ]
    },
    {
        name: 'Vagamon',
        img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hills_Vagamon.jpg',
        desc: 'Serene pine forests, green meadows, and mist-covered valleys perfect for a quiet getaway.',
        detailedDescription: 'Vagamon is a hill station located in Peerumade taluk of Idukki district. It is a destination for those seeking tranquility and nature. The pine forests, meadows, and suicide point are major attractions.',
        highlights: ['Pine Forest', 'Vagamon Meadows', 'Thangal Para', 'Kurisumala'],
        galleryImages: [
            'https://commons.wikimedia.org/wiki/Special:FilePath/Vagamon_Pine_Forest.jpg',
            'https://commons.wikimedia.org/wiki/Special:FilePath/Vagamon-pine_forest.jpg'
        ]
    },
    {
        name: 'Alleppey',
        img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Alleppey_Backwaters.jpg',
        desc: 'Cruise through the Venice of the East on a traditional houseboat amidst swaying palms.',
        detailedDescription: 'Alappuzha (Alleppey) is famous for its boat races, backwater holidays, beaches, marine products, and coir industry. A houseboat cruise along the backwaters is a delightful experience.',
        highlights: ['Houseboat Cruise', 'Alappuzha Beach', 'Snake Boat Race', 'Kuttanad'],
        galleryImages: [
            'https://commons.wikimedia.org/wiki/Special:FilePath/Alleppey_Boat_houses.jpg',
            'https://commons.wikimedia.org/wiki/Special:FilePath/Alappuzha_Boat_Beauty_W.jpg'
        ]
    },
    {
        name: 'Varkala',
        img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Varkala_Beach.jpg',
        desc: 'The only place in Kerala where cliffs meet the Arabian Sea. A surfer\'s and backpacker\'s paradise.',
        detailedDescription: 'Varkala is a coastal town in Thiruvananthapuram district. It is the only place in southern Kerala where cliffs are found adjacent to the Arabian Sea. These cliffs are a unique geological feature.',
        highlights: ['Varkala Cliff', 'Papanasam Beach', 'Janardanaswamy Temple', 'Surfing'],
        galleryImages: [
            'https://commons.wikimedia.org/wiki/Special:FilePath/Varkala_Cliff.jpg',
            'https://commons.wikimedia.org/wiki/Special:FilePath/Panoramic_view_of_varkala_beach_cliff.jpg'
        ]
    },
    {
        name: 'Thekkady',
        img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Thekkady,_Periyar_Lake.JPG',
        desc: 'Home to the Periyar Tiger Reserve. Experience bamboo rafting and elephant sightings in the wild.',
        detailedDescription: 'Thekkady is the location of the Periyar National Park, which is an important tourist attraction in the Kerala state of India. It is famous for its dense evergreen, semi-evergreen, moist deciduous forests and savanna grass lands.',
        highlights: ['Periyar Tiger Reserve', 'Bamboo Rafting', 'Elephant Safari', 'Spice Plantations'],
        galleryImages: [
            'https://commons.wikimedia.org/wiki/Special:FilePath/Elephas_maximus_indicus_-Periyar_National_Park_-India-8.jpg',
            'https://commons.wikimedia.org/wiki/Special:FilePath/In_The_Woods!_-_Periyar_Elephant_Reserve.jpg'
        ]
    },
    {
        name: 'Kumarakom',
        img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kumarakom.JPG',
        desc: 'A birdwatcher\'s haven on the banks of Vembanad Lake. Famous for luxury resorts and migratory birds.',
        detailedDescription: 'Kumarakom is a popular tourism destination located near the city of Kottayam, in Kerala, India, famous for its backwater tourism. It is set in the backdrop of the Vembanad Lake, the largest lake in the state of Kerala.',
        highlights: ['Kumarakom Bird Sanctuary', 'Vembanad Lake', 'Pathiramanal Island', 'Driftwood Museum'],
        galleryImages: [
            'https://commons.wikimedia.org/wiki/Special:FilePath/Kumarakom_Bird_Sanctuary.jpg',
            'https://commons.wikimedia.org/wiki/Special:FilePath/Kumarakom_Bird_Sanctuary_03.jpg'
        ]
    }
];

const DestinationModal = ({ destination, onClose }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (!destination) return null;
    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000,
            display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px',
            backdropFilter: 'blur(8px)'
        }} onClick={onClose}>
            <style>
                {`
                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .no-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}
            </style>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="no-scrollbar"
                style={{
                    backgroundColor: 'rgba(15, 15, 15, 0.85)',
                    borderRadius: '32px',
                    maxWidth: '1000px',
                    width: '100%',
                    maxHeight: '85vh',
                    overflowY: 'auto',
                    position: 'relative',
                    padding: '0',
                    boxShadow: '0 40px 80px -20px rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(20px)',
                    color: '#f0f0f0'
                }}
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} style={{
                    position: 'absolute', top: '24px', right: '24px', zIndex: 10,
                    background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '50%', width: '48px', height: '48px',
                    cursor: 'pointer', boxShadow: '0 8px 20px rgba(0,0,0,0.2)', fontSize: '24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                    backdropFilter: 'blur(8px)', transition: 'all 0.2s'
                }}
                    onMouseEnter={e => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                >×</button>

                <div style={{ height: '450px', position: 'relative' }}>
                    <img src={destination.img} alt={destination.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)',
                        padding: '60px 40px 40px 40px', color: 'white'
                    }}>
                        <h2 style={{ fontSize: '56px', fontWeight: '900', margin: 0, textShadow: '0 4px 12px rgba(0,0,0,0.5)', letterSpacing: '-1px' }}>{destination.name}</h2>
                    </div>
                </div>

                <div style={{ padding: '50px' }}>
                    <p style={{ fontSize: '20px', lineHeight: '1.8', color: '#ccc', marginBottom: '40px', fontWeight: '300' }}>
                        {destination.detailedDescription}
                    </p>

                    <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px', color: 'white', letterSpacing: '-0.5px' }}>Highlights</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '50px' }}>
                        {destination.highlights.map((highlight, idx) => (
                            <span key={idx} style={{
                                background: 'rgba(255,255,255,0.05)', padding: '12px 24px', borderRadius: '100px',
                                fontSize: '15px', fontWeight: '600', color: '#e0e0e0', border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                {highlight}
                            </span>
                        ))}
                    </div>

                    <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px', color: 'white', letterSpacing: '-0.5px' }}>Gallery</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                        {destination.galleryImages.map((img, idx) => (
                            <div key={idx} style={{ height: '240px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <img src={img} alt={`${destination.name} gallery ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                    onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const HomePage = () => {
    const [location, setLocation] = React.useState('');
    const [checkIn, setCheckIn] = React.useState('');
    const [checkOut, setCheckOut] = React.useState('');
    const [guests, setGuests] = React.useState('');
    const [selectedEvent, setSelectedEvent] = React.useState(null);
    const [liveEvents, setLiveEvents] = React.useState([]);
    const [activeEventIndex, setActiveEventIndex] = React.useState(0); // For dots
    const [width, setWidth] = useState(window.innerWidth);
    const [selectedDestination, setSelectedDestination] = useState(null);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Parallax Logic
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 1000], [0, 400]);

    // Dynamic Site Content State
    const [sightseeing, setSightseeing] = React.useState([]);
    const [travelStories, setTravelStories] = React.useState([]);
    const [whyChooseUs, setWhyChooseUs] = React.useState({
        title: '', description: '', features: [], images: []
    });

    // Custom Hook for Data Fetching
    const { listings: featuredHotels, loading: loadingFeatured } = useListings();

    const eventsScrollRef = useRef(null);

    useEffect(() => {
        // Fetch All Site Content
        const fetchContent = async () => {
            try {
                const [sightData, storyData, whyData] = await Promise.all([
                    siteContentAPI.getSightseeing(),
                    siteContentAPI.getTravelStories(),
                    siteContentAPI.getContent('whyChooseUs')
                ]);
                setSightseeing(sightData && sightData.length > 0 ? sightData : defaultSightseeing);
                setTravelStories(storyData);
                setWhyChooseUs(whyData || {});
            } catch (error) {
                console.error("Failed to fetch site content:", error);
            }
        };

        // Fetch Live Events
        const fetchEvents = async () => {
            try {
                const data = await siteContentAPI.getPreviousEvents();
                if (data && data.length > 0) {
                    setLiveEvents(data);
                } else {
                    setLiveEvents(defaultEvents);
                }
            } catch (error) {
                console.error("Failed to fetch events:", error);
                setLiveEvents(defaultEvents);
            }
        };

        fetchContent();
        fetchEvents();
    }, []);

    const handleEventClick = (index) => {
        setActiveEventIndex(index);
        if (eventsScrollRef.current) {
            const scrollAmount = 350 + 30;
            eventsScrollRef.current.scrollTo({ left: index * scrollAmount, behavior: 'smooth' });
        }
    };

    const handleEventScroll = (e) => {
        if (eventsScrollRef.current) {
            const scrollLeft = e.target.scrollLeft;
            const width = 380; // approx card width + gap
            const index = Math.round(scrollLeft / width);
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
                title="Premium Camping & Trekking in Kerala | Verified Glamping - Aanandham.go"
                description="Book verified premium camping in Munnar and Vagamon. Official partner for trip planners and travel influencers seeking safe tent stays in Kerala."
                keywords="Munnar Camping, Vagamon Camping, Vagamon Glamping, Aanandham.go, Camping Partner Kerala, Trip Planner Collaboration, Tent Stay Partner Munnar, Travel Influencer Kerala, Premium Glamping Kerala"
                schema={{
                    "@context": "https://schema.org",
                    "@type": "TravelAgency",
                    "name": "Aanandham.go",
                    "url": "https://aanandham.in",
                    "logo": "https://aanandham.in/logo.png",
                    "image": "https://aanandham.in/logo.png",
                    "description": "Kerala's most trusted platform for Glamping and Wild Trekking. Verified luxury stays in Munnar, Suryanelli, and Wayanad.",
                    "telephone": "+91 9400 987 654",
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "Suryanelli",
                        "addressLocality": "Munnar",
                        "addressRegion": "Kerala",
                        "postalCode": "685618",
                        "addressCountry": "IN"
                    },
                    "openingHoursSpecification": {
                        "@type": "OpeningHoursSpecification",
                        "dayOfWeek": [
                            "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
                        ],
                        "opens": "00:00",
                        "closes": "23:59"
                    },
                    "sameAs": [
                        "https://www.instagram.com/aanandham.go/",
                        "https://facebook.com/aanandham.go"
                    ],
                    "offers": {
                        "@type": "Offer",
                        "itemOffered": [
                            {
                                "@type": "Service",
                                "name": "Munnar Tent Camping",
                                "description": "Verified luxury tent stays in Suryanelli and Munnar."
                            },
                            {
                                "@type": "Service",
                                "name": "Kolukkumalai Sunrise Trek",
                                "description": "High-altitude jeep safari and trekking experience."
                            }
                        ]
                    }
                }}
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
                backgroundColor: '#000',
                overflow: 'hidden'
            }}>
                {/* ... Hero Background & Content ... */}
                <motion.div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'url("/images/hero/hero_camping_night.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.5)',
                    zIndex: 0,
                    y: y,
                    scale: 1.1 // Slight scale to prevent white edges
                }}></motion.div>

                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '1200px' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <h1 style={{
                            fontSize: 'clamp(36px, 5vw, 72px)',
                            fontWeight: '900',
                            color: 'white',
                            marginBottom: '24px',
                            letterSpacing: '-1px',
                            textShadow: '0 10px 40px rgba(0,0,0,0.6)',
                            textTransform: 'uppercase',
                            lineHeight: '1.1'
                        }}>
                            Welcome to <span style={{ color: 'var(--primary)' }}>Aanandham.go</span><br />
                            Curated Wilderness in Kerala
                        </h1>
                        <p style={{
                            fontSize: 'clamp(18px, 2vw, 24px)',
                            color: 'rgba(255,255,255,0.95)',
                            fontWeight: '300',
                            maxWidth: '600px',
                            margin: '0 auto 48px auto',
                            lineHeight: '1.6',
                            letterSpacing: '1px'
                        }}>
                            Verified Glamping & Trekking Expeditions.
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
                                    onFocus={() => {
                                        if (!location) setLocation(''); // Trigger menu if empty
                                    }}
                                    style={{
                                        width: '100%', border: 'none', outline: 'none', fontSize: '14px', color: '#222', fontWeight: '400', background: 'transparent'
                                    }}
                                />
                            </div>
                            {/* Simple Inline Suggestions */}
                            {!location && (
                                <div style={{
                                    display: 'flex', gap: '8px', marginTop: '4px', overflowX: 'auto',
                                    scrollbarWidth: 'none', msOverflowStyle: 'none'
                                }}>
                                    {['Munnar', 'Vagamon', 'Wayanad', 'Kerala'].map(loc => (
                                        <button
                                            key={loc}
                                            onClick={() => setLocation(loc)}
                                            style={{
                                                fontSize: '10px', padding: '2px 8px', borderRadius: '4px',
                                                background: '#f0f0f0', border: 'none', cursor: 'pointer',
                                                whiteSpace: 'nowrap', color: '#666'
                                            }}
                                        >
                                            {loc}
                                        </button>
                                    ))}
                                </div>
                            )}
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
                            <span style={{ color: 'var(--primary)', fontWeight: '800', letterSpacing: '4px', fontSize: '14px', textTransform: 'uppercase', textShadow: '0 2px 10px rgba(212, 175, 55, 0.3)' }}>HAPPENING NOW</span>
                            <h2 style={{ fontSize: 'clamp(48px, 6vw, 80px)', fontFamily: 'var(--font-serif)', fontWeight: '900', color: 'white', marginTop: '16px', letterSpacing: '-1px', lineHeight: '1' }}>Live in Kerala's Wild</h2>
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
                                        <meta itemProp="eventStatus" content="https://schema.org/EventScheduled" />
                                        <meta itemProp="description" content={evt.description || evt.title} />
                                        <div itemProp="organizer" itemScope itemType="http://schema.org/Organization">
                                            <meta itemProp="name" content="Aanandham.go" />
                                        </div>
                                        <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                                            <img
                                                src={evt.image}
                                                alt={evt.title}
                                                itemProp="image"
                                                loading="lazy"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                                            />
                                            <meta itemProp="startDate" content={new Date().toISOString()} />
                                            <meta itemProp="endDate" content={new Date(Date.now() + 14400000).toISOString()} />
                                        </div>
                                        <div className="event-card-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                                <div style={{ padding: '6px 12px', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--primary)', borderRadius: '8px', fontSize: '12px', fontWeight: '700' }}>
                                                    {evt.duration ? `${evt.duration}` : 'Event'}
                                                </div>
                                                <div style={{ padding: '6px 12px', background: 'var(--bg-glass)', color: 'white', borderRadius: '8px', fontSize: '12px', fontWeight: '700', border: '1px solid var(--border)' }} itemProp="offers" itemScope itemType="http://schema.org/Offer">
                                                    <meta itemProp="priceCurrency" content="INR" />
                                                    <meta itemProp="price" content={evt.price ? String(evt.price).replace(/[^0-9]/g, '') : '0'} />
                                                    <meta itemProp="url" content="https://aanandham.go/" />
                                                    <meta itemProp="availability" content="https://schema.org/InStock" />
                                                    <span>{evt.price}</span>
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

                        {liveEvents.length > 0 && width < 768 && (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '30px' }}>
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



            {/* Featured Hotels Section */}
            <div className="section-responsive" style={{ backgroundColor: 'var(--bg-dark)', textAlign: 'center' }}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 style={{ fontSize: '40px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '24px' }}>Verified Stays in Kerala</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '20px', maxWidth: '700px', margin: '0 auto 60px auto' }}>
                            Discover the best <strong>IV-Verified Glamping</strong> spots and <strong>Trekking Camps</strong> across Kerala.
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

            {/* Previous Events Section */}
            <PreviousEvents />

            {/* Gallery Section */}
            <Gallery />

            {/* SEO Blog / Travel Stories Section */}
            <section className="section-responsive" style={{ background: '#000', padding: '80px 0' }}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ textAlign: 'center', marginBottom: '60px' }}
                    >
                        <span style={{ color: 'var(--primary)', fontWeight: '700', letterSpacing: '2px', fontSize: '12px', textTransform: 'uppercase' }}>TRAVEL DIARIES</span>
                        <h2 style={{ fontSize: '40px', fontWeight: '800', color: 'white', marginTop: '16px', marginBottom: '16px' }}>Stories from the Wild</h2>
                        <p style={{ color: '#a1a1aa', fontSize: '18px' }}>
                            Read about <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Munnar Trekking</a>, camping tips, and our guests' <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Instagram favorites</a>.
                        </p>
                        <Link to="/stories" style={{ marginTop: '30px', display: 'inline-block', color: 'var(--primary)', fontWeight: '700', textDecoration: 'none', borderBottom: '1px solid var(--primary)' }}>
                            View All Stories &rarr;
                        </Link>
                    </motion.div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                        {travelStories.length > 0 ? (
                            travelStories.slice(0, 4).map((story, i) => {
                                const isInternal = story.link && story.link.startsWith('/');
                                const CardContent = (
                                    <motion.div whileHover={{ y: -5 }} style={{ background: '#111', borderRadius: '20px', overflow: 'hidden', height: '100%', cursor: 'pointer' }}>
                                        <div style={{ height: '200px', position: 'relative' }}>
                                            <img src={story.image} alt={story.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                                            <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'var(--primary)', color: 'black', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: '700' }}>
                                                {story.category}
                                            </div>
                                        </div>
                                        <div style={{ padding: '24px' }}>
                                            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '12px', lineHeight: '1.4' }}>{story.title}</h3>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ color: '#666', fontSize: '12px' }}>{story.date}</span>
                                                <span style={{ color: 'var(--primary)', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>Read Story →</span>
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
                            <div style={{ color: '#666', gridColumn: '1/-1', textAlign: 'center' }}>Loading stories...</div>
                        )}
                    </div>
                </div>
            </section>

            {/* Why Choose Aanandham */}
            {/* Why Choose Aanandham */}
            <section className="section-responsive" style={{ background: 'var(--bg-dark)' }}>
                <div className="container">
                    <div className="grid-2col-responsive">
                        <div>
                            <span style={{ color: 'var(--primary)', fontWeight: '700', letterSpacing: '2px', fontSize: '12px', textTransform: 'uppercase' }}>WHY AANANDHAM.GO</span>
                            <h2 style={{ fontSize: '48px', fontWeight: '900', color: 'var(--text-main)', margin: '16px 0 32px 0', lineHeight: '1.1', whiteSpace: 'pre-line' }}>
                                {whyChooseUs.title || "Why Choose Aanandham.go?"}
                            </h2>
                            <p style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '40px' }}>
                                {whyChooseUs.description || "Aanandham.go is Kerala's most trusted platform for Glamping and Wild Trekking. We are the only agency offering 100% Verified Stays across the state's best locations."}
                            </p>

                            <div className="features-grid-responsive">
                                {(whyChooseUs.features && whyChooseUs.features.length > 0 ? whyChooseUs.features : [
                                    { title: "The Aanandham.go Guarantee", description: "Every tent and trek is personally verified by the Aanandham.go team. We ensure safety, hygiene, and premium views." },
                                    { title: "Exclusive Wild Access", description: "Book restricted Kolukkumalai & Deep Forest zones only available through Aanandham.go. Experience the untouched wild." }
                                ]).map((feature, i) => (
                                    <div key={i}>
                                        <h4 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-main)' }}>{feature.title}</h4>
                                        <p style={{ color: 'var(--text-secondary)' }}>{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="feature-images-grid">
                            {(whyChooseUs.images && whyChooseUs.images.length > 0 ? whyChooseUs.images : [
                                "/images/why_choose_us/luxury_tent.png",
                                "/images/why_choose_us/campfire.png"
                            ]).map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    alt={i === 0 ? "Luxury Glamping Tent in Munnar" : "Campfire and Stargazing at Suryanelli"}
                                    loading="lazy"
                                    style={{
                                        width: '100%',
                                        height: '300px',
                                        objectFit: 'cover',
                                        borderRadius: '24px',
                                        transform: i === 0 ? 'translateY(40px)' : 'none'
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Sightseeing Section */}
            <section className="section-responsive" style={{ background: 'var(--bg-off-white)', padding: '100px 0' }}>
                <div className="container">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ textAlign: 'center', marginBottom: '60px' }}
                    >
                        <span style={{ color: 'var(--primary)', fontWeight: '700', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '13px' }}>UNMISSABLE PLACES</span>
                        <h2 style={{ fontSize: 'clamp(40px, 5vw, 56px)', fontWeight: '900', marginBottom: '20px', color: 'var(--text-main)', letterSpacing: '-1.5px', marginTop: '16px' }}>
                            Explore Kerala's Most Iconic Destinations
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '20px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
                            From the <strong>World's Highest Tea Estate</strong> in Munnar to the <strong>Serene Backwaters</strong> of Alleppey and the <strong>Wild Rainforests</strong> of Wayanad.
                        </p>
                    </motion.div>

                    {/* Grid of Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginBottom: '80px' }}>
                        {destinations.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.6 }}
                                style={{
                                    position: 'relative',
                                    borderRadius: '32px',
                                    overflow: 'hidden',
                                    height: '420px',
                                    cursor: 'pointer',
                                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)'
                                }}
                                whileHover={{ y: -10, boxShadow: '0 30px 60px -15px rgba(0,0,0,0.4)' }}
                                onClick={() => setSelectedDestination(item)}
                                role="button"
                                tabIndex={0}
                                aria-label={`View details for ${item.name}`}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        setSelectedDestination(item);
                                    }
                                }}
                            >
                                <img
                                    src={item.img}
                                    alt={item.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s ease' }}
                                    onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
                                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                                />
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
                                    pointerEvents: 'none'
                                }} />

                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '100%',
                                    padding: '32px',
                                    color: 'white'
                                }}>
                                    <h3 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                                        {item.name}
                                    </h3>
                                    <p style={{
                                        color: 'rgba(255,255,255,0.9)',
                                        lineHeight: '1.5',
                                        fontSize: '16px',
                                        marginBottom: '20px',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {item.desc}
                                    </p>
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        background: 'rgba(255,255,255,0.2)',
                                        backdropFilter: 'blur(10px)',
                                        padding: '8px 20px',
                                        borderRadius: '100px',
                                        fontSize: '14px',
                                        fontWeight: '700',
                                        border: '1px solid rgba(255,255,255,0.3)'
                                    }}>
                                        Explore <span style={{ marginLeft: '8px' }}>→</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <AnimatePresence>
                        {selectedDestination && (
                            <DestinationModal
                                destination={selectedDestination}
                                onClose={() => setSelectedDestination(null)}
                            />
                        )}
                    </AnimatePresence>


                </div>
            </section>

            {/* Instagram Section */}
            <section className="section-responsive" style={{ background: '#000', color: 'white' }}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ textAlign: 'center', marginBottom: '60px' }}
                    >
                        <h2 style={{ fontSize: '40px', fontWeight: '800', marginBottom: '16px' }}>Live Community Vibes</h2>
                        <p style={{ color: '#888', fontSize: '18px' }}>
                            Follow <strong>@aanandham.go</strong> for daily sunrise updates and camping stories.
                        </p>
                    </motion.div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                        <div style={{ minHeight: '600px', background: '#0a0a0a', borderRadius: '24px', padding: '12px', border: '1px solid #1a1a1a' }}>
                            <blockquote
                                className="instagram-media"
                                data-instgrm-permalink="https://www.instagram.com/reel/DHvlJS2y0CS/?utm_source=ig_embed&amp;utm_campaign=loading"
                                data-instgrm-version="14"
                                style={{ background: '#FFF', border: 0, borderRadius: '12px', boxShadow: 'none', margin: '0', maxWidth: '100%', minWidth: '326px', padding: 0, width: '99.375%' }}
                            >
                            </blockquote>
                        </div>
                        <div style={{ minHeight: '600px', background: '#0a0a0a', borderRadius: '24px', padding: '12px', border: '1px solid #1a1a1a' }}>
                            <blockquote
                                className="instagram-media"
                                data-instgrm-permalink="https://www.instagram.com/reel/DBonf51SVjD/?utm_source=ig_embed&amp;utm_campaign=loading"
                                data-instgrm-version="14"
                                style={{ background: '#FFF', border: 0, borderRadius: '12px', boxShadow: 'none', margin: '0', maxWidth: '100%', minWidth: '326px', padding: 0, width: '99.375%' }}
                            >
                            </blockquote>
                        </div>
                        <div style={{ minHeight: '600px', background: '#0a0a0a', borderRadius: '24px', padding: '12px', border: '1px solid #1a1a1a' }}>
                            <blockquote
                                className="instagram-media"
                                data-instgrm-permalink="https://www.instagram.com/reel/DBlAks-S2lP/?utm_source=ig_embed&amp;utm_campaign=loading"
                                data-instgrm-version="14"
                                style={{ background: '#FFF', border: 0, borderRadius: '12px', boxShadow: 'none', margin: '0', maxWidth: '100%', minWidth: '326px', padding: 0, width: '99.375%' }}
                            >
                            </blockquote>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '50px' }}>
                        <a href="https://www.instagram.com/aanandham.go/" target="_blank" rel="noopener noreferrer" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '10px',
                            background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                            color: 'white', padding: '16px 40px', borderRadius: '50px',
                            fontSize: '16px', fontWeight: '700', textDecoration: 'none',
                            boxShadow: '0 10px 30px rgba(220, 39, 67, 0.3)',
                            transition: 'all 0.3s ease'
                        }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                            Visit Page
                        </a>
                    </div>
                </div>
            </section>

            {/* Collaboration & Enquiry Section */}
            <section className="section-responsive" style={{ background: '#0a0a0a', padding: '100px 0' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        style={{
                            background: 'linear-gradient(135deg, #111 0%, #050505 100%)',
                            padding: '60px 40px',
                            borderRadius: '40px',
                            border: '1px solid #222',
                            boxShadow: '0 30px 60px rgba(0,0,0,0.5)'
                        }}
                    >
                        <span style={{ color: 'var(--primary)', fontWeight: '700', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '13px' }}>FOR TRIP PLANNERS & CREATORS</span>
                        <h2 style={{ fontSize: '42px', fontWeight: '800', color: 'white', margin: '20px 0' }}>Planning a Group Trip or Collaboration?</h2>
                        <p style={{ color: '#888', fontSize: '18px', maxWidth: '700px', margin: '0 auto 40px', lineHeight: '1.6' }}>
                            Aanandham.go is your <strong>trusted camping partner</strong> in Kerala. We provide verified inventory, logistical support, and exclusive rates for organizers and influencers.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                            <Link to="/contact" style={{
                                background: 'white',
                                color: 'black',
                                padding: '18px 45px',
                                borderRadius: '50px',
                                textDecoration: 'none',
                                fontWeight: '700',
                                fontSize: '16px',
                                boxShadow: '0 10px 20px rgba(255,255,255,0.1)'
                            }}>
                                Partner with Us
                            </Link>
                            <a href="https://wa.me/919400987654" style={{
                                background: 'transparent',
                                color: 'white',
                                padding: '18px 45px',
                                borderRadius: '50px',
                                textDecoration: 'none',
                                fontWeight: '700',
                                fontSize: '16px',
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}>
                                Instant WhatsApp Query
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
