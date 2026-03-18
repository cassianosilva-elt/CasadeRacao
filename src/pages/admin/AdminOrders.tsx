import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ArrowLeft, CheckCircle, Clock, Package, Truck, CheckCircle2, XCircle, User as UserIcon, Phone, Mail, X } from 'lucide-react';
import { OrderStatus } from './adminContext';

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
      case 'pending': return <span className="text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1"><Clock className="w-4 h-4" /> Aguardando Pagamento</span>;
      case 'paid': return <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Pago</span>;
      case 'preparing': return <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1"><Package className="w-4 h-4" /> Em Separação</span>;
      case 'shipped': return <span className="text-orange-600 bg-orange-50 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1"><Truck className="w-4 h-4" /> Em Rota de Entrega</span>;
      case 'delivered': return <span className="text-teal-600 bg-teal-50 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Entregue</span>;
      case 'cancelled': return <span className="text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1"><XCircle className="w-4 h-4" /> Cancelado</span>;
      default: return null;
    }
  };

  if (convexOrders === undefined) {
    return <div className="py-20 text-center text-stone-500 font-bold">Carregando pedidos...</div>;
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
      <div className="space-y-10 py-8">
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-stone-500 hover:text-stone-900 font-bold text-xl"
          >
            <ArrowLeft className="w-6 h-6" />
            Voltar para o Início
          </button>
          <h1 className="text-4xl font-black text-stone-900">Vendas e Pedidos de Hoje</h1>
          <p className="text-xl text-stone-500">Acompanhe quem comprou e o status de cada entrega.</p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="admin-card border-l-[16px] border-l-stone-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-4 flex-grow">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-stone-400">Pedido #{order.shortId} • {order.date}</span>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-stone-900">Cliente: {order.customerName}</h3>
                    <p className="text-2xl text-stone-600 font-medium">🛒 Comprou: <span className="font-bold">{order.items}</span></p>
                    <p className="text-3xl font-black text-teal-600">Total: R$ {order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 w-full md:w-auto">
                  <div className="flex flex-wrap gap-2">
                    {/* ... status update buttons remain the same */}
                    {order.status === 'pending' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'paid')}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-bold text-sm transition-colors"
                      >
                        Marcar como PAGO ✅
                      </button>
                    )}
                    {order.status === 'paid' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold text-sm transition-colors"
                      >
                        Começar a SEPARAR 📦
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'shipped')}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-xl font-bold text-sm transition-colors"
                      >
                        SAIU para ENTREGA 🚚
                      </button>
                    )}
                    {order.status === 'shipped' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded-xl font-bold text-sm transition-colors"
                      >
                        Confirmar ENTREGA ✨
                      </button>
                    )}
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        className="bg-stone-200 hover:bg-red-100 hover:text-red-700 text-stone-600 px-4 py-3 rounded-xl font-bold text-sm transition-colors"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="bg-stone-100 text-stone-600 hover:bg-stone-200 px-6 py-4 rounded-2xl font-bold text-xl transition-colors"
                  >
                    Ver Detalhes do Cliente
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 p-10 rounded-[40px] border-4 border-amber-100 text-center">
          <p className="text-2xl font-bold text-amber-900">
            ⚠️ Lembre-se: Entrega rápida faz o cliente ficar muito feliz!
          </p>
        </div>
      </div>

      {/* Modal de Detalhes do Cliente */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="bg-stone-900 p-8 text-white flex justify-between items-center">
              <h2 className="text-2xl font-black">Detalhes do Cliente</h2>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center text-stone-400">
                  <UserIcon className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-stone-400 font-bold uppercase text-xs tracking-wider">Nome do Cliente</p>
                  <h3 className="text-2xl font-black text-stone-900">{selectedOrder.customerName}</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <p className="text-stone-400 font-bold uppercase text-xs tracking-wider flex items-center gap-2">
                    <Phone className="w-3 h-3" /> WhatsApp / Telefone
                  </p>
                  <p className="text-xl font-bold text-stone-800">{selectedOrder.customerPhone || 'Não informado'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-stone-400 font-bold uppercase text-xs tracking-wider flex items-center gap-2">
                    <Mail className="w-3 h-3" /> E-mail
                  </p>
                  <p className="text-xl font-bold text-stone-800">{selectedOrder.customerEmail || 'Não informado'}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-stone-100">
                <p className="text-stone-400 font-bold uppercase text-xs tracking-wider mb-4 text-center">Ações Rápidas</p>
                <div className="flex gap-4">
                  <a 
                    href={`https://wa.me/${selectedOrder.customerPhone?.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-bold text-center transition-colors"
                  >
                    Chamar no WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
