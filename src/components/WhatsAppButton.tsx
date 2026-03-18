import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const WhatsAppButton = () => {
  return (
    <motion.a
      href="https://wa.me/5511948219786"
      target="_blank"
      rel="noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-colors group"
      aria-label="Falar conosco no WhatsApp"
    >
      <div className="absolute -top-12 right-0 bg-stone-900 text-white text-xs py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Como podemos ajudar?
        <div className="absolute -bottom-1 right-5 w-2 h-2 bg-stone-900 rotate-45"></div>
      </div>
      <MessageCircle className="w-6 h-6" />
      <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20 pointer-events-none"></span>
    </motion.a>
  );
};
