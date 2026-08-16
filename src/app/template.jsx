"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function Template({ children }) {
  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100%', backgroundColor: '#070E08' }}>
      
      {/* ── 120 FPS GPU COMPOSITOR TOP-DOWN SOLID REVEAL SHADE ── */}
      <motion.div
        initial={{ y: '0%' }}
        animate={{ y: '100%' }}
        transition={{
          duration: 0.62,
          ease: [0.77, 0, 0.175, 1], // Quintic organic glide curve
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#070E08',
          zIndex: 999999,
          pointerEvents: 'none',
          willChange: 'transform',
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
          borderBottom: '2.5px solid #E5A93B',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.95), 0 0 30px rgba(229, 169, 59, 0.5)'
        }}
      />

      {/* ── CLEAN SETTLED DESTINATION PAGE ── */}
      <div style={{ width: '100%', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}
