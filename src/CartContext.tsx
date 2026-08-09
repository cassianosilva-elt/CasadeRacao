import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from './data';
import { useToast } from './ToastContext';

export interface CartItem extends Product {
  quantity: number;
  isSubscription?: boolean;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: any, isSubscription?: boolean) => void;
  removeFromCart: (id: number | string) => void;
  updateQuantity: (id: number | string, quantity: number) => void;
  total: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

const DEFAULT_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400';

const normalizeCartItem = (item: any): CartItem => {
  const image = item.image || (item.images && item.images.length > 0 ? item.images[0] : '') || DEFAULT_PRODUCT_IMAGE;
  const images = item.images && item.images.length > 0 ? item.images : [image];
  const price = typeof item.price === 'number' ? item.price : 0;
  const priceFormatted = item.priceFormatted || price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return {
    ...item,
    image,
    images,
    price,
    priceFormatted,
    quantity: item.quantity || 1,
  };
};

export const CartProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart_items');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map(normalizeCartItem);
        }
      } catch (e) {
        console.error("Erro ao carregar itens do carrinho:", e);
      }
    }
    return [];
  });

  const { addToast } = useToast();

  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: any, isSubscription = false) => {
    const normalized = normalizeCartItem(product);
    setItems(prev => {
      const existing = prev.find(item => String(item.id) === String(product.id) && item.isSubscription === isSubscription);
      if (existing) {
        return prev.map(item => (String(item.id) === String(product.id) && item.isSubscription === isSubscription) 
          ? { ...item, ...normalized, quantity: item.quantity + 1 } 
          : item
        );
      }
      return [...prev, { ...normalized, isSubscription }];
    });
    addToast(`${product.name} adicionado ao carrinho!`, 'success');
  };

  const removeFromCart = (id: number | string) => setItems(prev => prev.filter(item => String(item.id) !== String(id)));
  
  const updateQuantity = (id: number | string, quantity: number) => {
    if (quantity < 1) return removeFromCart(id);
    setItems(prev => prev.map(item => String(item.id) === String(id) ? { ...item, quantity } : item));
  };
  
  const clearCart = () => setItems([]);

  // Calculate total: subscription items use the fixed monthly plan price of R$ 180,00
  const total = items.reduce((acc, item) => {
    const itemPrice = item.isSubscription ? 180 : item.price;
    return acc + itemPrice * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, total, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
