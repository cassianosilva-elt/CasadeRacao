import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Loader2, ArrowRight } from 'lucide-react';
import { useAuthActions } from "@convex-dev/auth/react";

export const AdminLogin = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuthActions();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.append("flow", "signIn"); // Admin só faz login, não cria conta por aqui
    
    try {
      await signIn("password", formData);
      // O AdminGuard cuidará de verificar se é admin e redirecionar
      navigate('/admin');
    } catch (err) {
      console.error(err);
      setError("Email ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Lock className="w-20 h-20 text-teal-600 mx-auto mb-6 bg-teal-100 p-4 rounded-full" />
        <h2 className="text-4xl font-black text-stone-900 mb-2 font-display uppercase tracking-tight">
          Acesso Restrito
        </h2>
        <p className="text-xl text-stone-500 mb-8">
          Área exclusiva para administradores da loja.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-8 border-4 border-stone-200 rounded-[40px] shadow-sm">
          {error && (
             <div className="mb-8 p-4 bg-red-100 text-red-700 font-bold text-lg rounded-2xl text-center border-2 border-red-200">
               {error}
             </div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xl font-bold text-stone-700 mb-2">
                Qual o seu e-mail?
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full border-4 border-stone-200 rounded-2xl px-6 py-4 text-xl focus:outline-none focus:border-teal-500 transition-colors"
                placeholder="Ex: dono@loja.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xl font-bold text-stone-700 mb-2">
                Sua Senha Mestra
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full border-4 border-stone-200 rounded-2xl px-6 py-4 text-xl focus:outline-none focus:border-teal-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black text-2xl py-6 rounded-2xl transition-all flex items-center justify-center gap-4 disabled:opacity-70 shadow-lg"
            >
              {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : (
                <>
                  ACESSAR PAINEL
                  <ArrowRight className="w-8 h-8" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <button 
              onClick={() => navigate('/')} 
              className="text-stone-400 hover:text-stone-600 font-bold underline"
            >
              Voltar para o site normal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
