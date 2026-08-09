import React, { useState, useEffect } from 'react';
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
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAdmin } from './admin/adminContext';
import { calculateDeliveryFee, DeliveryCalculationResult, STORES } from '../utils/deliveryCalculator';

type Step = 'tutor' | 'address' | 'payment' | 'success';

export const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const { coupons, formatPrice, decreaseStock } = useAdmin();
  const user = useQuery(api.users.currentUser);
  const [currentStep, setCurrentStep] = useState<Step>('tutor');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  const [usePetCoins, setUsePetCoins] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [referralSuccess, setReferralSuccess] = useState('');
  const [referralError, setReferralError] = useState('');
  const userPetCoins = user?.petCoins || 0;
  const petCoinsValue = userPetCoins; // 1 PetCoin = R$ 1, for demo
  
  const applyReferral = useMutation(api.users.applyReferralCode);

  // Form States
  const [tutorData, setTutorData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    cpf: ''
  });

  useEffect(() => {
    if (user) {
      setTutorData(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        whatsapp: prev.whatsapp || user.phone || ''
      }));
    }
  }, [user]);


  const [addressData, setAddressData] = useState({
    zip: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: 'São Paulo',
    state: 'SP',
    isStorePickup: false,
    selectedPickupStore: STORES[0].id
  });

  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryCalculationResult | null>(null);
  const [isCalculatingDelivery, setIsCalculatingDelivery] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | 'boleto'>('pix');

  const steps: { key: Step; label: string; icon: any }[] = [
    { key: 'tutor', label: 'Tutor', icon: User },
    { key: 'address', label: 'Entrega', icon: MapPin },
    { key: 'payment', label: 'Pagamento', icon: CreditCard },
    { key: 'success', label: 'Confirmado', icon: CheckCircle },
  ];

  useEffect(() => {
    let isMounted = true;
    const calculate = async () => {
      if (addressData.isStorePickup) {
        const info = await calculateDeliveryFee('', true);
        if (isMounted) setDeliveryInfo(info);
        return;
      }

      const cleanZip = addressData.zip.replace(/\D/g, '');
      if (cleanZip.length === 8) {
        setIsCalculatingDelivery(true);
        const info = await calculateDeliveryFee(cleanZip, false);
        if (isMounted) {
          setDeliveryInfo(info);
          setIsCalculatingDelivery(false);
        }
      } else {
        setDeliveryInfo(null);
      }
    };

    calculate();
    return () => { isMounted = false; };
  }, [addressData.zip, addressData.isStorePickup]);

  const handleZipChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let zipValue = e.target.value.replace(/\D/g, '');
    if (zipValue.length > 8) zipValue = zipValue.slice(0, 8);
    
    let formattedZip = zipValue;
    if (zipValue.length > 5) {
      formattedZip = `${zipValue.slice(0, 5)}-${zipValue.slice(5)}`;
    }

    setAddressData(prev => ({ ...prev, zip: formattedZip }));

    if (zipValue.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${zipValue}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setAddressData(prev => ({
            ...prev,
            street: data.logradouro || prev.street,
            neighborhood: data.bairro || prev.neighborhood,
            city: data.localidade || prev.city,
            state: data.uf || prev.state,
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

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

  const handleApplyCoupon = () => {
    const code = couponCode.toUpperCase().trim();
    const coupon = coupons.find(c => c.code === code);
    
    if (coupon) {
      if (coupon.expirationDate) {
        const expDate = new Date(coupon.expirationDate + 'T23:59:59');
        if (expDate < new Date()) {
          setCouponError('Este cupom já expirou.');
          setAppliedCoupon(null);
          return;
        }
      }
      setAppliedCoupon(coupon);
      setCouponError('');
    } else {
      setCouponError('Cupom inválido');
      setAppliedCoupon(null);
    }
  };

  const handleApplyReferral = async () => {
    try {
      const result = await applyReferral({ code: referralCode });
      setReferralSuccess(`Código de ${result.referrerName} aplicado! +10 PetCoins ganhos.`);
      setReferralError('');
    } catch (e: any) {
      setReferralError(e.message || "Erro ao aplicar código");
      setReferralSuccess('');
    }
  };

  const shippingFee = deliveryInfo ? deliveryInfo.fee : 0;
  const couponDiscount = appliedCoupon ? (total * appliedCoupon.discount) / 100 : 0;
  const petCoinsDiscount = usePetCoins ? Math.min(petCoinsValue, total - couponDiscount) : 0;
  const baseForPix = Math.max(0, total + shippingFee - couponDiscount - petCoinsDiscount);
  const pixDiscount = paymentMethod === 'pix' ? baseForPix * 0.05 : 0;
  const finalTotal = Math.max(0, total + shippingFee - couponDiscount - petCoinsDiscount - pixDiscount);

  const handleFinishCheckout = async () => {
    setIsProcessing(true);
    try {
      const orderData = {
        tutor: tutorData,
        address: addressData,
        items: items.map(item => ({
          productId: Number(item.id) || 0,
          name: item.name,
          brand: item.brand,
          price: item.price,
          quantity: item.quantity,
          image: item.image || (item.images && item.images.length > 0 ? item.images[0] : '') || 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400',
          isSubscription: item.isSubscription
        })),
        paymentMethod,
        subtotal: total,
        shippingFee,
        coupon: appliedCoupon?.code,
        usedPetCoins: usePetCoins ? userPetCoins : 0,
        discount: couponDiscount + pixDiscount + petCoinsDiscount,
        total: finalTotal,
      };
      
      await createOrder(orderData as any);
      
      // Decrease stock for each purchased product
      items.forEach(item => {
        decreaseStock(String(item.id), item.quantity);
      });
      
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
                    <div className="space-y-4 mb-10 mt-6">
                      <p className="text-stone-500 font-medium text-sm">Selecione em qual das nossas unidades você prefere retirar o pedido:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {STORES.map((store) => (
                          <div
                            key={store.id}
                            onClick={() => setAddressData({ ...addressData, selectedPickupStore: store.id })}
                            className={`p-5 rounded-3xl border-2 transition-all cursor-pointer ${
                              addressData.selectedPickupStore === store.id
                                ? 'bg-teal-50/50 border-teal-500'
                                : 'bg-stone-50 border-stone-100 hover:border-stone-200'
                            }`}
                          >
                            <div className="flex items-center gap-2 font-bold text-stone-900 mb-1">
                              <Store className="w-4 h-4 text-teal-600" />
                              {store.name}
                            </div>
                            <p className="text-xs text-stone-500 leading-relaxed">{store.address}</p>
                            <span className="text-[10px] font-bold text-teal-600 block mt-2">Retirada Grátis em até 1h</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6 mt-10">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="group md:col-span-1">
                          <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 px-1">CEP</label>
                          <input 
                            type="text" 
                            value={addressData.zip}
                            onChange={handleZipChange}
                            maxLength={9}
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
                            placeholder="Ex: Cidade Tiradentes" 
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

                      {/* Display delivery distance calculation info */}
                      {isCalculatingDelivery && (
                        <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100 text-teal-700 text-xs font-medium animate-pulse flex items-center gap-2">
                          <Truck className="w-4 h-4 text-teal-600 animate-bounce" />
                          Calculando distância da loja mais próxima...
                        </div>
                      )}

                      {deliveryInfo && !isCalculatingDelivery && (
                        <div className="p-5 bg-teal-50/80 rounded-2xl border border-teal-100/80 text-teal-900 text-xs space-y-1">
                          <div className="flex items-center justify-between font-bold">
                            <span className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-teal-600" />
                              Origem: {deliveryInfo.closestStore.name}
                            </span>
                            <span className="bg-teal-500 text-white px-2.5 py-0.5 rounded-full font-bold">
                              {deliveryInfo.formattedFee}
                            </span>
                          </div>
                          <p className="text-teal-700 font-medium">
                            Distância calculada: <strong>{deliveryInfo.distanceKm} km</strong> (taxa de R$ 1,00/km). Previsão: {deliveryInfo.estimatedTime}.
                          </p>
                        </div>
                      )}
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
                       <label htmlFor="card-number" className="block text-xs font-bold text-stone-400 uppercase tracking-widest px-1">Número do Cartão</label>
                       <input id="card-number" type="text" placeholder="0000 0000 0000 0000" className="w-full bg-white border border-stone-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all font-mono" />
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label htmlFor="card-expiry" className="block text-xs font-bold text-stone-400 uppercase tracking-widest px-1 mb-1">Validade</label>
                           <input id="card-expiry" type="text" placeholder="MM/AA" className="w-full bg-white border border-stone-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all font-mono" />
                         </div>
                         <div>
                           <label htmlFor="card-cvv" className="block text-xs font-bold text-stone-400 uppercase tracking-widest px-1 mb-1">CVV</label>
                           <input id="card-cvv" type="text" placeholder="CVV" className="w-full bg-white border border-stone-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all font-mono" />
                         </div>
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
                         <img 
                           src={item.image || (item.images && item.images.length > 0 ? item.images[0] : '') || 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400'} 
                           alt={item.name} 
                           className="w-full h-full object-contain mix-blend-lighten" 
                           onError={(e) => {
                             (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400';
                           }}
                         />
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

                <div className="mt-8 space-y-4">
                  <p className="text-white text-[10px] font-bold uppercase tracking-widest pl-1">Possui um cupom?</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="CÓDIGO" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:ring-1 focus:ring-teal-500 outline-none flex-grow"
                    />
                    <button 
                      onClick={handleApplyCoupon}
                      className="bg-teal-500 hover:bg-teal-600 text-white font-bold text-[10px] px-4 rounded-xl transition-all"
                    >
                      APLICAR
                    </button>
                  </div>
                  {couponError && <p className="text-red-400 text-[10px] pl-1">{couponError}</p>}
                  {appliedCoupon && (
                    <div className="bg-teal-500/10 border border-teal-500/20 p-3 rounded-xl flex justify-between items-center">
                      <span className="text-teal-400 text-[10px] font-bold">Cupom {appliedCoupon.code} aplicado!</span>
                      <button onClick={() => setAppliedCoupon(null)} className="text-teal-400 text-xs">✕</button>
                    </div>
                  )}

                  {userPetCoins > 0 && (
                    <div className={`p-4 rounded-xl border transition-all ${usePetCoins ? 'bg-orange-500/10 border-orange-500/20' : 'bg-white/5 border-white/5 opacity-60'}`}>
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                               <Dog className="w-5 h-5" />
                            </div>
                            <div>
                               <p className="text-white text-[10px] font-bold uppercase tracking-widest">PetCoins Disponíveis</p>
                               <p className="text-orange-400 text-xs font-black">{userPetCoins} pontos (R$ {userPetCoins.toFixed(2)})</p>
                            </div>
                         </div>
                         <button 
                           onClick={() => setUsePetCoins(!usePetCoins)}
                           className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${usePetCoins ? 'bg-orange-500 text-white' : 'bg-white/10 text-stone-300'}`}
                         >
                           {usePetCoins ? 'REMOVER' : 'USAR'}
                         </button>
                      </div>
                    </div>
                  )}

                  {!user?.referredBy && (
                    <div className="pt-4 space-y-3">
                      <p className="text-white text-[10px] font-bold uppercase tracking-widest pl-1">Foi indicado por alguém?</p>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="CÓDIGO DE AMIGO" 
                          value={referralCode}
                          onChange={(e) => setReferralCode(e.target.value)}
                          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:ring-1 focus:ring-teal-500 outline-none flex-grow"
                        />
                        <button 
                          onClick={handleApplyReferral}
                          className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-[10px] px-4 rounded-xl transition-all"
                        >
                          ENVIAR
                        </button>
                      </div>
                      {referralError && <p className="text-red-400 text-[10px] pl-1">{referralError}</p>}
                      {referralSuccess && <p className="text-teal-400 text-[10px] pl-1 font-bold">{referralSuccess}</p>}
                    </div>
                  )}
                </div>

                <div className="space-y-4 border-t border-white/10 pt-8 mt-8">
                  <div className="flex justify-between text-stone-300 text-sm font-medium">
                    <span>Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between items-center text-stone-300 text-sm font-medium">
                    <span>Frete</span>
                    {addressData.isStorePickup ? (
                      <span className="text-teal-400 text-xs font-bold uppercase tracking-wider bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                        Grátis (Retirada)
                      </span>
                    ) : isCalculatingDelivery ? (
                      <span className="text-stone-400 text-xs animate-pulse">Calculando...</span>
                    ) : deliveryInfo ? (
                      <span className="text-teal-400 font-bold text-sm">
                        {deliveryInfo.formattedFee} <span className="text-[10px] text-stone-400 font-normal">({deliveryInfo.distanceKm} km)</span>
                      </span>
                    ) : (
                      <span className="text-stone-400 text-xs italic">Informe o CEP</span>
                    )}
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between items-center text-teal-400">
                      <span className="text-sm font-medium">Cupom {appliedCoupon.code} (-{appliedCoupon.discount}%)</span>
                      <span className="font-bold">- {formatPrice(couponDiscount)}</span>
                    </div>
                  )}
                  {usePetCoins && (
                    <div className="flex justify-between items-center text-orange-400">
                      <span className="text-sm font-medium">Desconto PetCoins</span>
                      <span className="font-bold">- {formatPrice(petCoinsDiscount)}</span>
                    </div>
                  )}
                  {paymentMethod === 'pix' && (
                    <div className="flex justify-between items-center text-teal-400">
                      <span className="text-sm font-medium">Desconto PIX (-5%)</span>
                      <span className="font-bold">- {formatPrice(pixDiscount)}</span>
                    </div>
                  )}
                  <div className="border-t border-white/10 pt-6 mt-2 flex justify-between items-baseline">
                    <span className="text-white font-bold text-lg">Total</span>
                    <div className="text-right">
                       <span className="block text-white font-display text-3xl font-black">
                         {formatPrice(finalTotal)}
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
