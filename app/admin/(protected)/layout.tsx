import Link from "next/link";
import { signOut } from "../actions";

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 z-50 flex w-64 flex-col bg-emerald-950 text-white shadow-xl">
        <div className="p-8">
          <Link href="/admin" className="text-2xl font-black tracking-tighter">EDEN<span className="text-emerald-400">.</span> <span className="text-xs text-emerald-400">ADMIN</span></Link>
        </div>
        <nav aria-label="Admin navigation" className="flex-1 space-y-2 px-4">
          <AdminLink href="/admin" label="Dashboard" />
          <AdminLink href="/admin/products" label="Products" />
          <AdminLink href="/admin/categories" label="Categories" />
          <AdminLink href="/admin/inquiries" label="Inquiries" />
        </nav>
        <div className="space-y-2 border-t border-emerald-900 p-4">
          <Link href="/" className="block rounded-xl px-4 py-3 text-sm font-bold text-emerald-200 hover:bg-emerald-900">View Store</Link>
          <form action={signOut}>
            <button type="submit" className="w-full rounded-xl px-4 py-3 text-left text-sm font-bold text-emerald-200 hover:bg-emerald-900">Sign Out</button>
          </form>
        </div>
      </aside>
      <main className="ml-64 flex-1 p-10"><div className="mx-auto max-w-6xl">{children}</div></main>
    </div>
  );
}

function AdminLink({ href, label }: { href: string; label: string }) {
  return <Link href={href} className="block rounded-xl px-4 py-3 text-sm font-bold text-emerald-100/80 transition-colors hover:bg-emerald-900 hover:text-white">{label}</Link>;
}
