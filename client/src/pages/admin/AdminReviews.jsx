import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { FaSearch, FaTrash, FaStar, FaComment } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const data = await adminAPI.getAllReviews();
            setReviews(data);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        // Temporary bypass of confirm dialog
        // if (window.confirm('Are you sure you want to delete this review?')) {
        try {
            await adminAPI.deleteReview(reviewId);
            fetchReviews();
        } catch (error) {
            console.error('Failed to delete review:', error);
            alert('Failed to delete review');
        }
        // }
    };

    const filteredReviews = reviews.filter(review =>
        review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (review.user && review.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (review.listing && review.listing.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Loading reviews...</div>;
    }

    return (
        <div style={{ padding: '40px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#222' }}>
                            Reviews Management
                        </h1>
                        <p style={{ color: '#717171', fontSize: '16px' }}>
                            Manage all user reviews
                        </p>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#667eea' }}>
                        {reviews.length} Total Reviews
                    </div>
                </div>

                {/* Search */}
                <div style={{ marginBottom: '24px', position: 'relative' }}>
                    <FaSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#717171' }} />
                    <input
                        type="text"
                        placeholder="Search reviews by comment, user, or listing..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '14px 14px 14px 48px',
                            border: '2px solid #E8E8E8',
                            borderRadius: '12px',
                            fontSize: '15px',
                            outline: 'none',
                            transition: 'border-color 0.2s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#E8E8E8'}
                    />
                </div>

                {/* Reviews Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        border: '1px solid #E8E8E8'
                    }}
                >
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #E8E8E8' }}>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#717171' }}>User</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#717171' }}>Listing</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#717171' }}>Rating</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#717171' }}>Comment</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#717171' }}>Date</th>
                                <th style={{ padding: '16px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#717171' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReviews.map((review) => (
                                <tr key={review._id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                                    <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#222' }}>
                                        {review.user ? review.user.name : 'Unknown User'}
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '14px', color: '#717171' }}>
                                        {review.listing ? review.listing.title : 'Unknown Listing'}
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <FaStar color="#FF385C" size={12} />
                                            <span style={{ fontSize: '14px', color: '#222' }}>{review.rating}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '14px', color: '#717171', maxWidth: '300px' }}>
                                        {review.comment}
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '14px', color: '#717171' }}>
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                        <button
                                            onClick={() => handleDeleteReview(review._id)}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: '#FFE8EC',
                                                border: 'none',
                                                borderRadius: '8px',
                                                color: '#FF385C',
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#FFD4DC'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = '#FFE8EC'}
                                        >
                                            <FaTrash size={12} />
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminReviews;
