import React from 'react';
import { motion } from 'framer-motion';
import { FaInstagram, FaCampground, FaUserFriends, FaFire, FaHiking } from 'react-icons/fa';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const StrangersCampPage = () => {
    return (
        <div style={{ background: '#000', minHeight: '100vh', color: 'white', paddingBottom: '80px' }}>
            <SEO
                title="Strangers to Friends: The Viral Munnar Camping Experience | Aanandham.go"
                description="Read the story behind our viral 'Strangers to Friends' camp in Munnar. Solo travel meets community bonding with campfire stories, sunrise treks, and luxury tent stays."
                keywords="Strangers to Friends Camp, Solo Traveling Munnar, Munnar Camping Stories, Community Trekking Kerala, Aanandham Viral Camp"
            />

            {/* Hero Header */}
            <div style={{
                position: 'relative',
                height: '60vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: 'url("https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=1200&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)' }}></div>
                <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ color: 'var(--primary)', fontWeight: '700', letterSpacing: '4px', textTransform: 'uppercase' }}
                    >
                        Community Experience
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{ fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: '900', margin: '20px 0', lineHeight: '1.2' }}
                    >
                        Strangers to Friends: <br /> A Camping Story
                    </motion.h1>
                </div>
            </div>

            <div className="container" style={{ paddingTop: '60px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px' }}>

                    {/* Main Story Content */}
                    <div>
                        <p style={{ fontSize: '20px', lineHeight: '1.8', color: '#e5e5e5', marginBottom: '30px' }}>
                            Looking for the <strong>#1 Solo Camping Experience in Munnar</strong>?
                            Join our signature <strong>Strangers to Friends</strong> community trek.
                            We offer verified <strong>Safe Tent Stays</strong> in Suryanelli with premium <strong>Luxury Glamping</strong> vibes.
                        </p>
                        <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#a1a1aa', marginBottom: '24px' }}>
                            We noticed that many people trekking to **Kolukkumalai** or visiting **Suryanelli** were doing it alone. They wanted the adventure, but they also craved connection. So we launched the "Strangers to Friends" edition—a curated camping experience designed to break the ice.
                        </p>
                        <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#a1a1aa', marginBottom: '40px' }}>
                            No cliques allowed. Just a warm campfire, a sky full of stars (Verified Stargazing spots), and stories from around the world.
                        </p>

                        <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '24px', color: 'var(--text-main)' }}>What Happens at the Camp?</h2>

                        <div style={{ marginBottom: '40px' }}>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                <div style={{ background: '#222', padding: '15px', borderRadius: '12px', minWidth: '60px', textAlign: 'center' }}><FaUserFriends size={24} color="var(--primary)" /></div>
                                <div>
                                    <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Ice-Breaking Sessions</h3>
                                    <p style={{ color: '#aaa', fontSize: '16px' }}>Curated games and conversation starters that actually work. Skip the small talk.</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                <div style={{ background: '#222', padding: '15px', borderRadius: '12px', minWidth: '60px', textAlign: 'center' }}><FaFire size={24} color="var(--primary)" /></div>
                                <div>
                                    <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Campfire & Music</h3>
                                    <p style={{ color: '#aaa', fontSize: '16px' }}>Unplugged acoustic sessions around a safe, controlled fire pit under the milky way.</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                <div style={{ background: '#222', padding: '15px', borderRadius: '12px', minWidth: '60px', textAlign: 'center' }}><FaHiking size={24} color="var(--primary)" /></div>
                                <div>
                                    <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Sunrise Trek</h3>
                                    <p style={{ color: '#aaa', fontSize: '16px' }}>We wake up at 4 AM for a jeep safari to Kolukkumalai to watch the sunrise as a tribe.</p>
                                </div>
                            </div>
                        </div>

                        <Link to="/hotels?search=Suryanelli" style={{
                            display: 'inline-block',
                            background: 'var(--primary)',
                            color: 'white',
                            padding: '16px 32px',
                            borderRadius: '50px',
                            fontWeight: '700',
                            textDecoration: 'none',
                            marginTop: '20px'
                        }}>
                            Book Your Spot
                        </Link>
                    </div>

                    {/* Instagram Embed / Card */}
                    <div>
                        <div style={{ position: 'sticky', top: '100px' }}>
                            <div style={{
                                background: '#111',
                                border: '1px solid #333',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                            }}>
                                <div style={{ padding: '24px', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: 'black' }}>A</div>
                                        <div>
                                            <div style={{ fontWeight: '700' }}>aanandham.go</div>
                                            <div style={{ fontSize: '12px', color: '#888' }}>Munnar, Kerala</div>
                                        </div>
                                    </div>
                                    <FaInstagram size={24} />
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <img src="https://scontent.cdninstagram.com/v/t51.75761-15/500481916_17872715106366614_3993402189379714778_n.webp?_nc_cat=100&ig_cache_key=MzYzODg5MTg5MTA5NTQzNTM0NA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEwODB4MTI1MC5zZHIuQzMifQ%3D%3D&_nc_ohc=er9Te_WStokQ7kNvwFc8myz&_nc_oc=AdlAlJ2mln_7eFy0nzld8KRoV84AMOu1zR53d0KBNwjk71WSmBvXeZZrsIdBksI3WN97FaEyZm8aH1gVpQih9MjI&_nc_ad=z-m&_nc_cid=1174&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=0huGEjWwzPXyrcP1KXhAUA&oh=00_Afo1cYJLVycM3v9E0brmaTYWKkM-0iK8iITPbTsWdUZqEA&oe=6961B908" alt="Camping Vibe" style={{ width: '100%', display: 'block' }} />
                                    <a href="https://www.instagram.com/p/DJ_8OUwyvhQ/" target="_blank" rel="noopener noreferrer" style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '80px',
                                        height: '80px',
                                        background: 'rgba(255,255,255,0.2)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        border: '2px solid white'
                                    }}>
                                        <div style={{
                                            width: 0,
                                            height: 0,
                                            borderTop: '15px solid transparent',
                                            borderBottom: '15px solid transparent',
                                            borderLeft: '25px solid white',
                                            marginLeft: '5px'
                                        }}></div>
                                    </a>
                                </div>
                                <div style={{ padding: '24px' }}>
                                    <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#ccc', marginBottom: '20px' }}>
                                        <strong>aanandham.go</strong> When strangers become family under the stars ✨ The magic of our weekend camp in Suryanelli is undefined. Come for the view, stay for the vibe.
                                    </p>
                                    <a href="https://www.instagram.com/p/DJ_8OUwyvhQ/" target="_blank" rel="noopener noreferrer" style={{
                                        display: 'block',
                                        width: '100%',
                                        padding: '12px',
                                        background: '#262626',
                                        color: 'white',
                                        textAlign: 'center',
                                        borderRadius: '12px',
                                        textDecoration: 'none',
                                        fontWeight: '600',
                                        fontSize: '14px'
                                    }}>
                                        View on Instagram
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StrangersCampPage;
