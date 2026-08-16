import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Camera, CheckCircle2, ArrowLeft, X, Save, Edit3, Scale } from 'lucide-react';
import { useAdmin, CATEGORIES } from './adminContext';
import { motion, AnimatePresence } from 'motion/react';

export const AdminAddProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { products, addProduct, updateProduct } = useAdmin();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    category: CATEGORIES[0],
    brand: '',
    bagSize: '',
    images: ['', '', ''] as string[],
    video: '',
    description: '',
  });
  

  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (isEditing && products.length > 0) {
      const product = products.find(p => p.id === id);
      if (product) {
        setFormData({
          name: product.name,
          price: product.price.toString(),
          quantity: product.quantity.toString(),
          category: product.category,
          brand: product.brand,
          bagSize: product.bagSize || '',
          images: [
            product.images[0] || '',
            product.images[1] || '',
            product.images[2] || '',
          ],
          video: product.video || '',
          description: product.description || '',
        });
      }
    }
  }, [isEditing, id, products]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || isSubmitting) return;

    setIsSubmitting(true);

    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity) || 0,
      category: formData.category,
      brand: formData.brand || 'Marca Própria',
      bagSize: formData.bagSize || undefined,
      images: formData.images.filter(img => img.trim() !== ''),
      video: formData.video,
      description: formData.description || undefined,
      rating: 5,
      reviewCount: 0,
    };

    if (isEditing && id) {
      updateProduct(id, productData);
    } else {
      addProduct(productData);
    }

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate('/admin/meus-produtos');
    }, 600);
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...formData.images];
        newImages[index] = reader.result as string;
        setFormData(prev => ({ ...prev, images: newImages }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, video: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-6 py-6"
    >
      <button 
        onClick={() => navigate('/admin')}
        className="flex items-center gap-2 text-stone-500 hover:text-stone-900 font-bold text-sm mb-2 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>

      <div className="space-y-1">
        <h1 className="text-2xl font-black text-stone-900 font-display">
          {isEditing ? 'Editar Produto' : 'Adicionar Produto'}
        </h1>
        <p className="text-sm text-stone-500">
          {isEditing ? 'Atualize as informações do item.' : 'Preencha os dados do novo item.'}
        </p>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="success-message flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm">Produto salvo com sucesso! Redirecionando...</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="admin-card space-y-6">
        <div className="space-y-2">
          <label className="admin-label block">Nome do Produto</label>
          <input
            type="text"
            required
            placeholder="Ex: Ração Golden 15kg"
            className="admin-input"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-2">
            <label className="admin-label block">Categoria</label>
            <select
              required
              className="admin-input cursor-pointer"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="admin-label block">Marca</label>
            <input
              type="text"
              required
              placeholder="Ex: Premier"
              className="admin-input"
              value={formData.brand}
              onChange={e => setFormData({ ...formData, brand: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-3 p-4 bg-stone-50/80 rounded-2xl border border-stone-200/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <label className="admin-label block text-stone-900 font-bold flex items-center gap-2">
              <Scale className="w-4 h-4 text-teal-600" />
              Tamanho do Saco de Ração
            </label>
            <span className="text-xs text-stone-400 font-medium">Selecione uma opção ou informe o peso</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {['10kg', '15kg', '20kg'].map(size => {
              const isSelected = formData.bagSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setFormData({ ...formData, bagSize: isSelected ? '' : size })}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 scale-105 ring-2 ring-teal-600 ring-offset-1'
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-teal-500'}`}></span>
                  {size}
                </button>
              );
            })}

            <div className="flex-1 min-w-[150px]">
              <input
                type="text"
                placeholder="Outro peso (ex: 3kg, 25kg)"
                className="admin-input text-sm py-2"
                value={['10kg', '15kg', '20kg'].includes(formData.bagSize) ? '' : formData.bagSize}
                onChange={e => setFormData({ ...formData, bagSize: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-2">
            <label className="admin-label block">Preço de Venda (R$)</label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              className="admin-input font-mono"
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="admin-label block">Quantidade em Estoque</label>
            <input
              type="number"
              required
              placeholder="0"
              className="admin-input font-mono"
              value={formData.quantity}
              onChange={e => setFormData({ ...formData, quantity: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="admin-label block">Descrição do Produto (Opcional)</label>
          <textarea
            placeholder="Descreva o produto, ingredientes, benefícios, etc."
            className="admin-input min-h-[120px] resize-y"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
          <p className="text-xs text-stone-400 font-medium pl-1">A descrição será exibida na página do produto. Se não preenchida, será gerada automaticamente.</p>
        </div>

        <div className="space-y-3">
          <label className="admin-label block text-stone-900">Fotos do Produto (Máx 3)</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[0, 1, 2].map(index => (
              <div key={index} className="space-y-2 group">
                <div className="relative min-h-[140px] rounded-2xl overflow-hidden bg-stone-50 border-2 border-dashed border-stone-200 group-hover:border-teal-400 transition-colors flex items-center justify-center">
                  {formData.images[index] ? (
                    <>
                      <img src={formData.images[index]} alt={`Preview ${index + 1}`} className="w-full h-full object-contain max-h-[220px]" />
                      <button 
                        type="button"
                        onClick={() => {
                          const newImages = [...formData.images];
                          newImages[index] = '';
                          setFormData({ ...formData, images: newImages });
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm text-red-500 rounded-full shadow-sm hover:bg-red-50 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <Camera className="w-6 h-6 text-stone-300 mx-auto mb-1" />
                      <p className="text-stone-400 text-[10px] font-medium uppercase tracking-wider">Upload</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={e => handleFileChange(index, e)}
                  />
                </div>
                
                <input
                  type="text"
                  placeholder="Ou cole o link"
                  className="admin-input text-xs py-2"
                  value={formData.images[index].startsWith('data:') ? 'Imagem carregada' : formData.images[index]}
                  readOnly={formData.images[index].startsWith('data:')}
                  onChange={e => {
                    const newImages = [...formData.images];
                    newImages[index] = e.target.value;
                    setFormData({ ...formData, images: newImages });
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-stone-100">
          <label className="admin-label block text-stone-900">Vídeo Curto (Opcional)</label>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="w-full sm:w-32 aspect-[9/16] rounded-2xl overflow-hidden bg-stone-900 border-2 border-dashed border-stone-700 relative flex items-center justify-center shrink-0">
              {formData.video ? (
                <>
                  <video src={formData.video} className="w-full h-full object-cover" controls />
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, video: '' })}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm text-red-500 rounded-full shadow-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <div className="w-8 h-8 bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-1">
                    <CheckCircle2 className="w-4 h-4 text-stone-500" />
                  </div>
                  <p className="text-stone-500 text-[10px] uppercase">MP4</p>
                </div>
              )}
              <input
                type="file"
                accept="video/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleVideoChange}
              />
            </div>
            <div className="flex-grow space-y-2 w-full">
              <p className="text-stone-500 text-xs leading-relaxed">
                Recomendamos vídeos verticais (formato Story) de até 15 segundos para melhor engajamento.
              </p>
              <input
                type="text"
                placeholder="Ou cole o link do vídeo"
                className="admin-input text-xs"
                value={formData.video.startsWith('data:') ? 'Vídeo carregado' : formData.video}
                readOnly={formData.video.startsWith('data:')}
                onChange={e => setFormData({ ...formData, video: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button type="submit" disabled={isSubmitting} className="admin-button-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer">
            {isEditing ? <Edit3 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar Produto' : 'Salvar Produto'}
          </button>
        </div>
      </form>


    </motion.div>
  );
};
