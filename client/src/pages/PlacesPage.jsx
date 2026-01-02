import React from 'react';
import { NavLink, Outlet, useLocation, Navigate } from 'react-router-dom';
import { FaMapMarkedAlt, FaSuitcaseRolling, FaBookOpen } from 'react-icons/fa';

const PlacesPage = () => {
    const location = useLocation();

    // Redirect to destinations if exactly /places
    if (location.pathname === '/places' || location.pathname === '/places/') {
        return <Navigate to="/places/destinations" replace />;
    }

    return (
        <div>
            {/* Content Area */}
            <div style={{ marginTop: '0' }}>
                <Outlet />
            </div>
        </div>
    );
};

export default PlacesPage;
