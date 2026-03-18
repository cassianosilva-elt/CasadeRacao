import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products, Product } from '../data';
import { useCart } from '../CartContext';
import { useFavorites } from '../FavoritesContext';
import { Star, ShoppingCart, Heart, ArrowLeft, ShieldCheck, Truck, RefreshCw, ChevronRight, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = products.find(p => p.id === Number(id));
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'spec' | 'reviews'>('desc');

  useEffect(() => {
    window.scrollTo(0, 0);
    setQuantity(1);
  }, [id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-stone-900 mb-4">Produto não encontrado</h2>
        <Link to="/" className="text-teal-600 font-bold hover:underline">Voltar para a loja</Link>
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-900 font-bold text-sm mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24">
          <div className="relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-stone-50 rounded-[40px] p-8 md:p-16 aspect-square flex items-center justify-center relative overflow-hidden"
            >
              {product.badge && (
                <span className={`absolute top-8 left-8 z-10 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full text-white ${
                  product.badge === 'Novo' ? 'bg-blue-500' : product.badge === 'Promoção' ? 'bg-orange-500' : 'bg-teal-500'
                }`}>
                  {product.badge}
                </span>
              )}
              <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform hover:scale-110 duration-700" />
            </motion.div>
          </div>

          <div className="flex flex-col">
            <div className="mb-8">
              <p className="text-teal-600 font-bold uppercase tracking-[0.2em] text-xs mb-4">{product.brand}</p>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-stone-900 mb-6 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex bg-orange-50 px-3 py-1.5 rounded-xl">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={`w-4 h-4 ${s <= Math.floor(product.rating) ? 'text-orange-400 fill-orange-400' : 'text-stone-200'}`} />
                  ))}
                  <span className="ml-2 font-bold text-orange-700 text-sm">{product.rating}</span>
                </div>
                <span className="text-stone-400 text-sm">({product.reviewCount} avaliações)</span>
              </div>
            </div>

            <div className="mb-10 p-8 bg-stone-50 rounded-[32px]">
              <div className="flex items-end gap-3 mb-2">
                {product.oldPriceFormatted && <span className="text-xl text-stone-400 line-through mb-1">{product.oldPriceFormatted}</span>}
                <span className="text-4xl md:text-5xl font-display font-bold text-stone-900">{product.priceFormatted}</span>
              </div>
              <p className="text-stone-500 text-sm font-medium">À vista no PIX com 5% de desconto ou em até 3x sem juros.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="flex items-center bg-stone-100 rounded-2xl p-1 border border-stone-200">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-4 text-stone-500 hover:text-teal-600 transition-colors"><Minus className="w-5 h-5" /></button>
                <span className="w-12 text-center font-bold text-xl">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-4 text-stone-500 hover:text-teal-600 transition-colors"><Plus className="w-5 h-5" /></button>
              </div>
              <button 
                onClick={() => addToCart({ ...product, quantity })}
                className="flex-grow bg-teal-500 hover:bg-teal-600 text-white font-bold py-5 px-8 rounded-2xl transition-all shadow-xl shadow-teal-500/20 flex items-center justify-center gap-3"
              >
                <ShoppingCart className="w-6 h-6" />
                Adicionar ao Carrinho
              </button>
              <button 
                onClick={() => toggleFavorite(product.id)}
                className={`p-5 rounded-2xl border transition-all ${isFavorite(product.id) ? 'bg-red-50 border-red-100 text-red-500' : 'bg-white border-stone-200 text-stone-400 hover:text-stone-600'}`}
              >
                <Heart className={`w-6 h-6 ${isFavorite(product.id) ? 'fill-red-500' : ''}`} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-stone-100">
              <div className="flex items-center gap-3 text-stone-600">
                <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center text-teal-600"><Truck className="w-5 h-5" /></div>
                <span className="text-xs font-bold uppercase tracking-wider">Frete Grátis SP</span>
              </div>
              <div className="flex items-center gap-3 text-stone-600">
                <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center text-teal-600"><ShieldCheck className="w-5 h-5" /></div>
                <span className="text-xs font-bold uppercase tracking-wider">Compra Segura</span>
              </div>
              <div className="flex items-center gap-3 text-stone-600">
                <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center text-teal-600"><RefreshCw className="w-5 h-5" /></div>
                <span className="text-xs font-bold uppercase tracking-wider">Troca Fácil</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-24">
          <div className="flex border-b border-stone-100 mb-10 overflow-x-auto no-scrollbar">
            {['desc', 'spec', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-8 py-4 font-bold text-sm uppercase tracking-widest whitespace-nowrap transition-all relative ${
                  activeTab === tab ? 'text-teal-600' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                {tab === 'desc' ? 'Descrição' : tab === 'spec' ? 'Especificações' : 'Avaliações'}
                {activeTab === tab && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-1 bg-teal-500 rounded-t-full" />}
              </button>
            ))}
          </div>
          <div className="prose prose-stone max-w-none bg-stone-50 p-10 rounded-[40px] border border-stone-100">
            {activeTab === 'desc' && (
              <div className="text-stone-600 leading-relaxed">
                <h3 className="font-display text-2xl font-bold text-stone-900 mb-4">Sobre o produto</h3>
                <p className="mb-6">{product.description}</p>
                <p>Nossa ração é formulada com ingredientes de alta qualidade para garantir a saúde e vitalidade do seu animal de estimação. Rica em vitaminas e minerais essenciais.</p>
              </div>
            )}
            {activeTab === 'spec' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {[
                  { l: 'Marca', v: product.brand },
                  { l: 'Categoria', v: product.category },
                  { l: 'Tipo', v: 'Premium' },
                  { l: 'Indicação', v: 'Adultos' },
                  { l: 'Peso', v: '15kg' },
                  { l: 'Sabor', v: 'Carne e Vegetais' }
                ].map((s, i) => (
                  <div key={i} className="flex justify-between border-b border-stone-200 pb-2">
                    <span className="font-bold text-stone-400 text-xs uppercase tracking-widest">{s.l}</span>
                    <span className="font-bold text-stone-900">{s.v}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="space-y-8">
                 <div className="flex items-center justify-between mb-8">
                   <h3 className="font-display text-2xl font-bold text-stone-900">O que os clientes dizem</h3>
                   <button className="bg-stone-900 text-white font-bold py-3 px-6 rounded-2xl text-sm">Escrever Avaliação</button>
                 </div>
                 {[1, 2].map(r => (
                   <div key={r} className="border-b border-stone-200 pb-8">
                     <div className="flex mb-3">
                       {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 text-orange-400 fill-orange-400 mr-1" />)}
                     </div>
                     <p className="font-bold text-stone-900 mb-2">Excelente custo benefício.</p>
                     <p className="text-stone-500 text-sm leading-relaxed mb-4">Meu cachorro adorou essa ração, o pelo dele ficou muito mais brilhante e as fezes bem firmes.</p>
                     <div className="flex items-center gap-2">
                       <div className="w-6 h-6 bg-stone-200 rounded-full"></div>
                       <span className="text-xs font-bold text-stone-600">Carlos Silva</span>
                       <span className="text-[10px] text-stone-400">Verificado</span>
                     </div>
                   </div>
                 ))}
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="reveal-on-scroll">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-display text-3xl font-bold text-stone-900">Também pode te interessar</h2>
              <Link to={`/?categoria=${product.category}#produtos`} className="text-teal-600 font-bold flex items-center gap-2 hover:gap-4 transition-all">
                Ver tudo <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(rp => (
                <Link key={rp.id} to={`/produto/${rp.id}`} className="bg-white border border-stone-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all p-6 group">
                  <div className="aspect-square bg-stone-50 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden">
                    <img src={rp.image} alt={rp.name} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-2">{rp.brand}</p>
                  <h3 className="font-bold text-stone-900 text-sm mb-3 line-clamp-2">{rp.name}</h3>
                  <p className="font-display font-bold text-lg text-stone-900">{rp.priceFormatted}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
