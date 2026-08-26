"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';
import { waLink } from '../../lib/whatsapp';
import {
    Code2, Globe, Smartphone, Layers, Cpu, Palette, Megaphone,
    Camera, TrendingUp, PenTool, Share2, Search, BarChart3, Users,
    ArrowRight, ArrowUpRight, Check, Plus, Minus, Star, Briefcase,
    Rocket, Target, Eye, Award, Heart, ChevronRight, Sparkles,
    Building2, ShoppingBag, Coffee, Mountain, MessageCircle, Mail,
    Zap, MapPin, Compass, ShieldCheck
} from 'lucide-react';

const CONTAINER = { maxWidth: '1440px', margin: '0 auto', width: '100%' };

// ── REVEAL VARIANTS (matched to home page) ──
const sectionReveal = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 1, 0.5, 1] } }
};

const staggerContainer = {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.03 } }
};

const cardReveal = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] } }
};

// ═══════════════════════════════════════════════════════════════════
// SERVICE WINGS — black/white aesthetic with gold accent
// ═══════════════════════════════════════════════════════════════════

const SERVICE_WINGS = [
    {
        id: 'openzen-tech',
        badge: 'TECH DIVISION · PARTNERSHIP',
        title: 'OpenZen',
        tagline: 'Websites, SaaS Products & Custom Software Engineering',
        description: 'Our technology partnership arm — building production-grade web platforms, SaaS products, and tailored software for hospitality, travel, and consumer brands across India.',
        accent: '#E5A93B',
        accentBg: 'rgba(229, 169, 59, 0.08)',
        accentBorder: 'rgba(229, 169, 59, 0.3)',
        glow: 'rgba(229, 169, 59, 0.15)',
        icon: Cpu,
        services: [
            {
                title: 'Custom Website Development',
                desc: 'Next.js, React, and headless CMS websites optimised for SEO, performance, and conversion.',
                icon: Globe,
                deliverables: ['Design System', 'Frontend', 'CMS', 'Analytics']
            },
            {
                title: 'SaaS Product Engineering',
                desc: 'Multi-tenant SaaS platforms with subscription billing, dashboards, and admin tooling.',
                icon: Layers,
                deliverables: ['Auth', 'Billing', 'Dashboards', 'APIs']
            },
            {
                title: 'Custom Software & Internal Tools',
                desc: 'Bespoke business automation, CRMs, booking engines, and operations dashboards.',
                icon: Code2,
                deliverables: ['Discovery', 'Build', 'Integrate', 'Maintain']
            },
            {
                title: 'Mobile App Development',
                desc: 'Cross-platform iOS & Android apps with React Native or native stacks.',
                icon: Smartphone,
                deliverables: ['UX', 'Native', 'Backend', 'App Store']
            }
        ],
        cta: 'Start a Tech Project'
    },
    {
        id: 'aanandham-marketing',
        badge: 'IN-HOUSE STUDIO · BRAND & MARKETING',
        title: 'Aanandham Studio',
        tagline: 'Brand Setup, Social Media & Growth Marketing',
        description: 'Our in-house creative and growth studio — full-funnel brand building, social media management, content production, and performance marketing for hospitality and lifestyle brands.',
        accent: '#E5A93B',
        accentBg: 'rgba(229, 169, 59, 0.08)',
        accentBorder: 'rgba(229, 169, 59, 0.3)',
        glow: 'rgba(229, 169, 59, 0.15)',
        icon: Sparkles,
        services: [
            {
                title: 'Brand Setup & Identity',
                desc: 'Logo, visual language, tone of voice, brand guidelines, and launch collateral.',
                icon: PenTool,
                deliverables: ['Logo', 'Palette', 'Typography', 'Guidelines']
            },
            {
                title: 'Social Media Management',
                desc: 'Instagram, Facebook, YouTube, and LinkedIn — content calendars, reels, and community growth.',
                icon: Share2,
                deliverables: ['Strategy', 'Content', 'Reels', 'Engagement']
            },
            {
                title: 'Performance Marketing',
                desc: 'Meta Ads, Google Ads, and SEO — full-funnel campaigns with weekly optimisation.',
                icon: TrendingUp,
                deliverables: ['Ads', 'SEO', 'Funnels', 'Reporting']
            },
            {
                title: 'Content & Photography',
                desc: 'On-site shoots, drone cinematography, influencer collaborations, and UGC production.',
                icon: Camera,
                deliverables: ['Photo', 'Video', 'Drone', 'Influencer']
            }
        ],
        cta: 'Grow Your Brand'
    }
];

// ═══════════════════════════════════════════════════════════════════
// PORTFOLIO
// ═══════════════════════════════════════════════════════════════════

const PORTFOLIO = [
    {
        id: 'p1',
        client: 'Aanandham.go',
        category: 'Web Platform',
        type: 'tech',
        title: 'Aanandham.go — Wilderness Camping Platform',
        desc: 'Next.js 16, multi-property booking engine, Razorpay payments, Prisma + PostgreSQL, Supabase media, admin PMS, check-in scanner with QR.',
        tags: ['Next.js', 'Prisma', 'Razorpay', 'Supabase', 'PMS'],
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80',
        year: '2026',
        live: 'https://aanandham.in',
        highlights: ['5 Sanctuary Properties', 'Multi-Role Admin', 'Live QR Check-in']
    },
    {
        id: 'p2',
        client: 'Crimson Trail Resorts',
        category: 'SaaS Platform',
        type: 'tech',
        title: 'Crimson Trail — Resort Booking SaaS',
        desc: 'Multi-tenant SaaS for boutique resorts — channel manager, dynamic pricing, owner dashboards, and OTA sync.',
        tags: ['SaaS', 'Multi-tenant', 'Channel Manager', 'PostgreSQL'],
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80',
        year: '2025',
        highlights: ['12 Active Resorts', '40+ OTA Channels', '₹2.4Cr GMV/mo']
    },
    {
        id: 'p3',
        client: 'Aanandham Social',
        category: 'Brand & Social',
        type: 'marketing',
        title: 'Aanandham — Instagram Growth to 180K',
        desc: '0 to 180K followers in 14 months. Reels-first content, UGC collaborations, drone shoots, and community-driven storytelling.',
        tags: ['Instagram', 'Reels', 'UGC', 'Community'],
        image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=900&q=80',
        year: '2025-2026',
        highlights: ['180K Followers', '14-Month Growth', '8.2% Engagement']
    },
    {
        id: 'p4',
        client: 'Verdant Valley Co.',
        category: 'E-commerce',
        type: 'tech',
        title: 'Verdant Valley — Organic Brand Store',
        desc: 'Shopify Hydrogen storefront with custom subscription boxes, Razorpay subscriptions, and a wholesale portal for B2B partners.',
        tags: ['Shopify', 'Subscriptions', 'B2B Portal', 'Razorpay'],
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80',
        year: '2025',
        highlights: ['Custom Sub Engine', 'B2B Wholesale', '94 Lighthouse']
    },
    {
        id: 'p5',
        client: 'Kerala Spice Co.',
        category: 'Performance Marketing',
        type: 'marketing',
        title: 'Kerala Spice Co. — 6.8x ROAS',
        desc: 'Meta + Google Ads funnel for premium spice brand. 6.8x return on ad spend, 240% YoY revenue growth, D2C launch in 90 days.',
        tags: ['Meta Ads', 'Google Ads', 'D2C', 'Funnel'],
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=80',
        year: '2025',
        highlights: ['6.8x ROAS', '240% YoY Growth', '₹1.8Cr Revenue']
    },
    {
        id: 'p6',
        client: 'Pebble & Pine',
        category: 'Brand Identity',
        type: 'marketing',
        title: 'Pebble & Pine — Café Brand Launch',
        desc: 'Full brand identity, packaging, website, and 6-month social media launch. From concept to first store in 4 months.',
        tags: ['Branding', 'Packaging', 'Website', 'Launch'],
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80',
        year: '2024',
        highlights: ['Full Identity', '2 Stores Live', '4-Month Launch']
    }
];

// ═══════════════════════════════════════════════════════════════════
// STATS / TRUST SIGNALS — Real numbers
// ═══════════════════════════════════════════════════════════════════

const TRUST_STATS = [
    { icon: Briefcase, value: '9+', label: 'Projects Shipped' },
    { icon: Users, value: '14+', label: 'Happy Clients' },
    { icon: Award, value: '1+', label: 'Year Combined' },
    { icon: TrendingUp, value: '94', label: 'Avg. Lighthouse' }
];

const PROCESS_STEPS = [
    { num: '01', title: 'Discovery Call', desc: 'We learn your goals, audience, and constraints in a 30-minute call.' },
    { num: '02', title: 'Proposal & Scope', desc: 'Detailed scope, timeline, and transparent pricing within 48 hours.' },
    { num: '03', title: 'Design & Build', desc: 'Weekly check-ins, async updates, and live staging environment.' },
    { num: '04', title: 'Launch & Iterate', desc: 'Smooth launch, post-launch support, and growth optimisation.' }
];

export default function ServicesPage() {
    const [activeFilter, setActiveFilter] = useState('all');

    const filteredPortfolio = activeFilter === 'all'
        ? PORTFOLIO
        : PORTFOLIO.filter(p => p.type === activeFilter);

    return (
        <>
            <SiteHeader />
            <main style={{ background: '#0B150E', minHeight: '100vh', overflow: 'hidden' }}>
                {/* ═══════════════════════════════════════════════════════
                    1. HERO — Black + gold gradient, Aanandham logo
                ═══════════════════════════════════════════════════════ */}
                <motion.section
                    initial="hidden"
                    animate="visible"
                    variants={sectionReveal}
                    style={{
                        position: 'relative',
                        padding: 'clamp(80px, 10vw, 120px) clamp(20px, 4vw, 48px) clamp(40px, 6vw, 80px)',
                        background: 'linear-gradient(180deg, #0B150E 0%, #121613 100%)',
                        color: '#FFFFFF',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{
                        position: 'absolute', top: '-200px', left: '50%', transform: 'translateX(-50%)',
                        width: '900px', height: '500px', borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(229,169,59,0.18) 0%, transparent 70%)',
                        filter: 'blur(60px)', pointerEvents: 'none'
                    }} />

                    <div style={{ ...CONTAINER, position: 'relative', zIndex: 1, textAlign: 'center' }}>
                        <h1 style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'clamp(36px, 5.5vw, 72px)',
                            fontWeight: '800', letterSpacing: '-0.035em', lineHeight: 1.05,
                            margin: '0 auto 24px',
                            maxWidth: '900px',
                            color: '#FFFFFF'
                        }}>
                            We Build <span className="text-marker-2">Brands</span> &amp;{' '}
                            <span style={{ color: '#E5A93B' }}>Software</span><br />
                            <span style={{ background: 'linear-gradient(90deg, #E5A93B 0%, #D5ED55 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                That Customers Love
                            </span>
                        </h1>

                        <p style={{
                            fontSize: 'clamp(15px, 1.8vw, 18px)', color: '#A2B6A6',
                            lineHeight: 1.65, maxWidth: '720px', margin: '0 auto 40px',
                            fontWeight: '500'
                        }}>
                            Two service wings under one roof —{' '}
                            <strong style={{ color: '#FFFFFF' }}>OpenZen</strong> for
                            web, SaaS & custom software, and{' '}
                            <strong style={{ color: '#FFFFFF' }}>Aanandham Studio</strong> for
                            brand setup, social media, and performance marketing. From first sketch to 180K followers.
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginBottom: '56px' }}>
                            <a href="#wings" className="services-cta-gold">
                                <span>Explore Our Services</span>
                                <ArrowRight size={16} strokeWidth={3} />
                            </a>
                            <a
                                href={waLink('Hi! I want to discuss a project with the Aanandham × OpenZen team.')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="services-cta-whatsapp"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                </svg>
                                <span>Book a Discovery Call</span>
                            </a>
                        </div>

                        {/* Trust Stats */}
                        <div style={{
                            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                            gap: '16px', maxWidth: '720px', margin: '0 auto',
                            padding: '24px', background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px',
                            backdropFilter: 'blur(10px)'
                        }}>
                            {TRUST_STATS.map((s, i) => (
                                <div key={i} style={{ textAlign: 'center' }}>
                                    <s.icon size={20} color="#E5A93B" style={{ marginBottom: '8px' }} />
                                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#FFFFFF', fontFamily: 'var(--font-heading)' }}>
                                        {s.value}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#A2B6A6', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                                        {s.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* ═══════════════════════════════════════════════════════
                    2. THE TWO WINGS
                ═══════════════════════════════════════════════════════ */}
                <section id="wings" style={{ padding: 'clamp(50px, 5vw, 68px) clamp(20px, 4vw, 48px) clamp(70px, 7vw, 96px)', background: '#0B150E' }}>
                    <div style={CONTAINER}>
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0 }} variants={sectionReveal} style={{ textAlign: 'center', marginBottom: '56px' }}>
                            <div className="star-badge" style={{ display: 'inline-block', marginBottom: '16px' }}>
                                <span className="star-icon">★</span> TWO SERVICE WINGS
                            </div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '800',
                                color: '#FFFFFF', letterSpacing: '-0.035em', margin: '0 0 12px'
                            }}>
                                Pick Your <span style={{ background: 'linear-gradient(90deg, #E5A93B 0%, #D5ED55 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Wing</span>
                            </h2>
                            <p style={{ fontSize: '15px', color: '#A2B6A6', maxWidth: '600px', margin: '0 auto' }}>
                                Whether you need a custom software product or full-funnel brand growth, we have a dedicated team for it.
                            </p>
                        </motion.div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            {SERVICE_WINGS.map((wing, idx) => (
                                <motion.div
                                    key={wing.id}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0 }}
                                    variants={cardReveal}
                                    style={{
                                        background: '#0F1E13',
                                        border: `1px solid ${wing.accentBorder}`,
                                        borderRadius: '24px',
                                        padding: 'clamp(28px, 4vw, 48px)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        boxShadow: `0 20px 60px ${wing.glow}`
                                    }}
                                >
                                    <div style={{
                                        position: 'absolute', top: '-100px', right: '-100px',
                                        width: '400px', height: '400px', borderRadius: '50%',
                                        background: `radial-gradient(circle, ${wing.glow} 0%, transparent 70%)`,
                                        pointerEvents: 'none'
                                    }} />

                                    <div style={{ position: 'relative', zIndex: 1 }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px', marginBottom: '32px' }}>
                                            <div style={{ flex: '1 1 320px' }}>
                                                <div className="star-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                                    <wing.icon size={14} color={wing.accent} />
                                                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1.2px', textTransform: 'uppercase', color: wing.accent }}>
                                                        {wing.badge}
                                                    </span>
                                                </div>
                                                <h3 style={{
                                                    fontFamily: 'var(--font-heading)',
                                                    fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: '800',
                                                    color: '#FFFFFF', letterSpacing: '-0.035em', margin: '0 0 12px'
                                                }}>
                                                    {wing.title}
                                                </h3>
                                                <p style={{ fontSize: '17px', color: wing.accent, fontWeight: '700', margin: '0 0 12px' }}>
                                                    {wing.tagline}
                                                </p>
                                                <p style={{ fontSize: '14.5px', color: '#A2B6A6', lineHeight: 1.65, margin: '0 0 24px' }}>
                                                    {wing.description}
                                                </p>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                                    <a href={waLink(`Hi! I'd like to know more about ${wing.title} services.`)} target="_blank" rel="noopener noreferrer" className="services-cta-gold" style={{ fontSize: '13px', padding: '12px 22px' }}>
                                                        <span>{wing.cta}</span>
                                                        <ArrowUpRight size={14} strokeWidth={3} />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Services Grid */}
                                        <motion.div
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true, amount: 0 }}
                                            variants={staggerContainer}
                                            style={{
                                                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                                                gap: '16px', marginTop: '24px',
                                                paddingTop: '24px', borderTop: `1px solid ${wing.accentBorder}`
                                            }}
                                        >
                                            {wing.services.map((svc, si) => (
                                                <motion.div
                                                    key={si}
                                                    variants={cardReveal}
                                                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                                    className="wing-service-card"
                                                    style={{
                                                        background: '#0B150E', border: `1px solid rgba(255,255,255,0.06)`,
                                                        borderRadius: '16px', padding: '20px',
                                                        transition: 'all 0.25s ease',
                                                        cursor: 'default'
                                                    }}
                                                >
                                                    <div style={{
                                                        width: '44px', height: '44px', borderRadius: '12px',
                                                        background: wing.accentBg, color: wing.accent,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        marginBottom: '14px',
                                                        transition: 'all 0.25s ease'
                                                    }}>
                                                        <svc.icon size={20} strokeWidth={2.2} />
                                                    </div>
                                                    <h4 style={{
                                                        fontFamily: 'var(--font-heading)',
                                                        fontSize: '16px', fontWeight: '800', color: '#FFFFFF',
                                                        margin: '0 0 8px', lineHeight: 1.3,
                                                        letterSpacing: '-0.01em'
                                                    }}>
                                                        {svc.title}
                                                    </h4>
                                                    <p style={{ fontSize: '12.5px', color: '#A2B6A6', lineHeight: 1.55, margin: '0 0 14px' }}>
                                                        {svc.desc}
                                                    </p>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                        {svc.deliverables.map((d, di) => (
                                                            <span key={di} style={{
                                                                fontSize: '10px', fontWeight: '700',
                                                                background: 'rgba(255,255,255,0.06)',
                                                                border: '1px solid rgba(255,255,255,0.1)',
                                                                color: '#D5ED55', padding: '3px 8px', borderRadius: '6px'
                                                            }}>
                                                                {d}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════
                    3. PORTFOLIO
                ═══════════════════════════════════════════════════════ */}
                <section id="portfolio" style={{ padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 48px)', background: '#121613', color: '#FFFFFF' }}>
                    <div style={CONTAINER}>
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0 }} variants={sectionReveal} style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <div className="star-badge" style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                                padding: '6px 14px', borderRadius: '999px', marginBottom: '16px'
                            }}>
                                <Eye size={14} color="#E5A93B" />
                                <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#E5A93B' }}>
                                    SELECTED WORK
                                </span>
                            </div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '800',
                                color: '#FFFFFF', letterSpacing: '-0.035em', margin: '0 0 12px'
                            }}>
                                <span className="text-marker-2">Proof</span> in Production
                            </h2>
                            <p style={{ fontSize: '15px', color: '#A2B6A6', maxWidth: '600px', margin: '0 auto 32px' }}>
                                A selection of recent projects across tech and marketing wings.
                            </p>

                            {/* Filter Tabs */}
                            <div style={{ display: 'inline-flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {[
                                    { id: 'all', label: 'All Work' },
                                    { id: 'tech', label: 'Tech & Software' },
                                    { id: 'marketing', label: 'Brand & Marketing' }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveFilter(tab.id)}
                                        className="filter-tab"
                                        data-active={activeFilter === tab.id}
                                        style={{
                                            background: activeFilter === tab.id ? '#E5A93B' : 'rgba(255,255,255,0.06)',
                                            color: activeFilter === tab.id ? '#0B150E' : '#A2B6A6',
                                            border: `1px solid ${activeFilter === tab.id ? '#E5A93B' : 'rgba(255,255,255,0.12)'}`,
                                            padding: '8px 18px', borderRadius: '999px',
                                            fontSize: '12.5px', fontWeight: '700', cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            key={activeFilter}
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            style={{
                                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                                gap: '24px'
                            }}
                        >
                            {filteredPortfolio.map((p) => (
                                <motion.article
                                    key={p.id}
                                    variants={cardReveal}
                                    whileHover={{ y: -6, transition: { duration: 0.25 } }}
                                    className="portfolio-card"
                                    data-accent={p.accent}
                                    style={{
                                        background: '#0B150E', border: '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: '20px', overflow: 'hidden',
                                        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                                        cursor: 'pointer',
                                        willChange: 'transform'
                                    }}
                                >
                                    <div style={{
                                        height: '220px', position: 'relative', overflow: 'hidden',
                                        background: `linear-gradient(135deg, ${p.accent}20 0%, transparent 100%)`
                                    }}>
                                        <img
                                            src={p.image}
                                            alt={p.title}
                                            loading="lazy"
                                            className="portfolio-image"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                                        />
                                        <div style={{
                                            position: 'absolute', top: '14px', left: '14px',
                                            background: p.accent, color: '#FFFFFF',
                                            padding: '5px 12px', borderRadius: '6px',
                                            fontSize: '10px', fontWeight: '800',
                                            letterSpacing: '0.8px', textTransform: 'uppercase',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                                        }}>
                                            {p.type === 'tech' ? 'TECH' : 'MARKETING'}
                                        </div>
                                        <div style={{
                                            position: 'absolute', top: '14px', right: '14px',
                                            background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(10px)',
                                            color: '#FFFFFF', padding: '5px 12px', borderRadius: '6px',
                                            fontSize: '10px', fontWeight: '700',
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}>
                                            {p.year}
                                        </div>
                                    </div>

                                    <div style={{ padding: '24px' }}>
                                        <div style={{
                                            fontSize: '10.5px', fontWeight: '800', color: p.accent,
                                            letterSpacing: '1.4px', textTransform: 'uppercase', marginBottom: '10px'
                                        }}>
                                            {p.client} · {p.category}
                                        </div>
                                        <h3 style={{
                                            fontFamily: 'var(--font-heading)',
                                            fontSize: '20px', fontWeight: '800', color: '#FFFFFF',
                                            lineHeight: 1.3, margin: '0 0 12px',
                                            letterSpacing: '-0.02em'
                                        }}>
                                            {p.title}
                                        </h3>
                                        <p style={{ fontSize: '13px', color: '#A2B6A6', lineHeight: 1.6, margin: '0 0 18px' }}>
                                            {p.desc}
                                        </p>

                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
                                            {p.highlights.map((h, hi) => (
                                                <div key={hi} style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                                                    background: `${p.accent}15`, border: `1px solid ${p.accent}35`,
                                                    color: p.accent, padding: '5px 11px', borderRadius: '6px',
                                                    fontSize: '10.5px', fontWeight: '700'
                                                }}>
                                                    <Check size={10} strokeWidth={3.5} /> {h}
                                                </div>
                                            ))}
                                        </div>

                                        <div style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            flexWrap: 'wrap', gap: '10px',
                                            paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)'
                                        }}>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                {p.tags.map((t, ti) => (
                                                    <span key={ti} style={{
                                                        fontSize: '10px', fontWeight: '600',
                                                        background: 'rgba(255,255,255,0.04)',
                                                        color: '#A2B6A6', padding: '3px 8px', borderRadius: '4px'
                                                    }}>
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>

                                            {p.live && (
                                                <a href={p.live} target="_blank" rel="noopener noreferrer" className="view-live-btn">
                                                    View Live <ArrowUpRight size={11} strokeWidth={3} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════
                    4. PROCESS
                ═══════════════════════════════════════════════════════ */}
                <section style={{ padding: 'clamp(50px, 5vw, 68px) clamp(20px, 4vw, 48px) clamp(70px, 7vw, 96px)', background: '#0B150E' }}>
                    <div style={CONTAINER}>
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0 }} variants={sectionReveal} style={{ textAlign: 'center', marginBottom: '48px' }}>
                            <div className="star-badge" style={{ display: 'inline-block', marginBottom: '16px' }}>
                                <span className="star-icon">★</span> HOW WE WORK
                            </div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '800',
                                color: '#FFFFFF', letterSpacing: '-0.035em', margin: '0 0 12px'
                            }}>
                                Simple, <span style={{ background: 'linear-gradient(90deg, #E5A93B 0%, #D5ED55 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Transparent</span> Process
                            </h2>
                            <p style={{ fontSize: '15px', color: '#A2B6A6', maxWidth: '600px', margin: '0 auto' }}>
                                No surprises, no hidden fees. Just clear steps from idea to launch.
                            </p>
                        </motion.div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                            {PROCESS_STEPS.map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0 }}
                                    variants={cardReveal}
                                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                    className="process-step"
                                    style={{
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: '18px', padding: '24px',
                                        position: 'relative',
                                        cursor: 'default',
                                        background: '#0F1E13',
                                        transition: 'all 0.25s ease'
                                    }}
                                >
                                    <div style={{
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: '36px', fontWeight: '800', color: '#E5A93B',
                                        lineHeight: 1, marginBottom: '12px',
                                        letterSpacing: '-0.02em'
                                    }}>
                                        {step.num}
                                    </div>
                                    <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
                                        {step.title}
                                    </h4>
                                    <p style={{ fontSize: '13px', color: '#A2B6A6', lineHeight: 1.6, margin: 0 }}>
                                        {step.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════
                    5. CTA
                ═══════════════════════════════════════════════════════ */}
                <section style={{
                    padding: 'clamp(50px, 5vw, 68px) clamp(20px, 4vw, 48px) clamp(70px, 7vw, 96px)',
                    background: 'linear-gradient(135deg, #0B150E 0%, #1A1F1A 100%)',
                    color: '#FFFFFF', position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'radial-gradient(circle at 50% 50%, rgba(229,169,59,0.08) 0%, transparent 60%)',
                        pointerEvents: 'none'
                    }} />
                    <div style={{ ...CONTAINER, position: 'relative', zIndex: 1, textAlign: 'center' }}>
                        <Rocket size={48} color="#E5A93B" style={{ marginBottom: '20px' }} />
                        <h2 style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '800',
                            letterSpacing: '-0.035em', lineHeight: 1.1, margin: '0 0 16px',
                            color: '#FFFFFF'
                        }}>
                            Let's Build <span style={{ background: 'linear-gradient(90deg, #E5A93B 0%, #D5ED55 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Something</span><br />
                            Worth Talking About
                        </h2>
                        <p style={{ fontSize: '16px', maxWidth: '560px', margin: '0 auto 32px', color: '#A2B6A6' }}>
                            Whether it's a custom SaaS, a brand launch, or a growth campaign — we'd love to hear your story.
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                            <a href={waLink('Hi! I want to start a project with the Aanandham × OpenZen team.')} target="_blank" rel="noopener noreferrer" className="services-cta-whatsapp">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                </svg>
                                <span>Start on WhatsApp</span>
                            </a>
                            <a href="mailto:bookings@aanandham.in?subject=Project Inquiry - Aanandham × OpenZen" className="services-cta-email">
                                <Mail size={16} />
                                <span>Email Us</span>
                            </a>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}