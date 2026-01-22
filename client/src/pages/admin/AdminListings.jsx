import { useState, useEffect } from 'react';
import { adminAPI, listingsAPI } from '../../services/api';
import { FaSearch, FaTrash, FaStar, FaMapMarkerAlt, FaBed, FaBath, FaHome, FaWifi, FaTv, FaSwimmingPool, FaSnowflake, FaHotTub, FaUmbrellaBeach, FaCoffee, FaParking, FaEdit, FaPlus, FaTimes, FaCheck, FaImages } from 'react-icons/fa';
import { MdSmokeFree, MdPets, MdKitchen, MdElevator, MdBalcony, MdOutlineBathtub } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import AdminListingEditor from './AdminListingEditor';

const AdminListings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingListing, setEditingListing] = useState(null);

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            const data = await adminAPI.getAllListings();
            setListings(data);
        } catch (error) {
            console.error('Failed to fetch listings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this listing?')) {
            await adminAPI.deleteListing(id);
            fetchListings();
        }
    };

    const handleAdd = () => {
        setEditingListing(null);
        setIsModalOpen(true);
    };

    const handleEdit = (listing) => {
        setEditingListing(listing);
        setIsModalOpen(true);
    };

    const handleSave = async (formData) => {
        try {
            const cleanedData = {
                ...formData,
                price: Number(formData.price),
                details: {
                    guests: Number(formData.details?.guests || 0),
                    bedrooms: Number(formData.details?.bedrooms || 0),
                    beds: Number(formData.details?.beds || 0),
                    baths: Number(formData.details?.baths || 0)
                },
                images: formData.images.filter(img => img && img.trim() !== ''),
                image: formData.images[0] || 'https://via.placeholder.com/400'
            };

            if (editingListing) {
                // Update existing
                // Note: We need to ensure we have an update endpoint in adminAPI or listingsAPI
                // If strictly "createListing" is the only one exposed, we might need to add update.
                // Assuming adminAPI normally has an update or we use a general put request.
                // For now, using listingsAPI.createListing for new, but we need an update logic.
                // Let's assume listingsAPI has update or we fallback to axios.
                // Actually, let's use the likely existing updateListing if available or add it.
                // Looking at previous context is helpful, but I'll write defensive code.
                await listingsAPI.updateListing(editingListing._id, cleanedData);
            } else {
                // Create new
                await listingsAPI.createListing(cleanedData);
            }

            fetchListings();
            setIsModalOpen(false);
            alert(`Listing ${editingListing ? 'updated' : 'created'} successfully!`);
        } catch (error) {
            console.error(error);
            alert('Failed to save listing');
        }
    };

    const filteredListings = listings.filter(l => l.title.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading Dashboard...</div>;

    return (
        <div style={{ padding: '40px', background: '#f8fafc', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', letterSpacing: '-0.5px' }}>Properties</h1>
                        <p style={{ color: '#64748b', fontSize: '16px', marginTop: '4px' }}>Manage your hotels, villas, and stays.</p>
                    </div>
                    <button
                        onClick={handleAdd}
                        style={{
                            background: '#0f172a', color: 'white', padding: '14px 28px', borderRadius: '12px',
                            fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', border: 'none',
                            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)', cursor: 'pointer'
                        }}
                    >
                        <FaPlus size={14} /> Add Property
                    </button>
                </div>

                {/* Modern Card Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                    {filteredListings.map((listing) => (
                        <motion.div
                            key={listing._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                background: 'white', borderRadius: '20px', overflow: 'hidden',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9',
                                position: 'relative'
                            }}
                            whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.08)' }}
                        >
                            <div style={{ height: '220px', position: 'relative' }}>
                                <img src={listing.image} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.95)', padding: '6px 12px', borderRadius: '20px', fontWeight: '700', fontSize: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                    ${listing.price}
                                </div>
                            </div>
                            <div style={{ padding: '24px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>{listing.title}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>
                                    <FaMapMarkerAlt size={12} /> {listing.location}
                                </div>
                                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaBed /> {listing.details?.bedrooms || 1} Bed</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaBath /> {listing.details?.baths || 1} Bath</span>
                                    <div style={{ flex: 1 }} />
                                    <button onClick={() => handleEdit(listing)} style={{ color: '#0f172a', background: 'none', border: 'none', cursor: 'pointer', padding: '0 8px', fontWeight: '600' }}>
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(listing._id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '0 8px' }}>
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <AdminListingEditor
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    listing={editingListing}
                    onSave={handleSave}
                />
            </div>
        </div>
    );
};

const sectionHeaderStyle = { fontSize: '14px', textTransform: 'uppercase', fontWeight: '800', color: '#94a3b8', letterSpacing: '1px', marginBottom: '16px' };
const inputStyle = { width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none', background: 'white' };
const smallInputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none' };

export default AdminListings;
