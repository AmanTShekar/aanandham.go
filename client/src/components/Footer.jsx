import { useState } from 'react';
import { FaGlobe, FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import LanguageModal from './LanguageModal';
import { usePreferences } from '../contexts/PreferencesContext';

const Footer = () => {
    const { language, setLanguage, currency, setCurrency, languages, currencies } = usePreferences();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <footer style={{
            backgroundColor: '#0a0a0a',
            color: '#a1a1aa', // Zinc-400
            paddingTop: '80px',
            borderTop: '1px solid #262626'
        }}>
            <div className="container" style={{ paddingBottom: '40px' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '48px',
                    marginBottom: '60px'
                }}>
                    {/* Brand Column */}
                    <div>
                        <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'white', marginBottom: '24px', letterSpacing: '-1px' }}>Aanandham.</h3>
                        <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
                            Curated experiences and premium stays in the heart of Munnar. Discover the unseen.
                            <br />
                            <a href="mailto:bookings@aanandhamgo.in" style={{ color: 'white', fontWeight: '600', textDecoration: 'none', marginTop: '12px', display: 'inline-block' }}>
                                bookings@aanandhamgo.in
                            </a>
                        </p>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <a href="https://facebook.com/aanandham.go" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                <FaFacebookF size={20} style={{ cursor: 'pointer', color: 'white' }} />
                            </a>
                            <a href="https://twitter.com/aanandham_go" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                                <FaTwitter size={20} style={{ cursor: 'pointer', color: 'white' }} />
                            </a>
                            <a href="https://www.instagram.com/aanandham.go" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <FaInstagram size={20} style={{ cursor: 'pointer', color: 'white' }} />
                            </a>
                            <a href="https://www.linkedin.com/company/aanandhamgo" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                <FaLinkedin size={20} style={{ cursor: 'pointer', color: 'white' }} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '20px' }}>Company</h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: 0 }}>
                            <li><a href="/about" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }}>About Us</a></li>
                            <li><a href="/careers" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }}>Careers</a></li>
                            <li><a href="/press" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }}>Press</a></li>
                            <li><a href="/contact" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }}>Contact</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '20px' }}>Support</h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: 0 }}>
                            <li><a href="/support" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }}>Help Center</a></li>
                            <li><a href="/safety" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }}>Safety Information</a></li>
                            <li><a href="/terms" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }}>Terms of Service</a></li>
                            <li><a href="/privacy" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }}>Privacy Policy</a></li>
                        </ul>
                    </div>

                    {/* Newsletter (Simplified) */}
                    <div>
                        <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '20px' }}>Stay Updated</h4>
                        <p style={{ fontSize: '14px', marginBottom: '16px' }}>Subscribe to get the latest travel updates.</p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="email"
                                placeholder="Email address"
                                style={{
                                    background: '#1a1a1a',
                                    border: '1px solid #333',
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    color: 'white',
                                    outline: 'none',
                                    flex: 1
                                }}
                            />
                            <button style={{
                                background: 'white',
                                color: 'black',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '10px 16px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}>
                                Go
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{
                    borderTop: '1px solid #262626',
                    paddingTop: '32px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '20px'
                }}>
                    <div style={{ fontSize: '14px' }}>
                        © 2025 Aanandham, Inc. All rights reserved.
                    </div>

                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                        <div
                            onClick={() => setIsModalOpen(true)}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'white', fontSize: '14px', fontWeight: '500' }}
                        >
                            <FaGlobe size={14} />
                            <span>{language.name} ({language.region})</span>
                        </div>
                        <div
                            onClick={() => setIsModalOpen(true)}
                            style={{ cursor: 'pointer', color: 'white', fontSize: '14px', fontWeight: '500' }}
                        >
                            {currency.symbol} {currency.code}
                        </div>
                    </div>
                </div>
            </div>

            <LanguageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                currentLang={language}
                currentCurrency={currency}
                onSelectLang={setLanguage}
                onSelectCurrency={setCurrency}
                languages={languages}
                currencies={currencies}
            />
        </footer>
    );
};

export default Footer;
