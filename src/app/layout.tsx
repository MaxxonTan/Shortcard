import "./globals.css";
import { Playfair_Display, Roboto_Flex } from "next/font/google";

import SupabaseListener from "@/components/supabase/supabaseListener";
import SupabaseProvider from "@/components/supabase/supabaseProvider";
import { createSupabaseServerClient } from "@/utils/supabase/supabaseServer";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
});

const roboto = Roboto_Flex({
  subsets: ["latin"],
  variable: "--font-roboto",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${roboto.variable}`}
    >
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className="bg-secondary font-serif">
        <SupabaseProvider>
          <SupabaseListener serverAccessToken={session?.access_token} />
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}
