export default function PublicLoading() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start pt-16 px-4 animate-pulse">
      <div className="w-full max-w-4xl space-y-8">
        <div className="h-16 bg-gray-200 rounded-xl w-3/4 mx-auto mb-12"></div>
        
        <div className="flex gap-4 mb-8 justify-center">
          <div className="h-12 bg-gray-100 rounded-full w-32"></div>
          <div className="h-12 bg-gray-100 rounded-full w-32"></div>
          <div className="h-12 bg-gray-100 rounded-full w-32"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-50 rounded-2xl border border-gray-100"></div>
          <div className="h-64 bg-gray-50 rounded-2xl border border-gray-100"></div>
          <div className="h-64 bg-gray-50 rounded-2xl border border-gray-100"></div>
          <div className="h-64 bg-gray-50 rounded-2xl border border-gray-100"></div>
        </div>
      </div>
    </div>
  );
}
