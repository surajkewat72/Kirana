import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';

interface CartContextType {
    cart: any;
    addItem: (productId: string, quantity: number) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [cart, setCart] = useState<any>(null);

    const refreshCart = async () => {
        if (isAuthenticated) {
            try {
                const response: any = await api.get('/cart');
                setCart(response.data);
            } catch (error) {
                console.error('Failed to fetch cart', error);
            }
        }
    };

    useEffect(() => {
        refreshCart();
    }, [isAuthenticated]);

    const addItem = async (productId: string, quantity: number) => {
        await api.post('/cart/items', { productId, quantity });
        await refreshCart();
    };

    const removeItem = async (productId: string) => {
        await api.delete(`/cart/items/${productId}`);
        await refreshCart();
    };

    return (
        <CartContext.Provider value={{ cart, addItem, removeItem, refreshCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within CartProvider');
    return context;
};
