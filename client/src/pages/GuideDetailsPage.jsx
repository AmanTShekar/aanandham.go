import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { guidesAPI } from '../services/api';

const GuideDetailsPage = () => {
    const { id } = useParams();
    const [guide, setGuide] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGuide = async () => {
            try {
                const data = await guidesAPI.getGuideById(id);
                setGuide(data);
            } catch (error) {
                console.error('Failed to fetch guide:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchGuide();
    }, [id]);

    if (loading) return <div className="container" style={{ paddingTop: '40px' }}>Loading...</div>;
    if (!guide) return <div className="container" style={{ paddingTop: '40px' }}>Guide not found</div>;

    return (
        <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px', maxWidth: '800px' }}>
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                <span style={{
                    color: 'var(--primary)',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontSize: '14px'
                }}>
                    {guide.category}
                </span>
                <h1 style={{ fontSize: '40px', fontWeight: '800', marginTop: '16px', marginBottom: '24px' }}>{guide.title}</h1>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
                    <span>By {guide.author}</span>
                    <span>•</span>
                    <span>{new Date(guide.date).toLocaleDateString()}</span>
                </div>
            </div>

            <div style={{ height: '400px', width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '40px' }}>
                <img src={guide.image} alt={guide.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div
                className="guide-content"
                dangerouslySetInnerHTML={{ __html: guide.content }}
                style={{ fontSize: '18px', lineHeight: '1.8', color: 'var(--text-main)' }}
            />
        </div>
    );
};

export default GuideDetailsPage;
