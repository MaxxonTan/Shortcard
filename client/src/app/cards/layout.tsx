"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import { FiPlus } from "react-icons/fi";
import { MdExitToApp } from "react-icons/md";
import { useEffect, useReducer, useState } from "react";

import { useSupabase } from "@/components/supabase/supabaseProvider";
import Button from "@/components/ui/button";
import avatar from "../../../public/avatar.png";
import CustomDialog from "@/components/ui/customDialog";
import TextField from "@/components/ui/textField";
import { Card } from "types/supabase";

type NewCardAction =
  | { type: "updateFrom"; from: string }
  | { type: "updateTo"; to: string };

function newCardReducer(card: Card, action: NewCardAction): Card {
  switch (action.type) {
    case "updateFrom": {
      card.from = action.from;
      return card;
    }
    case "updateTo": {
      card.from = action.to;
      return card;
    }
  }
}

const emptyCard: Card = {
  from: "",
  id: "",
  user_id: "",
  to: "",
  opening_message: null,
  opening_music: null,
};

export default function CardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const iconSize = 32;
  const { supabase } = useSupabase();

  /**
   * The url of the photo
   */
  const [userPhoto, setUserPhoto] = useState<string>();
  const [isCreateCardDialogOpen, setIsCreateCardDialogOpen] = useState(false);
  const [newCard, dispatch] = useReducer(newCardReducer, emptyCard);

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

  const createCard = async () => {
    // Insert a new row to Cards table
    //const { error } = await supabase.from("card").insert(newCard);
    // Insert an empty page to the newly created card
  };

  return (
    <>
      <header className="flex items-center px-6 py-8 sm:px-10">
        {/* Hacky styling with negative top margin here, caused by h1 doesn't align vertically */}
        <Link href="/cards" className="-mt-3 text-center text-5xl font-bold">
          Cards
        </Link>
        <Button
          color="Transparent"
          onClick={() => {
            setIsCreateCardDialogOpen(true);
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
        <CustomDialog
          isOpen={isCreateCardDialogOpen}
          setOpen={(isOpen) => setIsCreateCardDialogOpen(isOpen)}
          title="Create Card"
          content={
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createCard();
              }}
            >
              <div className="flex flex-col gap-2">
                <TextField
                  label="From"
                  required
                  placeholder="Who is this from?"
                  value={newCard.from ?? ""}
                  onValueChange={(e) => {
                    dispatch({ type: "updateFrom", from: e });
                  }}
                />
                <TextField
                  label="To"
                  required
                  placeholder="Who is this for?"
                  value={newCard.to ?? ""}
                  onValueChange={(e) => {
                    dispatch({ type: "updateTo", to: e });
                  }}
                />
                <Button
                  color="Primary"
                  text="Create Card"
                  onClick={() => {}}
                  hasTransition={false}
                  extraClassnames="py-1 text-center mt-2 text-sm"
                  type="submit"
                />
              </div>
            </form>
          }
        />
      </header>

      <main className="px-6 sm:px-10">{children}</main>
    </>
  );
}
