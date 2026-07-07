'use client';

import React, { useEffect, useState } from 'react';
import { apiAuth } from '@/lib/api';
import { Wallet, TrendingUp, Clock, AlertCircle, ArrowDownToLine, CheckCircle2, History } from 'lucide-react';

interface EarningsData {
  totalEarnings: number;
  availableBalance: number;
  escrowBalance: number;
  recentTransactions: Array<{
    id: string;
    type: string;
    amount: number;
    status: string;
    createdAt: string;
    description: string;
  }>;
}

export default function SellerEarningsPage() {
  const [data, setData] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      const res = await apiAuth.withToken(token).get('/shop/seller/earnings');
      setData(res.data?.data || null);
    } catch (err) {
      console.error('Failed to fetch seller earnings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawal = async () => {
    if (!data || data.availableBalance <= 0) return;
    
    const amount = prompt(`How much would you like to withdraw? (Max: ₦${data.availableBalance.toLocaleString()})`, data.availableBalance.toString());
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0 || Number(amount) > data.availableBalance) {
      if (amount !== null) alert('Invalid withdrawal amount.');
      return;
    }

    setWithdrawing(true);
    try {
      const token = localStorage.getItem('access_token');
      await apiAuth.withToken(token || undefined).post('/shop/seller/withdraw', { amount: Number(amount) });
      alert(`Withdrawal request of ₦${Number(amount).toLocaleString()} submitted successfully!`);
      fetchEarnings();
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = e as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = e as any;
alert(err.response?.data?.message || 'Failed to process withdrawal.');
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green"></div>
      </div>
    );
  }

  // Fallback data if endpoint is missing/empty
  const displayData = data || {
    totalEarnings: 0,
    availableBalance: 0,
    escrowBalance: 0,
    recentTransactions: []
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header__title">
          <h1 className="text-2xl font-bold text-c900 mb-1 flex items-center gap-3">
            <Wallet className="w-6 h-6 text-green" />
            Earnings & Wallet
          </h1>
          <p className="text-c500 text-sm">Track your revenue, escrow balance, and request payouts.</p>
        </div>
        <div className="page-header__actions">
          <button 
            onClick={handleWithdrawal}
            disabled={withdrawing || displayData.availableBalance <= 0}
            className="btn btn--primary"
          >
            {withdrawing ? 'Processing...' : <><ArrowDownToLine className="w-4 h-4 mr-2" /> Withdraw Funds</>}
          </button>
        </div>
      </div>

      <div className="stat-grid mb-8">
        {/* Available Balance */}
        <div className="stat-card" style={{ background: 'var(--green-l)', border: '1px solid var(--green)' }}>
          <div className="stat-card__label flex items-center justify-between w-full" style={{ color: 'var(--green)' }}>
            Available to Withdraw
            <Wallet className="w-5 h-5" />
          </div>
          <div className="stat-card__value text-green">₦{displayData.availableBalance.toLocaleString()}</div>
          <p className="text-xs text-green mt-1 font-semibold">Cleared funds ready for payout</p>
        </div>

        {/* Escrow Balance */}
        <div className="stat-card">
          <div className="stat-card__label flex items-center justify-between w-full">
            In Escrow (Pending)
            <Clock className="w-5 h-5 text-gold" />
          </div>
          <div className="stat-card__value">₦{displayData.escrowBalance.toLocaleString()}</div>
          <p className="text-xs text-gold font-bold flex items-center gap-1 mt-1">
            <AlertCircle className="w-3 h-3" /> Awaiting buyer confirmation
          </p>
        </div>

        {/* Total Earnings */}
        <div className="stat-card">
          <div className="stat-card__label flex items-center justify-between w-full">
            Total Lifetime Earnings
            <TrendingUp className="w-5 h-5 text-blue" />
          </div>
          <div className="stat-card__value">₦{displayData.totalEarnings.toLocaleString()}</div>
          <p className="text-xs text-c500 mt-1">Since joining Tutaly</p>
        </div>
      </div>

      <div className="dcard !p-0 overflow-hidden">
        <div className="dcard__header">
          <div className="dcard__title flex items-center gap-3">
            <History className="w-5 h-5 text-c400" />
            Transaction History
          </div>
        </div>
        
        {displayData.recentTransactions.length === 0 ? (
          <div className="p-16 text-center text-c500">
            <History className="w-12 h-12 text-c300 mx-auto mb-3" />
            <p>No transactions found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-c100 text-c500 border-b border-c100">
                <tr>
                  <th className="p-4 font-bold">Date</th>
                  <th className="p-4 font-bold">Description</th>
                  <th className="p-4 font-bold">Type</th>
                  <th className="p-4 font-bold">Amount</th>
                  <th className="p-4 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-c100">
                {displayData.recentTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-c100">
                    <td className="p-4 text-c500">{new Date(tx.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 font-medium text-c900">{tx.description}</td>
                    <td className="p-4 capitalize text-c600">{tx.type.replace('_', ' ')}</td>
                    <td className={`p-4 font-bold ${tx.type === 'withdrawal' ? 'text-red' : 'text-green'}`}>
                      {tx.type === 'withdrawal' ? '-' : '+'}₦{tx.amount.toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        tx.status === 'completed' ? 'bg-green text-green' :
                        tx.status === 'pending' ? 'bg-gold text-goldH' :
                        'bg-red text-red'
                      }`}>
                        {tx.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                        {tx.status === 'pending' && <Clock className="w-3 h-3" />}
                        {tx.status === 'failed' && <AlertCircle className="w-3 h-3" />}
                        {tx.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
