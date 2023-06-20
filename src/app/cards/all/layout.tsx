"use client";

import Image from "next/image";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { MdExitToApp } from "react-icons/md";
import { useEffect, useReducer, useState } from "react";

import { useSupabase } from "@/components/supabase/supabaseProvider";
import Button from "@/components/ui/button";
import avatar from "../../../../public/avatar.png";
import CustomDialog from "@/components/ui/customDialog";
import TextField from "@/components/ui/textField";
import { InsertCard, InsertPage } from "types/supabase";
import { User } from "@supabase/supabase-js";
import { usePathname, useRouter } from "next/navigation";
import BarLoader from "react-spinners/BarLoader";

type newCardState = {
  card: InsertCard;
  isLoading: boolean;
  error: string;
};

type NewCardAction =
  | { type: "updateFrom"; from: string }
  | { type: "updateTo"; to: string }
  | { type: "updateIsLoading"; isLoading: boolean }
  | { type: "updateError"; error: string };

function newCardReducer(
  newCardState: newCardState,
  action: NewCardAction
): newCardState {
  switch (action.type) {
    case "updateFrom": {
      const card = { ...newCardState.card };
      card.from = action.from;
      return { ...newCardState, card };
    }
    case "updateTo": {
      const card = { ...newCardState.card };
      card.to = action.to;
      return { ...newCardState, card };
    }
    case "updateIsLoading": {
      return { ...newCardState, isLoading: action.isLoading };
    }
    case "updateError": {
      return { ...newCardState, error: action.error };
    }
  }
}

const initialNewCardState: newCardState = {
  card: {
    from: "",
    user_id: "",
    opening_message: null,
    opening_music: null,
  },
  isLoading: false,
  error: "",
};

export default function AllCardsLayout({
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
  const [user, setUser] = useState<User>();
  const [isCreateCardDialogOpen, setIsCreateCardDialogOpen] = useState(false);
  const [newCardState, newCardDispatch] = useReducer(
    newCardReducer,
    initialNewCardState
  );

  useEffect(() => {
    const fetchUser = async () => {
      const user = await supabase.auth.getUser();
      if (user.data.user) {
        setUser(user.data.user);
      }
    };

    fetchUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const createCard = async () => {
    newCardDispatch({ type: "updateIsLoading", isLoading: true });

    // Create new card object
    const card: InsertCard = { ...newCardState.card };
    if (user) card.user_id = user?.id;

    // Insert a new row to Cards table
    const { data: createdCard, error: createCardError } = await supabase
      .from("card")
      .insert(card)
      .select();

    if (createCardError && !createdCard) {
      newCardDispatch({ type: "updateError", error: createCardError.message });
      return;
    }

    // Create the first page object
    const firstPage: InsertPage = {
      card_id: createdCard[0].id,
      canvas_content: null,
      page_index: 0,
    };

    // Insert an empty page to the newly created card
    const { data: createdPage, error: createPageError } = await supabase
      .from("page")
      .insert(firstPage)
      .select();

    if (createPageError) {
      newCardDispatch({ type: "updateError", error: createPageError.message });
      return;
    }

    // Navigate to card edit page
    router.push(`/cards/${createdCard[0].id}/edit`);
    setIsCreateCardDialogOpen(false);

    newCardDispatch({ type: "updateIsLoading", isLoading: false });
  };

  return (
    <>
      <header className="flex items-center">
        {/* Hacky styling with negative top margin here, caused by h1 doesn't align vertically */}
        <Link
          href="/cards/all"
          className="-mt-3 text-5xl font-bold text-neutral-black"
        >
          Cards
        </Link>
        <Button
          color="Transparent"
          onClick={() => {
            setIsCreateCardDialogOpen(true);
          }}
          leftIcon={<FiPlus size={iconSize} />}
          tooltip="New Card"
        />

        <Image
          src={user?.user_metadata.avatar_url ?? avatar.src}
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
        />
        <CustomDialog
          isOpen={isCreateCardDialogOpen}
          setOpen={(isOpen) => setIsCreateCardDialogOpen(isOpen)}
          title="Create Card"
        >
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
                value={newCardState.card.from ?? ""}
                onValueChange={(e) => {
                  newCardDispatch({ type: "updateFrom", from: e });
                }}
              />
              <TextField
                label="To"
                required
                placeholder="Who is this for?"
                value={newCardState.card.to ?? ""}
                onValueChange={(e) => {
                  newCardDispatch({ type: "updateTo", to: e });
                }}
              />
              {newCardState.isLoading ? (
                <BarLoader
                  color="#F05123"
                  className="mx-auto mt-2"
                  width="100%"
                />
              ) : (
                <Button
                  color="Primary"
                  text="Create Card"
                  onClick={() => {}}
                  extraClassnames="py-1 text-center mt-2 text-sm"
                  type="submit"
                />
              )}
              {newCardState.error && <p>{newCardState.error}</p>}
            </div>
          </form>
        </CustomDialog>
      </header>
      <main className="mt-8">{children}</main>
    </>
  );
}
