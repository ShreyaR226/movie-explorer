"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Movie } from '@/types/movie';
import { useAuth } from './AuthContext';

const getAuthService = async () => {
  const { addFavorite, removeFavorite, getUserFavorites } = await import('@/services/authService');
  return { addFavorite, removeFavorite, getUserFavorites };
};

interface FavoritesContextType {
  favorites: Movie[];
  addFavorite: (movie: Movie) => Promise<void>;
  removeFavorite: (id: number) => Promise<void>;
  isFavorite: (id: number) => boolean;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        
        if (!isAuthenticated || !user) {
          setFavorites([]);
          setLoading(false);
          return;
        }
        
        console.log('Loading favorites from MongoDB for user:', user.id);
        
        const { getUserFavorites } = await getAuthService();
        const userFavorites = await getUserFavorites(user.id);
        
        console.log('Favorites loaded from MongoDB:', userFavorites);
        setFavorites(userFavorites);
      } catch (error) {
        console.error('Failed to load favorites:', error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [isAuthenticated, user]);

  const addFavorite = async (movie: Movie) => {
    try {
      console.log('Adding favorite:', movie);
      
      if (!isAuthenticated || !user) {
        throw new Error('You must be logged in to add favorites');
      }
      
      console.log('Adding favorite to MongoDB for user:', user.id);
      
      const { addFavorite } = await getAuthService();
      await addFavorite(user.id, movie);
      setFavorites(prev => {
        if (prev.some(fav => fav.id === movie.id)) {
          return prev;
        }
        console.log('Added to state');
        return [...prev, movie];
      });
    } catch (error) {
      console.error('Failed to add favorite:', error);
      throw error;
    }
  };

  const removeFavorite = async (id: number) => {
    try {
      console.log('Removing favorite:', id);
      
      if (!isAuthenticated || !user) {
        throw new Error('You must be logged in to remove favorites');
      }
      
      console.log('Removing favorite from MongoDB for user:', user.id);
      
      const { removeFavorite } = await getAuthService();
      await removeFavorite(user.id, id);
      setFavorites(prev => {
        const newFavorites = prev.filter(movie => movie.id !== id);
        console.log('Removed from state');
        return newFavorites;
      });
    } catch (error) {
      console.error('Failed to remove favorite:', error);
      throw error;
    }
  };

  const isFavorite = (id: number) => {
    return favorites.some(movie => movie.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}