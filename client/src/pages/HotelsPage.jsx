import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SkeletonListingCard from '../components/SkeletonListingCard';
import CategoryBar from '../components/CategoryBar';
import FilterModal from '../components/FilterModal';
import { listingsAPI } from '../services/api';
import { stayCategories } from '../data/categories';
import PremiumListingCard from '../components/PremiumListingCard';
import SEO from '../components/SEO';
import { motion, useScroll, useTransform } from 'framer-motion';

const HotelsPage = () => {
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [error, setError] = useState(null);

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filters, setFilters] = useState({});
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = searchParams.get('guests');

    // Parallax
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 200]);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                setLoading(true);
                const searchFilters = {
                    ...filters,
                    checkIn,
                    checkOut,
                    guests
                };
                const data = await listingsAPI.getAllListings(searchQuery, selectedCategory === 'All' ? null : selectedCategory, searchFilters);
                setListings(data);
                setFilteredListings(data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch listings:', err);
                setError('Failed to load listings. Make sure the server is running.');
                const { listings: mockListings } = await import('../data/mockData');
                setListings(mockListings);
                setFilteredListings(mockListings);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, [searchQuery, selectedCategory, filters, checkIn, checkOut, guests]);

    const handleFilterApply = (newFilters) => {
        setFilters(newFilters);
    };

    return (
        <div style={{ backgroundColor: 'var(--bg-off-white)', minHeight: '100vh', padding: '0 0 40px 0' }}>
            <SEO
                title={
                    searchQuery?.toLowerCase().includes('vagamon') ? "Vagamon Camping & Luxury Glamping | Best Stays - Aanandham.go" :
                        searchQuery?.toLowerCase().includes('wayanad') ? "Wayanad Glamping & Forest Stays | Verified Tents - Aanandham.go" :
                            searchQuery?.toLowerCase().includes('munnar') ? "Luxury Tents & Resorts in Munnar | Book Verified Stays - Aanandham.go" :
                                "Luxury Stays & Glamping in Kerala | Munnar, Vagamon, Wayanad - Aanandham.go"
                }
                description={
                    searchQuery?.toLowerCase().includes('vagamon') ? "Book the best camping stays in Vagamon. Experience luxury glamping, pine forest stays, and verified tent camps in Vagamon, Kerala." :
                        searchQuery?.toLowerCase().includes('wayanad') ? "Discover premium glamping and forest stays in Wayanad. Verified inventory for the best camping experience in Wayanad, Kerala." :
                            "Browse confirmed luxury tent stays, glamping pods, and premium resorts in Munnar, Vagamon, and Wayanad. Filter by price and amenities for your perfect Kerala getaway."
                }
                keywords="Book Tent Stay Munnar, Suryanelli Camping, Vagamon Glamping, Wayanad Forest Stay, Kerala Tourism, Premium Camping India"
            />

            {/* Hero Section with Parallax */}
            <div style={{
                position: 'relative',
                height: '50vh',
                minHeight: '350px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                marginBottom: '40px'
            }}>
                <motion.div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'url("/images/why_choose_us/luxury_tent.png")',
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
                        <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '900', color: 'white', marginBottom: '16px', letterSpacing: '-1.5px' }}>
                            {searchQuery ? `Verified Stays in ${searchQuery}` : "Find Your Perfect Stay"}
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '20px' }}>
                            Luxury Glamping, Premium Resorts, and Verified Tents in Kerala's Prettiest Locations.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container" style={{ marginTop: '0' }}>
                <CategoryBar
                    categories={stayCategories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    onFilterClick={() => setIsFilterModalOpen(true)}
                    style={{ display: 'none' }} // Hiding for now based on request ("remove the category thing")
                />
                {/* Replaced with direct Filter Button if needed, or just removed as requested */}
            </div>

            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApply={handleFilterApply}
                initialFilters={filters}
            />

            {error && (
                <div className="container" style={{ marginTop: '24px' }}>
                    <div style={{
                        padding: '24px 40px',
                        backgroundColor: '#2A1302',
                        border: '1px solid #7D4F12',
                        borderRadius: 'var(--radius-md)',
                        color: '#FFC107'
                    }}>
                        ⚠️ {error}
                    </div>
                </div>
            )}

            <div className="container listings-grid-responsive">
                {loading ? (
                    Array(6).fill(0).map((_, i) => <SkeletonListingCard key={i} />)
                ) : (
                    filteredListings.length > 0 ? (
                        filteredListings.map((listing, i) => (
                            <PremiumListingCard key={listing._id || listing.id} listing={listing} index={i} />
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)', gridColumn: '1 / -1' }}>
                            <h3>No properties found matching your criteria.</h3>
                            <p>Try adjusting your filters or category.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default HotelsPage;
