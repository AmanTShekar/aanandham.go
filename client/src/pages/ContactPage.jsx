import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import ContactForm from '../components/ContactForm';
import SEO from '../components/SEO';

const ContactPage = () => {
    return (
        <>
            <SEO
                title="Contact Us - Aanandham.go"
                description="Get in touch with Aanandham.go for luxury camping bookings, trekking experiences, and travel inquiries in Munnar, Vagamon, Wayanad, and Kerala."
                keywords="contact aanandham, munnar camping contact, vagamon glamping, wayanad stays, kerala travel support, booking inquiries"
            />
            <div style={{
                paddingTop: '80px',
                minHeight: '100vh',
                background: '#0a0a0a',
                color: 'white'
            }}>
                {/* Hero Section */}
                <div style={{
                    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
                    borderBottom: '1px solid #262626',
                    padding: '80px 0'
                }}>
                    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}
                        >
                            <h1 style={{
                                fontSize: 'clamp(36px, 5vw, 56px)',
                                fontWeight: '800',
                                marginBottom: '24px',
                                background: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>
                                Let's Start a Conversation
                            </h1>
                            <p style={{
                                fontSize: '18px',
                                color: '#a1a1aa',
                                lineHeight: '1.8',
                                marginBottom: '0'
                            }}>
                                Have questions about bookings, experiences, or becoming a host? Our team is here to help you 24/7.
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container" style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '80px 20px'
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '60px',
                        alignItems: 'start'
                    }}>
                        {/* Contact Information */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h2 style={{
                                fontSize: '32px',
                                fontWeight: '700',
                                marginBottom: '16px',
                                color: 'white'
                            }}>
                                Get in Touch
                            </h2>
                            <p style={{
                                fontSize: '16px',
                                color: '#a1a1aa',
                                marginBottom: '40px',
                                lineHeight: '1.6'
                            }}>
                                We're always excited to hear from travelers and adventurers. Reach out to us through any of these channels.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                {/* Email */}
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                                    <div style={{
                                        width: '56px',
                                        height: '56px',
                                        background: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <FaEnvelope size={24} color="#0a0a0a" />
                                    </div>
                                    <div>
                                        <h3 style={{
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            marginBottom: '8px',
                                            color: 'white'
                                        }}>
                                            Email Us
                                        </h3>
                                        <a
                                            href="mailto:bookings@aanandhamgo.in"
                                            style={{
                                                color: '#D4AF37',
                                                textDecoration: 'none',
                                                fontSize: '16px',
                                                display: 'block',
                                                marginBottom: '4px'
                                            }}
                                        >
                                            bookings@aanandhamgo.in
                                        </a>
                                        <p style={{ color: '#71717a', fontSize: '14px', margin: 0 }}>
                                            For bookings and general inquiries
                                        </p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                                    <div style={{
                                        width: '56px',
                                        height: '56px',
                                        background: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <FaPhone size={24} color="#0a0a0a" />
                                    </div>
                                    <div>
                                        <h3 style={{
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            marginBottom: '8px',
                                            color: 'white'
                                        }}>
                                            Call Us
                                        </h3>
                                        <a
                                            href="tel:+919400987654"
                                            style={{
                                                color: '#D4AF37',
                                                textDecoration: 'none',
                                                fontSize: '16px',
                                                display: 'block',
                                                marginBottom: '4px'
                                            }}
                                        >
                                            +91 9400 987 654
                                        </a>
                                        <p style={{ color: '#71717a', fontSize: '14px', margin: 0 }}>
                                            Available 24/7 for emergencies
                                        </p>
                                    </div>
                                </div>

                                {/* Location */}
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                                    <div style={{
                                        width: '56px',
                                        height: '56px',
                                        background: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <FaMapMarkerAlt size={24} color="#0a0a0a" />
                                    </div>
                                    <div>
                                        <h3 style={{
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            marginBottom: '8px',
                                            color: 'white'
                                        }}>
                                            Visit Us
                                        </h3>
                                        <p style={{ color: '#a1a1aa', fontSize: '16px', lineHeight: '1.6', margin: 0 }}>
                                            Suryanelli Estate<br />
                                            Munnar, Kerala 685618<br />
                                            India
                                        </p>
                                    </div>
                                </div>

                                {/* Hours */}
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                                    <div style={{
                                        width: '56px',
                                        height: '56px',
                                        background: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <FaClock size={24} color="#0a0a0a" />
                                    </div>
                                    <div>
                                        <h3 style={{
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            marginBottom: '8px',
                                            color: 'white'
                                        }}>
                                            Business Hours
                                        </h3>
                                        <p style={{ color: '#a1a1aa', fontSize: '16px', lineHeight: '1.6', margin: 0 }}>
                                            Monday - Sunday<br />
                                            24/7 Support Available
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div style={{ marginTop: '48px' }}>
                                <h3 style={{
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    marginBottom: '20px',
                                    color: 'white'
                                }}>
                                    Follow Us
                                </h3>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <a
                                        href="https://facebook.com/aanandham.go"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            width: '48px',
                                            height: '48px',
                                            background: '#1a1a1a',
                                            border: '1px solid #333',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)';
                                            e.currentTarget.style.borderColor = '#D4AF37';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = '#1a1a1a';
                                            e.currentTarget.style.borderColor = '#333';
                                        }}
                                    >
                                        <FaFacebookF size={20} color="white" />
                                    </a>
                                    <a
                                        href="https://twitter.com/aanandham_go"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            width: '48px',
                                            height: '48px',
                                            background: '#1a1a1a',
                                            border: '1px solid #333',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)';
                                            e.currentTarget.style.borderColor = '#D4AF37';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = '#1a1a1a';
                                            e.currentTarget.style.borderColor = '#333';
                                        }}
                                    >
                                        <FaTwitter size={20} color="white" />
                                    </a>
                                    <a
                                        href="https://www.instagram.com/aanandham.go"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            width: '48px',
                                            height: '48px',
                                            background: '#1a1a1a',
                                            border: '1px solid #333',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)';
                                            e.currentTarget.style.borderColor = '#D4AF37';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = '#1a1a1a';
                                            e.currentTarget.style.borderColor = '#333';
                                        }}
                                    >
                                        <FaInstagram size={20} color="white" />
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/company/aanandhamgo"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            width: '48px',
                                            height: '48px',
                                            background: '#1a1a1a',
                                            border: '1px solid #333',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)';
                                            e.currentTarget.style.borderColor = '#D4AF37';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = '#1a1a1a';
                                            e.currentTarget.style.borderColor = '#333';
                                        }}
                                    >
                                        <FaLinkedin size={20} color="white" />
                                    </a>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <ContactForm inquiryType="general" />
                        </motion.div>
                    </div>
                </div>

                {/* Map Section (Optional - can be added later) */}
                <div style={{
                    background: '#1a1a1a',
                    borderTop: '1px solid #262626',
                    padding: '60px 0'
                }}>
                    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                        <div style={{
                            background: '#0a0a0a',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            border: '1px solid #262626',
                            height: '400px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125452.89283267634!2d77.00950000000001!3d10.0889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0799794d099a51%3A0x63250d6c5e5a0e5!2sMunnar%2C%20Kerala!5e0!3m2!1sen!2sin!4v1234567890"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Aanandham.go Location"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactPage;
