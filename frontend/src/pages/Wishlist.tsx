import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist: React.FC = () => {
    return (
        <div className="container" style={{ padding: '40px 20px', maxWidth: '1000px', textAlign: 'center' }}>
            <div style={{ marginBottom: '48px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '12px' }}>My Wishlist</h1>
                <p style={{ color: '#64748b' }}>Items you've saved for later.</p>
            </div>

            <div className="glass-card" style={{ padding: '80px 40px', borderRadius: 'var(--radius)' }}>
                <div style={{ 
                    width: '100px', 
                    height: '100px', 
                    background: 'rgba(239, 68, 68, 0.1)', 
                    color: '#ef4444', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    margin: '0 auto 24px'
                }}>
                    <Heart size={48} fill="#ef4444" />
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: '16px' }}>Your wishlist is empty</h2>
                <p style={{ color: '#64748b', maxWidth: '400px', margin: '0 auto 32px', lineHeight: '1.6' }}>
                    Seems like you haven't added anything to your wishlist yet. Explore our store and save your favorite groceries!
                </p>
                <Link to="/" className="btn btn-gradient" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 32px', textDecoration: 'none' }}>
                    <ShoppingBag size={20} />
                    Start Shopping
                </Link>
            </div>

            {/* Placeholder for future implementations */}
            <div style={{ marginTop: '60px', textAlign: 'left' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '20px' }}>Frequently Added to Wishlists</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', opacity: 0.5 }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="glass-card" style={{ height: '240px', borderRadius: 'var(--radius)' }}></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
