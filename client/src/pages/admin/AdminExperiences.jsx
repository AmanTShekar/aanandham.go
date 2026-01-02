
import { useState, useEffect } from 'react';
import { experiencesAPI, adminAPI } from '../../services/api';
import { FaSearch, FaTrash, FaClock, FaStar, FaPlus, FaTimes, FaCamera, FaUserTie, FaCheckCircle, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const AdminExperiences = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Detailed State for New/Edit Experience
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        price: '',
        duration: '',
        image: '',
        description: '',
        rating: 5.0,
        itinerary: [{ time: '', activity: '' }], // Dynamic List
        coordinator: { name: '', role: '', image: '', phone: '' },
        inclusions: [''] // Dynamic List
    });

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            const data = await experiencesAPI.getAllExperiences();
            setExperiences(data);
        } catch (error) {
            console.error('Failed to fetch experiences:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this experience?')) {
            await adminAPI.deleteExperience(id);
            fetchExperiences();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Filter empty items
            const cleanedData = {
                ...formData,
                price: Number(formData.price),
                duration: Number(formData.duration),
                itinerary: formData.itinerary.filter(i => i.time && i.activity),
                inclusions: formData.inclusions.filter(i => i.trim()),
            };

            await experiencesAPI.createExperience(cleanedData);
            fetchExperiences();
            setIsModalOpen(false);
            setFormData({
                title: '', location: '', price: '', duration: '', image: '', description: '', rating: 5.0,
                itinerary: [{ time: '', activity: '' }],
                coordinator: { name: '', role: '', image: '', phone: '' },
                inclusions: ['']
            });
            alert('Experience created successfully!');
        } catch (error) {
            alert('Failed to save experience');
        }
    };

    // Helper to manage dynamic lists
    const updateItinerary = (index, field, value) => {
        const newItinerary = [...formData.itinerary];
        newItinerary[index][field] = value;
        setFormData({ ...formData, itinerary: newItinerary });
    };
    const addItineraryItem = () => setFormData({ ...formData, itinerary: [...formData.itinerary, { time: '', activity: '' }] });
    const removeItineraryItem = (index) => setFormData({ ...formData, itinerary: formData.itinerary.filter((_, i) => i !== index) });

    const updateInclusion = (index, value) => {
        const newInclusions = [...formData.inclusions];
        newInclusions[index] = value;
        setFormData({ ...formData, inclusions: newInclusions });
    };
    const addInclusion = () => setFormData({ ...formData, inclusions: [...formData.inclusions, ''] });
    const removeInclusion = (index) => setFormData({ ...formData, inclusions: formData.inclusions.filter((_, i) => i !== index) });


    const filteredExperiences = experiences.filter(exp =>
        exp.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading Dashboard...</div>;

    return (
        <div style={{ padding: '40px', background: '#f8fafc', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', letterSpacing: '-0.5px' }}>Camps & Events</h1>
                        <p style={{ color: '#64748b', fontSize: '16px', marginTop: '4px' }}>Manage your camps, workshops, and experiences.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        style={{
                            background: '#0f172a', color: 'white', padding: '14px 28px', borderRadius: '12px',
                            fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', border: 'none',
                            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)', cursor: 'pointer', transition: 'transform 0.2s'
                        }}
                    >
                        <FaPlus size={14} /> Add Camp/Event
                    </button>
                </div>

                {/* Modern Card Grid for Listing */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                    {filteredExperiences.map((exp) => (
                        <motion.div
                            key={exp._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                background: 'white', borderRadius: '20px', overflow: 'hidden',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9',
                                position: 'relative', transition: 'box-shadow 0.2s'
                            }}
                            whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.08)' }}
                        >
                            <div style={{ height: '200px', position: 'relative' }}>
                                <img src={exp.image} alt={exp.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.9)', padding: '6px 12px', borderRadius: '20px', fontWeight: '700', fontSize: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                    ${exp.price}
                                </div>
                            </div>
                            <div style={{ padding: '24px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '8px', lineHeight: '1.4' }}>{exp.title}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>
                                    <FaMapMarkerAlt size={12} /> {exp.location}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                                    <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FaClock /> {exp.duration} hrs</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FaStar color="#fbbf24" /> {exp.rating}</span>
                                    </div>
                                    <button onClick={() => handleDelete(exp._id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Edit Modal - Side Drawer Style */}
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
                                    width: '100%', maxWidth: '600px', background: 'white', position: 'relative', height: '100%',
                                    boxShadow: '-4px 0 24px rgba(0,0,0,0.1)', overflowY: 'auto'
                                }}
                            >
                                <div style={{ padding: '32px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>Create Camp/Event</h2>
                                        <button onClick={() => setIsModalOpen(false)} style={{ background: '#f1f5f9', border: 'none', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <FaTimes color="#64748b" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                        {/* Basic Info */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            <h3 style={{ fontSize: '14px', textTransform: 'uppercase', fontWeight: '700', color: '#94a3b8', letterSpacing: '1px' }}>Basic Information</h3>
                                            <input placeholder="Title (e.g. Summer Camp)" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required style={inputStyle} />
                                            <select
                                                value={formData.category || 'Camp'}
                                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                style={inputStyle}
                                            >
                                                <option value="Camp">Camp</option>
                                                <option value="Workshop">Workshop</option>
                                                <option value="Tour">Tour</option>
                                                <option value="Event">Event</option>
                                            </select>
                                            <input placeholder="Location" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required style={inputStyle} />
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                                <input type="number" placeholder="Price" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required style={inputStyle} />
                                                <input type="number" placeholder="Duration (hrs)" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} required style={inputStyle} />
                                            </div>
                                            <input placeholder="Cover Image URL" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} required style={inputStyle} />
                                            <textarea placeholder="Description" rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required style={inputStyle} />
                                        </div>

                                        {/* Coordinator Info */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#f8fafc', padding: '24px', borderRadius: '16px' }}>
                                            <h3 style={{ fontSize: '14px', textTransform: 'uppercase', fontWeight: '700', color: '#94a3b8', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}><FaUserTie /> Coordinator Details</h3>
                                            <input placeholder="Coordinator Name" value={formData.coordinator.name} onChange={e => setFormData({ ...formData, coordinator: { ...formData.coordinator, name: e.target.value } })} style={inputStyle} />
                                            <input placeholder="Role (e.g. Guide)" value={formData.coordinator.role} onChange={e => setFormData({ ...formData, coordinator: { ...formData.coordinator, role: e.target.value } })} style={inputStyle} />
                                            <input placeholder="Phone / Contact" value={formData.coordinator.phone} onChange={e => setFormData({ ...formData, coordinator: { ...formData.coordinator, phone: e.target.value } })} style={inputStyle} />
                                            <input placeholder="Photo URL" value={formData.coordinator.image} onChange={e => setFormData({ ...formData, coordinator: { ...formData.coordinator, image: e.target.value } })} style={inputStyle} />
                                        </div>

                                        {/* Itinerary */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <h3 style={{ fontSize: '14px', textTransform: 'uppercase', fontWeight: '700', color: '#94a3b8', letterSpacing: '1px' }}>Itinerary</h3>
                                                <button type="button" onClick={addItineraryItem} style={{ color: 'var(--primary)', background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer' }}>+ Add Item</button>
                                            </div>
                                            {formData.itinerary.map((item, index) => (
                                                <div key={index} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 30px', gap: '12px', alignItems: 'center' }}>
                                                    <input placeholder="Time" value={item.time} onChange={e => updateItinerary(index, 'time', e.target.value)} style={inputStyle} />
                                                    <input placeholder="Activity" value={item.activity} onChange={e => updateItinerary(index, 'activity', e.target.value)} style={inputStyle} />
                                                    <button type="button" onClick={() => removeItineraryItem(index)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><FaTimes /></button>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Inclusions */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <h3 style={{ fontSize: '14px', textTransform: 'uppercase', fontWeight: '700', color: '#94a3b8', letterSpacing: '1px' }}>Inclusions</h3>
                                                <button type="button" onClick={addInclusion} style={{ color: 'var(--primary)', background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer' }}>+ Add Item</button>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                {formData.inclusions.map((inc, index) => (
                                                    <div key={index} style={{ display: 'flex', gap: '8px' }}>
                                                        <input placeholder="Item" value={inc} onChange={e => updateInclusion(index, e.target.value)} style={inputStyle} />
                                                        <button type="button" onClick={() => removeInclusion(index)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><FaTimes /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <button type="submit" style={{ marginTop: '24px', background: '#0f172a', color: 'white', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: '700', border: 'none', cursor: 'pointer' }}>
                                            Create Experience
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

const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '10px',
    border: '1px solid #e2e8f0', fontSize: '14px', background: 'white',
    outline: 'none', transition: 'border-color 0.2s', color: '#1e293b'
};

export default AdminExperiences;
