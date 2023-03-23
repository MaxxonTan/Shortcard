import { headers, cookies } from "next/headers";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";

import type { Database } from "types/supabase";

/**
 * For server components that needs to access supabase (not for authentication), call this function
 * @returns A supabase client for server components
 */
export const createSupabaseServerClient = () =>
  createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  });
