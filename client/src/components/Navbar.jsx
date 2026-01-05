import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGlobe, FaBars, FaUserCircle } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';
import { authAPI } from '../services/api';
import { usePreferences } from '../contexts/PreferencesContext';
import pngLogo from '../assets/pnglogo.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(authAPI.getCurrentUser());
  const navigate = useNavigate();
  const { t } = usePreferences();

  useEffect(() => {
    let timeoutId;

    const handleScroll = () => {
      if (timeoutId) return;

      timeoutId = setTimeout(() => {
        if (window.scrollY > 20) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
        timeoutId = null;
      }, 10); // 10ms throttle
    };

    const handleStorageChange = () => {
      setUser(authAPI.getCurrentUser());
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', handleStorageChange);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 'var(--z-fixed)',
        padding: isScrolled ? '15px 0' : '25px 0',
        backgroundColor: isScrolled ? 'rgba(0,0,0,0.85)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo Section */}
        <Link to={user?.role === 'admin' ? '/admin' : '/'} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <img src={pngLogo} alt="Logo" style={{ width: isScrolled ? '90px' : '110px', height: 'auto', transition: 'width 0.4s' }} />
          <div className="brand-text">
            <span style={{
              color: '#fff',
              fontSize: isScrolled ? '24px' : '28px',
              fontWeight: '700',
              fontFamily: 'var(--font-serif)',
              letterSpacing: '-0.02em',
              lineHeight: '1',
              transition: 'all 0.4s'
            }}>
              Aanandham
            </span>
            <span style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '3px',
              marginTop: '4px',
              opacity: isScrolled ? 0 : 1,
              height: isScrolled ? 0 : 'auto',
              transition: 'all 0.4s',
              overflow: 'hidden'
            }}>
              Luxury Stays
            </span>
          </div>
        </Link>

        {/* Navigation Links - Centered & Clean - Hidden on Mobile via CSS */}
        <nav className={`nav-desktop ${isScrolled ? 'scrolled' : ''}`}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/hotels">Stays</NavLink>
          <NavLink to="/experiences">Experiences</NavLink>
          <NavLink to="/places">Destinations</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>

        {/* Right Action Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Host CTA Removed as per user request */}

          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.2)' }}></div>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '6px 6px 6px 16px',
                borderRadius: '40px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              <FaBars size={14} color="white" />
              {user?.avatar ? (
                <img src={user.avatar} alt="User" style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                  {user ? user.name.charAt(0) : <FaUserCircle />}
                </div>
              )}
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 16px)',
                    right: 0,
                    width: '260px',
                    background: '#1c1c1c',
                    border: '1px solid #333',
                    borderRadius: '20px',
                    padding: '8px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                    overflow: 'hidden'
                  }}
                >
                  <div className="mobile-only">
                    <MenuItem onClick={() => { navigate('/'); setIsMenuOpen(false); }}>Home</MenuItem>
                    <MenuItem onClick={() => { navigate('/hotels'); setIsMenuOpen(false); }}>Stays</MenuItem>
                    <MenuItem onClick={() => { navigate('/experiences'); setIsMenuOpen(false); }}>Experiences</MenuItem>
                    <MenuItem onClick={() => { navigate('/places'); setIsMenuOpen(false); }}>Destinations</MenuItem>
                    <MenuItem onClick={() => { navigate('/about'); setIsMenuOpen(false); }}>About</MenuItem>
                    <div style={{ height: '1px', background: '#333', margin: '8px 0' }} />
                  </div>

                  {user ? (
                    <>
                      <div style={{ padding: '16px', background: '#262626', borderRadius: '12px', marginBottom: '8px' }}>
                        <div style={{ color: 'white', fontWeight: '700' }}>{user.name}</div>
                        <div style={{ color: '#a1a1aa', fontSize: '12px' }}>{user.email}</div>
                      </div>
                      {user.role === 'admin' && (
                        <MenuItem onClick={() => { navigate('/admin'); setIsMenuOpen(false); }}>Admin Dashboard</MenuItem>
                      )}
                      {user.role === 'business' && (
                        <MenuItem onClick={() => { navigate('/business'); setIsMenuOpen(false); }}>Business Dashboard</MenuItem>
                      )}
                      <MenuItem onClick={() => navigate('/bookings')}>My Bookings</MenuItem>
                      <MenuItem onClick={() => navigate('/wishlists')}>Wishlists</MenuItem>
                      <MenuItem onClick={() => navigate('/account')}>Account Settings</MenuItem>
                      <div style={{ height: '1px', background: '#333', margin: '8px 0' }} />
                      <MenuItem onClick={handleLogout} danger>Log Out</MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem onClick={() => { navigate('/login'); setIsMenuOpen(false); }} bold>Log in</MenuItem>
                      <MenuItem onClick={() => { navigate('/signup'); setIsMenuOpen(false); }}>Sign up</MenuItem>
                      <div style={{ height: '1px', background: '#333', margin: '8px 0' }} />
                      <MenuItem onClick={() => { setIsMenuOpen(false); }}>Help Center</MenuItem>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

const NavLink = ({ to, children }) => (
  <Link
    to={to}
    style={{
      textDecoration: 'none',
      color: 'white',
      fontWeight: '600',
      fontSize: '12px',
      textTransform: 'uppercase',
      letterSpacing: '2px', // Wider luxury tracking
      opacity: 0.8,
      transition: 'all 0.3s',
      padding: '8px 0',
      position: 'relative'
    }}
    onMouseEnter={e => {
      e.target.style.opacity = 1;
      e.target.style.textShadow = '0 0 10px rgba(255,255,255,0.5)'; // Subtle glow
    }}
    onMouseLeave={e => {
      e.target.style.opacity = 0.8;
      e.target.style.textShadow = 'none';
    }}
  >
    {children}
  </Link>
);

const MenuItem = ({ children, onClick, bold, danger }) => (
  <div
    onClick={onClick}
    style={{
      padding: '12px 20px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: bold ? '600' : '500',
      color: danger ? '#EF4444' : '#FAFAFA', // Dark theme text
      transition: 'background 0.2s',
      display: 'flex',
      alignItems: 'center',
      borderRadius: '12px'
    }}
    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#27272a'}
    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
  >
    {children}
  </div>
);

export default Navbar;
