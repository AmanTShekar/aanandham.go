import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const FilterModal = ({ isOpen, onClose, onApply, initialFilters = {} }) => {
    const [priceRange, setPriceRange] = useState(initialFilters.priceRange || { min: 0, max: 1000 });
    const [type, setType] = useState(initialFilters.type || 'Any');
    const [amenities, setAmenities] = useState(initialFilters.amenities || []);

    const handleApply = () => {
        onApply({ priceRange, type, amenities });
        onClose();
    };

    const toggleAmenity = (amenity) => {
        setAmenities(prev =>
            prev.includes(amenity)
                ? prev.filter(a => a !== amenity)
                : [...prev, amenity]
        );
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: 2000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }} onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    onClick={e => e.stopPropagation()}
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        width: '100%',
                        maxWidth: '600px',
                        maxHeight: '85vh',
                        overflowY: 'auto',
                        padding: '24px',
                        position: 'relative'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Filters</h2>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            <FaTimes size={20} />
                        </button>
                    </div>

                    {/* Price Range */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Price range</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '8px 12px', flex: 1 }}>
                                <label style={{ fontSize: '12px', color: '#717171' }}>Min price</label>
                                <input
                                    type="number"
                                    value={priceRange.min}
                                    onChange={e => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                                    style={{ width: '100%', border: 'none', outline: 'none', fontSize: '16px' }}
                                />
                            </div>
                            <span>-</span>
                            <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '8px 12px', flex: 1 }}>
                                <label style={{ fontSize: '12px', color: '#717171' }}>Max price</label>
                                <input
                                    type="number"
                                    value={priceRange.max}
                                    onChange={e => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                                    style={{ width: '100%', border: 'none', outline: 'none', fontSize: '16px' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Type of Place */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Type of place</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {['Any', 'Entire place', 'Private room', 'Shared room'].map(t => (
                                <div
                                    key={t}
                                    onClick={() => setType(t)}
                                    style={{
                                        padding: '12px',
                                        border: type === t ? '2px solid black' : '1px solid #ddd',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        fontWeight: type === t ? '600' : '400'
                                    }}
                                >
                                    {t}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Amenities */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Amenities</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            {['Wifi', 'Kitchen', 'Washer', 'Dryer', 'Air conditioning', 'Heating', 'Pool', 'Hot tub'].map(amenity => (
                                <label key={amenity} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={amenities.includes(amenity)}
                                        onChange={() => toggleAmenity(amenity)}
                                        style={{ width: '18px', height: '18px', accentColor: 'black' }}
                                    />
                                    <span>{amenity}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #ddd' }}>
                        <button
                            onClick={() => {
                                setPriceRange({ min: 0, max: 1000 });
                                setType('Any');
                                setAmenities([]);
                            }}
                            style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontWeight: '600' }}
                        >
                            Clear all
                        </button>
                        <button
                            onClick={handleApply}
                            style={{
                                backgroundColor: 'black',
                                color: 'white',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                border: 'none',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Show results
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default FilterModal;
