import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Search, Filter, ChevronRight, Clock, User, Tag, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const PageHero = ({ title, subtitle, icon: Icon }: { title: string, subtitle: string, icon: any }) => (
  <div className="bg-stone-900 text-white pt-32 pb-20 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full -mr-48 -mt-48 blur-3xl"></div>
    <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/20 rounded-full -ml-40 -mb-40 blur-3xl"></div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-xl"
      >
        <Icon className="w-10 h-10 text-teal-400" />
      </motion.div>
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-display text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-stone-400"
      >
        {title}
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-stone-300 text-lg md:text-xl max-w-2xl mx-auto font-medium"
      >
        {subtitle}
      </motion.p>
    </div>
  </div>
);

const categories = [
  { id: 'all', name: 'Todos' },
  { id: 'dogs', name: 'Cães' },
  { id: 'cats', name: 'Gatos' },
  { id: 'health', name: 'Saúde & Bem-estar' },
  { id: 'training', name: 'Adestramento' },
  { id: 'nutrition', name: 'Nutrição' }
];

const blogPosts = [
  {
    id: 1,
    title: 'Como escolher a ração ideal para as diferentes fases da vida do seu cão',
    excerpt: 'Entenda como as necessidades nutricionais mudam desde filhote até a fase sênior e garanta a saúde e longevidade do seu melhor amigo.',
    category: 'Nutrição',
    categoryId: 'nutrition',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1000',
    date: '15 Mar 2026',
    author: 'Dra. Camila',
    readTime: '5 min',
    featured: true
  },
  {
    id: 2,
    title: '5 dicas infalíveis para manter seu gatinho hidratado no verão',
    excerpt: 'Gatos naturalmente bebem pouca água. Descubra truques simples para incentivar a hidratação e prevenir problemas renais.',
    category: 'Saúde & Bem-estar',
    categoryId: 'health',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000',
    date: '12 Mar 2026',
    author: 'Equipe Lopes',
    readTime: '3 min',
    featured: false
  },
  {
    id: 3,
    title: 'Guia de adaptação: Recebendo um novo pet em apartamento',
    excerpt: 'O passo a passo para garantir que o ambiente seja seguro, estimulante e acolhedor para a chegada do novo membro da família.',
    category: 'Adestramento',
    categoryId: 'training',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1000',
    date: '08 Mar 2026',
    author: 'Marcos Silva',
    readTime: '7 min',
    featured: false
  },
  {
    id: 4,
    title: 'A importância da escovação para os cães',
    excerpt: 'Muito além da estética, escovar os pelos do seu cão previne doenças de pele e ajuda a identificar parasitas cedo.',
    category: 'Saúde & Bem-estar',
    categoryId: 'health',
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1000',
    date: '01 Mar 2026',
    author: 'Dra. Camila',
    readTime: '4 min',
    featured: false
  },
  {
    id: 5,
    title: 'Brinquedos interativos para felinos',
    excerpt: 'Conheça os melhores tipos de brinquedos para estimular o instinto caçador do seu gato e evitar o tédio.',
    category: 'Gatos',
    categoryId: 'cats',
    image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=1000',
    date: '25 Fev 2026',
    author: 'Equipe Lopes',
    readTime: '4 min',
    featured: false
  },
  {
    id: 6,
    title: 'Comandos básicos que todo cão deveria saber',
    excerpt: 'Ensine comandos simples de forma positiva e melhore a comunicação e segurança do seu pet no dia a dia.',
    category: 'Adestramento',
    categoryId: 'training',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=1000',
    date: '20 Fev 2026',
    author: 'Marcos Silva',
    readTime: '6 min',
    featured: false
  }
];

export const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => window.scrollTo(0, 0), []);

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.categoryId === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredPosts.find(post => post.featured) || filteredPosts[0];
  const regularPosts = filteredPosts.filter(post => post.id !== featuredPost?.id);

  return (
    <div className="bg-stone-50 min-h-screen pb-24 font-sans">
      <PageHero 
        title="Blog Pet LOPES" 
        subtitle="O conteúdo mais completo sobre saúde, nutrição, curiosidades e dicas essenciais para você ser o melhor tutor do universo." 
        icon={BookOpen} 
      />

      {/* Barra de Pesquisa e Filtros */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl p-4 md:p-6 flex flex-col md:flex-row gap-4 items-center justify-between border border-stone-100">
          
          <div className="flex-1 w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Pesquisar artigos, dicas, guias..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all font-medium text-stone-700"
            />
          </div>

          <div className="flex w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`whitespace-nowrap px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${
                  activeCategory === category.id 
                    ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20' 
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Post Em Destaque */}
        {featuredPost && activeCategory === 'all' && searchQuery === '' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate(`/blog/${featuredPost.id}`)}
            className="mb-16 rounded-[40px] bg-white overflow-hidden shadow-2xl border border-stone-100 flex flex-col lg:flex-row group cursor-pointer"
          >
            <div className="lg:w-3/5 relative overflow-hidden h-64 lg:h-auto">
              <div className="absolute top-6 left-6 z-10">
                <span className="bg-orange-500 text-white text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                  <Tag className="w-3 h-3" /> Destaque
                </span>
              </div>
              <img 
                src={featuredPost.image} 
                alt={featuredPost.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="lg:w-2/5 p-8 md:p-12 flex flex-col justify-center relative">
              <div className="flex items-center gap-4 text-xs font-bold text-stone-500 uppercase tracking-widest mb-6">
                <span>{featuredPost.category}</span>
                <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                <span>{featuredPost.date}</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-display font-black text-stone-900 leading-tight mb-6 group-hover:text-teal-600 transition-colors">
                {featuredPost.title}
              </h2>
              <p className="text-stone-500 text-lg mb-8 leading-relaxed">
                {featuredPost.excerpt}
              </p>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center border-2 border-white shadow-sm">
                    <User className="w-5 h-5 text-stone-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-900">{featuredPost.author}</p>
                    <p className="text-xs text-stone-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {featuredPost.readTime} leitura
                    </p>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Lista de Posts */}
        {filteredPosts.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-display font-black text-stone-900">
                {activeCategory === 'all' && searchQuery === '' ? 'Últimos Artigos' : 'Resultados'}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post, i) => (
                <motion.div 
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => navigate(`/blog/${post.id}`)}
                  className="bg-white rounded-[32px] overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col"
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                      <span className="bg-white/90 backdrop-blur text-stone-900 text-[10px] font-black uppercase px-3 py-1.5 rounded-xl shadow-sm">
                        {post.category}
                      </span>
                    </div>
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-xs font-medium text-stone-400 mb-4">
                      <span>{post.date}</span>
                      <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-stone-900 mb-4 group-hover:text-teal-600 transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-stone-500 text-sm leading-relaxed mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-stone-50">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-stone-400" />
                        <span className="text-xs font-bold text-stone-600">{post.author}</span>
                      </div>
                      <span className="text-teal-500 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Ler <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[40px] border border-stone-100 shadow-sm">
            <Search className="w-16 h-16 text-stone-200 mx-auto mb-6" />
            <h3 className="text-2xl font-display font-bold text-stone-900 mb-2">Nenhum artigo encontrado</h3>
            <p className="text-stone-500">Não encontramos resultados para "{searchQuery}" nesta categoria.</p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="mt-8 bg-teal-50 text-teal-600 font-bold px-6 py-3 rounded-2xl hover:bg-teal-100 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        )}

        {/* CTA para newsletter (fictício, apenas visual) */}
        <div className="mt-24 bg-gradient-to-br from-teal-500 to-teal-700 rounded-[40px] p-8 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-2xl"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-display font-black mb-6 tracking-tight">Receba dicas exclusivas</h2>
            <p className="text-teal-50 text-lg mb-10">
              Assine nossa newsletter e receba em primeira mão conteúdos feitos por especialistas para o bem-estar do seu pet.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 justify-center" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Seu melhor e-mail" 
                className="px-6 py-4 rounded-2xl text-stone-900 w-full sm:w-96 focus:outline-none focus:ring-4 focus:ring-white/30 font-medium"
              />
              <button 
                type="button"
                className="bg-stone-900 text-white font-bold px-8 py-4 rounded-2xl hover:bg-stone-800 transition-colors whitespace-nowrap"
              >
                Inscrever-se
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
