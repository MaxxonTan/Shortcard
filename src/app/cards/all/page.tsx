"use client";

import { useEffect, useState } from "react";

import CardItem from "@/components/ui/cardItem";
import { Card } from "types/supabase";
import { useSupabase } from "@/components/supabase/supabaseProvider";

export default function CardsPage() {
  const { supabase } = useSupabase();

  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    async function getCards() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: cards } = await supabase
          .from("card")
          .select()
          .eq("user_id", user.id);

        if (cards) setCards(cards);
      }
    }

    getCards();
  }, []);

  async function deleteCard(cardId: string) {
    const { error } = await supabase.from("card").delete().eq("id", cardId);

    if (!error) {
      const newCards = [...cards];
      const deleteCardIndex = newCards.findIndex((card) => card.id === cardId);

      newCards.splice(deleteCardIndex, 1);
      setCards(newCards);
    }
  }

  return (
    <main className="flex flex-wrap gap-8">
      {cards &&
        cards.map((card) => {
          return (
            <CardItem card={card} key={card.id} onCardDelete={deleteCard} />
          );
        })}
    </main>
  );
}
