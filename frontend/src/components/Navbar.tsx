import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Store, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
    const { isAuthenticated, logout, user, loading } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();

    const cartCount = cart?.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="logo">
                    <Store size={28} />
                    <span>Kirana</span>
                </Link>

                <div className="nav-links">
                    <Link to="/" className="nav-link">Shop</Link>
                    {user?.role === 'ADMIN' && (
                        <Link to="/admin" className="nav-link">Admin</Link>
                    )}

                    <Link to="/cart" className="nav-link" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <ShoppingCart size={22} />
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                background: 'var(--primary)',
                                color: 'white',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '10px',
                                fontWeight: 700
                            }}>{cartCount}</span>
                        )}
                    </Link>

                    {loading ? (
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', border: '2px solid var(--border)', borderTopColor: 'var(--primary)', animation: 'spin 1s linear infinite' }}></div>
                    ) : isAuthenticated ? (
                        <>
                            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--background)', padding: '6px 12px', borderRadius: '30px', border: '1px solid var(--border)', textDecoration: 'none' }}>
                                <div style={{ width: '28px', height: '28px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--foreground)' }}>{user?.name?.split(' ')[0]}</span>
                            </Link>
                            <button onClick={logout} className="nav-link" style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0', color: '#64748b', marginLeft: '8px' }}>
                                <LogOut size={18} />
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="nav-link btn-gradient" style={{ padding: '8px 20px', borderRadius: '30px', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <User size={18} />
                            <span>Sign In</span>
                        </Link>
                    )}
                </div>
            </div>
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
