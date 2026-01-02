import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SkeletonListingCard from '../components/SkeletonListingCard';
import CategoryBar from '../components/CategoryBar';
import FilterModal from '../components/FilterModal';
import { listingsAPI } from '../services/api';
import { stayCategories } from '../data/categories';
import PremiumListingCard from '../components/PremiumListingCard';
import SEO from '../components/SEO';

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
        <div style={{ backgroundColor: 'var(--bg-off-white)', minHeight: '100vh', padding: '100px 0 40px 0' }}>
            <SEO
                title="Book Luxury Tents & Resorts in Munnar"
                description="Browse confirmed luxury tent stays in Suryanelli and resorts in Munnar. Filter by price, amenities, and location for your perfect Kerala getaway."
                keywords="Book Tent Stay Munnar, Suryanelli Camping Booking, Munnar Resorts Price, Best Glamping Kerala, Luxury Stays Western Ghats"
            />
            <div className="container" style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '40px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '16px' }}>Find your perfect stay</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>Explore premium hotels, resorts, and homestays in Munnar.</p>
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
