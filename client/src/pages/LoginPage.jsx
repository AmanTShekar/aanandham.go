import { useState } from 'react';
import { FaApple, FaFacebookF, FaEye, FaEyeSlash, FaPaperPlane } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../services/api';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.login({ email, password });
            // Dispatch a custom event to notify Navbar of login
            window.dispatchEvent(new Event('storage'));

            if (response.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-light)',
            padding: '40px 20px'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    width: '100%',
                    maxWidth: '480px',
                    backgroundColor: 'var(--bg-white)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '56px 48px',
                    boxShadow: 'var(--shadow-xl)',
                    border: '1px solid var(--border)'
                }}
            >
                {/* Logo */}
                <Link to="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    marginBottom: '48px',
                    textDecoration: 'none'
                }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        background: 'var(--primary-gradient)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '800',
                        fontSize: '24px',
                        boxShadow: 'var(--shadow-md)'
                    }}>
                        <FaPaperPlane size={20} style={{ transform: 'translate(-2px, 2px)' }} />
                    </div>
                    <span style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>Annadnam</span>
                </Link>

                {/* Header */}
                <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                    <h1 style={{
                        fontSize: '36px',
                        fontWeight: '700',
                        marginBottom: '12px',
                        color: 'var(--text-main)',
                        letterSpacing: '-1px'
                    }}>
                        Welcome Back
                    </h1>
                    <p style={{
                        fontSize: '18px',
                        color: 'var(--text-secondary)',
                        fontWeight: '400'
                    }}>
                        Sign in to continue your journey
                    </p>
                </div>

                {/* Social Login - Circular Icons */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '16px',
                    marginBottom: '32px'
                }}>
                    <button style={{
                        width: '56px',
                        height: '56px',
                        border: '2px solid var(--border)',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        boxShadow: 'var(--shadow-sm)'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                            e.currentTarget.style.borderColor = '#DB4437';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                            e.currentTarget.style.borderColor = 'var(--border)';
                        }}
                    >
                        <FcGoogle size={24} />
                    </button>

                    <button style={{
                        width: '56px',
                        height: '56px',
                        border: '2px solid var(--border)',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        boxShadow: 'var(--shadow-sm)'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                            e.currentTarget.style.borderColor = '#000000';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                            e.currentTarget.style.borderColor = 'var(--border)';
                        }}
                    >
                        <FaApple size={26} color="#000000" />
                    </button>

                    <button style={{
                        width: '56px',
                        height: '56px',
                        border: '2px solid var(--border)',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        boxShadow: 'var(--shadow-sm)'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                            e.currentTarget.style.borderColor = '#1877F2';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                            e.currentTarget.style.borderColor = 'var(--border)';
                        }}
                    >
                        <FaFacebookF size={22} color="#1877F2" />
                    </button>
                </div>

                {/* Divider */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginBottom: '32px'
                }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }}></div>
                    <span style={{ fontSize: '15px', color: 'var(--text-secondary)', fontWeight: '500' }}>OR</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }}></div>
                </div>

                <form onSubmit={handleLogin}>
                    {error && (
                        <div style={{
                            backgroundColor: '#fff8f6',
                            color: '#c13515',
                            padding: '12px',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '20px',
                            fontSize: '14px',
                            textAlign: 'center',
                            border: '1px solid #c13515'
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Email Input */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '15px',
                            fontWeight: '600',
                            marginBottom: '10px',
                            color: 'var(--text-main)'
                        }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            style={{
                                width: '100%',
                                padding: '16px 18px',
                                border: '2px solid var(--border)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '16px',
                                outline: 'none',
                                transition: 'all 0.2s ease',
                                boxSizing: 'border-box',
                                backgroundColor: 'var(--bg-light)',
                                color: 'var(--text-main)'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = 'var(--primary)';
                                e.target.style.backgroundColor = 'white';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'var(--border)';
                                e.target.style.backgroundColor = 'var(--bg-light)';
                            }}
                        />
                    </div>

                    {/* Password Input */}
                    <div style={{ marginBottom: '12px', position: 'relative' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '15px',
                            fontWeight: '600',
                            marginBottom: '10px',
                            color: 'var(--text-main)'
                        }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                style={{
                                    width: '100%',
                                    padding: '16px 50px 16px 18px',
                                    border: '2px solid var(--border)',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '16px',
                                    outline: 'none',
                                    transition: 'all 0.2s ease',
                                    boxSizing: 'border-box',
                                    backgroundColor: 'var(--bg-light)',
                                    color: 'var(--text-main)'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'var(--primary)';
                                    e.target.style.backgroundColor = 'white';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'var(--border)';
                                    e.target.style.backgroundColor = 'var(--bg-light)';
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '16px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--text-secondary)',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Forgot Password Link */}
                    <div style={{ marginBottom: '28px', textAlign: 'right' }}>
                        <a href="#" style={{
                            fontSize: '14px',
                            color: 'var(--primary)',
                            textDecoration: 'none',
                            fontWeight: '600'
                        }}>
                            Forgot password?
                        </a>
                    </div>

                    {/* Sign in button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '18px',
                            background: 'var(--primary-gradient)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '17px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginBottom: '28px',
                            transition: 'all 0.3s ease',
                            boxShadow: 'var(--shadow-floating)',
                            letterSpacing: '0.3px',
                            opacity: loading ? 0.7 : 1
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 8px 20px rgba(212, 175, 55, 0.4)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'var(--shadow-floating)';
                            }
                        }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {/* Sign up link */}
                <p style={{
                    textAlign: 'center',
                    fontSize: '15px',
                    color: 'var(--text-secondary)'
                }}>
                    Don't have an account?{' '}
                    <Link to="/signup" style={{
                        color: 'var(--primary)',
                        fontWeight: '600',
                        textDecoration: 'none'
                    }}>
                        Sign Up
                    </Link>
                </p>

                {/* Footer text */}
                <p style={{
                    marginTop: '32px',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    textAlign: 'center',
                    lineHeight: '1.6'
                }}>
                    By continuing, you agree to Annadnam's{' '}
                    <a href="#" style={{ color: 'var(--text-main)', textDecoration: 'underline' }}>Terms</a>
                    {' '}and{' '}
                    <a href="#" style={{ color: 'var(--text-main)', textDecoration: 'underline' }}>Privacy Policy</a>
                </p>
            </motion.div>
        </div>
    );
};

export default LoginPage;
