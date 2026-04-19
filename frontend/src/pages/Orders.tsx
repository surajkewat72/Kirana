import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { Package, Clock, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

const Orders: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response: any = await api.get('/orders');
                setOrders(response.data);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const toggleOrder = (id: string) => {
        setExpandedOrder(expandedOrder === id ? null : id);
    };

    if (loading) return <div className="container" style={{ padding: '40px', textAlign: 'center' }}>Loading your orders...</div>;

    return (
        <div className="container" style={{ padding: '40px 20px', maxWidth: '900px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '24px' }}>My Orders</h1>
            
            {orders.length === 0 ? (
                <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
                    <span style={{ color: '#cbd5e1', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                        <Package size={64} />
                    </span>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>No orders yet</h2>
                    <p style={{ color: '#64748b', marginTop: '8px' }}>Start shopping to see your orders here!</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {orders.map((order) => (
                        <div key={order.id} className="glass-card" style={{ borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                            <div 
                                onClick={() => toggleOrder(order.id)}
                                style={{ 
                                    padding: '24px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'space-between', 
                                    cursor: 'pointer',
                                    background: expandedOrder === order.id ? 'rgba(0,0,0,0.02)' : 'transparent'
                                }}
                            >
                                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                                    <div style={{ 
                                        width: '48px', 
                                        height: '48px', 
                                        background: 'var(--primary)', 
                                        color: 'white', 
                                        borderRadius: '12px', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center' 
                                    }}>
                                        <Package size={24} />
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Order #{order.id.slice(0, 8)}</h3>
                                            <span style={{ 
                                                padding: '4px 12px', 
                                                background: order.status === 'COMPLETED' ? '#dcfce7' : '#fef9c3', 
                                                color: order.status === 'COMPLETED' ? '#166534' : '#854d0e',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: 700
                                            }}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Clock size={14} /> {new Date(order.orderedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div>
                                        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Total Amount</p>
                                        <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>₹{order.totalAmount}</p>
                                    </div>
                                    {expandedOrder === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                            </div>

                            {expandedOrder === order.id && (
                                <div style={{ padding: '0 24px 24px 24px', borderTop: '1px solid var(--border)' }}>
                                    <div style={{ paddingTop: '20px' }}>
                                        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px' }}>Order Items</h4>
                                        <div style={{ display: 'grid', gap: '10px' }}>
                                            {order.items.map((item: any, idx: number) => (
                                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(0,0,0,0.01)', borderRadius: '8px' }}>
                                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                        <div style={{ width: '40px', height: '40px', background: '#f5f5f5', borderRadius: '4px' }}></div>
                                                        <div>
                                                            <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>Quantity: {item.quantity}</p>
                                                            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Price: ₹{item.priceAtPurchase}</p>
                                                        </div>
                                                    </div>
                                                    <p style={{ fontWeight: 600 }}>₹{item.priceAtPurchase * item.quantity}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
