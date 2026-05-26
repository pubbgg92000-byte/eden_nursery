"use client";

import { useState } from "react";
import type { Inquiry, InquiryStatus, PlanInquiry } from "@/types";

export function InquiryBoard({ initialCart, initialPlans }: { initialCart: Inquiry[]; initialPlans: PlanInquiry[] }) {
  const [cart, setCart] = useState(initialCart);
  const [plans, setPlans] = useState(initialPlans);

  async function updateStatus(kind: "cart" | "plan", id: string, status: InquiryStatus) {
    const response = await fetch(`/api/admin/inquiries/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, status }) });
    if (!response.ok) return;
    if (kind === "cart") setCart((values) => values.map((item) => item.id === id ? { ...item, status } : item));
    else setPlans((values) => values.map((item) => item.id === id ? { ...item, status } : item));
  }

  return (
    <div className="space-y-12">
      <header><h1 className="text-4xl font-black text-emerald-950">Visitor Inquiries</h1><p className="mt-2 text-emerald-800/60">Purchase and membership requests awaiting a personal response.</p></header>
      <section>
        <h2 className="mb-5 text-2xl font-black text-emerald-950">Plant Requests</h2>
        <div className="space-y-4">{cart.length === 0 ? <Empty /> : cart.map((inquiry) => (
          <article key={inquiry.id} className="rounded-3xl border border-emerald-100 bg-white p-6">
            <InquiryHeader name={inquiry.name} email={inquiry.email} created={inquiry.created_at} status={inquiry.status} onChange={(status) => updateStatus("cart", inquiry.id, status)} />
            <p className="mt-3 text-sm text-emerald-800/65">{inquiry.phone || "No phone"} {inquiry.message && ` | ${inquiry.message}`}</p>
            <ul className="mt-4 text-sm text-emerald-900">{inquiry.items?.map((item) => <li key={item.id}>{item.quantity} x {item.product_name} - ${Number(item.unit_price).toFixed(2)}</li>)}</ul>
            <p className="mt-3 font-black text-emerald-950">Estimate: ${Number(inquiry.estimated_total).toFixed(2)}</p>
          </article>
        ))}</div>
      </section>
      <section>
        <h2 className="mb-5 text-2xl font-black text-emerald-950">Membership Interest</h2>
        <div className="space-y-4">{plans.length === 0 ? <Empty /> : plans.map((inquiry) => (
          <article key={inquiry.id} className="rounded-3xl border border-emerald-100 bg-white p-6">
            <InquiryHeader name={`${inquiry.name} - ${inquiry.plan}`} email={inquiry.email} created={inquiry.created_at} status={inquiry.status} onChange={(status) => updateStatus("plan", inquiry.id, status)} />
            {inquiry.message && <p className="mt-3 text-sm text-emerald-800/65">{inquiry.message}</p>}
          </article>
        ))}</div>
      </section>
    </div>
  );
}

function InquiryHeader({ name, email, created, status, onChange }: { name: string; email: string; created: string; status: InquiryStatus; onChange: (value: InquiryStatus) => void }) {
  return <div className="flex flex-wrap items-center justify-between gap-4"><div><h3 className="font-black text-emerald-950">{name}</h3><a className="text-sm text-emerald-600" href={`mailto:${email}`}>{email}</a><p className="text-xs text-emerald-900/45">{new Date(created).toLocaleString()}</p></div><select aria-label={`Status for ${name}`} className="field w-auto" value={status} onChange={(event) => onChange(event.target.value as InquiryStatus)}><option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option></select></div>;
}
function Empty() { return <p className="rounded-2xl border border-dashed border-emerald-200 p-8 text-emerald-800/55">Nothing waiting here.</p>; }
