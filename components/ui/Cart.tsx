'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useEffect } from 'react';

const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { cart, removeFromCart, updateQuantity, clearCart } = useStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      {/* Floating Toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 bg-emerald-600 text-white p-4 rounded-full shadow-2xl shadow-emerald-400 hover:scale-110 transition-transform flex items-center gap-2 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        {cart.length > 0 && (
          <span className="bg-white text-emerald-600 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full absolute -top-1 -right-1 border-2 border-emerald-600">
            {cart.reduce((acc, item) => acc + item.quantity, 0)}
          </span>
        )}
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-bold">
          View Cart
        </span>
      </button>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-emerald-50 flex justify-between items-center">
                <h2 className="text-3xl font-black text-emerald-900">Your Cart</h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-emerald-50 rounded-full transition-colors text-emerald-900"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 text-emerald-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                    </div>
                    <h3 className="text-xl font-bold text-emerald-900 mb-2">Your cart is empty</h3>
                    <p className="text-emerald-800/60 mb-8">Looks like you haven&apos;t added any plants yet.</p>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center bg-emerald-50/50 p-4 rounded-2xl border border-emerald-50">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-emerald-100">
                            <img
                             src={item.image_url}
                             alt={item.name}
                             className="w-full h-full object-cover"
                             onError={(e) => {
                               (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?q=80&w=200&auto=format&fit=crop';
                             }}
                           />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-emerald-900">{item.name}</h4>
                          <p className="text-sm font-bold text-emerald-600 mb-2">${item.price}</p>
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border border-emerald-100 hover:border-emerald-300 transition-colors text-emerald-900"
                            >
                              -
                            </button>
                            <span className="font-bold text-emerald-900 w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border border-emerald-100 hover:border-emerald-300 transition-colors text-emerald-900"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-red-300 hover:text-red-500 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 border-t border-emerald-50 bg-emerald-50/30">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-emerald-800/60 font-bold uppercase tracking-widest text-xs">Total Amount</span>
                    <span className="text-3xl font-black text-emerald-900">${total.toFixed(2)}</span>
                  </div>
                  <button className="w-full py-5 bg-emerald-900 text-white rounded-2xl text-xl font-bold hover:bg-black transition-all active:scale-95 shadow-xl shadow-emerald-200">
                    Checkout Now
                  </button>
                  <button 
                    onClick={clearCart}
                    className="w-full mt-4 text-emerald-900/40 text-sm font-bold hover:text-red-500 transition-colors"
                  >
                    Clear All Items
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Cart;
