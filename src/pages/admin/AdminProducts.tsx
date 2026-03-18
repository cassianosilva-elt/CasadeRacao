import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit3, ArrowLeft, Package, Plus } from 'lucide-react';
import { useAdmin } from './adminContext';
import { motion } from 'motion/react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export const AdminProducts = () => {
  const navigate = useNavigate();
  const { products, deleteProduct, updateProductPrice } = useAdmin();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState('');

  const handleEdit = (id: string, currentPrice: number) => {
    setEditingId(id);
    setNewPrice(currentPrice.toString());
  };

  const handleSavePrice = (id: string) => {
    updateProductPrice(id, parseFloat(newPrice));
    setEditingId(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-6">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="space-y-1">
          <button 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-stone-500 hover:text-stone-900 font-bold text-sm mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <h1 className="text-2xl font-black text-stone-900 font-display">Meus Produtos</h1>
          <p className="text-sm text-stone-500">Gerencie seu estoque e preços.</p>
        </div>

        <button 
          onClick={() => navigate('/admin/novo-produto')}
          className="admin-button-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Adicionar Novo
        </button>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {products.length === 0 ? (
          <motion.div variants={itemVariants} className="admin-card text-center py-12 space-y-4">
            <Package className="w-12 h-12 text-stone-200 mx-auto" />
            <p className="text-base text-stone-400 font-medium">Você ainda não cadastrou nenhum produto.</p>
            <button 
              onClick={() => navigate('/admin/novo-produto')}
              className="text-teal-600 text-sm font-bold hover:underline"
            >
              Clique aqui para começar agora!
            </button>
          </motion.div>
        ) : (
          products.map((product) => (
            <motion.div 
              variants={itemVariants} 
              key={product.id} 
              className="admin-card !p-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
            >
              <img 
                src={product.images[0] || 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400'} 
                alt={product.name} 
                className="w-24 h-24 object-cover rounded-2xl shadow-sm bg-stone-50 shrink-0" 
              />
              
              <div className="flex-grow space-y-2 text-center sm:text-left w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h3 className="text-lg font-black text-stone-900 leading-tight">{product.name}</h3>
                  <span className="inline-block bg-teal-50 text-teal-600 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider self-center sm:self-auto shrink-0">
                    {product.category}
                  </span>
                </div>
                
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-8">
                  <div className="space-y-0.5">
                    <span className="text-stone-400 font-bold text-[10px] uppercase tracking-wider block">Preço</span>
                    {editingId === product.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black">R$</span>
                        <input
                          type="number"
                          className="admin-input !w-24 !mt-0 !py-1 !text-sm"
                          value={newPrice}
                          onChange={e => setNewPrice(e.target.value)}
                        />
                        <button 
                          onClick={() => handleSavePrice(product.id)}
                          className="bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-green-700 transition-colors"
                        >
                          OK
                        </button>
                      </div>
                    ) : (
                      <span className="text-lg font-black text-teal-600 font-display">
                        {useAdmin().formatPrice(product.price)}
                      </span>
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-stone-400 font-bold text-[10px] uppercase tracking-wider block">Estoque</span>
                    <span className="text-lg font-black text-stone-700 font-display">{product.quantity} un.</span>
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <button 
                  onClick={() => handleEdit(product.id, product.price)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Editar</span> Preço
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm(`Tem certeza que deseja apagar "${product.name}"?`)) {
                      deleteProduct(product.id);
                    }
                  }}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-red-50 text-red-500 hover:bg-red-100 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Excluir
                </button>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};
