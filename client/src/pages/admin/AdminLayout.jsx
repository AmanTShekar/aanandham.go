import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaUsers, FaCalendarCheck, FaList, FaStar, FaSignOutAlt, FaChartBar, FaCompass, FaImages } from 'react-icons/fa';
import { authAPI } from '../../services/api';
import pngLogo from '../../assets/pnglogo.png';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = authAPI.getCurrentUser();

    const handleLogout = () => {
        authAPI.logout();
        navigate('/login');
    };

    const menuItems = [
        { path: '/admin', icon: FaChartBar, label: 'Dashboard', exact: true },
        { path: '/admin/users', icon: FaUsers, label: 'Users' },
        { path: '/admin/listings', icon: FaHome, label: 'Listings' },
        { path: '/admin/bookings', icon: FaCalendarCheck, label: 'Bookings' },
        { path: '/admin/experiences', icon: FaCompass, label: 'Camps & Events' },
        { path: '/admin/gallery', icon: FaImages, label: 'Gallery' },
        { path: '/admin/reviews', icon: FaStar, label: 'Reviews' }
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F7F7F7' }}>
            {/* Sidebar */}
            <div style={{
                width: '280px',
                background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
                zIndex: 100
            }}>
                {/* Logo */}
                <div style={{ padding: '32px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <img src={pngLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                        <div>
                            <div style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px' }}>aanandham.go Admin</div>
                            <div style={{ fontSize: '12px', opacity: 0.5, fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>Dashboard</div>
                        </div>
                    </Link>
                </div>

                {/* Menu Items */}
                <nav style={{ flex: 1, padding: '32px 16px', overflowY: 'auto' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', padding: '0 16px 12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Menu</div>
                    {menuItems.map((item) => {
                        const isActive = item.exact
                            ? location.pathname === item.path
                            : location.pathname.startsWith(item.path);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    padding: '16px 20px',
                                    marginBottom: '8px',
                                    borderRadius: '16px',
                                    textDecoration: 'none',
                                    color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                                    background: isActive ? 'linear-gradient(90deg, #FF385C 0%, #E61E4D 100%)' : 'transparent',
                                    fontWeight: isActive ? '600' : '500',
                                    fontSize: '15px',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: isActive ? '0 4px 12px rgba(255, 56, 92, 0.3)' : 'none',
                                    transform: isActive ? 'translateX(4px)' : 'none'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                                        e.currentTarget.style.color = 'white';
                                        e.currentTarget.style.transform = 'translateX(4px)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                                        e.currentTarget.style.transform = 'none';
                                    }
                                }}
                            >
                                <item.icon size={20} style={{ opacity: isActive ? 1 : 0.8 }} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info & Logout */}
                <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: '18px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }}>
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: '15px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'Admin'}</div>
                            <div style={{ fontSize: '12px', opacity: 0.6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '12px',
                            color: '#ff4d4d',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'rgba(255, 77, 77, 0.1)';
                            e.target.style.borderColor = 'rgba(255, 77, 77, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'rgba(255,255,255,0.08)';
                            e.target.style.borderColor = 'rgba(255,255,255,0.05)';
                        }}
                    >
                        <FaSignOutAlt size={16} />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ marginLeft: '280px', flex: 1 }}>
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
