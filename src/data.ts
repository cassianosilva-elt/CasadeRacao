export interface Product {
  id: number;
  category: string;
  brand: string;
  name: string;
  price: number;
  priceFormatted: string;
  image: string;
  description: string;
  oldPrice?: number;
  oldPriceFormatted?: string;
  rating: number;
  reviewCount: number;
  badge?: 'Novo' | 'Promoção' | 'Frete Grátis';
}

export const products: Product[] = [
  { 
    id: 1, 
    category: 'Rações', 
    brand: 'Royal Canin', 
    name: 'Golden Retriever Adulto 15kg', 
    price: 349.90, 
    priceFormatted: 'R$ 349,90', 
    oldPrice: 389.90,
    oldPriceFormatted: 'R$ 389,90',
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=400', 
    description: 'Ração super premium indicada para cães adultos da raça Golden Retriever. Auxilia na manutenção do peso ideal e na saúde da pele e pelagem.',
    rating: 4.9,
    reviewCount: 128,
    badge: 'Frete Grátis'
  },
  { 
    id: 2, 
    category: 'Rações', 
    brand: 'Premier', 
    name: 'Ambientes Internos Gatos Castrados 7.5kg', 
    price: 189.90, 
    priceFormatted: 'R$ 189,90', 
    image: 'https://images.unsplash.com/photo-1623387641177-e8a410529390?auto=format&fit=crop&q=80&w=400', 
    description: 'Alimento completo para gatos castrados que vivem em ambientes internos. Controle de bolas de pelo e odor das fezes.',
    rating: 4.8,
    reviewCount: 85
  },
  { 
    id: 3, 
    category: 'Acessórios', 
    brand: 'Zee.Dog', 
    name: 'Peitoral Mesh Plus Gotham', 
    price: 129.00, 
    priceFormatted: 'R$ 129,00', 
    image: 'https://images.unsplash.com/photo-1602584386319-fa8eb4361c2c?auto=format&fit=crop&q=80&w=400', 
    description: 'Peitoral super confortável e ajustável, feito com trama aerada que permite a ventilação do peito do cachorro.',
    rating: 5.0,
    reviewCount: 42,
    badge: 'Novo'
  },
  { 
    id: 4, 
    category: 'Farmácia', 
    brand: 'Bravecto', 
    name: 'Antipulgas para Cães 10 a 20kg', 
    price: 215.50, 
    priceFormatted: 'R$ 215,50', 
    oldPrice: 245.00,
    oldPriceFormatted: 'R$ 245,00',
    image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=400', 
    description: 'Comprimido mastigável que protege seu cão contra pulgas e carrapatos por até 12 semanas com uma única dose.',
    rating: 4.9,
    reviewCount: 256,
    badge: 'Promoção'
  },
  { 
    id: 5, 
    category: 'Brinquedos', 
    brand: 'Kong', 
    name: 'Brinquedo Classic G', 
    price: 145.00, 
    priceFormatted: 'R$ 145,00', 
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=400', 
    description: 'O brinquedo de cachorro mais famoso do mundo. Feito de borracha natural, ideal para rechear com petiscos e estimular mentalmente seu pet.',
    rating: 5.0,
    reviewCount: 312
  },
  { 
    id: 6, 
    category: 'Rações', 
    brand: 'Guabi Natural', 
    name: 'Cães Adultos Frango e Arroz 15kg', 
    price: 289.90, 
    priceFormatted: 'R$ 289,90', 
    image: 'https://images.unsplash.com/photo-1585559700398-1385b3a8aeb6?auto=format&fit=crop&q=80&w=400', 
    description: 'Alimento Super Premium natural, sem corantes e aromas artificiais. Conservado naturalmente com antioxidantes.',
    rating: 4.7,
    reviewCount: 64
  },
  { 
    id: 7, 
    category: 'Acessórios', 
    brand: 'Zee.Dog', 
    name: 'Guia Ruff Gotham', 
    price: 159.00, 
    priceFormatted: 'R$ 159,00', 
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=400', 
    description: 'Guia com mola amortecedora que absorve o impacto do puxão. Ideal para cães que puxam muito no passeio.',
    rating: 4.8,
    reviewCount: 19
  },
  { 
    id: 8, 
    category: 'Farmácia', 
    brand: 'Simparic', 
    name: 'Antipulgas 20 a 40kg', 
    price: 198.90, 
    priceFormatted: 'R$ 198,90', 
    image: 'https://images.unsplash.com/photo-1626784215001-07e5108f9c15?auto=format&fit=crop&q=80&w=400', 
    description: 'Ação rápida e sustentada contra pulgas, carrapatos e sarnas. Proteção garantida por 35 dias.',
    rating: 4.9,
    reviewCount: 442
  },
  {
    id: 9,
    category: 'Acessórios',
    brand: 'Zee.Dog',
    name: 'Coleira Neopro Bubblegum',
    price: 79.00,
    priceFormatted: 'R$ 79,00',
    image: 'https://images.unsplash.com/photo-1591115765373-520b7a21765b?auto=format&fit=crop&q=80&w=400',
    description: 'Coleira com tecnologia NeoPro, resistente à água e muito fácil de limpar.',
    rating: 4.7,
    reviewCount: 28,
    badge: 'Novo'
  },
  {
    id: 10,
    category: 'Rações',
    brand: 'Royal Canin',
    name: 'Satiety Support Cães 10.1kg',
    price: 459.90,
    priceFormatted: 'R$ 459,90',
    image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&q=80&w=400',
    description: 'Alimento coadjuvante indicado para cães com excesso de peso. Alto teor de fibras.',
    rating: 4.9,
    reviewCount: 56
  },
  {
    id: 11,
    category: 'Brinquedos',
    brand: 'Chuckit!',
    name: 'Lançador de Bolas Sport 18M',
    price: 115.00,
    priceFormatted: 'R$ 115,00',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400',
    description: 'Lançador ergonômico que permite arremessar bolas a longas distâncias sem esforço.',
    rating: 4.8,
    reviewCount: 134
  },
  {
    id: 12,
    category: 'Farmácia',
    brand: 'Zoetis',
    name: 'Apoquel 5,4mg 20 Comprimidos',
    price: 245.90,
    priceFormatted: 'R$ 245,90',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
    description: 'Tratamento do prurido associado a dermatites alérgicas e controle da dermatite atópica.',
    rating: 4.9,
    reviewCount: 215,
    badge: 'Frete Grátis'
  },
  {
    id: 13,
    category: 'Rações',
    brand: 'Purina Pro Plan',
    name: 'Gatos Adultos Urinary Stall 7.5kg',
    price: 224.90,
    priceFormatted: 'R$ 224,90',
    oldPrice: 249.90,
    oldPriceFormatted: 'R$ 249,90',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400',
    description: 'Ajuda a manter a saúde do trato urinário inferior de gatos adultos.',
    rating: 4.8,
    reviewCount: 92,
    badge: 'Promoção'
  },
  {
    id: 14,
    category: 'Acessórios',
    brand: 'Pet Games',
    name: 'Comedouro Lento Pet Fit G',
    price: 54.90,
    priceFormatted: 'R$ 54,90',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400',
    description: 'Auxilia na digestão, evitando que o pet coma rápido demais.',
    rating: 4.6,
    reviewCount: 156
  },
  {
    id: 15,
    category: 'Acessórios',
    brand: 'Furminator',
    name: 'Escova para Cães de Pelo Curto G',
    price: 269.00,
    priceFormatted: 'R$ 269,00',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=400',
    description: 'Reduz a queda de pelos em até 90%, removendo os pelos soltos com facilidade.',
    rating: 4.9,
    reviewCount: 320
  },
  {
    id: 16,
    category: 'Rações',
    brand: 'N&D Prime',
    name: 'Gatos Adultos Cordeiro e Mirtilo 1.5kg',
    price: 134.90,
    priceFormatted: 'R$ 134,90',
    image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&q=80&w=400',
    description: 'Alimento completo de alta qualidade, sem cereais e com 98% de proteína animal.',
    rating: 5.0,
    reviewCount: 45
  },
  {
    id: 17,
    category: 'Farmácia',
    brand: 'Agener União',
    name: 'Shampoo Cloresten 200ml',
    price: 89.90,
    priceFormatted: 'R$ 89,90',
    image: 'https://images.unsplash.com/photo-1608408800697-75073040348a?auto=format&fit=crop&q=80&w=400',
    description: 'Antifúngico e antibacteriano para tratamento de dermatites em cães e gatos.',
    rating: 4.7,
    reviewCount: 88
  },
  {
    id: 18,
    category: 'Brinquedos',
    brand: 'JW Pet',
    name: 'Bolinha Hol-ee Roller M',
    price: 65.00,
    priceFormatted: 'R$ 65,00',
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=400',
    description: 'Borracha natural durável e flexível, perfeita para cães que amam morder.',
    rating: 4.8,
    reviewCount: 112
  },
  {
    id: 19,
    category: 'Acessórios',
    brand: 'Chalesco',
    name: 'Arranhador de Sofá para Gatos',
    price: 49.90,
    priceFormatted: 'R$ 49,90',
    image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&q=80&w=400',
    description: 'Proteja seus móveis e satisfaça o instinto de arranhar do seu gato.',
    rating: 4.5,
    reviewCount: 76
  },
  {
    id: 20,
    category: 'Rações',
    brand: 'Eukanuba',
    name: 'Puppy Large Breed 15kg',
    price: 319.90,
    priceFormatted: 'R$ 319,90',
    oldPrice: 349.90,
    oldPriceFormatted: 'R$ 349,90',
    image: 'https://images.unsplash.com/photo-1594149929911-78975a43d4f5?auto=format&fit=crop&q=80&w=400',
    description: 'Nutrição 100% completa e equilibrada para filhotes de raças grandes.',
    rating: 4.8,
    reviewCount: 54,
    badge: 'Promoção'
  },
  {
    id: 21,
    category: 'Acessórios',
    brand: 'Zee.Dog',
    name: 'Mochila Zee.Pack Gotham',
    price: 389.00,
    priceFormatted: 'R$ 389,00',
    image: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=400',
    description: 'Mochila de transporte super confortável e segura para pequenos animais.',
    rating: 4.9,
    reviewCount: 15,
    badge: 'Novo'
  },
  {
    id: 22,
    category: 'Farmácia',
    brand: 'Ceva',
    name: 'Feliway Classic Difusor + Refil',
    price: 215.00,
    priceFormatted: 'R$ 215,00',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400',
    description: 'Auxilia gatos a se sentirem seguros e confortáveis em seu ambiente.',
    rating: 4.9,
    reviewCount: 198
  },
  {
    id: 23,
    category: 'Brinquedos',
    brand: 'Beeztees',
    name: 'Brinquedo Pelúcia Unicórnio',
    price: 85.00,
    priceFormatted: 'R$ 85,00',
    image: 'https://images.unsplash.com/photo-1537204696486-967f1b7198c8?auto=format&fit=crop&q=80&w=400',
    description: 'Pelúcia macia e resistente com apito para diversão garantida.',
    rating: 4.7,
    reviewCount: 34
  },
  {
    id: 24,
    category: 'Rações',
    brand: 'Hill\'s Science Diet',
    name: 'Adulto 7+ Raças Pequenas 6kg',
    price: 259.00,
    priceFormatted: 'R$ 259,00',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400',
    description: 'Nutrição específica para cães de raças pequenas acima de 7 anos.',
    rating: 4.9,
    reviewCount: 110
  }
];
