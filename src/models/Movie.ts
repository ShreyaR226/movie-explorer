import mongoose, { Schema, Document } from 'mongoose';

export interface IMovie extends Document {
  tmdbId: number;
  title: string;
  overview: string;
  releaseDate: string;
  voteAverage: number;
  posterPath: string;
  backdropPath: string;
  createdAt: Date;
}

const MovieSchema: Schema = new Schema(
  {
    tmdbId: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    overview: {
      type: String,
      required: true,
    },
    releaseDate: {
      type: String,
      required: true,
    },
    voteAverage: {
      type: Number,
      required: true,
    },
    posterPath: {
      type: String,
    },
    backdropPath: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

MovieSchema.index({ tmdbId: 1 });

const Movie = typeof window === 'undefined' 
  ? (mongoose.models.Movie || mongoose.model<IMovie>('Movie', MovieSchema))
  : null;

export default Movie;