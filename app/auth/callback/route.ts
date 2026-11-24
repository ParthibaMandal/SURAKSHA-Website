import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("\\")) {
    next = "/";
  }

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (next === "/" && data?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .maybeSingle();

        const role = profile?.role;
        next = role === "admin" || role === "operator" || role === "hydrologist"
          ? "/admin"
          : "/citizen";
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv || !forwardedHost || !/^[a-zA-Z0-9.-]+(:\d+)?$/.test(forwardedHost)) {
        return NextResponse.redirect(new URL(next, origin));
      }
      return NextResponse.redirect(new URL(next, `https://${forwardedHost}`));
    }
  }

  // Recovery links need a restart path of their own; OAuth keeps its login error route.
  const failurePath = next === "/auth/reset-password"
    ? "/auth/forgot-password?error=reset_link_invalid"
    : "/auth/login?error=oauth_exchange_failed";
  return NextResponse.redirect(new URL(failurePath, origin));
}

