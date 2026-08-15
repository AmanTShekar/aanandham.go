'use client';

import React from 'react';

/**
 * Pill Component
 * Category / status pill with color variants
 */
export function Pill({
  children,
  variant = 'default',
  size = 'md',
  style = {},
  className = ''
}) {
  const variantStyles = {
    default: {
      background: '#F1F3EC',
      color: '#121613',
      border: '1px solid rgba(18, 22, 19, 0.08)'
    },
    gold: {
      background: 'rgba(229, 169, 59, 0.15)',
      color: '#E5A93B',
      border: '1px solid rgba(229, 169, 59, 0.3)'
    },
    lime: {
      background: 'rgba(213, 237, 85, 0.25)',
      color: '#121613',
      border: '1px solid rgba(213, 237, 85, 0.4)'
    },
    emerald: {
      background: 'rgba(22, 101, 52, 0.12)',
      color: '#166534',
      border: '1px solid rgba(22, 101, 52, 0.25)'
    },
    dark: {
      background: '#121613',
      color: '#FFFFFF',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    white: {
      background: '#FFFFFF',
      color: '#121613',
      border: '1px solid rgba(18, 22, 19, 0.1)'
    }
  };

  const sizeStyles = {
    sm: { padding: '3px 9px', fontSize: '11px', fontWeight: '700' },
    md: { padding: '5px 14px', fontSize: '12px', fontWeight: '750' },
    lg: { padding: '8px 18px', fontSize: '13px', fontWeight: '800' }
  };

  const currentVariant = variantStyles[variant] || variantStyles.default;
  const currentSize = sizeStyles[size] || sizeStyles.md;

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        borderRadius: '999px',
        lineHeight: 1.2,
        letterSpacing: '0.2px',
        ...currentVariant,
        ...currentSize,
        ...style
      }}
    >
      {children}
    </span>
  );
}

/**
 * Eyebrow Component
 * Uppercase tracking headline kicker
 */
export function Eyebrow({
  children,
  color = '#E5A93B',
  style = {}
}) {
  return (
    <span
      style={{
        display: 'block',
        fontSize: '11px',
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: '1.2px',
        color: color,
        marginBottom: '8px',
        ...style
      }}
    >
      {children}
    </span>
  );
}

export default Pill;
