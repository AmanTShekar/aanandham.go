import { useState, useEffect, memo } from 'react';
import { FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { usePreferences } from '../contexts/PreferencesContext';
import { wishlistAPI, authAPI } from '../services/api';

const ListingCard = memo(({ listing }) => {
    // Ensure listing exists to prevent crashes
    if (!listing) return null;

    const listingId = listing._id || listing.id;
    const { formatPrice } = usePreferences();
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingWishlist, setIsCheckingWishlist] = useState(true);
    const user = authAPI.getCurrentUser();

    useEffect(() => {
        let isMounted = true;

        const checkWishlist = async () => {
            // If no user, we don't need to check the server
            if (!user) {
                if (isMounted) setIsCheckingWishlist(false);
                return;
            }

            if (!listingId) {
                if (isMounted) setIsCheckingWishlist(false);
                return;
            }

            try {
                const result = await wishlistAPI.checkWishlist(listingId);
                if (isMounted) {
                    setIsInWishlist(result.inWishlist);
                }
            } catch (error) {
                // Silent fail for wishlist check to avoid UI disruption
                console.warn('Wishlist check failed:', error);
            } finally {
                if (isMounted) {
                    setIsCheckingWishlist(false);
                }
            }
        };

        checkWishlist();

        return () => {
            isMounted = false;
        };
    }, [listingId, user?._id]);

    const handleWishlistToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            alert('Please log in to save to wishlist');
            return;
        }

        if (isLoading) return;

        try {
            setIsLoading(true);
            if (isInWishlist) {
                await wishlistAPI.removeFromWishlist(listingId);
                setIsInWishlist(false);
            } else {
                await wishlistAPI.addToWishlist(listingId);
                setIsInWishlist(true);
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            alert(error.response?.data?.message || 'Failed to update wishlist');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Link
            to={`/listings/${listingId}`}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer',
                position: 'relative',
                group: 'card'
            }}
            className="listing-card-container"
        >
            <div style={{
                position: 'relative',
                aspectRatio: '20/19',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-off-white)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                    e.currentTarget.querySelector('img').style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    e.currentTarget.querySelector('img').style.transform = 'scale(1)';
                }}
            >
                <img
                    src={listing.image}
                    alt={listing.title || listing.location}
                    loading="lazy"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    }}
                />

                {/* Wishlist Heart Icon */}
                {!isCheckingWishlist && user && (
                    <button
                        onClick={handleWishlistToggle}
                        disabled={isLoading}
                        style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            background: 'rgba(255, 255, 255, 0.7)',
                            backdropFilter: 'blur(4px)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s ease',
                            opacity: isLoading ? 0.6 : 1,
                            zIndex: 2
                        }}
                        onMouseEnter={(e) => !isLoading && (e.currentTarget.style.transform = 'scale(1.1)')}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        {isInWishlist ? (
                            <FaHeart size={16} color="var(--primary)" />
                        ) : (
                            <FaRegHeart size={16} color="var(--text-main)" />
                        )}
                    </button>
                )}

                {/* Guest Favorite Badge */}
                {listing.guestFavorite && (
                    <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(4px)',
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '12px',
                        fontWeight: '700',
                        boxShadow: 'var(--shadow-md)',
                        color: 'var(--text-main)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        zIndex: 2
                    }}>
                        <span style={{ color: 'var(--accent)' }}>★</span> Guest favorite
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{
                        fontWeight: '700',
                        fontSize: '16px',
                        margin: 0,
                        color: 'var(--text-main)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '70%'
                    }}>
                        {listing.location}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>
                        <FaStar size={12} color="var(--text-main)" />
                        <span>{listing.rating}</span>
                    </div>
                </div>

                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
                    {listing.distance || 'Added 2 weeks ago'}
                </p>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
                    {listing.dates}
                </p>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '4px' }}>
                    <span style={{ fontWeight: '700', fontSize: '16px', color: 'var(--text-main)' }}>
                        {formatPrice(listing.price)}
                    </span>
                    <span style={{ color: 'var(--text-main)', fontSize: '14px' }}>night</span>
                </div>
            </div>
        </Link>
    );
});

export default ListingCard;
