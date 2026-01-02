import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const ContactPage = () => {
    return (
        <div style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--bg-white)', color: 'var(--text-main)' }}>
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 20px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px' }}
                >
                    <div>
                        <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '24px' }}>Get in Touch</h1>
                        <p style={{ fontSize: '18px', color: '#a1a1aa', marginBottom: '40px' }}>
                            Have questions about a booking or want to become a host? We're here to help 24/7.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ width: '50px', height: '50px', background: '#262626', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FaEnvelope size={20} color="var(--primary)" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>Email Us</h3>
                                    <p style={{ color: '#a1a1aa' }}>support@annadnam.com</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ width: '50px', height: '50px', background: '#262626', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FaPhone size={20} color="var(--primary)" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>Call Us</h3>
                                    <p style={{ color: '#a1a1aa' }}>+91 987 654 3210</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ width: '50px', height: '50px', background: '#262626', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FaMapMarkerAlt size={20} color="var(--primary)" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>Visit Us</h3>
                                    <p style={{ color: '#a1a1aa' }}>MG Road, Munnar, Kerala 685612</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ background: '#1a1a1a', padding: '40px', borderRadius: '30px', border: '1px solid #333' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Send a Message</h2>
                        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#a1a1aa' }}>Full Name</label>
                                <input type="text" style={{ width: '100%', padding: '16px', background: '#262626', border: '1px solid #404040', borderRadius: '12px', color: 'white', outline: 'none' }} placeholder="John Doe" />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#a1a1aa' }}>Email Address</label>
                                <input type="email" style={{ width: '100%', padding: '16px', background: '#262626', border: '1px solid #404040', borderRadius: '12px', color: 'white', outline: 'none' }} placeholder="john@example.com" />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#a1a1aa' }}>Message</label>
                                <textarea rows="4" style={{ width: '100%', padding: '16px', background: '#262626', border: '1px solid #404040', borderRadius: '12px', color: 'white', outline: 'none', resize: 'none' }} placeholder="How can we help?"></textarea>
                            </div>
                            <button type="button" style={{ width: '100%', padding: '16px', background: 'var(--primary-gradient)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '16px', cursor: 'pointer', marginTop: '10px' }}>
                                Send Message
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ContactPage;
