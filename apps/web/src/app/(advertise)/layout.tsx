import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth'; // Assuming next-auth is used based on typical Next.js apps, adjust if custom

export default async function AdvertiseLayout({ children }: { children: ReactNode }) {
  // We can add logic to fetch user and restrict 'seeker' from specific routes using middleware instead, 
  // but if needed we can protect the layout partially.
  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Sidebar specific to Advertising Portal */}
      <aside className="w-64 bg-black text-white p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-8">Tutaly Ads</h2>
        <nav className="space-y-4">
          <a href="/advertise/dashboard" className="block text-gray-300 hover:text-white">📊 Overview</a>
          <a href="/advertise/dashboard" className="block text-gray-300 hover:text-white">📢 My Campaigns</a>
          <a href="/advertise/create" className="block text-gray-300 hover:text-white">➕ Create Campaign</a>
          <a href="/advertise/dashboard" className="block text-gray-300 hover:text-white">💰 Billing</a>
          <a href="/advertise/dashboard" className="block text-gray-300 hover:text-white">📈 Analytics</a>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
