'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { modalBackdrop, modalDialog } from '../../lib/animations';

/**
 * Standardized Modal Component
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  dark = true,
  className = '',
  style = {}
}) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizeWidths = {
    sm: '460px',
    md: '600px',
    lg: '800px',
    xl: '1000px'
  };

  const maxWidth = sizeWidths[size] || sizeWidths.md;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            boxSizing: 'border-box'
          }}
        >
          {/* Backdrop */}
          <motion.div
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(5, 10, 7, 0.82)',
              backdropFilter: 'blur(8px)',
              zIndex: 1
            }}
          />

          {/* Dialog Container */}
          <motion.div
            variants={modalDialog}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`modal-dialog-shell ${className}`}
            style={{
              position: 'relative',
              zIndex: 2,
              width: '100%',
              maxWidth: maxWidth,
              maxHeight: '90vh',
              overflowY: 'auto',
              background: dark ? '#101E13' : '#FFFFFF',
              color: dark ? '#FFFFFF' : '#121613',
              border: dark
                ? '1px solid rgba(213, 237, 85, 0.25)'
                : '1px solid rgba(18, 22, 19, 0.1)',
              borderRadius: '28px',
              padding: 'clamp(20px, 4vw, 36px)',
              boxShadow: '0 25px 80px rgba(0, 0, 0, 0.6), 0 0 40px rgba(213, 237, 85, 0.1)',
              boxSizing: 'border-box',
              ...style
            }}
          >
            {/* Header with Title and Close Button */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '24px',
                gap: '16px'
              }}
            >
              <div>
                {title && (
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                      fontSize: 'clamp(20px, 3vw, 26px)',
                      fontWeight: '800',
                      color: dark ? '#FFFFFF' : '#121613',
                      letterSpacing: '-0.02em',
                      margin: 0
                    }}
                  >
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p
                    style={{
                      fontSize: '13.5px',
                      color: dark ? '#A2B6A6' : '#59655D',
                      margin: '6px 0 0'
                    }}
                  >
                    {subtitle}
                  </p>
                )}
              </div>

              <button
                onClick={onClose}
                aria-label="Close modal"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: dark ? 'rgba(255, 255, 255, 0.08)' : '#F1F3EC',
                  color: dark ? '#FFFFFF' : '#121613',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.2s ease'
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
