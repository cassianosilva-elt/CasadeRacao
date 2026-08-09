import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './CartContext';
import { FavoritesProvider } from './FavoritesContext';
import { ToastProvider } from './ToastContext';
import Layout from './Layout';
import Home from './Home';
import { NotFoundPage } from './components/NotFoundPage';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy load rotas
const ProductDetails = lazy(() => import('./Pages').then(module => ({ default: module.ProductDetails })));
const Cart = lazy(() => import('./Pages').then(module => ({ default: module.Cart })));
const Account = lazy(() => import('./Pages').then(module => ({ default: module.Account })));
const Onboarding = lazy(() => import('./pages/Onboarding').then(m => ({ default: m.Onboarding })));
const RegisterPet = lazy(() => import('./Pages').then(module => ({ default: module.RegisterPet })));
const Dashboard = lazy(() => import('./Pages').then(module => ({ default: module.Dashboard })));
const About = lazy(() => import('./Pages').then(module => ({ default: module.About })));
const Delivery = lazy(() => import('./Pages').then(module => ({ default: module.Delivery })));
const Returns = lazy(() => import('./Pages').then(module => ({ default: module.Returns })));
const Blog = lazy(() => import('./Pages').then(module => ({ default: module.Blog })));
const BlogPost = lazy(() => import('./Pages').then(module => ({ default: module.BlogPost })));
const FAQ = lazy(() => import('./Pages').then(module => ({ default: module.FAQ })));
const Favorites = lazy(() => import('./Pages').then(module => ({ default: module.Favorites })));
const Checkout = lazy(() => import('./Pages').then(module => ({ default: module.Checkout })));
const Orders = lazy(() => import('./pages/admin/AdminOrders').then(m => ({ default: m.AdminOrders })));
const Offers = lazy(() => import('./pages/Offers').then(m => ({ default: m.Offers })));
const Compare = lazy(() => import('./pages/Compare').then(m => ({ default: m.Compare })));
const Community = lazy(() => import('./pages/Community').then(m => ({ default: m.Community })));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers').then(m => ({ default: m.AdminUsers })));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews').then(m => ({ default: m.AdminReviews })));
const AdminSubscriptions = lazy(() => import('./pages/admin/AdminSubscriptions').then(m => ({ default: m.AdminSubscriptions })));

import {
  AdminLayout,
  AdminHome,
  AdminAddProduct,
  AdminProducts,
  // AdminOrders, // This is now lazy loaded as 'Orders'
  AdminCoupons,
  AdminLogin,
  AdminGuard
} from './Pages';

import { AdminProvider } from './pages/admin/adminContext';

export default function App() {
  return (
    <ToastProvider>
      <AdminProvider>
        <FavoritesProvider>
          <CartProvider>
            <BrowserRouter>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-teal-500 font-bold">Carregando...</div>}>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="produto/:id" element={<ProductDetails />} />
                    <Route path="carrinho" element={<Cart />} />
                    <Route path="faq" element={<FAQ />} />
                    <Route path="/conta" element={<Account />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/ofertas" element={<Offers />} />
                    <Route path="/comparar" element={<Compare />} />
                    <Route path="/comunidade" element={<Community />} />
                    <Route path="cadastrar-pet" element={<RegisterPet />} />
                    <Route path="favoritos" element={<Favorites />} />
                    <Route path="checkout" element={<Checkout />} />
                    <Route path="painel" element={<Dashboard />} />
                    <Route path="sobre" element={<About />} />
                    <Route path="entrega" element={<Delivery />} />
                    <Route path="trocas" element={<Returns />} />
                    <Route path="blog" element={<Blog />} />
                    <Route path="blog/:id" element={<BlogPost />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>

                  {/* Tela de Login Admin (Desprotegida) */}
                  <Route path="/admin/entrar" element={<AdminLogin />} />

                  {/* Painel Administrativo com Layout Separado e Proteção Guard */}
                  <Route path="/admin" element={<ErrorBoundary><AdminGuard /></ErrorBoundary>}>
                    <Route element={<AdminLayout />}>
                      <Route index element={<AdminHome />} />
                      <Route path="novo-produto" element={<AdminAddProduct />} />
                      <Route path="editar-produto/:id" element={<AdminAddProduct />} />
                      <Route path="meus-produtos" element={<AdminProducts />} />
                      <Route path="vendas" element={<Orders />} />
                      <Route path="cupons" element={<AdminCoupons />} />
                      <Route path="usuarios" element={<AdminUsers />} />
                      <Route path="avaliacoes" element={<AdminReviews />} />
                      <Route path="assinaturas" element={<AdminSubscriptions />} />
                    </Route>
                  </Route>
                </Routes>
              </Suspense>
            </BrowserRouter>
          </CartProvider>
        </FavoritesProvider>
      </AdminProvider>
    </ToastProvider>
  );
}
