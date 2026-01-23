import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuthContext } from './AuthContext';

export interface CartItem {
    packageId: string;
    name: string;
    price: number;
    restaurantName: string;
}

interface ShoppingCartContextType {
    item: CartItem | null;
    addToCart: (item: CartItem) => void;
    removeFromCart: () => void;
    clearCart: () => void;
    checkout: () => Promise<void>;
    isLoading: boolean;
}

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined);

export const ShoppingCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuthContext();
    const [item, setItem] = useState<CartItem | null>(() => {
        try {
            const saved = localStorage.getItem('lsdn_cart');
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('Error loading cart state:', error);
            return null;
        }
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (item) {
            localStorage.setItem('lsdn_cart', JSON.stringify(item));
        } else {
            localStorage.removeItem('lsdn_cart');
        }
    }, [item]);

    // Sync with server if user is logged in
    useEffect(() => {
        const syncCart = async () => {
            if (user) {
                try {
                    const response = await axios.get('/api/cart');
                    if (response.data.data.cart) {
                        const serverItem = response.data.data.cart;
                        setItem({
                            packageId: serverItem.packageId,
                            name: serverItem.package.name,
                            price: serverItem.package.price,
                            restaurantName: serverItem.package.restaurant.name
                        });
                    }
                } catch (error) {
                    console.error('Error syncing cart:', error);
                }
            }
        };
        syncCart();
    }, [user]);

    const addToCart = useCallback(async (newItem: CartItem) => {
        setItem(newItem);
        if (user) {
            try {
                await axios.post('/api/cart', { packageId: newItem.packageId });
            } catch (error) {
                console.error('Error adding to server cart:', error);
            }
        }
    }, [user]);

    const removeFromCart = useCallback(async () => {
        setItem(null);
        if (user) {
            try {
                await axios.delete('/api/cart');
            } catch (error) {
                console.error('Error removing from server cart:', error);
            }
        }
    }, [user]);

    const clearCart = useCallback(() => {
        setItem(null);
        localStorage.removeItem('lsdn_cart');
    }, []);

    const checkout = useCallback(async () => {
        if (!user || !item) return;
        setIsLoading(true);
        try {
            await axios.post('/api/user-packages/purchase');
            clearCart();
        } catch (error) {
            console.error('Checkout failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [user, item, clearCart]);

    return (
        <ShoppingCartContext.Provider value={{
            item, addToCart, removeFromCart, clearCart, checkout, isLoading
        }}>
            {children}
        </ShoppingCartContext.Provider>
    );
};

export const useShoppingCart = () => {
    const context = useContext(ShoppingCartContext);
    if (context === undefined) {
        throw new Error('useShoppingCart must be used within a ShoppingCartProvider');
    }
    return context;
};
