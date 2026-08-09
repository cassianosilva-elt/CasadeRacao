import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Gift, Sparkles, ArrowRight, Copy, Check } from 'lucide-react';
import { useToast } from '../ToastContext';

const COUPON_CODE = 'PRIMEIRA10';

export const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const hasSeen = localStorage.getItem('hasSeenWelcomePopup');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenWelcomePopup', 'true');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(COUPON_CODE);
    setCopied(true);
    addToast(`Cupom ${COUPON_CODE} copiado!`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-stone-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-[40px] shadow-2xl max-w-lg w-full overflow-hidden relative"
          >
            <button 
              onClick={closePopup}
              className="absolute top-6 right-6 p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-all z-10"
            >
              <X className="w-5 h-5 text-stone-600" />
            </button>

            <div className="relative aspect-video bg-teal-500 flex items-center justify-center overflow-hidden">
               <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
               </div>
               <motion.div
                 animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                 transition={{ repeat: Infinity, duration: 4 }}
               >
                 <Gift className="w-24 h-24 text-white drop-shadow-2xl" />
               </motion.div>
               <Sparkles className="absolute top-10 right-10 w-8 h-8 text-white/40 animate-pulse" />
            </div>

            <div className="p-10 text-center">
              <h2 className="font-display text-3xl font-black text-stone-900 mb-4 tracking-tight">Bem-vindo à Família LOPES!</h2>
              <p className="text-stone-500 mb-8 leading-relaxed">
                Preparamos um presente especial para a sua primeira compra. Use o cupom abaixo no carrinho e garanta <strong className="text-stone-900">10% de desconto</strong>:
              </p>
              
              <button
                onClick={handleCopy}
                className="w-full bg-orange-50 border-2 border-dashed border-orange-200 p-6 rounded-3xl mb-8 group cursor-pointer relative overflow-hidden hover:bg-orange-100 transition-colors"
              >
                  <div className="relative z-10">
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] mb-2">Seu Código de Desconto — Clique para copiar</p>
                    <p className="text-4xl font-display font-black text-orange-700 tracking-tighter">{COUPON_CODE}</p>
                  </div>
                  <div className="absolute top-4 right-4 z-10">
                    {copied ? (
                      <div className="flex items-center gap-1 bg-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        <Check className="w-3.5 h-3.5" />
                        Copiado!
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 bg-white text-stone-500 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-colors">
                        <Copy className="w-3.5 h-3.5" />
                        Copiar
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-white/40 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </button>

              <div className="space-y-4">
                <button 
                  onClick={() => { handleCopy(); closePopup(); }}
                  className="w-full bg-teal-500 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-teal-600 transition-all shadow-xl shadow-teal-500/20"
                >
                  Copiar e Começar a Comprar
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Válido apenas para novos clientes • 10% OFF</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
