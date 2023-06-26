"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "types/supabase";
import { MdDelete } from "react-icons/md";
import CustomDialog from "./customDialog";
import Button from "./button";
import { SupabaseService } from "@/utils/supabase/supabaseService";
import { useSupabase } from "../supabase/supabaseProvider";

type CardItemProp = {
  card: Card;
  onCardDelete: (cardId: string) => void;
};

export default function CardItem(props: CardItemProp) {
  const card = props.card;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <Link
      href={`/cards/${card.id}/edit`}
      className="group relative flex cursor-pointer flex-col gap-2"
    >
      <MdDelete
        // Can't change visiblity here because you can't hover over "hidden"
        className="pointer-events-none absolute right-2 top-2 opacity-0 transition-all group-hover:pointer-events-auto group-hover:opacity-100"
        size={24}
        onClick={(e) => {
          setShowDeleteDialog(true);

          e.stopPropagation();
          e.nativeEvent.preventDefault();
        }}
      />
      <div className="h-56 w-56 rounded-md bg-primary ring-neutral-black transition-all group-hover:ring-2" />
      <h1 className="font-medium text-neutral-black group-hover:underline">
        <b>To:</b> {card.to}
      </h1>

      <CustomDialog
        isOpen={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        title="Confirm Delete"
      >
        <div className="flex flex-col gap-4">
          <p>Are you sure you want to delete this card?</p>
          <div className="flex justify-end">
            <Button
              color="Transparent"
              onClick={() => {
                setShowDeleteDialog(false);
              }}
              text="Cancel"
            />
            <Button
              color="Primary"
              onClick={() => {
                props.onCardDelete(card.id);

                setShowDeleteDialog(false);
              }}
              text="Confirm"
            />
          </div>
        </div>
      </CustomDialog>
    </Link>
  );
}
