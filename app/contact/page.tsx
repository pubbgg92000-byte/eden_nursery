import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Eden Nursery team for any plant-related inquiries.",
};

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-xl rounded-3xl border border-zinc-200 p-12 dark:border-zinc-800">
        <h1 className="text-4xl font-bold tracking-tighter">Get in Touch</h1>
        <p className="mt-2 text-zinc-500">We&apos;d love to hear from you.</p>
        <form className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <input type="text" className="mt-1 w-full rounded-lg border border-zinc-200 bg-transparent p-3 outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-800 dark:focus:ring-zinc-100" />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input type="email" className="mt-1 w-full rounded-lg border border-zinc-200 bg-transparent p-3 outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-800 dark:focus:ring-zinc-100" />
          </div>
          <div>
            <label className="text-sm font-medium">Message</label>
            <textarea className="mt-1 w-full rounded-lg border border-zinc-200 bg-transparent p-3 outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-800 dark:focus:ring-zinc-100" rows={4} />
          </div>
          <button className="w-full rounded-lg bg-zinc-900 py-3 font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
            Send Message
          </button>
        </form>
      </div>
    </main>
  );
}
