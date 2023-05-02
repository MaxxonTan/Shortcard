import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import type { Database } from "types/supabase";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createMiddlewareSupabaseClient<Database>({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect to login / home page if user is not signed in
  if (!session && req.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Redirect to cards page if user signed in
  if (session && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/cards/all", req.url));
  }

  // TODO: Redirect to unathorized page if user goes to card edit page that isn't theirs

  return res;
}

export const config = {
  matcher: ["/", "/cards", "/cards/:path*/edit"],
};
