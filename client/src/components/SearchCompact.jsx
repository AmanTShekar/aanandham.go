import { FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';

const SearchCompact = ({ onClick }) => {
    return (
        <motion.div
            layoutId="search-bar"
            onClick={onClick}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-full)',
                padding: '8px 8px 8px 24px',
                boxShadow: 'var(--shadow-sm)',
                gap: '0',
                cursor: 'pointer',
                backgroundColor: 'white',
                height: '48px',
                boxSizing: 'border-box'
            }}
            whileHover={{
                boxShadow: 'var(--shadow-md)',
                y: -1
            }}
        >
            <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-main)', paddingRight: '16px' }}>Anywhere</span>
            <span style={{ borderLeft: '1px solid var(--border)', height: '24px', display: 'block' }}></span>
            <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-main)', padding: '0 16px' }}>Any week</span>
            <span style={{ borderLeft: '1px solid var(--border)', height: '24px', display: 'block' }}></span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px', paddingLeft: '16px', paddingRight: '16px' }}>Add guests</span>
            <div style={{
                background: 'var(--primary-gradient)',
                color: 'white',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '-8px',
                boxShadow: '0 2px 8px rgba(79, 70, 229, 0.4)'
            }}>
                <FaSearch size={12} />
            </div>
        </motion.div>
    );
};

export default SearchCompact;
