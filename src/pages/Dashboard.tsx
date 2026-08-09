import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { products, Product } from '../data';
import { useCart } from '../CartContext';
import { useFavorites } from '../FavoritesContext';
import { User, Heart, LogOut, Dog, Cat, Plus, Trash2, Loader2, Save, X, Check, Package, Clock, Truck, ChevronRight, Repeat, Calendar, Shield, Share2, Copy, Gift } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '../ToastContext';

export const Dashboard = () => {
  const user = useQuery(api.users.currentUser);
  const pets = useQuery(api.pets.listMyPets);
  const deletePet = useMutation(api.pets.deletePet);
  const updateProfile = useMutation(api.users.updateProfile);
  const generateReferral = useMutation(api.users.generateReferralCode);
  const { signOut } = useAuthActions();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [activePetForVaccine, setActivePetForVaccine] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setEditName(user.name || "");
      setEditPhone(user.phone || "");
    }
  }, [user]);

  const { favorites } = useFavorites();
  const { addToCart } = useCart();
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  const handleSignOut = async () => {
    await signOut();
    navigate('/conta');
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        name: editName,
        phone: editPhone,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (user === undefined) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-16 gap-4 md:gap-6 reveal-on-scroll">
        <div>
          <h1 className="font-display text-3xl md:text-5xl font-black text-stone-900 tracking-tighter">Oi, {user?.name.split(' ')[0]}!</h1>
          <p className="text-stone-500 mt-2 font-medium text-sm md:text-base">Gerencie seus pets e acompanhe seus pedidos aqui.</p>
        </div>
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-2 text-stone-400 hover:text-red-500 font-bold transition-colors text-xs md:text-sm uppercase tracking-widest self-start md:self-auto"
        >
          <LogOut className="w-4 h-4 md:w-5 md:h-5" />
          Sair da Conta
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        <div className="lg:col-span-2 space-y-8 md:space-y-12">
          {/* Pets Section */}
          <section className="reveal-on-scroll">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl font-bold text-stone-900 flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-500"><Dog className="w-5 h-5"/></div>
                Meus Pets
              </h2>
              <Link 
                to="/cadastrar-pet"
                className="bg-stone-900 text-white hover:bg-stone-800 px-6 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Novo Pet
              </Link>
            </div>

            {pets === undefined ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2].map(i => <div key={i} className="h-32 bg-stone-100 rounded-[32px] animate-pulse"></div>)}
              </div>
            ) : pets.length === 0 ? (
              <div className="bg-stone-50 p-12 rounded-[40px] text-center border-2 border-dashed border-stone-200">
                <p className="text-stone-400 font-medium mb-6">Sua matilha ainda está vazia.</p>
                <Link to="/cadastrar-pet" className="text-teal-600 font-bold hover:underline">Cadastrar agora</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {pets.map((pet) => (
                  <div key={pet._id}>
                    <motion.div 
                      whileHover={{ y: -5 }} 
                      className={`bg-white p-4 md:p-6 rounded-[24px] md:rounded-[32px] border group transition-all hover:shadow-xl hover:shadow-teal-500/5 ${activePetForVaccine === pet._id ? 'border-teal-500' : 'border-stone-100'}`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="w-12 h-12 md:w-16 md:h-16 bg-stone-50 rounded-xl md:rounded-2xl flex items-center justify-center text-stone-400 group-hover:bg-teal-50 group-hover:text-teal-500 transition-colors">
                            {pet.species === "Gato" ? <Cat className="w-6 h-6 md:w-8 md:h-8" /> : <Dog className="w-6 h-6 md:w-8 md:h-8" />}
                          </div>
                          <div>
                            <h3 className="font-bold text-stone-900 text-base md:text-lg leading-tight">{pet.name}</h3>
                            <p className="text-stone-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">{pet.breed} • {pet.age}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button 
                            onClick={() => setActivePetForVaccine(activePetForVaccine === pet._id ? null : pet._id as string)}
                            className={`p-2 rounded-lg transition-all ${activePetForVaccine === pet._id ? 'bg-teal-500 text-white' : 'text-stone-300 hover:text-teal-500 hover:bg-teal-50'}`}
                            title="Calendário de Vacinas"
                          >
                            <Calendar className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deletePet({ petId: pet._id })}
                            className="p-2 text-stone-200 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {activePetForVaccine === pet._id && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                             <VaccineManager petId={pet._id} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Favorites */}
          <section className="reveal-on-scroll" style={{ transitionDelay: '100ms' }}>
            <h2 className="font-display text-2xl font-bold text-stone-900 mb-8 flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-500"><Heart className="w-5 h-5 fill-red-500"/></div>
              Favoritos
            </h2>
            {favoriteProducts.length === 0 ? (
              <div className="bg-stone-50 p-12 rounded-[40px] text-center border border-stone-100">
                <p className="text-stone-400 font-medium mb-4">Seus desejos aparecem aqui.</p>
                <Link to="/" className="text-teal-600 font-bold hover:underline">Ir para a loja</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {favoriteProducts.map((product) => (
                  <div key={product.id} className="bg-white p-4 rounded-3xl border border-stone-100 flex items-center gap-4 hover:border-stone-200 transition-all">
                    <img 
                      src={product.image || product.images?.[0] || 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400'} 
                      alt={product.name} 
                      className="w-20 h-20 object-contain mix-blend-multiply bg-stone-50 rounded-2xl p-2" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400';
                      }}
                    />
                    <div className="min-w-0 pr-4">
                      <p className="font-bold text-stone-900 text-sm truncate mb-1">{product.name}</p>
                      <p className="text-teal-600 font-bold text-sm mb-2">{product.priceFormatted}</p>
                      <button onClick={() => addToCart(product)} className="text-[10px] font-bold uppercase tracking-tighter text-stone-400 hover:text-stone-900 transition-colors">Adicionar ao carrinho</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Orders */}
          <section className="reveal-on-scroll" style={{ transitionDelay: '200ms' }}>
            <h2 className="font-display text-2xl font-bold text-stone-900 mb-8 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-500"><Package className="w-5 h-5"/></div>
              Meus Pedidos
            </h2>
            <OrdersList />
          </section>

          {/* Subscriptions Section */}
          <section className="reveal-on-scroll" style={{ transitionDelay: '250ms' }}>
            <h2 className="font-display text-2xl font-bold text-stone-900 mb-8 flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-500"><Repeat className="w-5 h-5"/></div>
              Assinaturas Ativas
            </h2>
            <SubscriptionsList />
          </section>
        </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 md:space-y-8 reveal-on-scroll" style={{ transitionDelay: '300ms' }}>
          <div className="bg-stone-900 text-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] shadow-2xl shadow-stone-900/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-teal-500/10 rounded-full -mr-12 -mt-12 md:-mr-16 md:-mt-16 blur-2xl md:blur-3xl"></div>
            <h3 className="font-display text-xl md:text-2xl font-bold mb-6 md:mb-8 relative z-10">Seu Perfil</h3>
            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Nome Completo</p>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 text-white"
                  />
                ) : (
                  <p className="font-bold text-lg">{user?.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">WhatsApp</p>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 text-white"
                  />
                ) : (
                  <p className="font-bold text-lg">{user?.phone || 'Não informado'}</p>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">E-mail</p>
                <p className="text-stone-300 text-sm font-medium truncate">{user?.email}</p>
              </div>
              <div className="space-y-2 pt-4 border-t border-stone-800">
                <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest flex items-center gap-2">
                   <Dog className="w-3 h-3" />
                   Saldo PetCoins
                </p>
                <p className="text-2xl font-display font-black text-orange-500">{user?.petCoins || 0} <span className="text-xs font-bold text-stone-500">pontos</span></p>
                <p className="text-[10px] text-stone-500 font-medium italic">R$ 1,00 para cada ponto em descontos!</p>
              </div>
            </div>
            
            <div className="mt-12 relative z-10">
              {isEditing ? (
                <div className="flex gap-3">
                  <button 
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex-grow bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                    Salvar
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="p-4 bg-stone-800 rounded-2xl hover:bg-stone-700 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-full py-4 border border-stone-700 rounded-2xl font-bold hover:bg-white hover:text-stone-900 transition-all flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Editar Cadastro
                </button>
              )}
            </div>
          </div>

          <div className="bg-teal-50 p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-teal-100 relative overflow-hidden group">
            <Dog className="absolute bottom-0 right-0 w-24 h-24 md:w-32 md:h-32 text-teal-100 group-hover:scale-110 transition-transform duration-700" />
            <h3 className="font-display font-bold text-teal-900 text-lg md:text-xl mb-2 md:mb-3 relative z-10">Membro Prime?</h3>
            <p className="text-teal-700 text-xs md:text-sm leading-relaxed mb-6 md:mb-8 relative z-10">Seus dados estão 80% completos. Finalize seu cadastro e ganhe frete grátis na próxima compra!</p>
            <div className="w-full bg-white rounded-full h-3 p-1 relative z-10">
               <motion.div initial={{ width: 0 }} animate={{ width: '80%' }} className="bg-teal-500 h-full rounded-full" transition={{ duration: 1.5, delay: 0.5 }}></motion.div>
            </div>
          </div>

          <div className="bg-orange-50 p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-orange-100 relative overflow-hidden group">
            <Gift className="absolute bottom-0 right-0 w-24 h-24 md:w-32 md:h-32 text-orange-200 group-hover:scale-110 transition-transform duration-700 opacity-30" />
            <h3 className="font-display font-bold text-orange-900 text-lg md:text-xl mb-2 md:mb-3 relative z-10 font-black tracking-tight">Indique um Amigo</h3>
            <p className="text-orange-800 text-xs md:text-sm leading-relaxed mb-6 relative z-10">Ganhe 50 PetCoins por cada amigo que fizer a primeira compra usando seu código!</p>
            
            <div className="bg-white rounded-2xl p-4 border border-orange-200 flex items-center justify-between relative z-10">
               <span className="font-mono font-black text-orange-600 tracking-wider">
                 {user?.referralCode || '-------'}
               </span>
               <button 
                 onClick={() => {
                   if (!user?.referralCode) {
                     generateReferral();
                   } else {
                     navigator.clipboard.writeText(user.referralCode);
                     addToast("Código copiado!", "success");
                   }
                 }}
                 className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-orange-600 transition-all"
               >
                 {user?.referralCode ? <Copy className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                 {user?.referralCode ? 'Copiar' : 'Gerar'}
               </button>
            </div>
        </div>
      </div>
    </div>
  );
};

const OrdersList = () => {
  const orders = useQuery(api.orders.listMyOrders);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending': return { label: 'Aguardando', color: 'bg-yellow-50 text-yellow-600 border-yellow-100', icon: Clock };
      case 'paid': return { label: 'Pago', color: 'bg-green-50 text-green-600 border-green-100', icon: Check };
      case 'preparing': return { label: 'Separando', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: Package };
      case 'shipped': return { label: 'Em Rota', color: 'bg-orange-50 text-orange-600 border-orange-100', icon: Truck };
      case 'delivered': return { label: 'Entregue', color: 'bg-teal-50 text-teal-600 border-teal-100', icon: Check };
      default: return { label: status, color: 'bg-stone-50 text-stone-600 border-stone-100', icon: Package };
    }
  };

  if (orders === undefined) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-stone-50 p-12 rounded-[40px] text-center border border-stone-100">
        <p className="text-stone-400 font-medium italic">Nenhum pedido realizado ainda.</p>
        <Link to="/" className="text-teal-600 font-bold block mt-4 hover:underline">Fazer minha primeira compra</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => {
        const status = getStatusDisplay(order.status);
        const StatusIcon = status.icon;
        
        // Format date from timestamp
        const date = new Date(order._creationTime).toLocaleDateString('pt-BR', {
          day: '2-digit', month: '2-digit', year: 'numeric'
        });
        
        // Short ID
        const shortId = order._id.toString().substring(0, 6).toUpperCase();
        
        // Items string
        const itemsString = order.items.map((i: any) => `${i.quantity}x ${i.name}`).join(', ');

        const handleReorder = () => {
          order.items.forEach((item: any) => {
            const product = products.find(p => p.id === item.productId.toString());
            if (product) {
              for (let i = 0; i < item.quantity; i++) {
                addToCart(product);
              }
            }
          });
          navigate('/carrinho');
        };

        const steps = [
          { s: 'pending', l: 'Pedido Recebido', i: Clock },
          { s: 'paid', l: 'Pagamento OK', i: Check },
          { s: 'preparing', l: 'Em Separação', i: Package },
          { s: 'shipped', l: 'Em Transporte', i: Truck },
          { s: 'delivered', l: 'Entregue', i: Gift }
        ];

        const currentStepIndex = steps.findIndex(s => s.s === order.status);

        return (
          <div key={order._id} className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-stone-100 shadow-sm transition-all hover:border-teal-100 hover:shadow-xl hover:shadow-teal-500/5">
            <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-6">
              <div className="flex-grow space-y-3 md:space-y-4">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-stone-50 rounded-xl md:rounded-2xl flex items-center justify-center text-stone-400"><Package className="w-5 h-5 md:w-6 md:h-6" /></div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-base md:text-lg">Pedido #{shortId}</h4>
                    <p className="text-stone-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">{date}</p>
                  </div>
                </div>
                <p className="text-stone-500 text-sm font-medium line-clamp-1" title={itemsString}>{itemsString}</p>
                <div className="flex items-center gap-4">
                   <p className="text-2xl font-display font-black text-stone-900">R$ {order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                   {order.status === 'delivered' && (
                     <button 
                       onClick={handleReorder}
                       className="flex items-center gap-2 text-teal-600 bg-teal-50 px-4 py-2 rounded-xl text-xs font-bold hover:bg-teal-100 transition-all"
                     >
                       <Repeat className="w-3.5 h-3.5" />
                       Comprar Novamente
                     </button>
                   )}
                </div>
                
                {/* Visual Timeline */}
                <div className="pt-4 flex items-center gap-1">
                  {steps.map((step, idx) => {
                    const isCompleted = idx <= currentStepIndex;
                    const isLast = idx === steps.length - 1;
                    return (
                      <React.Fragment key={step.s}>
                        <div className="flex flex-col items-center gap-1 group relative">
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isCompleted ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20' : 'bg-stone-100 text-stone-300'}`}>
                             <step.i className="w-4 h-4" />
                           </div>
                           <div className="absolute top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900 text-white text-[8px] px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none uppercase font-bold tracking-widest">
                             {step.l}
                           </div>
                        </div>
                        {!isLast && (
                          <div className={`flex-grow h-1 rounded-full ${idx < currentStepIndex ? 'bg-teal-500' : 'bg-stone-100'}`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col md:items-end justify-between">
                <span className={`${status.color} border px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-sm`}>
                  <StatusIcon className="w-3 h-3" />
                  {status.label}
                </span>
                <button className="text-stone-400 font-bold text-xs flex items-center gap-2 hover:text-teal-600 transition-all mt-4">
                  Visualizar Recibo <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const VaccineManager = ({ petId }: { petId: string }) => {
  const vaccines = useQuery(api.vaccines.getVaccinesForPet, { petId: petId as any });
  const addVaccine = useMutation(api.vaccines.addVaccine);
  const deleteVaccine = useMutation(api.vaccines.deleteVaccine);
  
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDate, setNewDate] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newDate) return;
    
    const dateGiven = new Date(newDate).getTime();
    const nextDueDate = dateGiven + (365 * 24 * 60 * 60 * 1000); // Default 1 year

    await addVaccine({
      petId: petId as any,
      name: newName,
      dateGiven,
      nextDueDate
    });
    setNewName("");
    setNewDate("");
    setShowAdd(false);
  };

  return (
    <div className="mt-6 pt-6 border-t border-stone-50 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-stone-900 uppercase tracking-widest flex items-center gap-2">
           <Shield className="w-3 h-3 text-teal-500" /> Histórico de Vacinas
        </h4>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="text-teal-600 font-bold text-[10px] uppercase hover:underline"
        >
          {showAdd ? 'Cancelar' : '+ Registrar'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-stone-50 p-4 rounded-xl space-y-3">
          <input 
            type="text" 
            placeholder="Nome da Vacina" 
            className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input 
            type="date" 
            className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
          <button type="submit" className="w-full bg-teal-500 text-white font-bold py-2 rounded-lg text-[10px] uppercase">Salvar Vacina</button>
        </form>
      )}

      <div className="space-y-2">
        {vaccines?.map(v => (
          <div key={v._id} className="flex items-center justify-between text-xs bg-white border border-stone-100 p-3 rounded-xl shadow-sm">
            <div>
              <p className="font-bold text-stone-900">{v.name}</p>
              <p className="text-[10px] text-stone-400">Dada em: {new Date(v.dateGiven).toLocaleDateString()}</p>
            </div>
            <div className="text-right flex items-center gap-3">
              <div>
                <p className="text-[9px] font-bold text-teal-600 uppercase">Próxima</p>
                <p className="font-bold text-stone-900 leading-none">{new Date(v.nextDueDate).toLocaleDateString()}</p>
              </div>
              <button onClick={() => deleteVaccine({ vaccineId: v._id })} className="text-stone-200 hover:text-red-500">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
        {vaccines?.length === 0 && <p className="text-[10px] text-stone-400 italic text-center py-2">Nenhuma vacina registrada.</p>}
      </div>
    </div>
  );
};

const SubscriptionsList = () => {
  const subs = useQuery(api.subscriptions.listMySubscriptions);
  const cancelSub = useMutation(api.subscriptions.cancelSubscription);

  if (!subs) return <div className="animate-pulse h-20 bg-stone-50 rounded-3xl" />;
  if (subs.length === 0) return (
    <div className="bg-stone-50 p-10 rounded-[40px] text-center border-2 border-dashed border-stone-200">
      <p className="text-stone-400 font-medium text-sm mb-4">Você ainda não tem assinaturas recorrentes.</p>
      <Link to="/#produtos" className="text-teal-600 font-bold hover:underline">Ver produtos assináveis</Link>
    </div>
  );

  return (
    <div className="space-y-4">
      {subs.map(sub => (
        <div key={sub._id} className="bg-white p-6 rounded-[32px] border border-stone-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
           <div className="flex items-center gap-4">
             <div className="flex -space-x-4">
               {sub.items.slice(0, 3).map((item, i) => (
                 <img 
                   key={i} 
                   src={item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400'} 
                   alt={item.name} 
                   className="w-12 h-12 rounded-full border-4 border-white bg-stone-50 object-contain shadow-sm" 
                   onError={(e) => {
                     (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400';
                   }}
                 />
               ))}
             </div>
             <div>
               <p className="font-bold text-stone-900">{sub.items.length} {sub.items.length === 1 ? 'Produto' : 'Produtos'}</p>
               <p className="text-xs text-stone-400 uppercase font-black tracking-widest">{sub.frequency === 'monthly' ? 'Mensal' : 'Quinzenal'} • Próxima: {new Date(sub.nextDeliveryDate).toLocaleDateString()}</p>
             </div>
           </div>
           
           <div className="flex items-center gap-3">
             <div className="px-4 py-1.5 rounded-full bg-teal-50 text-teal-600 text-[10px] font-black uppercase tracking-widest">Ativa</div>
             <button 
               onClick={() => {
                 if (confirm("Deseja cancelar esta assinatura?")) {
                   cancelSub({ subscriptionId: sub._id });
                 }
               }}
               className="text-stone-300 hover:text-red-500 text-[10px] font-bold uppercase"
             >
               Cancelar
             </button>
           </div>
        </div>
      ))}
    </div>
  );
};
