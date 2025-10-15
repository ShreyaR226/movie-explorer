export default function MovieCardSkeleton() {
  return (
    <div className="movie-card movie-card-skeleton">
      <div className="movie-card-img-container">
        <div className="relative aspect-[2/3]">
          <div className="bg-gray-200 absolute inset-0" />
        </div>
        <div className="movie-card-img-overlay">
          <div className="space-y-2">
            <div className="h-5 bg-gray-300 rounded w-4/5 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
        <div className="favorite-button">
          <div className="w-8 h-8 rounded-full bg-gray-300"></div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-10"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          <div className="h-3 bg-gray-200 rounded w-4/6"></div>
        </div>
        <div className="mt-4 h-8 bg-gray-300 rounded-md"></div>
      </div>
    </div>
  );
}