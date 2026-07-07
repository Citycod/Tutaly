export default function CommunityLoading() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 py-6 animate-pulse">
      {/* Create Post Skeleton */}
      <div className="w-full h-32 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
          <div className="h-10 bg-gray-100 rounded-full flex-1"></div>
        </div>
        <div className="flex justify-between items-center px-2">
          <div className="h-8 bg-gray-100 rounded w-20"></div>
          <div className="h-8 bg-gray-100 rounded w-20"></div>
        </div>
      </div>

      {/* Feed Skeletons */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gray-200"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-100 rounded w-1/4"></div>
            </div>
          </div>
          <div className="space-y-3 mb-4">
            <div className="h-4 bg-gray-100 rounded w-full"></div>
            <div className="h-4 bg-gray-100 rounded w-5/6"></div>
            <div className="h-4 bg-gray-100 rounded w-4/6"></div>
          </div>
          <div className="h-64 bg-gray-50 rounded-xl w-full mb-4"></div>
        </div>
      ))}
    </div>
  );
}
