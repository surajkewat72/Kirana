import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
    const { cart, removeItem } = useCart();
    const navigate = useNavigate();

    const subtotal = cart?.items?.reduce((acc: number, item: any) => 
        acc + (item.product.salePrice * item.quantity), 0) || 0;

    if (!cart || cart.items.length === 0) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
                <ShoppingBag size={64} style={{ color: '#ccc', marginBottom: '20px' }} />
                <h2>Your cart is empty</h2>
                <p style={{ color: '#666', marginBottom: '32px' }}>Looks like you haven't added anything yet.</p>
                <button onClick={() => navigate('/')} className="btn btn-primary">Start Shopping</button>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <h1 style={{ marginBottom: '32px' }}>Shopping Cart</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {cart.items.map((item: any) => (
                        <div key={item.id} style={{ 
                            display: 'flex', 
                            gap: '20px', 
                            padding: '20px', 
                            background: 'white', 
                            borderRadius: '12px',
                            border: '1px solid var(--border)',
                            alignItems: 'center'
                        }}>
                            <img 
                                src={`https://api.dicebear.com/6.x/shapes/svg?seed=\${item.product.name}`} 
                                style={{ width: '80px', height: '80px', borderRadius: '8px', background: '#f5f5f5' }}
                                alt={item.product.name}
                            />
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{item.product.name}</h3>
                                <p style={{ color: '#666', fontSize: '0.9rem' }}>₹{item.product.salePrice} x {item.quantity}</p>
                            </div>
                            <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>
                                ₹{item.product.salePrice * item.quantity}
                            </div>
                            <button 
                                onClick={() => removeItem(item.productId)}
                                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ff4444', padding: '8px' }}
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>

                <div style={{ 
                    background: 'white', 
                    padding: '32px', 
                    borderRadius: '12px', 
                    border: '1px solid var(--border)',
                    height: 'fit-content'
                }}>
                    <h2 style={{ marginBottom: '24px', fontSize: '1.3rem' }}>Order Summary</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span>Delivery</span>
                        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>FREE</span>
                    </div>
                    <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '20px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontWeight: 700, fontSize: '1.2rem' }}>
                        <span>Total</span>
                        <span>₹{subtotal}</span>
                    </div>
                    <button 
                        onClick={() => navigate('/checkout')}
                        className="btn btn-primary" 
                        style={{ width: '100%', padding: '15px' }}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
