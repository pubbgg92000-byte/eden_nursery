'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState<{
    totalProducts: number;
    lowStock: number;
    totalCategories: number;
    pendingOrders: number;
  }>({
    totalProducts: 0,
    lowStock: 0,
    totalCategories: 0,
    pendingOrders: 0
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [products, categories] = await Promise.all([
          supabase.from('products').select('id, stock_quantity'),
          supabase.from('categories').select('id', { count: 'exact' })
        ]);

        const productData = products.data || [];
        setStats({
          totalProducts: productData.length,
          lowStock: productData.filter(p => (p.stock_quantity || 0) < 5).length,
          totalCategories: categories.count || 0,
          pendingOrders: 12 // Mock data for now
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-5xl font-black text-emerald-950 mb-2 italic">Welcome, Curator.</h1>
        <p className="text-emerald-800/60">Here is the current state of your botanical empire.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          label="Collection Size" 
          value={stats.totalProducts} 
          icon={<LeafIcon />} 
          color="bg-emerald-100 text-emerald-600"
        />
        <StatCard 
          label="Low Stock Alert" 
          value={stats.lowStock} 
          icon={<AlertIcon />} 
          color={stats.lowStock > 0 ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}
        />
        <StatCard 
          label="Active Orders" 
          value={stats.pendingOrders} 
          icon={<OrderIcon />} 
          color="bg-emerald-100 text-emerald-600"
        />
        <StatCard 
          label="Categories" 
          value={stats.totalCategories} 
          icon={<TagIcon />} 
          color="bg-emerald-100 text-emerald-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-emerald-50">
          <h2 className="text-2xl font-black text-emerald-950 mb-6 flex items-center gap-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <QuickActionLink 
              href="/admin/products/new" 
              label="New Product" 
              description="Add a plant to catalog"
            />
            <QuickActionLink 
              href="/admin/categories" 
              label="New Category" 
              description="Organize your plants"
            />
            <QuickActionLink 
              href="/admin/products" 
              label="Update Stock" 
              description="Quick quantity adjust"
            />
            <QuickActionLink 
              href="#" 
              label="Sales Report" 
              description="View store performance"
            />
          </div>
        </div>

        <div className="bg-emerald-950 p-10 rounded-[3rem] text-white overflow-hidden relative group">
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-4">Stock Insights</h2>
            <p className="text-emerald-300 mb-8 max-w-xs">
              {stats.lowStock > 0 
                ? `You have ${stats.lowStock} items currently low on stock. Consider restocking soon to avoid missed sales.`
                : "Your inventory is currently healthy across all categories. Well done curator."}
            </p>
            <Link 
              href="/admin/products" 
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black px-6 py-3 rounded-2xl transition-all"
            >
              Manage Inventory
              <ArrowRightIcon />
            </Link>
          </div>
          
          <div className="absolute -right-10 -bottom-10 opacity-20 transform group-hover:scale-110 transition-transform duration-700">
            <BigLeafIcon />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string, value: number | string, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-emerald-50 flex flex-col justify-between hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300">
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-6`}>
        {icon}
      </div>
      <div>
        <div className="text-4xl font-black text-emerald-950 mb-1">{value}</div>
        <div className="text-xs font-black uppercase tracking-widest text-emerald-900/40">{label}</div>
      </div>
    </div>
  );
}

function QuickActionLink({ href, label, description }: { href: string, label: string, description: string }) {
  return (
    <Link href={href} className="p-6 bg-emerald-50/50 hover:bg-emerald-50 rounded-3xl border border-transparent hover:border-emerald-100 transition-all group">
      <div className="font-bold text-emerald-950 mb-1 group-hover:text-emerald-600 transition-colors">{label}</div>
      <div className="text-[10px] text-emerald-800/40 font-bold uppercase tracking-wider leading-relaxed">{description}</div>
    </Link>
  );
}

// Icons
function LeafIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a7 7 0 0 1-10 6.7z"></path><path d="M11 20a7 7 0 0 0 10-10"></path><path d="M11 20V9"></path></svg>;
}

function AlertIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;
}

function OrderIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;
}

function TagIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>;
}

function ArrowRightIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;
}

function BigLeafIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a7 7 0 0 1-10 6.7z"></path><path d="M11 20a7 7 0 0 0 10-10"></path><path d="M11 20V9"></path></svg>;
}
