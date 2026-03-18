import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { products } from '../data';
import { useCart } from '../CartContext';
import { useFavorites } from '../FavoritesContext';
import { User, Heart, LogOut, Dog, Cat, Plus, Trash2, Loader2, Save, X, Check, Package, Clock, Truck, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export const Dashboard = () => {
  const user = useQuery(api.users.currentUser);
  const pets = useQuery(api.pets.listMyPets);
  const deletePet = useMutation(api.pets.deletePet);
  const updateProfile = useMutation(api.users.updateProfile);
  const { signOut } = useAuthActions();
  const navigate = useNavigate();

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
                  <motion.div whileHover={{ y: -5 }} key={pet._id} className="bg-white p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-stone-100 shadow-sm flex items-center justify-between group transition-all hover:border-teal-200 hover:shadow-xl hover:shadow-teal-500/5">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-stone-50 rounded-xl md:rounded-2xl flex items-center justify-center text-stone-400 group-hover:bg-teal-50 group-hover:text-teal-500 transition-colors">
                        {pet.species === "Gato" ? <Cat className="w-6 h-6 md:w-8 md:h-8" /> : <Dog className="w-6 h-6 md:w-8 md:h-8" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-stone-900 text-base md:text-lg leading-tight">{pet.name}</h3>
                        <p className="text-stone-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">{pet.breed} • {pet.age}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => deletePet({ petId: pet._id })}
                      className="p-3 text-stone-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
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
                    <img src={product.image} alt={product.name} className="w-20 h-20 object-contain mix-blend-multiply bg-stone-50 rounded-2xl p-2" />
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
        </div>
      </div>
    </div>
  );
};

const OrdersList = () => {
  const orders = useQuery(api.orders.listMyOrders);

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
                <div className="flex items-center gap-2">
                   <p className="text-2xl font-display font-black text-stone-900">R$ {order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
              <div className="flex flex-col md:items-end justify-between">
                <span className={`${status.color} border px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest flex items-center gap-2`}>
                  <StatusIcon className="w-3 h-3" />
                  {status.label}
                </span>
                <button className="text-teal-600 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all mt-4">
                  Ver detalhes <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
