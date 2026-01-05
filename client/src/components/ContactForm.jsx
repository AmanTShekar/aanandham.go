import { useState } from 'react';
import { FaEnvelope, FaPhone, FaUser, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import { inquiryAPI } from '../services/api';
import GuestSelector from './SearchWidget/GuestSelector';
import DateRangeSelector from './SearchWidget/DateRangeSelector';


const ContactForm = ({
    inquiryType = 'general',
    listingId = null,
    experienceId = null,
    listingTitle = '',
    onSuccess = null,
    successMessage = null
}) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        checkIn: '',
        checkOut: '',
        guests: ''
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const inquiryData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                subject: formData.subject || `Inquiry about ${listingTitle || 'Aanandham'}`,
                message: formData.message,
                inquiryType
            };

            if (listingId) inquiryData.listingId = listingId;
            if (experienceId) inquiryData.experienceId = experienceId;
            if (formData.checkIn) inquiryData.checkIn = formData.checkIn;
            if (formData.checkOut) inquiryData.checkOut = formData.checkOut;
            if (formData.guests) inquiryData.guests = parseInt(formData.guests);

            await inquiryAPI.submitInquiry(inquiryData);

            setSuccess(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
                checkIn: '',
                checkOut: '',
                guests: ''
            });

            if (onSuccess) {
                setTimeout(() => {
                    onSuccess();
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit inquiry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{
                padding: '48px',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
                borderRadius: '16px',
                border: '1px solid #262626'
            }}>
                <FaCheckCircle size={64} style={{ color: '#10b981', marginBottom: '24px' }} />
                <h3 style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: 'white',
                    marginBottom: '16px'
                }}>
                    Thank You!
                </h3>
                <p style={{
                    fontSize: '16px',
                    color: '#a1a1aa',
                    lineHeight: '1.6',
                    maxWidth: '400px',
                    margin: '0 auto'
                }}>
                    {successMessage || (
                        <>
                            Your inquiry has been submitted successfully. We'll get back to you at{' '}
                            <span style={{ color: 'white', fontWeight: '600' }}>{formData.email}</span> within 24 hours.
                        </>
                    )}
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={{
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
            padding: '32px',
            borderRadius: '16px',
            border: '1px solid #262626'
        }}>
            <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: 'white',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }}>
                <FaEnvelope size={24} style={{ color: '#D4AF37' }} />
                {inquiryType === 'listing' ? 'Inquire About This Property' :
                    inquiryType === 'experience' ? 'Inquire About This Experience' :
                        'Get In Touch'}
            </h3>

            {error && (
                <div style={{
                    padding: '12px 16px',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    color: '#dc2626',
                    marginBottom: '20px',
                    fontSize: '14px'
                }}>
                    {error}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div style={{ position: 'relative' }}>
                    <FaUser style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#71717a',
                        fontSize: '16px'
                    }} />
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name *"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{
                            width: '100%',
                            padding: '14px 16px 14px 48px',
                            background: '#1a1a1a',
                            border: '1px solid #333',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '15px',
                            outline: 'none',
                            transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                        onBlur={(e) => e.target.style.borderColor = '#333'}
                    />
                </div>

                <div style={{ position: 'relative' }}>
                    <FaEnvelope style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#71717a',
                        fontSize: '16px'
                    }} />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address *"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{
                            width: '100%',
                            padding: '14px 16px 14px 48px',
                            background: '#1a1a1a',
                            border: '1px solid #333',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '15px',
                            outline: 'none',
                            transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                        onBlur={(e) => e.target.style.borderColor = '#333'}
                    />
                </div>
            </div>

            <div style={{ marginBottom: '16px', position: 'relative' }}>
                <FaPhone style={{
                    position: 'absolute',
                    left: '16px',
                    top: '18px',
                    color: '#71717a',
                    fontSize: '16px'
                }} />
                <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number (Optional)"
                    value={formData.phone}
                    onChange={handleChange}
                    style={{
                        width: '100%',
                        padding: '14px 16px 14px 48px',
                        background: '#1a1a1a',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '15px',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                    onBlur={(e) => e.target.style.borderColor = '#333'}
                />
            </div>

            {inquiryType !== 'general' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                        <label style={{ display: 'block', color: '#a1a1aa', fontSize: '14px', marginBottom: '8px' }}>
                            Dates
                        </label>
                        <div style={{
                            width: '100%',
                            padding: '14px 16px',
                            background: '#1a1a1a',
                            border: '1px solid #333',
                            borderRadius: '8px',
                            transition: 'all 0.3s ease',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <DateRangeSelector
                                checkIn={formData.checkIn}
                                checkOut={formData.checkOut}
                                setCheckIn={(date) => setFormData(prev => ({ ...prev, checkIn: date }))}
                                setCheckOut={(date) => setFormData(prev => ({ ...prev, checkOut: date }))}
                                theme="dark"
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', color: '#a1a1aa', fontSize: '14px', marginBottom: '8px' }}>
                            Guests
                        </label>
                        <div style={{
                            width: '100%',
                            padding: '14px 16px',
                            background: '#1a1a1a',
                            border: '1px solid #333',
                            borderRadius: '8px',
                            transition: 'all 0.3s ease',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <GuestSelector
                                guests={parseInt(formData.guests) || 0}
                                setGuests={(val) => setFormData(prev => ({ ...prev, guests: val }))}
                                theme="dark"
                            />
                        </div>
                    </div>
                </div>
            )}

            {inquiryType === 'general' && (
                <div style={{ marginBottom: '16px' }}>
                    <input
                        type="text"
                        name="subject"
                        placeholder="Subject *"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        style={{
                            width: '100%',
                            padding: '14px 16px',
                            background: '#1a1a1a',
                            border: '1px solid #333',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '15px',
                            outline: 'none',
                            transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                        onBlur={(e) => e.target.style.borderColor = '#333'}
                    />
                </div>
            )}

            <div style={{ marginBottom: '24px' }}>
                <textarea
                    name="message"
                    placeholder="Your Message *"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    style={{
                        width: '100%',
                        padding: '14px 16px',
                        background: '#1a1a1a',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '15px',
                        outline: 'none',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                        transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                    onBlur={(e) => e.target.style.borderColor = '#333'}
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: loading ? '#71717a' : 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#0a0a0a',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    transition: 'all 0.3s ease',
                    transform: loading ? 'scale(1)' : 'scale(1)',
                }}
                onMouseEnter={(e) => {
                    if (!loading) {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 24px rgba(212, 175, 55, 0.4)';
                    }
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                }}
            >
                <FaPaperPlane size={18} />
                {loading ? 'Sending...' : 'Send Inquiry'}
            </button>

            <p style={{
                marginTop: '16px',
                fontSize: '13px',
                color: '#71717a',
                textAlign: 'center',
                lineHeight: '1.5'
            }}>
                By submitting this form, you agree to be contacted by our team at{' '}
                <a href="mailto:bookings@aanandhamgo.in" style={{ color: '#D4AF37', textDecoration: 'none' }}>
                    bookings@aanandhamgo.in
                </a>
            </p>
        </form>
    );
};

export default ContactForm;
