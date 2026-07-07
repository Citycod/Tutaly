export default function Loading() {
  return (
    <div className="w-full min-h-screen p-8 animate-pulse bg-white">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="h-12 bg-gray-200 rounded-lg w-1/3"></div>
        <div className="space-y-4">
          <div className="h-64 bg-gray-100 rounded-2xl w-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-48 bg-gray-100 rounded-2xl"></div>
            <div className="h-48 bg-gray-100 rounded-2xl"></div>
            <div className="h-48 bg-gray-100 rounded-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
