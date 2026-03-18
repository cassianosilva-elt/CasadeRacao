import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-24">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-[120px] md:text-[180px] font-display font-black text-stone-100 leading-none relative mb-8"
        >
          404
          <div className="absolute inset-0 flex items-center justify-center text-4xl md:text-5xl">
            <span role="img" aria-label="Cachorro triste" className="animate-bounce">🐶</span>
          </div>
        </motion.div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-stone-900 mb-4">Página não encontrada</h1>
        <p className="text-stone-500 mb-12 max-w-md mx-auto">
          Ops! Parece que o pet farejou o caminho errado. A página que você procura não existe ou foi movida.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 px-8 rounded-full transition-all shadow-lg shadow-teal-500/20"
          >
            <Home className="w-5 h-5" />
            Volar para o Início
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-stone-600 hover:text-stone-900 font-bold py-4 px-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Página anterior
          </button>
        </div>
      </div>
    </div>
  );
};
