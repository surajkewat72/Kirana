import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Lock, Save, LogOut, ChevronRight } from 'lucide-react';
import api from '../api/client';

const Profile: React.FC = () => {
    const { user, logout, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || '',
        password: ''
    });
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: null, message: '' });

        try {
            const updatePayload: any = {
                name: formData.name,
                phone: formData.phone,
                address: formData.address
            };
            if (formData.password) {
                updatePayload.password = formData.password;
            }

            await api.patch('/auth/me', updatePayload);
            await refreshProfile();
            setStatus({ type: 'success', message: 'Profile updated successfully!' });
            setFormData(prev => ({ ...prev, password: '' }));
        } catch (error: any) {
            setStatus({ 
                type: 'error', 
                message: error.response?.data?.message || 'Failed to update profile' 
            });
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="container" style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div className="container" style={{ padding: '40px 20px', maxWidth: '800px' }}>
            <div className="profile-header" style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '8px' }}>My Profile</h1>
                <p style={{ color: '#64748b' }}>Manage your account settings and personal information.</p>
            </div>

            <div style={{ display: 'grid', gap: '32px' }}>
                {/* Profile Card */}
                <div className="glass-card" style={{ padding: '32px', borderRadius: 'var(--radius)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
                        <div style={{ 
                            width: '80px', 
                            height: '80px', 
                            background: 'var(--primary)', 
                            color: 'white', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontSize: '2rem', 
                            fontWeight: 700,
                            boxShadow: 'var(--shadow-lg)'
                        }}>
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{user.name}</h2>
                            <p style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Mail size={16} /> {user.email}
                            </p>
                            <span style={{ 
                                display: 'inline-block', 
                                marginTop: '8px', 
                                padding: '4px 12px', 
                                background: 'rgba(46, 204, 113, 0.1)', 
                                color: 'var(--primary)', 
                                borderRadius: '20px', 
                                fontSize: '0.8rem', 
                                fontWeight: 600 
                            }}>
                                {user.role} Account
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {status.type && (
                            <div style={{ 
                                padding: '12px 16px', 
                                borderRadius: '8px', 
                                marginBottom: '20px', 
                                background: status.type === 'success' ? '#dcfce7' : '#fee2e2',
                                color: status.type === 'success' ? '#166534' : '#991b1b',
                                fontSize: '0.9rem',
                                fontWeight: 500
                            }}>
                                {status.message}
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label className="label"><User size={16} /> Full Name</label>
                                <input 
                                    type="text" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input" 
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="label"><Phone size={16} /> Phone Number</label>
                                <input 
                                    type="text" 
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="input" 
                                    placeholder="Enter your phone"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="label"><MapPin size={16} /> Delivery Address</label>
                            <textarea 
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="input" 
                                style={{ minHeight: '100px', resize: 'vertical' }}
                                placeholder="Enter your full address"
                            />
                        </div>

                        <div className="form-group">
                            <label className="label"><Lock size={16} /> New Password (leave blank to keep current)</label>
                            <input 
                                type="password" 
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input" 
                                placeholder="••••••••"
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                            <button 
                                type="submit" 
                                className="btn btn-gradient" 
                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                disabled={loading}
                            >
                                <Save size={18} />
                                {loading ? 'Saving Changes...' : 'Save Changes'}
                            </button>
                            <button 
                                type="button" 
                                onClick={logout}
                                className="btn btn-outline" 
                                style={{ flex: 1, color: '#ef4444', borderColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            >
                                <LogOut size={18} />
                                Sign Out
                            </button>
                        </div>
                    </form>
                </div>

                {/* Additional Settings / Info */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    <div 
                        className="glass-card" 
                        style={{ padding: '20px', borderRadius: 'var(--radius)', cursor: 'pointer' }}
                        onClick={() => navigate('/orders')}
                    >
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            My Orders <ChevronRight size={18} />
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>View your purchase history</p>
                    </div>
                    <div 
                        className="glass-card" 
                        style={{ padding: '20px', borderRadius: 'var(--radius)', cursor: 'pointer' }}
                        onClick={() => navigate('/wishlist')}
                    >
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            Wishlist <ChevronRight size={18} />
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>Manage saved items</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
