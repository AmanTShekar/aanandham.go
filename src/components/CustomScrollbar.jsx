"use client";
import React, { useEffect, useState } from 'react';

export default function CustomScrollbar() {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const updateScrollProgress = () => {
            const currentScroll = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight > 0) {
                const progress = (currentScroll / scrollHeight) * 100;
                setScrollProgress(progress);
            }
        };

        window.addEventListener('scroll', updateScrollProgress, { passive: true });
        updateScrollProgress();

        return () => window.removeEventListener('scroll', updateScrollProgress);
    }, []);

    return (
        <>
            {/* Top Fixed Reading Progress Indicator */}
            <div 
                aria-hidden="true"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: `${scrollProgress}%`,
                    height: '3.5px',
                    background: 'linear-gradient(90deg, #E5A93B 0%, #D5ED55 100%)',
                    boxShadow: '0 0 12px rgba(229, 169, 59, 0.8), 0 0 20px rgba(213, 237, 85, 0.5)',
                    zIndex: 99999,
                    pointerEvents: 'none',
                    transition: 'width 0.1s linear'
                }} 
            />

            {/* Custom Page-Based Floating Scrollbar Track on Desktop */}
            <div
                aria-hidden="true"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    position: 'fixed',
                    top: '8px',
                    right: '4px',
                    bottom: '8px',
                    width: isHovered ? '8px' : '5px',
                    background: isHovered ? 'rgba(11, 21, 14, 0.5)' : 'rgba(11, 21, 14, 0.15)',
                    borderRadius: '999px',
                    zIndex: 99998,
                    transition: 'width 0.2s ease, background 0.2s ease',
                    pointerEvents: 'auto',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)'
                }}
            >
                {/* Floating Thumb */}
                <div
                    style={{
                        position: 'absolute',
                        top: `${scrollProgress * 0.88}%`,
                        left: 0,
                        width: '100%',
                        height: 'clamp(45px, 8vh, 90px)',
                        background: isHovered 
                            ? 'linear-gradient(180deg, #F5BD55 0%, #E8FA88 100%)' 
                            : 'linear-gradient(180deg, #E5A93B 0%, #D5ED55 100%)',
                        borderRadius: '999px',
                        boxShadow: isHovered 
                            ? '0 0 14px rgba(229, 169, 59, 0.9), 0 2px 8px rgba(0,0,0,0.4)' 
                            : '0 0 8px rgba(229, 169, 59, 0.6)',
                        transition: 'background 0.2s ease, box-shadow 0.2s ease'
                    }}
                />
            </div>
        </>
    );
}
