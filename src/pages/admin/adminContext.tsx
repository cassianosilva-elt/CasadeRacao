import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

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

const DEFAULT_SEED_PRODUCTS: Omit<Product, 'id'>[] = [
  {
    name: 'Golden PP Filhote Cães Frango, arroz e vegatais',
    brand: 'GOLDEN',
    category: 'Rações para Cães',
    price: 139.99,
    quantity: 20,
    images: ['https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&q=80'],
    rating: 5,
    reviewCount: 0,
  },
  {
    name: 'Golden PP Filhote Cães carne, arroz e vegetais',
    brand: 'GOLDEN',
    category: 'Rações para Cães',
    price: 139.99,
    quantity: 15,
    images: ['https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&q=80'],
    rating: 5,
    reviewCount: 0,
  },
  {
    name: 'Golden Adulto Cães Frango',
    brand: 'GOLDEN',
    category: 'Rações para Cães',
    price: 159.99,
    quantity: 10,
    images: ['https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&q=80'],
    rating: 5,
    reviewCount: 0,
  },
  {
    name: 'Golden Adulto Special Carne Frango Cães',
    brand: 'GOLDEN',
    category: 'Rações para Cães',
    price: 154.99,
    quantity: 12,
    images: ['https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&q=80'],
    rating: 5,
    reviewCount: 0,
  },
];

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const convexProducts = useQuery(api.products.list);
  const addProductMutation = useMutation(api.products.add);
  const updateProductMutation = useMutation(api.products.update);
  const removeProductMutation = useMutation(api.products.remove);
  const updatePriceMutation = useMutation(api.products.updatePrice);
  const decreaseStockMutation = useMutation(api.products.decreaseStock);
  const seedDefaultsMutation = useMutation(api.products.seedDefaults);

  const [hasSeeded, setHasSeeded] = useState(false);

  // Seed default products when database is empty
  useEffect(() => {
    if (convexProducts !== undefined && convexProducts.length === 0 && !hasSeeded) {
      setHasSeeded(true);
      // Check if localStorage has products from user session
      let initialList = DEFAULT_SEED_PRODUCTS;
      const saved = localStorage.getItem('admin_products');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const userCreated = parsed.filter((p: any) => p && isNaN(Number(p.id)));
            if (userCreated.length > 0) {
              initialList = userCreated.map((p: any) => ({
                name: p.name || 'Produto',
                price: Number(p.price) || 0,
                quantity: Number(p.quantity) || 0,
                category: p.category || 'Rações para Cães',
                brand: p.brand || 'GOLDEN',
                images: p.images || (p.image ? [p.image] : []),
                image: p.image || (p.images ? p.images[0] : ''),
                video: p.video,
                description: p.description,
                rating: p.rating || 5,
                reviewCount: p.reviewCount || 0,
                badge: p.badge,
                oldPrice: p.oldPrice
              }));
            }
          }
        } catch (e) {}
      }

      seedDefaultsMutation({ initialProducts: initialList }).catch(err => {
        console.error("Erro ao inicializar produtos no Convex:", err);
      });
    }
  }, [convexProducts, hasSeeded, seedDefaultsMutation]);

  // Format convex products to Product interface
  const products: Product[] = React.useMemo(() => {
    if (!convexProducts) return [];
    return convexProducts.map((p: any) => {
      const images = p.images && p.images.length > 0 ? p.images : (p.image ? [p.image] : []);
      const image = p.image || images[0] || '';
      return {
        ...p,
        id: p._id as string,
        image,
        images,
        rating: p.rating ?? 5,
        reviewCount: p.reviewCount ?? 0,
      };
    });
  }, [convexProducts]);

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('admin_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
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
          return parsed.filter((c: any) => c && !['1', '2'].includes(String(c.id)) && c.code !== 'BEMVINDO10' && c.code !== 'PETLOVER');
        }
      } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('admin_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('admin_coupons', JSON.stringify(coupons));
  }, [coupons]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const images = product.images || ((product as any).image ? [(product as any).image] : []);
    const image = (product as any).image || images[0] || '';
    addProductMutation({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      category: product.category,
      brand: product.brand,
      images: images,
      image: image,
      video: product.video,
      description: product.description,
      rating: product.rating || 5,
      reviewCount: product.reviewCount || 0,
      badge: product.badge,
      oldPrice: product.oldPrice,
    }).catch(err => console.error("Erro ao adicionar produto no Convex:", err));
  };

  const updateProductPrice = (id: string, newPrice: number) => {
    updatePriceMutation({ id: id as Id<"products">, price: newPrice })
      .catch(err => console.error("Erro ao atualizar preço no Convex:", err));
  };

  const updateProduct = (id: string, updatedProduct: Omit<Product, 'id'>) => {
    const images = updatedProduct.images || ((updatedProduct as any).image ? [(updatedProduct as any).image] : []);
    const image = (updatedProduct as any).image || images[0] || '';
    updateProductMutation({
      id: id as Id<"products">,
      name: updatedProduct.name,
      price: updatedProduct.price,
      quantity: updatedProduct.quantity,
      category: updatedProduct.category,
      brand: updatedProduct.brand,
      images: images,
      image: image,
      video: updatedProduct.video,
      description: updatedProduct.description,
      rating: updatedProduct.rating || 5,
      reviewCount: updatedProduct.reviewCount || 0,
      badge: updatedProduct.badge,
      oldPrice: updatedProduct.oldPrice,
    }).catch(err => console.error("Erro ao atualizar produto no Convex:", err));
  };

  const deleteProduct = (id: string) => {
    removeProductMutation({ id: id as Id<"products"> })
      .catch(err => console.error("Erro ao remover produto no Convex:", err));
  };

  const decreaseStock = (id: string, quantityBought: number) => {
    decreaseStockMutation({ id: id as Id<"products">, quantityBought })
      .catch(err => console.error("Erro ao decrementar estoque no Convex:", err));
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
