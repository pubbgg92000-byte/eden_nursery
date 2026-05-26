"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface LoginState {
  error?: string;
}

export async function signIn(_state: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your administrator email and password." };

  const client = await createServerSupabaseClient();
  if (!client) return { error: "Supabase is not configured with a valid project URL and key." };

  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) return { error: "Sign-in failed. Check your credentials." };

  const {
    data: { user },
  } = await client.auth.getUser();
  const { data: profile } = await client
    .from("profiles")
    .select("is_admin")
    .eq("id", user?.id ?? "")
    .maybeSingle();

  if (!profile?.is_admin) {
    await client.auth.signOut();
    return { error: "This account is not authorized for EDEN administration." };
  }
  redirect("/admin");
}
