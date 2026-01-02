import { useState, useEffect } from 'react';
import { listingsAPI } from '../../services/api';
import { FaHotel, FaPlus, FaEdit, FaTrash, FaChartLine } from 'react-icons/fa';
import { motion } from 'framer-motion';

const BusinessDashboard = () => {
    const [listings, setListings] = useState([]);
    const [stats, setStats] = useState({ totalBookings: 0, revenue: 0, views: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBizData = async () => {
            try {
                const data = await listingsAPI.getMyListings();
                setListings(data);
                // Calculate pseudo-stats for now as we don't have separate owner booking endpoints yet
                // In a real app, we'd fetch these from a dedicated analytics endpoint
                setStats({
                    totalBookings: data.reduce((acc, curr) => acc + (Math.floor(Math.random() * 20)), 0), // Mock bookings count based on active listings
                    revenue: data.reduce((acc, curr) => acc + (curr.price * 5), 0), // Mock revenue
                    views: data.reduce((acc, curr) => acc + Math.floor(Math.random() * 500), 0) // Mock views
                });
            } catch (error) {
                console.error("Failed to load business data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBizData();
    }, []);

    return (
        <div style={{ padding: '40px 20px', backgroundColor: 'var(--bg-light)', minHeight: '100vh' }}>
            <div className="container">
                <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>Business Dashboard</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Manage your property and view performance</p>
                    </div>
                    <button style={{
                        padding: '12px 24px',
                        background: 'var(--primary-gradient)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-full)',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-md)'
                    }}>
                        <FaPlus /> Add New Listing
                    </button>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
                    <StatCard icon={<FaHotel />} title="Active Listings" value={listings.length} color="#4F46E5" />
                    <StatCard icon={<FaChartLine />} title="Total Revenue" value={`$${stats.revenue}`} color="#10B981" />
                    <StatCard icon={<FaChartLine />} title="Profile Views" value={stats.views} color="#F59E0B" />
                </div>

                {/* Listings Section */}
                <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Your Properties</h2>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>Loading properties...</div>
                ) : listings.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                        {listings.map(listing => (
                            <div key={listing._id} style={{
                                background: 'white',
                                borderRadius: 'var(--radius-lg)',
                                overflow: 'hidden',
                                border: '1px solid var(--border)',
                                boxShadow: 'var(--shadow-sm)'
                            }}>
                                <img
                                    src={listing.image}
                                    alt={listing.title}
                                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                />
                                <div style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>{listing.title}</h3>
                                        <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>${listing.price}</span>
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
                                        {listing.location}
                                    </p>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button style={{
                                            flex: 1,
                                            padding: '8px',
                                            border: '1px solid var(--border)',
                                            background: 'white',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px'
                                        }}>
                                            <FaEdit /> Edit
                                        </button>
                                        <button style={{
                                            padding: '8px',
                                            border: '1px solid var(--red-light)',
                                            background: 'var(--red-light)',
                                            color: 'var(--red)',
                                            borderRadius: '6px',
                                            cursor: 'pointer'
                                        }}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--border)' }}>
                        <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                            You haven't added any listings yet. Start by adding your first property!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value, color }) => (
    <motion.div
        whileHover={{ y: -4 }}
        style={{
            background: 'white',
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
        }}
    >
        <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: `${color}15`,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
        }}>
            {icon}
        </div>
        <div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{title}</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-main)' }}>{value}</div>
        </div>
    </motion.div>
);

export default BusinessDashboard;
