import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PackagePlus, ClipboardList, BadgeDollarSign } from 'lucide-react';

export const AdminHome = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: '📦 Adicionar Novo Produto',
      description: 'Coloque um novo item para vender no site.',
      icon: <PackagePlus className="w-20 h-20 text-green-600" />,
      path: '/admin/novo-produto',
      color: 'hover:border-green-500'
    },
    {
      title: '📋 Ver Meus Produtos',
      description: 'Veja, mude preços ou apague produtos.',
      icon: <ClipboardList className="w-20 h-20 text-blue-600" />,
      path: '/admin/meus-produtos',
      color: 'hover:border-blue-500'
    },
    {
      title: '💰 Vendas e Pedidos',
      description: 'Veja o que os clientes compraram hoje.',
      icon: <BadgeDollarSign className="w-20 h-20 text-orange-600" />,
      path: '/admin/vendas',
      color: 'hover:border-orange-500'
    }
  ];

  return (
    <div className="space-y-12 py-8">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-stone-900">O que você deseja fazer hoje?</h1>
        <p className="text-2xl text-stone-500">Escolha uma das opções abaixo clicando no botão grande.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`admin-card text-left flex flex-col items-center text-center gap-6 ${item.color}`}
          >
            <div className="p-8 bg-stone-50 rounded-full">
              {item.icon}
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-stone-900">{item.title}</h2>
              <p className="text-xl text-stone-500 font-medium">
                {item.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-20 p-10 bg-teal-50 rounded-[40px] border-4 border-teal-100 flex items-center gap-8">
        <div className="text-5xl">💡</div>
        <div>
          <h3 className="text-2xl font-bold text-teal-900 mb-2">Dica de Amigo:</h3>
          <p className="text-xl text-teal-800">
            Sempre confira se o <strong>Preço de Venda</strong> está certinho antes de salvar um produto novo!
          </p>
        </div>
      </div>
    </div>
  );
};
