import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { CheckCircle } from 'lucide-react';

const Checkout: React.FC = () => {
    const { cart, refreshCart } = useCart();
    const [method, setMethod] = useState('UPI');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const subtotal = cart?.items?.reduce((acc: number, item: any) => 
        acc + (item.product.salePrice * item.quantity), 0) || 0;

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            await api.post('/orders', {
                cartItems: cart.items.map((i: any) => ({ 
                    id: i.productId, 
                    quantity: i.quantity, 
                    price: i.product.salePrice 
                })),
                paymentMethod: method
            });
            await refreshCart();
            setSuccess(true);
            setTimeout(() => navigate('/'), 3000);
        } catch (error) {
            console.error('Checkout failed', error);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
                <CheckCircle size={80} style={{ color: 'var(--primary)', marginBottom: '24px' }} />
                <h1 style={{ marginBottom: '16px' }}>Order Placed!</h1>
                <p style={{ color: '#666' }}>Thank you for shopping with Kirana. Redirecting to home...</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ maxWidth: '600px', padding: '40px 20px' }}>
            <h1 style={{ marginBottom: '32px', textAlign: 'center' }}>Checkout</h1>
            
            <div style={{ background: 'white', padding: '40px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '24px' }}>Payment Method</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                    {['UPI', 'CARD', 'CASH'].map((m) => (
                        <label key={m} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px', 
                            padding: '16px', 
                            border: '1px solid var(--border)', 
                            borderRadius: '8px',
                            cursor: 'pointer',
                            background: method === m ? 'rgba(34, 197, 94, 0.05)' : 'transparent',
                            borderColor: method === m ? 'var(--primary)' : 'var(--border)'
                        }}>
                            <input 
                                type="radio" 
                                name="payment" 
                                checked={method === m} 
                                onChange={() => setMethod(m)} 
                            />
                            <span style={{ fontWeight: 600 }}>{m}</span>
                        </label>
                    ))}
                </div>

                <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '8px', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 700 }}>
                        <span>Final Amount</span>
                        <span>₹{subtotal}</span>
                    </div>
                </div>

                <button 
                    onClick={handlePlaceOrder}
                    className="btn btn-primary" 
                    style={{ width: '100%', padding: '15px' }}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Confirm Order'}
                </button>
            </div>
        </div>
    );
};

export default Checkout;
