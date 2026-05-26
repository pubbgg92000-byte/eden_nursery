function isHttpUrl(value: string | undefined): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function getPublicSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!isHttpUrl(url) || !key) return null;
  return { url, key };
}

export function hasPublicSupabaseConfig() {
  return getPublicSupabaseConfig() !== null;
}

export function getServiceRoleConfig() {
  const publicConfig = getPublicSupabaseConfig();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!publicConfig || !key) return null;
  return { url: publicConfig.url, key };
}
