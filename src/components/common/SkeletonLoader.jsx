"use client";
import React, { useState } from 'react';
import Image from 'next/image';

/**
 * Base Skeleton Box with pulsing shimmer gradient
 */
export function SkeletonBox({ 
    width = '100%', 
    height = '20px', 
    borderRadius = '8px', 
    style = {}, 
    className = '' 
}) {
    return (
        <div 
            className={`skeleton-bone ${className}`}
            style={{
                width,
                height,
                borderRadius,
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: '#E5E9E1',
                ...style
            }}
            aria-hidden="true"
        >
            <div className="skeleton-shimmer-sweep" />
        </div>
    );
}

/**
 * Camp Card Skeleton Loader (exact match for directory & home featured cards)
 */
export function SkeletonCampCard({ keyIndex = 0 }) {
    return (
        <div 
            className="camp-card-skeleton"
            style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid rgba(18, 22, 19, 0.08)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                animation: `skeletonPulse 1.8s ease-in-out infinite alternate ${keyIndex * 0.15}s`
            }}
            aria-label="Loading campsite details..."
        >
            {/* Image Placeholder */}
            <div style={{ position: 'relative', width: '100%', height: '240px', backgroundColor: '#E2E7DE', overflow: 'hidden' }}>
                <div className="skeleton-shimmer-sweep" />
                <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 2 }}>
                    <SkeletonBox width="110px" height="26px" borderRadius="999px" style={{ background: 'rgba(255,255,255,0.7)' }} />
                </div>
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', zIndex: 2 }}>
                    <SkeletonBox width="80px" height="22px" borderRadius="999px" style={{ background: 'rgba(255,255,255,0.7)' }} />
                </div>
            </div>

            {/* Content Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1, gap: '14px' }}>
                {/* Location & Altitude */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <SkeletonBox width="120px" height="14px" borderRadius="4px" />
                    <SkeletonBox width="70px" height="14px" borderRadius="4px" />
                </div>

                {/* Title */}
                <SkeletonBox width="85%" height="22px" borderRadius="6px" style={{ marginTop: '2px' }} />
                <SkeletonBox width="60%" height="16px" borderRadius="4px" />

                {/* Highlights tags */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '4px 0' }}>
                    <SkeletonBox width="68px" height="22px" borderRadius="6px" />
                    <SkeletonBox width="84px" height="22px" borderRadius="6px" />
                    <SkeletonBox width="74px" height="22px" borderRadius="6px" />
                </div>

                {/* Divider */}
                <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', margin: 'auto 0 4px' }} />

                {/* Pricing & Button Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                    <div>
                        <SkeletonBox width="50px" height="12px" borderRadius="3px" style={{ marginBottom: '4px' }} />
                        <SkeletonBox width="90px" height="24px" borderRadius="6px" />
                    </div>
                    <SkeletonBox width="110px" height="38px" borderRadius="999px" />
                </div>
            </div>
        </div>
    );
}

/**
 * Grid of Camp Card Skeletons
 */
export function SkeletonCampGrid({ count = 6 }) {
    return (
        <div 
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '24px',
                width: '100%'
            }}
        >
            {Array.from({ length: count }).map((_, idx) => (
                <SkeletonCampCard key={idx} keyIndex={idx} />
            ))}
        </div>
    );
}

/**
 * Detail Page Hero Skeleton
 */
export function SkeletonPropertyDetail() {
    return (
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '100px clamp(20px, 4vw, 48px) 60px', width: '100%' }}>
            {/* Top Breadcrumb & Header Skeleton */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <SkeletonBox width="160px" height="16px" borderRadius="4px" />
                <div style={{ display: 'flex', gap: '12px' }}>
                    <SkeletonBox width="36px" height="36px" borderRadius="999px" />
                    <SkeletonBox width="36px" height="36px" borderRadius="999px" />
                </div>
            </div>

            {/* Title & Stats */}
            <SkeletonBox width="65%" height="40px" borderRadius="8px" style={{ marginBottom: '12px' }} />
            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                <SkeletonBox width="140px" height="20px" borderRadius="4px" />
                <SkeletonBox width="100px" height="20px" borderRadius="4px" />
                <SkeletonBox width="80px" height="20px" borderRadius="4px" />
            </div>

            {/* Photo Gallery Grid Skeleton */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gridTemplateRows: 'repeat(2, 220px)',
                gap: '16px',
                borderRadius: '24px',
                overflow: 'hidden',
                marginBottom: '48px'
            }}>
                <div style={{ gridColumn: 'span 7', gridRow: 'span 2' }}>
                    <SkeletonBox width="100%" height="100%" borderRadius="16px" />
                </div>
                <div style={{ gridColumn: 'span 5', gridRow: 'span 1' }}>
                    <SkeletonBox width="100%" height="100%" borderRadius="16px" />
                </div>
                <div style={{ gridColumn: 'span 5', gridRow: 'span 1' }}>
                    <SkeletonBox width="100%" height="100%" borderRadius="16px" />
                </div>
            </div>

            {/* 2-Column Content Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                    <SkeletonBox width="100%" height="120px" borderRadius="16px" />
                    <SkeletonBox width="100%" height="220px" borderRadius="16px" />
                    <SkeletonBox width="100%" height="300px" borderRadius="16px" />
                </div>
                <div>
                    <SkeletonBox width="100%" height="420px" borderRadius="24px" />
                </div>
            </div>
        </div>
    );
}

/**
 * Smart Asset Image with smooth skeleton shimmer backdrop & graceful onload fade
 */
export function AssetImage({
    src,
    alt = 'Campsite photo',
    fill = false,
    width,
    height,
    style = {},
    className = '',
    priority = false,
    sizes,
    objectFit = 'cover',
    fallbackSrc = '/images/services/munnar-emerald-hills.jpg',
    ...props
}) {
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const targetSrc = hasError ? fallbackSrc : (src || fallbackSrc);

    return (
        <div 
            className={`asset-image-container ${className}`}
            style={{
                position: fill ? 'absolute' : 'relative',
                inset: fill ? 0 : 'auto',
                width: fill ? '100%' : (width ? `${width}px` : '100%'),
                height: fill ? '100%' : (height ? `${height}px` : '100%'),
                overflow: 'hidden',
                backgroundColor: '#E5E9E1'
            }}
        >
            {/* Shimmer skeleton until asset is completely loaded */}
            {!isImageLoaded && (
                <div 
                    className="skeleton-bone"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#E2E7DE',
                        zIndex: 1,
                        pointerEvents: 'none'
                    }}
                >
                    <div className="skeleton-shimmer-sweep" />
                </div>
            )}

            {/* Next.js or standard image */}
            <Image
                src={targetSrc}
                alt={alt}
                fill={fill}
                width={!fill ? width : undefined}
                height={!fill ? height : undefined}
                priority={priority}
                sizes={sizes || (fill ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' : undefined)}
                onLoad={() => setIsImageLoaded(true)}
                onError={() => {
                    if (!hasError) setHasError(true);
                    setIsImageLoaded(true);
                }}
                style={{
                    objectFit,
                    opacity: isImageLoaded ? 1 : 0,
                    transition: 'opacity 0.35s ease-in-out, transform 0.45s ease',
                    ...style
                }}
                {...props}
            />
        </div>
    );
}
