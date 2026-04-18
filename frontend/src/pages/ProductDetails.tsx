import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Star, ShieldCheck, Truck, RefreshCcw } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const ProductDetails: React.FC = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    
    const { isAuthenticated } = useAuth();
    const { addItem } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response: any = await api.get(`/products/${id}`);
                setProduct(response.data);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch product');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        addItem(product.id, quantity);
    };

    if (loading) return (
        <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
            <p style={{ marginTop: '20px', color: '#64748b' }}>Loading product details...</p>
        </div>
    );

    if (error || !product) return (
        <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
            <h2 style={{ color: '#dc2626' }}>{error || 'Product not found'}</h2>
            <button onClick={() => navigate('/')} className="btn btn-outline" style={{ marginTop: '20px' }}>Back to Home</button>
        </div>
    );

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <button 
                onClick={() => navigate(-1)} 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', marginBottom: '40px', fontWeight: 600 }}
            >
                <ArrowLeft size={20} />
                Back to Results
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card"
                    style={{ borderRadius: '32px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
                >
                    <img 
                        src={product.imageUrl || `https://api.dicebear.com/6.x/shapes/svg?seed=${product.name}`} 
                        alt={product.name} 
                        style={{ width: '100%', height: 'auto', borderRadius: '24px', objectFit: 'contain', maxHeight: '500px' }}
                    />
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 600, marginBottom: '12px' }}>
                        <span style={{ textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>{product.category?.name}</span>
                        <span style={{ color: '#cbd5e1' }}>•</span>
                        <span style={{ textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>{product.brand}</span>
                    </div>

                    <h1 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '16px', lineHeight: 1.1 }}>{product.name}</h1>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fef9c3', color: '#a16207', padding: '4px 10px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 700 }}>
                            <Star size={16} fill="currentColor" />
                            {product.rating || '4.5'}
                        </div>
                        <span style={{ color: '#64748b', fontSize: '0.9rem' }}>1,240+ Verified Reviews</span>
                    </div>

                    <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.6, marginBottom: '32px' }}>
                        {product.description || `Experience the finest quality ${product.name} from ${product.brand}. Handpicked and carefully processed to ensure you get only the best. Perfect for your daily needs.`}
                    </p>

                    <div style={{ padding: '32px', background: 'var(--background)', borderRadius: '24px', border: '1px solid var(--border)', marginBottom: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '24px' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>₹{product.salePrice}</span>
                            {product.marketPrice && (
                                <span style={{ fontSize: '1.2rem', color: '#94a3b8', textDecoration: 'line-through' }}>₹{product.marketPrice}</span>
                            )}
                            {product.marketPrice && (
                                <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.9rem', background: '#dcfce7', padding: '4px 10px', borderRadius: '30px' }}>
                                    {Math.round(((product.marketPrice - product.salePrice) / product.marketPrice) * 100)}% OFF
                                </span>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', background: 'white', border: '1px solid var(--border)', borderRadius: '30px', padding: '4px' }}>
                                <button 
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    style={{ width: '40px', height: '40px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 700 }}
                                >-</button>
                                <span style={{ width: '40px', textAlign: 'center', fontWeight: 700 }}>{quantity}</span>
                                <button 
                                    onClick={() => setQuantity(q => q + 1)}
                                    style={{ width: '40px', height: '40px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 700 }}
                                >+</button>
                            </div>
                            <button 
                                onClick={handleAddToCart}
                                className="btn btn-gradient" 
                                style={{ flex: 1, height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.1rem', borderRadius: '30px' }}
                            >
                                <ShoppingCart size={22} />
                                Add to Cart
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', background: '#f0f9ff', color: '#0ea5e9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Truck size={20} />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Free Delivery</h4>
                                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>For orders above ₹500</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', background: '#f0fdf4', color: '#10b981', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <RefreshCcw size={20} />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Easy Returns</h4>
                                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>7-day replacement policy</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
            
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default ProductDetails;
