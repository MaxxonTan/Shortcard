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

  // If user is not signed in and is already and login page, no need to redirect
  if (!session && !req.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}
