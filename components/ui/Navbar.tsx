"use client";

import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { AmbientAudioToggle } from "./AmbientAudioToggle";

export default function Navbar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-stone-950/35 px-5 py-5 text-white backdrop-blur-xl md:px-8" aria-label="Primary navigation">
      <motion.div className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-emerald-500" style={{ scaleX }} />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
        <Link href="/" className="text-2xl font-black tracking-tighter">EDEN<span className="text-emerald-500">.</span></Link>
        <div className="flex items-center gap-4 md:gap-7">
          <Link href="/products" className="nav-link">Collection</Link>
          <Link href="/pricing" className="nav-link">Membership</Link>
          <AmbientAudioToggle />
        </div>
      </div>
    </nav>
  );
}
