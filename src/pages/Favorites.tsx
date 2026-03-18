import React from 'react';
import { motion } from 'motion/react';
import { Heart, ShoppingBag, Plus, Trash2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../data';
import { useCart } from '../CartContext';
import { useFavorites } from '../FavoritesContext';

export const Favorites = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();
  
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header Estilizado */}
      <div className="bg-stone-900 pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center md:text-left"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full text-teal-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4 md:mb-6">
              <Heart className="w-3 h-3 md:w-4 md:h-4 fill-teal-400" />
              Sua Lista de Desejos
            </div>
            <h1 className="font-display text-3xl md:text-6xl font-black text-white tracking-tighter mb-3 md:mb-4">
              Produtos Favoritos
            </h1>
            <p className="text-stone-300 text-base md:text-lg max-w-2xl px-4 md:px-0">
              Salve aqui os produtos que seu pet mais ama para facilitar suas próximas compras.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        {favoriteProducts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 md:p-24 rounded-[32px] md:rounded-[40px] shadow-2xl shadow-stone-200 border border-stone-100 text-center"
          >
            <div className="w-16 h-16 md:w-24 md:h-24 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8">
              <Heart className="w-8 h-8 md:w-12 md:h-12 text-stone-200" />
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-stone-900 mb-3 md:mb-4">Sua lista está vazia</h2>
            <p className="text-stone-500 mb-8 md:mb-10 max-w-md mx-auto text-sm md:text-base">Navegue pela nossa loja e clique no coração para salvar seus produtos favoritos aqui.</p>
            <Link 
              to="/#produtos" 
              className="inline-flex items-center bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 md:py-4 md:px-10 rounded-xl md:rounded-2xl transition-all shadow-lg shadow-teal-500/20 group text-sm md:text-base"
            >
              Explorar Loja
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {favoriteProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-stone-100 rounded-[32px] overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all group"
              >
                <div className="relative pt-[80%] bg-stone-50/50">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="absolute inset-0 w-full h-full object-contain p-8 mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                  />
                  <button 
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-2 right-2 md:top-4 md:right-4 p-2 md:p-3 bg-white/80 backdrop-blur-md rounded-full md:rounded-2xl text-red-500 hover:bg-red-50 transition-all border border-stone-100 shadow-sm"
                    title="Remover dos favoritos"
                  >
                    <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
                <div className="p-4 md:p-8">
                  <div className="flex justify-between items-start mb-3 md:mb-4">
                    <div>
                      <p className="text-[10px] md:text-xs font-bold text-teal-600 uppercase tracking-widest mb-1">{product.brand}</p>
                      <h3 className="font-bold text-stone-900 text-sm md:text-xl leading-tight line-clamp-2">{product.name}</h3>
                    </div>
                  </div>
                  
                  <div className="flex items-end justify-between mt-4 md:mt-6">
                    <div>
                      {product.oldPriceFormatted && (
                        <p className="text-[10px] md:text-xs text-stone-400 line-through mb-0 md:mb-0.5">{product.oldPriceFormatted}</p>
                      )}
                      <p className="text-lg md:text-2xl font-display font-black text-stone-900 leading-none">{product.priceFormatted}</p>
                    </div>
                    <button 
                      onClick={() => addToCart(product)}
                      className="bg-stone-900 hover:bg-teal-500 text-white p-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl font-bold transition-all flex items-center gap-1 md:gap-2 shadow-sm md:shadow-lg shrink-0"
                      aria-label="Comprar"
                    >
                      <Plus className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="hidden md:inline">Comprar</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Sugestões de Categorias */}
      {favoriteProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24">
          <div className="bg-stone-50 rounded-[32px] md:rounded-[40px] p-6 md:p-12 border border-stone-100 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-display font-bold text-stone-900 mb-2">Quer ver mais novidades?</h3>
              <p className="text-stone-500 text-sm md:text-base">Confira nossas categorias principais e encontre as melhores ofertas.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              <Link to="/?categoria=Rações#produtos" className="bg-white px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold text-stone-600 border border-stone-100 hover:border-teal-200 hover:text-teal-600 transition-all shadow-sm">Rações</Link>
              <Link to="/?categoria=Acessórios#produtos" className="bg-white px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold text-stone-600 border border-stone-100 hover:border-teal-200 hover:text-teal-600 transition-all shadow-sm">Acessórios</Link>
              <Link to="/?categoria=Brinquedos#produtos" className="bg-white px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold text-stone-600 border border-stone-100 hover:border-teal-200 hover:text-teal-600 transition-all shadow-sm">Brinquedos</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
