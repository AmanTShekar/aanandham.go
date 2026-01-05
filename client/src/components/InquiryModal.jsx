import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import ContactForm from './ContactForm';

const InquiryModal = ({
    isOpen,
    onClose,
    inquiryType = 'general',
    listing = null,
    experience = null
}) => {
    if (!isOpen) return null;

    const title = listing?.title || experience?.title || 'Aanandham';
    const itemId = listing?._id || listing?.id || experience?._id || experience?.id;

    const handleSuccess = () => {
        setTimeout(() => {
            onClose();
        }, 2000);
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000,
                padding: '20px',
                overflowY: 'auto'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: '#0a0a0a',
                    borderRadius: '20px',
                    maxWidth: '600px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    position: 'relative',
                    border: '1px solid #262626',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: '#1a1a1a',
                        border: '1px solid #333',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 10,
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = '#D4AF37';
                        e.target.style.borderColor = '#D4AF37';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = '#1a1a1a';
                        e.target.style.borderColor = '#333';
                    }}
                >
                    <FaTimes size={18} color="white" />
                </button>

                {/* Modal Content */}
                <div style={{ padding: '32px' }}>
                    {/* Header with listing/experience info */}
                    {(listing || experience) && (
                        <div style={{
                            marginBottom: '32px',
                            paddingBottom: '24px',
                            borderBottom: '1px solid #262626'
                        }}>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                {(listing?.image || experience?.image) && (
                                    <img
                                        src={listing?.image || experience?.image}
                                        alt={title}
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '12px',
                                            objectFit: 'cover',
                                            border: '1px solid #262626'
                                        }}
                                    />
                                )}
                                <div style={{ flex: 1 }}>
                                    <h3 style={{
                                        fontSize: '20px',
                                        fontWeight: '700',
                                        color: 'white',
                                        marginBottom: '8px',
                                        lineHeight: '1.3'
                                    }}>
                                        {title}
                                    </h3>
                                    <p style={{
                                        fontSize: '14px',
                                        color: '#a1a1aa',
                                        margin: 0
                                    }}>
                                        {listing?.location || experience?.location}
                                    </p>
                                    {(listing?.price || experience?.price) && (
                                        <p style={{
                                            fontSize: '16px',
                                            color: '#D4AF37',
                                            fontWeight: '600',
                                            marginTop: '8px',
                                            margin: 0
                                        }}>
                                            ₹{listing?.price || experience?.price}
                                            {listing && ' / night'}
                                            {experience && ` / ${experience.duration}`}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contact Form */}
                    <ContactForm
                        inquiryType={inquiryType}
                        listingId={listing ? itemId : null}
                        experienceId={experience ? itemId : null}
                        listingTitle={title}
                        onSuccess={handleSuccess}
                    />
                </div>
            </div>
        </div>
    );
};

export default InquiryModal;
