import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { ArrowLeft, Repeat, Search, XCircle, Calendar, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminSubscriptions = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<string>('Todas');
  
  const subscriptions = useQuery(api.subscriptions.listAllSubscriptions);
  const cancelSubscription = useMutation(api.subscriptions.cancelSubscriptionAdmin);

  const filteredSubscriptions = subscriptions?.filter((sub: any) => {
    if (filterStatus === 'Todas') return true;
    if (filterStatus === 'Ativa' && sub.status === 'active') return true;
    if (filterStatus === 'Cancelada' && sub.status === 'cancelled') return true;
    if (filterStatus === 'Pausada' && sub.status === 'paused') return true;
    return false;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <span className="bg-teal-50 text-teal-600 px-2 py-0.5 rounded-full text-xs font-medium">Ativa</span>;
      case 'cancelled':
        return <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-full text-xs font-medium">Cancelada</span>;
      case 'paused':
        return <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full text-xs font-medium">Pausada</span>;
      default:
        return <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin')}
                className="p-2 -ml-2 text-stone-500 hover:text-stone-900 transition-colors rounded-full hover:bg-stone-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="font-display font-black text-xl text-stone-900 flex items-center gap-2">
                <Repeat className="w-6 h-6 text-teal-600" />
                Assinaturas
                {subscriptions && (
                  <span className="text-sm font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full ml-2">
                    {subscriptions.length}
                  </span>
                )}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['Todas', 'Ativa', 'Cancelada', 'Pausada'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`whitespace-nowrap px-4 py-2 rounded-2xl text-xs font-bold transition-colors ${
                filterStatus === status
                  ? 'bg-stone-800 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {!subscriptions ? (
          <div className="text-center py-12 text-stone-500">Carregando assinaturas...</div>
        ) : filteredSubscriptions?.length === 0 ? (
          <div className="text-center py-12 text-stone-500">Nenhuma assinatura encontrada.</div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            <AnimatePresence>
              {filteredSubscriptions?.map((sub: any) => (
                <motion.div
                  key={sub._id}
                  variants={itemVariants}
                  layout
                  className="admin-card !p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2 text-sm text-stone-500">
                          <span className="font-mono bg-stone-100 px-2 py-1 rounded">
                            ID: {sub._id}
                          </span>
                        </div>
                        {getStatusBadge(sub.status)}
                      </div>
                      
                      <div className="bg-stone-50 rounded-xl p-3 space-y-2">
                        <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                          <Package className="w-4 h-4 text-stone-400" />
                          Itens
                        </h4>
                        <ul className="text-sm text-stone-600 space-y-1 pl-6 list-disc">
                          {sub.items?.map((item: any, i: number) => (
                            <li key={i}>{item.name} <span className="font-medium text-stone-900">x{item.quantity}</span></li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-stone-600 flex-wrap">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Repeat className="w-4 h-4 text-teal-600" />
                          {sub.frequency === 'monthly' ? 'Mensal' : sub.frequency === 'biweekly' ? 'Quinzenal' : sub.frequency}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-stone-400" />
                          Próx. entrega: {sub.nextDeliveryDate ? new Date(sub.nextDeliveryDate).toLocaleDateString('pt-BR') : 'N/A'}
                        </div>
                      </div>
                    </div>

                    {sub.status === 'active' && (
                      <button
                        onClick={async () => {
                          if (window.confirm('Tem certeza que deseja cancelar esta assinatura?')) {
                            try {
                              await cancelSubscription({ subscriptionId: sub._id });
                            } catch (e) {
                              alert('Erro ao cancelar assinatura');
                            }
                          }
                        }}
                        className="p-2 shrink-0 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center"
                        title="Cancelar Assinatura"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  );
};
