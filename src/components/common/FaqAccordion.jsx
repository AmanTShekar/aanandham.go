'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Reusable FAQ Accordion Component
 */
export default function FaqAccordion({
  items = [],
  dark = false,
  allowMultiple = false,
  initialActiveIdx = 0,
  className = '',
  style = {}
}) {
  const [activeIndices, setActiveIndices] = useState(
    initialActiveIdx !== null && initialActiveIdx !== -1 ? [initialActiveIdx] : []
  );

  const toggle = (idx) => {
    if (allowMultiple) {
      setActiveIndices((prev) =>
        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
      );
    } else {
      setActiveIndices((prev) => (prev.includes(idx) ? [] : [idx]));
    }
  };

  return (
    <div className={`faq-accordion-list ${className}`} style={{ width: '100%', ...style }}>
      {items.map((item, idx) => {
        const isOpen = activeIndices.includes(idx);
        const num = item.num || (idx < 9 ? `0${idx + 1}` : `${idx + 1}`);

        return (
          <div
            key={item.id || idx}
            style={{
              borderBottom: dark
                ? '1px solid rgba(255, 255, 255, 0.08)'
                : '1px solid rgba(18, 22, 19, 0.08)',
              padding: '22px 0'
            }}
          >
            <button
              onClick={() => toggle(idx)}
              aria-expanded={isOpen}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '16px'
              }}
            >
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <span
                  style={{
                    fontSize: '12.5px',
                    fontWeight: '800',
                    color: dark ? '#E5A93B' : '#8E9B92',
                    marginTop: '3px',
                    fontFamily: 'monospace'
                  }}
                >
                  {num}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
                    fontSize: 'clamp(16.5px, 2.2vw, 19.5px)',
                    fontWeight: '700',
                    color: dark ? '#FFFFFF' : '#121613',
                    lineHeight: 1.35
                  }}
                >
                  {item.question}
                </span>
              </div>

              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: dark
                    ? isOpen
                      ? '#E5A93B'
                      : 'rgba(255, 255, 255, 0.08)'
                    : isOpen
                    ? '#121613'
                    : '#F1F3EC',
                  color: dark
                    ? isOpen
                      ? '#121613'
                      : '#FFFFFF'
                    : isOpen
                    ? '#E5A93B'
                    : '#121613',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.25s ease'
                }}
              >
                <i
                  className="fa-solid fa-chevron-down"
                  style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    fontSize: '11px'
                  }}
                />
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div
                    style={{
                      paddingTop: '14px',
                      paddingLeft: '34px',
                      paddingRight: '12px'
                    }}
                  >
                    <p
                      style={{
                        fontSize: '14.5px',
                        color: dark ? '#A2B6A6' : '#59655D',
                        lineHeight: 1.65,
                        margin: 0
                      }}
                    >
                      {item.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
