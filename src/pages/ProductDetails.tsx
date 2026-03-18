import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAdmin } from './admin/adminContext';
import { useCart } from '../CartContext';
import { useFavorites } from '../FavoritesContext';
import { Star, ShoppingCart, Heart, ArrowLeft, ShieldCheck, Truck, RefreshCw, ChevronRight, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, formatPrice } = useAdmin();
  const product = products.find(p => p.id === id);
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'spec' | 'reviews'>('desc');
  const [selectedMedia, setSelectedMedia] = useState<{ type: 'image' | 'video'; src: string }>({ type: 'image', src: '' });

  useEffect(() => {
    if (product) {
      setSelectedMedia({ type: 'image', src: product.images[0] });
    }
  }, [product]);

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
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={selectedMedia.src}
              className="bg-stone-50 rounded-[40px] p-6 md:p-16 aspect-square flex items-center justify-center relative overflow-hidden shadow-inner"
            >
              {product.badge && (
                <span className={`absolute top-4 left-4 md:top-8 md:left-8 z-10 text-[10px] md:text-xs font-bold uppercase tracking-widest px-3 py-1.5 md:px-4 md:py-2 rounded-full text-white ${
                  product.badge === 'Novo' ? 'bg-blue-500' : product.badge === 'Promoção' ? 'bg-orange-500' : 'bg-teal-500'
                }`}>
                  {product.badge}
                </span>
              )}
              {selectedMedia.type === 'video' ? (
                <video src={selectedMedia.src} controls autoPlay className="max-w-full max-h-full rounded-2xl shadow-2xl" />
              ) : (
                <img src={selectedMedia.src} alt={product.name} className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform hover:scale-105 duration-700" />
              )}
            </motion.div>

            {(product.images.length > 1 || product.video) && (
              <div className="flex gap-4 justify-center md:justify-start overflow-x-auto pb-2 no-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedMedia({ type: 'image', src: img })}
                    className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedMedia.type === 'image' && selectedMedia.src === img ? 'border-teal-500 shadow-md scale-105' : 'border-stone-100 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
                {product.video && (
                  <button
                    onClick={() => setSelectedMedia({ type: 'video', src: product.video! })}
                    className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-stone-900 flex items-center justify-center relative ${
                      selectedMedia.type === 'video' ? 'border-teal-500 shadow-md scale-105' : 'border-stone-100 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                        <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-teal-600 border-b-[6px] border-b-transparent ml-1"></div>
                      </div>
                    </div>
                    <span className="text-[8px] text-white font-bold absolute bottom-2 uppercase">Vídeo</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="mb-6 md:mb-8">
              <p className="text-teal-600 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs mb-3 md:mb-4">{product.brand}</p>
              <h1 className="font-display text-2xl md:text-5xl font-bold text-stone-900 mb-4 md:mb-6 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-2 md:gap-4">
                <div className="flex bg-orange-50 px-3 py-1.5 rounded-xl">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={`w-4 h-4 ${s <= Math.floor(product.rating) ? 'text-orange-400 fill-orange-400' : 'text-stone-200'}`} />
                  ))}
                  <span className="ml-2 font-bold text-orange-700 text-sm">{product.rating}</span>
                </div>
                <span className="text-stone-400 text-sm">({product.reviewCount} avaliações)</span>
              </div>
            </div>

            <div className="mb-8 md:mb-10 p-6 md:p-8 bg-stone-50 rounded-[32px]">
              <div className="flex items-end gap-2 md:gap-3 mb-2">
                {product.oldPrice && <span className="text-lg md:text-xl text-stone-400 line-through mb-1">{formatPrice(product.oldPrice)}</span>}
                <span className="text-3xl md:text-5xl font-display font-bold text-stone-900 leading-none">{formatPrice(product.price)}</span>
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
                className={`px-6 py-4 md:px-8 md:py-4 font-bold text-[10px] md:text-sm uppercase tracking-widest whitespace-nowrap transition-all relative ${
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
            <div className="flex items-center justify-between mb-8 md:mb-10">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-stone-900">Também pode te interessar</h2>
              <Link to={`/?categoria=${product.category}#produtos`} className="text-teal-600 text-sm md:text-base font-bold flex items-center gap-1 md:gap-2 hover:gap-4 transition-all">
                <span className="hidden md:inline">Ver tudo</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {relatedProducts.map(rp => (
                <Link key={rp.id} to={`/produto/${rp.id}`} className="bg-white border border-stone-100 rounded-[20px] md:rounded-3xl overflow-hidden hover:shadow-xl transition-all p-4 md:p-6 group">
                  <div className="aspect-square bg-stone-50 rounded-xl md:rounded-2xl mb-3 md:mb-4 flex items-center justify-center relative overflow-hidden">
                    <img src={rp.images[0]} alt={rp.name} className="w-full h-full object-contain p-3 md:p-4 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <p className="text-[8px] md:text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-1 md:mb-2">{rp.brand}</p>
                  <h3 className="font-bold text-stone-900 text-sm mb-2 md:mb-3 line-clamp-2 leading-tight">{rp.name}</h3>
                  <p className="font-display font-bold text-base md:text-lg text-stone-900">{formatPrice(rp.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
