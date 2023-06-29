"use client";

import { useSupabase } from "@/components/supabase/supabaseProvider";
import Button from "@/components/ui/button";
import Image from "next/image";
import birthdayCardImage from "../../public/birthday_card.png";

export default function HomePage() {
  const { supabase } = useSupabase();

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000/cards/all/"
            : "https://shortcard.vercel.app/cards/all/",
      },
    });
  };

  return (
    <main className="mx-auto flex h-screen flex-col items-center justify-center ">
      <Image src={birthdayCardImage} alt="Birthday Card Icon" priority />

      <h1 className="mb-4 text-center font-serif text-2xl font-bold">
        Generate birthday cards.
      </h1>
      <Button
        color="Primary"
        onClick={handleGoogleLogin}
        text="Sign in with Google"
        horizontalPadding="px-5 lg:px-10"
      />
    </main>
  );
}
