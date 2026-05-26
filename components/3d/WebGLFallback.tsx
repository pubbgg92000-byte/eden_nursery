"use client";

import { motion } from "framer-motion";

export const WebGLFallback = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-stone-950 overflow-hidden">
      {/* Cinematic Gradient Background */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: "radial-gradient(circle at 50% 50%, #10b981 0%, transparent 70%)",
          filter: "blur(80px)"
        }}
      />
      
      {/* Subtle animated light patches */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-1/4 -left-1/4 w-full h-full bg-emerald-900/20 rounded-full blur-[120px]"
      />

      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 60, 0],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-emerald-800/20 rounded-full blur-[100px]"
      />

      {/* Grain/Noise Overlay for texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};
