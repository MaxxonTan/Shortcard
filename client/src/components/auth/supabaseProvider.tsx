"use client";

import { createContext, useContext, useState } from "react";
import { createSupabaseBrowserClient } from "@/utils/supabase/supabaseBrowser";

import type { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "types/supabase";

type SupabaseContext = {
  supabase: SupabaseClient<Database>;
};

const SupabaseContext = createContext<SupabaseContext | undefined>(undefined);

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

export const useSupabaseContext = () => {
  let context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error("useSupabaseContext must be used inside SupabaseProvider");
  } else {
    return context;
  }
};
