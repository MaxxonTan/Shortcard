import { headers, cookies } from "next/headers";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";

import type { Database } from "types/supabase";

export const createSupabaseServerClient = () =>
  createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  });
