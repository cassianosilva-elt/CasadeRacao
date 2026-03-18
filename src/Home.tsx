import React, { useState, useEffect } from 'react';
import { Star, Truck, MessageCircle, Dog, Cat, Fish, Pill, ChevronRight, Heart, ArrowUpDown, Check, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { products, Product } from './data';
import { useCart } from './CartContext';
import { useFavorites } from './FavoritesContext';

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=2000",
    title: "Festival de Rações",
    subtitle: "As melhores marcas com até 20% OFF",
    cta: "Aproveitar Ofertas",
    badge: "Promoção"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=2000",
    title: "Tudo para seu Gato",
    subtitle: "Areias, sachês e brinquedos com frete grátis",
    cta: "Ver Produtos",
    badge: "Novidade"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=2000",
    title: "Farmácia Pet",
    subtitle: "Antipulgas e vermífugos em até 3x sem juros",
    cta: "Proteger meu Pet",
    badge: "Saúde"
  }
];

const PromoSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[400px] md:h-[600px] w-full overflow-hidden bg-stone-900">
      {slides.map((slide, index) => (
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: index === current ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
          style={{ pointerEvents: index === current ? 'auto' : 'none', zIndex: index === current ? 10 : 0 }}
        >
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-xl">
                <motion.span
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: index === current ? 0 : 20, opacity: index === current ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-block bg-orange-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full mb-4"
                >
                  {slide.badge}
                </motion.span>
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: index === current ? 0 : 20, opacity: index === current ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-3xl sm:text-4xl md:text-7xl font-display font-bold text-white mb-4 md:mb-6 leading-tight"
                >
                  {slide.title}
                </motion.h2>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: index === current ? 0 : 20, opacity: index === current ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-base sm:text-lg md:text-xl text-stone-200 mb-8 md:mb-10"
                >
                  {slide.subtitle}
                </motion.p>
                <motion.a
                  href="#produtos"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: index === current ? 0 : 20, opacity: index === current ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="inline-flex items-center bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 px-10 rounded-full transition-all text-lg shadow-lg shadow-teal-500/20"
                >
                  {slide.cta}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-3 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-3 rounded-full transition-all duration-300 ${idx === current ? 'bg-orange-500 w-10' : 'bg-white/50 w-3 hover:bg-white'}`}
            aria-label={`Ir para slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const TrustSignals = () => (
  <div className="bg-white border-b border-stone-100 py-6 md:py-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 text-center divide-y md:divide-y-0 md:divide-x divide-stone-100">
        <div className="flex flex-col items-center justify-center pt-4 md:pt-0">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-3 md:mb-4">
            <Truck className="w-6 h-6 md:w-7 md:h-7 text-teal-600" />
          </div>
          <h3 className="font-bold text-stone-900 text-base md:text-lg">Entrega Rápida</h3>
          <p className="text-stone-500 text-sm md:text-base">Para toda São Paulo</p>
        </div>
        <div className="flex flex-col items-center justify-center pt-6 md:pt-0">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-3 md:mb-4">
            <Star className="w-6 h-6 md:w-7 md:h-7 text-orange-600" />
          </div>
          <h3 className="font-bold text-stone-900 text-base md:text-lg">Melhores Marcas</h3>
          <p className="text-stone-500 text-sm md:text-base">Produtos 100% originais</p>
        </div>
        <div className="flex flex-col items-center justify-center pt-6 md:pt-0">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-3 md:mb-4">
            <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-teal-600" />
          </div>
          <h3 className="font-bold text-stone-900 text-base md:text-lg">Suporte Humanizado</h3>
          <p className="text-stone-500 text-sm md:text-base">Chame no WhatsApp</p>
        </div>
      </div>
    </div>
  </div>
);

const Categories = () => {
  const categories = [
    { name: 'Rações', icon: Dog, color: 'bg-orange-100 text-orange-600' },
    { name: 'Acessórios', icon: Cat, color: 'bg-teal-100 text-teal-600' },
    { name: 'Brinquedos', icon: Fish, color: 'bg-blue-100 text-blue-600' },
    { name: 'Farmácia', icon: Pill, color: 'bg-red-100 text-red-600' },
  ];
  return (
    <section aria-labelledby="categories-heading" className="py-12 md:py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 id="categories-heading" className="font-display text-3xl md:text-4xl font-bold text-stone-900 mb-4">O que seu pet precisa hoje?</h2>
          <p className="text-stone-500">Navegue por nossas principais categorias e encontre os melhores produtos para a saúde e diversão do seu melhor amigo.</p>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link 
                to={`/?categoria=${cat.name}#produtos`} 
                className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 flex flex-col items-center hover:shadow-xl hover:border-teal-200 transition-all group w-full"
              >
                <div aria-hidden="true" className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-4 md:mb-6 ${cat.color} group-hover:scale-110 transition-transform shadow-inner`}>
                  <cat.icon className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                <span className="font-bold text-stone-800 text-base md:text-lg">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProductGrid = () => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  
  const urlCategory = searchParams.get('categoria') || 'Todos';
  const urlSearch = searchParams.get('busca') || '';

  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [sortOrder, setSortOrder] = useState<'default' | 'priceLow' | 'priceHigh' | 'name'>('default');

  useEffect(() => {
    setSelectedCategory(urlCategory);
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [urlCategory, urlSearch]);

  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(urlSearch.toLowerCase()) || p.brand.toLowerCase().includes(urlSearch.toLowerCase());
    return matchCategory && matchSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === 'priceLow') return a.price - b.price;
    if (sortOrder === 'priceHigh') return b.price - a.price;
    if (sortOrder === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const clearFilters = () => {
    setSelectedCategory('Todos');
    setSortOrder('default');
    setSearchParams({});
  };

  return (
    <section id="produtos" aria-labelledby="products-heading" className="py-12 md:py-24 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6"
        >
          <div>
            <h2 id="products-heading" className="font-display text-3xl md:text-5xl font-bold text-stone-900">
              {urlSearch ? `Resultados para "${urlSearch}"` : 'Ofertas em Destaque'}
            </h2>
            <p className="text-stone-500 mt-2">Os melhores preços e marcas para o seu pet.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <ArrowUpDown className="w-5 h-5 text-stone-400" />
            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="bg-stone-50 border border-stone-200 text-stone-700 text-sm rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none w-full md:w-auto cursor-pointer"
            >
              <option value="default">Ordenar por</option>
              <option value="priceLow">Menor Preço</option>
              <option value="priceHigh">Maior Preço</option>
              <option value="name">Nome (A-Z)</option>
            </select>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-8 md:mb-12 overflow-x-auto no-scrollbar pb-2"
        >
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => { setSelectedCategory(cat); setSearchParams({ categoria: cat }); }} 
              className={`px-5 py-2.5 md:px-6 md:py-3 rounded-full text-xs md:text-sm font-bold transition-all shadow-sm whitespace-nowrap ${selectedCategory === cat ? 'bg-teal-500 text-white shadow-teal-500/20' : 'bg-white text-stone-600 border border-stone-100 hover:bg-stone-50'}`}
            >
              {cat}
            </button>
          ))}
        </motion.div>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white border border-stone-100 rounded-[20px] md:rounded-3xl overflow-hidden p-3 md:p-6 animate-shimmer">
                <div className="bg-stone-100 h-32 md:h-48 rounded-xl md:rounded-2xl mb-3 md:mb-4"></div>
                <div className="bg-stone-100 h-3 w-1/3 rounded mb-2"></div>
                <div className="bg-stone-100 h-5 w-full rounded mb-3 md:mb-4"></div>
                <div className="bg-stone-100 h-8 md:h-10 w-full rounded-lg md:rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
            {sortedProducts.map((product, i) => (
              <motion.article 
                key={product.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.1 }}
                className="bg-white border border-stone-100 rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative group"
              >
                {product.badge && (
                  <span className={`absolute top-2 left-2 md:top-4 md:left-4 z-10 text-[8px] md:text-[10px] font-bold uppercase tracking-widest px-2 py-1 md:px-3 md:py-1.5 rounded-full text-white ${
                    product.badge === 'Novo' ? 'bg-blue-500' : product.badge === 'Promoção' ? 'bg-orange-500' : 'bg-teal-500'
                  }`}>
                    {product.badge}
                  </span>
                )}
                <button 
                  onClick={(e) => { e.preventDefault(); toggleFavorite(product.id); }}
                  aria-label={isFavorite(product.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                  className="absolute top-2 right-2 md:top-4 md:right-4 z-10 p-2 md:p-2.5 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 border border-stone-100"
                >
                  <Heart className={`w-4 h-4 md:w-5 md:h-5 ${isFavorite(product.id) ? 'fill-red-500 text-red-500' : 'text-stone-400'}`} />
                </button>
                <Link to={`/produto/${product.id}`} className="block relative pt-[100%] bg-stone-50/50 overflow-hidden">
                  <img src={product.image} alt={product.name} loading="lazy" className="absolute inset-0 w-full h-full object-contain p-6 mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                </Link>
                <div className="p-3 md:p-6 flex flex-col flex-grow">
                  <p className="text-[10px] md:text-xs font-bold text-teal-600 uppercase mb-1 md:mb-2 tracking-wider">{product.brand}</p>
                  <Link to={`/produto/${product.id}`} className="font-bold text-stone-900 text-sm md:text-base leading-snug mb-2 md:mb-3 hover:text-teal-600 line-clamp-2 transition-colors">{product.name}</Link>
                  <div className="flex items-center gap-1 mb-2 md:mb-4">
                    <Star className="w-3 h-3 md:w-3.5 md:h-3.5 text-orange-400 fill-orange-400" />
                    <span className="text-xs md:text-sm font-bold text-stone-700">{product.rating}</span>
                    <span className="text-[10px] md:text-xs text-stone-400">({product.reviewCount})</span>
                  </div>
                  <div className="mt-auto pt-3 md:pt-4 flex items-end justify-between">
                    <div>
                      {product.oldPriceFormatted && <p className="text-[10px] md:text-xs text-stone-400 line-through mb-0 md:mb-0.5">{product.oldPriceFormatted}</p>}
                      <p className="text-lg md:text-2xl font-display font-bold text-stone-900 leading-none">{product.priceFormatted}</p>
                    </div>
                    <button 
                      onClick={() => addToCart(product)} 
                      className="bg-stone-900 hover:bg-teal-500 text-white p-2 md:p-3 rounded-xl md:rounded-2xl transition-all shadow-sm shrink-0 ml-2"
                      aria-label="Adicionar ao carrinho"
                    >
                      <Plus className="w-4 h-4 md:w-6 md:h-6" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-24 bg-stone-50 rounded-[40px] border border-stone-100"
          >
            <p className="text-stone-400 font-medium text-lg mb-6">Nenhum produto encontrado com estes filtros.</p>
            <button onClick={clearFilters} className="bg-stone-900 text-white px-8 py-4 rounded-full font-bold hover:bg-stone-800 transition-all shadow-lg">Limpar Todos os Filtros</button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials = [
    { name: 'Ricardo Dias', pet: 'Thor (Golden)', text: 'Entrega absurdamente rápida! Comprei a ração de manhã e chegou à tarde. Atendimento nota 10.', image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100' },
    { name: 'Ana Costa', pet: 'Luna (Gata)', text: 'Os brinquedos da Zee.Dog são os favoritos da Luna. Loja super confiável e com ótimos preços.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
    { name: 'João Paulo', pet: 'Bidu (Poodle)', text: 'Sempre encontro o Simparic com preço bom aqui. O suporte via WhatsApp ajuda muito nas dúvidas.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100' },
  ];

  return (
    <section className="py-12 md:py-24 bg-stone-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="font-display text-2xl md:text-5xl font-bold mb-3 md:mb-4">Quem ama seu pet, confia em nós.</h2>
          <p className="text-stone-300 text-sm md:text-base">Veja o que dizem nossos clientes sobre a experiência na Loja LOPES.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -10 }}
              className="bg-stone-800/50 p-10 rounded-[40px] border border-stone-700"
            >
              <div className="flex mb-6">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 text-orange-500 fill-orange-500 mr-1" />)}
              </div>
              <p className="text-stone-300 italic mb-8 leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold">{t.name}</h4>
                  <p className="text-xs text-stone-400">Tutor do {t.pet}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BrandLogos = () => {
  const brands = ['Royal Canin', 'Premier', 'Zee.Dog', 'Bravecto', 'Kong', 'Purina', 'Zoetis', 'Simparic'];
  return (
    <section className="py-10 md:py-20 bg-white border-b border-stone-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-stone-400 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs mb-8 md:mb-12">Principais Marcas Parceiras</p>
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-6 md:gap-x-16 md:gap-y-10 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
          {brands.map(brand => (
             <span key={brand} className="text-lg md:text-2xl font-display font-black text-stone-900">{brand.toUpperCase()}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="py-16 md:py-24 bg-teal-500 relative overflow-hidden">
       <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-white/10 rounded-full -mr-32 -mt-32 md:-mr-48 md:-mt-48 blur-3xl" />
       <div className="absolute bottom-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-stone-900/5 rounded-full -ml-24 -mb-24 md:-ml-32 md:-mb-32 blur-2xl" />
       
       <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
         >
           <h2 className="font-display text-2xl md:text-5xl font-bold text-white mb-4 md:mb-6">Mime seu pet com descontos exclusivos!</h2>
           <p className="text-teal-50 text-base md:text-lg mb-8 md:mb-10 leading-relaxed">Receba nossas melhores ofertas, cupons e dicas de saúde animal direto no seu email. Prometemos não encher sua caixa.</p>
           
           <AnimatePresence mode="wait">
             {subscribed ? (
               <motion.div 
                 initial={{ scale: 0.8, opacity: 0 }} 
                 animate={{ scale: 1, opacity: 1 }} 
                 className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 inline-flex items-center gap-3 text-white font-bold"
               >
                 <Check className="w-6 h-6 text-white" />
                 Inscrição confirmada! Prepare-se para ofertas incríveis.
               </motion.div>
             ) : (
               <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
                 <input 
                   type="email" 
                   required 
                   placeholder="Seu melhor e-mail" 
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="flex-grow bg-white border-2 border-transparent focus:border-stone-900 rounded-2xl px-6 py-4 outline-none text-stone-900 font-medium"
                 />
                 <button 
                   type="submit" 
                   className="bg-stone-900 hover:bg-stone-800 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-xl shadow-stone-900/20"
                 >
                   Inscrever agora
                 </button>
               </form>
             )}
           </AnimatePresence>
         </motion.div>
       </div>
    </section>
  );
};

export default function Home() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [hash]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <PromoSlider />
      <TrustSignals />
      <BrandLogos />
      <Categories />
      <ProductGrid />
      <Testimonials />
      <Newsletter />
    </>
  );
}
