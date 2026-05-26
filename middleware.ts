import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getPublicSupabaseConfig } from "@/lib/supabase/env";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });
  const config = getPublicSupabaseConfig();
  const isLogin = request.nextUrl.pathname === "/admin/login";

  if (!config) {
    if (!isLogin) {
      return NextResponse.redirect(new URL("/admin/login?error=configuration", request.url));
    }
    return response;
  }

  const client = createServerClient(config.url, config.key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (items) => {
        items.forEach(({ name, value }) => request.cookies.set(name, value));
        items.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const {
    data: { user },
  } = await client.auth.getUser();

  if (isLogin) {
    if (user) {
      const { data: profile } = await client
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .maybeSingle();
      if (profile?.is_admin) return NextResponse.redirect(new URL("/admin", request.url));
    }
    return response;
  }

  if (!user) return NextResponse.redirect(new URL("/admin/login", request.url));
  const { data: profile } = await client
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile?.is_admin) {
    return NextResponse.redirect(new URL("/admin/login?error=unauthorized", request.url));
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
