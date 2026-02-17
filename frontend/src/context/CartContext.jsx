import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { cartApi } from '../api/client';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [localCart, setLocalCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await cartApi.get();
      setCart(data);
    } catch {
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchCart();
    else setCart({ items: [] });
  }, [user, fetchCart]);

  const cartCount = user
    ? (cart.items || []).reduce((sum, i) => sum + (i.quantity || 0), 0)
    : localCart.reduce((sum, i) => sum + i.quantity, 0);

  const addToCart = async (productId, quantity = 1, size) => {
    if (!user) {
      setLocalCart((prev) => {
        const existing = prev.find((i) => i.productId === productId && i.size === size);
        if (existing) {
          return prev.map((i) =>
            i.productId === productId && i.size === size
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        }
        return [...prev, { productId, quantity, size, product: { _id: productId } }];
      });
      return;
    }
    await cartApi.addItem({ productId, quantity, size });
    await fetchCart();
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!user) {
      setLocalCart((prev) =>
        prev.map((i) =>
          `${i.productId}-${i.size}` === itemId ? { ...i, quantity: Math.max(1, quantity) } : i
        )
      );
      return;
    }
    await cartApi.updateItem(itemId, { quantity });
    await fetchCart();
  };

  const removeFromCart = async (itemId) => {
    if (!user) {
      setLocalCart((prev) => prev.filter((i) => `${i.productId}-${i.size}` !== itemId));
      return;
    }
    await cartApi.removeItem(itemId);
    await fetchCart();
  };

  const clearCart = async () => {
    if (!user) {
      setLocalCart([]);
      return;
    }
    await cartApi.clear();
    await fetchCart();
  };

  const getCartItems = () => {
    if (user) return cart.items || [];
    return localCart;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
        getCartItems,
        localCart,
        setLocalCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider');
  return ctx;
}
