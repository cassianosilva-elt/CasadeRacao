import React from 'react';
import { products } from '../data';
import { useAdmin } from './admin/adminContext';
import { Link } from 'react-router-dom';
import { Tag, ArrowRight, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';
import { useCart } from '../CartContext';

export const Offers = () => {
  const { formatPrice } = useAdmin();
  const { addToCart } = useCart();
  
  const discountProducts = products.filter(p => p.oldPrice || p.badge === 'Promoção');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
      <div className="text-center mb-16 reveal-on-scroll">
        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
          <Tag className="w-4 h-4" />
          Ofertas Imperdíveis
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-black text-stone-900 tracking-tighter mb-6">Economia para o seu Pet</h1>
        <p className="text-stone-500 max-w-2xl mx-auto text-lg">Seu melhor amigo merece o melhor, e seu bolso também. Confira as melhores promoções da Casa de Ração LOPES.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {discountProducts.map((product, index) => (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-stone-100 rounded-[32px] overflow-hidden hover:shadow-2xl transition-all group"
          >
            <div className="aspect-square bg-stone-50 relative overflow-hidden flex items-center justify-center p-8">
              <img 
                src={product.image || product.images?.[0] || 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400'} 
                alt={product.name} 
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400';
                }}
              />
              <div className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                Promoção
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-2">{product.brand}</p>
              <h3 className="font-bold text-stone-900 mb-4 line-clamp-2 h-10 leading-tight">{product.name}</h3>
              
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl font-display font-black text-stone-900">{formatPrice(product.price)}</span>
                {product.oldPrice && (
                  <span className="text-sm text-stone-400 line-through font-bold">{formatPrice(product.oldPrice)}</span>
                )}
              </div>

              <div className="flex gap-2">
                <Link to={`/produto/${product.id}`} className="flex-grow bg-stone-900 text-white text-center py-3 rounded-xl text-xs font-bold hover:bg-stone-800 transition-all">
                  Ver Detalhes
                </Link>
                <button 
                  onClick={() => addToCart(product)}
                  className="bg-teal-500 text-white p-3 rounded-xl hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/20"
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
