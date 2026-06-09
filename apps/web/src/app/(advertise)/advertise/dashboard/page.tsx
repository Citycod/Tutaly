import Link from 'next/link';

export default function AdvertiserDashboard() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8 border-b border-neutral-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Campaign Overview</h1>
          <p className="text-gray-400">Manage your advertising campaigns and track performance.</p>
        </div>
        <Link 
          href="/advertise/create" 
          className="px-6 py-3 bg-brand-blue text-white rounded-lg font-bold hover:bg-brand-blue/90 transition-colors shadow-[0_0_15px_rgba(27,79,158,0.3)]"
        >
          + New Campaign
        </Link>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800 border-t-4 border-t-brand-gold relative overflow-hidden">
          <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">Total Spent</div>
          <div className="text-4xl font-mono font-bold text-white">₦245k</div>
          <div className="absolute -bottom-4 -right-4 text-brand-gold opacity-10 text-8xl">₦</div>
        </div>
        <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800 border-t-4 border-t-brand-blue relative overflow-hidden">
          <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">Total Impressions</div>
          <div className="text-4xl font-mono font-bold text-white">124k</div>
          <div className="absolute -bottom-4 -right-4 text-brand-blue opacity-10 text-8xl">👁</div>
        </div>
        <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800 border-t-4 border-t-brand-green relative overflow-hidden">
          <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">Total Clicks</div>
          <div className="text-4xl font-mono font-bold text-white">3,240</div>
          <div className="absolute -bottom-4 -right-4 text-brand-green opacity-10 text-8xl">👆</div>
        </div>
        <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800 border-t-4 border-t-brand-red relative overflow-hidden">
          <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">Avg. CTR</div>
          <div className="text-4xl font-mono font-bold text-white">2.6%</div>
          <div className="absolute -bottom-4 -right-4 text-brand-red opacity-10 text-8xl">%</div>
        </div>
      </div>

      {/* ACTIVE CAMPAIGNS TABLE */}
      <h2 className="text-2xl font-bold mb-6 text-white">Active Campaigns</h2>
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-neutral-950/50 border-b border-neutral-800">
              <tr>
                <th className="p-5 font-semibold text-gray-400 uppercase tracking-wider text-sm">Campaign</th>
                <th className="p-5 font-semibold text-gray-400 uppercase tracking-wider text-sm">Status</th>
                <th className="p-5 font-semibold text-gray-400 uppercase tracking-wider text-sm">Spent / Budget</th>
                <th className="p-5 font-semibold text-gray-400 uppercase tracking-wider text-sm text-right">Impressions</th>
                <th className="p-5 font-semibold text-gray-400 uppercase tracking-wider text-sm text-right">Clicks (CTR)</th>
                <th className="p-5 font-semibold text-gray-400 uppercase tracking-wider text-sm text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              <tr className="hover:bg-neutral-800/50 transition-colors">
                <td className="p-5">
                  <div className="font-bold text-white text-lg">Summer Tech Hiring</div>
                  <div className="text-sm text-brand-blue font-mono mt-1">Banner Ad • Home Page</div>
                </td>
                <td className="p-5">
                  <span className="px-3 py-1 bg-brand-green/20 text-brand-green rounded-full text-xs font-bold uppercase tracking-wider border border-brand-green/30">Active</span>
                </td>
                <td className="p-5 w-64">
                  <div className="font-mono font-medium text-white mb-2 flex justify-between">
                    <span>₦35,000</span>
                    <span className="text-gray-500">₦70,000</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-gold rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </td>
                <td className="p-5 text-right font-mono text-gray-300">62,400</td>
                <td className="p-5 text-right font-mono">
                  <span className="text-white">1,560</span> 
                  <span className="text-gray-500 ml-2">(2.5%)</span>
                </td>
                <td className="p-5 text-center">
                  <button className="text-brand-blue hover:text-white font-medium mr-4 transition-colors">Edit</button>
                  <button className="text-brand-gold hover:text-white font-medium transition-colors">Pause</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
