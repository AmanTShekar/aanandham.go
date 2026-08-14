"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function Template({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ 
                duration: 0.38, 
                ease: [0.22, 1, 0.36, 1] 
            }}
            style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
        >
            {/* Organic Kerala Forest Canopy Top Accent Bar */}
            <motion.div
                initial={{ scaleX: 0, opacity: 0.9 }}
                animate={{ scaleX: 1, opacity: 0 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, #D5ED55 0%, #E5A93B 50%, #25D366 100%)',
                    transformOrigin: '0%',
                    zIndex: 999999,
                    pointerEvents: 'none'
                }}
            />
            {children}
        </motion.div>
    );
}
