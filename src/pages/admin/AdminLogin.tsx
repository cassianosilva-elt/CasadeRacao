import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Loader2, ArrowRight } from 'lucide-react';
import { useAuthActions } from "@convex-dev/auth/react";
import { motion, AnimatePresence } from 'motion/react';

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
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-teal-50 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-stone-300/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10"
      >
        <div className="inline-flex justify-center items-center w-16 h-16 bg-white shadow-sm border border-stone-100 rounded-2xl mb-6">
          <Lock className="w-8 h-8 text-teal-600" />
        </div>
        <h2 className="text-2xl font-black text-stone-900 mb-2 font-display tracking-tight">
          Acesso Restrito
        </h2>
        <p className="text-sm text-stone-500 mb-8 max-w-xs mx-auto">
          Área exclusiva para a administração da loja.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="sm:mx-auto sm:w-full sm:max-w-[400px] relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl py-8 px-6 sm:px-10 border border-white/50 rounded-3xl shadow-xl shadow-stone-200/50">
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="p-3 bg-red-50 text-red-600 font-medium text-sm rounded-xl border border-red-100/50 text-center flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-bold text-stone-700 uppercase tracking-wider ml-1">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 transition-all placeholder:text-stone-400"
                placeholder="Ex: dono@loja.com"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-bold text-stone-700 uppercase tracking-wider ml-1">
                Senha de Acesso
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 transition-all placeholder:text-stone-400"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-stone-900 hover:bg-teal-600 text-white font-bold text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-teal-500/20 disabled:opacity-70 disabled:hover:bg-stone-900 group mt-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  Entrar no Painel
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <button 
              onClick={() => navigate('/')} 
              className="text-stone-400 hover:text-stone-900 text-xs font-medium transition-colors border-b border-transparent hover:border-stone-200 pb-0.5"
            >
              &larr; Voltar para a loja
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
