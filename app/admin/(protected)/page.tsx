import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const { client } = await requireAdmin();
  const [products, categories, inquiries, plans] = await Promise.all([
    client.from("products").select("id, stock_quantity"),
    client.from("categories").select("id", { count: "exact", head: true }),
    client.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    client.from("plan_inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);
  const productRows = products.data ?? [];
  const stats = [
    { label: "Collection Size", value: productRows.length },
    { label: "Low Stock", value: productRows.filter((product) => product.stock_quantity < 5).length },
    { label: "Categories", value: categories.count ?? 0 },
    { label: "New Inquiries", value: (inquiries.count ?? 0) + (plans.count ?? 0) },
  ];

  return (
    <div className="space-y-12">
      <header>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600">Curator Workspace</p>
        <h1 className="mt-3 text-5xl font-black text-emerald-950">Welcome back.</h1>
        <p className="mt-2 text-emerald-800/60">Manage published botanicals and respond to new visitor requests.</p>
      </header>
      <section className="grid gap-6 md:grid-cols-4" aria-label="Dashboard statistics">
        {stats.map((stat) => <div key={stat.label} className="rounded-[2rem] border border-emerald-50 bg-white p-7 shadow-sm"><p className="text-4xl font-black text-emerald-950">{stat.value}</p><p className="mt-2 text-xs font-black uppercase tracking-widest text-emerald-900/45">{stat.label}</p></div>)}
      </section>
      <section className="grid gap-6 md:grid-cols-3">
        <QuickLink href="/admin/products/new" title="Add Botanical" copy="Publish a new product story." />
        <QuickLink href="/admin/products" title="Manage Inventory" copy="Update availability and imagery." />
        <QuickLink href="/admin/inquiries" title="Review Inquiries" copy="Contact prospective customers." />
      </section>
    </div>
  );
}

function QuickLink({ href, title, copy }: { href: string; title: string; copy: string }) {
  return <Link href={href} className="rounded-3xl bg-emerald-950 p-7 text-white transition-transform hover:-translate-y-1"><h2 className="text-xl font-black">{title}</h2><p className="mt-2 text-sm text-emerald-200">{copy}</p></Link>;
}
