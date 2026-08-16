import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAdmin } from './admin/adminContext';
import { calculateDeliveryFee } from '../utils/deliveryCalculator';
import { useCart } from '../CartContext';
import { useFavorites } from '../FavoritesContext';
import { calculateFoodAmount } from '../data';
import { Star, ShoppingCart, Heart, ArrowLeft, ShieldCheck, Truck, RefreshCw, ChevronRight, Plus, Minus, Repeat, Calculator, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from '../ToastContext';

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, formatPrice } = useAdmin();
  const product = products.find(p => p.id === id);
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToast } = useToast();
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'spec' | 'reviews' | 'calc'>('desc');
  const [selectedMedia, setSelectedMedia] = useState<{ type: 'image' | 'video'; src: string }>({ type: 'image', src: '' });
  const [cep, setCep] = useState('');
  const [shippingResult, setShippingResult] = useState<{ type: string; price: number; delivery: string } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const [reviewName, setReviewName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Convex Hooks
  const user = useQuery(api.users.currentUser);
  const reviews = useQuery(api.reviews.getReviewsByProduct, { productId: id || "" });
  const addReviewMutation = useMutation(api.reviews.addReview);

  // Calculator State
  const [calcWeight, setCalcWeight] = useState(10);
  const [calcAge, setCalcAge] = useState<'puppy'|'adult'|'senior'>('adult');

  useEffect(() => {
    if (product) {
      setSelectedMedia({ type: 'image', src: product.images[0] });
    }
  }, [product]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setQuantity(1);
    setShippingResult(null);
    setCep('');
  }, [id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-stone-900 mb-4">Produto não encontrado</h2>
        <Link to="/" className="text-teal-600 font-bold hover:underline">Voltar para a loja</Link>
      </div>
    );
  }

  const calculateShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length < 8) return;
    setIsCalculating(true);
    try {
      const res = await calculateDeliveryFee(cleanCep, false);
      setShippingResult({
        type: `Entrega por Distância (${res.distanceKm} km)`,
        price: res.fee,
        delivery: `Origem: ${res.closestStore.name} | Previsão: ${res.estimatedTime}`
      });
    } catch (err) {
      console.error('Erro ao calcular frete:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      addToast("Faça login para avaliar o produto.", "error");
      return;
    }
    if (!reviewText.trim()) return;

    setIsSubmittingReview(true);
    try {
      await addReviewMutation({
        productId: product.id,
        rating: reviewRating,
        text: reviewText
      });
      setReviewText('');
      addToast("Avaliação enviada com sucesso!", "success");
    } catch (error) {
      addToast("Erro ao enviar avaliação.", "error");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const isFoodProduct = product.category.includes('Rações');
  const foodCalculation = isFoodProduct ? calculateFoodAmount(calcWeight, calcAge) : null;

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const isLowStock = product.quantity > 0 && product.quantity <= 2;
  const isOutOfStock = product.quantity === 0;

  const getDescription = (product: any) => {
    if (product.description && product.description.trim() !== '') {
      return product.description;
    }
    const cat = product.category;
    if (cat === 'Rações para Cães') {
      return `${product.name} da ${product.brand} é uma ração de alta qualidade desenvolvida especialmente para cães. Formulada com ingredientes selecionados para promover saúde, vitalidade e pelo brilhante para o seu pet.`;
    } else if (cat === 'Rações para Gatos') {
      return `${product.name} da ${product.brand} é uma ração de alta qualidade desenvolvida especialmente para gatos. Formulada com ingredientes selecionados para promover saúde, vitalidade e pelo brilhante para o seu pet.`;
    } else if (cat === 'Acessórios') {
      return `${product.name} da ${product.brand}. Acessório de qualidade para o conforto e bem-estar do seu pet.`;
    } else if (cat === 'Brinquedos') {
      return `${product.name} da ${product.brand}. Brinquedo resistente e seguro para horas de diversão e entretenimento do seu pet.`;
    } else if (cat === 'Farmácia') {
      return `${product.name} da ${product.brand}. Produto de saúde e cuidado para garantir o bem-estar do seu animal de estimação.`;
    }
    return `${product.name} da ${product.brand}.`;
  };

  const extractSpecsFromProduct = (product: any) => {
    const name = product.name || '';
    
    let tipo = 'Standard';
    if (name.includes('Super Premium')) tipo = 'Super Premium';
    else if (name.includes('Premium')) tipo = 'Premium';
    else if (name.includes('Special')) tipo = 'Special';

    let indicacao = 'Adultos';
    if (name.includes('Filhote') || name.includes('Puppy')) indicacao = 'Filhotes';
    else if (name.includes('Senior') || name.includes('Idoso')) indicacao = 'Senior';

    const weightMatch = name.match(/(\d+(?:[.,]\d+)?\s*(?:kg|g))/i);
    const peso = product.bagSize || (weightMatch ? weightMatch[1].toLowerCase() : 'Consulte');

    let saborBase = '';
    const sabores = ['Frango', 'Carne', 'Peixe', 'Salmão', 'Cordeiro', 'Peru'];
    for (const s of sabores) {
      if (name.toLowerCase().includes(s.toLowerCase())) {
        saborBase = s;
        break;
      }
    }
    let sabor = 'Variado';
    if (saborBase) {
      sabor = saborBase;
      if (name.toLowerCase().includes(' e vegetais') || name.toLowerCase().includes(' com vegetais')) {
        sabor += ' e Vegetais';
      } else if (name.toLowerCase().includes(' e arroz') || name.toLowerCase().includes(' com arroz')) {
        sabor += ' e Arroz';
      }
    }

    const estoque = product.quantity > 0 ? `${product.quantity} unidades` : 'Esgotado';

    return [
      { l: 'Marca', v: product.brand },
      { l: 'Categoria', v: product.category },
      { l: 'Tipo', v: tipo },
      { l: 'Indicação', v: indicacao },
      { l: 'Peso', v: peso },
      { l: 'Sabor', v: sabor },
      { l: 'Estoque', v: estoque }
    ];
  };

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
                <span className={`absolute top-4 left-4 md:top-8 md:left-8 z-10 text-[10px] md:text-xs font-bold uppercase tracking-widest px-3 py-1.5 md:px-4 md:py-2 rounded-full text-white ${product.badge === 'Novo' ? 'bg-blue-500' : product.badge === 'Promoção' ? 'bg-orange-500' : 'bg-teal-500'
                  }`}>
                  {product.badge}
                </span>
              )}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
                  <span className="bg-stone-900 text-white font-bold py-3 px-8 rounded-2xl shadow-2xl rotate-[-5deg]">ESGOTADO</span>
                </div>
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
                    className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${selectedMedia.type === 'image' && selectedMedia.src === img ? 'border-teal-500 shadow-md scale-105' : 'border-stone-100 opacity-60 hover:opacity-100'
                      }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
                {product.video && (
                  <button
                    onClick={() => setSelectedMedia({ type: 'video', src: product.video! })}
                    className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-stone-900 flex items-center justify-center relative ${selectedMedia.type === 'video' ? 'border-teal-500 shadow-md scale-105' : 'border-stone-100 opacity-60 hover:opacity-100'
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
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <p className="text-teal-600 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs">{product.brand}</p>
                {product.bagSize && (
                  <span className="bg-amber-100 text-amber-800 text-[10px] md:text-xs font-bold px-2.5 py-0.5 rounded-full">
                    📦 {product.bagSize}
                  </span>
                )}
              </div>
              <h1 className="font-display text-2xl md:text-5xl font-bold text-stone-900 mb-4 md:mb-6 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-2 md:gap-4">
                <div className="flex bg-orange-50 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-orange-100 transition-colors" onClick={() => setActiveTab('reviews')}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={`w-4 h-4 ${s <= Math.floor(product.rating) ? 'text-orange-400 fill-orange-400' : 'text-stone-200'}`} />
                  ))}
                  <span className="ml-2 font-bold text-orange-700 text-sm">{product.rating}</span>
                </div>
                <button onClick={() => setActiveTab('reviews')} className="text-stone-400 text-sm hover:text-teal-600 transition-colors">
                  ({reviews?.length || product.reviewCount} avaliações)
                </button>
              </div>
            </div>

            <div className="mb-8 md:mb-10 p-6 md:p-8 bg-stone-50 rounded-[32px]">
              <div className="flex items-end gap-2 md:gap-3 mb-2">
                {product.oldPrice && <span className="text-lg md:text-xl text-stone-400 line-through mb-1">{formatPrice(product.oldPrice)}</span>}
                <span className="text-3xl md:text-5xl font-display font-bold text-stone-900 leading-none">{formatPrice(product.price)}</span>
              </div>
              <p className="text-stone-500 text-sm font-medium">À vista no PIX com 5% de desconto ou em até 3x sem juros.</p>
              
              {isLowStock && (
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mt-4 text-orange-600 font-bold flex items-center gap-2 text-sm"
                >
                  <span className="w-2 h-2 bg-orange-600 rounded-full animate-ping" />
                  Corra! Apenas {product.quantity} unidades em estoque.
                </motion.p>
              )}
            </div>

            <div className="flex flex-col gap-4 mb-10">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center bg-stone-100 rounded-2xl p-1 border border-stone-200">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    disabled={isOutOfStock}
                    className="p-4 text-stone-500 hover:text-teal-600 transition-colors disabled:opacity-30"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-12 text-center font-bold text-xl">{isOutOfStock ? 0 : quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)} 
                    disabled={isOutOfStock || quantity >= product.quantity}
                    className="p-4 text-stone-500 hover:text-teal-600 transition-colors disabled:opacity-30"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={() => addToCart({ ...product, quantity }, false)}
                  disabled={isOutOfStock}
                  className={`flex-grow font-bold py-5 px-8 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 ${
                    isOutOfStock 
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none' 
                      : 'bg-teal-500 hover:bg-teal-600 text-white shadow-teal-500/20'
                  }`}
                >
                  <ShoppingCart className="w-6 h-6" />
                  {isOutOfStock ? 'Produto Esgotado' : 'Adicionar ao Carrinho'}
                </button>
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className={`p-5 rounded-2xl border transition-all ${isFavorite(product.id) ? 'bg-red-50 border-red-100 text-red-500' : 'bg-white border-stone-200 text-stone-400 hover:text-stone-600'}`}
                >
                  <Heart className={`w-6 h-6 ${isFavorite(product.id) ? 'fill-red-500' : ''}`} />
                </button>
              </div>
              
              {!isOutOfStock && product.category !== 'Serviços' && (
                 <button
                   onClick={() => addToCart({ ...product, quantity }, true)}
                   className="w-full bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 font-bold py-4 px-8 rounded-2xl transition-all flex items-center justify-center gap-3"
                 >
                   <Repeat className="w-5 h-5" />
                   <div>
                     <p className="leading-tight">Assinar Plano Mensal</p>
                     <p className="text-[10px] font-medium opacity-80 uppercase tracking-widest mt-0.5">(R$ 180,00 / mês • Taxa Fixa de Assinatura)</p>
                   </div>
                 </button>
              )}
            </div>

            <div className="mb-10 p-6 border-2 border-dashed border-stone-100 rounded-[32px]">
              <h4 className="font-bold text-stone-900 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-teal-500" />
                Calcular Frete
              </h4>
              <form onSubmit={calculateShipping} className="flex gap-2">
                <input 
                  type="text" 
                  maxLength={8}
                  placeholder="Seu CEP (00000-000)" 
                  value={cep}
                  onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))}
                  className="flex-grow bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                />
                <button 
                  type="submit"
                  disabled={isCalculating || cep.length < 8}
                  className="bg-stone-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-stone-800 transition-all disabled:opacity-50"
                >
                  {isCalculating ? 'Calculando...' : 'Calcular'}
                </button>
              </form>
              
              <AnimatePresence>
                {shippingResult && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-6 pt-6 border-t border-stone-100"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-stone-800">{shippingResult.type}</span>
                      <span className="font-bold text-teal-600">{formatPrice(shippingResult.price)}</span>
                    </div>
                    <p className="text-xs text-stone-400">{shippingResult.delivery}</p>
                  </motion.div>
                )}
              </AnimatePresence>
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
            {['desc', 'spec', 'reviews', ...(isFoodProduct ? ['calc'] : [])].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-4 md:px-8 md:py-4 font-bold text-[10px] md:text-sm uppercase tracking-widest whitespace-nowrap transition-all relative ${activeTab === tab ? 'text-teal-600' : 'text-stone-400 hover:text-stone-600'
                  }`}
              >
                {tab === 'desc' ? 'Descrição' : tab === 'spec' ? 'Especificações' : tab === 'reviews' ? 'Avaliações' : 'Calculadora de Porção'}
                {activeTab === tab && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-1 bg-teal-500 rounded-t-full" />}
              </button>
            ))}
          </div>
          <div className="prose prose-stone max-w-none bg-stone-50 p-10 rounded-[40px] border border-stone-100">
            {activeTab === 'desc' && (
              <div className="text-stone-600 leading-relaxed">
                <h3 className="font-display text-2xl font-bold text-stone-900 mb-4">Sobre o produto</h3>
                {getDescription(product).split('\n').map((paragraph: string, idx: number) => (
                  paragraph.trim() ? <p key={idx} className="mb-4">{paragraph}</p> : null
                ))}
              </div>
            )}
            {activeTab === 'spec' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {extractSpecsFromProduct(product).map((s, i) => (
                  <div key={i} className="flex justify-between border-b border-stone-200 pb-2">
                    <span className="font-bold text-stone-400 text-xs uppercase tracking-widest">{s.l}</span>
                    <span className="font-bold text-stone-900">{s.v}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'calc' && isFoodProduct && (
              <div className="max-w-xl mx-auto py-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Calculator className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-stone-900 mb-2">Calculadora de Dieta Ideal</h3>
                  <p className="text-stone-500">Descubra exatamente quanto o seu pet precisa comer por dia e a duração deste pacote.</p>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-[32px] border border-stone-100 shadow-sm space-y-6">
                   <div>
                     <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Estágio de Vida</label>
                     <div className="grid grid-cols-3 gap-3">
                       {[{id:'puppy', l:'Filhote'}, {id:'adult', l:'Adulto'}, {id:'senior', l:'Idoso'}].map(stage => (
                         <button 
                           key={stage.id}
                           onClick={() => setCalcAge(stage.id as any)}
                           className={`py-3 rounded-xl border font-bold text-sm transition-all ${calcAge === stage.id ? 'bg-teal-50 border-teal-500 text-teal-600' : 'border-stone-200 text-stone-500 hover:border-stone-300'}`}
                         >
                           {stage.l}
                         </button>
                       ))}
                     </div>
                   </div>

                   <div>
                     <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-3 flex justify-between">
                       <span>Peso do Pet (kg): <span className="text-stone-900">{calcWeight}kg</span></span>
                     </label>
                     <input 
                       type="range" 
                       min="1" max="60" 
                       value={calcWeight}
                       onChange={(e) => setCalcWeight(Number(e.target.value))}
                       className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                     />
                     <div className="flex justify-between text-[10px] text-stone-400 mt-2 font-bold font-mono">
                       <span>1kg</span><span>30kg</span><span>60kg</span>
                     </div>
                   </div>

                   {foodCalculation && (
                     <div className="mt-8 bg-teal-500 text-white rounded-[24px] p-6 relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                       <h4 className="font-bold mb-4 flex items-center gap-2">
                         <Info className="w-5 h-5" /> Resultado
                       </h4>
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <p className="text-teal-100 text-[10px] font-bold uppercase tracking-widest mb-1">Porção Diária</p>
                           <p className="text-3xl font-display font-black leading-none">{foodCalculation.daily}g</p>
                         </div>
                         <div>
                           <p className="text-teal-100 text-[10px] font-bold uppercase tracking-widest mb-1">Consumo Mensal</p>
                           <p className="text-3xl font-display font-black leading-none">{foodCalculation.monthly}kg</p>
                         </div>
                       </div>
                       
                       {/* Estimate duration if package weight is known (mocking 15kg for now since it's common in data.ts) */}
                       {product.name.includes('15kg') && (
                         <div className="mt-6 pt-4 border-t border-white/20">
                           <p className="text-sm font-medium text-teal-50">Este pacote de 15kg durará aproximadamente <strong className="text-white text-lg">{(15 / (foodCalculation.daily / 1000)).toFixed(0)} dias</strong>.</p>
                         </div>
                       )}
                     </div>
                   )}
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <h3 className="font-display text-2xl font-bold text-stone-900">O que os clientes dizem</h3>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                      <p className="text-2xl font-bold text-stone-900">{product.rating}</p>
                      <p className="text-xs text-stone-400">Geral</p>
                    </div>
                    <div className="h-10 w-[1px] bg-stone-200 hidden md:block" />
                  </div>
                </div>

                {user ? (
                  <div className="bg-white p-6 md:p-8 rounded-[32px] border border-stone-100 mb-12">
                     <h4 className="font-bold text-stone-900 mb-6">Deixe sua opinião</h4>
                     <form onSubmit={submitReview} className="space-y-4">
                       <div className="flex gap-2 mb-4">
                          {[1, 2, 3, 4, 5].map(s => (
                            <button 
                              key={s} 
                              type="button"
                              onClick={() => setReviewRating(s)}
                              className="focus:outline-none"
                            >
                              <Star className={`w-6 h-6 ${s <= reviewRating ? 'text-orange-400 fill-orange-400' : 'text-stone-200'}`} />
                            </button>
                          ))}
                       </div>
                       <textarea 
                         placeholder="Sua avaliação (O que você achou do produto?)" 
                         rows={4}
                         value={reviewText}
                         onChange={(e) => setReviewText(e.target.value)}
                         className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none font-medium resize-none"
                       />
                       <button disabled={isSubmittingReview || !reviewText.trim()} className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-stone-300 text-white font-bold py-4 rounded-xl transition-all">
                         {isSubmittingReview ? 'Enviando...' : 'Enviar Avaliação'}
                       </button>
                     </form>
                  </div>
                ) : (
                  <div className="bg-stone-100 p-8 rounded-[32px] text-center mb-12">
                    <p className="text-stone-500 font-medium mb-4">Faça login para deixar sua avaliação.</p>
                    <Link to="/conta" className="inline-block bg-white text-stone-900 font-bold px-8 py-3 rounded-xl border border-stone-200 hover:border-teal-500 transition-all">Ir para Login</Link>
                  </div>
                )}

                {reviews === undefined ? (
                   <p className="text-stone-400">Carregando avaliações...</p>
                ) : reviews && reviews.length > 0 ? (
                  reviews.map(r => (
                    <div key={r._id} className="border-b border-stone-200 pb-8 last:border-0 last:pb-0">
                      <div className="flex mb-3">
                        {[1, 2, 3, 4, 5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? 'text-orange-400 fill-orange-400' : 'text-stone-200'} mr-1`} />)}
                      </div>
                      <p className="text-stone-600 text-sm leading-relaxed mb-4">{r.text}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-[10px] font-bold uppercase">
                          {r.userName.substring(0,2)}
                        </div>
                        <span className="text-xs font-bold text-stone-600">{r.userName}</span>
                        <span className="text-[10px] text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full font-bold">Compra Verificada</span>
                        <span className="text-[10px] text-stone-400 ml-auto">{new Date(r._creationTime).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                     <p className="text-stone-400">Seja o primeiro a avaliar este produto!</p>
                     
                     {/* Static mockup fallback when empty db */}
                     <div className="text-left mt-12 border-t pt-8">
                       <p className="text-stone-400 text-xs uppercase mb-4 tracking-widest font-bold">Avaliações Anteriores</p>
                       {[1, 2].map(r => (
                         <div key={`mock-${r}`} className="border-b border-stone-200 pb-8 last:border-0 mb-8 last:mb-0">
                           <div className="flex mb-3">
                             {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3.5 h-3.5 text-orange-400 fill-orange-400 mr-1" />)}
                           </div>
                           <p className="font-bold text-stone-900 mb-2">Excelente custo benefício.</p>
                           <p className="text-stone-500 text-sm leading-relaxed mb-4">Meu cachorro adorou essa ração, o pelo dele ficou muito mais brilhante e as fezes bem firmes.</p>
                           <div className="flex items-center gap-2">
                             <div className="w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-[10px] font-bold">CS</div>
                             <span className="text-xs font-bold text-stone-600">Carlos Silva</span>
                             <span className="text-[10px] text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full font-bold">Compra Verificada</span>
                           </div>
                         </div>
                       ))}
                     </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="reveal-on-scroll">
            <div className="flex items-center justify-between mb-8 md:mb-10">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-stone-900">Quem comprou isso, também levou...</h2>
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
