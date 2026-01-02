import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { packagesAPI } from '../services/api';
import BookingModal from '../components/BookingModal';
import { FaCheck, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const PackageDetailsPage = () => {
    const { id } = useParams();
    const [pkg, setPkg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                const data = await packagesAPI.getPackageById(id);
                setPkg(data);
            } catch (error) {
                console.error('Failed to fetch package:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPackage();
    }, [id]);

    if (loading) return <div className="container" style={{ paddingTop: '40px' }}>Loading...</div>;
    if (!pkg) return <div className="container" style={{ paddingTop: '40px' }}>Package not found</div>;

    return (
        <div style={{ paddingBottom: '80px' }}>
            {/* Hero Section */}
            <div style={{ height: '500px', width: '100%', position: 'relative' }}>
                <img src={pkg.image} alt={pkg.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                    padding: '40px 0',
                    color: 'white'
                }}>
                    <div className="container">
                        <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '16px' }}>{pkg.title}</h1>
                        <div style={{ display: 'flex', gap: '24px', fontSize: '18px', fontWeight: '500' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaClock /> {pkg.duration}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaMapMarkerAlt /> {pkg.location}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container" style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
                {/* Main Content */}
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Overview</h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '40px' }}>
                        {pkg.description}
                    </p>

                    <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>Itinerary</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
                        {pkg.itinerary.map((item, index) => (
                            <div key={index} style={{ display: 'flex', gap: '20px' }}>
                                <div style={{
                                    minWidth: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '700'
                                }}>
                                    {item.day}
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{item.title}</h4>
                                    <p style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>What's Included</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '40px' }}>
                        {pkg.inclusions.map((item, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <FaCheck color="var(--secondary)" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div>
                    <div style={{
                        padding: '24px',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border)',
                        boxShadow: 'var(--shadow-lg)',
                        position: 'sticky',
                        top: '100px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
                            <span style={{ fontSize: '24px', fontWeight: '700' }}>${pkg.price}</span>
                            <span style={{ color: 'var(--text-secondary)' }}>per person</span>
                        </div>

                        <button
                            className="btn-primary"
                            style={{ width: '100%', marginBottom: '16px' }}
                            onClick={() => setIsBookingModalOpen(true)}
                        >
                            Book Now
                        </button>

                        <div style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
                            No credit card required to reserve
                        </div>
                    </div>
                </div>
            </div>

            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                listing={pkg}
                isPackage={true}
            />
        </div>
    );
};

export default PackageDetailsPage;
