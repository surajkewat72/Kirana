import React, { useState, useEffect } from 'react';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import { Search } from 'lucide-react';

const Home: React.FC = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response: any = await api.get('/products', {
                params: { search }
            });
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delaySearch = setTimeout(fetchProducts, 500);
        return () => clearTimeout(delaySearch);
    }, [search]);

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Daily Groceries</h1>
                    <p style={{ color: '#666' }}>Fresh products delivered to your doorstep.</p>
                </div>
                
                <div style={{ position: 'relative', width: '300px' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
                        <Search size={20} color="#999" />
                    </span>
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        className="input" 
                        style={{ paddingLeft: '40px' }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px' }}>Loading products...</div>
            ) : products.length > 0 ? (
                <div className="product-grid">
                    {products.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '100px', color: '#666' }}>
                    No products found matching your search.
                </div>
            )}
        </div>
    );
};

export default Home;
