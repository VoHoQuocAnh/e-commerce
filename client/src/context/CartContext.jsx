// client/src/context/CartContext.jsx
import { createContext, useState, useEffect, useCallback } from 'react';
import { cartApi } from '../services/cartApi';
import { useAuth } from '../hooks/useAuth';
import { notify } from '../components/feedback/Toast';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], totalQuantity: 0, subtotalAmount: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [], totalQuantity: 0, subtotalAmount: 0 });
      return;
    }
    try {
      setLoading(true);
      const res = await cartApi.getCart();
      setCart(res.data);
    } catch {
      // Ignore silent cart fetch failure
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productVariantId, quantity = 1) => {
    const res = await cartApi.addItem({ productVariantId, quantity });
    setCart(res.data);
    notify.success('Đã thêm vào túi đồ 3D của bạn');
    return res.data;
  };

  const updateQuantity = async (itemId, quantity) => {
    const res = await cartApi.updateItem(itemId, quantity);
    setCart(res.data);
    return res.data;
  };

  const removeFromCart = async (itemId) => {
    const res = await cartApi.removeItem(itemId);
    setCart(res.data);
    notify.info('Đã xóa sản phẩm khỏi giỏ hàng');
    return res.data;
  };

  const clearCart = async () => {
    const res = await cartApi.clearCart();
    setCart(res.data);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
