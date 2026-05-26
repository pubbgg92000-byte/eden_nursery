"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CartInquiryForm } from "@/components/commerce/CartInquiryForm";
import { useStore } from "@/store/useStore";

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const { cart, removeFromCart, updateQuantity, clearCart } = useStore();

  useEffect(() => {
    void useStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setInquiryOpen(false);
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    if (isOpen) closeButton.current?.focus();
  }, [isOpen]);

  const total = cart.reduce((amount, item) => amount + Number(item.price) * item.quantity, 0);
  const count = cart.reduce((amount, item) => amount + item.quantity, 0);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} aria-label={`Open botanical request cart, ${count} items`} className="fixed bottom-8 right-8 z-50 rounded-full bg-emerald-600 p-4 text-white shadow-2xl shadow-emerald-400 transition-transform hover:scale-105">
        <CartIcon />
        {count > 0 && <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-emerald-600 bg-white text-[10px] font-black text-emerald-600">{count}</span>}
      </button>
      <AnimatePresence>
        {isOpen && (
          <div role="dialog" aria-modal="true" aria-labelledby="cart-title">
            <motion.button type="button" aria-label="Close cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 z-[60] bg-black/45 backdrop-blur-sm" />
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 27 }} className="fixed bottom-0 right-0 top-0 z-[70] flex w-full max-w-md flex-col bg-white shadow-2xl">
              <header className="flex items-center justify-between border-b border-emerald-50 p-8">
                <h2 id="cart-title" className="text-3xl font-black text-emerald-900">Your Request</h2>
                <button ref={closeButton} type="button" onClick={() => setIsOpen(false)} className="focus-ring rounded-full p-2 text-emerald-900" aria-label="Close request cart">x</button>
              </header>
              <div className="flex-1 overflow-y-auto p-8">
                {cart.length === 0 ? (
                  <div className="mt-24 text-center">
                    <p className="text-xl font-bold text-emerald-900">Your cart is empty</p>
                    <p className="mt-2 text-emerald-800/60">Add plants to request availability and delivery guidance.</p>
                  </div>
                ) : cart.map((item) => (
                  <article key={item.id} className="mb-5 flex items-center gap-4 rounded-2xl bg-emerald-50/60 p-4">
                    <img src={item.image_url || "/plants/monstera.jpg"} width={80} height={80} loading="lazy" alt="" className="h-20 w-20 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-bold text-emerald-900">{item.name}</h3>
                      <p className="text-sm font-bold text-emerald-600">${Number(item.price).toFixed(2)}</p>
                      <div className="mt-2 flex items-center gap-3" aria-label={`${item.name} quantity`}>
                        <button className="quantity-button" type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label={`Decrease ${item.name} quantity`}>-</button>
                        <span>{item.quantity}</span>
                        <button className="quantity-button" type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label={`Increase ${item.name} quantity`}>+</button>
                      </div>
                    </div>
                    <button type="button" onClick={() => removeFromCart(item.id)} className="text-sm font-bold text-red-500" aria-label={`Remove ${item.name}`}>Remove</button>
                  </article>
                ))}
              </div>
              {cart.length > 0 && (
                <footer className="border-t border-emerald-50 bg-emerald-50/30 p-8">
                  <div className="mb-6 flex justify-between font-bold text-emerald-900"><span>Estimated total</span><span className="text-2xl">${total.toFixed(2)}</span></div>
                  <button type="button" onClick={() => setInquiryOpen(true)} className="button-primary w-full py-4">Request These Plants</button>
                  <button type="button" onClick={clearCart} className="mt-4 w-full text-sm font-bold text-emerald-900/50 hover:text-red-600">Clear items</button>
                </footer>
              )}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {inquiryOpen && <CartInquiryForm items={cart} onClose={() => setInquiryOpen(false)} onSuccess={() => { clearCart(); setInquiryOpen(false); setIsOpen(false); }} />}
      </AnimatePresence>
    </>
  );
}

function CartIcon() {
  return <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2 2h3l3 13h11l2-8H6" /></svg>;
}
