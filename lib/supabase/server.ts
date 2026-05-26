import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { getPublicSupabaseConfig, getServiceRoleConfig } from "./env";

export async function createServerSupabaseClient() {
  const config = getPublicSupabaseConfig();
  if (!config) return null;
  const cookieStore = await cookies();

  return createServerClient(config.url, config.key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (items) => {
        try {
          items.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Cookie writes happen in middleware or actions, not Server Components.
        }
      },
    },
  });
}

export function createServiceRoleClient() {
  const config = getServiceRoleConfig();
  if (!config) return null;
  return createServiceClient(config.url, config.key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function requireAdmin() {
  const client = await createServerSupabaseClient();
  if (!client) redirect("/admin/login?error=configuration");

  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await client
    .from("profiles")
    .select("id, is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.is_admin) redirect("/admin/login?error=unauthorized");
  return { client, user };
}
