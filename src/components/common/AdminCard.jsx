'use client';

import React from 'react';

/**
 * Standardized Admin Dashboard Stat & Control Card
 */
export default function AdminCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendPositive = true,
  action,
  children,
  className = '',
  style = {}
}) {
  return (
    <div
      className={`admin-stat-card ${className}`}
      style={{
        background: '#101E13',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
        ...style
      }}
    >
      {/* Top Row: Icon + Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        {icon && (
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: 'rgba(213, 237, 85, 0.12)',
              border: '1px solid rgba(213, 237, 85, 0.25)',
              color: '#D5ED55',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}
          >
            {typeof icon === 'string' ? <i className={icon} /> : icon}
          </div>
        )}
        {action && <div>{action}</div>}
      </div>

      {/* Center: Title & Value */}
      <div>
        {title && (
          <span
            style={{
              fontSize: '11.5px',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: '#8E9B92',
              display: 'block',
              marginBottom: '6px'
            }}
          >
            {title}
          </span>
        )}
        {value !== undefined && (
          <div
            style={{
              fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
              fontSize: 'clamp(24px, 3vw, 32px)',
              fontWeight: '800',
              color: '#FFFFFF',
              lineHeight: 1.15
            }}
          >
            {value}
          </div>
        )}
      </div>

      {/* Bottom Row: Subtitle / Trend */}
      {(subtitle || trend) && (
        <div
          style={{
            marginTop: '14px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px'
          }}
        >
          {subtitle && <span style={{ color: '#A2B6A6' }}>{subtitle}</span>}
          {trend && (
            <span
              style={{
                color: trendPositive ? '#10B981' : '#EF4444',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {trendPositive ? '▲' : '▼'} {trend}
            </span>
          )}
        </div>
      )}

      {children}
    </div>
  );
}
