"use client";

import { useSupabase } from "@/components/supabase/supabaseProvider";
import Button from "@/components/ui/button";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { MdExitToApp } from "react-icons/md";
import avatar from "../../../public/avatar.png";

export default function CardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const iconSize = 32;
  const { supabase } = useSupabase();
  const router = useRouter();

  /**
   * The url of the photo
   */
  const [userPhoto, setUserPhoto] = useState<string>();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await supabase.auth.getUser();
      setUserPhoto(user.data.user?.user_metadata.avatar_url);
    };

    fetchUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <header className="flex items-center px-6 py-8 sm:px-10">
        {/* Hacky styling with negative top margin here, caused by h1 doesn't align vertically */}
        <h1 className="-mt-3 text-center text-5xl font-bold">Cards</h1>
        <Button
          color="Transparent"
          onClick={() => {
            router.push("/cards/create");
          }}
          leftIcon={<FiPlus size={iconSize} />}
          hasTransition={false}
          tooltip="New Card"
        />

        <Image
          src={userPhoto ?? avatar.src}
          width={iconSize}
          height={iconSize}
          alt="Profile Photo"
          className="invisible my-auto ml-auto h-min w-8 rounded-full sm:visible"
        />
        <Button
          tooltip="Sign Out"
          color="Transparent"
          onClick={handleSignOut}
          leftIcon={<MdExitToApp size={iconSize} />}
          hasTransition={false}
        />
      </header>

      <main className="px-6 sm:px-10">{children}</main>
    </>
  );
}
