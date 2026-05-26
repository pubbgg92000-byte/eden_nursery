'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomers() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setCustomers(data);
      setLoading(false);
    }
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-emerald-950 mb-2">Customer Base</h1>
        <p className="text-emerald-800/60 font-medium text-lg">Manage your growing community of plant enthusiasts.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-emerald-50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-emerald-50">
              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-emerald-900/40">Customer</th>
              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-emerald-900/40">ID</th>
              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-emerald-900/40">Joined</th>
              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-emerald-900/40">Admin Status</th>
              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-emerald-900/40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center text-emerald-800/40 font-bold uppercase tracking-widest">
                  Loading customers...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center text-emerald-800/40 font-bold uppercase tracking-widest">
                  No customers found
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-emerald-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center font-black text-emerald-700">
                        {customer.full_name?.[0] || 'U'}
                      </div>
                      <span className="font-bold text-emerald-950">{customer.full_name || 'Anonymous User'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-mono text-xs text-emerald-800/60">{customer.id}</td>
                  <td className="px-8 py-6 text-sm text-emerald-800 font-medium">
                    {new Date(customer.created_at || '').toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6">
                    {customer.is_admin ? (
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Admin</span>
                    ) : (
                      <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Customer</span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-emerald-600 hover:text-emerald-950 font-black text-xs uppercase tracking-widest">
                      Manage
                    </button>
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
