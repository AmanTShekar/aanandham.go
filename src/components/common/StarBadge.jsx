'use client';

import React from 'react';

/**
 * StarBadge Component
 * Standard brand pill with yellow star icon (e.g. ★ EXPEDITION HUB)
 */
export default function StarBadge({
  text,
  children,
  dark = false,
  gold = false,
  className = '',
  style = {}
}) {
  const content = text || children;

  let bg = 'rgba(18, 22, 19, 0.05)';
  let color = '#121613';
  let border = '1px solid rgba(18, 22, 19, 0.08)';

  if (dark) {
    bg = 'rgba(255, 255, 255, 0.08)';
    color = '#FFFFFF';
    border = '1px solid rgba(255, 255, 255, 0.12)';
  } else if (gold) {
    bg = 'rgba(229, 169, 59, 0.15)';
    color = '#E5A93B';
    border = '1px solid rgba(229, 169, 59, 0.3)';
  }

  return (
    <div
      className={`star-badge ${className}`}
      style={{
        background: bg,
        color: color,
        border: border,
        ...style
      }}
    >
      <span className="star-icon" style={{ color: '#E5A93B', marginRight: '6px' }}>
        ★
      </span>
      <span>{content}</span>
    </div>
  );
}
