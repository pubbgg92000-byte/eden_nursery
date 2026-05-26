"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Plan {
  name: string;
  price: number;
  description: string;
  features: string[];
  recommended?: boolean;
}

export function PlanExplorer({ plans }: { plans: Plan[] }) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSending(true);
    setError("");
    const response = await fetch("/api/plan-inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan: selectedPlan,
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        message: form.get("message"),
        website: form.get("website"),
        consent: form.get("consent") === "on",
      }),
    });
    setSending(false);
    if (response.ok) return setSent(true);
    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    setError(payload.error ?? "Unable to send interest right now.");
  }

  return (
    <main className="min-h-screen bg-emerald-50/30 px-6 pb-20 pt-32">
      <header className="mx-auto mb-16 max-w-2xl text-center">
        <h1 className="mb-4 text-5xl font-black tracking-tighter text-emerald-900">Garden Membership</h1>
        <p className="text-emerald-800/60">Register your interest in a monthly curation plan. A specialist will confirm selection and availability; no payment is taken online.</p>
      </header>
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <article key={plan.name} className={plan.recommended ? "plan-card plan-card-featured" : "plan-card"}>
            {plan.recommended && <p className="mb-4 text-xs font-black uppercase tracking-widest text-emerald-300">Most loved</p>}
            <h2 className="text-2xl font-black">{plan.name}</h2>
            <p className="mb-6 mt-2 text-sm opacity-70">{plan.description}</p>
            <p className="mb-8 text-5xl font-black">${plan.price}<span className="text-sm opacity-50"> / month</span></p>
            <ul className="mb-10 flex-1 space-y-4 text-sm font-bold">{plan.features.map((feature) => <li key={feature}>+ {feature}</li>)}</ul>
            <button type="button" onClick={() => { setSelectedPlan(plan.name); setSent(false); setError(""); }} className={plan.recommended ? "button-light w-full" : "button-primary w-full"}>Register Interest</button>
          </article>
        ))}
      </div>
      <AnimatePresence>
        {selectedPlan && (
          <div role="dialog" aria-modal="true" aria-labelledby="plan-interest-title" className="fixed inset-0 z-[80] flex items-center justify-center px-4">
            <button type="button" aria-label="Close plan interest form" onClick={() => setSelectedPlan(null)} className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="relative w-full max-w-lg rounded-[2rem] bg-white p-8">
              {sent ? (
                <div className="text-center">
                  <h2 id="plan-interest-title" className="text-3xl font-black text-emerald-950">Interest received</h2>
                  <p className="my-5 text-emerald-800/70">We will contact you about the {selectedPlan} plan.</p>
                  <button type="button" onClick={() => setSelectedPlan(null)} className="button-primary">Close</button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <h2 id="plan-interest-title" className="mb-2 text-3xl font-black text-emerald-950">{selectedPlan} Interest</h2>
                  <input autoFocus className="field" name="name" required placeholder="Full name" />
                  <input className="field" name="email" required type="email" placeholder="Email address" />
                  <input className="field" name="phone" type="tel" placeholder="Phone (optional)" />
                  <textarea className="field min-h-20" name="message" placeholder="Questions (optional)" />
                  <input name="website" tabIndex={-1} className="hidden" aria-hidden="true" />
                  <label className="flex items-start gap-3 text-sm text-emerald-900/70"><input type="checkbox" name="consent" required className="mt-1" />I consent to EDEN contacting me about membership.</label>
                  {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
                  <button type="submit" disabled={sending} className="button-primary w-full">{sending ? "Sending..." : "Send Interest"}</button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
