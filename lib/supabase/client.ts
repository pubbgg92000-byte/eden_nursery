"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getPublicSupabaseConfig } from "./env";

export function createBrowserSupabaseClient() {
  const config = getPublicSupabaseConfig();
  if (!config) return null;
  return createBrowserClient(config.url, config.key);
}
