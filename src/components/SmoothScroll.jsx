'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll() {
    useEffect(() => {
        // Initialize Lenis for buttery smooth momentum scrolling
        const lenis = new Lenis({
            duration: 1.25,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Silky exponential curve
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 0.95,
            touchMultiplier: 1.5,
            infinite: false,
        });

        // Expose lenis globally for programmatic smooth scrolling to anchors
        window.__lenis = lenis;

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        const animId = requestAnimationFrame(raf);

        // Smooth scroll for anchor clicks (e.g. #packages, #program, etc.)
        const handleAnchorClick = (e) => {
            const target = e.target.closest('a[href^="#"]');
            if (target) {
                const id = target.getAttribute('href');
                if (id && id.length > 1) {
                    const el = document.querySelector(id);
                    if (el) {
                        e.preventDefault();
                        lenis.scrollTo(el, { offset: -80, duration: 1.4 });
                    }
                }
            }
        };

        document.addEventListener('click', handleAnchorClick);

        return () => {
            cancelAnimationFrame(animId);
            document.removeEventListener('click', handleAnchorClick);
            lenis.destroy();
            window.__lenis = null;
        };
    }, []);

    return null;
}
