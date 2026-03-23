import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const successMessage = (location.state as any)?.message;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const response: any = await api.post('/auth/login', { email, password });
            login(response.token);
            navigate('/');
        } catch (err: any) {
            setError(err.errors?.[0]?.msg || err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card" 
                style={{ maxWidth: '450px', width: '100%', padding: '40px', borderRadius: '24px' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ 
                        width: '60px', height: '60px', background: 'var(--primary)', color: 'white', 
                        borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px'
                    }}>
                        <LogIn size={30} />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--foreground)' }}>Welcome Back</h2>
                    <p style={{ color: '#64748b', marginTop: '8px' }}>Login to access your personalized dashboard</p>
                </div>

                {successMessage && (
                    <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '12px', borderRadius: '12px', marginBottom: '20px', textAlign: 'center', fontSize: '0.9rem', border: '1px solid #dcfce7' }}>
                        {successMessage}
                    </div>
                )}

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ background: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: '12px', marginBottom: '20px', textAlign: 'center', fontSize: '0.9rem', border: '1px solid #fee2e2' }}
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="label" style={{ fontSize: '0.9rem' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input 
                                type="email" 
                                className="input" 
                                style={{ paddingLeft: '44px' }}
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                        </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                        <label className="label" style={{ fontSize: '0.9rem' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input 
                                type={showPassword ? "text" : "password"} 
                                className="input" 
                                style={{ paddingLeft: '44px', paddingRight: '44px' }}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                        <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Forgot Password?</Link>
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-gradient" 
                        style={{ width: '100%', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : (
                            <>
                                <span>Sign In</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <p style={{ marginTop: '32px', textAlign: 'center', fontSize: '0.95rem', color: '#64748b' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Create Account</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
