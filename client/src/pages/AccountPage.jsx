import { useState } from 'react';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AccountPage = () => {
    const user = authAPI.getCurrentUser();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('personal');
    const [isBankModalOpen, setIsBankModalOpen] = useState(false);
    const [bankData, setBankData] = useState({ holderName: '', bankName: '', accountNumber: '' });

    const handleAddBank = (e) => {
        e.preventDefault();
        // Mock API call
        alert('Bank account added successfully!');
        setIsBankModalOpen(false);
        setBankData({ holderName: '', bankName: '', accountNumber: '' });
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '40px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-main)' }}>Account</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                {user.name}, {user.email}
            </p>

            {/* Tabs */}
            <div style={{ borderBottom: '1px solid var(--border)', marginBottom: '32px' }}>
                <div style={{ display: 'flex', gap: '32px' }}>
                    <button
                        onClick={() => setActiveTab('personal')}
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: '16px 0',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            borderBottom: activeTab === 'personal' ? '2px solid var(--primary)' : '2px solid transparent',
                            color: activeTab === 'personal' ? 'var(--primary)' : 'var(--text-secondary)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Personal info
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: '16px 0',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            borderBottom: activeTab === 'security' ? '2px solid var(--primary)' : '2px solid transparent',
                            color: activeTab === 'security' ? 'var(--primary)' : 'var(--text-secondary)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Login & security
                    </button>
                    <button
                        onClick={() => setActiveTab('preferences')}
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: '16px 0',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            borderBottom: activeTab === 'preferences' ? '2px solid var(--primary)' : '2px solid transparent',
                            color: activeTab === 'preferences' ? 'var(--primary)' : 'var(--text-secondary)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Preferences
                    </button>
                    <button
                        onClick={() => setActiveTab('payments')}
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: '16px 0',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            borderBottom: activeTab === 'payments' ? '2px solid var(--primary)' : '2px solid transparent',
                            color: activeTab === 'payments' ? 'var(--primary)' : 'var(--text-secondary)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Payments & Payouts
                    </button>
                </div>
            </div>

            {/* Content */}
            {activeTab === 'personal' && (
                <div>
                    <div style={{ marginBottom: '32px', padding: '24px', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-white)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <div>
                                <div style={{ fontWeight: '600', marginBottom: '4px', color: 'var(--text-main)' }}>Legal name</div>
                                <div style={{ color: 'var(--text-secondary)' }}>{user.name}</div>
                            </div>
                            <button style={{
                                padding: '8px 16px',
                                border: '1px solid var(--text-main)',
                                borderRadius: 'var(--radius-md)',
                                background: 'none',
                                cursor: 'pointer',
                                fontWeight: '600',
                                color: 'var(--text-main)',
                                transition: 'all 0.2s ease'
                            }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-light)'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                Edit
                            </button>
                        </div>
                    </div>

                    <div style={{ marginBottom: '32px', padding: '24px', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-white)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <div>
                                <div style={{ fontWeight: '600', marginBottom: '4px', color: 'var(--text-main)' }}>Email address</div>
                                <div style={{ color: 'var(--text-secondary)' }}>{user.email}</div>
                            </div>
                            <button style={{
                                padding: '8px 16px',
                                border: '1px solid var(--text-main)',
                                borderRadius: 'var(--radius-md)',
                                background: 'none',
                                cursor: 'pointer',
                                fontWeight: '600',
                                color: 'var(--text-main)',
                                transition: 'all 0.2s ease'
                            }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-light)'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                Edit
                            </button>
                        </div>
                    </div>

                    <div style={{ padding: '24px', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-white)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: '600', marginBottom: '4px', color: 'var(--text-main)' }}>Phone number</div>
                                <div style={{ color: 'var(--text-secondary)' }}>Not provided</div>
                            </div>
                            <button style={{
                                padding: '8px 16px',
                                border: '1px solid var(--text-main)',
                                borderRadius: 'var(--radius-md)',
                                background: 'none',
                                cursor: 'pointer',
                                fontWeight: '600',
                                color: 'var(--text-main)',
                                transition: 'all 0.2s ease'
                            }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-light)'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'security' && (
                <div>
                    <div style={{ marginBottom: '32px', padding: '24px', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-white)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: '600', marginBottom: '4px', color: 'var(--text-main)' }}>Password</div>
                                <div style={{ color: 'var(--text-secondary)' }}>Last updated 30 days ago</div>
                            </div>
                            <button style={{
                                padding: '8px 16px',
                                border: '1px solid var(--text-main)',
                                borderRadius: 'var(--radius-md)',
                                background: 'none',
                                cursor: 'pointer',
                                fontWeight: '600',
                                color: 'var(--text-main)',
                                transition: 'all 0.2s ease'
                            }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-light)'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                Update
                            </button>
                        </div>
                    </div>

                    <div style={{ padding: '24px', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-white)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: '600', marginBottom: '4px', color: 'var(--text-main)' }}>Two-factor authentication</div>
                                <div style={{ color: 'var(--text-secondary)' }}>Not enabled</div>
                            </div>
                            <button style={{
                                padding: '8px 16px',
                                border: '1px solid var(--text-main)',
                                borderRadius: 'var(--radius-md)',
                                background: 'none',
                                cursor: 'pointer',
                                fontWeight: '600',
                                color: 'var(--text-main)',
                                transition: 'all 0.2s ease'
                            }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-light)'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                Enable
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'preferences' && (
                <div>
                    <div style={{ marginBottom: '32px', padding: '24px', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-white)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ fontWeight: '600', marginBottom: '16px', color: 'var(--text-main)' }}>Currency</div>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>United States Dollar (USD)</div>
                        <button style={{
                            padding: '8px 16px',
                            border: '1px solid var(--text-main)',
                            borderRadius: 'var(--radius-md)',
                            background: 'none',
                            cursor: 'pointer',
                            fontWeight: '600',
                            color: 'var(--text-main)',
                            transition: 'all 0.2s ease'
                        }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-light)'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                            Change
                        </button>
                    </div>

                    <div style={{ padding: '24px', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-white)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ fontWeight: '600', marginBottom: '16px', color: 'var(--text-main)' }}>Language</div>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>English</div>
                        <button style={{
                            padding: '8px 16px',
                            border: '1px solid var(--text-main)',
                            borderRadius: 'var(--radius-md)',
                            background: 'none',
                            cursor: 'pointer',
                            fontWeight: '600',
                            color: 'var(--text-main)',
                            transition: 'all 0.2s ease'
                        }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-light)'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                            Change
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'payments' && (
                <div>
                    <div style={{ marginBottom: '32px', padding: '24px', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-white)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-main)' }}>Bank Accounts</h3>
                            <button
                                onClick={() => setIsBankModalOpen(true)}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Add Bank Account
                            </button>
                        </div>

                        {/* Mock Bank Account List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '40px', height: '40px', backgroundColor: '#f0f0f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        🏦
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>Chase Bank</div>
                                        <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>**** 1234</div>
                                    </div>
                                </div>
                                <span style={{ fontSize: '12px', padding: '4px 8px', backgroundColor: 'rgba(212, 175, 55, 0.1)', color: 'var(--primary)', borderRadius: '12px', fontWeight: '600', border: '1px solid var(--primary)' }}>Primary</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: '24px', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-white)', boxShadow: 'var(--shadow-sm)' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-main)' }}>Payout History</h3>
                        <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No payouts yet.</div>
                    </div>
                </div>
            )}

            {/* Add Bank Modal */}
            {isBankModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '32px',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '500px',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
                    }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Add Bank Account</h2>
                        <form onSubmit={handleAddBank}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Account Holder Name</label>
                                <input
                                    type="text"
                                    required
                                    value={bankData.holderName}
                                    onChange={(e) => setBankData({ ...bankData, holderName: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Bank Name</label>
                                <input
                                    type="text"
                                    required
                                    value={bankData.bankName}
                                    onChange={(e) => setBankData({ ...bankData, bankName: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                                />
                            </div>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Account Number</label>
                                <input
                                    type="text"
                                    required
                                    value={bankData.accountNumber}
                                    onChange={(e) => setBankData({ ...bankData, accountNumber: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsBankModalOpen(false)}
                                    style={{
                                        padding: '12px 24px',
                                        backgroundColor: 'transparent',
                                        border: '1px solid #222',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        padding: '12px 24px',
                                        backgroundColor: 'var(--primary)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Add Account
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountPage;
