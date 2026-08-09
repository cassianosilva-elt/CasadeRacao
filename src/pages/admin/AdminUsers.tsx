import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { ArrowLeft, Users, Search, Shield, ShieldOff, Trash2, Mail, Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminUsers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const users = useQuery(api.users.listAllUsers);
  const me = useQuery(api.users.currentUser);
  
  const toggleAdmin = useMutation(api.users.toggleUserAdmin);
  const deleteUser = useMutation(api.users.deleteUser);

  const filteredUsers = users?.filter((user: any) => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
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
                <Users className="w-6 h-6 text-teal-600" />
                Usuários
                {users && (
                  <span className="text-sm font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full ml-2">
                    {users.length}
                  </span>
                )}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
          />
        </div>

        {!users ? (
          <div className="text-center py-12 text-stone-500">Carregando usuários...</div>
        ) : filteredUsers?.length === 0 ? (
          <div className="text-center py-12 text-stone-500">Nenhum usuário encontrado.</div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            <AnimatePresence>
              {filteredUsers?.map((user: any) => (
                <motion.div
                  key={user._id}
                  variants={itemVariants}
                  layout
                  className="admin-card !p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-stone-900">{user.name || 'Sem nome'}</h3>
                        {user.isAdmin ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 text-teal-600 text-xs font-medium">
                            <Shield className="w-3 h-3" />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-xs font-medium">
                            Usuário
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-stone-500 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-amber-600 font-medium">
                          <Coins className="w-4 h-4" />
                          {user.petCoins || 0} PC
                        </div>
                        <div className="text-xs">
                          Criado em: {new Date(user._creationTime).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      {me?._id !== user._id && (
                        <>
                          <button
                            onClick={async () => {
                              try {
                                await toggleAdmin({ userId: user._id });
                              } catch (e) {
                                alert('Erro ao alterar status do usuário');
                              }
                            }}
                            className={`p-2 rounded-2xl flex items-center justify-center transition-colors ${
                              user.isAdmin 
                                ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' 
                                : 'bg-teal-50 text-teal-600 hover:bg-teal-100'
                            }`}
                            title={user.isAdmin ? 'Remover Admin' : 'Tornar Admin'}
                          >
                            {user.isAdmin ? <ShieldOff className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                          </button>
                          
                          <button
                            onClick={async () => {
                              if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
                                try {
                                  await deleteUser({ userId: user._id });
                                } catch (e) {
                                  alert('Erro ao excluir usuário');
                                }
                              }
                            }}
                            className="p-2 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center"
                            title="Excluir Usuário"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
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
