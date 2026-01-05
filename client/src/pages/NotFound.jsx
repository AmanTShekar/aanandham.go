import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCompass, FaHome } from 'react-icons/fa';
import SEO from '../components/SEO';

const NotFound = () => {
    return (
        <>
            <SEO
                title="Page Not Found"
                description="The destination you are looking for doesn't exist. Let us guide you back home."
            />
            <div style={{
                minHeight: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 20px',
                background: 'var(--bg-white)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background Accent */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '300px',
                    height: '300px',
                    background: 'var(--primary)',
                    filter: 'blur(150px)',
                    opacity: '0.1',
                    zIndex: 0
                }}></div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{
                        textAlign: 'center',
                        maxWidth: '500px',
                        zIndex: 1
                    }}
                >
                    <motion.div
                        animate={{
                            rotate: [0, 5, -5, 0],
                            y: [0, -10, 0]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{
                            fontSize: '120px',
                            color: 'var(--primary)',
                            marginBottom: '20px',
                            display: 'inline-block',
                            opacity: 0.8
                        }}
                    >
                        <FaCompass />
                    </motion.div>

                    <h1 style={{
                        fontSize: 'clamp(40px, 8vw, 64px)',
                        fontWeight: '900',
                        color: 'white',
                        marginBottom: '16px',
                        lineHeight: '1.1'
                    }}>
                        Lost in the <span style={{ color: 'var(--primary)' }}>Wild?</span>
                    </h1>

                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '18px',
                        marginBottom: '40px',
                        lineHeight: '1.6'
                    }}>
                        The destination you're looking for seems to have moved or doesn't exist.
                        Let us guide you back to civilization.
                    </p>

                    <div style={{
                        display: 'flex',
                        gap: '20px',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }}>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    padding: '16px 32px',
                                    borderRadius: 'var(--radius-full)',
                                    background: 'var(--primary-gradient)',
                                    color: 'black',
                                    border: 'none',
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    cursor: 'pointer',
                                    boxShadow: 'var(--shadow-lg)'
                                }}
                            >
                                <FaHome /> Return Home
                            </motion.button>
                        </Link>

                        <Link to="/contact" style={{ textDecoration: 'none' }}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    padding: '16px 32px',
                                    borderRadius: 'var(--radius-full)',
                                    background: 'transparent',
                                    color: 'white',
                                    border: '1px solid var(--border-light)',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                            >
                                Contact Support
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default NotFound;
