import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { FaSearch, FaTrash, FaUserShield, FaUserPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios'; // Direct call for new endpoint until service updated

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentTab, setCurrentTab] = useState('all'); // 'all', 'hosts', 'admins'

    // Host Creation State
    const [isHostModalOpen, setIsHostModalOpen] = useState(false);
    const [newHost, setNewHost] = useState({ name: '', email: '', password: '' });
    const [creatingHost, setCreatingHost] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await adminAPI.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await adminAPI.updateUserRole(userId, newRole);
            fetchUsers();
        } catch (error) {
            console.error('Failed to update role:', error);
        }
    };

    const handleCreateHost = async (e) => {
        e.preventDefault();
        setCreatingHost(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/admin/create-host', newHost, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Host created successfully');
            setIsHostModalOpen(false);
            setNewHost({ name: '', email: '', password: '' });
            fetchUsers();
        } catch (error) {
            console.error('Failed to create host:', error);
            alert(error.response?.data?.message || 'Failed to create host');
        } finally {
            setCreatingHost(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        // Temporary bypass of confirm dialog
        // if (window.confirm('Are you sure you want to delete this user?')) {
        try {
            await adminAPI.deleteUser(userId);
            fetchUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
            alert('Failed to delete user');
        }
        // }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        if (currentTab === 'hosts') return user.role === 'business';
        if (currentTab === 'admins') return user.role === 'admin';
        return true;
    });

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Loading users...</div>;
    }

    return (
        <div style={{ padding: '40px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#222' }}>
                            User Management
                        </h1>
                        <p style={{ color: '#717171', fontSize: '16px' }}>
                            Manage all users and their roles
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div style={{ fontSize: '18px', fontWeight: '600', color: '#667eea' }}>
                            {filteredUsers.length} {currentTab === 'hosts' ? 'Hosts' : currentTab === 'admins' ? 'Admins' : 'Users'}
                        </div>
                        <button
                            onClick={() => setIsHostModalOpen(true)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '10px 20px',
                                background: '#222',
                                color: '#D4AF37',
                                border: '1px solid #D4AF37',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            <FaUserPlus /> Create Host
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div style={{ marginBottom: '24px', position: 'relative' }}>
                    <FaSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#717171' }} />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '14px 14px 14px 48px',
                            border: '2px solid #E8E8E8',
                            borderRadius: '12px',
                            fontSize: '15px',
                            outline: 'none',
                            transition: 'border-color 0.2s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#E8E8E8'}
                    />
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                    {['all', 'hosts', 'admins'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setCurrentTab(tab)}
                            style={{
                                padding: '8px 20px',
                                borderRadius: '20px',
                                border: 'none',
                                fontWeight: '600',
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                                background: currentTab === tab ? '#222' : '#f0f0f0',
                                color: currentTab === tab ? 'white' : '#666',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab === 'hosts' ? 'Hosts (Business)' : tab}
                        </button>
                    ))}
                </div>
                {/* Users Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        padding: '32px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        border: '1px solid rgba(0,0,0,0.05)'
                    }}
                >
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
                        <thead>
                            <tr>
                                <th style={{ padding: '0 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>User</th>
                                <th style={{ padding: '0 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</th>
                                <th style={{ padding: '0 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Role</th>
                                <th style={{ padding: '0 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Joined</th>
                                <th style={{ padding: '0 16px', textAlign: 'center', fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user._id} style={{ transition: 'transform 0.2s' }}>
                                    <td style={{ padding: '16px', background: '#f9f9fc', borderRadius: '12px 0 0 12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                background: user.role === 'admin' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontWeight: '700',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                            }}>
                                                {user.name.charAt(0)}
                                            </div>
                                            <span style={{ fontSize: '14px', fontWeight: '700', color: '#333' }}>
                                                {user.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', background: '#f9f9fc', fontSize: '14px', color: '#555' }}>
                                        {user.email}
                                    </td>
                                    <td style={{ padding: '16px', background: '#f9f9fc' }}>
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            style={{
                                                padding: '6px 12px',
                                                borderRadius: '8px',
                                                border: '1px solid #E8E8E8',
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                backgroundColor: user.role === 'admin' ? '#E8EAFF' : '#FFE8EC',
                                                color: user.role === 'admin' ? '#667eea' : '#FF385C',
                                                cursor: 'pointer',
                                                outline: 'none'
                                            }}
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td style={{ padding: '16px', background: '#f9f9fc', fontSize: '14px', color: '#777' }}>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '16px', background: '#f9f9fc', borderRadius: '0 12px 12px 0', textAlign: 'center' }}>
                                        <button
                                            onClick={() => handleDeleteUser(user._id)}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: 'rgba(255, 56, 92, 0.1)',
                                                border: 'none',
                                                borderRadius: '10px',
                                                color: '#FF385C',
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = '#FF385C';
                                                e.currentTarget.style.color = 'white';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'rgba(255, 56, 92, 0.1)';
                                                e.currentTarget.style.color = '#FF385C';
                                            }}
                                        >
                                            <FaTrash size={12} />
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>

                {/* Create Host Modal */}
                {isHostModalOpen && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }}>
                        <div style={{
                            backgroundColor: 'white', padding: '32px', borderRadius: '16px', width: '400px', maxWidth: '90%',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.1)'
                        }}>
                            <h2 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: '700', color: '#222' }}>Create New Host</h2>
                            <form onSubmit={handleCreateHost}>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Business Name</label>
                                    <input
                                        type="text"
                                        value={newHost.name}
                                        onChange={e => setNewHost({ ...newHost, name: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
                                        placeholder="e.g. Grand Hotel"
                                    />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Email</label>
                                    <input
                                        type="email"
                                        value={newHost.email}
                                        onChange={e => setNewHost({ ...newHost, email: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
                                        placeholder="host@example.com"
                                    />
                                </div>
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Password</label>
                                    <input
                                        type="password"
                                        value={newHost.password}
                                        onChange={e => setNewHost({ ...newHost, password: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
                                        placeholder="Generate a strong password"
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                    <button
                                        type="button"
                                        onClick={() => setIsHostModalOpen(false)}
                                        style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#f7f7f7', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={creatingHost}
                                        style={{
                                            padding: '10px 20px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            background: 'var(--primary-gradient)',
                                            color: 'white',
                                            cursor: 'pointer',
                                            fontWeight: '600',
                                            fontSize: '14px',
                                            opacity: creatingHost ? 0.7 : 1
                                        }}
                                    >
                                        {creatingHost ? 'Creating...' : 'Create Host'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
