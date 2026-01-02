import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaImage } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const AdminGallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newImage, setNewImage] = useState({ url: '', title: '', order: 0 });
    const [uploading, setUploading] = useState(false); // Added for upload state

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            // Using direct axios for now, ideally move to api.js
            const res = await axios.get('https://aanandham-go.onrender.com/api/admin/site-images');
            setImages(res.data);
        } catch (error) {
            console.error('Failed to fetch gallery:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddImage = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('https://aanandham-go.onrender.com/api/admin/site-images', newImage, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewImage({ url: '', title: '', order: 0 });
            fetchImages();
            alert('Image added to Gallery!');
        } catch (error) {
            console.error('Failed to add image:', error);
            alert('Failed to add image');
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('https://aanandham-go.onrender.com/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            setNewImage({ ...newImage, url: res.data.url });
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Remove this image from the gallery?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://aanandham-go.onrender.com/api/admin/site-images/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchImages();
        } catch (error) {
            console.error('Failed to delete image:', error);
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Gallery...</div>;

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px', color: '#222' }}>Gallery Management</h1>
            <p style={{ color: '#666', marginBottom: '40px' }}>Manage the images displayed in the "Visual Journey" Bento Grid.</p>



            {/* Gallery Grid Preview */}
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Current Bento Grid Items</h3>

            <style>{`
                .bento-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    grid-auto-rows: 250px;
                    gap: 16px;
                }
                @media (min-width: 768px) {
                    .bento-grid {
                        grid-template-columns: repeat(2, 1fr);
                        grid-auto-rows: 250px;
                    }
                    .bento-item-0 { grid-column: span 2; grid-row: span 2; } /* Hero */
                    .bento-item-1 { grid-row: span 2; } /* Tall */
                }
                @media (min-width: 1024px) {
                    .bento-grid {
                        grid-template-columns: repeat(3, 1fr);
                        grid-auto-rows: 280px;
                    }
                    .bento-item-0 { grid-column: span 2; grid-row: span 2; }
                    .bento-item-1 { grid-column: span 1; grid-row: span 2; }
                    .bento-item-2 { grid-column: span 1; grid-row: span 1; }
                    .bento-item-3 { grid-column: span 1; grid-row: span 1; }
                    .bento-item-4 { grid-column: span 1; grid-row: span 1; }
                    .bento-item-5, .bento-item-6, .bento-item-7, .bento-item-8, .bento-item-9, .bento-item-10, .bento-item-11, .bento-item-12, .bento-item-13 { grid-column: span 1; grid-row: span 1; }
                }
            `}</style>

            <div className="bento-grid">
                {[...Array(14).keys()].map((order) => {
                    const img = images.find(i => i.order === order);
                    return (
                        <div
                            key={order}
                            className={`bento-item-${order}`}
                            style={{
                                borderRadius: '20px', overflow: 'hidden', position: 'relative',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                background: '#1a1a1a', minHeight: '100%',
                                border: img ? 'none' : '2px dashed #ccc',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {img ? (
                                <>
                                    <img src={img.url} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div style={{
                                        position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                                        padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                                        opacity: 0, transition: 'opacity 0.2s'
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.opacity = 1}
                                        onMouseLeave={e => e.currentTarget.style.opacity = 0}
                                    >
                                        <h4 style={{ color: 'white', fontWeight: '700', margin: 0 }}>{img.title || 'Untitled'}</h4>
                                        <div style={{ marginTop: '12px', display: 'flex', gap: '10px' }}>
                                            <button
                                                onClick={() => handleDelete(img._id)}
                                                style={{
                                                    background: '#FF385C', color: 'white', border: 'none', borderRadius: '8px',
                                                    padding: '8px', cursor: 'pointer', flex: 1, fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                                }}
                                            >
                                                <FaTrash size={12} /> Remove
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <label style={{
                                    cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: '#888', width: '100%', height: '100%', justifyContent: 'center'
                                }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#222'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#888'}
                                >
                                    <div style={{
                                        width: '60px', height: '60px', borderRadius: '50%', background: '#eee',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'background 0.2s'
                                    }}>
                                        {uploading ? (
                                            <div style={{ width: '20px', height: '20px', border: '2px solid #ccc', borderTopColor: '#222', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                        ) : (
                                            <FaPlus size={24} />
                                        )}
                                    </div>
                                    <span style={{ fontSize: '14px', fontWeight: '600' }}>Add to Position #{order + 1}</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        disabled={uploading}
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setUploading(true);
                                                const formData = new FormData();
                                                formData.append('image', file);
                                                const token = localStorage.getItem('token');
                                                axios.post('https://aanandham-go.onrender.com/api/upload', formData, {
                                                    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
                                                }).then(res => {
                                                    return axios.post('https://aanandham-go.onrender.com/api/admin/site-images', {
                                                        url: res.data.url,
                                                        title: `Gallery Image ${order + 1}`,
                                                        order: order
                                                    }, { headers: { Authorization: `Bearer ${token}` } });
                                                }).then(() => {
                                                    setUploading(false);
                                                    fetchImages();
                                                }).catch(err => {
                                                    console.error(err);
                                                    setUploading(false);
                                                    alert("Failed to upload");
                                                });
                                            }
                                        }}
                                    />
                                    {/* Spinner animation style */}
                                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                                </label>
                            )}
                        </div>
                    );
                })}
            </div>
        </div >
    );
};

export default AdminGallery;
