'use client';

import React from 'react';
import { waLink } from '../../lib/whatsapp';

/**
 * Standardized WhatsApp Action Button
 */
export default function WaButton({
  text = '',
  phone,
  label = 'Chat on WhatsApp ↗',
  variant = 'lime', // 'lime' | 'dark' | 'gold' | 'outline'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon = true,
  className = '',
  style = {},
  onClick
}) {
  const url = waLink(text, phone);

  const variantStyles = {
    lime: {
      background: '#D5ED55',
      color: '#121613',
      border: 'none',
      boxShadow: '0 8px 24px rgba(213, 237, 85, 0.35)'
    },
    dark: {
      background: '#121613',
      color: '#FFFFFF',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
    },
    gold: {
      background: '#E5A93B',
      color: '#121613',
      border: 'none',
      boxShadow: '0 8px 24px rgba(229, 169, 59, 0.35)'
    },
    outline: {
      background: 'transparent',
      color: '#FFFFFF',
      border: '1.5px solid rgba(255, 255, 255, 0.25)',
      boxShadow: 'none'
    }
  };

  const sizeStyles = {
    sm: { padding: '8px 16px', fontSize: '13px', borderRadius: '999px' },
    md: { padding: '12px 24px', fontSize: '14.5px', borderRadius: '999px' },
    lg: { padding: '16px 36px', fontSize: '15.5px', borderRadius: '999px' }
  };

  const currentVariant = variantStyles[variant] || variantStyles.lime;
  const currentSize = sizeStyles[size] || sizeStyles.md;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={`wa-action-btn ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontWeight: '800',
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        ...currentVariant,
        ...currentSize,
        ...style
      }}
    >
      {icon && <i className="fa-brands fa-whatsapp" style={{ fontSize: '1.15em' }} />}
      <span>{label}</span>
    </a>
  );
}
