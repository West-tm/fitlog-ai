import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });
  const supabaseAuthHeaders = new Headers();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([key, value]) => {
            supabaseResponse.headers.set(key, value);
            supabaseAuthHeaders.set(key, value);
          });
        },
      },
    },
  );

  // createServerClient と getClaims の間に処理を挟まない
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;
  const pathname = request.nextUrl.pathname;

  const authRoutes = ["/auth/signin", "/auth/signup"];
  const isAuthRoute = authRoutes.some((route) => pathname.includes(route));
  const isPublicRoute = pathname === "/";

  // redirect時もSupabaseが更新したCookieを引き継ぐ
  const redirectWithCookies = (path: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = "";

    const redirectResponse = NextResponse.redirect(url);

    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });

    supabaseAuthHeaders.forEach((value, key) => {
      redirectResponse.headers.set(key, value);
    });

    return redirectResponse;
  };

  if (!user && !isAuthRoute && !isPublicRoute) {
    return redirectWithCookies("/auth/signin");
  }

  if (user && isAuthRoute) {
    return redirectWithCookies("/dashboard");
  }

  return supabaseResponse;
}
