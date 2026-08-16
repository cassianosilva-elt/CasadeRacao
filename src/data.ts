export interface Product {
  id: number | string;
  category: string;
  brand: string;
  name: string;
  price: number;
  priceFormatted?: string;
  image?: string;
  images?: string[];
  description?: string;
  oldPrice?: number;
  oldPriceFormatted?: string;
  rating?: number;
  reviewCount?: number;
  badge?: 'Novo' | 'Promoção' | 'Frete Grátis' | string;
  bagSize?: string;
}

export const calculateFoodAmount = (weight: number, age: 'puppy' | 'adult' | 'senior') => {
  // Base daily amount in grams per kg
  let baseAmount = 15; 
  if (age === 'puppy') baseAmount = 25;
  if (age === 'senior') baseAmount = 12;
  
  const dailyAmount = Math.round(weight * baseAmount);
  return {
    daily: dailyAmount,
    monthly: Math.round((dailyAmount * 30) / 1000) // in kg
  };
};

export const products: Product[] = [];
