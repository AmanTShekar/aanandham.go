
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSave, FaImage, FaList, FaMapMarkerAlt, FaInfoCircle, FaBed, FaCheck, FaTrash, FaPlus, FaCog } from 'react-icons/fa';
import { MdSmokeFree, MdPets, MdKitchen, MdElevator, MdBalcony, MdOutlineBathtub } from 'react-icons/md';

const AdminListingEditor = ({ isOpen, onClose, listing, onSave }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        price: '',
        description: '',
        propertyType: 'hotel',
        category: '',
        bookingType: 'instant',
        supportsGroups: false,
        supportsEvents: false,
        maxGroupSize: 0,
        guestFavorite: false,
        images: [''],
        details: { guests: 2, bedrooms: 1, beds: 1, baths: 1 },
        amenities: [],
        roomTypes: []
    });

    useEffect(() => {
        if (listing) {
            setFormData({
                ...listing,
                images: listing.images && listing.images.length > 0 ? listing.images : [''],
                details: listing.details || { guests: 2, bedrooms: 1, beds: 1, baths: 1 },
                amenities: listing.amenities || [],
                roomTypes: listing.roomTypes || []
            });
        } else {
            // Reset for new listing
            setFormData({
                title: '',
                location: '',
                price: '',
                description: '',
                propertyType: 'hotel',
                category: '',
                images: [''],
                details: { guests: 2, bedrooms: 1, beds: 1, baths: 1 },
                amenities: [],
                roomTypes: []
            });
        }
    }, [listing, isOpen]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleDetailChange = (field, value) => {
        setFormData(prev => ({ ...prev, details: { ...prev.details, [field]: Number(value) } }));
    };

    const toggleAmenity = (amenity) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const handleImageChange = (index, value) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const addImage = () => setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
    const removeImage = (index) => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));

    const handleRoomChange = (index, field, value) => {
        const newRooms = [...formData.roomTypes];
        newRooms[index][field] = value;
        setFormData(prev => ({ ...prev, roomTypes: newRooms }));
    };

    const addRoom = () => {
        setFormData(prev => ({
            ...prev,
            roomTypes: [...prev.roomTypes, { name: 'New Room', price: 100, capacity: 2, amenities: [] }]
        }));
    };

    const removeRoom = (index) => {
        setFormData(prev => ({ ...prev, roomTypes: prev.roomTypes.filter((_, i) => i !== index) }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: FaInfoCircle },
        { id: 'location', label: 'Location', icon: FaMapMarkerAlt },
        { id: 'details', label: 'Details', icon: FaBed },
        { id: 'amenities', label: 'Amenities', icon: FaList },
        { id: 'rooms', label: 'Rooms', icon: FaBed },
        { id: 'photos', label: 'Photos', icon: FaImage },
        { id: 'settings', label: 'Settings', icon: FaCog },
    ];

    const amenityOptions = [
        "Wifi", "Kitchen", "AC", "Pool", "Hot Tub", "Patio", "BBQ", "Gym",
        "TV", "Breakfast", "Parking", "Balcony", "Bathtub", "Elevator", "Pet Friendly"
    ];

    const campAmenityOptions = [
        "Campfire", "Trekking", "Stargazing", "River Access", "Forest View",
        "Sleeping Bags", "Tents Provided", "Caretaker", "Power Backup",
        "Shared Washroom", "Private Washroom", "Hot Water", "Off-road Jeep",
        "Bird Watching", "Fishing", "Hammock", "Fenced Area"
    ];

    const eventAmenityOptions = [
        "Stage", "Sound System", "Projector", "Banquet Hall", "Large Lawn",
        "Catering Area", "Decoration Permitted", "Dance Floor", "Podium",
        "Valet Parking", "Security Guard", "Changing Room", "Generator Backup"
    ];

    if (!isOpen) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                    background: 'white',
                    width: '900px',
                    maxWidth: '95vw',
                    height: '85vh',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
            >
                {/* Header */}
                <div style={{ padding: '24px 32px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>
                            {listing ? 'Edit Property' : 'Add New Property'}
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '14px' }}>Fill in the details below to publish your listing.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                        <button onClick={handleSubmit} style={{ padding: '10px 24px', borderRadius: '12px', border: 'none', background: '#0f172a', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaSave /> Save Listing
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                    {/* Sidebar Tabs */}
                    <div style={{ width: '240px', background: '#f8fafc', borderRight: '1px solid #e2e8f0', padding: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        padding: '12px 16px', borderRadius: '12px',
                                        border: 'none', background: activeTab === tab.id ? 'white' : 'transparent',
                                        color: activeTab === tab.id ? '#0f172a' : '#64748b',
                                        fontWeight: activeTab === tab.id ? '700' : '500',
                                        boxShadow: activeTab === tab.id ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
                                    }}
                                >
                                    <tab.icon /> {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '32px', background: '#fff' }}>
                        {activeTab === 'overview' && (
                            <div style={{ display: 'grid', gap: '24px', maxWidth: '800px' }}>
                                <div style={formGroup}>
                                    <label style={labelStyle}>Property Title</label>
                                    <input value={formData.title} onChange={e => handleChange('title', e.target.value)} style={inputStyle} placeholder="e.g. Luxury Villa in Munnar" />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                    <div style={formGroup}>
                                        <label style={labelStyle}>Price per Night ($)</label>
                                        <input type="number" value={formData.price} onChange={e => handleChange('price', e.target.value)} style={inputStyle} />
                                    </div>
                                    <div style={formGroup}>
                                        <label style={labelStyle}>Property Type</label>
                                        <select value={formData.propertyType} onChange={e => handleChange('propertyType', e.target.value)} style={inputStyle}>
                                            <option value="hotel">Hotel</option>
                                            <option value="tent">Tent / Glamping</option>
                                            <option value="resort">Resort</option>
                                            <option value="villa">Villa</option>
                                            <option value="cottage">Cottage</option>
                                            <option value="campsite">Campsite</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={formGroup}>
                                    <label style={labelStyle}>Description</label>
                                    <textarea rows={6} value={formData.description} onChange={e => handleChange('description', e.target.value)} style={{ ...inputStyle, lineHeight: '1.6' }} placeholder="Describe the property..." />
                                </div>
                            </div>
                        )}

                        {activeTab === 'location' && (
                            <div style={{ display: 'grid', gap: '24px', maxWidth: '800px' }}>
                                <div style={formGroup}>
                                    <label style={labelStyle}>Full Address</label>
                                    <input value={formData.location} onChange={e => handleChange('location', e.target.value)} style={inputStyle} placeholder="e.g. 123 Munnar Road, Kerala" />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                    <div style={formGroup}>
                                        <label style={labelStyle}>Latitude</label>
                                        <input type="number" step="any" value={formData.latitude || ''} onChange={e => handleChange('latitude', e.target.value)} style={inputStyle} placeholder="e.g. 10.0889" />
                                    </div>
                                    <div style={formGroup}>
                                        <label style={labelStyle}>Longitude</label>
                                        <input type="number" step="any" value={formData.longitude || ''} onChange={e => handleChange('longitude', e.target.value)} style={inputStyle} placeholder="e.g. 77.0595" />
                                    </div>
                                </div>
                                <div style={{ padding: '20px', background: '#f0f9ff', borderRadius: '12px', color: '#0369a1', fontSize: '14px', lineHeight: '1.6' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                        <FaInfoCircle style={{ marginTop: '3px', flexShrink: 0 }} />
                                        <div>
                                            <strong>Accurate Location for Search:</strong><br />
                                            Please enter precise coordinates to ensure this property appears correctly in map-based searches.
                                            <div style={{ marginTop: '8px' }}>
                                                <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" style={{ color: '#0f172a', fontWeight: '600', textDecoration: 'underline' }}>
                                                    Find coordinates on Google Maps &rarr;
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'details' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '800px' }}>
                                <div style={formGroup}>
                                    <label style={labelStyle}>Max Guests</label>
                                    <input type="number" value={formData.details.guests} onChange={e => handleDetailChange('guests', e.target.value)} style={inputStyle} />
                                </div>
                                <div style={formGroup}>
                                    <label style={labelStyle}>Bedrooms</label>
                                    <input type="number" value={formData.details.bedrooms} onChange={e => handleDetailChange('bedrooms', e.target.value)} style={inputStyle} />
                                </div>
                                <div style={formGroup}>
                                    <label style={labelStyle}>Beds</label>
                                    <input type="number" value={formData.details.beds} onChange={e => handleDetailChange('beds', e.target.value)} style={inputStyle} />
                                </div>
                                <div style={formGroup}>
                                    <label style={labelStyle}>Bathrooms</label>
                                    <input type="number" value={formData.details.baths} onChange={e => handleDetailChange('baths', e.target.value)} style={inputStyle} />
                                </div>
                            </div>
                        )}

                        {activeTab === 'amenities' && (
                            <div>
                                <h3 style={{ marginBottom: '20px', color: '#334155' }}>Select Amenities</h3>

                                {/* Standard Amenities */}
                                <div style={{ marginBottom: '32px' }}>
                                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#475569', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Standard Amenities</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
                                        {amenityOptions.map(amenity => (
                                            <label key={amenity} style={{
                                                display: 'flex', alignItems: 'center', gap: '10px',
                                                padding: '16px', borderRadius: '12px',
                                                border: formData.amenities.includes(amenity) ? '2px solid #0f172a' : '1px solid #e2e8f0',
                                                cursor: 'pointer', transition: 'all 0.1s',
                                                background: formData.amenities.includes(amenity) ? '#f8fafc' : 'white'
                                            }}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.amenities.includes(amenity)}
                                                    onChange={() => toggleAmenity(amenity)}
                                                    style={{ width: '18px', height: '18px', accentColor: '#0f172a' }}
                                                />
                                                <span style={{ fontWeight: '600', color: '#334155' }}>{amenity}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Camping & Outdoors - Highlighted for Camp types */}
                                <div style={{
                                    padding: '24px',
                                    background: ['tent', 'campsite', 'glamping', 'cottage'].includes(formData.propertyType) ? '#f0fdf4' : '#f8fafc',
                                    borderRadius: '16px',
                                    border: ['tent', 'campsite', 'glamping', 'cottage'].includes(formData.propertyType) ? '1px solid #bbf7d0' : '1px solid #e2e8f0'
                                }}>
                                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#166534', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FaMapMarkerAlt /> Camping & Outdoors
                                    </h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
                                        {campAmenityOptions.map(amenity => (
                                            <label key={amenity} style={{
                                                display: 'flex', alignItems: 'center', gap: '10px',
                                                padding: '16px', borderRadius: '12px',
                                                border: formData.amenities.includes(amenity) ? '2px solid #166534' : '1px solid #e2e8f0', // Green border for camp items
                                                cursor: 'pointer', transition: 'all 0.1s',
                                                background: formData.amenities.includes(amenity) ? '#dcfce7' : 'white' // Green bg for camp items
                                            }}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.amenities.includes(amenity)}
                                                    onChange={() => toggleAmenity(amenity)}
                                                    style={{ width: '18px', height: '18px', accentColor: '#166534' }}
                                                />
                                                <span style={{ fontWeight: '600', color: '#334155' }}>{amenity}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Event Features - Visible if supportsEvents is true */}
                                {formData.supportsEvents && (
                                    <div style={{
                                        padding: '24px',
                                        background: '#fff7ed',
                                        borderRadius: '16px',
                                        border: '1px solid #ffedd5',
                                        marginTop: '32px'
                                    }}>
                                        <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#c2410c', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <FaCog /> Event & Party Features
                                        </h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
                                            {eventAmenityOptions.map(amenity => (
                                                <label key={amenity} style={{
                                                    display: 'flex', alignItems: 'center', gap: '10px',
                                                    padding: '16px', borderRadius: '12px',
                                                    border: formData.amenities.includes(amenity) ? '2px solid #c2410c' : '1px solid #e2e8f0',
                                                    cursor: 'pointer', transition: 'all 0.1s',
                                                    background: formData.amenities.includes(amenity) ? '#ffedd5' : 'white'
                                                }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.amenities.includes(amenity)}
                                                        onChange={() => toggleAmenity(amenity)}
                                                        style={{ width: '18px', height: '18px', accentColor: '#c2410c' }}
                                                    />
                                                    <span style={{ fontWeight: '600', color: '#334155' }}>{amenity}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'rooms' && (
                            <div style={{ maxWidth: '800px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                    <div>
                                        <h3 style={{ color: '#334155', margin: 0 }}>
                                            {['tent', 'campsite', 'glamping'].includes(formData.propertyType) ? 'Accommodation Units' : 'Room Types'}
                                        </h3>
                                        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                                            Define the specific {formData.propertyType === 'hotel' ? 'rooms' : 'tents/units'} available for booking.
                                        </p>
                                    </div>
                                    <button onClick={addRoom} style={{ padding: '10px 20px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FaPlus size={12} /> Add {['tent', 'campsite', 'glamping'].includes(formData.propertyType) ? 'Unit' : 'Room'}
                                    </button>
                                </div>

                                <div style={{ display: 'grid', gap: '24px' }}>
                                    {formData.roomTypes.map((room, i) => (
                                        <div key={i} style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                            {/* Header / Summary */}
                                            <div style={{ padding: '20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                    <div style={{ width: '40px', height: '40px', background: '#e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#64748b' }}>
                                                        {i + 1}
                                                    </div>
                                                    <div>
                                                        <h4 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>{room.name || 'New Unit'}</h4>
                                                        <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                                                            ${room.price}/night • {room.capacity} Guests
                                                        </div>
                                                    </div>
                                                </div>
                                                <button onClick={() => removeRoom(i)} style={{ padding: '8px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.7 }} title="Delete Unit"><FaTrash /></button>
                                            </div>

                                            {/* Expanded Body */}
                                            <div style={{ padding: '24px' }}>
                                                {/* Basic Info Grid */}
                                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                                                    <div style={formGroup}>
                                                        <label style={labelStyle}>Name / Title</label>
                                                        <input value={room.name} onChange={e => handleRoomChange(i, 'name', e.target.value)} style={inputStyle} placeholder={['tent', 'campsite'].includes(formData.propertyType) ? "e.g. Luxury Safari Tent" : "e.g. Ocean View Suite"} />
                                                    </div>
                                                    <div style={formGroup}>
                                                        <label style={labelStyle}>Price ($)</label>
                                                        <input type="number" value={room.price} onChange={e => handleRoomChange(i, 'price', e.target.value)} style={inputStyle} />
                                                    </div>
                                                    <div style={formGroup}>
                                                        <label style={labelStyle}>Capacity</label>
                                                        <input type="number" value={room.capacity} onChange={e => handleRoomChange(i, 'capacity', e.target.value)} style={inputStyle} />
                                                    </div>
                                                </div>

                                                {/* Description & Specs */}
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                                                    <div style={formGroup}>
                                                        <label style={labelStyle}>Description</label>
                                                        <textarea
                                                            rows={3}
                                                            value={room.description || ''}
                                                            onChange={e => handleRoomChange(i, 'description', e.target.value)}
                                                            style={{ ...inputStyle, lineHeight: '1.5' }}
                                                            placeholder="Describe the beds, view, layout..."
                                                        />
                                                    </div>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                        <div style={formGroup}>
                                                            <label style={labelStyle}>Size (sq ft)</label>
                                                            <input type="number" value={room.size || ''} onChange={e => handleRoomChange(i, 'size', e.target.value)} style={inputStyle} />
                                                        </div>
                                                        <div style={formGroup}>
                                                            <label style={labelStyle}>Beds</label>
                                                            <input type="number" value={room.beds || ''} onChange={e => handleRoomChange(i, 'beds', e.target.value)} style={inputStyle} />
                                                        </div>
                                                        <div style={{ ...formGroup, gridColumn: '1 / -1' }}>
                                                            <label style={labelStyle}>Bed Type</label>
                                                            <input value={room.bedType || ''} onChange={e => handleRoomChange(i, 'bedType', e.target.value)} style={inputStyle} placeholder="e.g. King, Queen, Twin" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Unit Specific Photos */}
                                                <div style={{ marginBottom: '24px' }}>
                                                    <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                                        <span>Unit Photos</span>
                                                        <button
                                                            onClick={() => {
                                                                const newImages = [...(room.images || [])];
                                                                newImages.push('');
                                                                handleRoomChange(i, 'images', newImages);
                                                            }}
                                                            style={{ fontSize: '12px', color: '#3b82f6', background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer' }}
                                                        >
                                                            + Add Photo URL
                                                        </button>
                                                    </label>
                                                    <div style={{ display: 'grid', gap: '10px' }}>
                                                        {(room.images && room.images.length > 0 ? room.images : ['']).map((img, imgIdx) => (
                                                            <div key={imgIdx} style={{ display: 'flex', gap: '10px' }}>
                                                                <input
                                                                    value={img}
                                                                    onChange={(e) => {
                                                                        const newImages = [...(room.images || [''])];
                                                                        newImages[imgIdx] = e.target.value;
                                                                        handleRoomChange(i, 'images', newImages);
                                                                    }}
                                                                    style={inputStyle}
                                                                    placeholder="https://..."
                                                                />
                                                                <button
                                                                    onClick={() => {
                                                                        const newImages = room.images.filter((_, idx) => idx !== imgIdx);
                                                                        handleRoomChange(i, 'images', newImages);
                                                                    }}
                                                                    style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                                                >
                                                                    <FaTimes />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Unit Amenities */}
                                                <div>
                                                    <label style={{ ...labelStyle, marginBottom: '12px', display: 'block' }}>Key Amenities included in this unit</label>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                        {['Wifi', 'TV', 'AC', 'Private Bath', 'Mountain View', 'Mini Bar', 'Create Firepit', 'Tent Heater'].map(am => (
                                                            <button
                                                                key={am}
                                                                onClick={() => {
                                                                    const current = room.amenities || [];
                                                                    const updated = current.includes(am)
                                                                        ? current.filter(x => x !== am)
                                                                        : [...current, am];
                                                                    handleRoomChange(i, 'amenities', updated);
                                                                }}
                                                                style={{
                                                                    padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                                                                    border: (room.amenities || []).includes(am) ? '1px solid #0f172a' : '1px solid #e2e8f0',
                                                                    background: (room.amenities || []).includes(am) ? '#0f172a' : 'white',
                                                                    color: (room.amenities || []).includes(am) ? 'white' : '#64748b'
                                                                }}
                                                            >
                                                                {am}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {formData.roomTypes.length === 0 && (
                                        <div style={{ padding: '60px 20px', textAlign: 'center', color: '#94a3b8', border: '2px dashed #e2e8f0', borderRadius: '16px', background: '#f8fafc' }}>
                                            <FaBed size={24} style={{ marginBottom: '12px', opacity: 0.5 }} />
                                            <p style={{ fontWeight: '600', marginBottom: '4px' }}>No units configured</p>
                                            <p style={{ fontSize: '13px' }}>Add a room or tent type to define booking options.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'photos' && (
                            <div style={{ maxWidth: '800px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                    <h3 style={{ color: '#334155', margin: 0 }}>Photo Gallery</h3>
                                    <button onClick={addImage} style={{ padding: '8px 16px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>+ Add Photo URL</button>
                                </div>
                                <div style={{ display: 'grid', gap: '16px' }}>
                                    {formData.images.map((img, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center', background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                            <div style={{ width: '80px', height: '60px', borderRadius: '8px', background: '#cbd5e1', overflow: 'hidden', flexShrink: 0 }}>
                                                {img && <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                            </div>
                                            <input value={img} onChange={e => handleImageChange(i, e.target.value)} style={{ ...inputStyle, flex: 1 }} placeholder="https://..." />
                                            <button onClick={() => removeImage(i)} style={{ padding: '8px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><FaTrash /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div style={{ maxWidth: '800px', display: 'grid', gap: '32px' }}>
                                {/* Categorization */}
                                <div>
                                    <h3 style={{ marginBottom: '16px', color: '#334155' }}>Categorization</h3>
                                    <div style={formGroup}>
                                        <label style={labelStyle}>Listing Category</label>
                                        <select value={formData.category || ''} onChange={e => handleChange('category', e.target.value)} style={inputStyle}>
                                            <option value="">Select Category</option>
                                            {['Beach', 'Windmills', 'Modern', 'Countryside', 'Pools', 'Islands', 'Lake', 'Skiing', 'Castles', 'Caves', 'Camping', 'Arctic', 'Desert', 'Camper vans', 'OMG!'].map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Booking Configuration */}
                                <div>
                                    <h3 style={{ marginBottom: '16px', color: '#334155' }}>Booking Configuration</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                        <div style={formGroup}>
                                            <label style={labelStyle}>Booking Method</label>
                                            <select value={formData.bookingType || 'instant'} onChange={e => handleChange('bookingType', e.target.value)} style={inputStyle}>
                                                <option value="instant">Instant Booking</option>
                                                <option value="inquiry">Inquiry Required</option>
                                            </select>
                                        </div>
                                        <div style={formGroup}>
                                            <label style={labelStyle}>Guest Favorite Status</label>
                                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', height: '100%' }}>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                                    <input type="checkbox" checked={formData.guestFavorite || false} onChange={e => handleChange('guestFavorite', e.target.checked)} style={{ width: '18px', height: '18px' }} />
                                                    <span style={{ fontSize: '15px' }}>Mark as Guest Favorite</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Group & Events */}
                                <div>
                                    <h3 style={{ marginBottom: '16px', color: '#334155' }}>Events & Groups</h3>
                                    <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'grid', gap: '20px' }}>
                                        <div style={{ display: 'flex', gap: '32px' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                                <input type="checkbox" checked={formData.supportsGroups || false} onChange={e => handleChange('supportsGroups', e.target.checked)} style={{ width: '18px', height: '18px' }} />
                                                <span style={{ fontWeight: '600', color: '#334155' }}>Allow Large Groups</span>
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                                <input type="checkbox" checked={formData.supportsEvents || false} onChange={e => handleChange('supportsEvents', e.target.checked)} style={{ width: '18px', height: '18px' }} />
                                                <span style={{ fontWeight: '600', color: '#334155' }}>Allow Events/Parties</span>
                                            </label>
                                        </div>

                                        {(formData.supportsGroups || formData.supportsEvents) && (
                                            <div style={formGroup}>
                                                <label style={labelStyle}>Max Group/Event Size</label>
                                                <input
                                                    type="number"
                                                    value={formData.maxGroupSize || 0}
                                                    onChange={e => handleChange('maxGroupSize', Number(e.target.value))}
                                                    style={inputStyle}
                                                    placeholder="e.g. 50"
                                                />
                                            </div>
                                        )}

                                        {formData.supportsEvents && (
                                            <div style={{ ...formGroup, gridColumn: '1 / -1' }}>
                                                <label style={labelStyle}>Suitable Event Types</label>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                    {['Wedding', 'Corporate', 'Birthday', 'Bachelor Party', 'Photoshoot', 'Retreat', 'Workshop'].map(type => (
                                                        <button
                                                            key={type}
                                                            onClick={() => {
                                                                const current = formData.eventTypes || [];
                                                                const updated = current.includes(type)
                                                                    ? current.filter(t => t !== type)
                                                                    : [...current, type];
                                                                handleChange('eventTypes', updated);
                                                            }}
                                                            style={{
                                                                padding: '8px 16px',
                                                                borderRadius: '20px',
                                                                fontSize: '13px',
                                                                fontWeight: '600',
                                                                cursor: 'pointer',
                                                                border: (formData.eventTypes || []).includes(type) ? '1px solid #c2410c' : '1px solid #e2e8f0',
                                                                background: (formData.eventTypes || []).includes(type) ? '#fff7ed' : 'white',
                                                                color: (formData.eventTypes || []).includes(type) ? '#c2410c' : '#64748b'
                                                            }}
                                                        >
                                                            {type}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const formGroup = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '14px', fontWeight: '600', color: '#475569' };
const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' };

export default AdminListingEditor;
