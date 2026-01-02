import { useState, useEffect } from 'react';
import { wishlistAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { FaStar } from 'react-icons/fa';
import { usePreferences } from '../contexts/PreferencesContext';

const WishlistsPage = () => {
    const [wishlists, setWishlists] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = authAPI.getCurrentUser();
    const { formatPrice } = usePreferences();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchWishlists = async () => {
            try {
                setLoading(true);
                const data = await wishlistAPI.getWishlists();
                setWishlists(data);
            } catch (error) {
                console.error('Error fetching wishlists:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlists();
    }, [user?.id, navigate]);

    const handleRemove = async (listingId) => {
        try {
            await wishlistAPI.removeFromWishlist(listingId);
            setWishlists(wishlists.filter(listing => listing._id !== listingId));
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', minHeight: '60vh' }}>
                <div style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>Loading your wishlists...</div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '32px', color: 'var(--text-main)' }}>Wishlists</h1>

            {wishlists.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '80px 20px',
                    backgroundColor: 'var(--bg-light)',
                    borderRadius: 'var(--radius-lg)'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>❤️</div>
                    <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)' }}>
                        No wishlists yet
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                        Start exploring and save your favorite places
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            padding: '12px 24px',
                            background: 'var(--primary-gradient)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: 'var(--shadow-md)'
                        }}
                    >
                        Explore Listings
                    </button>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '24px'
                }}>
                    {wishlists.map((listing) => (
                        <div
                            key={listing._id}
                            style={{
                                position: 'relative',
                                cursor: 'pointer'
                            }}
                        >
                            {/* Listing Image */}
                            <div
                                onClick={() => navigate(`/listings/${listing._id}`)}
                                style={{
                                    position: 'relative',
                                    aspectRatio: '20/19',
                                    borderRadius: 'var(--radius-md)',
                                    overflow: 'hidden',
                                    backgroundColor: 'var(--bg-off-white)',
                                    marginBottom: '12px',
                                    boxShadow: 'var(--shadow-sm)'
                                }}
                            >
                                <img
                                    src={listing.image}
                                    alt={listing.title || listing.location}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />

                                {/* Remove Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemove(listing._id);
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: '12px',
                                        right: '12px',
                                        background: 'rgba(255, 255, 255, 0.9)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '32px',
                                        height: '32px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        boxShadow: 'var(--shadow-sm)',
                                        fontSize: '16px',
                                        transition: 'transform 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    title="Remove from wishlist"
                                >
                                    ❤️
                                </button>

                                {listing.guestFavorite && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '12px',
                                        left: '12px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        padding: '6px 12px',
                                        borderRadius: '16px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        boxShadow: 'var(--shadow-sm)',
                                        color: 'var(--text-main)'
                                    }}>
                                        Guest favorite
                                    </div>
                                )}
                            </div>

                            {/* Listing Info */}
                            <div onClick={() => navigate(`/listings/${listing._id}`)}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                    <span style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '15px' }}>
                                        {listing.location}
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-main)' }}>
                                        <FaStar size={12} color="var(--accent)" />
                                        <span style={{ fontSize: '15px' }}>{listing.rating}</span>
                                    </div>
                                </div>

                                <div style={{ marginTop: '2px', display: 'flex', gap: '4px', alignItems: 'baseline' }}>
                                    <span style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '15px' }}>
                                        {formatPrice(listing.price)}
                                    </span>
                                    <span style={{ color: 'var(--text-main)', fontSize: '15px' }}>night</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistsPage;
