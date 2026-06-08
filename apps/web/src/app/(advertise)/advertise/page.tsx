export default function AdvertiseLandingPage() {
  return (
    <div className="max-w-5xl mx-auto py-12">
      {/* HERO SECTION */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold tracking-tight mb-6">
          Reach Nigeria's Most Ambitious Professionals
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
          Advertise on Tutaly and connect with 50,000+ job seekers, employers, and professionals actively growing their careers.
        </p>
        <a 
          href="/advertise/create" 
          className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-colors"
        >
          Create Your First Ad &rarr;
        </a>
      </div>

      {/* VALUE PROPS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700">
          <div className="text-3xl mb-4">🎯</div>
          <h3 className="text-xl font-bold mb-2">Targeted Audience</h3>
          <p className="text-gray-600 dark:text-gray-400">Reach professionals by industry, role, location, and behavior.</p>
        </div>
        <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700">
          <div className="text-3xl mb-4">📊</div>
          <h3 className="text-xl font-bold mb-2">Real-time Analytics</h3>
          <p className="text-gray-600 dark:text-gray-400">Track impressions, clicks, conversions, and ROI as they happen.</p>
        </div>
        <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700">
          <div className="text-3xl mb-4">💰</div>
          <h3 className="text-xl font-bold mb-2">Flexible Budgets</h3>
          <p className="text-gray-600 dark:text-gray-400">Start from as low as ₦2,000 per day. No minimum commitment.</p>
        </div>
      </div>

      {/* AUDIENCE STATS */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-10 text-center mb-20">
        <h2 className="text-2xl font-bold mb-8">Join the platform where Nigeria's talent gathers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">50k+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Monthly Active Users</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">120+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Industries Represented</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">35</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Nigerian States</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">10k+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Daily Searches</div>
          </div>
        </div>
      </div>
    </div>
  );
}
