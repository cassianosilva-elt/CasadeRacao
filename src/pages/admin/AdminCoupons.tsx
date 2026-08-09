import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ticket, Plus, Trash2, ArrowLeft, Tag, Percent } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from './adminContext';

export const AdminCoupons = () => {
  const navigate = useNavigate();
  const { coupons, addCoupon, deleteCoupon } = useAdmin();
  const [isAdding, setIsAdding] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('');
  const [newExpiration, setNewExpiration] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCode && newDiscount) {
      addCoupon({
        code: newCode.toUpperCase(),
        discount: Number(newDiscount),
        expirationDate: newExpiration || undefined
      });
      setNewCode('');
      setNewDiscount('');
      setNewExpiration('');
      setIsAdding(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin')}
            className="p-3 bg-stone-100 rounded-2xl hover:bg-stone-200 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-stone-600" />
          </button>
          <div>
            <h1 className="text-3xl font-display font-black text-stone-900 tracking-tight">Cupons de Desconto</h1>
            <p className="text-stone-500 font-medium">Crie e gerencie promoções para seus clientes.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-xl shadow-teal-500/20 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Novo Cupom
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white p-8 rounded-[40px] border border-stone-100 shadow-xl mb-8">
              <h2 className="text-xl font-bold text-stone-900 mb-6">Configurar Novo Cupom</h2>
              <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-widest pl-1">Código</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300" />
                    <input 
                      type="text" 
                      placeholder="EX: PET10"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-4 pl-12 text-sm focus:ring-2 focus:ring-teal-500 outline-none font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-widest pl-1">Desconto (%)</label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300" />
                    <input 
                      type="number" 
                      placeholder="10"
                      value={newDiscount}
                      onChange={(e) => setNewDiscount(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-4 pl-12 text-sm focus:ring-2 focus:ring-teal-500 outline-none font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-widest pl-1">Expira em (Opcional)</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      value={newExpiration}
                      onChange={(e) => setNewExpiration(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-teal-500 outline-none font-bold"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <button 
                    type="submit"
                    disabled={!newCode || !newDiscount}
                    className="w-full bg-stone-900 text-white font-bold py-4 rounded-2xl hover:bg-stone-800 transition-all disabled:opacity-50"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {coupons.length > 0 ? (
          coupons.map((coupon) => (
            <motion.div
              key={coupon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-[40px] border border-stone-100 flex items-center justify-between group hover:border-teal-200 transition-all shadow-sm"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-teal-50 rounded-3xl flex items-center justify-center text-teal-600">
                  <Ticket className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-black text-stone-900 tracking-tighter">{coupon.code}</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-teal-600">{coupon.discount}% de Desconto</p>
                    {coupon.expirationDate && (
                      <>
                        <span className="text-stone-300">•</span>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Expira: {new Date(coupon.expirationDate + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => deleteCoupon(coupon.id)}
                className="p-4 rounded-2xl text-stone-300 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            </motion.div>
          ))
        ) : (
          <div className="col-span-2 py-20 text-center bg-stone-50 rounded-[40px] border-2 border-dashed border-stone-100">
             <Ticket className="w-16 h-16 text-stone-200 mx-auto mb-4" />
             <p className="text-stone-400 font-bold">Nenhum cupom cadastrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};
