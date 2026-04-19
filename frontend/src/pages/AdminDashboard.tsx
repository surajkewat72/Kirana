import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { BarChart3, Package, Users, AlertTriangle, Search, Mail, Phone, Calendar, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'users'>('dashboard');
    const [stats, setStats] = useState<any>(null);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, ordersRes, usersRes]: any = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/orders'),
                api.get('/admin/users')
            ]);
            setStats(statsRes.data);
            setOrders(ordersRes.data || []);
            setUsers(usersRes.data || []);
        } catch (error) {
            console.error('Admin data fetch failed', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return (
        <div className="container" style={{ padding: '100px', textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
        </div>
    );

    const cards = [
        { label: 'Total Revenue', value: stats?.totalRevenue ? `₹${stats.totalRevenue}` : '₹0', icon: <BarChart3 size={20} color="#22c55e" /> },
        { label: 'Total Orders', value: stats?.totalOrders || 0, icon: <Package size={20} color="#3b82f6" /> },
        { label: 'Customers', value: stats?.totalUsers || 0, icon: <Users size={20} color="#a855f7" /> },
        { label: 'Stock Alerts', value: stats?.criticalStockItems || 0, icon: <AlertTriangle size={20} color="#ef4444" /> }
    ];

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2.4rem', fontWeight: 800 }}>Admin Panel</h1>
                <div className="glass-card" style={{ display: 'flex', padding: '4px', borderRadius: '12px' }}>
                    <button 
                        onClick={() => setActiveTab('dashboard')}
                        style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: activeTab === 'dashboard' ? 'var(--primary)' : 'transparent', color: activeTab === 'dashboard' ? 'white' : 'inherit', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                    >Dashboard</button>
                    <button 
                        onClick={() => setActiveTab('orders')}
                        style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: activeTab === 'orders' ? 'var(--primary)' : 'transparent', color: activeTab === 'orders' ? 'white' : 'inherit', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                    >Orders</button>
                    <button 
                        onClick={() => setActiveTab('users')}
                        style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: activeTab === 'users' ? 'var(--primary)' : 'transparent', color: activeTab === 'users' ? 'white' : 'inherit', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                    >Customers</button>
                </div>
            </div>
            
            <AnimatePresence mode="wait">
                {activeTab === 'dashboard' && (
                    <motion.div 
                        key="dashboard"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '48px' }}>
                            {cards.map((card, i) => (
                                <div key={i} className="glass-card" style={{ padding: '24px', borderRadius: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                        <span style={{ color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>{card.label}</span>
                                        {card.icon}
                                    </div>
                                    <div style={{ fontSize: '2rem', fontWeight: 800 }}>{card.value}</div>
                                </div>
                            ))}
                        </div>

                        <div className="glass-card" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                            <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', fontSize: '1.2rem', fontWeight: 800 }}>
                                Latest Transactions
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: 'var(--background)' }}>
                                    <tr>
                                        <th style={{ textAlign: 'left', padding: '16px 24px', color: '#64748b', fontSize: '0.85rem' }}>Order ID</th>
                                        <th style={{ textAlign: 'left', padding: '16px 24px', color: '#64748b', fontSize: '0.85rem' }}>Customer</th>
                                        <th style={{ textAlign: 'left', padding: '16px 24px', color: '#64748b', fontSize: '0.85rem' }}>Amount</th>
                                        <th style={{ textAlign: 'left', padding: '16px 24px', color: '#64748b', fontSize: '0.85rem' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.slice(0, 5).map((order: any) => (
                                        <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '16px 24px', fontWeight: 700 }}>#{order.id.split('-')[0].toUpperCase()}</td>
                                            <td style={{ padding: '16px 24px' }}>{order.user?.name}</td>
                                            <td style={{ padding: '16px 24px', fontWeight: 700, color: 'var(--primary)' }}>₹{order.totalAmount}</td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <span style={{ 
                                                    padding: '6px 12px', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 800,
                                                    background: order.status === 'DELIVERED' ? '#dcfce7' : '#fef9c3',
                                                    color: order.status === 'DELIVERED' ? '#16a34a' : '#a16207'
                                                }}>{order.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'users' && (
                    <motion.div 
                        key="users"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <div className="glass-card" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                            <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>Customer Directory</span>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
                                        <Search size={18} color="#94a3b8" />
                                    </span>
                                    <input 
                                        type="text" 
                                        placeholder="Search customers..." 
                                        className="input" 
                                        style={{ paddingLeft: '40px', width: '250px' }}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: 'var(--background)' }}>
                                    <tr>
                                        <th style={{ textAlign: 'left', padding: '16px 24px', color: '#64748b', fontSize: '0.85rem' }}>Profile</th>
                                        <th style={{ textAlign: 'left', padding: '16px 24px', color: '#64748b', fontSize: '0.85rem' }}>Contact</th>
                                        <th style={{ textAlign: 'left', padding: '16px 24px', color: '#64748b', fontSize: '0.85rem' }}>Role</th>
                                        <th style={{ textAlign: 'left', padding: '16px 24px', color: '#64748b', fontSize: '0.85rem' }}>Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.filter((u: any) => u.name.toLowerCase().includes(searchTerm.toLowerCase())).map((user: any) => (
                                        <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '40px', height: '40px', background: 'var(--primary)', color: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 800 }}>{user.name}</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>ID: #{user.id.split('-')[0].toUpperCase()}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}><Mail size={14} /> {user.email}</div>
                                                    {user.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}><Phone size={14} /> {user.phone}</div>}
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <span style={{ 
                                                    display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content',
                                                    padding: '4px 10px', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 700,
                                                    background: user.role === 'ADMIN' ? '#f0f9ff' : '#f8fafc',
                                                    color: user.role === 'ADMIN' ? '#0ea5e9' : '#64748b'
                                                }}>
                                                    <UserCheck size={14} />
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px 24px', color: '#64748b', fontSize: '0.85rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> {new Date(user.createdAt).toLocaleDateString()}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'orders' && (
                    <motion.div 
                        key="orders"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <div className="glass-card" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                            <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', fontSize: '1.2rem', fontWeight: 800 }}>
                                All Orders
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: 'var(--background)' }}>
                                    <tr>
                                        <th style={{ textAlign: 'left', padding: '16px 24px', color: '#64748b', fontSize: '0.85rem' }}>Order</th>
                                        <th style={{ textAlign: 'left', padding: '16px 24px', color: '#64748b', fontSize: '0.85rem' }}>Customer</th>
                                        <th style={{ textAlign: 'left', padding: '16px 24px', color: '#64748b', fontSize: '0.85rem' }}>Amount</th>
                                        <th style={{ textAlign: 'left', padding: '16px 24px', color: '#64748b', fontSize: '0.85rem' }}>Date</th>
                                        <th style={{ textAlign: 'left', padding: '16px 24px', color: '#64748b', fontSize: '0.85rem' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order: any) => (
                                        <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '16px 24px', fontWeight: 700 }}>#{order.id.split('-')[0].toUpperCase()}</td>
                                            <td style={{ padding: '16px 24px' }}>{order.user?.name}</td>
                                            <td style={{ padding: '16px 24px', fontWeight: 700, color: 'var(--primary)' }}>₹{order.totalAmount}</td>
                                            <td style={{ padding: '16px 24px', fontSize: '0.85rem' }}>{new Date(order.orderedAt).toLocaleString()}</td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <span style={{ 
                                                    padding: '6px 12px', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 800,
                                                    background: order.status === 'DELIVERED' ? '#dcfce7' : '#fef9c3',
                                                    color: order.status === 'DELIVERED' ? '#16a34a' : '#a16207'
                                                }}>{order.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
