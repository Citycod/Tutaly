import { ReactNode } from 'react';

export default async function AdvertiseLayout({ children }: { children: ReactNode }) {
  // We can add logic to fetch user and restrict 'seeker' from specific routes using middleware instead, 
  // but if needed we can protect the layout partially.
  return (
    <div className="flex h-screen bg-brand-dark text-gray-100">
      {/* Sidebar specific to Advertising Portal */}
      <aside className="w-64 bg-neutral-900 border-r border-neutral-800 p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-8 text-white">Tutaly Ads</h2>
        <nav className="space-y-4">
          <a href="/advertise/dashboard" className="block text-gray-400 hover:text-brand-blue font-medium transition-colors">📊 Overview</a>
          <a href="/advertise/dashboard" className="block text-gray-400 hover:text-brand-green font-medium transition-colors">📢 My Campaigns</a>
          <a href="/advertise/create" className="block text-gray-400 hover:text-brand-gold font-medium transition-colors">➕ Create Campaign</a>
          <a href="/advertise/dashboard" className="block text-gray-400 hover:text-brand-red font-medium transition-colors">💰 Billing</a>
          <a href="/advertise/dashboard" className="block text-gray-400 hover:text-brand-blue font-medium transition-colors">📈 Analytics</a>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-brand-dark">
        {children}
      </main>
    </div>
  );
}
