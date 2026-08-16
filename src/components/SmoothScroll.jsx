'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

export default function SmoothScroll() {
    const pathname = usePathname();

    // Reset scroll on page change without jump
    useEffect(() => {
        if (window.__lenis) {
            window.__lenis.scrollTo(0, { immediate: true });
        } else {
            window.scrollTo(0, 0);
        }
    }, [pathname]);

    useEffect(() => {
        // Respect accessibility prefers-reduced-motion
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        // Completely bypass Lenis on mobile/touch screens so mobile Chrome & Safari use 100% pure native GPU compositor scrolling
        const isTouchScreen = typeof window !== 'undefined' && (
            window.matchMedia('(pointer: coarse)').matches || 
            'ontouchstart' in window || 
            navigator.maxTouchPoints > 0
        );

        if (isTouchScreen) {
            return;
        }

        // Initialize Lenis for buttery smooth desktop mouse wheel momentum scrolling
        const lenis = new Lenis({
            duration: 1.15,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential dampening curve
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 0,
            syncTouch: false,
            infinite: false,
        });

        // Expose lenis globally for programmatic smooth scrolling to anchors & modal control
        window.__lenis = lenis;

        let rafId;
        function raf(time) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);

        // Smooth scroll for anchor clicks (e.g. #packages, #program, etc.)
        const handleAnchorClick = (e) => {
            const target = e.target.closest('a[href^="#"]');
            if (target) {
                const id = target.getAttribute('href');
                if (id && id.length > 1) {
                    const el = document.querySelector(id);
                    if (el) {
                        e.preventDefault();
                        lenis.scrollTo(el, { offset: -80, duration: 1.2 });
                    }
                }
            }
        };

        document.addEventListener('click', handleAnchorClick);

        return () => {
            cancelAnimationFrame(rafId);
            document.removeEventListener('click', handleAnchorClick);
            lenis.destroy();
            window.__lenis = null;
        };
    }, []);

    return null;
}
