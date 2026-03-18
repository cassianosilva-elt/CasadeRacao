import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { products } from '../data';
import { useCart } from '../CartContext';
import { useFavorites } from '../FavoritesContext';
import { User, Heart, LogOut, Loader2, ArrowRight } from 'lucide-react';
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export const Account = () => {
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signOut } = useAuthActions();
  const navigate = useNavigate();

  const user = useQuery(api.users.currentUser);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { addToCart } = useCart();
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  useEffect(() => {
    if (user) {
      if (!user.onboardingComplete) {
        navigate('/onboarding');
      } else {
        navigate('/painel');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
    } catch (err) {
      console.error(err);
      setError("Falha na autenticação. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  if (user === undefined) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-24">
      <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm text-center">
        <User className="w-16 h-16 text-teal-500 mx-auto mb-4 bg-teal-50 p-3 rounded-full" />
        <h1 className="font-display text-3xl font-bold text-stone-900 mb-2">
          {flow === "signIn" ? "Minha Conta" : "Criar Conta"}
        </h1>
        <p className="text-stone-500 mb-8">
          {flow === "signIn"
            ? "Faça login para acompanhar seus pedidos e salvar seus favoritos."
            : "Cadastre-se para aproveitar todos os benefícios e cuidar do seu pet."}
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <form className="space-y-4 text-left" onSubmit={handleSubmit}>
          {flow === "signUp" && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">Nome Completo</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Seu nome"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-stone-700 mb-1">Telefone</label>
            <input
              id="phone"
              name="phone"
              type="text"
              required
              className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="11999999999"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="••••••••"
            />
          </div>
          <input name="flow" type="hidden" value={flow} />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                {flow === "signIn" ? "Entrar" : "Cadastrar"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-sm text-stone-500">
          {flow === "signIn" ? (
            <>Não tem uma conta? <button onClick={() => setFlow("signUp")} className="text-teal-500 font-medium hover:underline">Cadastre-se</button></>
          ) : (
            <>Já tem uma conta? <button onClick={() => setFlow("signIn")} className="text-teal-500 font-medium hover:underline">Faça login</button></>
          )}
        </p>
      </div>
    </div>
  );
};
