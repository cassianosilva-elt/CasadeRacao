import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PackagePlus, ClipboardList, BadgeDollarSign, Lightbulb, TrendingUp, Users, ShoppingBag, Ticket, Star, Repeat, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useAdmin } from './adminContext';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

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
  const { orders, products, formatPrice } = useAdmin();

  // Dashboard Stats
  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const paidOrders = orders.filter(o => o.status === 'paid' || o.status === 'delivered').length;
  const avgTicket = orders.length > 0 ? totalRevenue / orders.length : 0;
  const activeProducts = products.length;

  // Convex data
  const allUsers = useQuery(api.users.listAllUsers);
  const allReviews = useQuery(api.reviews.listAllReviews);
  const allSubscriptions = useQuery(api.subscriptions.listAllSubscriptions);

  const totalUsers = allUsers?.length ?? 0;
  const totalReviews = allReviews?.length ?? 0;
  const activeSubscriptions = allSubscriptions?.filter(s => s.status === 'active').length ?? 0;

  const stats = [
    { label: 'Faturamento Total', value: formatPrice(totalRevenue), icon: <TrendingUp className="w-5 h-5" />, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { label: 'Pedidos Realizados', value: orders.length, icon: <ShoppingBag className="w-5 h-5" />, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Ticket Médio', value: formatPrice(avgTicket), icon: <BadgeDollarSign className="w-5 h-5" />, color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { label: 'Produtos Ativos', value: activeProducts, icon: <ClipboardList className="w-5 h-5" />, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { label: 'Usuários', value: totalUsers, icon: <Users className="w-5 h-5" />, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    { label: 'Avaliações', value: totalReviews, icon: <Star className="w-5 h-5" />, color: 'text-amber-600', bgColor: 'bg-amber-50' },
    { label: 'Assinaturas Ativas', value: activeSubscriptions, icon: <Repeat className="w-5 h-5" />, color: 'text-cyan-600', bgColor: 'bg-cyan-50' },
  ];

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
    },
    {
      title: 'Cupons de Desconto',
      description: 'Crie códigos promocionais.',
      icon: <Ticket className="w-10 h-10 text-purple-600" />,
      path: '/admin/cupons',
      bgColor: 'bg-purple-50',
      hoverBorder: 'hover:border-purple-300'
    },
    {
      title: 'Usuários',
      description: 'Gerencie clientes e permissões.',
      icon: <UserCheck className="w-10 h-10 text-indigo-600" />,
      path: '/admin/usuarios',
      bgColor: 'bg-indigo-50',
      hoverBorder: 'hover:border-indigo-300'
    },
    {
      title: 'Avaliações',
      description: 'Modere reviews de clientes.',
      icon: <Star className="w-10 h-10 text-amber-600" />,
      path: '/admin/avaliacoes',
      bgColor: 'bg-amber-50',
      hoverBorder: 'hover:border-amber-300'
    },
    {
      title: 'Assinaturas',
      description: 'Gerencie planos recorrentes.',
      icon: <Repeat className="w-10 h-10 text-cyan-600" />,
      path: '/admin/assinaturas',
      bgColor: 'bg-cyan-50',
      hoverBorder: 'hover:border-cyan-300'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-8">
      {/* Header com Boas-vindas */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div className="space-y-2">
          <h1 className="font-display text-4xl font-black text-stone-900 tracking-tight">Painel de Controle</h1>
          <p className="text-lg text-stone-500 font-medium">Bem-vindo de volta, Admin!</p>
        </div>
        <div className="bg-stone-100 px-4 py-2 rounded-2xl flex items-center gap-2 text-stone-600 font-bold text-sm">
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
          Sistema Online
        </div>
      </motion.div>

      {/* Grid de Estatísticas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-5 rounded-[24px] border border-stone-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 ${stat.bgColor} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <p className="text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-2xl font-display font-bold text-stone-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Menu de Ações Rápidas */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-2xl font-display font-bold text-stone-900 border-l-4 border-teal-500 pl-4">Ações Rápidas</h2>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {menuItems.map((item) => (
              <motion.button
                variants={itemVariants}
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`admin-card text-left flex flex-col items-start gap-4 ${item.hoverBorder} group relative overflow-hidden bg-white p-8 rounded-[40px] border border-stone-100 shadow-sm`}
              >
                <div className={`p-5 rounded-3xl ${item.bgColor} group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                  {item.icon}
                </div>
                <div className="relative z-10 mt-2">
                  <h3 className="text-xl font-bold text-stone-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Top Vendas / Insights */}
        <div className="space-y-8">
          <h2 className="text-2xl font-display font-bold text-stone-900 border-l-4 border-orange-500 pl-4">Destaques</h2>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-stone-900 rounded-[40px] p-8 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-6">Últimos Pedidos</h3>
              <div className="space-y-6">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/admin/vendas')}>
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center font-bold text-xs text-stone-300">
                      #{order.id}
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-bold group-hover:text-teal-400 transition-colors">{order.customerName}</p>
                      <p className="text-[10px] text-stone-400 font-medium">{order.date} • {formatPrice(order.total)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => navigate('/admin/vendas')}
                className="w-full mt-8 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-2xl text-sm transition-all border border-white/10 flex items-center justify-center gap-2"
              >
                Ver Todas as Vendas
                <TrendingUp className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-8 bg-amber-50 rounded-[40px] border border-amber-100 flex flex-col gap-4 shadow-sm"
          >
            <div className="p-4 bg-amber-100 rounded-2xl text-amber-600 w-fit">
              <Lightbulb className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-900 mb-2">Dica de Lojista</h3>
              <p className="text-sm text-amber-800 leading-relaxed font-medium">
                Produtos com fotos de alta qualidade e descrições detalhadas vendem até **40% mais**. Não esqueça de revisar os novos itens!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
