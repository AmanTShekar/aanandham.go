import { useState } from 'react';
import { FaEnvelope, FaPhone, FaUser, FaPaperPlane, FaCheckCircle, FaUsers, FaCalendar } from 'react-icons/fa';
import { inquiryAPI } from '../services/api';

const GroupEventForm = ({
    inquiryType = 'group',
    listingId = null,
    listingTitle = '',
    propertyType = 'tent',
    onSuccess = null
}) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        groupSize: '',
        eventType: '',
        eventDate: '',
        eventDuration: '1',
        budget: '',
        specialRequirements: ''
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const eventTypes = [
        'Wedding',
        'Corporate Event',
        'Birthday Party',
        'Anniversary',
        'Team Retreat',
        'Family Reunion',
        'Festival/Concert',
        'Other'
    ];

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
                subject: formData.subject || `Group/Event Inquiry for ${listingTitle}`,
                message: formData.message,
                inquiryType: inquiryType,
                isGroupBooking: true,
                groupSize: parseInt(formData.groupSize),
                eventType: formData.eventType,
                eventDate: formData.eventDate,
                eventDuration: formData.eventDuration,
                specialRequirements: formData.specialRequirements,
                budget: formData.budget ? parseFloat(formData.budget) : null
            };

            if (listingId) inquiryData.listingId = listingId;

            await inquiryAPI.submitInquiry(inquiryData);

            setSuccess(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
                groupSize: '',
                eventType: '',
                eventDate: '',
                eventDuration: '1',
                budget: '',
                specialRequirements: ''
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
                    Request Received!
                </h3>
                <p style={{
                    fontSize: '16px',
                    color: '#a1a1aa',
                    lineHeight: '1.6',
                    maxWidth: '400px',
                    margin: '0 auto'
                }}>
                    Thank you for your group/event inquiry. Our team will review your requirements and get back to you within 24 hours at{' '}
                    <span style={{ color: 'white', fontWeight: '600' }}>{formData.email}</span>
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
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }}>
                <FaUsers size={24} style={{ color: '#D4AF37' }} />
                Group & Event Booking
            </h3>
            <p style={{ fontSize: '14px', color: '#a1a1aa', marginBottom: '24px' }}>
                Perfect for large groups, weddings, corporate events, and special celebrations
            </p>

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

            {/* Personal Information */}
            <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
                    Contact Information
                </h4>
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

                <div style={{ position: 'relative' }}>
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
                        placeholder="Phone Number *"
                        value={formData.phone}
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

            {/* Event Details */}
            <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
                    Event Details
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                        <label style={{ display: 'block', color: '#a1a1aa', fontSize: '14px', marginBottom: '8px' }}>
                            Event Type *
                        </label>
                        <select
                            name="eventType"
                            value={formData.eventType}
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
                        >
                            <option value="">Select Event Type</option>
                            {eventTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', color: '#a1a1aa', fontSize: '14px', marginBottom: '8px' }}>
                            Group Size *
                        </label>
                        <input
                            type="number"
                            name="groupSize"
                            min="10"
                            placeholder="Number of guests"
                            value={formData.groupSize}
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
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                        <label style={{ display: 'block', color: '#a1a1aa', fontSize: '14px', marginBottom: '8px' }}>
                            Event Date *
                        </label>
                        <input
                            type="date"
                            name="eventDate"
                            value={formData.eventDate}
                            onChange={handleChange}
                            required
                            min={new Date().toISOString().split('T')[0]}
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

                    <div>
                        <label style={{ display: 'block', color: '#a1a1aa', fontSize: '14px', marginBottom: '8px' }}>
                            Duration (days)
                        </label>
                        <input
                            type="number"
                            name="eventDuration"
                            min="1"
                            value={formData.eventDuration}
                            onChange={handleChange}
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
                </div>

                <div>
                    <label style={{ display: 'block', color: '#a1a1aa', fontSize: '14px', marginBottom: '8px' }}>
                        Budget (Optional)
                    </label>
                    <input
                        type="number"
                        name="budget"
                        placeholder="₹ Approximate budget"
                        value={formData.budget}
                        onChange={handleChange}
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
            </div>

            {/* Special Requirements */}
            <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', color: '#a1a1aa', fontSize: '14px', marginBottom: '8px' }}>
                    Special Requirements
                </label>
                <textarea
                    name="specialRequirements"
                    placeholder="Any special requirements, dietary restrictions, accessibility needs, etc."
                    value={formData.specialRequirements}
                    onChange={handleChange}
                    rows="3"
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

            {/* Additional Message */}
            <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', color: '#a1a1aa', fontSize: '14px', marginBottom: '8px' }}>
                    Additional Message *
                </label>
                <textarea
                    name="message"
                    placeholder="Tell us more about your event..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
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
                {loading ? 'Sending...' : 'Submit Group Inquiry'}
            </button>

            <p style={{
                marginTop: '16px',
                fontSize: '13px',
                color: '#71717a',
                textAlign: 'center',
                lineHeight: '1.5'
            }}>
                Our event planning team will contact you within 24 hours to discuss your requirements
            </p>
        </form>
    );
};

export default GroupEventForm;
