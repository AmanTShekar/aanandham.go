import { useState, useRef, useEffect } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const GuestCounter = ({ label, subLabel, count, onIncrement, onDecrement, canDecrement }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
        <div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a', fontFamily: 'var(--font-sans)' }}>{label}</div>
            <div style={{ fontSize: '13px', color: '#717171' }}>{subLabel}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
                onClick={onDecrement}
                disabled={!canDecrement}
                style={{
                    width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #ddd',
                    background: 'transparent', cursor: canDecrement ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: canDecrement ? 1 : 0.3, transition: 'all 0.2s',
                    color: '#717171'
                }}
                onMouseEnter={(e) => canDecrement && (e.currentTarget.style.borderColor = 'black')}
                onMouseLeave={(e) => canDecrement && (e.currentTarget.style.borderColor = '#ddd')}
            >
                <FaMinus size={10} />
            </button>
            <span style={{ fontSize: '16px', fontWeight: '600', minWidth: '24px', textAlign: 'center', fontFamily: 'var(--font-sans)' }}>{count}</span>
            <button
                onClick={onIncrement}
                style={{
                    width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #ddd',
                    background: 'transparent', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s', color: '#717171'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.color = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#ddd';
                    e.currentTarget.style.color = '#717171';
                }}
            >
                <FaPlus size={10} />
            </button>
        </div>
    </div>
);

const GuestSelector = ({ guests, setGuests }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [counts, setCounts] = useState({ adults: 1, children: 0, infants: 0 });
    const containerRef = useRef(null);

    useEffect(() => {
        const total = parseInt(guests) || 1;
        setCounts(prev => ({ ...prev, adults: total > 0 ? total : 1 }));
    }, []);

    useEffect(() => {
        const total = counts.adults + counts.children;
        setGuests(total);
    }, [counts, setGuests]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const updateCount = (type, delta) => {
        setCounts(prev => ({
            ...prev,
            [type]: Math.max(0, prev[type] + delta)
        }));
    };

    return (
        <div style={{ position: 'relative', width: '100%' }} ref={containerRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    cursor: 'pointer',
                    width: '100%',
                    background: 'transparent',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}
            >
                <div style={{
                    fontSize: '14px',
                    fontWeight: guests ? '600' : '400',
                    color: guests ? '#222' : '#717171',
                    fontFamily: 'var(--font-sans)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {guests > 0 ? (
                        <>
                            {guests} guest{guests > 1 ? 's' : ''}
                            {counts.infants > 0 && <span style={{ color: '#717171', fontWeight: '400' }}>, {counts.infants} infant{counts.infants > 1 ? 's' : ''}</span>}
                        </>
                    ) : 'Add guests'}
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            position: 'absolute',
                            top: '55px',
                            right: 0,
                            width: '380px',
                            background: '#fff',
                            borderRadius: '24px',
                            boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
                            padding: '24px',
                            zIndex: 1000,
                            border: '1px solid rgba(0,0,0,0.05)'
                        }}
                    >
                        <GuestCounter
                            label="Adults"
                            subLabel="Ages 13 or above"
                            count={counts.adults}
                            onIncrement={() => updateCount('adults', 1)}
                            onDecrement={() => updateCount('adults', -1)}
                            canDecrement={counts.adults > 1}
                        />
                        <GuestCounter
                            label="Children"
                            subLabel="Ages 2–12"
                            count={counts.children}
                            onIncrement={() => updateCount('children', 1)}
                            onDecrement={() => updateCount('children', -1)}
                            canDecrement={counts.children > 0}
                        />
                        <GuestCounter
                            label="Infants"
                            subLabel="Under 2"
                            count={counts.infants}
                            onIncrement={() => updateCount('infants', 1)}
                            onDecrement={() => updateCount('infants', -1)}
                            canDecrement={counts.infants > 0}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GuestSelector;
