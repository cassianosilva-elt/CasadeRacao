import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, X } from 'lucide-react';

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie_consent', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-50"
        >
          <div className="bg-white p-6 rounded-3xl shadow-2xl border border-stone-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-teal-500"></div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-teal-50 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 mb-2">Cookies & Privacidade</h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  Usamos cookies para melhorar sua experiência em nosso site. Ao navegar, você concorda com nossos termos.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={acceptCookies}
                    className="bg-stone-900 text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-stone-800 transition-colors"
                  >
                    Aceitar Todos
                  </button>
                  <button
                    onClick={() => setIsVisible(false)}
                    className="text-stone-400 hover:text-stone-600 transition-colors"
                    aria-label="Fechar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
