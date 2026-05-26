import { Scene } from "@/components/3d/Scene";
import { HeroTree } from "@/components/3d/HeroTree";
import { ScrollManager } from "@/components/animations/ScrollManager";
import { AnimationController } from "@/components/animations/AnimationController";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eden Nursery | Home",
  description: "A cinematic botanical experience crafted with light and code. Discover our curated collection of premium indoor plants.",
};

export default function Home() {
  return (
    <main className="relative min-h-[500vh] bg-stone-950 text-white selection:bg-emerald-500/30 transition-colors duration-1000">
      <ScrollManager />
      <AnimationController />
      
      {/* Cinematic Parallax Layers */}
      <div className="parallax-bg fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[10%] w-96 h-96 bg-teal-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] left-[15%] w-80 h-80 bg-emerald-400/10 rounded-full blur-[130px]" />
      </div>

      {/* 3D Scene */}
      <Scene>
        <HeroTree />
      </Scene>

      {/* Hero Section - PHASE 1: SEEDLING */}
      <section className="relative h-screen flex flex-col items-center justify-center p-6 text-center z-10">
        <div data-stagger>
          <h1 className="stagger-item text-7xl md:text-9xl font-bold tracking-tighter mb-4 mix-blend-difference">
            EDEN
          </h1>
          <p className="stagger-item text-xl md:text-2xl text-stone-300 max-w-2xl mix-blend-difference">
            A cinematic botanical experience crafted with light and code.
          </p>
        </div>
        <div className="absolute bottom-10 animate-bounce">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Scroll to Grow</p>
        </div>
      </section>

      {/* Section 1: Growth - PHASE 2: TRUNK EXPANSION */}
      <section className="h-screen flex items-center justify-center p-6 z-10">
        <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6" data-stagger>
            <h2 className="stagger-item text-4xl md:text-5xl font-bold">The Art of Growth</h2>
            <p className="stagger-item text-stone-400 text-lg leading-relaxed">
              Witness the majesty of digital life as it responds to your presence. Our procedural trees grow and evolve, creating a unique living environment.
            </p>
          </div>
          <div data-reveal className="h-80 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-stone-500 text-sm uppercase tracking-widest">Procedural Trunk v2.0</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Spreading Roots - PHASE 3: BRANCHING */}
      <section className="h-screen flex items-center justify-center p-6 z-10">
        <div className="max-w-4xl text-right ml-auto space-y-6" data-stagger>
          <h2 className="stagger-item text-4xl md:text-5xl font-bold">Spreading Roots</h2>
          <p className="stagger-item text-stone-400 text-lg max-w-xl ml-auto">
            Deep beneath the surface, a complex network of algorithms forms the foundation of our botanical world. Stability and beauty, intertwined.
          </p>
          <div data-reveal className="h-1 w-full bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
        </div>
      </section>

      {/* Section 3: The Bloom - PHASE 4: FLOWERING */}
      <section className="h-screen flex items-center justify-center p-6 z-10">
        <div className="max-w-4xl text-center space-y-8" data-stagger>
          <h2 className="stagger-item text-5xl md:text-7xl font-bold italic">Nature Redefined</h2>
          <p className="stagger-item text-stone-400 text-lg max-w-2xl mx-auto">
            From single vertices to lush blossoms, every element is generated in real-time, ensuring a performance-driven experience that blurs the line between art and technology.
          </p>
          <div className="stagger-item">
            <button className="group relative px-10 py-5 bg-white text-black font-bold rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95">
              <span className="relative z-10">Discover The Collection</span>
              <div className="absolute inset-0 bg-emerald-400 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-expo" />
            </button>
          </div>
        </div>
      </section>

      {/* Section 4: Finale - PHASE 5: ECOSYSTEM */}
      <section className="h-screen flex items-center justify-center p-6 z-10">
        <div data-reveal className="text-center space-y-4">
          <h3 className="text-2xl font-light tracking-widest text-emerald-400 uppercase">Established 2026</h3>
          <p className="text-6xl md:text-8xl font-bold">EDEN NURSERY</p>
          <p className="text-stone-500 tracking-[0.5em] uppercase text-sm">Full Magical Ecosystem Live</p>
        </div>
      </section>

      {/* Parallax Decorations */}
      <div className="parallax-bg fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-emerald-500/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-stone-500/20 blur-[150px] rounded-full" />
      </div>
    </main>
  );
}

