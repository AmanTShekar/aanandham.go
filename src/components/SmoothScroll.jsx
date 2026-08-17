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

    // ── 1. GLOBAL HIGH-PERFORMANCE NATIVE SCROLL REVEAL OBSERVER ──
    useEffect(() => {
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    observer.unobserve(entry.target);
                }
            });
        };

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -40px 0px',
            threshold: 0.08
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        const attachObservers = () => {
            const targets = document.querySelectorAll(
                '.reveal-on-scroll, .reveal-fade-up, .reveal-fade-left, .reveal-fade-right, .reveal-zoom'
            );
            targets.forEach(el => {
                const rect = el.getBoundingClientRect();
                // If element is already on screen on initial load, reveal immediately
                if (rect.top < window.innerHeight - 30) {
                    el.classList.add('is-revealed');
                } else {
                    observer.observe(el);
                }
            });
        };

        // Attach right after render and layout paint
        const timer1 = setTimeout(attachObservers, 60);
        const timer2 = setTimeout(attachObservers, 300);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            observer.disconnect();
        };
    }, [pathname]);

    // ── 2. BUTTERY SMOOTH 60/120 FPS DESKTOP LENIS CONTROLLER ──
    useEffect(() => {
        // On touch-capable devices, use 100% native GPU compositor scrolling for 0 lag and 0 stuck gestures
        const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || ('ontouchstart' in window) || window.innerWidth < 1024;
        if (isTouchDevice) {
            return;
        }

        // Initialize Lenis for buttery smooth desktop mousewheel scrolling
        const lenis = new Lenis({
            duration: 0.95,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 1.0,
            syncTouch: false,
            infinite: false,
        });

        // Expose lenis globally for programmatic smooth scrolling to anchors & modal control
        window.__lenis = lenis;

        // Dispatch window scroll event on Lenis scroll so IntersectionObserver and Framer Motion trigger reliably
        lenis.on('scroll', () => {
            window.dispatchEvent(new Event('scroll'));
        });

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
                        lenis.scrollTo(el, { offset: -80, duration: 1.0 });
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
