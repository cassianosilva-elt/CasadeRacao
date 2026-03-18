import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PackagePlus, ClipboardList, BadgeDollarSign, Lightbulb } from 'lucide-react';
import { motion } from 'motion/react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const AdminHome = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Adicionar Produto',
      description: 'Coloque um novo item na loja.',
      icon: <PackagePlus className="w-10 h-10 text-teal-600" />,
      path: '/admin/novo-produto',
      bgColor: 'bg-teal-50',
      hoverBorder: 'hover:border-teal-300'
    },
    {
      title: 'Meus Produtos',
      description: 'Gerencie estoque e preços.',
      icon: <ClipboardList className="w-10 h-10 text-blue-600" />,
      path: '/admin/meus-produtos',
      bgColor: 'bg-blue-50',
      hoverBorder: 'hover:border-blue-300'
    },
    {
      title: 'Vendas e Pedidos',
      description: 'Acompanhe compras.',
      icon: <BadgeDollarSign className="w-10 h-10 text-orange-600" />,
      path: '/admin/vendas',
      bgColor: 'bg-orange-50',
      hoverBorder: 'hover:border-orange-300'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="font-display text-3xl font-black text-stone-900">Visão Geral</h1>
        <p className="text-base text-stone-500">O que você deseja gerenciar hoje?</p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      >
        {menuItems.map((item) => (
          <motion.button
            variants={itemVariants}
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`admin-card text-left flex flex-col items-start gap-4 ${item.hoverBorder} group relative overflow-hidden`}
          >
            <div className={`p-4 rounded-2xl ${item.bgColor} group-hover:scale-110 transition-transform duration-300 relative z-10`}>
              {item.icon}
            </div>
            <div className="relative z-10">
              <h2 className="text-lg font-bold text-stone-900 mb-1">{item.title}</h2>
              <p className="text-sm text-stone-500">
                {item.description}
              </p>
            </div>
          </motion.button>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12 p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4"
      >
        <div className="p-3 bg-amber-100 rounded-xl text-amber-600 shrink-0">
          <Lightbulb className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-amber-900 mb-1">Dica de Sucesso:</h3>
          <p className="text-sm text-amber-800">
            Confira as informações, preço e fotos antes de salvar o produto.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
