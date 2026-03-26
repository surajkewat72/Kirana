import React from 'react';
import { Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
    product: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addItem } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        addItem(product.id, 1);
    };

    return (
        <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
            <img 
                src={product.imageUrl || `https://api.dicebear.com/6.x/shapes/svg?seed=${product.name}`} 
                alt={product.name} 
                className="product-image" 
            />
            <div className="product-info">
                <span style={{ fontSize: '0.8rem', color: '#666' }}>{product.category?.name}</span>
                <h3 className="product-title">{product.name}</h3>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '12px' }}>{product.brand}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="product-price">₹{product.salePrice}</span>
                    <button onClick={handleAddToCart} className="btn btn-primary" style={{ padding: '8px' }}>
                        <Plus size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
