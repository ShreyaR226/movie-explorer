import bcrypt from 'bcryptjs';
import { Movie as MovieType } from '@/types/movie';

const callAuthAPI = async (action: string, data: any) => {
  console.log('Calling auth API:', action, data);
  
  const response = await fetch('/api/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, ...data }),
  });
  
  const result = await response.json();
  
  console.log('API response:', response.status, result);
  
  if (!response.ok) {
    throw new Error(result.error || 'An unexpected error occurred');
  }
  
  return result;
};

export const registerUser = async (name: string, email: string, password: string) => {
  try {
    return await callAuthAPI('register', { name, email, password });
  } catch (error: any) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    return await callAuthAPI('login', { email, password });
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const addFavorite = async (userId: string, movie: MovieType) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    if (!movie || !movie.id) {
      throw new Error('Valid movie object is required');
    }
    
    return await callAuthAPI('addFavorite', { userId, movie });
  } catch (error) {
    console.error('Add favorite error:', error);
    throw error;
  }
};

export const removeFavorite = async (userId: string, movieId: number) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    if (!movieId) {
      throw new Error('Movie ID is required');
    }
    
    return await callAuthAPI('removeFavorite', { userId, movieId });
  } catch (error) {
    console.error('Remove favorite error:', error);
    throw error;
  }
};

export const getUserFavorites = async (userId: string) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    return await callAuthAPI('getUserFavorites', { userId });
  } catch (error) {
    console.error('Get favorites error:', error);
    throw error;
  }
};