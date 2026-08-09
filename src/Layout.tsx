import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, User, Heart, Instagram, Facebook, Mail, Phone, MapPin, ChevronRight, Dog, Sun, Moon, Sparkles, Scale, Users } from 'lucide-react';
import { useCart } from './CartContext';
import { useFavorites } from './FavoritesContext';
import { WhatsAppButton } from './components/WhatsAppButton';
import { ScrollToTop } from './components/ScrollToTop';
import { CookieBanner } from './components/CookieBanner';
import { WelcomePopup } from './components/WelcomePopup';
import { motion, AnimatePresence } from 'motion/react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  });
  const [searchQuery, setSearchQuery] = useState('');
  const { items } = useCart();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sincroniza o estado com o tema aplicado pelo script anti-flash no index.html.
  // Garante que o ícone (Sol/Lua) reflita o tema correto após mudanças de rota
  // e atualiza caso o usuário altere a preferência do sistema.
  useEffect(() => {
    const root = document.documentElement;
    setIsDark(root.classList.contains('dark'));

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onSysChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem('theme');
      if (saved) return; // usuário definiu preferência explícita
      const dark = e.matches;
      setIsDark(dark);
      root.classList.toggle('dark', dark);
    };
    mq.addEventListener('change', onSysChange);
    return () => mq.removeEventListener('change', onSysChange);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?busca=${searchQuery}#produtos`);
    }
  };

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Ofertas', path: '/ofertas', icon: Sparkles },
    { name: 'Comparar', path: '/comparar', icon: Scale },
    { name: 'Comunidade', path: '/comunidade', icon: Users },
    { name: 'Blog', path: '/blog' },
    { name: 'Sobre', path: '/sobre' },
  ];

  const isHome = pathname === '/';

  const toggleDark = () => {
    const dark = !isDark;
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch (e) {
      // storage indisponível (modo privado, etc.); ignora silenciosamente
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isScrolled || !isHome ? 'bg-white/95 backdrop-blur-md shadow-lg py-2 md:py-3' : 'bg-transparent py-4 md:py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            {isScrolled || !isHome ? (
              <img src="/logo.png" alt="Casa de Ração LOPES" className="h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-105" />
            ) : (
              <>
                <div className="w-8 h-8 md:w-10 md:h-10 bg-teal-500 rounded-lg md:rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-teal-500/20">
                  <Dog className="text-white w-5 h-5 md:w-6 md:h-6" />
                </div>
                <span className="font-display text-xl md:text-2xl font-black tracking-tighter transition-colors text-white">LOPES</span>
              </>
            )}
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-bold uppercase tracking-widest transition-colors ${pathname === link.path ? 'text-teal-500' : isScrolled || !isHome ? 'text-stone-600 hover:text-teal-500' : 'text-white/80 hover:text-white'}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <form onSubmit={handleSearch} className="hidden md:flex flex-grow max-w-md relative group">
            <input
              type="text"
              placeholder="Buscar ração, brinquedos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-2xl px-6 py-3 pl-12 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all ${isScrolled || !isHome ? 'bg-stone-100 text-stone-900' : 'bg-white/10 backdrop-blur-md text-white placeholder-white/50 border border-white/20'}`}
            />
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isScrolled || !isHome ? 'text-stone-400' : 'text-white/50'}`} />
          </form>

          <div className="flex items-center gap-2 md:gap-3">
            <Link to="/conta" className={`p-2 md:p-3 rounded-xl md:rounded-2xl transition-all ${isScrolled || !isHome ? 'hover:bg-stone-100 text-stone-600' : 'hover:bg-white/10 text-white'}`} aria-label="Minha Conta">
              <User className="w-5 h-5 md:w-6 md:h-6" />
            </Link>
            <Link to="/favoritos" className={`p-2 md:p-3 rounded-xl md:rounded-2xl transition-all relative ${isScrolled || !isHome ? 'hover:bg-stone-100 text-stone-600' : 'hover:bg-white/10 text-white'}`} aria-label="Favoritos">
              <Heart className="w-5 h-5 md:w-6 md:h-6" />
              {favorites.length > 0 && <span className="absolute top-1 right-1 md:top-2 md:right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse ring-2 ring-white"></span>}
            </Link>
            <Link to="/carrinho" className={`group p-2 md:p-3 rounded-xl md:rounded-2xl transition-all relative ${isScrolled || !isHome ? 'bg-stone-900 text-white' : 'bg-teal-500 text-white shadow-lg shadow-teal-500/20'}`} aria-label="Carrinho">
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                {items.length}
              </span>
            </Link>
            <button
              onClick={toggleDark}
              className={`p-2 md:p-3 rounded-xl md:rounded-2xl transition-all ${isScrolled || !isHome ? 'hover:bg-stone-100 text-stone-600' : 'hover:bg-white/10 text-white'}`}
              aria-label="Alternar Tema"
              aria-pressed={isDark}
              title={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            >
              {isDark ? <Sun className="w-5 h-5 md:w-6 md:h-6" /> : <Moon className="w-5 h-5 md:w-6 md:h-6" />}
            </button>
            <button
              onClick={() => setIsMenuOpen(true)}
              className={`lg:hidden p-2 md:p-3 rounded-xl md:rounded-2xl transition-all ${isScrolled || !isHome ? 'text-stone-600' : 'text-white'}`}
              aria-label="Abrir menu de navegação"
            >
              <Menu className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-0 bg-white z-50 flex flex-col p-6"
          >
            <div className="flex items-center justify-between mb-12">
              <Link to="/" className="flex items-center gap-2">
                <img src="/logo.png" alt="Casa de Ração LOPES" className="h-12 w-auto object-contain" />
              </Link>
              <button onClick={() => setIsMenuOpen(false)} className="p-3 bg-stone-100 rounded-2xl" aria-label="Fechar menu de navegação"><X className="w-6 h-6" /></button>
            </div>
            <nav className="flex flex-col gap-6 mb-12">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path} className="text-4xl font-display font-bold text-stone-900 hover:text-teal-500 transition-colors">
                  {link.name}
                </Link>
              ))}
            </nav>
            <form onSubmit={handleSearch} className="relative mb-auto">
              <input
                type="text"
                placeholder="O que seu pet precisa?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-6 py-5 pl-14 text-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-stone-400" />
            </form>
            <div className="flex justify-center gap-8 py-8 border-t border-stone-100 text-stone-400">
              <a href="https://www.instagram.com/casaracao_lopes?igsh=MWRqeWNqcmFrYmNrNA==" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram className="w-6 h-6" /></a>
              <a href="#" aria-label="Facebook"><Facebook className="w-6 h-6" /></a>
              <a href="tel:+5511948219786" aria-label="Telefone"><Phone className="w-6 h-6" /></a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Footer = () => (
  <footer className="bg-stone-50 border-t border-stone-100 pt-16 pb-8 md:pt-24 md:pb-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-20">
        <div className="reveal-on-scroll">
          <Link to="/" className="flex items-center gap-2 mb-6 md:mb-8 group">
            <img src="/logo.png" alt="Casa de Ração LOPES" className="h-10 md:h-12 w-auto object-contain" />
          </Link>
          <p className="text-stone-500 leading-relaxed mb-6 md:mb-8 text-sm md:text-base">Cuidando do seu melhor amigo com as melhores marcas e entrega recorde em toda São Paulo.</p>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/casaracao_lopes?igsh=MWRqeWNqcmFrYmNrNA==" target="_blank" rel="noopener noreferrer" aria-label="Siga-nos no Instagram" className="w-10 h-10 bg-white border border-stone-200 rounded-xl flex items-center justify-center text-stone-400 hover:text-teal-500 hover:border-teal-100 transition-all shadow-sm"><Instagram className="w-5 h-5" /></a>
            <a href="#" aria-label="Siga-nos no Facebook" className="w-10 h-10 bg-white border border-stone-200 rounded-xl flex items-center justify-center text-stone-400 hover:text-teal-500 hover:border-teal-100 transition-all shadow-sm"><Facebook className="w-5 h-5" /></a>
          </div>
        </div>

        <div className="reveal-on-scroll" style={{ transitionDelay: '100ms' }}>
          <h3 className="font-bold text-stone-900 mb-8 uppercase tracking-widest text-xs">Menu Rápido</h3>
          <ul className="space-y-4">
            {[
              { name: 'Sobre Nós', path: '/sobre' },
              { name: 'Blog Pet', path: '/blog' },
              { name: 'Nossas Lojas', path: '/sobre' },
              { name: 'FAQ', path: '/faq' }
            ].map(item => (
              <li key={item.name}><Link to={item.path} className="text-stone-500 hover:text-teal-600 transition-colors flex items-center gap-2 group"><ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" /> {item.name}</Link></li>
            ))}
          </ul>
        </div>

        <div className="reveal-on-scroll" style={{ transitionDelay: '200ms' }}>
          <h3 className="font-bold text-stone-900 mb-8 uppercase tracking-widest text-xs">Atendimento</h3>
          <ul className="space-y-4">
            {[
              { name: 'Política de Entrega', path: '/entrega' },
              { name: 'Trocas e Devoluções', path: '/trocas' },
              { name: 'Privacidade', path: '/sobre' },
              { name: 'Termos de Uso', path: '/sobre' }
            ].map(item => (
              <li key={item.name}><Link to={item.path} className="text-stone-500 hover:text-teal-600 transition-colors flex items-center gap-2 group"><ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" /> {item.name}</Link></li>
            ))}
          </ul>
        </div>

        <div className="reveal-on-scroll" style={{ transitionDelay: '300ms' }}>
          <h3 className="font-bold text-stone-900 mb-8 uppercase tracking-widest text-xs">Contatos & Lojas</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-9 h-9 bg-white rounded-xl shadow-sm flex items-center justify-center text-teal-600 shrink-0"><Phone className="w-4 h-4" /></div>
              <div><p className="text-[10px] font-bold text-stone-400 uppercase">Telefone</p><p className="font-bold text-stone-800 text-sm">(11) 94821-9786</p></div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-9 h-9 bg-white rounded-xl shadow-sm flex items-center justify-center text-teal-600 shrink-0"><Mail className="w-4 h-4" /></div>
              <div><p className="text-[10px] font-bold text-stone-400 uppercase">E-mail</p><p className="font-bold text-stone-800 text-sm">contato@lojalopes.com</p></div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-9 h-9 bg-white rounded-xl shadow-sm flex items-center justify-center text-teal-600 shrink-0"><MapPin className="w-4 h-4" /></div>
              <div>
                <p className="text-[10px] font-bold text-stone-400 uppercase">Loja 1</p>
                <p className="font-bold text-stone-800 text-xs">Rua Edimundo Audran, 18</p>
                <p className="text-[11px] text-stone-400">Cidade Tiradentes - SP</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-9 h-9 bg-white rounded-xl shadow-sm flex items-center justify-center text-teal-600 shrink-0"><MapPin className="w-4 h-4" /></div>
              <div>
                <p className="text-[10px] font-bold text-stone-400 uppercase">Loja 2</p>
                <p className="font-bold text-stone-800 text-xs">Rua Salvador Vigano, 175</p>
                <p className="text-[11px] text-stone-400">Cidade Tiradentes - SP</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-200 pt-12 text-center text-stone-400">
        <p className="text-sm">© 2026 Casa de Ração LOPES. CNPJ: 42.205.771/0001-65</p>
      </div>
    </div>
  </footer>
);

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white text-stone-900 selection:bg-teal-100 selection:text-teal-900">
      <Header />
      <main className="flex-grow pt-0">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
      <CookieBanner />
      <WelcomePopup />
    </div>
  );
}
