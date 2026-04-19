import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User as UserIcon, Phone, MapPin, ArrowRight } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const response: any = await api.post('/auth/register', formData);
            login(response.data.token);
            navigate('/', { state: { message: 'Registration successful! Welcome to Kirana.' } });
        } catch (err: any) {
            setError(err.errors?.[0]?.msg || err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card" 
                style={{ maxWidth: '500px', width: '100%', padding: '40px', borderRadius: '24px' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ 
                        width: '60px', height: '60px', background: 'var(--primary)', color: 'white', 
                        borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px'
                    }}>
                        <UserPlus size={30} />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--foreground)' }}>Create Account</h2>
                    <p style={{ color: '#64748b', marginTop: '8px' }}>Join Kirana for a premium shopping experience</p>
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '12px', marginBottom: '24px', fontSize: '0.9rem', border: '1px solid #fee2e2' }}
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="label" style={{ fontSize: '0.85rem' }}>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
                                    <UserIcon size={18} color="#94a3b8" />
                                </span>
                                <input name="name" type="text" className="input" style={{ paddingLeft: '40px' }} placeholder="John Doe" onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="label" style={{ fontSize: '0.85rem' }}>Phone</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
                                    <Phone size={18} color="#94a3b8" />
                                </span>
                                <input name="phone" type="tel" className="input" style={{ paddingLeft: '40px' }} placeholder="9876543210" onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label" style={{ fontSize: '0.85rem' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
                                <Mail size={18} color="#94a3b8" />
                            </span>
                            <input name="email" type="email" className="input" style={{ paddingLeft: '40px' }} placeholder="name@example.com" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label" style={{ fontSize: '0.85rem' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
                                <Lock size={18} color="#94a3b8" />
                            </span>
                            <input name="password" type="password" className="input" style={{ paddingLeft: '40px' }} placeholder="••••••••" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label" style={{ fontSize: '0.85rem' }}>Address (Optional)</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '12px', top: '14px', display: 'flex' }}>
                                <MapPin size={18} color="#94a3b8" />
                            </span>
                            <textarea name="address" className="input" style={{ paddingLeft: '40px', minHeight: '80px', resize: 'none' }} placeholder="Enter your delivery address" onChange={handleChange} />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-gradient" 
                        style={{ width: '100%', marginTop: '10px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : (
                            <>
                                <span>Create Account</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.95rem', color: '#64748b' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
