'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import MovieCard from '@/components/MovieCard';
import MovieCardSkeleton from '@/components/MovieCardSkeleton';
import { searchMovies, fetchPopularMovies } from '@/services/tmdbService';
import { useAuth } from '@/contexts/AuthContext';
import { Movie } from '@/types/movie';

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated } = useAuth();
  const observer = useRef<IntersectionObserver | null>(null);
  const lastMovieElementRef = useRef<HTMLDivElement>(null);

  const debouncedSearchQuery = useMemo(() => {
    return searchQuery;
  }, [searchQuery]);

  const loadMovies = useCallback(async (pageNum: number = 1) => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      
      let data;
      if (debouncedSearchQuery) {
        data = await searchMovies(debouncedSearchQuery, pageNum);
      } else {
        data = await fetchPopularMovies(pageNum);
      }
      
      if (pageNum === 1) {
        setMovies(data.results);
      } else {
        setMovies(prev => [...prev, ...data.results]);
      }
      
      setHasMore(pageNum < data.total_pages);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Failed to load movies. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchQuery, isAuthenticated]);

  // Load movies when page or search query changes
  useEffect(() => {
    if (isAuthenticated) {
      loadMovies(page);
    }
  }, [page, loadMovies, isAuthenticated]);

  // Infinite scroll
  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage(prev => prev + 1);
      }
    }, {
      rootMargin: '100px'
    });

    if (lastMovieElementRef.current) {
      observer.current.observe(lastMovieElementRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore, loading, page]);

  // Reset and load first page when search query changes
  useEffect(() => {
    setPage(1);
    loadMovies(1);
  }, [debouncedSearchQuery, loadMovies]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const pageTitle = useMemo(() => {
    if (debouncedSearchQuery) {
      return `Search Results for &quot;${debouncedSearchQuery}&quot;`;
    }
    return 'Popular Movies';
  }, [debouncedSearchQuery]);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen ">
      <div className="mb-8">
        <h1 className="text-3xl text-red-700 mb-6">{pageTitle}</h1>
        
        <div className="relative max-w-xl">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for movies..."
            className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent search-bar"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          {error.includes('API key') && (
            <div className="mt-2">
              <p>Please make sure you have set your TMDB API key in the .env.local file.</p>
            </div>
          )}
        </div>
      )}
      
      {movies.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {debouncedSearchQuery ? 'No movies found for your search.' : 'No movies available.'}
          </p>
        </div>
      )}
      
      <div className="movie-grid">
        {movies.map((movie, index) => {
          if (movies.length === index + 1 && hasMore) {
            return (
              <div ref={lastMovieElementRef} key={`${movie.id}-${index}`}>
                <MovieCard movie={movie} />
              </div>
            );
          }
          return <MovieCard key={`${movie.id}-${index}`} movie={movie} />;
        })}
        
        {loading && (
          Array.from({ length: 10 }).map((_, index) => (
            <MovieCardSkeleton key={`skeleton-${index}`} />
          ))
        )}
      </div>
      
      {!hasMore && movies.length > 0 && (
        <div className="text-center text-gray-500 mt-8">
          You&apos;ve reached the end of the list
        </div>
      )}
    </div>
  );
}