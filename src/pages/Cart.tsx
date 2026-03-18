import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useCart } from '../CartContext';
import { ShoppingCart, Minus, Plus, Trash2, CheckCircle, Ticket, MapPin, ArrowRight, Loader2 } from 'lucide-react';

export const Cart = () => {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  // Cupom
  const [couponCode, setCouponCode] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<{code: string, discount: number} | null>(null);
  const [couponError, setCouponError] = useState('');

  // Checkout
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponCode.toUpperCase();
    if (code === 'LOPES10') {
      setActiveCoupon({ code: 'LOPES10', discount: 0.1 });
    } else if (code === 'PRIMEIRACOMPRA') {
      setActiveCoupon({ code: 'PRIMEIRACOMPRA', discount: 0.15 });
    } else {
      setCouponError('Cupom inválido ou expirado.');
    }
  };

  const discountAmount = activeCoupon ? total * activeCoupon.discount : 0;
  const finalTotal = total - discountAmount;

  if (checkoutSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"
        >
          <CheckCircle className="w-12 h-12" />
        </motion.div>
        <h1 className="font-display text-4xl font-bold text-stone-900 mb-4">Pedido Confirmado!</h1>
        <p className="text-stone-600 mb-12 text-lg">Obrigado por comprar na Casa de Ração LOPES. Em breve você receberá as atualizações por WhatsApp.</p>
        <Link to="/" className="inline-block bg-stone-900 hover:bg-stone-800 text-white font-bold py-4 px-10 rounded-full transition-all shadow-xl shadow-stone-900/20">Continuar Comprando</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="flex items-center gap-4 mb-10">
        <h1 className="font-display text-3xl md:text-5xl font-bold text-stone-900">Seu Carrinho</h1>
        <div className="h-px flex-grow bg-stone-100"></div>
      </div>
      
      {items.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[40px] border border-stone-100 shadow-sm">
          <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-10 h-10 text-stone-300" />
          </div>
          <p className="text-stone-500 text-xl mb-8">Seu carrinho está vazio no momento.</p>
          <Link to="/" className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 px-10 rounded-full transition-all shadow-lg shadow-teal-500/20">Explorar Produtos</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
              <>
                {items.map(item => (
                  <div key={item.id} className="flex flex-col sm:flex-row items-center bg-white p-4 sm:p-6 rounded-3xl border border-stone-100 shadow-sm gap-4 sm:gap-8 group">
                    <img src={item.image} alt={item.name} className="w-24 h-24 sm:w-28 sm:h-28 object-contain rounded-xl sm:rounded-2xl mix-blend-multiply bg-stone-50 group-hover:scale-105 transition-transform" loading="lazy" />
                    <div className="flex-grow text-center sm:text-left">
                      <p className="text-teal-600 text-[10px] font-bold uppercase tracking-widest mb-1">{item.brand}</p>
                      <h2 className="font-bold text-stone-900 text-base sm:text-lg mb-1 sm:mb-2 leading-tight">{item.name}</h2>
                      <p className="font-display font-bold text-lg sm:text-xl text-stone-900">{item.priceFormatted}</p>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6 mt-2 sm:mt-0">
                      <div className="flex items-center bg-stone-50 rounded-2xl border border-stone-100 p-1">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 text-stone-400 hover:text-teal-600 transition-colors"><Minus className="w-4 h-4" /></button>
                        <span className="w-8 sm:w-10 text-center font-bold text-stone-700">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 text-stone-400 hover:text-teal-600 transition-colors"><Plus className="w-4 h-4" /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="p-3 text-stone-300 hover:text-red-500 transition-colors bg-white border border-stone-100 rounded-2xl shadow-sm hover:border-red-100"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                ))}
                
                <div className="bg-teal-50 p-5 sm:p-6 rounded-[24px] sm:rounded-3xl border border-teal-100 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-3 sm:gap-4 text-teal-800">
                    <Ticket className="w-6 h-6" />
                    <p className="font-bold text-sm sm:text-base">Tem um cupom?</p>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <input 
                      type="text" 
                      placeholder="CÓDIGO" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="bg-white border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none w-full md:w-32 font-bold"
                    />
                    <button onClick={handleApplyCoupon} className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 sm:px-6 py-3 rounded-2xl transition-all text-sm sm:text-base">Aplicar</button>
                  </div>
                </div>
                {couponError && <p className="text-red-500 text-sm font-bold ml-4">{couponError}</p>}
                {activeCoupon && <p className="text-teal-600 text-sm font-bold ml-4 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Cupom {activeCoupon.code} aplicado!</p>}
              </>
          </div>

          <div className="bg-stone-900 p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] shadow-2xl h-fit sticky top-24">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8">Resumo</h2>
            <div className="space-y-4 mb-6 sm:mb-8 text-stone-300 text-sm sm:text-base">
              <div className="flex justify-between"><span>Subtotal</span><span>R$ {total.toFixed(2).replace('.', ',')}</span></div>
              {activeCoupon && (
                <div className="flex justify-between text-teal-400">
                  <span>Desconto ({activeCoupon.discount*100}%)</span>
                  <span>- R$ {discountAmount.toFixed(2).replace('.', ',')}</span>
                </div>
              )}
              <div className="flex justify-between"><span>Frete</span><span className="text-teal-500 font-bold uppercase text-xs tracking-widest">Grátis SP</span></div>
              <div className="border-t border-stone-800 pt-6 flex justify-between font-bold text-xl sm:text-2xl text-white">
                <span>Total</span><span>R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
            
              <Link 
                to="/checkout"
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 sm:py-5 rounded-2xl transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                Finalizar Compra
                <ArrowRight className="w-5 h-5" />
              </Link>

            <p className="text-[10px] text-stone-500 mt-6 text-center leading-relaxed">
              Ao finalizar, você será notificado no WhatsApp sobre o status do seu pedido e pagamento.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

