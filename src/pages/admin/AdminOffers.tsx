import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tag, Plus, Trash2, ArrowLeft, Percent, Search, ShoppingBag, Sparkles, X, Check, BadgeDollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from './adminContext';

export const AdminOffers = () => {
  const navigate = useNavigate();
  const { products, formatPrice, setProductOffer, removeProductOffer } = useAdmin();
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [promoPrice, setPromoPrice] = useState('');
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

  // Separate products into offers and non-offers
  const activeOffers = products.filter(p => p.oldPrice && p.badge === 'Promoção');
  const availableProducts = products.filter(p => !p.oldPrice && p.badge !== 'Promoção');
  const filteredProducts = availableProducts.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedProduct = availableProducts.find(p => p.id === selectedProductId);

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProductId && promoPrice && selectedProduct) {
      const promoPriceNum = Number(promoPrice);
      if (promoPriceNum > 0 && promoPriceNum < selectedProduct.price) {
        setProductOffer(selectedProductId, selectedProduct.price, promoPriceNum);
        setSelectedProductId('');
        setPromoPrice('');
        setSearchQuery('');
        setIsAdding(false);
      }
    }
  };

  const handleRemoveOffer = (product: typeof products[0]) => {
    if (product.oldPrice) {
      removeProductOffer(product.id, product.oldPrice);
      setConfirmRemoveId(null);
    }
  };

  const discountPercent = (original: number, promo: number) => {
    return Math.round(((original - promo) / original) * 100);
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin')}
            className="p-3 bg-stone-100 rounded-2xl hover:bg-stone-200 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-stone-600" />
          </button>
          <div>
            <h1 className="text-3xl font-display font-black text-stone-900 tracking-tight">Gerenciar Ofertas</h1>
            <p className="text-stone-500 font-medium">Crie promoções e descontos para atrair mais clientes.</p>
          </div>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-xl shadow-orange-500/20 flex items-center gap-2"
        >
          {isAdding ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {isAdding ? 'Cancelar' : 'Nova Oferta'}
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-[24px] border border-stone-100 shadow-sm">
          <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-3">
            <Tag className="w-5 h-5" />
          </div>
          <p className="text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">Ofertas Ativas</p>
          <p className="text-2xl font-display font-bold text-stone-900">{activeOffers.length}</p>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-stone-100 shadow-sm">
          <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-3">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <p className="text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">Produtos Totais</p>
          <p className="text-2xl font-display font-bold text-stone-900">{products.length}</p>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-stone-100 shadow-sm hidden sm:block">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-3">
            <Percent className="w-5 h-5" />
          </div>
          <p className="text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">Desconto Médio</p>
          <p className="text-2xl font-display font-bold text-stone-900">
            {activeOffers.length > 0
              ? `${Math.round(activeOffers.reduce((acc, p) => acc + discountPercent(p.oldPrice!, p.price), 0) / activeOffers.length)}%`
              : '—'}
          </p>
        </div>
      </div>

      {/* New Offer Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white p-8 rounded-[40px] border border-stone-100 shadow-xl mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-stone-900">Criar Nova Oferta</h2>
              </div>

              <form onSubmit={handleCreateOffer} className="space-y-6">
                {/* Product Search */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-widest pl-1">Selecionar Produto</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300" />
                    <input
                      type="text"
                      placeholder="Buscar produto por nome ou marca..."
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setSelectedProductId(''); }}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-4 pl-12 text-sm focus:ring-2 focus:ring-orange-500 outline-none font-medium"
                    />
                  </div>

                  {/* Product Results */}
                  {searchQuery && (
                    <div className="max-h-64 overflow-y-auto border border-stone-100 rounded-2xl bg-white shadow-lg">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.slice(0, 8).map(product => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => { setSelectedProductId(product.id); setSearchQuery(product.name); }}
                            className={`w-full flex items-center gap-4 p-4 text-left hover:bg-stone-50 transition-colors border-b border-stone-50 last:border-b-0 ${selectedProductId === product.id ? 'bg-orange-50 border-orange-100' : ''}`}
                          >
                            <div className="w-12 h-12 bg-stone-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                              {product.image || product.images?.[0] ? (
                                <img src={product.image || product.images[0]} alt={product.name} className="w-full h-full object-contain p-1" />
                              ) : (
                                <ShoppingBag className="w-5 h-5 text-stone-300" />
                              )}
                            </div>
                            <div className="flex-grow min-w-0">
                              <p className="font-bold text-stone-900 text-sm truncate">{product.name}</p>
                              <p className="text-xs text-stone-400 font-medium">{product.brand} • {formatPrice(product.price)}</p>
                            </div>
                            {selectedProductId === product.id && (
                              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center shrink-0">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </button>
                        ))
                      ) : (
                        <div className="p-6 text-center text-stone-400 text-sm font-medium">
                          Nenhum produto encontrado.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Selected Product Preview + Price */}
                {selectedProduct && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-stone-50 p-6 rounded-2xl border border-stone-100"
                  >
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="flex items-center gap-4 flex-grow">
                        <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shrink-0 border border-stone-100 flex items-center justify-center">
                          {selectedProduct.image || selectedProduct.images?.[0] ? (
                            <img src={selectedProduct.image || selectedProduct.images[0]} alt={selectedProduct.name} className="w-full h-full object-contain p-2" />
                          ) : (
                            <ShoppingBag className="w-6 h-6 text-stone-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-stone-900">{selectedProduct.name}</p>
                          <p className="text-sm text-stone-400 font-medium">{selectedProduct.brand} • Preço atual: <span className="text-stone-900 font-bold">{formatPrice(selectedProduct.price)}</span></p>
                        </div>
                      </div>
                      <div className="flex items-end gap-4">
                        <div className="space-y-2 flex-grow sm:flex-grow-0">
                          <label className="text-xs font-bold text-stone-400 uppercase tracking-widest pl-1">Preço Promocional</label>
                          <div className="relative">
                            <BadgeDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300" />
                            <input
                              type="number"
                              step="0.01"
                              min="0.01"
                              max={selectedProduct.price - 0.01}
                              placeholder={`Menor que ${formatPrice(selectedProduct.price)}`}
                              value={promoPrice}
                              onChange={(e) => setPromoPrice(e.target.value)}
                              className="w-full sm:w-48 bg-white border border-stone-200 rounded-2xl px-4 py-4 pl-12 text-sm focus:ring-2 focus:ring-orange-500 outline-none font-bold"
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          disabled={!promoPrice || Number(promoPrice) <= 0 || Number(promoPrice) >= selectedProduct.price}
                          className="bg-orange-500 text-white font-bold py-4 px-8 rounded-2xl hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20 whitespace-nowrap"
                        >
                          Criar Oferta
                        </button>
                      </div>
                    </div>

                    {promoPrice && Number(promoPrice) > 0 && Number(promoPrice) < selectedProduct.price && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 flex items-center gap-4 bg-emerald-50 p-4 rounded-xl border border-emerald-100"
                      >
                        <Percent className="w-5 h-5 text-emerald-600 shrink-0" />
                        <p className="text-sm text-emerald-800 font-bold">
                          Desconto de <span className="text-emerald-600">{discountPercent(selectedProduct.price, Number(promoPrice))}%</span> — De {formatPrice(selectedProduct.price)} por <span className="text-emerald-600">{formatPrice(Number(promoPrice))}</span>
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Offers List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <Tag className="w-5 h-5 text-orange-500" />
          Ofertas Ativas ({activeOffers.length})
        </h2>

        {activeOffers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeOffers.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-[32px] border border-stone-100 group hover:border-orange-200 transition-all shadow-sm hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-stone-50 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center border border-stone-100">
                    {product.image || product.images?.[0] ? (
                      <img
                        src={product.image || product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400';
                        }}
                      />
                    ) : (
                      <ShoppingBag className="w-8 h-8 text-stone-200" />
                    )}
                  </div>

                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">Promoção</span>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{product.brand}</span>
                    </div>
                    <h3 className="font-bold text-stone-900 text-sm leading-tight mb-3 truncate">{product.name}</h3>

                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xl font-display font-black text-emerald-600">{formatPrice(product.price)}</span>
                      {product.oldPrice && (
                        <>
                          <span className="text-sm text-stone-400 line-through font-bold">{formatPrice(product.oldPrice)}</span>
                          <span className="text-xs font-black text-white bg-orange-500 px-2 py-1 rounded-full">
                            -{discountPercent(product.oldPrice, product.price)}%
                          </span>
                        </>
                      )}
                    </div>

                    {/* Remove Offer Button */}
                    {confirmRemoveId === product.id ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRemoveOffer(product)}
                          className="flex-grow bg-red-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs hover:bg-red-600 transition-all"
                        >
                          Confirmar Remoção
                        </button>
                        <button
                          onClick={() => setConfirmRemoveId(null)}
                          className="bg-stone-100 text-stone-600 font-bold py-2.5 px-4 rounded-xl text-xs hover:bg-stone-200 transition-all"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmRemoveId(product.id)}
                        className="flex items-center gap-2 text-stone-400 hover:text-red-500 font-bold text-xs py-2 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remover Oferta
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-stone-50 rounded-[40px] border-2 border-dashed border-stone-100">
            <Tag className="w-16 h-16 text-stone-200 mx-auto mb-4" />
            <p className="text-stone-400 font-bold text-lg mb-2">Nenhuma oferta ativa.</p>
            <p className="text-stone-300 text-sm font-medium">Clique em "Nova Oferta" para criar sua primeira promoção.</p>
          </div>
        )}
      </div>
    </div>
  );
};
