"use client";

import { useState, useEffect, use } from "react";
import { notFound, useRouter } from "next/navigation";
import { fetchMovieDetails } from "@/services/tmdbService";
import { MovieDetails } from "@/types/movie";
import Image from "next/image";
import FavoriteButton from "@/components/FavoriteButton";
import MovieDetailSkeleton from "@/components/MovieDetailSkeleton";

export default function MovieDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const [movie, setMovie] = useState<MovieDetails | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const [movieId, setMovieId] = useState<number | null>(null);

	const unwrappedParams = use(params);

	useEffect(() => {
		const id = parseInt(unwrappedParams.id);
		if (isNaN(id)) {
			notFound();
			return;
		}
		setMovieId(id);
	}, [unwrappedParams]);

	useEffect(() => {
		const loadMovieDetails = async () => {
			if (movieId === null) return;

			try {
				setLoading(true);
				const data = await fetchMovieDetails(movieId);
				setMovie(data);
				setError(null);
			} catch (err) {
				console.error("Error in loadMovieDetails:", err);
				if (err instanceof Error) {
					if (err.message.includes("401")) {
						setError("Authentication failed. Please check your TMDB API key.");
					} else if (err.message.includes("404")) {
						setError("Movie not found.");
					} else if (err.message.includes("fetch")) {
						setError("Network error. Please check your internet connection.");
					} else {
						setError("Failed to load movie details. Please try again later.");
					}
				} else {
					setError("An unexpected error occurred. Please try again later.");
				}
			} finally {
				setLoading(false);
			}
		};

		loadMovieDetails();
	}, [movieId]);

	if (loading) {
		return <MovieDetailSkeleton />;
	}

	if (error) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div
					className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
					role="alert"
				>
					<strong className="font-bold">Error: </strong>
					<span className="block sm:inline">{error}</span>
					{error.includes("API key") && (
						<div className="mt-2">
							<p>
								Please make sure you have set your TMDB API key in the
								.env.local file.
							</p>
						</div>
					)}
				</div>
				<div className="mt-4">
					<button
						onClick={() => router.back()}
						className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
					>
						Go Back
					</button>
				</div>
			</div>
		);
	}

	if (!movie) {
		return notFound();
	}

	const posterUrl = movie.poster_path
		? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
		: "/placeholder-image.png";

	const backdropUrl = movie.backdrop_path
		? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
		: "/placeholder-backdrop.jpg";

	const releaseYear = movie.release_date
		? new Date(movie.release_date).getFullYear()
		: null;

	const genres = movie.genres.map((genre) => genre.name).join(", ");

	return (
		<div className="container mx-auto px-4 py-8">
			<button
				onClick={() => router.back()}
				className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800"
			>
				<svg
					className="w-5 h-5 mr-2"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					></path>
				</svg>
				Back to Movies
			</button>

			<div className="flex flex-col md:flex-row gap-8">
				<div className="md:w-1/3">
					<div className="relative rounded-lg overflow-hidden shadow-lg">
						<Image
							src={posterUrl}
							alt={movie.title}
							width={500}
							height={750}
							className="w-full h-auto"
							priority
						/>
					</div>
				</div>

				<div className="md:w-2/3">
					<div className="flex justify-between items-start">
						<h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
							{movie.title}
							{releaseYear && (
								<span className="text-2xl text-gray-600">
									{" "}
									({releaseYear})
								</span>
							)}
						</h1>
						<FavoriteButton movie={movie} />
					</div>

					<div className="flex flex-wrap items-center gap-4 mb-6">
						<div className="flex items-center">
							<span className="text-yellow-500 mr-1">★</span>
							<span className="text-lg font-medium text-gray-900">
								{movie.vote_average.toFixed(1)}
							</span>
							<span className="text-gray-600 ml-1">
								({movie.vote_count} votes)
							</span>
						</div>

						{movie.runtime > 0 && (
							<span className="text-gray-600">
								{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
							</span>
						)}

						{genres && (
							<span className="text-gray-600">{genres}</span>
						)}
					</div>

					{movie.tagline && (
						<p className="text-xl italic text-gray-700 mb-6">
							"{movie.tagline}"
						</p>
					)}

					<div className="mb-6">
						<h2 className="text-xl font-semibold text-gray-900 mb-2">
							Overview
						</h2>
						<p className="text-gray-700 leading-relaxed">
							{movie.overview || "No overview available."}
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
						{movie.release_date && (
							<div>
								<h3 className="font-medium text-gray-900">
									Release Date
								</h3>
								<p className="text-gray-700">
									{new Date(movie.release_date).toLocaleDateString("en-US", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</p>
							</div>
						)}

						{movie.status && (
							<div>
								<h3 className="font-medium text-gray-900">
									Status
								</h3>
								<p className="text-gray-700">
									{movie.status}
								</p>
							</div>
						)}

						{movie.budget > 0 && (
							<div>
								<h3 className="font-medium text-gray-900">
									Budget
								</h3>
								<p className="text-gray-700">
									${movie.budget.toLocaleString()}
								</p>
							</div>
						)}

						{movie.revenue > 0 && (
							<div>
								<h3 className="font-medium text-gray-900">
									Revenue
								</h3>
								<p className="text-gray-700">
									${movie.revenue.toLocaleString()}
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}