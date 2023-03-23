"use client";

import { createContext, useContext, useState } from "react";
import { createSupabaseBrowserClient } from "@/utils/supabase/supabaseBrowser";

import type { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "types/supabase";

/**
 * For client components that needs to access supabase for whatever reason, they should use the SupabaseContext context.
 * It is important to only have one instance when using Supabase client side, which is why we create the instance here
 * and pass it to children components using contexts.
 * Source: https://supabase.com/docs/guides/auth/auth-helpers/nextjs-server-components#client-side.
 */

type SupabaseContextType = {
  supabase: SupabaseClient<Database>;
};

export const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined
);

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [supabase] = useState(() => createSupabaseBrowserClient());

  return (
    <SupabaseContext.Provider value={{ supabase }}>
      <>{children}</>
    </SupabaseContext.Provider>
  );
}

export const useSupabase = () => {
  let supabase = useContext(SupabaseContext);
  if (supabase === undefined) {
    throw new Error(
      "Supabase instance not found. Make sure to call useSupabase only in components wrapped by SupabaseProvider."
    );
  } else {
    return supabase;
  }
};
