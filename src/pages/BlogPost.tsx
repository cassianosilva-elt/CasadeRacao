import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, User, Share2, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';

// Reusing the same mock data for simplicity. Ideally this would be fetched from an API.
const blogPosts = [
  {
    id: 1,
    title: 'Como escolher a ração ideal para as diferentes fases da vida do seu cão',
    excerpt: 'Entenda como as necessidades nutricionais mudam desde filhote até a fase sênior e garanta a saúde e longevidade do seu melhor amigo.',
    content: `A nutrição é um dos pilares mais importantes para a saúde do seu cão. Assim como nós, as necessidades nutricionais dos cães mudam significativamente ao longo de suas vidas. Oferecer a dieta correta em cada fase é fundamental para garantir o desenvolvimento adequado, a manutenção da saúde e a longevidade.\n\n### Fase de Filhote (0 a 1 ano)\n\nDurante o primeiro ano de vida, os cães estão em fase de crescimento acelerado. A ração para filhotes deve ser rica em proteínas de alta qualidade e gorduras para fornecer a energia necessária para o desenvolvimento muscular e ósseo. Nutrientes essenciais como cálcio e fósforo devem estar em proporções ideais para evitar problemas de desenvolvimento esquelético, especialmente em raças grandes.\n\n### Fase Adulta (1 a 7 anos)\n\nNa fase adulta, o foco muda para a manutenção da saúde geral. A dieta deve ser balanceada, fornecendo a quantidade certa de calorias para evitar o ganho de peso excessivo, que é um problema comum em cães adultos. Ingredientes de alta qualidade, fibras para a saúde digestiva e antioxidantes para o sistema imunológico são essenciais.\n\n### Fase Sênior (7+ anos)\n\nÀ medida que os cães envelhecem, seu metabolismo desacelera e suas necessidades nutricionais mudam novamente. As rações sênior costumam ter menos calorias e gorduras para prevenir a obesidade, e são enriquecidas com ingredientes como glucosamina e condroitina para apoiar a saúde das articulações, que podem começar a apresentar desgaste.\n\nLembre-se sempre de consultar o seu veterinário antes de fazer mudanças significativas na dieta do seu pet. Cada animal é único e pode ter necessidades específicas que devem ser consideradas.`,
    category: 'Nutrição',
    categoryId: 'nutrition',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2000',
    date: '15 Mar 2026',
    author: 'Dra. Camila',
    readTime: '5 min',
  },
  {
    id: 2,
    title: '5 dicas infalíveis para manter seu gatinho hidratado no verão',
    excerpt: 'Gatos naturalmente bebem pouca água. Descubra truques simples para incentivar a hidratação e prevenir problemas renais.',
    content: `Os gatos, por sua natureza de origem desértica, têm uma tendência a beber menos água do que realmente precisam. Isso pode levar a problemas sérios no trato urinário, especialmente durante os meses mais quentes do verão. Aqui estão 5 dicas para ajudar seu felino a se manter hidratado:\n\n1. **Troque a água diariamente**: Gatos são muito exigentes com a limpeza. Água parada por muito tempo pode adquirir odores ou sabores que eles não gostam. Troque a água pelo menos uma vez ao dia.\n2. **Use fontes de água**: O som e o movimento da água corrente são atrativos instintivos para a maioria dos gatos. Uma fonte para pets pode incentivar bastante a ingestão de água.\n3. **Espalhe potes pela casa**: Ter apenas um bebedouro pode ser insuficiente. Coloque potes em locais estratégicos, longe da caixa de areia e da comida, para que a água esteja sempre acessível durante seus passeios pela casa.\n4. **Adicione alimentos úmidos**: Rações úmidas (sachês ou enlatados) contêm até 80% de água. Substituir uma refeição ou misturar com a ração seca é uma excelente forma de aumentar a hidratação.\n5. **Potes largos e rasos**: As vibrissas (bigodes) dos gatos são muito sensíveis. Potes fundos que os obrigam a encostar os bigodes nas bordas podem causar desconforto. Recomenda-se potes mais largos.`,
    category: 'Saúde & Bem-estar',
    categoryId: 'health',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2000',
    date: '12 Mar 2026',
    author: 'Equipe Lopes',
    readTime: '3 min',
  },
  {
    id: 3,
    title: 'Guia de adaptação: Recebendo um novo pet em apartamento',
    excerpt: 'O passo a passo para garantir que o ambiente seja seguro, estimulante e acolhedor para a chegada do novo membro da família.',
    content: `Morar em apartamento não significa que você não possa ter a alegria de compartilhar a vida com um pet. No entanto, o espaço reduzido exige preparações especiais e uma rotina adaptada para garantir o bem-estar do animal.\n\n### Preparando o Ambiente\n\nAntes do pet chegar, é crucial tornar o apartamento seguro ('pet-friendly'). Instale telas de proteção em todas as janelas e varandas. Remova plantas tóxicas, esconda fios elétricos e guarde produtos de limpeza e medicamentos em locais inacessíveis.\n\n### Escolhendo o Cantinho\n\nDefina onde o pet vai dormir e fazer suas necessidades. Evite colocar a caixa de areia ou tapete higiênico perto da área de alimentação e descanso. Gatos preferem locais tranquilos e fechados para a caixa de areia, enquanto cães se adaptam bem a um cantinho na área de serviço ou varanda protegida.\n\n### A Importância do Passeio\n\nEspecialmente para cães, morar em apartamento significa que a principal fonte de exercício e estímulo mental será fora de casa. Passeios diários e frequentes são indispensáveis. Para gatos, invista pesado em enriquecimento ambiental: prateleiras nas paredes (gatificação), arranhadores verticais e brinquedos interativos.\n\n### A Chegada\n\nNos primeiros dias, tenha paciência. O pet precisará de tempo para se acostumar com os novos sons (elevador, vizinhos), odores e espaço limitado. Deixe-o explorar no próprio ritmo, mantendo uma atitude calma e encorajadora.`,
    category: 'Adestramento',
    categoryId: 'training',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=2000',
    date: '08 Mar 2026',
    author: 'Marcos Silva',
    readTime: '7 min',
  },
  {
    id: 4,
    title: 'A importância da escovação para os cães',
    excerpt: 'Muito além da estética, escovar os pelos do seu cão previne doenças de pele e ajuda a identificar parasitas cedo.',
    content: `Muitos tutores veem a escovação apenas como uma forma de deixar o cão mais bonito e reduzir pelos pela casa, mas seus benefícios vão muito além da estética.\n\n### Saúde da Pele\n\nA escovação regular ajuda a distribuir a oleosidade natural da pele por toda a pelagem, garantindo fios mais brilhantes e impermeáveis. Além disso, remove células mortas, sujeira e detritos que podem causar irritações e até mesmo infecções cutâneas se acumulados sob a pelagem densa.\n\n### Evitando Nós\n\nEm cães de pelo longo ou encaracolado, a falta de escovação rápida leva à formação de nós. Esses emaranhados dolorosos repuxam a pele a cada movimento e podem esconder problemas graves, impedindo que a pele respire e criando um ambiente perfeito para bactérias e fungos.\n\n### O Momento Check-up\n\nO ato de escovar todo o corpo do seu cão proporciona a oportunidade ideal para realizar um "check-up" caseiro. Você poderá identificar rapidamente carrapatos, pulgas, feridas, calombos ou sinais de dor que passariam despercebidos no dia a dia corrido.\n\nAcostume seu cão à escovação desde filhote, utilizando a escova ou rasqueadeira adequada para o tipo de pelo dele, e transforme essa rotina em um momento de carinho e conexão entre vocês.`,
    category: 'Saúde & Bem-estar',
    categoryId: 'health',
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=2000',
    date: '01 Mar 2026',
    author: 'Dra. Camila',
    readTime: '4 min',
  },
  {
    id: 5,
    title: 'Brinquedos interativos para felinos',
    excerpt: 'Conheça os melhores tipos de brinquedos para estimular o instinto caçador do seu gato e evitar o tédio.',
    content: `Gatos são caçadores inatos. Em ambientes indoor, eles frequentemente não têm estímulos suficientes para liberar essa energia instintiva, o que pode levar a obesidade, problemas comportamentais e tédio crônico. A solução? Brinquedos interativos!\n\n### Quebra-cabeças Alimentares\n\nEstes brinquedos exigem que o gato "trabalhe" para conseguir sua comida. Embolar a ração em bolinhas difusoras de petiscos ou usar tabuleiros de caça estimula a mente e o corpo, simulando o esforço de uma caçada real.\n\n### Varinhas\n\nNenhum brinquedo supera a interação proporcionada pelas varinhas (que simulam presas no ar ou no chão) manipuladas pelo tutor. 15 minutos de caça com a varinha imitando um pássaro ferido ou um inseto proporciona exercícios intensos e satisfaz o instinto predador. Sempre deixe o gato "caçar" no final para não gerar frustração.\n\n### Brinquedos com Catnip e Eletrônicos\n\nBolos de lã com catnip (erva-do-gato) são clássicos adorados por muitos gatos, induzindo estados de euforia e relaxamento. Além disso, brinquedos eletrônicos modernos, como peixes que se debatem ou lasers automáticos (lembre-se de sempre oferecer uma presa física após o laser) são excelentes para quando você não tem muito tempo.\n\nA regra de ouro é: faça o rodízio dos brinquedos. Gatos se entediam facilmente. Guarde alguns por uma semana e faça a troca para manter o interesse sempre em alta.`,
    category: 'Gatos',
    categoryId: 'cats',
    image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=2000',
    date: '25 Fev 2026',
    author: 'Equipe Lopes',
    readTime: '4 min',
  },
  {
    id: 6,
    title: 'Comandos básicos que todo cão deveria saber',
    excerpt: 'Ensine comandos simples de forma positiva e melhore a comunicação e segurança do seu pet no dia a dia.',
    content: `O adestramento básico não é sobre transformar seu cão em um robô, mas sobre estabelecer um canal claro de comunicação e garantir a segurança dele e dos outros.\n\n**O comando 'Senta'** é geralmente o primeiro e mais fácil de ensinar. Serve como fundação para outros comandos e é um substituto excelente para o salto. Quando seu cão quiser atenção ou algo que você tem, pedir o 'senta' ensina paciência e autocontrole.\n\n**O comando 'Fica'** é essencial para a segurança. Impede que o cão corra para fora do portão aberto, pule para fora do carro antes da hora ou se aproxime de perigos. É um comando de controle de impulso que exige prática consistente em ambientes com distrações gradativamente maiores.\n\n**O 'Deita'** é útil para acalmar o cão em ambientes agitados ou quando você precisa que ele permaneça parado por mais tempo, como num restaurante pet-friendly.\n\n**O comando 'Vem' (Recall)** é, sem dúvida, o mais importante para a segurança vital do animal. Um recall confiável pode prevenir que seu cão corra para a rua ou se envolva em conflitos com outros animais. O segredo é fazer com que vir até você seja sempre a escolha mais incrível do mundo — recompensada entusiasticamente com petiscos de alto valor, festa e brinquedos.\n\nO uso consistente de reforço positivo (premiar os acertos e ignorar/redirecionar os erros) torna todo o processo um jogo divertido para o cão, não uma obrigação penosa.`,
    category: 'Adestramento',
    categoryId: 'training',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=2000',
    date: '20 Fev 2026',
    author: 'Marcos Silva',
    readTime: '6 min',
  }
];

export const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const post = blogPosts.find(p => p.id === Number(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center pt-32 pb-20">
        <h1 className="text-4xl font-display font-black text-stone-900 mb-4">Artigo não encontrado</h1>
        <p className="text-stone-500 mb-8">O artigo que você está procurando não existe ou foi removido.</p>
        <button 
          onClick={() => navigate('/blog')}
          className="bg-teal-500 text-white font-bold px-8 py-4 rounded-2xl hover:bg-teal-600 transition-colors"
        >
          Voltar para o Blog
        </button>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white">
      {/* Hero Image */}
      <div className="w-full h-[50vh] md:h-[60vh] relative pt-24 bg-stone-900">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-4xl mx-auto">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 uppercase tracking-widest text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para o Blog
          </Link>
          <div className="flex items-center gap-3 text-xs font-bold text-teal-400 uppercase tracking-widest mb-4">
            <span className="bg-teal-500/20 text-teal-300 px-3 py-1 rounded-lg backdrop-blur">{post.category}</span>
            <span className="text-stone-400">{post.date}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-white leading-tight mb-6">
            {post.title}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-stone-800 flex items-center justify-center border-2 border-stone-600">
              <User className="w-6 h-6 text-stone-400" />
            </div>
            <div>
              <p className="text-base font-bold text-white leading-none mb-1">{post.author}</p>
              <p className="text-sm text-stone-400 flex items-center gap-1">
                <Clock className="w-4 h-4" /> {post.readTime} leitura
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        {/* Abstract/Excerpt (Lead) */}
        <p className="text-xl md:text-2xl text-stone-500 font-medium leading-relaxed mb-12 italic border-l-4 border-teal-500 pl-6">
          {post.excerpt}
        </p>

        {/* Content Formatting */}
        <div className="prose prose-stone prose-lg max-w-none text-stone-700">
          {post.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('###')) {
              return <h3 key={idx} className="text-2xl font-display font-bold text-stone-900 mt-10 mb-4">{paragraph.replace('###', '').trim()}</h3>;
            } else if (paragraph.match(/^\d+\./)) {
              return <p key={idx} className="my-4">{paragraph}</p>; // For simplicity of rendering numbered lists
            } else {
              return <p key={idx} className="mb-6">{paragraph}</p>;
            }
          })}
        </div>

        {/* Share Section */}
        <div className="mt-16 pt-8 border-t border-stone-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex gap-4 items-center">
            <span className="font-bold text-stone-400 uppercase text-xs tracking-widest">Compartilhe:</span>
            <button className="w-10 h-10 bg-stone-50 rounded-full flex items-center justify-center hover:bg-teal-50 hover:text-teal-600 transition-colors text-stone-500"><Facebook className="w-4 h-4" /></button>
            <button className="w-10 h-10 bg-stone-50 rounded-full flex items-center justify-center hover:bg-teal-50 hover:text-teal-600 transition-colors text-stone-500"><Twitter className="w-4 h-4" /></button>
            <button className="w-10 h-10 bg-stone-50 rounded-full flex items-center justify-center hover:bg-teal-50 hover:text-teal-600 transition-colors text-stone-500" onClick={() => navigator.clipboard.writeText(window.location.href)}><LinkIcon className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </article>
  );
};
