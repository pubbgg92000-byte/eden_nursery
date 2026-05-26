"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function signOut() {
  const client = await createServerSupabaseClient();
  if (client) await client.auth.signOut();
  redirect("/");
}
