'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiAuth } from '@/lib/api';

interface CartContextType {
  cartItemCount: number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  cartItemCount: 0,
  refreshCart: async () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItemCount, setCartItemCount] = useState(0);

  const refreshCart = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setCartItemCount(0);
        return;
      }
      const res = await apiAuth.withToken(token).get('/shop/cart');
      const items = res.data?.data?.items || [];
      const count = items.reduce((acc: number, item: any) => acc + item.quantity, 0);
      setCartItemCount(count);
    } catch (err) {
      console.error('Failed to refresh cart count', err);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider value={{ cartItemCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
