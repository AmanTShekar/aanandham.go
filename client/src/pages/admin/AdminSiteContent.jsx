
import { useState, useEffect } from 'react';
import { siteContentAPI } from '../../services/api';
import { FaTrash, FaPlus, FaTimes, FaCamera, FaGlobe, FaBookOpen } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const AdminSiteContent = () => {
    const [activeTab, setActiveTab] = useState('sightseeing');
    const [sightseeing, setSightseeing] = useState([]);
    const [travelStories, setTravelStories] = useState([]);
    const [whyChooseUs, setWhyChooseUs] = useState({ title: '', description: '', features: [], images: [] });
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form Stats
    const [sightseeingForm, setSightseeingForm] = useState({ title: '', location: '', image: '', description: '', order: 0 });
    const [storyForm, setStoryForm] = useState({ title: '', category: '', image: '', link: '', date: '', order: 0 });
    const [prevEvents, setPrevEvents] = useState([]);
    const [prevEventForm, setPrevEventForm] = useState({ title: '', date: '', image: '', description: '' });
    const [guides, setGuides] = useState([]);
    const [guideForm, setGuideForm] = useState({ title: '', category: '', image: '', author: '', content: '' });

    // Edit Mode State
    const [editingId, setEditingId] = useState(null);
    const [activeModal, setActiveModal] = useState(null); // 'sightseeing', 'story', 'event', 'guide'

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [sightData, storyData, contentData, prevEventsData, guideData] = await Promise.all([
                siteContentAPI.getSightseeing(),
                siteContentAPI.getTravelStories(),
                siteContentAPI.getContent('whyChooseUs'),
                siteContentAPI.getPreviousEvents(),
                siteContentAPI.getGuides()
            ]);
            setSightseeing(sightData);
            setTravelStories(storyData);
            setPrevEvents(prevEventsData);
            setGuides(guideData);
            if (contentData) {
                // Ensure features array exists even if backend returns partial data
                const features = contentData.features || [];
                // Add empty features if less than 2 (since we use 2 in UI)
                while (features.length < 2) {
                    features.push({ title: '', description: '' });
                }
                setWhyChooseUs({ ...contentData, features });
            } else {
                // Default structure if nothing exists
                setWhyChooseUs({
                    title: '',
                    description: '',
                    features: [{ title: '', description: '' }, { title: '', description: '' }],
                    images: []
                });
            }
        } catch (error) {
            console.error('Error fetching content:', error);
        } finally {
            setLoading(false);
        }
    };

    // --- Actions ---

    const handleDeleteSightseeing = async (id) => {
        if (window.confirm('Delete this place?')) {
            await siteContentAPI.deleteSightseeing(id);
            fetchAll();
        }
    };

    const handleDeleteStory = async (id) => {
        if (window.confirm('Delete this story?')) {
            await siteContentAPI.deleteTravelStory(id);
            fetchAll();
        }
    };

    const handleDeletePrevEvent = async (id) => {
        if (window.confirm('Delete this event?')) {
            await siteContentAPI.deletePreviousEvent(id);
            fetchAll();
        }
    };

    const handleDeleteGuide = async (id) => {
        if (window.confirm('Delete this guide?')) {
            await siteContentAPI.deleteGuide(id);
            fetchAll();
        }
    };

    const handleFeatureChange = (index, field, value) => {
        const features = [...whyChooseUs.features];
        features[index][field] = value;
        setWhyChooseUs({ ...whyChooseUs, features });
    };

    const saveWhyChooseUs = async () => {
        try {
            await siteContentAPI.updateContent('whyChooseUs', whyChooseUs);
            alert('Updated successfully!');
        } catch (error) {
            alert('Failed to update.');
        }
    };

    const submitSightseeing = async (e) => {
        e.preventDefault();
        if (editingId) {
            await siteContentAPI.updateSightseeing(editingId, sightseeingForm);
        } else {
            await siteContentAPI.createSightseeing(sightseeingForm);
        }
        closeModal();
        fetchAll();
    };

    const submitStory = async (e) => {
        e.preventDefault();
        if (editingId) {
            await siteContentAPI.updateTravelStory(editingId, storyForm);
        } else {
            await siteContentAPI.createTravelStory(storyForm);
        }
        closeModal();
        fetchAll();
    };

    const submitPrevEvent = async (e) => {
        e.preventDefault();
        if (editingId) {
            await siteContentAPI.updatePreviousEvent(editingId, prevEventForm);
        } else {
            await siteContentAPI.createPreviousEvent(prevEventForm);
        }
        closeModal();
        fetchAll();
    };

    const submitGuide = async (e) => {
        e.preventDefault();
        if (editingId) {
            await siteContentAPI.updateGuide(editingId, guideForm);
        } else {
            await siteContentAPI.createGuide(guideForm);
        }
        closeModal();
        fetchAll();
    };

    const openEdit = (type, item) => {
        setEditingId(item._id);
        if (type === 'sightseeing') {
            setSightseeingForm(item);
            setActiveModal('sightseeing');
        } else if (type === 'story') {
            setStoryForm(item);
            setActiveModal('story');
        } else if (type === 'event') {
            setPrevEventForm(item);
            setActiveModal('event');
        } else if (type === 'guide') {
            setGuideForm(item);
            setActiveModal('guide');
        }
        setIsModalOpen(true);
    };

    const openAdd = (type) => {
        setEditingId(null);
        setActiveModal(type);
        // Reset forms
        if (type === 'sightseeing') setSightseeingForm({ title: '', location: '', image: '', description: '', order: 0 });
        if (type === 'story') setStoryForm({ title: '', category: '', image: '', link: '', date: '', order: 0 });
        if (type === 'event') setPrevEventForm({ title: '', date: '', image: '', description: '' });
        if (type === 'guide') setGuideForm({ title: '', category: '', image: '', author: '', content: '' });
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setActiveModal(null);
    };

    if (loading) return <div style={{ padding: '40px' }}>Loading...</div>;

    return (
        <div style={{ padding: '40px', background: '#f8fafc', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '30px', color: '#1e293b' }}>Site Content Manager</h1>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', borderBottom: '1px solid #e2e8f0' }}>
                    {['sightseeing', 'stories', 'previous-events', 'guides', 'why-us'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '12px 24px',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: activeTab === tab ? '3px solid #0f172a' : '3px solid transparent',
                                fontWeight: activeTab === tab ? '700' : '500',
                                color: activeTab === tab ? '#0f172a' : '#64748b',
                                cursor: 'pointer',
                                fontSize: '16px',
                                textTransform: 'capitalize'
                            }}
                        >
                            {tab.replace('-', ' ')}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {activeTab === 'sightseeing' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                            <button onClick={() => openAdd('sightseeing')} style={btnStyle}>+ Add Place</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                            {sightseeing.map(item => (
                                <div key={item._id} style={cardStyle}>
                                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                                    <div style={{ padding: '20px' }}>
                                        <h3 style={{ fontWeight: '700', marginBottom: '8px' }}>{item.title}</h3>
                                        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '12px' }}>{item.location}</p>
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                                            <button onClick={() => openEdit('sightseeing', item)} style={{ color: 'blue', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
                                            <button onClick={() => handleDeleteSightseeing(item._id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'stories' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                            <button onClick={() => openAdd('story')} style={btnStyle}>+ Add Story</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                            {travelStories.map(item => (
                                <div key={item._id} style={cardStyle}>
                                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                                    <div style={{ padding: '20px' }}>
                                        <div style={{ fontSize: '12px', color: 'blue', fontWeight: '700', marginBottom: '4px' }}>{item.category}</div>
                                        <h3 style={{ fontWeight: '700', marginBottom: '8px' }}>{item.title}</h3>
                                        <p style={{ color: '#64748b', fontSize: '14px' }}>{item.date}</p>
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                                            <button onClick={() => openEdit('story', item)} style={{ color: 'blue', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
                                            <button onClick={() => handleDeleteStory(item._id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'previous-events' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                            <button onClick={() => openAdd('event')} style={btnStyle}>+ Add Event</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                            {prevEvents.map(item => (
                                <div key={item._id} style={cardStyle}>
                                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                                    <div style={{ padding: '20px' }}>
                                        <h3 style={{ fontWeight: '700', marginBottom: '8px' }}>{item.title}</h3>
                                        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>{item.date}</p>
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                                            <button onClick={() => openEdit('event', item)} style={{ color: 'blue', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
                                            <button onClick={() => handleDeletePrevEvent(item._id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'guides' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                            <button onClick={() => openAdd('guide')} style={btnStyle}>+ Add Guide</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                            {guides.map(item => (
                                <div key={item._id} style={cardStyle}>
                                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                                    <div style={{ padding: '20px' }}>
                                        <div style={{ fontSize: '12px', color: 'green', fontWeight: '700', marginBottom: '4px' }}>{item.category}</div>
                                        <h3 style={{ fontWeight: '700', marginBottom: '8px' }}>{item.title}</h3>
                                        <p style={{ color: '#64748b', fontSize: '14px' }}>By {item.author}</p>
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                                            <button onClick={() => openEdit('guide', item)} style={{ color: 'blue', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
                                            <button onClick={() => handleDeleteGuide(item._id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'why-us' && (
                    <div style={{ background: 'white', padding: '40px', borderRadius: '20px' }}>
                        <h2>Why Choose Us Section</h2>
                        <div style={{ display: 'grid', gap: '30px' }}>
                            <div style={sectionStyle}>
                                <h3 style={{ marginBottom: '15px', color: '#334155' }}>Main Content</h3>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={labelStyle}>Section Title</label>
                                    <input
                                        value={whyChooseUs.title}
                                        onChange={e => setWhyChooseUs({ ...whyChooseUs, title: e.target.value })}
                                        style={inputStyle}
                                        placeholder="e.g. Why Choose Aanandham?"
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Description</label>
                                    <textarea
                                        value={whyChooseUs.description}
                                        onChange={e => setWhyChooseUs({ ...whyChooseUs, description: e.target.value })}
                                        style={{ ...inputStyle, minHeight: '120px', lineHeight: '1.6' }}
                                        placeholder="Enter the main description text here..."
                                    />
                                </div>
                            </div>

                            <div style={sectionStyle}>
                                <h3 style={{ marginBottom: '15px', color: '#334155' }}>Key Features</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                                    {whyChooseUs.features && whyChooseUs.features.map((f, i) => (
                                        <div key={i} style={{ padding: '20px', background: '#f1f5f9', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                            <div style={{ marginBottom: '10px', fontSize: '14px', fontWeight: '700', color: '#64748b' }}>Feature {i + 1}</div>
                                            <input
                                                value={f.title}
                                                onChange={e => handleFeatureChange(i, 'title', e.target.value)}
                                                style={{ ...inputStyle, marginBottom: '12px', fontWeight: '600' }}
                                                placeholder="Feature Title"
                                            />
                                            <textarea
                                                value={f.description}
                                                onChange={e => handleFeatureChange(i, 'description', e.target.value)}
                                                style={{ ...inputStyle, minHeight: '80px' }}
                                                placeholder="Feature Description"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                                <button onClick={saveWhyChooseUs} style={{ ...btnStyle, fontSize: '16px', padding: '14px 30px', background: '#2563eb' }}>
                                    Save Updates
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Consolidated Modal */}
                <AnimatePresence>
                    {isModalOpen && (
                        <Modal onClose={closeModal}>
                            <h2>{editingId ? 'Edit Item' : 'Add New Item'}</h2>

                            {activeModal === 'sightseeing' && (
                                <form onSubmit={submitSightseeing} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
                                    <input placeholder="Title" value={sightseeingForm.title} onChange={e => setSightseeingForm({ ...sightseeingForm, title: e.target.value })} style={inputStyle} required />
                                    <input placeholder="Location (e.g. Munnar, Kerala)" value={sightseeingForm.location} onChange={e => setSightseeingForm({ ...sightseeingForm, location: e.target.value })} style={inputStyle} required />
                                    <input placeholder="Image URL" value={sightseeingForm.image} onChange={e => setSightseeingForm({ ...sightseeingForm, image: e.target.value })} style={inputStyle} required />
                                    <textarea placeholder="Description" rows={4} value={sightseeingForm.description} onChange={e => setSightseeingForm({ ...sightseeingForm, description: e.target.value })} style={inputStyle} required />
                                    <button type="submit" style={btnStyle}>{editingId ? 'Update' : 'Save'} Place</button>
                                </form>
                            )}

                            {activeModal === 'story' && (
                                <form onSubmit={submitStory} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
                                    <input placeholder="Title" value={storyForm.title} onChange={e => setStoryForm({ ...storyForm, title: e.target.value })} style={inputStyle} required />
                                    <input placeholder="Category" value={storyForm.category} onChange={e => setStoryForm({ ...storyForm, category: e.target.value })} style={inputStyle} required />
                                    <input placeholder="Date" value={storyForm.date} onChange={e => setStoryForm({ ...storyForm, date: e.target.value })} style={inputStyle} required />
                                    <input placeholder="Image URL" value={storyForm.image} onChange={e => setStoryForm({ ...storyForm, image: e.target.value })} style={inputStyle} required />
                                    <input placeholder="Link" value={storyForm.link} onChange={e => setStoryForm({ ...storyForm, link: e.target.value })} style={inputStyle} required />
                                    <button type="submit" style={btnStyle}>{editingId ? 'Update' : 'Save'} Story</button>
                                </form>
                            )}

                            {activeModal === 'event' && (
                                <form onSubmit={submitPrevEvent} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
                                    <input placeholder="Title" value={prevEventForm.title} onChange={e => setPrevEventForm({ ...prevEventForm, title: e.target.value })} style={inputStyle} required />
                                    <input placeholder="Date" value={prevEventForm.date} onChange={e => setPrevEventForm({ ...prevEventForm, date: e.target.value })} style={inputStyle} required />
                                    <textarea placeholder="Description" rows={4} value={prevEventForm.description} onChange={e => setPrevEventForm({ ...prevEventForm, description: e.target.value })} style={inputStyle} required />
                                    <input placeholder="Cover Image URL" value={prevEventForm.image} onChange={e => setPrevEventForm({ ...prevEventForm, image: e.target.value })} style={inputStyle} required />
                                    <button type="submit" style={btnStyle}>{editingId ? 'Update' : 'Save'} Event</button>
                                </form>
                            )}

                            {activeModal === 'guide' && (
                                <form onSubmit={submitGuide} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
                                    <input placeholder="Title" value={guideForm.title} onChange={e => setGuideForm({ ...guideForm, title: e.target.value })} style={inputStyle} required />
                                    <input placeholder="Category" value={guideForm.category} onChange={e => setGuideForm({ ...guideForm, category: e.target.value })} style={inputStyle} required />
                                    <input placeholder="Author" value={guideForm.author} onChange={e => setGuideForm({ ...guideForm, author: e.target.value })} style={inputStyle} required />
                                    <input placeholder="Image URL" value={guideForm.image} onChange={e => setGuideForm({ ...guideForm, image: e.target.value })} style={inputStyle} required />
                                    <textarea placeholder="HTML Content (e.g. <h2>Sub</h2><p>text...</p>)" rows={8} value={guideForm.content} onChange={e => setGuideForm({ ...guideForm, content: e.target.value })} style={inputStyle} required />
                                    <button type="submit" style={btnStyle}>{editingId ? 'Update' : 'Save'} Guide</button>
                                </form>
                            )}
                        </Modal>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const Modal = ({ children, onClose }) => (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.5)' }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: 'white', padding: '40px', borderRadius: '20px', width: '600px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, border: 'none', background: 'none', cursor: 'pointer' }}><FaTimes size={20} /></button>
            {children}
        </motion.div>
    </div>
);

const btnStyle = { background: '#0f172a', color: 'white', padding: '12px 24px', borderRadius: '12px', border: 'none', fontWeight: '600', cursor: 'pointer' };
const cardStyle = { background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' };
const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569', fontSize: '14px' };
const sectionStyle = { marginBottom: '20px' };

export default AdminSiteContent;
