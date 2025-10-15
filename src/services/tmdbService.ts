const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

if (!API_KEY) {
  console.warn('TMDB API key is not set. Please add NEXT_PUBLIC_TMDB_API_KEY to your environment variables.');
}

export async function fetchPopularMovies(page: number = 1) {
  if (!API_KEY) {
    throw new Error('TMDB API key is not configured');
  }
  
  const response = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`
  );
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('TMDB API Error Response:', errorText);
    throw new Error(`Failed to fetch popular movies: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

export async function searchMovies(query: string, page: number = 1) {
  if (!API_KEY) {
    throw new Error('TMDB API key is not configured');
  }
  
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}`
  );
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('TMDB API Error Response:', errorText);
    throw new Error(`Failed to search movies: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchMovieDetails(id: number) {
  if (!API_KEY) {
    throw new Error('TMDB API key is not configured');
  }
  
  const response = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`
  );
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('TMDB API Error Response:', errorText);
    throw new Error(`Failed to fetch movie details: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchMovieImages(id: number) {
  if (!API_KEY) {
    throw new Error('TMDB API key is not configured');
  }
  
  const response = await fetch(
    `${BASE_URL}/movie/${id}/images?api_key=${API_KEY}`
  );
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('TMDB API Error Response:', errorText);
    throw new Error(`Failed to fetch movie images: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}