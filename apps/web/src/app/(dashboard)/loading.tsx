export default function DashboardLoading() {
  return (
    <div className="w-full h-full p-6 animate-pulse">
      <div className="flex items-center justify-between mb-8">
        <div className="h-8 bg-gray-200 rounded-lg w-1/4"></div>
        <div className="h-10 bg-gray-100 rounded-lg w-32"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="h-32 bg-gray-100 rounded-2xl"></div>
        <div className="h-32 bg-gray-100 rounded-2xl"></div>
        <div className="h-32 bg-gray-100 rounded-2xl"></div>
      </div>
      
      <div className="space-y-4">
        <div className="h-24 bg-gray-50 rounded-xl w-full"></div>
        <div className="h-24 bg-gray-50 rounded-xl w-full"></div>
        <div className="h-24 bg-gray-50 rounded-xl w-full"></div>
        <div className="h-24 bg-gray-50 rounded-xl w-full"></div>
      </div>
    </div>
  );
}
