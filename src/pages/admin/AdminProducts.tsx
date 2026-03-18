import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit3, ArrowLeft, Package } from 'lucide-react';
import { useAdmin } from './adminContext';

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
    <div className="space-y-10 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-stone-500 hover:text-stone-900 font-bold text-xl"
          >
            <ArrowLeft className="w-6 h-6" />
            Voltar para o Início
          </button>
          <h1 className="text-4xl font-black text-stone-900">Meus Produtos Cadastrados</h1>
          <p className="text-xl text-stone-500">Confira se tudo está certo e mude os preços se precisar.</p>
        </div>

        <button 
          onClick={() => navigate('/admin/novo-produto')}
          className="admin-button-primary"
        >
          + Adicionar Novo
        </button>
      </div>

      <div className="space-y-6">
        {products.length === 0 ? (
          <div className="admin-card text-center py-20 space-y-6">
            <Package className="w-24 h-24 text-stone-200 mx-auto" />
            <p className="text-2xl text-stone-400 font-bold">Você ainda não cadastrou nenhum produto.</p>
            <button 
              onClick={() => navigate('/admin/novo-produto')}
              className="text-teal-600 text-2xl font-black hover:underline"
            >
              Clique aqui para começar agora!
            </button>
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="admin-card flex flex-col md:flex-row items-center gap-8">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-[30px] shadow-sm bg-stone-100" 
              />
              
              <div className="flex-grow space-y-4 text-center md:text-left">
                <h3 className="text-3xl font-black text-stone-900">{product.name}</h3>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-8">
                  <div className="space-y-1">
                    <span className="text-stone-400 font-bold text-sm uppercase tracking-wider block">Preço</span>
                    {editingId === product.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black">R$</span>
                        <input
                          type="number"
                          className="admin-input !w-32 !mt-0 !py-2"
                          value={newPrice}
                          onChange={e => setNewPrice(e.target.value)}
                        />
                        <button 
                          onClick={() => handleSavePrice(product.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold"
                        >
                          OK
                        </button>
                      </div>
                    ) : (
                      <span className="text-3xl font-black text-teal-600">
                        R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-stone-400 font-bold text-sm uppercase tracking-wider block">Estoque</span>
                    <span className="text-3xl font-black text-stone-700">{product.quantity} unidades</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => handleEdit(product.id, product.price)}
                  className="flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-6 py-4 rounded-2xl font-bold text-xl transition-colors"
                >
                  <Edit3 className="w-6 h-6" />
                  Editar Preço
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm(`Tem certeza que deseja APAGAR o produto "${product.name}"?`)) {
                      deleteProduct(product.id);
                    }
                  }}
                  className="flex items-center gap-2 bg-red-50 text-red-500 hover:bg-red-100 px-6 py-4 rounded-2xl font-bold text-xl transition-colors"
                >
                  <Trash2 className="w-6 h-6" />
                  Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
