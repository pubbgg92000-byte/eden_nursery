import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Learn about Eden Nursery's mission to bring botanical serenity to urban spaces.",
};

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
      <h1 className="text-5xl font-bold tracking-tighter">Our Story</h1>
      <div className="mt-12 max-w-2xl space-y-6 text-lg text-zinc-600 dark:text-zinc-400">
        <p>
          EDEN was born from a passion for bringing the serenity of nature into urban living spaces. 
          We believe that plants are more than just decoration—they are companions that improve our well-being.
        </p>
        <p>
          Our mission is to make plant care accessible, fun, and visually stunning 
          through our interactive 3D platform and curated nursery.
        </p>
      </div>
    </main>
  );
}
