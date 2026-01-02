import { useState, useEffect } from 'react';
import { adminAPI, listingsAPI } from '../../services/api';
import { FaSearch, FaTrash, FaStar, FaMapMarkerAlt, FaBed, FaBath, FaHome, FaWifi, FaTv, FaSwimmingPool, FaSnowflake, FaHotTub, FaUmbrellaBeach, FaCoffee, FaParking, FaEdit, FaPlus, FaTimes, FaCheck, FaImages } from 'react-icons/fa';
import { MdSmokeFree, MdPets, MdKitchen, MdElevator, MdBalcony, MdOutlineBathtub } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

const AdminListings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Detailed State for New/Edit Listing
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        price: '',
        description: '',
        images: [''],
        details: { guests: 2, bedrooms: 1, beds: 1, baths: 1 },
        amenities: [],
        roomTypes: []
    });

    const amenityIcons = {
        "Wifi": <FaWifi />, "Kitchen": <MdKitchen />, "AC": <FaSnowflake />, "Pool": <FaSwimmingPool />,
        "Hot Tub": <FaHotTub />, "Patio": <FaUmbrellaBeach />, "BBQ": <FaCoffee />, "Gym": <FaHome />,
        "TV": <FaTv />, "Breakfast": <FaCoffee />, "Parking": <FaParking />, "Balcony": <MdBalcony />,
        "Bathtub": <MdOutlineBathtub />, "Elevator": <MdElevator />, "Pet Friendly": <MdPets />
    };
    const amenitiesList = Object.keys(amenityIcons);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const cleanedData = {
                ...formData,
                price: Number(formData.price),
                images: formData.images.filter(img => img.trim() !== ''),
                image: formData.images[0] || 'https://via.placeholder.com/400'
            };
            await listingsAPI.createListing(cleanedData);
            fetchListings();
            setIsModalOpen(false);
            setFormData({
                title: '', location: '', price: '', description: '',
                images: [''], details: { guests: 2, bedrooms: 1, beds: 1, baths: 1 }, amenities: [], roomTypes: []
            });
            alert('Listing published successfully!');
        } catch (error) {
            alert('Failed to save listing');
        }
    };

    // Helper functions for dynamic fields
    const updateDetail = (field, value) => setFormData({ ...formData, details: { ...formData.details, [field]: Number(value) } });
    const toggleAmenity = (amenity) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };
    const updateImage = (index, value) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData({ ...formData, images: newImages });
    };
    const addImage = () => setFormData({ ...formData, images: [...formData.images, ''] });
    const removeImage = (index) => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });

    // Improved Room Management
    const addRoom = () => {
        setFormData(prev => ({
            ...prev,
            roomTypes: [...prev.roomTypes, { name: 'New Room', price: 100, capacity: 2, amenities: [] }]
        }));
    };
    const updateRoom = (index, field, value) => {
        const newRooms = [...formData.roomTypes];
        newRooms[index][field] = value;
        setFormData({ ...formData, roomTypes: newRooms });
    };
    const removeRoom = (index) => setFormData(prev => ({ ...prev, roomTypes: prev.roomTypes.filter((_, i) => i !== index) }));


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
                        onClick={() => setIsModalOpen(true)}
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
                                    <button onClick={() => handleDelete(listing._id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '0 8px' }}>
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Edit Drawer */}
                <AnimatePresence>
                    {isModalOpen && (
                        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsModalOpen(false)}
                                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
                            />
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                style={{
                                    width: '100%', maxWidth: '700px', background: 'white', position: 'relative', height: '100%',
                                    boxShadow: '-4px 0 24px rgba(0,0,0,0.1)', overflowY: 'auto'
                                }}
                            >
                                <div style={{ padding: '40px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>Add Property</h2>
                                        <button onClick={() => setIsModalOpen(false)} style={{ background: '#f1f5f9', border: 'none', width: 40, height: 40, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <FaTimes color="#64748b" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                        {/* Basic Info */}
                                        <section>
                                            <h3 style={sectionHeaderStyle}>Basic Details</h3>
                                            <div style={{ display: 'grid', gap: '16px' }}>
                                                <input placeholder="Property Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required style={inputStyle} />
                                                <input placeholder="Location" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required style={inputStyle} />
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                                    <input type="number" placeholder="Price ($)" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required style={inputStyle} />
                                                    <input placeholder="Max Guests" value={formData.details.guests} onChange={e => updateDetail('guests', e.target.value)} style={inputStyle} />
                                                </div>
                                                <textarea placeholder="Description" rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={inputStyle} />
                                            </div>
                                        </section>

                                        {/* Stats */}
                                        <section>
                                            <h3 style={sectionHeaderStyle}>Property Stats</h3>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                                                <input type="number" placeholder="Bedrooms" value={formData.details.bedrooms} onChange={e => updateDetail('bedrooms', e.target.value)} style={inputStyle} />
                                                <input type="number" placeholder="Beds" value={formData.details.beds} onChange={e => updateDetail('beds', e.target.value)} style={inputStyle} />
                                                <input type="number" placeholder="Baths" value={formData.details.baths} onChange={e => updateDetail('baths', e.target.value)} style={inputStyle} />
                                            </div>
                                        </section>

                                        {/* Images */}
                                        <section>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                                <h3 style={{ ...sectionHeaderStyle, marginBottom: 0 }}>Gallery</h3>
                                                <button type="button" onClick={addImage} style={{ color: 'var(--primary)', background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer' }}>+ Add Image</button>
                                            </div>
                                            <div style={{ display: 'grid', gap: '12px' }}>
                                                {formData.images.map((img, i) => (
                                                    <div key={i} style={{ display: 'flex', gap: '8px' }}>
                                                        <input placeholder="Image URL" value={img} onChange={e => updateImage(i, e.target.value)} style={inputStyle} />
                                                        <button type="button" onClick={() => removeImage(i)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><FaTrash /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        {/* Amenities */}
                                        <section>
                                            <h3 style={sectionHeaderStyle}>Amenities</h3>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px' }}>
                                                {amenitiesList.map(amenity => (
                                                    <button
                                                        key={amenity} type="button"
                                                        onClick={() => toggleAmenity(amenity)}
                                                        style={{
                                                            padding: '10px', borderRadius: '8px', border: formData.amenities.includes(amenity) ? '1px solid #0f172a' : '1px solid #e2e8f0',
                                                            background: formData.amenities.includes(amenity) ? '#0f172a' : 'white',
                                                            color: formData.amenities.includes(amenity) ? 'white' : '#64748b',
                                                            cursor: 'pointer', fontSize: '13px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textAlign: 'center'
                                                        }}
                                                    >
                                                        <span style={{ fontSize: '18px' }}>{amenityIcons[amenity]}</span>
                                                        {amenity}
                                                    </button>
                                                ))}
                                            </div>
                                        </section>

                                        {/* Room Types */}
                                        <section style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                                <h3 style={{ ...sectionHeaderStyle, marginBottom: 0 }}>Room Types</h3>
                                                <button type="button" onClick={addRoom} style={{ color: 'var(--primary)', background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer' }}>+ Add Room</button>
                                            </div>
                                            <div style={{ display: 'grid', gap: '16px' }}>
                                                {formData.roomTypes.map((room, i) => (
                                                    <div key={i} style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                                            <div style={{ fontWeight: '700', color: '#334155' }}>Room #{i + 1}</div>
                                                            <button type="button" onClick={() => removeRoom(i)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><FaTrash /></button>
                                                        </div>
                                                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
                                                            <input placeholder="Name (e.g. Deluxe Suite)" value={room.name} onChange={e => updateRoom(i, 'name', e.target.value)} style={smallInputStyle} />
                                                            <input type="number" placeholder="Price" value={room.price} onChange={e => updateRoom(i, 'price', e.target.value)} style={smallInputStyle} />
                                                            <input type="number" placeholder="Guests" value={room.capacity} onChange={e => updateRoom(i, 'capacity', e.target.value)} style={smallInputStyle} />
                                                        </div>
                                                    </div>
                                                ))}
                                                {formData.roomTypes.length === 0 && <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>No specific room types added.</div>}
                                            </div>
                                        </section>

                                        <button type="submit" style={{ marginTop: '16px', background: '#0f172a', color: 'white', padding: '18px', borderRadius: '14px', fontSize: '16px', fontWeight: '700', border: 'none', cursor: 'pointer' }}>
                                            Publish Property
                                        </button>
                                        <div style={{ height: '40px' }} />
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const sectionHeaderStyle = { fontSize: '14px', textTransform: 'uppercase', fontWeight: '800', color: '#94a3b8', letterSpacing: '1px', marginBottom: '16px' };
const inputStyle = { width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none', background: 'white' };
const smallInputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none' };

export default AdminListings;
