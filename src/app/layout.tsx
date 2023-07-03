import "./globals.css";
import { Playfair_Display, Roboto_Flex } from "next/font/google";

import SupabaseListener from "@/components/supabase/supabaseListener";
import SupabaseProvider from "@/components/supabase/supabaseProvider";
import { createSupabaseServerClient } from "@/utils/supabase/supabaseServer";
import { Metadata } from "next";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
});

const roboto = Roboto_Flex({
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Shortcard",
  description: "Generate birthday cards.",
  openGraph: {
    title: "Shortcard",
    description: `Generate birthday cards instantly!`,
    url: "https://shortcard.vercel.app/",
    siteName: "shortcard.vercel.app",
    images: [
      {
        url: "/icon.jpg",
        width: 1000,
        height: 1000,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

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
