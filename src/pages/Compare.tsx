import React, { useState, useMemo } from 'react';
import { useAdmin, Product } from './admin/adminContext';
import { ArrowLeft, Plus, X, ArrowRight, ShieldCheck, Scale, Info, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../CartContext';

export const Compare = () => {
  const { products, formatPrice } = useAdmin();
  const { addToCart } = useCart();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const compareProducts = products.filter(p => selectedIds.includes(p.id));

  const toggleSelect = (id: string) => {
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
    { label: 'Categoria', key: 'category' },
    { label: 'Descrição', key: 'description' },
    { label: 'Estoque', key: 'quantity' }
  ] as const;

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const lower = searchTerm.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(lower));
  }, [products, searchTerm]);

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
            <p className="text-stone-400 text-sm leading-relaxed mb-6">Compare especificações lado a lado para encontrar a melhor opção para seu pet.</p>
            
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="text"
                  placeholder="Buscar produto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-4 mb-6">
               <div className="flex justify-between items-center mb-2">
                 <p className="text-[10px] uppercase font-bold text-stone-500 tracking-widest">
                   Selecionados: {selectedIds.length}/3
                 </p>
               </div>
               {selectedIds.length === 0 && <p className="text-sm text-stone-500 italic">Nenhum produto selecionado</p>}
               {compareProducts.map(p => (
                 <div key={p.id} className="flex items-center justify-between text-xs bg-stone-800 p-3 rounded-xl border border-stone-700">
                   <span className="truncate pr-4 font-medium">{p.name}</span>
                   <button onClick={() => toggleSelect(p.id)} className="p-1 hover:bg-stone-700 rounded-lg transition-colors">
                     <X className="w-3 h-3 text-red-400" />
                   </button>
                 </div>
               ))}
            </div>

            <div className="border-t border-stone-800 pt-6">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Disponíveis</h3>
              <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-transparent">
                {filteredProducts.map(p => {
                  const isSelected = selectedIds.includes(p.id);
                  const isFull = selectedIds.length >= 3;
                  const disabled = !isSelected && isFull;
                  return (
                    <button
                      key={p.id}
                      onClick={() => toggleSelect(p.id)}
                      disabled={disabled}
                      className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition-all ${
                        isSelected 
                          ? 'bg-teal-500/20 border border-teal-500/50' 
                          : disabled
                            ? 'opacity-50 cursor-not-allowed hover:bg-transparent'
                            : 'hover:bg-stone-800 border border-transparent'
                      }`}
                    >
                      <img 
                        src={p.image || p.images?.[0] || 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=100'} 
                        alt={p.name}
                        className="w-10 h-10 object-contain bg-white rounded-lg p-1"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=100';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium truncate ${isSelected ? 'text-teal-400' : 'text-stone-300'}`}>{p.name}</p>
                        <p className="text-[10px] text-stone-500">{formatPrice(p.price)}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {selectedIds.length === 0 ? (
            <div className="bg-stone-50 border-2 border-dashed border-stone-200 rounded-[40px] p-24 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
              <Plus className="w-12 h-12 text-stone-300 mx-auto mb-6" />
              <p className="text-stone-400 font-medium">Selecione produtos na lista ao lado para comparar.</p>
              <Link to="/#produtos" className="inline-block mt-4 text-teal-600 font-bold hover:underline">Ir para a loja</Link>
            </div>
          ) : (
            <div className="overflow-x-auto pb-8 bg-white rounded-[40px] shadow-xl shadow-stone-200/50 border border-stone-100 h-full">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-8 text-left border-b-2 border-stone-100 min-w-[200px] bg-stone-50/50"></th>
                    {compareProducts.map(p => (
                      <th key={p.id} className="p-8 border-b-2 border-stone-100 min-w-[250px] align-top bg-white">
                        <div className="flex flex-col items-center gap-6 relative">
                          <button 
                            onClick={() => toggleSelect(p.id)}
                            className="absolute -top-2 -right-2 p-2 bg-stone-100 hover:bg-red-100 hover:text-red-600 rounded-full text-stone-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="w-40 h-40 bg-stone-50 rounded-3xl p-6 flex items-center justify-center group">
                            <img 
                              src={p.image || p.images?.[0] || 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400'} 
                              alt={p.name} 
                              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" 
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400';
                              }}
                            />
                          </div>
                          <div className="text-center">
                            <h3 className="font-bold text-stone-900 text-sm mb-2">{p.name}</h3>
                            <p className="text-teal-600 font-black text-lg mb-4">{formatPrice(p.price)}</p>
                          </div>
                          <button 
                            onClick={() => addToCart(p)}
                            className="w-full bg-teal-500 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl hover:shadow-teal-500/20 hover:bg-teal-600 transition-all"
                          >
                            Adicionar ao Carrinho
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {specs.map((spec, index) => (
                    <tr key={spec.key} className={`transition-colors ${index % 2 === 0 ? 'bg-stone-50/30' : 'bg-white'} hover:bg-stone-50`}>
                      <td className="p-6 border-b border-stone-100 font-bold text-stone-400 text-[10px] uppercase tracking-widest align-middle">
                        {spec.label}
                      </td>
                      {compareProducts.map(p => (
                        <td key={p.id} className="p-6 border-b border-stone-100 text-sm text-stone-700 text-center align-middle">
                          {spec.key === 'price' ? (
                            <span className="font-bold text-stone-900">{formatPrice(p.price)}</span>
                          ) : spec.key === 'rating' ? (
                            <div className="flex items-center justify-center gap-1 text-amber-400 font-bold">
                              <span>{p.rating}</span>
                              <span className="text-lg leading-none">★</span>
                            </div>
                          ) : spec.key === 'description' ? (
                            <p className="text-xs text-stone-500 line-clamp-3 text-left max-w-xs mx-auto">
                              {p.description || 'Sem descrição.'}
                            </p>
                          ) : spec.key === 'quantity' ? (
                            <span className={`font-bold ${p.quantity > 0 ? 'text-teal-600' : 'text-red-500'}`}>
                              {p.quantity > 0 ? `${p.quantity} unid.` : 'Esgotado'}
                            </span>
                          ) : (
                            <span className="font-medium text-stone-900 capitalize">
                              {String((p as any)[spec.key] || '-')}
                            </span>
                          )}
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
