import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType>({} as FavoritesContextType);

export const FavoritesProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorite_ids');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch (e) {
      return [];
    }
  });

  const { addToast } = useToast();

  useEffect(() => {
    localStorage.setItem('favorite_ids', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const stringId = String(id);
      if (prev.includes(stringId)) {
        return prev.filter(favId => favId !== stringId);
      } else {
        addToast('Adicionado aos favoritos!', 'success');
        return [...prev, stringId];
      }
    });
  };

  const isFavorite = (id: string) => favorites.includes(String(id));

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
