import Link from "next/link";
import type { Metadata } from "next";
import { CinematicScene } from "@/components/3d/CinematicScene";
import { ScrollManager } from "@/components/animations/ScrollManager";
import { AnimationController } from "@/components/animations/AnimationController";
import { getPublishedProducts } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Cinematic Botanical Sanctuary",
  description: "Enter EDEN: an atmospheric forest experience with curated botanicals.",
};
export const dynamic = "force-dynamic";

export default async function Home() {
  const featured = (await getPublishedProducts()).filter((product) => product.is_featured).slice(0, 3);
  return (
    <main data-cinematic-root className="relative isolate min-h-[500vh] bg-stone-950 text-white selection:bg-emerald-500/30">
      <ScrollManager />
      <AnimationController />
      <CinematicScene />
      <div aria-hidden="true" className="fixed inset-0 z-[1] overflow-hidden">
        <div className="parallax-orb absolute left-[5%] top-[10%] h-64 w-64 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="parallax-orb absolute right-[10%] top-[40%] h-96 w-96 rounded-full bg-teal-400/10 blur-[150px]" />
      </div>
      <Phase label="Seed" title="EDEN" copy="A living botanical sanctuary shaped by light, air, and your movement." hero />
      <Phase label="Growth" title="The Art of Growth" copy="A seed rises through dark soil as a forest begins to gather around it." />
      <Phase label="Roots" title="Spreading Roots" copy="Vines reach outward and a quiet terrain takes hold beneath the canopy." align="right" />
      <Phase label="Bloom" title="Nature, Revealed" copy="Pollen drifts through warmth as rare specimens step into the light." />
      <section data-phase className="relative z-10 flex min-h-screen items-center justify-center px-6 py-24">
        <div className="w-full max-w-6xl text-center" data-stagger>
          <p className="stagger-item text-xs font-bold uppercase tracking-[0.4em] text-emerald-400">The Collection</p>
          <h2 className="stagger-item my-5 text-5xl font-black md:text-7xl">Choose your living story</h2>
          {featured.length > 0 && (
            <div className="stagger-item my-12 grid gap-6 md:grid-cols-3">
              {featured.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-left backdrop-blur-md">
                  <img src={product.image_url || "/plants/monstera.jpg"} width={500} height={360} loading="lazy" alt={product.name} className="h-52 w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="p-5"><p className="text-xl font-bold">{product.name}</p><p className="mt-1 text-sm text-white/60">Discover this botanical</p></div>
                </Link>
              ))}
            </div>
          )}
          <Link href="/products" className="button-light stagger-item">Explore Botanicals</Link>
        </div>
      </section>
    </main>
  );
}

function Phase({ label, title, copy, hero = false, align = "center" }: { label: string; title: string; copy: string; hero?: boolean; align?: "center" | "right" }) {
  const Heading = hero ? "h1" : "h2";
  return (
    <section data-phase className={`relative z-10 flex h-screen items-center px-6 ${align === "right" ? "justify-end" : "justify-center"}`}>
      <div data-stagger className={`max-w-3xl ${align === "right" ? "text-right" : "text-center"}`}>
        <p className="stagger-item mb-5 text-xs font-bold uppercase tracking-[0.4em] text-emerald-400">{label}</p>
        <Heading className={`stagger-item font-black tracking-tight ${hero ? "text-7xl md:text-9xl" : "text-5xl md:text-7xl"}`}>{title}</Heading>
        <p className="stagger-item mx-auto mt-6 max-w-xl text-lg leading-relaxed text-stone-300">{copy}</p>
        {hero && <p className="absolute bottom-12 left-0 right-0 text-xs uppercase tracking-[0.35em] text-white/45">Scroll to Grow</p>}
      </div>
    </section>
  );
}
