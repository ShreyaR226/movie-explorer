import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/types/movie';
import FavoriteButton from './FavoriteButton';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder-image.png';

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;

  return (
    <div className="movie-card group">
      <div className="movie-card-img-container">
        <div className="relative aspect-[2/3]">
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="movie-card-img-overlay">
          <h3 className="movie-card-title line-clamp-2 text-sm md:text-base">
            {movie.title}
          </h3>
          {releaseYear && (
            <span className="text-xs text-gray-300">
              {releaseYear}
            </span>
          )}
        </div>
        <div className="favorite-button">
          <FavoriteButton movie={movie} />
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">
            {movie.release_date ? new Date(movie.release_date).toLocaleDateString() : 'TBD'}
          </span>
          <div className="flex items-center">
            <span className="text-yellow-500 mr-1">★</span>
            <span className="text-sm font-medium text-gray-900">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-700 line-clamp-3 flex-grow">
          {movie.overview || 'No overview available.'}
        </p>
        <Link 
          href={`/movie/${movie.id}`}
          className="mt-3 inline-block text-center py-2 px-4 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}