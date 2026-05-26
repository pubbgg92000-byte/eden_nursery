import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950 px-6">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-10 shadow-2xl">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-emerald-600">EDEN Curator</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-emerald-950">Admin Sign In</h1>
        <p className="mb-8 mt-3 text-sm text-emerald-900/60">Restricted access for manually provisioned staff accounts.</p>
        <LoginForm />
      </div>
    </div>
  );
}
