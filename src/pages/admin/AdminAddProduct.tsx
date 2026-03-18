import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAdmin } from './adminContext';

export const AdminAddProduct = () => {
  const navigate = useNavigate();
  const { addProduct } = useAdmin();
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
  });
  
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    addProduct({
      name: formData.name,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity) || 0,
      image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400' // Mock image
    });

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate('/admin/meus-produtos');
    }, 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 py-8">
      <button 
        onClick={() => navigate('/admin')}
        className="flex items-center gap-2 text-stone-500 hover:text-stone-900 font-bold text-xl mb-4"
      >
        <ArrowLeft className="w-6 h-6" />
        Voltar para o Início
      </button>

      <div className="space-y-4">
        <h1 className="text-4xl font-black text-stone-900">Preencha os dados do Produto</h1>
        <p className="text-xl text-stone-500">Escreva o nome e o preço com calma. Não se preocupe em errar.</p>
      </div>

      {showSuccess && (
        <div className="success-message flex items-center justify-center gap-4">
          <CheckCircle2 className="w-10 h-10" />
          <span className="text-2xl">PRONTO! O produto foi salvo com sucesso.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-card space-y-8">
        <div className="space-y-4">
          <label className="admin-label block">Nome do Produto (Ex: Ração Golden 15kg)</label>
          <input
            type="text"
            required
            placeholder="Ex: Ração para Gatos Filtro"
            className="admin-input"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="admin-label block">Preço de Venda (R$)</label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="0,00"
              className="admin-input"
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          <div className="space-y-4">
            <label className="admin-label block">Quantos temos na loja agora?</label>
            <input
              type="number"
              required
              placeholder="Ex: 10"
              className="admin-input"
              value={formData.quantity}
              onChange={e => setFormData({ ...formData, quantity: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="admin-label block">Foto do Produto</label>
          <div className="border-4 border-dashed border-stone-200 rounded-3xl p-10 flex flex-col items-center gap-4 bg-stone-50">
            <Camera className="w-16 h-16 text-stone-300" />
            <button type="button" className="text-teal-600 font-bold text-xl hover:underline">
              Clique aqui para Adicionar Foto
            </button>
            <p className="text-stone-400">A foto ajuda os clientes a comprarem melhor.</p>
          </div>
        </div>

        <div className="pt-6">
          <button type="submit" className="admin-button-primary w-full flex items-center justify-center gap-4">
            <span className="text-3xl">✅</span>
            Salvar Produto no Site
          </button>
        </div>
      </form>
    </div>
  );
};
