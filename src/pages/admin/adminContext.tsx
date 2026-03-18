import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as INITIAL_DATA } from '../../data';

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  brand: string;
  images: string[];
  video?: string;
  description?: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  oldPrice?: number;
}

export const CATEGORIES = [
  'Rações para Cães',
  'Rações para Gatos',
  'Acessórios',
  'Brinquedos',
  'Farmácia'
];

export type OrderStatus = 'pending' | 'paid' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  items: string;
  total: number;
  status: OrderStatus;
  date: string;
}

interface AdminContextType {
  products: Product[];
  orders: Order[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProductPrice: (id: string, newPrice: number) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (id: string, newStatus: OrderStatus) => void;
  formatPrice: (price: number) => string;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const MAPPED_INITIAL_PRODUCTS: Product[] = INITIAL_DATA.map(p => ({
  id: String(p.id),
  name: p.name,
  price: p.price,
  quantity: 10, // Default quantity for initial data
  category: p.category,
  brand: p.brand,
  images: [p.image], // Single image to array
  description: p.description,
  rating: p.rating,
  reviewCount: p.reviewCount,
  badge: p.badge,
  oldPrice: p.oldPrice
}));

const INITIAL_ORDERS: Order[] = [
  { id: '101', customerName: 'Dona Maria', customerPhone: '11 98888-7777', customerEmail: 'maria@email.com', items: '2x Ração Golden 15kg', total: 319.80, status: 'paid', date: 'Hoje, 09:30' },
  { id: '102', customerName: 'Seu João', customerPhone: '11 97777-6666', customerEmail: 'joao@email.com', items: '1x Mordedor Osso', total: 29.90, status: 'pending', date: 'Hoje, 10:15' },
  { id: '103', customerName: 'Dona Florinda', customerPhone: '11 96666-5555', customerEmail: 'florinda@email.com', items: '3x Sachê Gatos Goumert', total: 15.00, status: 'preparing', date: 'Hoje, 11:00' },
  { id: '104', customerName: 'Sr. Madruga', customerPhone: '11 95555-4444', customerEmail: 'madruga@email.com', items: '1x Shampoo Pet Care', total: 45.90, status: 'shipped', date: 'Hoje, 11:30' },
];

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('admin_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migração: Garante que todos os produtos tenham o array 'images'
        return parsed.map((p: any) => ({
          ...p,
          images: p.images || (p.image ? [p.image] : [])
        }));
      } catch (e) {
        console.error("Erro ao carregar produtos do localStorage:", e);
        return MAPPED_INITIAL_PRODUCTS;
      }
    }
    return MAPPED_INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('admin_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('admin_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('admin_orders', JSON.stringify(orders));
  }, [orders]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Math.random().toString(36).substr(2, 9) };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProductPrice = (id: string, newPrice: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, price: newPrice } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateOrderStatus = (id: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <AdminContext.Provider value={{ products, orders, addProduct, updateProductPrice, deleteProduct, updateOrderStatus, formatPrice }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin deve ser usado dentro de um AdminProvider');
  return context;
};
