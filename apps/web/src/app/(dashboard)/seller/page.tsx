'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiAuth } from '@/lib/api';
import {
  Plus, CheckCircle2, Loader2, Clock, Edit2, Archive
} from 'lucide-react';

const STATUS_MAP: Record<string, { label: string; class: string }> = {
  pending_payment: { label: 'Awaiting Payment', class: 'status-badge status-badge--pending' },
  paid: { label: 'Paid', class: 'status-badge status-badge--success' },
  delivered: { label: 'Delivered', class: 'status-badge status-badge--primary' },
  completed: { label: 'Completed', class: 'status-badge status-badge--success' },
  flagged: { label: 'Flagged', class: 'status-badge status-badge--error' },
  refunded: { label: 'Refunded', class: 'status-badge status-badge--muted' },
};

export default function SellerShopPage() {
  const [sellerStatus, setSellerStatus] = useState<string>('');
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deliveringId, setDeliveringId] = useState<string | null>(null);

  useEffect(() => {
    checkSellerStatus();
  }, []);

  const checkSellerStatus = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const res = await apiAuth.withToken(token).get('/shop/seller/status');
      const status = res.data?.sellerStatus || 'none';
      setSellerStatus(status);

      if (status === 'approved') {
        await fetchSellerData(token);
      }
    } catch (err) {
      console.error('Failed to check seller status', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerData = async (token: string) => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        apiAuth.withToken(token).get('/shop/seller/products'),
        apiAuth.withToken(token).get('/shop/seller/orders'),
      ]);
      setProducts(productsRes.data?.data || []);
      setOrders(ordersRes.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch seller data', err);
    }
  };

  const handleMarkDelivered = async (orderId: string) => {
    setDeliveringId(orderId);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      await apiAuth.withToken(token).post(`/shop/orders/${orderId}/deliver`);
      const t = localStorage.getItem('access_token');
      if (t) await fetchSellerData(t);
    } catch (e) {
      const err = e as any;
      alert(err.response?.data?.message || 'Failed to mark as delivered');
    } finally {
      setDeliveringId(null);
    }
  };

  const formatPrice = (price: number, currency?: string) => {
    const cur = currency || 'NGN';
    const locales: Record<string, string> = { NGN: 'en-NG', USD: 'en-US', EUR: 'de-DE' };
    return new Intl.NumberFormat(locales[cur] || 'en-NG', { style: 'currency', currency: cur, minimumFractionDigits: 0 }).format(price);
  };

  if (loading) {
    return (
      <div className="dash-empty mt-8">
        <Loader2 className="w-8 h-8 animate-spin text-c400" />
      </div>
    );
  }

  if (sellerStatus === 'none' || sellerStatus === 'rejected') {
    if (typeof window !== 'undefined') {
      window.location.href = '/seller/apply';
    }
    return null;
  }

  if (sellerStatus === 'pending') {
    return (
      <div className="dash-empty mt-10">
        <div className="dash-empty__icon !bg-gold text-goldH"><Clock size={28} /></div>
        <div className="dash-empty__title">Application Under Review</div>
        <div className="dash-empty__desc">
          Your seller application is being reviewed by the Tutaly team. You'll be notified once a decision is made.
        </div>
      </div>
    );
  }

  const totalRevenue = orders
    .filter((o: any) => o.status === 'completed')
    .reduce((sum: number, o: any) => sum + Number(o.sellerEarnings || 0), 0);
  const pendingOrders = orders.filter((o: any) => o.status === 'paid').length;

  return (
    <>
      <div className="page-header">
        <div className="page-header__title">
          <h1 className="text-2xl font-bold text-c900 mb-1">Seller Dashboard</h1>
          <p className="text-c500 text-sm">Manage your listings and fulfil orders.</p>
        </div>
        <div className="page-header__actions">
          <Link href="/seller/create" className="btn btn--primary">
            <Plus className="w-4 h-4 mr-2" /> New Listing
          </Link>
        </div>
      </div>

      <div className="stat-grid mb-6">
        <div className="stat-card">
          <div className="stat-card__label">Active Listings</div>
          <div className="stat-card__value">{products.filter(p => p.isActive).length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">Pending Orders</div>
          <div className="stat-card__value">{pendingOrders}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">Total Earnings</div>
          <div className="stat-card__value text-green">{formatPrice(totalRevenue)}</div>
        </div>
      </div>

      <div className="overview-grid">
        
        <div className="dcard">
          <div className="dcard__header flex justify-between items-center mb-4">
            <div>
              <div className="dcard__title font-bold text-c900">Recent Orders</div>
              <div className="dcard__sub text-sm text-c500">Latest purchases from buyers</div>
            </div>
            <Link href="/seller/orders" className="text-sm font-semibold text-blue hover:text-blueH">View all</Link>
          </div>

          {orders.length === 0 ? (
            <div className="dash-empty py-10">
              <div className="dash-empty__title text-c500">No orders yet</div>
            </div>
          ) : (
            <div>
              {orders.slice(0, 5).map((order: any) => {
                const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.pending_payment;
                return (
                  <div key={order.id} className="order-row flex items-center justify-between p-3 hover:bg-c50 border-b border-c100 last:border-0 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blueL text-blue flex items-center justify-center font-bold text-lg">📄</div>
                      <div>
                        <div className="font-semibold text-c900">{order.product?.title || 'Unknown Product'}</div>
                        <div className="text-xs text-c500">
                          Purchased by {order.buyer?.firstName || order.buyer?.email} · {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={statusInfo.class}>
                        {statusInfo.label}
                      </span>
                      <div className="font-bold text-c900 w-24 text-right shrink-0">{formatPrice(order.amountPaid, order.currency)}</div>
                      
                      {order.status === 'paid' && (
                        <button
                          onClick={() => handleMarkDelivered(order.id)}
                          disabled={deliveringId === order.id}
                          className="btn btn--sm btn--primary ml-2 w-32 shrink-0"
                        >
                          {deliveringId === order.id ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Mark Delivered'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="dcard">
          <div className="dcard__header mb-4">
            <div className="dcard__title font-bold text-c900">Your Listings</div>
            <div className="dcard__sub text-sm text-c500">Manage products</div>
          </div>

          {products.length === 0 ? (
            <div className="dash-empty py-10">
              <div className="dash-empty__title text-c500">No listings yet</div>
            </div>
          ) : (
            <div>
              {products.map((product: any) => (
                <div key={product.id} className="flex items-center justify-between p-3 hover:bg-c50 border-b border-c100 last:border-0 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold text-goldH flex items-center justify-center font-bold text-lg">🎓</div>
                    <div>
                      <div className="font-semibold text-c900">{product.title}</div>
                      <div className="text-xs text-c500">
                        Published {new Date(product.createdAt).toLocaleDateString()} · {product.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="font-bold text-c900">{product.salesCount || 0}</div>
                      <div className="text-xs text-c500">Sold</div>
                    </div>
                    <div className="font-bold text-green w-24 text-right shrink-0">{formatPrice(product.price, product.currency)}</div>
                    <div className="flex gap-2">
                      <button className="p-2 text-c400 hover:text-green transition-colors" title="Edit Listing"><Edit2 className="w-4 h-4" /></button>
                      <button className="p-2 text-c400 hover:text-red transition-colors" title="Archive"><Archive className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  );
}
