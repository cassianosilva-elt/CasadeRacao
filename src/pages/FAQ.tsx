import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, Truck, CreditCard, RefreshCcw, ShieldCheck, Dog } from 'lucide-react';

const faqs = [
  {
    category: 'Entrega',
    icon: Truck,
    questions: [
      { q: 'Como é calculada a taxa de entrega?', a: 'A taxa de entrega é calculada dinamicamente com base na distância em quilômetros ao valor de R$ 1,00 por km a partir da nossa unidade mais próxima do seu endereço (Rua Edimundo Audran, 18 ou Rua Salvador Vigano, 175). Caso escolha Retirada na Loja, o frete é R$ 0,00.' },
      { q: 'Onde ficam as lojas físicas da Casa de Ração Lopes?', a: 'Possuímos duas unidades para melhor atendê-lo: 1) Rua Edimundo Audran, 18; 2) Rua Salvador Vigano, 175 (ambas no Conjunto Habitacional Barro Branco II / Cidade Tiradentes - São Paulo).' },
      { q: 'Qual o prazo de entrega?', a: 'Entregamos via rota expressa no mesmo dia para a região das lojas (em até 3h) ou em até 24h úteis para demais localidades da Grande São Paulo.' },
      { q: 'Como acompanho meu pedido?', a: 'Após a confirmação do pagamento, você receberá atualizações e código de acompanhamento via WhatsApp e E-mail.' },
    ]
  },
  {
    category: 'Pagamentos',
    icon: CreditCard,
    questions: [
      { q: 'Quais as formas de pagamento?', a: 'Aceitamos PIX (com 5% de desconto), Cartões de Crédito (até 3x sem juros) e Boleto Bancário.' },
      { q: 'É seguro comprar no site?', a: 'Sim, utilizamos criptografia SSL de ponta a ponta e processadores de pagamento certificados internacionalmente.' }
    ]
  },
  {
    category: 'Trocas e Devoluções',
    icon: RefreshCcw,
    questions: [
      { q: 'Como solicitar uma troca?', a: 'Você tem até 7 dias após o recebimento para solicitar a troca através do nosso WhatsApp de suporte.' },
      { q: 'Recebi o produto errado, e agora?', a: 'Fique tranquilo! Entre em contato conosco que faremos a coleta e reenvio sem custo adicional.' }
    ]
  }
];

interface FAQItemProps {
  q: string;
  a: string;
  key?: React.Key;
}

const FAQItem = ({ q, a }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-stone-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className={`font-bold transition-colors ${isOpen ? 'text-teal-600' : 'text-stone-700 group-hover:text-stone-900'}`}>{q}</span>
        <ChevronDown className={`w-5 h-5 text-stone-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-teal-500' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-stone-500 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FAQ = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-24">
      <div className="text-center mb-16 reveal-on-scroll">
        <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <HelpCircle className="w-8 h-8 text-teal-600" />
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-bold text-stone-900 mb-6">Como podemos ajudar?</h1>
        <p className="text-stone-500 text-lg">Tire suas dúvidas sobre entregas, pagamentos e nossa política de trocas.</p>
      </div>

      <div className="space-y-12">
        {faqs.map((cat, idx) => (
          <section key={idx} className="bg-white p-8 md:p-12 rounded-[40px] border border-stone-100 shadow-sm reveal-on-scroll" style={{ transitionDelay: `${idx * 100}ms` }}>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-stone-50 rounded-xl">
                <cat.icon className="w-6 h-6 text-stone-400" />
              </div>
              <h2 className="font-display text-2xl font-bold text-stone-900 tracking-tight">{cat.category}</h2>
            </div>
            <div className="divide-y divide-stone-50">
              {cat.questions.map((item, i) => (
                <FAQItem key={i} q={item.q} a={item.a} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-20 bg-stone-900 p-10 md:p-16 rounded-[40px] text-center text-white relative overflow-hidden reveal-on-scroll">
         <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
         <h3 className="font-display text-2xl md:text-3xl font-bold mb-4 relative z-10">Ainda tem dúvidas?</h3>
         <p className="text-stone-400 mb-10 relative z-10">Nosso time de especialistas está pronto para te atender via WhatsApp.</p>
         <a 
           href="https://wa.me/5511948219786" 
           target="_blank" 
           rel="noreferrer"
           className="inline-flex items-center gap-3 bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 px-10 rounded-full transition-all shadow-xl shadow-teal-500/20 relative z-10"
         >
           Chamar no WhatsApp
         </a>
      </div>
    </div>
  );
};
