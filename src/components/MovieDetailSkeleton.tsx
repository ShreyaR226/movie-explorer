export default function MovieDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 h-6 bg-gray-200 rounded w-24"></div>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <div className="relative rounded-lg overflow-hidden shadow-lg aspect-[2/3]">
            <div className="bg-gray-200 rounded-lg aspect-[2/3]"></div>
          </div>
        </div>
        
        <div className="md:w-2/3">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-20 ml-2"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
          </div>
          
          <div className="h-5 bg-gray-200 rounded w-1/2 mb-6"></div>
          
          <div className="mb-6">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}