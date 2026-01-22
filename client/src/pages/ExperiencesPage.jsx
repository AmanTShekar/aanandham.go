import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { experiencesAPI } from '../services/api';
import { FaStar, FaHeart } from 'react-icons/fa';
import { motion, useScroll, useTransform } from 'framer-motion';
import CategoryBar from '../components/CategoryBar';
import FilterModal from '../components/FilterModal';
import { experienceCategories } from '../data/categories';
import SEO from '../components/SEO';

const ExperiencesPage = () => {
    const navigate = useNavigate();
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filters, setFilters] = useState({});

    // Parallax
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 200]);

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                setLoading(true);
                const data = await experiencesAPI.getAllExperiences(selectedCategory === 'All' ? null : selectedCategory, filters);
                setExperiences(data);
            } catch (error) {
                console.error('Failed to fetch experiences:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExperiences();
    }, [selectedCategory, filters]);

    const handleFilterApply = (newFilters) => {
        setFilters(newFilters);
    };

    if (loading) {
        return <div style={{ padding: '120px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading experiences...</div>;
    }

    return (
        <div style={{ padding: '0', maxWidth: '100%', margin: '0', backgroundColor: 'var(--bg-off-white)', minHeight: '100vh', paddingBottom: '80px' }}>
            <SEO
                title="Munnar, Vagamon & Wayanad Experiences - Camping & Trekking | Aanandham.go"
                description="Book unique experiences in Kerala. From campfire nights in Suryanelli and Kolukkumalai sunrises to meadow treks in Vagamon and forest stays in Wayanad."
                keywords="Munnar Things to Do, Vagamon Activities, Wayanad Trekking, Camping Events Kerala, Tea Tasting, Kolukkumalai Sunrise"
            />

            {/* Hero Section with Parallax */}
            <div style={{
                position: 'relative',
                height: '60vh',
                minHeight: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                marginBottom: '40px'
            }}>
                <motion.div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'url("/images/previous_events/trekking_group.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.4)',
                    y: y,
                    scale: 1.1,
                    zIndex: 0
                }} />

                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 20px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span style={{ color: 'var(--primary)', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '13px' }}>
                            Premium Kerala Activities
                        </span>
                        <h1 style={{ fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: '900', color: 'white', marginTop: '16px', lineHeight: '1.1' }}>
                            Curated Experiences
                        </h1>
                        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', maxWidth: '700px', margin: '24px auto 0', lineHeight: '1.6' }}>
                            Don't just visit, belong. Join our community events, guided treks, and cultural workshops across Munnar, Vagamon, and Wayanad.
                        </p>
                    </motion.div>
                </div>
            </div>

            <CategoryBar
                categories={experienceCategories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onFilterClick={() => setIsFilterModalOpen(true)}
            />

            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApply={handleFilterApply}
                initialFilters={filters}
            />

            <div style={{ padding: '40px 5%', maxWidth: '1600px', margin: '0 auto' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '40px'
                }}>
                    {experiences.map((exp, i) => (
                        <motion.div
                            key={exp._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            style={{ cursor: 'pointer', position: 'relative', background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                            onClick={() => navigate(`/experiences/${exp._id}`)}
                            whileHover={{ y: -8, boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}
                        >
                            {/* Image Container */}
                            <div style={{
                                position: 'relative',
                                height: '260px',
                                overflow: 'hidden'
                            }}>
                                <img
                                    src={exp.image || 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                                    alt={exp.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                                    onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '16px',
                                    right: '16px',
                                    background: 'rgba(255,255,255,0.9)',
                                    borderRadius: '50%',
                                    padding: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <FaHeart size={16} color="#e5e7eb" />
                                </div>
                                <div style={{
                                    position: 'absolute',
                                    top: '16px',
                                    left: '16px',
                                    background: 'rgba(0,0,0,0.6)',
                                    backdropFilter: 'blur(4px)',
                                    color: 'white',
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                }}>
                                    {exp.category}
                                </div>
                            </div>

                            {/* Details */}
                            <div style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--text-main)', marginBottom: '8px' }}>
                                    <FaStar size={14} color="#FFD700" />
                                    <span style={{ fontWeight: '700' }}>{exp.rating}</span>
                                    <span style={{ color: 'var(--text-secondary)' }}>({exp.reviews || 'New'})</span>
                                    <span style={{ color: 'var(--text-secondary)' }}>· {exp.location}</span>
                                </div>

                                <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px', lineHeight: '1.3' }}>
                                    {exp.title}
                                </h3>

                                <div style={{ fontSize: '16px', fontWeight: '400', color: 'var(--text-main)', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                    <span style={{ fontWeight: '700', fontSize: '18px' }}>₹{exp.price}</span>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>/ person</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExperiencesPage;
