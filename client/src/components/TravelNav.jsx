import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUmbrellaBeach, FaMapMarkedAlt, FaSuitcaseRolling, FaBookOpen } from 'react-icons/fa';

const TravelNav = () => {
    const navItems = [
        { path: '/', label: 'Stays', icon: <FaHome /> },
        { path: '/experiences', label: 'Experiences', icon: <FaUmbrellaBeach /> },
        { path: '/places', label: 'Places', icon: <FaMapMarkedAlt /> }
    ];

    return (
        <div style={{
            borderBottom: '1px solid var(--border-light)',
            backgroundColor: 'white',
            position: 'sticky',
            top: '80px', // Adjust based on Navbar height
            zIndex: 900,
            paddingTop: '10px'
        }}>
            <div className="container" style={{ display: 'flex', gap: '32px', overflowX: 'auto', paddingBottom: '12px' }}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/'} // Only match exact for root
                        style={({ isActive }) => ({
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px',
                            textDecoration: 'none',
                            color: isActive ? 'var(--text-main)' : 'var(--text-secondary)',
                            fontSize: '12px',
                            fontWeight: isActive ? '600' : '500',
                            borderBottom: isActive ? '2px solid var(--text-main)' : '2px solid transparent',
                            paddingBottom: '8px',
                            minWidth: '64px',
                            transition: 'color 0.2s, border-bottom 0.2s'
                        })}
                    >
                        <div style={{ fontSize: '24px', opacity: 0.8 }}>{item.icon}</div>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default TravelNav;
