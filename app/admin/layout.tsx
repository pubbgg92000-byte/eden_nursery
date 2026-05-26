import React from 'react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-950 text-white flex flex-col fixed inset-y-0 shadow-xl z-50">
        <div className="p-8">
          <Link href="/admin" className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
            EDEN<span className="text-emerald-400">.</span>
            <span className="text-xs bg-emerald-800 text-emerald-400 px-2 py-1 rounded uppercase tracking-widest font-bold">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <SidebarLink href="/admin" icon={<DashboardIcon />} label="Dashboard" />
          <SidebarLink href="/admin/products" icon={<ProductIcon />} label="Products" />
          <SidebarLink href="/admin/categories" icon={<CategoryIcon />} label="Categories" />
          <SidebarLink href="/admin/orders" icon={<OrderIcon />} label="Orders" />
          <SidebarLink href="/admin/customers" icon={<UserIcon />} label="Customers" />
        </nav>

        <div className="p-4 border-t border-emerald-900/50">
          <Link href="/" className="flex items-center gap-3 w-full px-4 py-3 text-emerald-300 hover:text-white hover:bg-emerald-900/50 rounded-xl transition-all duration-200">
            <LogOutIcon />
            <span className="font-bold text-sm">Exit Admin</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-10">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <Link 
      href={href}
      className="flex items-center gap-3 px-4 py-3 text-emerald-100/70 hover:text-white hover:bg-emerald-900/50 rounded-xl transition-all duration-200 group"
    >
      <span className="text-emerald-500 group-hover:text-emerald-400 transition-colors">
        {icon}
      </span>
      <span className="font-bold text-sm">{label}</span>
    </Link>
  );
}

function DashboardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
  );
}

function ProductIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
  );
}

function CategoryIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
  );
}

function OrderIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
  );
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
  );
}

function LogOutIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
  );
}
