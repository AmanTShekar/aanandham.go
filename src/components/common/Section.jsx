'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { sectionReveal, viewportOnce } from '../../lib/animations';

/**
 * Standard Section Container
 */
export function Section({
  id,
  children,
  bg = 'light', // 'light' | 'white' | 'dark' | 'darker'
  pad = 'lg', // 'xl' | 'lg' | 'md' | 'sm' | 'none'
  maxWidth = '1280px',
  className = '',
  style = {},
  innerStyle = {},
  animate = true
}) {
  const bgStyles = {
    light: '#F8F9F5',
    white: '#FFFFFF',
    dark: '#121613',
    darker: '#0B150E',
    darkCard: '#101E13'
  };

  const padStyles = {
    xl: '120px clamp(20px, 4vw, 48px)',
    lg: '100px clamp(20px, 4vw, 48px)',
    md: '80px clamp(16px, 3.5vw, 40px)',
    sm: '60px clamp(16px, 3vw, 32px)',
    none: '0'
  };

  const isDark = bg === 'dark' || bg === 'darker' || bg === 'darkCard';

  const sectionStyle = {
    position: 'relative',
    background: bgStyles[bg] || bg,
    padding: padStyles[pad] || pad,
    color: isDark ? '#FFFFFF' : '#121613',
    ...style
  };

  const containerStyle = {
    maxWidth: maxWidth,
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
    ...innerStyle
  };

  if (animate) {
    return (
      <motion.section
        id={id}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={sectionReveal}
        className={className}
        style={sectionStyle}
      >
        <div style={containerStyle}>
          {children}
        </div>
      </motion.section>
    );
  }

  return (
    <section id={id} className={className} style={sectionStyle}>
      <div style={containerStyle}>
        {children}
      </div>
    </section>
  );
}

/**
 * Standard Section Header with badge, h2 and description
 */
export function SectionHeader({
  badge,
  title,
  desc,
  center = true,
  dark = false,
  badgeGold = false,
  rightAction = null,
  style = {},
  className = ''
}) {
  return (
    <div
      className={className}
      style={{
        textAlign: center ? 'center' : 'left',
        marginBottom: '48px',
        maxWidth: center ? '780px' : '100%',
        margin: center ? '0 auto 48px' : '0 0 48px',
        ...style
      }}
    >
      {badge && (
        <div
          className="star-badge"
          style={{
            margin: center ? '0 auto 14px' : '0 0 14px',
            background: dark
              ? 'rgba(255, 255, 255, 0.08)'
              : badgeGold
              ? 'rgba(229, 169, 59, 0.14)'
              : 'rgba(18, 22, 19, 0.05)',
            color: dark ? '#FFFFFF' : badgeGold ? '#8C5E05' : '#121613',
            border: dark
              ? '1px solid rgba(255, 255, 255, 0.12)'
              : badgeGold
              ? '1px solid rgba(140, 94, 5, 0.25)'
              : '1px solid rgba(18, 22, 19, 0.08)'
          }}
        >
          <span className="star-icon" style={{ color: dark ? '#E5A93B' : '#8C5E05', marginRight: '6px' }}>
            ★
          </span>
          <span>{badge}</span>
        </div>
      )}

      {title && (
        <h2
          style={{
            fontFamily: 'var(--font-heading), "Bricolage Grotesque", sans-serif',
            fontSize: 'clamp(30px, 4.2vw, 50px)',
            fontWeight: '800',
            color: dark ? '#FFFFFF' : '#121613',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            margin: '0 0 14px'
          }}
        >
          {title}
        </h2>
      )}

      {desc && (
        <p
          style={{
            fontSize: '15.5px',
            color: dark ? '#A2B6A6' : '#59655D',
            lineHeight: 1.65,
            margin: 0,
            maxWidth: '640px',
            marginLeft: center ? 'auto' : 0,
            marginRight: center ? 'auto' : 0
          }}
        >
          {desc}
        </p>
      )}

      {rightAction && (
        <div style={{ marginTop: '20px' }}>
          {rightAction}
        </div>
      )}
    </div>
  );
}

export default Section;
