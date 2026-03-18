import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../CartContext';
import { 
  User, 
  MapPin, 
  CreditCard, 
  CheckCircle, 
  ChevronRight, 
  ChevronLeft, 
  Dog, 
  Smartphone, 
  Mail, 
  IdCard, 
  Truck, 
  Store, 
  QrCode, 
  Barcode, 
  ArrowRight,
  ShoppingBag
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

type Step = 'tutor' | 'address' | 'payment' | 'success';

export const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('tutor');
  const [isProcessing, setIsProcessing] = useState(false);

  // Form States
  const [tutorData, setTutorData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    cpf: ''
  });

  const [addressData, setAddressData] = useState({
    zip: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: 'São Paulo',
    state: 'SP',
    isStorePickup: false
  });

  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | 'boleto'>('pix');

  const steps: { key: Step; label: string; icon: any }[] = [
    { key: 'tutor', label: 'Tutor', icon: User },
    { key: 'address', label: 'Entrega', icon: MapPin },
    { key: 'payment', label: 'Pagamento', icon: CreditCard },
    { key: 'success', label: 'Confirmado', icon: CheckCircle },
  ];

  const handleNextStep = () => {
    if (currentStep === 'tutor') setCurrentStep('address');
    else if (currentStep === 'address') setCurrentStep('payment');
    else if (currentStep === 'payment') handleFinishCheckout();
  };

  const handlePrevStep = () => {
    if (currentStep === 'address') setCurrentStep('tutor');
    else if (currentStep === 'payment') setCurrentStep('address');
  };

  const createOrder = useMutation(api.orders.createOrder);

  const handleFinishCheckout = async () => {
    setIsProcessing(true);
    try {
      const orderData = {
        tutor: tutorData,
        address: addressData,
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          brand: item.brand,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        paymentMethod,
        subtotal: total,
        discount: paymentMethod === 'pix' ? total * 0.05 : 0,
        total: paymentMethod === 'pix' ? total * 0.95 : total,
      };
      
      await createOrder(orderData);
      
      clearCart();
      setCurrentStep('success');
    } catch (error) {
      console.error("Falha ao criar pedido:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && currentStep !== 'success') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-stone-50">
        <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-teal-600" />
        </div>
        <h2 className="text-2xl font-display font-bold text-stone-900 mb-4">Seu carrinho está vazio</h2>
        <p className="text-stone-500 mb-8 text-center max-w-sm">Você precisa adicionar alguns produtos antes de finalizar o pedido.</p>
        <Link to="/" className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 px-10 rounded-full transition-all shadow-lg shadow-teal-500/20">
          Voltar para a Loja
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header do Checkout */}
      <div className="bg-white border-b border-stone-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <Dog className="text-white w-5 h-5" />
            </div>
            <span className="font-display text-xl font-black text-stone-900">LOPES</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-2 text-stone-400 text-sm font-bold uppercase tracking-widest">
            <Smartphone className="w-4 h-4 text-teal-500" />
            <span>Precisa de ajuda? (11) 94821-9786</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-10">
        {/* Stepper */}
        <div className="flex justify-between max-w-4xl mx-auto mb-10 md:mb-16 relative px-2 md:px-0">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-stone-200 -translate-y-1/2 -z-10"></div>
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = currentStep === s.key;
            const isCompleted = steps.findIndex(x => x.key === currentStep) > idx;
            
            return (
              <div key={s.key} className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isActive ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30 scale-110' : 
                    isCompleted ? 'bg-teal-100 text-teal-600' : 
                    'bg-white border-2 border-stone-200 text-stone-300'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-5 h-5 md:w-6 md:h-6" /> : <Icon className="w-4 h-4 md:w-5 md:h-5" />}
                </div>
                <span className={`mt-2 md:mt-3 text-[8px] md:text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-teal-600' : 'text-stone-400'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-7 xl:col-span-8">
            <AnimatePresence mode="wait">
              {currentStep === 'tutor' && (
                <motion.div
                  key="tutor"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-6 md:p-12 rounded-[32px] md:rounded-[40px] shadow-sm border border-stone-100"
                >
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-stone-900 mb-2">Dados do Tutor</h2>
                  <p className="text-stone-500 mb-6 md:mb-10 text-base md:text-lg">Precisamos dessas informações para preparar o pedido e emitir a nota fiscal.</p>
                  
                  <div className="space-y-6">
                    <div className="group">
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 px-1">Nome Completo</label>
                      <div className="relative">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-teal-500 transition-colors" />
                        <input 
                          type="text" 
                          value={tutorData.name}
                          onChange={e => setTutorData({...tutorData, name: e.target.value})}
                          placeholder="Ex: João da Silva" 
                          className="w-full bg-stone-50 border border-stone-100 rounded-3xl px-14 py-5 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all font-medium text-lg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 px-1">WhatsApp</label>
                        <div className="relative">
                          <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-teal-500 transition-colors" />
                          <input 
                            type="tel" 
                            value={tutorData.whatsapp}
                            onChange={e => setTutorData({...tutorData, whatsapp: e.target.value})}
                            placeholder="(11) 99999-9999" 
                            className="w-full bg-stone-50 border border-stone-100 rounded-3xl px-14 py-5 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all font-medium text-lg"
                          />
                        </div>
                      </div>
                      <div className="group">
                        <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 px-1">E-mail</label>
                        <div className="relative">
                          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-teal-500 transition-colors" />
                          <input 
                            type="email" 
                            value={tutorData.email}
                            onChange={e => setTutorData({...tutorData, email: e.target.value})}
                            placeholder="seu@contato.com" 
                            className="w-full bg-stone-50 border border-stone-100 rounded-3xl px-14 py-5 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all font-medium text-lg"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 px-1">CPF</label>
                      <div className="relative">
                        <IdCard className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-teal-500 transition-colors" />
                        <input 
                          type="text" 
                          value={tutorData.cpf}
                          onChange={e => setTutorData({...tutorData, cpf: e.target.value})}
                          placeholder="000.000.000-00" 
                          className="w-full bg-stone-50 border border-stone-100 rounded-3xl px-14 py-5 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all font-medium text-lg"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 md:mt-12">
                    <button 
                      onClick={handleNextStep}
                      disabled={!tutorData.name || !tutorData.whatsapp}
                      className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-4 md:py-6 rounded-2xl md:rounded-3xl transition-all shadow-xl shadow-stone-900/10 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      Continuar para Entrega
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-center text-stone-400 text-xs mt-6 flex items-center justify-center gap-2">
                      <CheckCircle className="w-3 h-3 text-teal-500" /> Seus dados estão protegidos pela LGPD
                    </p>
                  </div>
                </motion.div>
              )}

              {currentStep === 'address' && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-6 md:p-12 rounded-[32px] md:rounded-[40px] shadow-sm border border-stone-100"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-stone-900">Endereço de Entrega</h2>
                    <button 
                      onClick={() => setAddressData({...addressData, isStorePickup: !addressData.isStorePickup})}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                        addressData.isStorePickup ? 'bg-teal-500 text-white border-teal-500' : 'bg-white text-stone-500 border-stone-100'
                      }`}
                    >
                      {addressData.isStorePickup ? <Store className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                      {addressData.isStorePickup ? 'Vou Retirar na Loja' : 'Quero Receber em Casa'}
                    </button>
                  </div>
                  
                  {addressData.isStorePickup ? (
                    <div className="bg-teal-50 p-6 rounded-3xl border border-teal-100 mb-10 mt-6">
                      <h4 className="font-bold text-teal-800 mb-2 flex items-center gap-2">
                        <Store className="w-5 h-5" /> Endereço da Unidade Matriz
                      </h4>
                      <p className="text-teal-700 leading-relaxed">
                        Casa de Ração LOPES<br />
                        Av. Dr. Arnaldo, 1500 - Perdizes<br />
                        São Paulo - SP, 01246-000<br />
                        <span className="text-teal-800 font-bold block mt-2 text-sm italic">Retirada disponível em 2 horas após aprovação.</span>
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6 mt-10">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="group md:col-span-1">
                          <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 px-1">CEP</label>
                          <input 
                            type="text" 
                            value={addressData.zip}
                            onChange={e => setAddressData({...addressData, zip: e.target.value})}
                            placeholder="00000-000" 
                            className="w-full bg-stone-50 border border-stone-100 rounded-3xl px-6 py-5 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all font-medium text-lg"
                          />
                        </div>
                        <div className="group md:col-span-2">
                          <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 px-1">Rua</label>
                          <input 
                            type="text" 
                            value={addressData.street}
                            onChange={e => setAddressData({...addressData, street: e.target.value})}
                            placeholder="Nome da avenida ou rua" 
                            className="w-full bg-stone-50 border border-stone-100 rounded-3xl px-6 py-5 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all font-medium text-lg"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                          <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 px-1">Número</label>
                          <input 
                            type="text" 
                            value={addressData.number}
                            onChange={e => setAddressData({...addressData, number: e.target.value})}
                            placeholder="123" 
                            className="w-full bg-stone-50 border border-stone-100 rounded-3xl px-6 py-5 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all font-medium text-lg"
                          />
                        </div>
                        <div className="group">
                          <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 px-1">Bairro</label>
                          <input 
                            type="text" 
                            value={addressData.neighborhood}
                            onChange={e => setAddressData({...addressData, neighborhood: e.target.value})}
                            placeholder="Ex: Pinheiros" 
                            className="w-full bg-stone-50 border border-stone-100 rounded-3xl px-6 py-5 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all font-medium text-lg"
                          />
                        </div>
                      </div>

                      <div className="group">
                        <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 px-1">Complemento / Referência</label>
                        <input 
                          type="text" 
                          value={addressData.complement}
                          onChange={e => setAddressData({...addressData, complement: e.target.value})}
                          placeholder="Ex: Apto 102, Bloco C" 
                          className="w-full bg-stone-50 border border-stone-100 rounded-3xl px-6 py-5 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all font-medium text-lg"
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-8 md:mt-12 flex flex-col md:flex-row gap-4">
                    <button 
                      onClick={handlePrevStep}
                      className="flex-shrink-0 border-2 border-stone-100 hover:border-stone-200 text-stone-500 font-bold py-4 px-6 md:py-5 md:px-8 rounded-2xl md:rounded-3xl transition-all flex items-center justify-center gap-2"
                    >
                      <ChevronLeft className="w-5 h-5" /> Voltar
                    </button>
                    <button 
                      onClick={handleNextStep}
                      disabled={!addressData.isStorePickup && (!addressData.zip || !addressData.street || !addressData.number)}
                      className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-4 md:py-6 rounded-2xl md:rounded-3xl transition-all shadow-xl shadow-stone-900/10 flex items-center justify-center gap-3 disabled:opacity-50 group"
                    >
                      Seguir para Pagamento
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-stone-100"
                >
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-stone-900 mb-2">Forma de Pagamento</h2>
                  <p className="text-stone-500 mb-10 text-lg">Escolha como prefere pagar seu pedido hoje.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button 
                      onClick={() => setPaymentMethod('pix')}
                      className={`relative p-8 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 ${
                        paymentMethod === 'pix' ? 'border-teal-500 bg-teal-50/30' : 'border-stone-100 hover:border-stone-200'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${paymentMethod === 'pix' ? 'bg-teal-500 text-white' : 'bg-stone-100 text-stone-400'}`}>
                        <QrCode className="w-6 h-6" />
                      </div>
                      <span className={`font-bold uppercase tracking-widest text-xs ${paymentMethod === 'pix' ? 'text-teal-600' : 'text-stone-400'}`}>PIX</span>
                      <p className="text-[10px] text-stone-400 text-center font-medium">Aprovação imediata e 5% de desconto</p>
                      {paymentMethod === 'pix' && <div className="absolute top-4 right-4"><CheckCircle className="w-5 h-5 text-teal-500 fill-teal-500/20" /></div>}
                    </button>

                    <button 
                      onClick={() => setPaymentMethod('card')}
                      className={`relative p-8 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 ${
                        paymentMethod === 'card' ? 'border-teal-500 bg-teal-50/30' : 'border-stone-100 hover:border-stone-200'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${paymentMethod === 'card' ? 'bg-teal-500 text-white' : 'bg-stone-100 text-stone-400'}`}>
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <span className={`font-bold uppercase tracking-widest text-xs ${paymentMethod === 'card' ? 'text-teal-600' : 'text-stone-400'}`}>Cartão</span>
                      <p className="text-[10px] text-stone-400 text-center font-medium">Até 10x sem juros no VISA ou Master</p>
                      {paymentMethod === 'card' && <div className="absolute top-4 right-4"><CheckCircle className="w-5 h-5 text-teal-500 fill-teal-500/20" /></div>}
                    </button>

                    <button 
                      onClick={() => setPaymentMethod('boleto')}
                      className={`relative p-8 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 ${
                        paymentMethod === 'boleto' ? 'border-teal-500 bg-teal-50/30' : 'border-stone-100 hover:border-stone-200'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${paymentMethod === 'boleto' ? 'bg-teal-500 text-white' : 'bg-stone-100 text-stone-400'}`}>
                        <Barcode className="w-6 h-6" />
                      </div>
                      <span className={`font-bold uppercase tracking-widest text-xs ${paymentMethod === 'boleto' ? 'text-teal-600' : 'text-stone-400'}`}>Boleto</span>
                      <p className="text-[10px] text-stone-400 text-center font-medium">Vencimento em 3 dias úteis</p>
                      {paymentMethod === 'boleto' && <div className="absolute top-4 right-4"><CheckCircle className="w-5 h-5 text-teal-500 fill-teal-500/20" /></div>}
                    </button>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="mt-10 p-8 bg-stone-50 rounded-[30px] border border-stone-100 space-y-4">
                       <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest px-1">Número do Cartão</label>
                       <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-white border border-stone-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all font-mono" />
                       <div className="grid grid-cols-2 gap-4">
                         <input type="text" placeholder="MM/AA" className="w-full bg-white border border-stone-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all font-mono" />
                         <input type="text" placeholder="CVV" className="w-full bg-white border border-stone-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all font-mono" />
                       </div>
                    </div>
                  )}

                  <div className="mt-8 md:mt-12 flex flex-col md:flex-row gap-4">
                    <button 
                      onClick={handlePrevStep}
                      className="flex-shrink-0 border-2 border-stone-100 hover:border-stone-200 text-stone-500 font-bold py-4 px-6 md:py-5 md:px-8 rounded-2xl md:rounded-3xl transition-all flex items-center justify-center gap-2"
                    >
                      <ChevronLeft className="w-5 h-5" /> Voltar
                    </button>
                    <button 
                      onClick={handleFinishCheckout}
                      disabled={isProcessing}
                      className={`w-full ${paymentMethod === 'pix' ? 'bg-teal-500 hover:bg-teal-600 shadow-teal-500/20' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20'} text-white font-bold py-4 md:py-6 rounded-2xl md:rounded-3xl transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-70 disabled:grayscale group`}
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processando...
                        </>
                      ) : (
                        <>
                          Finalizar Compra
                          <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-8 md:p-20 rounded-[32px] md:rounded-[50px] shadow-2xl border border-teal-50 text-center relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-2 bg-teal-500"></div>
                  
                  <motion.div 
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 10 }}
                    className="w-20 h-20 md:w-24 md:h-24 bg-teal-500 text-white rounded-[24px] md:rounded-[32px] flex items-center justify-center mx-auto mb-8 md:mb-10 shadow-xl shadow-teal-500/20"
                  >
                    <CheckCircle className="w-10 h-10 md:w-12 md:h-12" />
                  </motion.div>

                  <h2 className="font-display text-3xl md:text-5xl font-black text-stone-900 mb-4 md:mb-6">Pedido Realizado! 🐾</h2>
                  <p className="text-lg md:text-xl text-stone-500 mb-8 md:mb-10 leading-relaxed max-w-2xl mx-auto">
                    Obrigado, <span className="font-bold text-stone-900">{tutorData.name}</span>! Recebemos seu pedido com carinho. 
                    Seu pet vai adorar as novidades da <span className="text-teal-600 font-black">LOPES</span>.
                  </p>

                  <div className="bg-stone-50 rounded-3xl p-8 mb-12 text-left border border-stone-100 inline-block w-full max-w-lg">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                      <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Próximos Passos</span>
                    </div>
                    <ul className="space-y-4">
                      <li className="flex gap-4 items-start">
                        <div className="w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">1</div>
                        <p className="text-stone-600 text-sm">Enviamos os detalhes do pagamento para o e-mail <strong>{tutorData.email}</strong></p>
                      </li>
                      <li className="flex gap-4 items-start">
                        <div className="w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">2</div>
                        <p className="text-stone-600 text-sm">Você receberá atualizações via WhatsApp no número <strong>{tutorData.whatsapp}</strong></p>
                      </li>
                      <li className="flex gap-4 items-start">
                        <div className="w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">3</div>
                        <p className="text-stone-600 text-sm">Assim que o pagamento for aprovado, seu pedido entra em rota de entrega!</p>
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link to="/" className="w-full sm:w-auto bg-stone-900 hover:bg-stone-800 text-white font-bold py-5 px-12 rounded-full transition-all shadow-xl shadow-stone-900/10">
                      Continuar Comprando
                    </Link>
                    <Link to="/conta" className="w-full sm:w-auto text-stone-500 hover:text-stone-900 font-bold py-5 px-8 transition-colors flex items-center gap-2">
                      Ver Meus Pedidos <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Confetti-like decoration (decorative circles) */}
                  <div className="absolute top-10 left-10 w-4 h-4 rounded-full bg-teal-200 opacity-20 hidden md:block"></div>
                  <div className="absolute top-40 right-10 w-8 h-8 rounded-full bg-orange-200 opacity-20 hidden md:block"></div>
                  <div className="absolute bottom-20 left-20 w-6 h-6 rounded-full bg-teal-100 opacity-30 hidden md:block"></div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Checkout Summary Sidebar */}
          {currentStep !== 'success' && (
            <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-32 h-fit">
              <div className="bg-stone-900 p-6 md:p-10 rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden relative">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl"></div>
                
                <h3 className="font-display text-xl md:text-2xl font-bold text-white mb-6 md:mb-8 flex items-center gap-3">
                  Resumo do Pedido
                </h3>

                <div className="space-y-6 mb-10 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center p-2 border border-white/5 shrink-0">
                         <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-lighten" />
                      </div>
                      <div className="flex-grow pt-1">
                        <h4 className="text-white text-xs font-bold line-clamp-2 leading-relaxed mb-1">{item.name}</h4>
                        <div className="flex justify-between items-center mt-2">
                           <span className="text-stone-400 text-[10px] font-bold uppercase tracking-wider">{item.quantity}un x R$ {item.price.toFixed(2).replace('.', ',')}</span>
                           <span className="text-stone-100 text-xs font-black italic">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 border-t border-white/10 pt-8 mt-auto">
                  <div className="flex justify-between text-stone-300 text-sm font-medium">
                    <span>Subtotal</span>
                    <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between items-center text-stone-300 text-sm font-medium">
                    <span>Frete</span>
                    <span className="text-teal-400 text-[10px] font-black uppercase tracking-widest border border-teal-400/30 px-2 py-1 rounded-md">Grátis SP</span>
                  </div>
                  {paymentMethod === 'pix' && (
                    <div className="flex justify-between items-center text-teal-400">
                      <span className="text-sm font-medium">Desconto PIX (-5%)</span>
                      <span className="font-bold">- R$ {(total * 0.05).toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  <div className="border-t border-white/10 pt-6 mt-2 flex justify-between items-baseline">
                    <span className="text-white font-bold text-lg">Total</span>
                    <div className="text-right">
                       <span className="block text-white font-display text-3xl font-black">
                         R$ {(paymentMethod === 'pix' ? total * 0.95 : total).toFixed(2).replace('.', ',')}
                       </span>
                       <span className="text-[10px] text-stone-400 uppercase font-bold tracking-tighter">no checkout lopes</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group">
                  <div className="w-10 h-10 bg-teal-500/20 text-teal-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div className="leading-tight">
                    <p className="text-white text-xs font-bold uppercase tracking-widest">Entrega Expressa</p>
                    <p className="text-stone-400 text-[10px] font-medium">Receba em sua casa em até 24h</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};
