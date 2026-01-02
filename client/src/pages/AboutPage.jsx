import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, useSpring, useMotionValue, useTransform, animate } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCampground, FaMountain, FaUsers, FaStar, FaMapMarkedAlt, FaFire, FaLeaf, FaQuoteLeft, FaCheckCircle, FaQuestionCircle, FaBinoculars, FaCompass, FaHistory, FaHeart, FaGraduationCap, FaInstagram } from 'react-icons/fa';
import pngLogo from '../assets/pnglogo.png';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

// Premium Animated Counter
const Counter = ({ value, label }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));

    // Parse number
    const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    const suffix = value.replace(/[0-9]/g, '');

    useEffect(() => {
        if (isInView) {
            const controls = animate(count, numericValue, {
                duration: 2.0,
                ease: "circOut"
            });
            return controls.stop;
        }
    }, [isInView, numericValue]);

    return (
        <div ref={ref} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 20px' }}>
            <div style={{
                fontSize: '42px',
                fontWeight: '800',
                color: 'var(--primary)',
                fontFamily: 'var(--font-serif)',
                marginBottom: '5px'
            }}>
                <motion.span>{rounded}</motion.span>{suffix}
            </div>
            <div style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '2px', color: '#a1a1aa', fontWeight: '600' }}>{label}</div>
        </div>
    );
};

// Enhanced Team Member Card
const TeamCard = ({ name, role, image, bio, expertise }) => (
    <motion.div
        whileHover={{ y: -10 }}
        style={{
            background: 'var(--bg-off-white)',
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid var(--border-light)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        }}
    >
        <div style={{ height: '300px', overflow: 'hidden', position: 'relative' }}>
            <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: '20px' }}>
                <h3 style={{ fontSize: '22px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>{name}</h3>
                <div style={{ color: 'var(--primary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>{role}</div>
            </div>
        </div>
        <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.6', fontStyle: 'italic' }}>"{bio}"</p>
            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-light)', paddingTop: '15px' }}>
                <span style={{ fontSize: '12px', color: '#71717a', textTransform: 'uppercase', fontWeight: '700' }}>Expertise:</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                    {expertise.map((skill, i) => (
                        <span key={i} style={{ fontSize: '11px', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '12px', fontWeight: '500' }}>
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    </motion.div>
);

const AboutPage = () => {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        "name": "Aanandham",
        "url": "https://aanandham.in",
        "image": pngLogo,
        "description": "Premier Munnar camping, Suryanelli tent stays, and Kolukkumalai trekking provider. Verified luxury tents and jeep safaris.",
        "founder": { "@type": "Person", "name": "Suryanarayanan" },
        "address": { "@type": "PostalAddress", "addressLocality": "Munnar", "addressRegion": "Kerala", "addressCountry": "IN" },
        "priceRange": "$$"
    };

    const stats = [
        { number: "500+", label: "Events Hosted" },
        { number: "15000+", label: "Happy Guests" },
        { number: "50+", label: "Luxury Tents" },
        { number: "4.9", label: "Average Rating" }
    ];

    const services = [
        { icon: <FaCampground size={30} />, title: "Luxury Glamping", desc: "Plush bedding & private verandas in the wild." },
        { icon: <FaMountain size={30} />, title: "Kolukkumalai Trek", desc: "Sunrise at the world's highest tea estate. Exclusive Jeep Transfer." },
        { icon: <FaMapMarkedAlt size={30} />, title: "Jeep Safaris", desc: "Adrenaline-pumping 4x4 trails through cardamom forests." },
        { icon: <FaFire size={30} />, title: "Campfire Nights", desc: "Live BBQ, music, and starlit skies at Suryanelli." },
        { icon: <FaUsers size={30} />, title: "Group Events", desc: "Custom retreats for colleges & corporates in Munnar." },
        { icon: <FaLeaf size={30} />, title: "Eco-Friendly", desc: "Sustainable stays preserving the Western Ghats." }
    ];

    const team = [
        {
            name: "Mystery Pathfinder",
            role: "Founder & Lead Explorer",
            image: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
            bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            expertise: ["High Altitude Trekking", "Wildlife Tracking", "Eco-Tourism"]
        },
        {
            name: "Mystery Pathfinder",
            role: "Head of Guest Experience",
            image: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
            bio: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            expertise: ["Event Planning", "Guest Safety", "Local Cuisine"]
        },
        {
            name: "Mystery Pathfinder",
            role: "Senior Trekking Guard",
            image: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
            bio: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
            expertise: ["Jeep Off-roading", "First Aid", "Flora & Fauna"]
        }
    ];

    return (
        <div style={{ background: 'var(--bg-white)', minHeight: '100vh', color: 'var(--text-main)', paddingTop: '80px', overflowX: 'hidden' }}>
            <Navbar />
            <SEO
                title="About Aanandham - Our Story"
                description="The Aanandham Story: From local college students to Kerala's #1 verified camping provider. Luxury tents in Suryanelli & Kolukkumalai trekking."
                keywords="About Aanandham, Munnar Camping Story, Suryanelli Glamping Founders, Kerala Startup, Tent Stay Experts, Kolukkumalai Trekking"
                schema={structuredData}
            />

            {/* Hero Section */}
            <section style={{ position: 'relative', padding: '100px 20px 60px', textAlign: 'center', background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.05) 0%, transparent 70%)' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="container"
                    style={{ maxWidth: '1000px', margin: '0 auto' }}
                >
                    <motion.img
                        initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}
                        src={pngLogo} alt="Aanandham Munnar Logo"
                        style={{ height: '140px', width: 'auto', marginBottom: '40px', objectFit: 'contain', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.15))' }}
                    />

                    <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: '800', marginBottom: '24px', lineHeight: '1.1', letterSpacing: '-1px', fontFamily: 'var(--font-serif)' }}>
                        Aanandham
                        <span style={{ display: 'block', fontSize: '0.4em', fontWeight: '400', color: '#71717a', marginTop: '10px', fontFamily: 'var(--font-sans)', letterSpacing: '3px', textTransform: 'uppercase' }}>Luxury Camping & Resorts in Munnar</span>
                    </h1>

                    {/* Stats Grid - CHANGED TO ONE LINE FLEXBOX */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        gap: '30px',
                        padding: '40px',
                        background: 'var(--bg-off-white)',
                        borderRadius: '30px',
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)',
                        marginBottom: '80px',
                        border: '1px solid var(--border-light)'
                    }}>
                        {stats.map((stat, index) => <Counter key={index} value={stat.number} label={stat.label} />)}
                    </div>
                </motion.div>
            </section>

            {/* Did You Know / Fact Block */}
            <section style={{ padding: '60px 20px' }}>
                <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            style={{ padding: '30px', background: 'linear-gradient(135deg, #1f2937, #111827)', borderRadius: '24px', border: '1px solid var(--border-light)', color: 'white' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                <FaBinoculars size={24} color="var(--primary)" />
                                <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Did You Know?</h3>
                            </div>
                            <p style={{ lineHeight: '1.6', fontSize: '15px', color: '#d1d5db' }}>
                                <strong>Kolukkumalai</strong> is accessible only by a 4x4 jeep ride! It is the highest tea plantation in the world, growing tea at 7,900 feet. The high altitude gives the tea a special flavor and freshness.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            style={{ padding: '30px', background: 'var(--bg-off-white)', borderRadius: '24px', border: '1px solid var(--border-light)' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                <FaCompass size={24} color="var(--primary)" />
                                <h3 style={{ fontSize: '20px', fontWeight: '800' }}>Why Suryanelli?</h3>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '15px' }}>
                                Just outside the crowded Munnar town, <strong>Suryanelli</strong> offers unobstructed valley views. It's the gateway to the Phantom Head peak and offers the clearest night skies for stargazing in Kerala.
                            </p>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            style={{ padding: '30px', background: 'var(--bg-off-white)', borderRadius: '24px', border: '1px solid var(--border-light)' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                <FaCheckCircle size={24} color="var(--primary)" />
                                <h3 style={{ fontSize: '20px', fontWeight: '800' }}>The Aanandham Promise</h3>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '15px' }}>
                                Every <strong>tent stay</strong> listed on <strong>aanandham.in</strong> is verified. We ensure safe, female-friendly campsites with clean restrooms, hot water, and 24/7 on-site assistance.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* VISUAL REVERT: "Our Story" Image Collage + College Student Content */}
            <section style={{ padding: '80px 20px', background: 'var(--bg-white)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100px', background: 'linear-gradient(to bottom, var(--bg-white), transparent)' }}></div>

                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '80px', alignItems: 'center' }}>

                        {/* Narrative Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <span style={{ textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600', color: 'var(--primary)', fontSize: '14px' }}>Our Journey</span>
                            <h2 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '30px', fontFamily: 'var(--font-serif)', lineHeight: '1.2', marginTop: '10px' }}>
                                From Textbooks to Trails
                            </h2>

                            <div style={{ fontSize: '17px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                                <p style={{ marginBottom: '20px' }}>
                                    Our story didn't start in a boardroom; it started in a college classroom right here in Munnar. As students, we spent our weekends escaping the campus to explore the hidden ridges of <strong>Suryanelli</strong>. We realized that the "real" Munnar wasn't on the tourist maps—it was out there, in the silence of the tea gardens.
                                </p>
                                <p style={{ marginBottom: '20px' }}>
                                    We aren't a giant corporate agency. We started small, using our savings to rent our first campsite. We vetted every location ourselves. If we wouldn't let our own families stay there, we didn't list it.
                                </p>
                                <p>
                                    Today, <strong>Aanandham</strong> is a collection of hand-picked stays, but we still consider ourselves students of these mountains—always exploring, always learning.
                                </p>
                            </div>

                            <div style={{ marginTop: '40px', padding: '20px', borderLeft: '4px solid var(--primary)', background: 'var(--bg-off-white)' }}>
                                <FaQuoteLeft size={20} color="var(--primary)" style={{ marginBottom: '10px', opacity: 0.5 }} />
                                <p style={{ fontStyle: 'italic', color: 'var(--text-light)', fontSize: '16px', fontWeight: '500' }}>
                                    "We don't sell rooms; we sell mornings with the mist, evenings with the stars, and memories that last a lifetime."
                                </p>
                            </div>
                        </motion.div>

                        {/* The Image Collage Visual */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            style={{ position: 'relative' }}
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridTemplateRows: 'repeat(12, 1fr)', height: '500px' }}>
                                <div style={{ gridColumn: '1 / 9', gridRow: '1 / 9', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', zIndex: 2 }}>
                                    <img src="https://images.unsplash.com/photo-1496545672447-f699b503d270?w=800&q=80" alt="Munnar Hills Camping" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ gridColumn: '5 / 13', gridRow: '5 / 13', borderRadius: '30px', overflow: 'hidden', zIndex: 1, opacity: 0.7 }}>
                                    <img src="https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800&q=80" alt="Tent Stay Interiors" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>

                                {/* Floating Badge */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                    style={{
                                        position: 'absolute',
                                        bottom: '10%',
                                        left: '0%',
                                        background: 'var(--bg-off-white)',
                                        padding: '20px',
                                        borderRadius: '20px',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                                        zIndex: 3,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '15px',
                                        border: '1px solid var(--border-light)'
                                    }}
                                >
                                    <div style={{ background: 'rgba(212, 175, 55, 0.2)', padding: '12px', borderRadius: '50%', color: 'var(--primary)' }}>
                                        <FaStar size={24} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '800', fontSize: '20px', color: 'var(--text-main)' }}>4.9/5</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Guest Satisfaction</div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Expanded Team Section */}
            <section style={{ padding: '100px 20px', background: 'var(--bg-off-white)' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '36px', fontWeight: '800', fontFamily: 'var(--font-serif)', color: 'var(--text-main)' }}>Meet the Pathfinders</h2>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '15px auto', fontSize: '16px' }}>
                            We are a team of campers, not just developers. We built this platform to solve the problems we faced as travelers.
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
                        {team.map((member, index) => <TeamCard key={index} {...member} />)}
                    </div>
                </div>
            </section>

            {/* Values / Why Choose Us */}
            <section style={{ padding: '100px 20px', background: 'var(--bg-white)' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                        <div style={{ padding: '30px', border: '1px solid var(--border-light)', borderRadius: '24px' }}>
                            <FaLeaf size={30} color="var(--primary)" style={{ marginBottom: '20px' }} />
                            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>Sustainable First</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>We practice "Leave No Trace" camping. Our campsites use solar lighting and rigorous waste management to keep Munnar green.</p>
                        </div>
                        <div style={{ padding: '30px', border: '1px solid var(--border-light)', borderRadius: '24px' }}>
                            <FaUsers size={30} color="var(--primary)" style={{ marginBottom: '20px' }} />
                            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>Student Spirit</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>We bring the energy and passion of youth to hospitality. We are always learning, adapting, and improving to serve you better.</p>
                        </div>
                        <div style={{ padding: '30px', border: '1px solid var(--border-light)', borderRadius: '24px' }}>
                            <FaMapMarkedAlt size={30} color="var(--primary)" style={{ marginBottom: '20px' }} />
                            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>Hand-Picked Stays</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>We don't aim to be the biggest; we aim to be the most trusted. Every tent, resort, and jeep route is personally tested by our team.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section style={{ padding: '100px 20px', background: 'var(--bg-off-white)' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '36px', fontWeight: '800', fontFamily: 'var(--font-serif)' }}>The Aanandham Experience</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                        {services.map((service, index) => (
                            <motion.div key={index} whileHover={{ y: -10 }} style={{ padding: '30px', background: 'var(--bg-white)', borderRadius: '24px', border: '1px solid var(--border-light)' }}>
                                <div style={{ marginBottom: '20px', color: 'var(--primary)' }}>{service.icon}</div>
                                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>{service.title}</h3>
                                <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{service.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section style={{ padding: '80px 20px', background: 'var(--bg-white)' }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                        <FaQuestionCircle size={40} color="var(--primary)" style={{ marginBottom: '20px' }} />
                        <h2 style={{ fontSize: '32px', fontWeight: '800' }}>Frequently Asked Questions</h2>
                    </div>
                    {[
                        { q: "Is camping in Munnar safe for families?", a: "Absolutely. All our campsites in Suryanelli and Munnar are fenced, guarded 24/7, and family-friendly." },
                        { q: "What is the best time for the Kolukkumalai trek?", a: "The best time is from September to March for clear sunrise views. The jeep safari starts at 4:30 AM." },
                        { q: "Do you provide food?", a: "Yes, our packages are all-inclusive. You get a welcome drink, dinner with BBQ options, and a traditional Kerala breakfast." },
                        { q: "Are restrooms available at the campsite?", a: "Yes, we provide clean, western-style restrooms with hot water facilities at all our premium tent stays." }
                    ].map((item, i) => (
                        <div key={i} style={{ marginBottom: '20px', padding: '20px', background: 'var(--bg-off-white)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
                            <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px', color: 'var(--text-main)' }}>{item.q}</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>{item.a}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Social Feed / Instagram CTA for SEO Signal */}
            <section style={{ padding: '80px 20px', background: 'var(--bg-off-white)', textAlign: 'center' }}>
                <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <FaInstagram size={40} style={{ color: '#E1306C', marginBottom: '20px' }} />
                    <h3 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '15px' }}>Follow @aanandham.go</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '16px', lineHeight: '1.6' }}>
                        Join 20k+ travelers. Catch live sunrises from Kolukkumalai, tent stay reels, and daily weather updates on our official Instagram.
                    </p>
                    <a href="https://www.instagram.com/aanandham.go" target="_blank" rel="noopener noreferrer"
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '10px',
                            background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                            color: 'white', padding: '15px 30px', borderRadius: '30px', fontWeight: '700', textDecoration: 'none',
                            boxShadow: '0 10px 20px rgba(220, 39, 67, 0.3)', transition: 'transform 0.2s'
                        }}
                    >
                        <FaInstagram size={20} /> Follow on Instagram
                    </a>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default AboutPage;
