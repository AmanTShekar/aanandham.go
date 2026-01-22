import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { siteContentAPI } from '../services/api';
import { galleryImages as staticImages } from '../data/siteContent';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FullGalleryPage = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const data = await siteContentAPI.getSiteImages();
                if (data && data.length > 0) {
                    setImages(data);
                } else {
                    // Fallback formatting
                    setImages(staticImages.map((url, i) => ({ _id: `static-${i}`, url, title: "Munnar Experience" })));
                }
            } catch (error) {
                console.error('Failed to fetch gallery:', error);
                setImages(staticImages.map((url, i) => ({ _id: `static-${i}`, url, title: "Munnar Experience" })));
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, []);

    if (loading) return <div style={{ background: '#000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>Loading...</div>;

    return (
        <div style={{ background: '#000', minHeight: '100vh', padding: '120px 20px 60px 20px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ marginBottom: '40px' }}>
                    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', marginBottom: '20px', fontWeight: '600' }}>
                        <FaArrowLeft /> Back to Home
                    </Link>
                    <h1 style={{ fontSize: '48px', fontWeight: '800', color: 'white' }}>Munnar Camping Gallery</h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px', maxWidth: '800px', lineHeight: '1.6' }}>
                        Explore the breathtaking views of Suryanelli, Kolukkumalai sunrise, and our diverse tent stays.
                        Aanandham.go curates the best <strong>camping & glamping sites in Munnar</strong>, from rugged treks to premium comfort.
                    </p>

                    {/* SEO Hidden/Visible Content */}
                    <div style={{ marginTop: '20px', color: '#444', fontSize: '14px' }}>
                        <p>Browse collection of: Tent stays in Suryanelli, Tea estate camping, Munnar glamping photos, and Campfire nights at Aanandham.go.</p>
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '24px'
                }}>
                    {images.map((img, i) => (
                        <motion.div
                            key={img._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            style={{ borderRadius: '20px', overflow: 'hidden', height: '300px' }}
                        >
                            <img
                                src={img.url}
                                alt={img.title || "Munnar Camping Tent Stay"}
                                loading="lazy"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FullGalleryPage;
