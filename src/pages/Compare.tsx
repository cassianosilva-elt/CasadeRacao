import React, { useState } from 'react';
import { products, Product } from '../data';
import { useAdmin } from './admin/adminContext';
import { ArrowLeft, Plus, X, ArrowRight, ShieldCheck, Scale, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../CartContext';

export const Compare = () => {
  const { formatPrice } = useAdmin();
  const { addToCart } = useCart();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  const compareProducts = products.filter(p => selectedIds.includes(p.id));

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else if (selectedIds.length < 3) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const specs = [
    { label: 'Marca', key: 'brand' },
    { label: 'Preço', key: 'price' },
    { label: 'Avaliação', key: 'rating' },
    { label: 'Categoria', key: 'category' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
      <div className="flex items-center gap-4 mb-12">
        <Link to="/" className="p-3 bg-stone-100 rounded-2xl text-stone-900 hover:bg-stone-200 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-display text-4xl font-black text-stone-900 tracking-tight">Comparar Produtos</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-stone-900 text-white p-8 rounded-[40px] shadow-2xl shadow-stone-900/40">
            <Scale className="w-10 h-10 text-teal-400 mb-6" />
            <h2 className="text-xl font-bold mb-4">Escolha até 3 produtos</h2>
            <p className="text-stone-400 text-sm leading-relaxed mb-8">Compare especificações lado a lado para encontrar a melhor opção para seu pet.</p>
            <div className="space-y-4">
               {selectedIds.length === 0 && <p className="text-[10px] uppercase font-bold text-stone-600 tracking-widest">Nenhum selecionado</p>}
               {compareProducts.map(p => (
                 <div key={p.id} className="flex items-center justify-between text-xs bg-stone-800 p-3 rounded-xl">
                   <span className="truncate pr-4">{p.name}</span>
                   <button onClick={() => toggleSelect(p.id)}><X className="w-3 h-3 text-red-400" /></button>
                 </div>
               ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {selectedIds.length === 0 ? (
            <div className="bg-stone-50 border-2 border-dashed border-stone-200 rounded-[40px] p-24 text-center">
              <Plus className="w-12 h-12 text-stone-300 mx-auto mb-6" />
              <p className="text-stone-400 font-medium">Selecione produtos na loja para comparar.</p>
              <Link to="/#produtos" className="inline-block mt-4 text-teal-600 font-bold hover:underline">Voltar para a loja</Link>
            </div>
          ) : (
            <div className="overflow-x-auto pb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-6 text-left border-b border-stone-100 min-w-[200px]"></th>
                    {compareProducts.map(p => (
                      <th key={p.id} className="p-6 border-b border-stone-100 min-w-[250px]">
                        <div className="flex flex-col items-center gap-4">
                          <img 
                            src={p.image || p.images?.[0] || 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400'} 
                            alt={p.name} 
                            className="w-32 h-32 object-contain bg-stone-50 rounded-2xl p-4" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400';
                            }}
                          />
                          <h3 className="font-bold text-stone-900 text-sm">{p.name}</h3>
                          <button 
                            onClick={() => addToCart(p)}
                            className="w-full bg-teal-500 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl hover:shadow-teal-500/20 transition-all"
                          >
                            Adicionar
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {specs.map(spec => (
                    <tr key={spec.key} className="hover:bg-stone-50 transition-colors">
                      <td className="p-6 border-b border-stone-100 font-bold text-stone-400 text-[10px] uppercase tracking-widest">{spec.label}</td>
                      {compareProducts.map(p => (
                        <td key={p.id} className="p-6 border-b border-stone-100 font-bold text-stone-900 text-center">
                          {spec.key === 'price' ? formatPrice(p.price) : 
                           spec.key === 'rating' ? `${p.rating} ★` : 
                           (p as any)[spec.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
