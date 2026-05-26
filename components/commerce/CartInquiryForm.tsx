"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import type { UICartItem } from "@/types";

export function CartInquiryForm({ items, onClose, onSuccess }: { items: UICartItem[]; onClose: () => void; onSuccess: () => void }) {
  const nameInput = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    nameInput.current?.focus();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        message: form.get("message"),
        website: form.get("website"),
        consent: form.get("consent") === "on",
        items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
      }),
    });
    if (response.ok) {
      setState("success");
      return;
    }
    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    setError(payload.error ?? "We could not send your request.");
    setState("error");
  }

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="inquiry-title" className="fixed inset-0 z-[80] flex items-center justify-center px-4">
      <button type="button" aria-label="Close inquiry form" onClick={onClose} className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[2rem] bg-white p-8 shadow-2xl">
        {state === "success" ? (
          <div className="py-8 text-center">
            <h2 id="inquiry-title" className="text-3xl font-black text-emerald-950">Request received</h2>
            <p className="my-5 text-emerald-800/70">An EDEN curator will contact you about availability and next steps.</p>
            <button type="button" className="button-primary" onClick={onSuccess}>Close</button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 id="inquiry-title" className="text-3xl font-black text-emerald-950">Plant Inquiry</h2>
                <p className="mt-2 text-sm text-emerald-800/60">No payment is taken. A curator will follow up personally.</p>
              </div>
              <button type="button" onClick={onClose} aria-label="Close" className="focus-ring p-2">x</button>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <input ref={nameInput} className="field" name="name" required placeholder="Full name" />
              <input className="field" name="email" type="email" required placeholder="Email address" />
              <input className="field" name="phone" type="tel" placeholder="Phone (optional)" />
              <textarea className="field min-h-24" name="message" placeholder="Delivery location or questions (optional)" />
              <input className="hidden" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <label className="flex items-start gap-3 text-sm text-emerald-900/70">
                <input name="consent" type="checkbox" required className="mt-1" />
                I consent to EDEN contacting me about this botanical request.
              </label>
              {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
              <button disabled={state === "sending"} className="button-primary w-full" type="submit">{state === "sending" ? "Sending request..." : "Send Inquiry"}</button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
