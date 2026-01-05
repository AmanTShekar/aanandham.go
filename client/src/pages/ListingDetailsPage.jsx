import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { listingsAPI, reviewsAPI, authAPI, wishlistAPI } from '../services/api';
import BookingModal from '../components/BookingModal';
import ReviewModal from '../components/ReviewModal';
import InquiryModal from '../components/InquiryModal';

// Import new separate components
import ListingHeader from '../components/listing/ListingHeader';
import ListingImages from '../components/listing/ListingImages';
import ListingInfo from '../components/listing/ListingInfo';
import ListingReviews from '../components/listing/ListingReviews';
import ListingBookingCard from '../components/listing/ListingBookingCard';
import ListingRooms from '../components/listing/ListingRooms';
import SEO from '../components/SEO';

const ListingDetailsPage = () => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

    // Wishlist State
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [isCheckingWishlist, setIsCheckingWishlist] = useState(true);

    const user = authAPI.getCurrentUser();

    useEffect(() => {
        let isMounted = true;

        const fetchListing = async () => {
            try {
                setLoading(true);
                const data = await listingsAPI.getListingById(id);
                if (isMounted) setListing(data);
            } catch (error) {
                console.error('Failed to fetch listing:', error);
                // Fallback to mock data if API fails
                try {
                    const { listings } = await import('../data/mockData');
                    const mockListing = listings.find(item => item.id === parseInt(id));
                    if (isMounted) setListing(mockListing);
                } catch (e) {
                    console.error('Mock data fallback failed', e);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        const fetchReviews = async () => {
            try {
                const data = await reviewsAPI.getReviews(id);
                if (isMounted) setReviews(data);
            } catch (error) {
                console.error('Failed to fetch reviews');
            }
        };

        const checkWishlist = async () => {
            if (!user) {
                if (isMounted) setIsCheckingWishlist(false);
                return;
            }
            try {
                const result = await wishlistAPI.checkWishlist(id);
                if (isMounted) setIsInWishlist(result.inWishlist);
            } catch (error) {
                console.error('Error checking wishlist:', error);
            } finally {
                if (isMounted) setIsCheckingWishlist(false);
            }
        };

        fetchListing();
        fetchReviews();
        checkWishlist();

        return () => {
            isMounted = false;
        };
    }, [id, user?._id]);

    const handleWishlistToggle = async () => {
        if (!user) {
            alert('Please log in to save to wishlist');
            return;
        }

        if (wishlistLoading) return;

        try {
            setWishlistLoading(true);
            if (isInWishlist) {
                await wishlistAPI.removeFromWishlist(id);
                setIsInWishlist(false);
            } else {
                await wishlistAPI.addToWishlist(id);
                setIsInWishlist(true);
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            alert(error.response?.data?.message || 'Failed to update wishlist');
        } finally {
            setWishlistLoading(false);
        }
    };

    const handleReserve = (bookingData) => {
        setSelectedBooking(bookingData);
        setIsBookingModalOpen(true);
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
    }

    if (!listing) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Listing not found</div>;
    }

    const jsonLd = listing ? {
        "@context": "https://schema.org",
        "@type": "LodgingBusiness",
        "name": listing.title,
        "image": listing.images || [listing.image],
        "description": listing.description,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": listing.location
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": listing.rating,
            "reviewCount": reviews.length
        },
        "priceRange": listing.price ? `₹${listing.price}` : "$$"
    } : null;

    return (
        <div className="listing-page-padding" style={{ maxWidth: '1120px', margin: '0 auto' }}>
            {listing && <SEO
                title={listing.title}
                description={`Book ${listing.title} in ${listing.location}. ${listing.description?.substring(0, 150)}...`}
                image={listing.image}
                schema={jsonLd}
            />}
            <ListingHeader
                listing={listing}
                reviewsCount={reviews.length}
                isInWishlist={isInWishlist}
                onWishlistToggle={handleWishlistToggle}
                wishlistLoading={wishlistLoading || isCheckingWishlist}
            />

            <ListingImages listing={listing} />

            <div className="listing-details-grid">
                {/* Left Column */}
                <div>
                    <ListingInfo listing={listing} />

                    <ListingRooms
                        listing={listing}
                        onReserve={(room) => handleReserve({ room })}
                    />

                    <ListingReviews
                        listing={listing}
                        reviews={reviews}
                        user={user}
                        onWriteReview={() => setIsReviewModalOpen(true)}
                    />
                </div>

                {/* Right Column - Booking Card */}
                <div>
                    <ListingBookingCard
                        listing={listing}
                        reviewsCount={reviews.length}
                        onReserve={handleReserve}
                        onInquire={() => setIsInquiryModalOpen(true)}
                    />
                </div>
            </div>

            {/* Modals */}
            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                listing={listing}
                initialData={selectedBooking}
            />

            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                listingId={listing._id || listing.id}
                onReviewAdded={(newReview) => {
                    setReviews([newReview, ...reviews]);
                    setIsReviewModalOpen(false);
                }}
            />

            <InquiryModal
                isOpen={isInquiryModalOpen}
                onClose={() => setIsInquiryModalOpen(false)}
                inquiryType="listing"
                listing={listing}
            />
        </div>
    );
};

export default ListingDetailsPage;
