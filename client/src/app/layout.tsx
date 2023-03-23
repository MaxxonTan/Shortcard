import "./globals.css";
import { Playfair_Display, Roboto } from "@next/font/google";

import SupabaseListener from "@/components/supabase/supabaseListener";
import SupabaseProvider from "@/components/supabase/supabaseProvider";
import { createSupabaseServerClient } from "@/utils/supabase/supabaseServer";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-playfair-display",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "400", "700"],
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
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body
        className={`${playfairDisplay.variable} ${roboto.variable} bg-secondary px-20 font-serif`}
      >
        <SupabaseProvider>
          <SupabaseListener serverAccessToken={session?.access_token} />
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}
