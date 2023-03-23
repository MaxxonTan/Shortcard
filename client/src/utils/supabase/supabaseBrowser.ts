import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "types/supabase";

export const createSupabaseBrowserClient = () =>
  createBrowserSupabaseClient<Database>();
