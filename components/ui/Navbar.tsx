'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { motion, useScroll, useSpring } from 'framer-motion';

export const Navbar = () => {
  const scrollProgress = useStore((state) => state.scrollProgress);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-950/20 backdrop-blur-xl border-b border-white/5 px-8 py-6">
      {/* Scroll Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-500 origin-left"
        style={{ scaleX }}
      />
      
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-black tracking-tighter text-white">
          EDEN<span className="text-emerald-500">.</span>
        </Link>
        <div className="flex gap-8 items-center">
          <Link href="/products" className="text-sm font-bold hover:text-emerald-400 transition-colors text-white/70">Collection</Link>
          <Link href="/pricing" className="text-sm font-bold hover:text-emerald-400 transition-colors text-white/70">Pricing</Link>
          <Link href="/admin" className="text-sm font-bold text-white/20 hover:text-emerald-400 transition-colors">Admin</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
