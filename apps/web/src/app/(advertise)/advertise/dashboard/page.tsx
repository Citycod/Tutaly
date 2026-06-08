export default function AdvertiserDashboard() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Campaign Overview</h1>
        <a href="/advertise/create" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
          + New Campaign
        </a>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 border-t-4 border-t-yellow-400">
          <div className="text-sm text-gray-500 mb-1">Total Spent</div>
          <div className="text-3xl font-bold">₦245,000</div>
        </div>
        <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 border-t-4 border-t-blue-400">
          <div className="text-sm text-gray-500 mb-1">Total Impressions</div>
          <div className="text-3xl font-bold">124,500</div>
        </div>
        <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 border-t-4 border-t-green-400">
          <div className="text-sm text-gray-500 mb-1">Total Clicks</div>
          <div className="text-3xl font-bold">3,240</div>
        </div>
        <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 border-t-4 border-t-purple-400">
          <div className="text-sm text-gray-500 mb-1">Avg. CTR</div>
          <div className="text-3xl font-bold">2.6%</div>
        </div>
      </div>

      {/* ACTIVE CAMPAIGNS TABLE */}
      <h2 className="text-xl font-bold mb-4">Active Campaigns</h2>
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-neutral-900 border-b border-gray-100 dark:border-neutral-700">
            <tr>
              <th className="p-4 font-medium text-gray-500">Campaign</th>
              <th className="p-4 font-medium text-gray-500">Status</th>
              <th className="p-4 font-medium text-gray-500">Spent / Budget</th>
              <th className="p-4 font-medium text-gray-500">Impressions</th>
              <th className="p-4 font-medium text-gray-500">Clicks (CTR)</th>
              <th className="p-4 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100 dark:border-neutral-700">
              <td className="p-4">
                <div className="font-medium">Summer Tech Hiring</div>
                <div className="text-xs text-gray-500">Banner Ad • Home Page</div>
              </td>
              <td className="p-4">
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">Active</span>
              </td>
              <td className="p-4">
                <div className="font-medium">₦35,000 <span className="text-gray-400 font-normal">/ ₦70,000</span></div>
                <div className="w-full h-1 bg-gray-200 mt-1 rounded"><div className="w-1/2 h-full bg-blue-500 rounded"></div></div>
              </td>
              <td className="p-4">62,400</td>
              <td className="p-4">1,560 <span className="text-gray-400 text-sm">(2.5%)</span></td>
              <td className="p-4">
                <button className="text-blue-600 hover:underline text-sm mr-3">Edit</button>
                <button className="text-gray-500 hover:text-gray-900 text-sm">Pause</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
