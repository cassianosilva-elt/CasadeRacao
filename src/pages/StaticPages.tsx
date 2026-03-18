import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Truck, RefreshCcw, Info, BookOpen, ShieldCheck, Heart, Dog, MapPin } from 'lucide-react';

const PageHero = ({ title, subtitle, icon: Icon }: { title: string, subtitle: string, icon: any }) => (
  <div className="bg-stone-900 text-white pt-32 pb-20 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full -mr-48 -mt-48 blur-3xl"></div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
      <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20">
        <Icon className="w-8 h-8 text-teal-400" />
      </div>
      <h1 className="font-display text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase">{title}</h1>
      <p className="text-stone-400 text-lg max-w-2xl mx-auto font-medium">{subtitle}</p>
    </div>
  </div>
);

export const About = () => {
  useEffect(() => window.scrollTo(0, 0), []);
  return (
    <div className="bg-white pb-24">
      <PageHero 
        title="Nossa História" 
        subtitle="Desde 2012, cuidando do seu melhor amigo com dedicação e os melhores produtos do mercado paulista." 
        icon={Info} 
      />
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="prose prose-stone max-w-none text-stone-600 leading-relaxed space-y-8">
           <h2 className="font-display text-3xl font-bold text-stone-900">Paixão por animais em cada detalhe</h2>
           <p className="text-xl font-medium text-stone-700 italic border-l-4 border-teal-500 pl-6 py-2">
             "A Casa de Ração LOPES nasceu de um sonho simples: oferecer nutrição de qualidade para pets com o carinho que eles merecem."
           </p>
           <p>
             Localizada no coração de São Paulo, somos mais que uma loja de ração. Somos um ponto de encontro para tutores que buscam o melhor para seus companheiros. Nossa equipe é formada por especialistas que amam o que fazem, garantindo que você sempre leve o produto ideal para a necessidade específica do seu pet.
           </p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
              <div className="p-8 bg-stone-50 rounded-[40px] border border-stone-100">
                 <ShieldCheck className="w-10 h-10 text-teal-600 mb-6" />
                 <h3 className="font-bold text-stone-900 text-xl mb-4">Qualidade Certificada</h3>
                 <p className="text-sm">Trabalhamos apenas com marcas líderes e produtos com procedência garantida, assegurando a saúde do seu animal.</p>
              </div>
              <div className="p-8 bg-orange-50 rounded-[40px] border border-orange-100">
                 <Heart className="w-10 h-10 text-orange-500 mb-6" />
                 <h3 className="font-bold text-stone-900 text-xl mb-4">Atendimento Humano</h3>
                 <p className="text-sm">Não somos apenas um e-commerce. Estamos aqui para ouvir suas dúvidas e ajudar na escolha da ração perfeita.</p>
              </div>
           </div>
           <h2 className="font-display text-3xl font-bold text-stone-900">Nossa Loja Física</h2>
           <div className="aspect-video bg-stone-200 rounded-[40px] overflow-hidden relative group">
              <img src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2000" alt="Loja" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
              <div className="absolute inset-0 bg-stone-900/40 flex items-center justify-center pointer-events-none">
                 <div className="text-center">
                    <MapPin className="w-12 h-12 text-white mx-auto mb-4" />
                    <p className="text-white font-bold text-xl">Rua das Flores, 123 - São Paulo/SP</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export const Delivery = () => {
  useEffect(() => window.scrollTo(0, 0), []);
  return (
    <div className="bg-white pb-24">
      <PageHero 
        title="Entrega Rápida" 
        subtitle="Entendemos que a fome do seu pet não pode esperar. Por isso, operamos com logística de ponta." 
        icon={Truck} 
      />
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          <div className="text-center">
             <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mx-auto mb-6">
                <Clock className="w-8 h-8" />
             </div>
             <h3 className="font-bold text-stone-900 mb-2">Até 24h</h3>
             <p className="text-stone-500 text-sm">Entrega expressa para toda capital de SP.</p>
          </div>
          <div className="text-center">
             <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mx-auto mb-6">
                <Truck className="w-8 h-8" />
             </div>
             <h3 className="font-bold text-stone-900 mb-2">Frete Grátis</h3>
             <p className="text-stone-500 text-sm">Em compras acima de R$ 150 na cidade de SP.</p>
          </div>
          <div className="text-center">
             <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mx-auto mb-6">
                <MapPin className="w-8 h-8" />
             </div>
             <h3 className="font-bold text-stone-900 mb-2">Rastreio Real</h3>
             <p className="text-stone-500 text-sm">Acompanhe seu pedido em tempo real pelo site.</p>
          </div>
        </div>
        <div className="bg-stone-50 p-10 md:p-16 rounded-[40px] border border-stone-100">
           <h2 className="font-display text-2xl font-bold text-stone-900 mb-6">Informações Importantes</h2>
           <ul className="space-y-6 text-stone-600">
              <li className="flex gap-4">
                 <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 shrink-0"></div>
                 <p>Pedidos realizados até as 11h são enviados no mesmo dia para a capital.</p>
              </li>
              <li className="flex gap-4">
                 <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 shrink-0"></div>
                 <p>As entregas ocorrem de segunda a sábado, entre as 09h e 19h.</p>
              </li>
              <li className="flex gap-4">
                 <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 shrink-0"></div>
                 <p>É necessário que haja alguém no local para o recebimento do pedido.</p>
              </li>
           </ul>
        </div>
      </div>
    </div>
  );
};

export const Returns = () => {
  useEffect(() => window.scrollTo(0, 0), []);
  return (
    <div className="bg-white pb-24">
      <PageHero 
        title="Trocas e Devoluções" 
        subtitle="Sua satisfação é nossa prioridade absoluta. Conheça nossa política flexível de trocas." 
        icon={RefreshCcw} 
      />
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="prose prose-stone max-w-none text-stone-600">
           <p className="text-lg mb-12">Seguimos rigorosamente o Código de Defesa do Consumidor, mas buscamos ir além para garantir que sua experiência seja positiva.</p>
           <h3 className="font-display text-2xl font-bold text-stone-900 mb-6">Prazo para Arrependimento</h3>
           <p className="mb-10">Você tem até 7 (sete) dias corridos após o recebimento para desistir da compra e solicitar o estorno integral do valor pago.</p>
           <h3 className="font-display text-2xl font-bold text-stone-900 mb-6">Condições do Produto</h3>
           <p className="mb-10">Para que a troca ou devolução seja aceita, o produto deve estar em sua embalagem original, sem sinais de uso e acompanhado da nota fiscal.</p>
           <div className="bg-red-50 p-8 rounded-3xl border border-red-100 text-red-800 text-sm">
              <p className="flex items-center gap-3 font-bold mb-2 uppercase tracking-widest"><Info className="w-5 h-5" /> Importante</p>
              <p>Produtos perecíveis, como rações abertas, só podem ser trocados em caso de vício ou defeito de fabricação, conforme orientação da marca fabricante.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export const Blog = () => {
  useEffect(() => window.scrollTo(0, 0), []);
  return (
    <div className="bg-white pb-24">
      <PageHero 
        title="Blog Pet LOPES" 
        subtitle="Dicas de saúde, nutrição e curiosidades para você ser o melhor tutor do mundo." 
        icon={BookOpen} 
      />
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {[
            { t: 'Como escolher a ração ideal?', d: 'Aprenda a ler os rótulos e entender as necessidades nutricionais do seu pet.', c: 'Nutrição' },
            { t: '5 dicas para gatinhos hidratados', d: 'Truques simples para garantir que seu felino beba mais água no dia a dia.', c: 'Saúde' },
            { t: 'Adaptação de pets em apartamentos', d: 'Tudo o que você precisa saber para criar um ambiente feliz em espaços reduzidos.', c: 'Comportamento' }
          ].map((post, i) => (
            <div key={i} className="group cursor-pointer">
               <div className="aspect-[16/10] bg-stone-100 rounded-[32px] mb-6 overflow-hidden relative">
                  <div className="absolute top-4 left-4 bg-teal-500 text-white text-[10px] font-bold px-3 py-1 rounded-full z-10">{post.c}</div>
                  <div className="w-full h-full bg-stone-200 group-hover:scale-110 transition-transform duration-700"></div>
               </div>
               <h3 className="font-display text-2xl font-bold text-stone-900 mb-4 group-hover:text-teal-600 transition-colors">{post.t}</h3>
               <p className="text-stone-500 text-sm leading-relaxed mb-6 line-clamp-2">{post.d}</p>
               <button className="text-stone-900 font-bold text-sm flex items-center gap-2 group-hover:gap-4 transition-all">Ler mais <ChevronRight className="w-4 h-4 text-teal-500" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const StaticPages = { About, Delivery, Returns, Blog };
