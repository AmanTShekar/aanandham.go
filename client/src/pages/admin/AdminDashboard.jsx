import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { FaUsers, FaHome, FaCalendarCheck, FaDollarSign, FaChartLine } from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await adminAPI.getStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Loading dashboard...</div>;
    }

    const statCards = [
        { title: 'Total Users', value: stats?.stats.totalUsers || 0, icon: FaUsers, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', shadow: '0 10px 20px -10px rgba(118, 75, 162, 0.5)' },
        { title: 'Total Listings', value: stats?.stats.totalListings || 0, icon: FaHome, gradient: 'linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)', shadow: '0 10px 20px -10px rgba(255, 56, 92, 0.5)' },
        { title: 'Total Bookings', value: stats?.stats.totalBookings || 0, icon: FaCalendarCheck, gradient: 'linear-gradient(135deg, #00D9A5 0%, #00B386 100%)', shadow: '0 10px 20px -10px rgba(0, 217, 165, 0.5)' },
        { title: 'Total Revenue', value: `$${stats?.stats.totalRevenue || 0}`, icon: FaDollarSign, gradient: 'linear-gradient(135deg, #FFB75E 0%, #ED8F03 100%)', shadow: '0 10px 20px -10px rgba(237, 143, 3, 0.5)' }
    ];

    // Mock data for charts
    const revenueData = [
        { month: 'Jan', revenue: 4000 },
        { month: 'Feb', revenue: 3000 },
        { month: 'Mar', revenue: 5000 },
        { month: 'Apr', revenue: 4500 },
        { month: 'May', revenue: 6000 },
        { month: 'Jun', revenue: 5500 }
    ];

    const bookingsData = [
        { month: 'Jan', bookings: 40 },
        { month: 'Feb', bookings: 30 },
        { month: 'Mar', bookings: 50 },
        { month: 'Apr', bookings: 45 },
        { month: 'May', bookings: 60 },
        { month: 'Jun', bookings: 55 }
    ];

    return (
        <div style={{ padding: '40px', backgroundColor: '#F7F7F7', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#222' }}>
                        Dashboard Overview
                    </h1>
                    <p style={{ color: '#717171', fontSize: '16px' }}>
                        Welcome back! Here's what's happening with your platform.
                    </p>
                </div>

                {/* Stat Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '24px',
                    marginBottom: '40px'
                }}>
                    {statCards.map((card, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '20px',
                                padding: '24px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                border: '1px solid rgba(0,0,0,0.05)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            whileHover={{ y: -5, boxShadow: '0 12px 30px rgba(0,0,0,0.1)' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                                <div>
                                    <p style={{ color: '#888', fontSize: '14px', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        {card.title}
                                    </p>
                                    <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#1a1a2e', letterSpacing: '-1px' }}>
                                        {card.value}
                                    </h2>
                                </div>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '16px',
                                    background: card.gradient,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: card.shadow,
                                    color: 'white'
                                }}>
                                    <card.icon size={28} />
                                </div>
                            </div>
                            <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{
                                    background: 'rgba(0, 217, 165, 0.1)',
                                    padding: '4px 8px',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}>
                                    <FaChartLine size={12} color="#00D9A5" />
                                    <span style={{ fontSize: '12px', color: '#00D9A5', fontWeight: '700' }}>+12.5%</span>
                                </div>
                                <span style={{ fontSize: '13px', color: '#aaa', fontWeight: '500' }}>vs last month</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Charts */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
                    {/* Revenue Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            border: '1px solid #E8E8E8'
                        }}
                    >
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: '#222' }}>
                            Revenue Overview
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
                                <XAxis dataKey="month" stroke="#717171" />
                                <YAxis stroke="#717171" />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" stroke="#667eea" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Bookings Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            border: '1px solid #E8E8E8'
                        }}
                    >
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: '#222' }}>
                            Bookings Trend
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={bookingsData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
                                <XAxis dataKey="month" stroke="#717171" />
                                <YAxis stroke="#717171" />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="bookings" fill="#FF385C" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>

                {/* Recent Bookings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        padding: '32px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        border: '1px solid rgba(0,0,0,0.05)'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a2e' }}>
                            Recent Bookings
                        </h3>
                        <button style={{
                            padding: '8px 16px',
                            borderRadius: '10px',
                            border: '1px solid #eee',
                            background: 'white',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#666',
                            cursor: 'pointer'
                        }}>View All</button>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
                            <thead>
                                <tr>
                                    <th style={{ padding: '0 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Guest</th>
                                    <th style={{ padding: '0 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Listing</th>
                                    <th style={{ padding: '0 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Check-in</th>
                                    <th style={{ padding: '0 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total</th>
                                    <th style={{ padding: '0 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.recentBookings?.slice(0, 5).map((booking, index) => (
                                    <tr key={index} style={{ transition: 'transform 0.2s' }}>
                                        <td style={{ padding: '16px', background: '#f9f9fc', borderRadius: '12px 0 0 12px', fontSize: '14px', fontWeight: '600', color: '#333' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: '#555' }}>
                                                    {booking.user?.name?.charAt(0) || 'G'}
                                                </div>
                                                {booking.user?.name || 'Guest'}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', background: '#f9f9fc', fontSize: '14px', color: '#555' }}>
                                            {booking.listing?.title || 'Listing'}
                                        </td>
                                        <td style={{ padding: '16px', background: '#f9f9fc', fontSize: '14px', color: '#777' }}>
                                            {new Date(booking.checkIn).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '16px', background: '#f9f9fc', fontSize: '14px', fontWeight: '700', color: '#333' }}>
                                            ${booking.totalPrice}
                                        </td>
                                        <td style={{ padding: '16px', background: '#f9f9fc', borderRadius: '0 12px 12px 0' }}>
                                            <span style={{
                                                padding: '6px 12px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: '700',
                                                backgroundColor: booking.status === 'confirmed' ? 'rgba(0, 217, 165, 0.1)' : 'rgba(255, 165, 0, 0.1)',
                                                color: booking.status === 'confirmed' ? '#00D9A5' : '#FFA500',
                                                display: 'inline-block'
                                            }}>
                                                {booking.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;
