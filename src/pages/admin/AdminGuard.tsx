import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ShieldAlert, Loader2 } from 'lucide-react';

export const AdminGuard = () => {
  const user = useQuery(api.users.currentUser);
  
  // Como `user` pode ser undefined (carregando), null (não logado) ou objeto (logado)
  if (user === undefined) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-16 h-16 text-teal-600 animate-spin mb-4" />
        <h2 className="text-2xl font-bold text-stone-600">Verificando acesso...</h2>
      </div>
    );
  }

  // Se não tem usuário logado, vai pra tela de login de admin (não a de cliente!)
  if (user === null) {
    return <Navigate to="/admin/entrar" replace />;
  }

  // Se tá logado mas não é admin
  if (user.isAdmin !== true) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="bg-red-50 border-4 border-red-200 rounded-[40px] p-12 max-w-2xl text-center space-y-6">
          <ShieldAlert className="w-24 h-24 text-red-500 mx-auto" />
          <h1 className="text-4xl font-black text-red-700 uppercase">Acesso Negado</h1>
          <p className="text-2xl text-red-900 font-medium">
            Sua conta (<span className="font-bold">{user.email}</span>) não tem permissão para acessar o Painel da Loja.
          </p>
          <div className="pt-8">
            <a 
              href="/"
              className="inline-block bg-stone-900 text-white font-bold text-2xl px-12 py-6 rounded-2xl hover:bg-stone-800 transition-colors"
            >
              Voltar para a Loja
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Se é admin, renderiza o painel
  return <Outlet />;
};
