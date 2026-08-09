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
  image?: string;
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

export interface Coupon {
  id: string;
  code: string;
  discount: number; // percentage
  expirationDate?: string; // ISO format YYYY-MM-DD
}

interface AdminContextType {
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProductPrice: (id: string, newPrice: number) => void;
  updateProduct: (id: string, product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  decreaseStock: (id: string, quantityBought: number) => void;
  updateOrderStatus: (id: string, newStatus: OrderStatus) => void;
  formatPrice: (price: number) => string;
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  deleteCoupon: (id: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const MAPPED_INITIAL_PRODUCTS: Product[] = [];
const INITIAL_ORDERS: Order[] = [];
const INITIAL_COUPONS: Coupon[] = [];

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('admin_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Remove mock products (products with numeric string IDs 1-32 or Royal Canin, etc.)
          const userCreated = parsed.filter((p: any) => p && isNaN(Number(p.id)));
          return userCreated.map((p: any) => {
            const images = p.images || (p.image ? [p.image] : []);
            const image = p.image || images[0] || '';
            return {
              ...p,
              image,
              images
            };
          });
        }
      } catch (e) {
        console.error("Erro ao carregar produtos do localStorage:", e);
      }
    }
    return [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('admin_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Remove initial mock orders ('101', '102', '103', '104')
          return parsed.filter((o: any) => o && !['101', '102', '103', '104'].includes(String(o.id)));
        }
      } catch (e) {}
    }
    return [];
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('admin_coupons');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Remove initial mock coupons ('BEMVINDO10', 'PETLOVER')
          return parsed.filter((c: any) => c && !['1', '2'].includes(String(c.id)) && c.code !== 'BEMVINDO10' && c.code !== 'PETLOVER');
        }
      } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('admin_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('admin_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('admin_coupons', JSON.stringify(coupons));
  }, [coupons]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const images = product.images || ((product as any).image ? [(product as any).image] : []);
    const image = (product as any).image || images[0] || '';
    const newProduct = { ...product, image, images, id: Math.random().toString(36).substr(2, 9) };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProductPrice = (id: string, newPrice: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, price: newPrice } : p));
  };

  const updateProduct = (id: string, updatedProduct: Omit<Product, 'id'>) => {
    const images = updatedProduct.images || ((updatedProduct as any).image ? [(updatedProduct as any).image] : []);
    const image = (updatedProduct as any).image || images[0] || '';
    setProducts(prev => prev.map(p => p.id === id ? { ...updatedProduct, image, images, id } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const decreaseStock = (id: string, quantityBought: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const newQty = Math.max(0, (p.quantity || 0) - quantityBought);
        return { ...p, quantity: newQty };
      }
      return p;
    }));
  };

  const updateOrderStatus = (id: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const addCoupon = (coupon: Omit<Coupon, 'id'>) => {
    const newCoupon = { ...coupon, id: Math.random().toString(36).substr(2, 9) };
    setCoupons(prev => [newCoupon, ...prev]);
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  return (
    <AdminContext.Provider value={{
      products,
      orders,
      coupons,
      addProduct,
      updateProductPrice,
      updateProduct,
      deleteProduct,
      decreaseStock,
      updateOrderStatus,
      formatPrice,
      addCoupon,
      deleteCoupon
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin deve ser usado dentro de um AdminProvider');
  return context;
};
