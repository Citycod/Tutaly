'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiAuth } from '@/lib/api';
import { ShoppingBag, Search, Package, Clock, CheckCircle, Truck, AlertCircle, RefreshCcw } from 'lucide-react';

interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  priceAtPurchase: number;
  deliveryStatus: string;
  product: {
    title: string;
    listingType: string;
  };
}

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      // Get all items sold by this seller
      const res = await apiAuth.withToken(token).get('/shop/seller/orders');
      setOrders(res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch seller orders', err);
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (orderId: string, itemId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('access_token');
      await apiAuth.withToken(token || undefined).patch(`/shop/seller/orders/${orderId}/items/${itemId}/status`, {
        deliveryStatus: newStatus
      });
      fetchOrders(); // Refresh to get updated status
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = e as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = e as any;
alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const filteredOrders = orders.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'pending') return item.deliveryStatus === 'pending';
    if (filter === 'processing') return item.deliveryStatus === 'processing';
    if (filter === 'shipped') return item.deliveryStatus === 'shipped';
    if (filter === 'delivered') return item.deliveryStatus === 'delivered';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-c900 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-green" />
            Manage Orders
          </h1>
          <p className="text-c500 mt-1">Track incoming purchases and update delivery statuses.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-c100 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-c100 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'pending', label: 'Pending' },
            { id: 'processing', label: 'Processing' },
            { id: 'shipped', label: 'Shipped' },
            { id: 'delivered', label: 'Delivered' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                filter === tab.id
                  ? 'bg-green text-green border border-green'
                  : 'text-c500 hover:bg-c100 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
          
          <button onClick={fetchOrders} className="ml-auto p-2 text-c400 hover:text-green transition-colors" title="Refresh">
            <RefreshCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-16 text-center text-c500 italic flex flex-col items-center">
            <RefreshCcw className="w-8 h-8 animate-spin text-green mb-4" />
            Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center">
            <Package className="w-16 h-16 text-c300 mb-4" />
            <h3 className="text-xl font-bold text-c900 mb-2">No orders found</h3>
            <p className="text-c500">You don't have any orders matching the current filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-c100 text-c500 border-b border-c100">
                <tr>
                  <th className="p-4 font-bold">Product</th>
                  <th className="p-4 font-bold">Type</th>
                  <th className="p-4 font-bold">Price / Qty</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-c100">
                {filteredOrders.map(item => (
                  <tr key={item.id} className="hover:bg-c100 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-c900">{item.product?.title || 'Unknown Product'}</p>
                      <p className="text-xs text-c500 font-mono mt-1">Order #{item.orderId.split('-')[0].toUpperCase()}</p>
                    </td>
                    <td className="p-4 capitalize text-c600">{item.product?.listingType || 'N/A'}</td>
                    <td className="p-4">
                      <p className="font-bold text-green">₦{Number(item.priceAtPurchase).toLocaleString()}</p>
                      <p className="text-xs text-c500">Qty: {item.quantity}</p>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        item.deliveryStatus === 'delivered' ? 'bg-green text-green' :
                        item.deliveryStatus === 'shipped' ? 'bg-blueL text-blueH' :
                        item.deliveryStatus === 'processing' ? 'bg-purple-100 text-purple-700' :
                        'bg-gold text-goldH'
                      }`}>
                        {item.deliveryStatus === 'delivered' ? <CheckCircle className="w-3 h-3" /> :
                         item.deliveryStatus === 'shipped' ? <Truck className="w-3 h-3" /> :
                         item.deliveryStatus === 'processing' ? <RefreshCcw className="w-3 h-3" /> :
                         <Clock className="w-3 h-3" />}
                        {item.deliveryStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {item.product?.listingType !== 'digital' && item.deliveryStatus !== 'delivered' && (
                        <select 
                          className="text-sm border border-c200 rounded-lg px-3 py-1.5 bg-white text-c700 focus:outline-none focus:ring-2 focus:ring-green cursor-pointer"
                          value={item.deliveryStatus}
                          onChange={(e) => updateDeliveryStatus(item.orderId, item.id, e.target.value)}
                        >
                          <option value="pending" disabled>Update Status</option>
                          <option value="processing">Mark as Processing</option>
                          <option value="shipped">Mark as Shipped</option>
                          <option value="delivered">Mark as Delivered</option>
                        </select>
                      )}
                      {item.product?.listingType === 'digital' && (
                        <span className="text-xs text-c400 italic">Auto-delivered</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
