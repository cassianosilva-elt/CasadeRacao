import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Home, LogOut } from 'lucide-react';
import { useAuthActions } from "@convex-dev/auth/react";
import { AdminProvider } from './adminContext';
import './admin.css';

export const AdminLayout = () => {
  const navigate = useNavigate();
  const { signOut } = useAuthActions();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <AdminProvider>
      <div className="admin-body min-h-screen flex flex-col">
        {/* Navbar Superior - Extremamente Simples */}
        <nav className="bg-white border-b-8 border-teal-500 py-6 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/admin" className="flex items-center gap-3">
              <span className="font-display font-black text-3xl tracking-tighter text-stone-900 uppercase">
                LOPES <span className="text-orange-500">ADMIN</span>
              </span>
            </Link>

            <div className="flex gap-6 items-center">
              <Link 
                to="/admin" 
                className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 px-6 py-3 rounded-2xl font-bold text-xl transition-colors"
                aria-label="Voltar para o Início"
              >
                <Home className="w-8 h-8 text-teal-600" />
                <span>Início</span>
              </Link>

              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-stone-400 hover:text-red-500 font-bold text-xl transition-colors"
                aria-label="Sair do painel"
              >
                <LogOut className="w-8 h-8" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Conteúdo Principal */}
        <main className="flex-grow p-4 sm:p-12 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </AdminProvider>
  );
};
