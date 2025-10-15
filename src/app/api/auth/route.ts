import { connectToDatabase } from '@/config/db';
import User from '@/models/User';
import Movie from '@/models/Movie';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { action, ...data } = await request.json();
    
    await connectToDatabase();
    
    switch (action) {
      case 'register':
        return await registerUser(data);
      case 'login':
        return await loginUser(data);
      case 'addFavorite':
        return await addFavorite(data);
      case 'removeFavorite':
        return await removeFavorite(data);
      case 'getUserFavorites':
        return await getUserFavorites(data);
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

async function registerUser({ name, email, password }: { name: string; email: string; password: string }) {
  try {
    const existingUser = await User!.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = new User!({
      name,
      email,
      password: hashedPassword,
    });
    
    await user.save();
    
    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function loginUser({ email, password }: { email: string; password: string }) {
  try {
    const user = await User!.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

async function addFavorite({ userId, movie }: { userId: string; movie: any }) {
  try {
    console.log('Adding favorite for user:', userId);
    console.log('Movie data:', movie);
    
    const user = await User!.findById(userId);
    if (!user) {
      console.log('User not found');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    let existingMovie = await Movie!.findOne({ tmdbId: movie.id });
    
    if (!existingMovie) {
      console.log('Creating new movie in database');
      existingMovie = new Movie!({
        tmdbId: movie.id,
        title: movie.title,
        overview: movie.overview,
        releaseDate: movie.release_date,
        voteAverage: movie.vote_average,
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path,
      });
      
      await existingMovie.save();
      console.log('Created movie:', existingMovie._id);
    } else {
      console.log('Movie already exists:', existingMovie._id);
    }
    
    console.log('User favorites before:', user.favorites);
    
    const isFavorite = user.favorites.includes(existingMovie._id);
    if (!isFavorite) {
      user.favorites.push(existingMovie._id);
      await user.save();
      console.log('Added movie to user favorites');
    } else {
      console.log('Movie already in favorites');
    }
    
    console.log('User favorites after:', user.favorites);
    
    const movieData = {
      id: existingMovie.tmdbId,
      title: existingMovie.title,
      overview: existingMovie.overview,
      release_date: existingMovie.releaseDate,
      vote_average: existingMovie.voteAverage,
      vote_count: 0,
      poster_path: existingMovie.posterPath,
      backdrop_path: existingMovie.backdropPath,
      popularity: 0,
      genre_ids: []
    };
    
    return NextResponse.json(movieData);
  } catch (error) {
    console.error('Add favorite error:', error);
    throw error;
  }
}

async function removeFavorite({ userId, movieId }: { userId: string; movieId: number }) {
  try {
    console.log('Removing favorite for user:', userId);
    console.log('Movie ID:', movieId);
    
    const user = await User!.findById(userId);
    if (!user) {
      console.log('User not found');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    const movie = await Movie!.findOne({ tmdbId: movieId });
    if (!movie) {
      console.log('Movie not found');
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      );
    }
    
    console.log('User favorites before:', user.favorites);
    
    user.favorites = user.favorites.filter(
      (fav: any) => fav.toString() !== movie._id.toString()
    );
    
    await user.save();
    
    console.log('User favorites after:', user.favorites);
    
    return NextResponse.json(movie);
  } catch (error) {
    console.error('Remove favorite error:', error);
    throw error;
  }
}

async function getUserFavorites({ userId }: { userId: string }) {
  try {
    console.log('Getting favorites for user:', userId);
    
    const user = await User!.findById(userId).populate('favorites');
    if (!user) {
      console.log('User not found');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    console.log('User favorites:', user.favorites);
    
    const mappedFavorites = user.favorites.map((movie: any) => ({
      id: movie.tmdbId,
      title: movie.title,
      overview: movie.overview,
      release_date: movie.releaseDate,
      vote_average: movie.voteAverage,
      vote_count: 0,
      poster_path: movie.posterPath,
      backdrop_path: movie.backdropPath,
      popularity: 0,
      genre_ids: []
    }));
    
    return NextResponse.json(mappedFavorites);
  } catch (error) {
    console.error('Get favorites error:', error);
    throw error;
  }
}