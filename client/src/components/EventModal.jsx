import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaTimes, FaCheckCircle, FaPhoneAlt, FaUserTie } from 'react-icons/fa';
import ContactForm from './ContactForm';
import { useState } from 'react';

const EventModal = ({ event, onClose }) => {
    if (!event) return null;

    // Split layout for rich content if available (Itinerary, Inclusions)
    const isRich = event.itinerary && event.inclusions;

    const [showForm, setShowForm] = useState(false);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
                    zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
                }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    style={{
                        background: '#18181b', width: '100%', maxWidth: '900px',
                        borderRadius: '24px', overflow: 'hidden', position: 'relative',
                        border: '1px solid #333', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                        display: 'flex', flexDirection: window.innerWidth > 768 ? 'row' : 'column',
                        maxHeight: '90vh'
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    <button onClick={onClose} style={{
                        position: 'absolute', top: 16, right: 16, zIndex: 10,
                        background: 'rgba(0,0,0,0.5)', color: 'white', width: 36, height: 36,
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', border: 'none'
                    }}>
                        <FaTimes />
                    </button>

                    {/* Left/Top: Image & Key Info */}
                    <div style={{ flex: 1, position: 'relative', minHeight: '300px' }}>
                        <img src={event.image} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            padding: '30px', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)'
                        }}>
                            <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>{event.title}</h2>
                            <div style={{ display: 'flex', gap: '16px', color: '#d4d4d8', fontSize: '14px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FaCalendarAlt /> {event.date}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FaMapMarkerAlt /> {event.location}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right/Bottom: Details & Booking or Form */}
                    <div style={{ flex: 1.2, padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                        {showForm ? (
                            <div style={{ animation: 'fadeIn 0.3s ease' }}>
                                <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline' }}>
                                        &larr; Back to details
                                    </button>
                                </div>
                                <ContactForm
                                    inquiryType="event"
                                    listingTitle={event.title}
                                    onSuccess={() => setTimeout(onClose, 3000)}
                                    successMessage={`Thank you! Your enquiry for ${event.title} has been received. We will contact you within 2 days with further details.`}
                                />
                            </div>
                        ) : (
                            <>
                                {event.price && (
                                    <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase' }}>Price</span>
                                            <div style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>{event.price}</div>
                                        </div>
                                        {event.coordinator && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#27272a', padding: '8px 16px', borderRadius: '50px' }}>
                                                <img src={event.coordinator.image} alt="Host" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                                                <div>
                                                    <div style={{ fontSize: '12px', color: '#a1a1aa' }}>Hosted by</div>
                                                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>{event.coordinator.name}</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <p style={{ color: '#a1a1aa', lineHeight: '1.6', marginBottom: '32px' }}>{event.description}</p>

                                {isRich && (
                                    <>
                                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'white', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            Experience Itinerary
                                        </h3>
                                        <div style={{ borderLeft: '2px solid #333', marginLeft: '6px', paddingLeft: '24px', marginBottom: '32px' }}>
                                            {event.itinerary.map((item, i) => (
                                                <div key={i} style={{ marginBottom: '20px', position: 'relative' }}>
                                                    <div style={{
                                                        position: 'absolute', left: '-31px', top: '4px',
                                                        width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)',
                                                        border: '2px solid #18181b'
                                                    }} />
                                                    <div style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '600' }}>{item.time}</div>
                                                    <div style={{ color: '#e4e4e7', fontSize: '15px' }}>{item.activity}</div>
                                                </div>
                                            ))}
                                        </div>

                                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'white', marginBottom: '16px' }}>What's Included</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
                                            {event.inclusions.map((inc, i) => (
                                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d4d4d8', fontSize: '14px' }}>
                                                    <FaCheckCircle color="var(--primary)" size={14} /> {inc}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid #333' }}>
                                    {event.coordinator && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#71717a', fontSize: '13px', marginBottom: '16px' }}>
                                            <FaPhoneAlt size={12} /> Questions? Call {event.coordinator.phone}
                                        </div>
                                    )}
                                    <button
                                        style={{
                                            width: '100%', padding: '16px', background: 'var(--primary)', color: 'white',
                                            borderRadius: '12px', fontSize: '16px', fontWeight: '700', border: 'none', cursor: 'pointer',
                                            transition: 'transform 0.2s'
                                        }}
                                        onClick={() => setShowForm(true)}
                                        onMouseEnter={e => e.target.style.transform = 'scale(1.02)'}
                                        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                                    >
                                        Send Enquiry
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default EventModal;
