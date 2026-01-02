import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const LanguageModal = ({ isOpen, onClose, currentLang, currentCurrency, onSelectLang, onSelectCurrency, languages, currencies }) => {
    const [activeTab, setActiveTab] = useState('language'); // 'language' or 'currency'

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    padding: '40px'
                }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        backgroundColor: 'var(--bg-white)',
                        borderRadius: 'var(--radius-lg)',
                        width: '100%',
                        maxWidth: '1032px',
                        height: '80vh',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-xl)'
                    }}
                >
                    {/* Header */}
                    <div style={{ padding: '24px', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                        <button
                            onClick={onClose}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', marginRight: '16px', color: 'var(--text-main)' }}
                        >
                            <FaTimes size={16} />
                        </button>

                        <div style={{ display: 'flex', gap: '32px' }}>
                            <button
                                onClick={() => setActiveTab('language')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    padding: '10px 0',
                                    cursor: 'pointer',
                                    color: activeTab === 'language' ? 'var(--text-main)' : 'var(--text-secondary)',
                                    borderBottom: activeTab === 'language' ? '2px solid var(--text-main)' : '2px solid transparent',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                Language and region
                            </button>
                            <button
                                onClick={() => setActiveTab('currency')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    padding: '10px 0',
                                    cursor: 'pointer',
                                    color: activeTab === 'currency' ? 'var(--text-main)' : 'var(--text-secondary)',
                                    borderBottom: activeTab === 'currency' ? '2px solid var(--text-main)' : '2px solid transparent',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                Currency
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
                        {activeTab === 'language' ? (
                            <div>
                                <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '24px', color: 'var(--text-main)' }}>Choose a language and region</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                onSelectLang(lang);
                                                onClose();
                                            }}
                                            style={{
                                                textAlign: 'left',
                                                background: 'none',
                                                padding: '12px',
                                                borderRadius: 'var(--radius-md)',
                                                cursor: 'pointer',
                                                backgroundColor: currentLang.code === lang.code ? 'var(--bg-off-white)' : 'transparent',
                                                border: currentLang.code === lang.code ? '1px solid var(--text-main)' : '1px solid transparent',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-off-white)'}
                                            onMouseLeave={(e) => {
                                                if (currentLang.code !== lang.code) e.currentTarget.style.backgroundColor = 'transparent';
                                            }}
                                        >
                                            <div style={{ fontSize: '14px', color: 'var(--text-main)', marginBottom: '4px', fontWeight: currentLang.code === lang.code ? '600' : '400' }}>{lang.name}</div>
                                            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{lang.region}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '24px', color: 'var(--text-main)' }}>Choose a currency</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                                    {currencies.map((curr) => (
                                        <button
                                            key={curr.code}
                                            onClick={() => {
                                                onSelectCurrency(curr);
                                                onClose();
                                            }}
                                            style={{
                                                textAlign: 'left',
                                                background: 'none',
                                                padding: '12px',
                                                borderRadius: 'var(--radius-md)',
                                                cursor: 'pointer',
                                                backgroundColor: currentCurrency.code === curr.code ? 'var(--bg-off-white)' : 'transparent',
                                                border: currentCurrency.code === curr.code ? '1px solid var(--text-main)' : '1px solid transparent',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-off-white)'}
                                            onMouseLeave={(e) => {
                                                if (currentCurrency.code !== curr.code) e.currentTarget.style.backgroundColor = 'transparent';
                                            }}
                                        >
                                            <div style={{ fontSize: '14px', color: 'var(--text-main)', marginBottom: '4px', fontWeight: currentCurrency.code === curr.code ? '600' : '400' }}>{curr.name}</div>
                                            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{curr.code} - {curr.symbol}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LanguageModal;
