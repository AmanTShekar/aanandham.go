"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { waLink } from '../lib/whatsapp';

export default function AanandhamBot() {
    const [isHovered, setIsHovered] = useState(false);

    const handleOpenWhatsApp = () => {
        const msg = 'Hi Aanandham Wilderness Desk! 🌲 I have a question about booking an upcoming campsite expedition.';
        window.open(waLink(msg), '_blank', 'noopener,noreferrer');
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: 'calc(22px + env(safe-area-inset-bottom, 0px))',
            right: 'calc(22px + env(safe-area-inset-right, 0px))',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        }}>
            {/* Desktop Floating Hover Label Pill */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, x: 10, scale: 0.92 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 10, scale: 0.92 }}
                        transition={{ duration: 0.18 }}
                        style={{
                            background: '#121613',
                            color: '#FFFFFF',
                            padding: '8px 16px',
                            borderRadius: '999px',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
                            fontSize: '12.5px',
                            fontWeight: '800',
                            letterSpacing: '0.3px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            whiteSpace: 'nowrap',
                            pointerEvents: 'none',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)'
                        }}
                    >
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#25D366', boxShadow: '0 0 8px #25D366' }} />
                        <span>Chat on WhatsApp</span>
                        <span style={{ color: '#D5ED55', fontSize: '11px' }}>→</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* The Canonical Green WhatsApp Button */}
            <motion.button
                whileHover={{ scale: 1.1, boxShadow: '0 14px 40px rgba(37, 211, 102, 0.6)' }}
                whileTap={{ scale: 0.92 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleOpenWhatsApp}
                aria-label="Chat on WhatsApp with Aanandham Basecamp Marshals"
                style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: '#25D366',
                    color: '#FFFFFF',
                    border: 'none',
                    boxShadow: '0 10px 30px rgba(37, 211, 102, 0.45)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    outline: 'none',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease'
                }}
            >
                <svg
                    viewBox="0 0 24 24"
                    width="30"
                    height="30"
                    fill="#FFFFFF"
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
                >
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.8 11.66c-.26-.13-1.54-.76-1.78-.85-.24-.09-.41-.13-.59.13-.17.26-.68.85-.83 1.02-.15.18-.31.2-.57.07-.26-.13-1.1-.4-2.1-1.29-.78-.69-1.3-1.55-1.45-1.81-.15-.26-.02-.4.11-.53.12-.11.26-.31.39-.46.13-.15.17-.26.26-.44.09-.17.04-.33-.02-.46-.07-.13-.59-1.42-.81-1.95-.21-.51-.43-.44-.59-.45-.15-.01-.33-.01-.5-.01-.18 0-.46.07-.7.33-.24.26-.92.9-.92 2.2 0 1.3 1.95 2.56 1.08 2.73.13.18 1.87 2.85 4.52 4 1.62.7 2.28.77 3.09.65.5-.08 1.54-.63 1.76-1.24.22-.61.22-1.13.15-1.24-.06-.11-.23-.18-.49-.31z"/>
                </svg>
            </motion.button>
        </div>
    );
}
