import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Phone, ArrowRight, Loader2 } from 'lucide-react';

export const Onboarding = () => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const updateProfile = useMutation(api.users.updateProfile);
  const user = useQuery(api.users.currentUser);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ phone });
      navigate('/cadastrar-pet');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (user === undefined) return null;

  return (
    <div className="max-w-md mx-auto px-4 py-24">
      <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm text-center">
        <div className="w-16 h-16 text-teal-500 mx-auto mb-4 bg-teal-50 p-3 rounded-full flex items-center justify-center">
          <Phone className="w-8 h-8" />
        </div>
        <h1 className="font-display text-3xl font-bold text-stone-900 mb-2">Quase lá!</h1>
        <p className="text-stone-500 mb-8">Olá {user?.name}, precisamos do seu WhatsApp para avisar sobre os pedidos e promoções.</p>
        
        <form className="space-y-4 text-left" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-stone-700 mb-1">WhatsApp / Telefone</label>
            <input 
              id="phone" 
              type="tel" 
              required 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500" 
              placeholder="(11) 99999-9999" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading || !phone}
            className="w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                Continuar
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
