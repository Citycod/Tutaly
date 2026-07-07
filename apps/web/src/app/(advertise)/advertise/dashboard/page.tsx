'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiAuth } from '@/lib/api';
import { Loader2, Plus, Megaphone, TrendingUp, Eye, MousePointerClick } from 'lucide-react';

interface Campaign {
  id: string;
  format?: string;
  placements?: string[];
  status: string;
  total_spent?: number | string;
  total_budget?: number | string;
  impression_count?: number;
  click_count?: number;
}

export default function AdvertiserDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      const res = await apiAuth.withToken(token).get('/ads/campaigns');
      setCampaigns(res.data);
    } catch (err) {
      console.error('Failed to fetch campaigns', err);
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = campaigns.reduce((sum, c) => sum + Number(c.total_spent || 0), 0);
  const totalImpressions = campaigns.reduce((sum, c) => sum + Number(c.impression_count || 0), 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + Number(c.click_count || 0), 0);
  const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : '0.0';

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="page-header">
        <div className="page-header__content">
          <div className="page-header__title">Campaign Overview</div>
          <p className="text-sm text-c400 mt-1">Manage your advertising campaigns and track performance.</p>
        </div>
        <div className="page-header__actions">
          <Link 
            href="/advertise/create" 
            className="btn btn--primary"
          >
            <Plus className="w-4 h-4" /> New Campaign
          </Link>
        </div>
      </div>

      <div className="stat-grid mb-8">
        <div className="stat-card">
          <div className="stat-card__label flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gold" /> Total Spent
          </div>
          <div className="stat-card__value">₦{totalSpent.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue" /> Total Impressions
          </div>
          <div className="stat-card__value">{totalImpressions.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label flex items-center gap-2">
            <MousePointerClick className="w-4 h-4 text-green" /> Total Clicks
          </div>
          <div className="stat-card__value">{totalClicks.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-red" /> Avg. CTR
          </div>
          <div className="stat-card__value">{avgCTR}%</div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-c100">Your Campaigns</h2>
      
      <div className="dcard p-0 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center text-c500">
            <Loader2 className="w-8 h-8 animate-spin text-blue" />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="p-12 text-center text-c400">
            <Megaphone className="w-10 h-10 mx-auto mb-4 opacity-20" />
            <p>You have no campaigns yet.</p>
            <Link href="/advertise/create" className="btn btn--primary btn--sm mt-4 inline-flex">Create your first campaign</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-c800 border-b border-c700 text-xs font-semibold uppercase tracking-wider text-c400">
                <tr>
                  <th className="p-4">Campaign Details</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Spent / Budget</th>
                  <th className="p-4 text-right">Impressions</th>
                  <th className="p-4 text-right">Clicks (CTR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-c700">
                {campaigns.map((c: Campaign) => {
                  const ctr = (c.impression_count || 0) > 0 ? (((c.click_count || 0) / (c.impression_count || 1)) * 100).toFixed(1) : '0.0';
                  const progress = Math.min(100, (Number(c.total_spent) / Number(c.total_budget)) * 100);
                  
                  return (
                    <tr key={c.id} className="hover:bg-c800 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-c100 text-lg capitalize">{c.format?.replace('_', ' ')}</div>
                        <div className="text-sm text-blue font-mono mt-1 capitalize">{c.placements?.join(', ').replace('_', ' ')}</div>
                      </td>
                      <td className="p-4">
                        <span className={`tag capitalize ${
                          c.status === 'active' ? 'tag--green' :
                          c.status === 'pending_payment' ? 'tag--gold' :
                          c.status === 'pending_review' ? 'tag--blue' : ''
                        }`}>
                          {c.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 w-64">
                        <div className="font-mono font-medium text-c100 mb-2 flex justify-between">
                          <span>₦{Number(c.total_spent || 0).toLocaleString()}</span>
                          <span className="text-c500">₦{Number(c.total_budget || 0).toLocaleString()}</span>
                        </div>
                        <div className="w-full h-2 bg-c800 rounded-full overflow-hidden">
                          <div className="h-full bg-gold rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                      </td>
                      <td className="p-4 text-right font-mono text-c300">{c.impression_count || 0}</td>
                      <td className="p-4 text-right font-mono">
                        <span className="text-c100">{c.click_count || 0}</span> 
                        <span className="text-c500 ml-2">({ctr}%)</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
