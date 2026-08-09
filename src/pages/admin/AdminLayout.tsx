import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, LogOut, Package, ShoppingBag, PlusCircle, Users, Star, Repeat, Ticket, Tag } from 'lucide-react';
import { useAuthActions } from "@convex-dev/auth/react";
import { motion } from 'motion/react';
import { AdminProvider } from './adminContext';
import './admin.css';

export const AdminLayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { signOut } = useAuthActions();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = [
    { name: 'Início', path: '/admin', icon: Home },
    { name: 'Produtos', path: '/admin/meus-produtos', icon: Package },
    { name: 'Vendas', path: '/admin/vendas', icon: ShoppingBag },
    { name: 'Usuários', path: '/admin/usuarios', icon: Users },
    { name: 'Avaliações', path: '/admin/avaliacoes', icon: Star },
    { name: 'Assinaturas', path: '/admin/assinaturas', icon: Repeat },
    { name: 'Cupons', path: '/admin/cupons', icon: Ticket },
    { name: 'Ofertas', path: '/admin/ofertas', icon: Tag },
  ];

  return (
    <div className="admin-body min-h-[100dvh] flex flex-col font-sans">
      <header className={`sticky top-0 z-40 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-2' : 'bg-white py-4 border-b border-stone-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link to="/admin" className="flex items-center gap-2 group shrink-0">
               <img src="/logo.png" alt="Casa de Ração LOPES" className="h-8 w-auto object-contain" />
               <span className="font-display text-lg font-black tracking-tighter text-orange-500 uppercase">
                 ADMIN
               </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.path || (link.path !== '/admin' && pathname.startsWith(link.path));
                return (
                  <Link 
                    key={link.name} 
                    to={link.path} 
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${isActive ? 'bg-teal-50 text-teal-600' : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'}`}
                  >
                    <link.icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-stone-400'}`} />
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-4">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-stone-400 hover:text-red-500 font-bold text-sm px-4 py-2 rounded-xl transition-colors hover:bg-red-50"
                aria-label="Sair do painel"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-grow p-4 sm:p-8 max-w-7xl mx-auto w-full">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};
