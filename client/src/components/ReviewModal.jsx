import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaStar } from 'react-icons/fa';
import { reviewsAPI } from '../services/api';

const ReviewModal = ({ isOpen, onClose, listingId, onReviewAdded }) => {
    const [rating, setRating] = useState(5);
    const [subRatings, setSubRatings] = useState({
        cleanliness: 5,
        accuracy: 5,
        checkIn: 5,
        communication: 5,
        location: 5,
        value: 5
    });
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [hover, setHover] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const newReview = await reviewsAPI.createReview({ listingId, rating, subRatings, comment });
            onReviewAdded(newReview);
            onClose();
            setComment('');
            setRating(5);
            setSubRatings({
                cleanliness: 5,
                accuracy: 5,
                checkIn: 5,
                communication: 5,
                location: 5,
                value: 5
            });
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    padding: '20px',
                    backdropFilter: 'blur(4px)'
                }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        backgroundColor: 'var(--bg-white)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '32px',
                        maxWidth: '500px',
                        width: '100%',
                        boxShadow: 'var(--shadow-xl)'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-main)' }}>
                            Write a Review
                        </h2>
                        <button
                            onClick={onClose}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '8px',
                                color: 'var(--text-secondary)'
                            }}
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-main)' }}>Overall Rating</h3>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                                {[...Array(5)].map((_, index) => {
                                    const ratingValue = index + 1;
                                    return (
                                        <FaStar
                                            key={index}
                                            size={32}
                                            color={ratingValue <= (hover || rating) ? "var(--accent)" : "var(--border)"}
                                            onMouseEnter={() => setHover(ratingValue)}
                                            onMouseLeave={() => setHover(null)}
                                            onClick={() => setRating(ratingValue)}
                                            style={{ cursor: 'pointer', transition: 'color 0.2s' }}
                                        />
                                    );
                                })}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                                {Object.keys(subRatings).map((category) => (
                                    <div key={category}>
                                        <label style={{ display: 'block', marginBottom: '8px', textTransform: 'capitalize', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                            {category.replace(/([A-Z])/g, ' $1').trim()}
                                        </label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {[1, 2, 3, 4, 5].map((val) => (
                                                <div
                                                    key={val}
                                                    onClick={() => setSubRatings(prev => ({ ...prev, [category]: val }))}
                                                    style={{
                                                        width: '24px',
                                                        height: '24px',
                                                        borderRadius: '50%',
                                                        border: `1px solid ${val <= subRatings[category] ? 'var(--primary)' : 'var(--border)'}`,
                                                        backgroundColor: val <= subRatings[category] ? 'var(--primary)' : 'transparent',
                                                        color: val <= subRatings[category] ? 'white' : 'var(--text-secondary)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '12px',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    {val}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-main)' }}>Your comments</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Tell us about your experience..."
                                required
                                rows={5}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '16px',
                                    resize: 'none',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    fontFamily: 'inherit',
                                    backgroundColor: 'var(--bg-light)',
                                    color: 'var(--text-main)'
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: 'var(--primary-gradient)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1,
                                boxShadow: 'var(--shadow-md)',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                if (!loading) {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = 'var(--shadow-lg)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!loading) {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'var(--shadow-md)';
                                }
                            }}
                        >
                            {loading ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ReviewModal;
