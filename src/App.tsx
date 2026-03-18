import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './CartContext';
import { FavoritesProvider } from './FavoritesContext';
import { ToastProvider } from './ToastContext';
import Layout from './Layout';
import Home from './Home';
import { NotFoundPage } from './components/NotFoundPage';

// Lazy load rotas
const ProductDetails = lazy(() => import('./Pages').then(module => ({ default: module.ProductDetails })));
const Cart = lazy(() => import('./Pages').then(module => ({ default: module.Cart })));
const Account = lazy(() => import('./Pages').then(module => ({ default: module.Account })));
const Onboarding = lazy(() => import('./Pages').then(module => ({ default: module.Onboarding })));
const RegisterPet = lazy(() => import('./Pages').then(module => ({ default: module.RegisterPet })));
const Dashboard = lazy(() => import('./Pages').then(module => ({ default: module.Dashboard })));
const About = lazy(() => import('./Pages').then(module => ({ default: module.About })));
const Delivery = lazy(() => import('./Pages').then(module => ({ default: module.Delivery })));
const Returns = lazy(() => import('./Pages').then(module => ({ default: module.Returns })));
const Blog = lazy(() => import('./Pages').then(module => ({ default: module.Blog })));
const FAQ = lazy(() => import('./Pages').then(module => ({ default: module.FAQ })));
const Favorites = lazy(() => import('./Pages').then(module => ({ default: module.Favorites })));
const Checkout = lazy(() => import('./Pages').then(module => ({ default: module.Checkout })));

import {
  AdminLayout,
  AdminHome,
  AdminAddProduct,
  AdminProducts,
  AdminOrders,
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
                    <Route path="conta" element={<Account />} />
                    <Route path="onboarding" element={<Onboarding />} />
                    <Route path="cadastrar-pet" element={<RegisterPet />} />
                    <Route path="favoritos" element={<Favorites />} />
                    <Route path="checkout" element={<Checkout />} />
                    <Route path="painel" element={<Dashboard />} />
                    <Route path="sobre" element={<About />} />
                    <Route path="entrega" element={<Delivery />} />
                    <Route path="trocas" element={<Returns />} />
                    <Route path="blog" element={<Blog />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>

                  {/* Tela de Login Admin (Desprotegida) */}
                  <Route path="/admin/entrar" element={<AdminLogin />} />

                  {/* Painel Administrativo com Layout Separado e Proteção Guard */}
                  <Route path="/admin" element={<AdminGuard />}>
                    <Route element={<AdminLayout />}>
                      <Route index element={<AdminHome />} />
                      <Route path="novo-produto" element={<AdminAddProduct />} />
                      <Route path="editar-produto/:id" element={<AdminAddProduct />} />
                      <Route path="meus-produtos" element={<AdminProducts />} />
                      <Route path="vendas" element={<AdminOrders />} />
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
