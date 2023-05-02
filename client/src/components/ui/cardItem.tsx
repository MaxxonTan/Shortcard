"use client";

import classNames from "classnames";
import Link from "next/link";
import { Card } from "types/supabase";
import { MdDelete } from "react-icons/md";

type CardItemProp = {
  card: Card;
};

export default function CardItem(props: CardItemProp) {
  const card = props.card;

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
          e.preventDefault();

          // TODO: Delete card
        }}
      />
      <div className="h-56 w-56 rounded-md bg-primary ring-neutral-black transition-all group-hover:ring-2" />
      <h1 className="font-medium text-neutral-black group-hover:underline">
        <b>To:</b> {card.to}
      </h1>
    </Link>
  );
}
