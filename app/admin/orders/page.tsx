'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Order } from '@/types';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profile:profiles(full_name, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (data) setOrders(data as any);
      setLoading(false);
    }
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-100 text-emerald-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-emerald-950 mb-2">Order Management</h1>
          <p className="text-emerald-800/60 font-medium text-lg">Track and fulfill your botanical shipments.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-emerald-50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-emerald-50">
              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-emerald-900/40">Order ID</th>
              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-emerald-900/40">Customer</th>
              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-emerald-900/40">Status</th>
              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-emerald-900/40">Total</th>
              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-emerald-900/40">Date</th>
              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-emerald-900/40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-8 py-12 text-center text-emerald-800/40 font-bold uppercase tracking-widest">
                  Fetching orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-12 text-center text-emerald-800/40 font-bold uppercase tracking-widest">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-emerald-50/30 transition-colors">
                  <td className="px-8 py-6 font-mono text-sm text-emerald-800">#{order.id.slice(0, 8)}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700 text-xs">
                        {order.profile?.full_name?.[0] || 'U'}
                      </div>
                      <span className="font-bold text-emerald-950">{order.profile?.full_name || 'Guest User'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-black text-emerald-950">${order.total_amount}</td>
                  <td className="px-8 py-6 text-sm text-emerald-800/60 font-medium">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link 
                      href={`/admin/orders/${order.id}`}
                      className="text-emerald-600 hover:text-emerald-950 font-black text-xs uppercase tracking-widest"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
