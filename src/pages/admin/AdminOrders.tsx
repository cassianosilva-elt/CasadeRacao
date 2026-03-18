import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ArrowLeft, CheckCircle, Clock, Package, Truck, CheckCircle2, XCircle, User as UserIcon, Phone, Mail, X } from 'lucide-react';
import { OrderStatus } from './adminContext';
import { motion, AnimatePresence } from 'motion/react';

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

export const AdminOrders = () => {
  const navigate = useNavigate();
  const convexOrders = useQuery(api.orders.listAllOrders);
  const updateOrderStatusMutation = useMutation(api.orders.updateOrderStatus);
  const [selectedOrder, setSelectedOrder] = React.useState<any>(null);

  const updateOrderStatus = async (id: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatusMutation({ orderId: id as any, status: newStatus });
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return <span className="text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider"><Clock className="w-3 h-3" /> Aguardando Pagamento</span>;
      case 'paid': return <span className="text-green-600 bg-green-50 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider"><CheckCircle className="w-3 h-3" /> Pago</span>;
      case 'preparing': return <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider"><Package className="w-3 h-3" /> Em Separação</span>;
      case 'shipped': return <span className="text-orange-600 bg-orange-50 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider"><Truck className="w-3 h-3" /> Em Rota de Entrega</span>;
      case 'delivered': return <span className="text-teal-600 bg-teal-50 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider"><CheckCircle2 className="w-3 h-3" /> Entregue</span>;
      case 'cancelled': return <span className="text-red-600 bg-red-50 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider"><XCircle className="w-3 h-3" /> Cancelado</span>;
      default: return null;
    }
  };

  if (convexOrders === undefined) {
    return <div className="py-20 text-center text-stone-500 font-bold text-sm">Carregando pedidos...</div>;
  }

  const orders = convexOrders?.map(o => ({
    id: o._id,
    shortId: o._id.substring(0, 6).toUpperCase(),
    customerName: o.tutor.name,
    customerPhone: o.tutor.whatsapp,
    customerEmail: o.tutor.email,
    items: o.items.map((i: any) => `${i.quantity}x ${i.name}`).join(', '),
    total: o.total,
    status: o.status as OrderStatus,
    date: new Date(o._creationTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + ' - ' + new Date(o._creationTime).toLocaleDateString('pt-BR')
  })) || [];

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-6 py-6">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <button 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-stone-500 hover:text-stone-900 font-bold text-sm mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <h1 className="text-2xl font-black text-stone-900 font-display">Vendas e Pedidos</h1>
          <p className="text-sm text-stone-500">Acompanhe quem comprou e o status de cada entrega.</p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {orders.map((order) => (
            <motion.div variants={itemVariants} key={order.id} className="admin-card !p-4 border-l-[6px] border-l-stone-200 hover:border-l-teal-400 overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-3 flex-grow w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-400">#{order.shortId} • {order.date}</span>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-stone-900 leading-none">{order.customerName}</h3>
                    <p className="text-sm text-stone-600 line-clamp-2">🛒 <span className="font-medium">{order.items}</span></p>
                    <p className="text-lg font-black text-teal-600 font-display pt-1">R$ {order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto shrink-0 md:items-center">
                  <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    {order.status === 'pending' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'paid')}
                        className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-bold text-xs transition-colors shadow-sm"
                      >
                        PAGO ✅
                      </button>
                    )}
                    {order.status === 'paid' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-bold text-xs transition-colors shadow-sm"
                      >
                        SEPARAR 📦
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'shipped')}
                        className="flex-1 md:flex-none bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg font-bold text-xs transition-colors shadow-sm"
                      >
                        ENVIAR 🚚
                      </button>
                    )}
                    {order.status === 'shipped' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="flex-1 md:flex-none bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded-lg font-bold text-xs transition-colors shadow-sm"
                      >
                        ENTREGUE ✨
                      </button>
                    )}
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        className="flex-none bg-stone-100 hover:bg-red-50 hover:text-red-600 text-stone-500 px-3 py-2 rounded-lg font-bold text-xs transition-colors"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="w-full md:w-auto bg-stone-50 text-stone-600 hover:bg-stone-100 hover:text-stone-900 px-4 py-2 rounded-xl font-bold text-xs transition-colors border border-stone-200"
                  >
                    Ver Cliente
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {orders.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-teal-50 p-4 rounded-2xl border border-teal-100 text-center"
          >
            <p className="text-sm font-bold text-teal-800">
              Entrega rápida faz o cliente feliz! Mantenha os status sempre atualizados.
            </p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl"
            >
              <div className="bg-stone-50 p-4 sm:p-6 border-b border-stone-100 flex justify-between items-center">
                <h2 className="text-base font-black text-stone-900 font-display">Detalhes do Cliente</h2>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 hover:bg-stone-200 rounded-full transition-colors text-stone-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4 sm:p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900">{selectedOrder.customerName}</h3>
                    <p className="text-stone-400 font-medium text-[10px] uppercase tracking-wider">Cliente da Loja</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-stone-400 font-bold uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-stone-300" /> WhatsApp / Telefone
                    </p>
                    <p className="text-sm font-bold text-stone-800">{selectedOrder.customerPhone || 'Não informado'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-stone-400 font-bold uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-stone-300" /> E-mail
                    </p>
                    <p className="text-sm font-bold text-stone-800 break-all">{selectedOrder.customerEmail || 'Não informado'}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100">
                  <a 
                    href={`https://wa.me/${selectedOrder.customerPhone?.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-bold text-sm transition-colors shadow-sm"
                  >
                    <Phone className="w-4 h-4" />
                    Chamar no WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
