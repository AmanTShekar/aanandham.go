import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCalendarAlt } from 'react-icons/fa';

const RecapModal = ({ event, onClose }) => {
    if (!event) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,0.9)',
                    backdropFilter: 'blur(10px)',
                    zIndex: 2000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '20px'
                }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    style={{
                        width: '100%', maxWidth: '900px',
                        background: '#121212',
                        borderRadius: '30px',
                        overflow: 'hidden',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        maxHeight: '90vh',
                        border: '1px solid #333'
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    <button onClick={onClose} style={{
                        position: 'absolute', top: 20, right: 20, zIndex: 10,
                        background: 'rgba(255,255,255,0.1)', border: 'none',
                        color: 'white', width: 40, height: 40, borderRadius: '50%',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <FaTimes />
                    </button>

                    <div style={{ padding: '40px', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'white' }}>{event.title}</h2>
                            <div style={{ color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaCalendarAlt /> {event.date}
                            </div>
                        </div>

                        <p style={{ color: '#a1a1aa', fontSize: '18px', lineHeight: '1.6', marginBottom: '40px' }}>
                            {event.description}
                        </p>

                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '20px' }}>Gallery</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                            {event.recapImages && event.recapImages.map((img, i) => (
                                <img key={i} src={img} alt={`Recap ${i}`} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: '12px' }} />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default RecapModal;
