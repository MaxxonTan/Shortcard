"use client";

import { useEffect, useState } from "react";

import CardItem from "@/components/ui/cardItem";
import { Card } from "types/supabase";
import { useSupabase } from "@/components/supabase/supabaseProvider";
import { BarLoader } from "react-spinners";

export default function CardsPage() {
  const { supabase } = useSupabase();

  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

        if (cards) {
          setCards(cards);
          setIsLoading(false);
        }
      }
    }

    setIsLoading(true);
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
      {isLoading && (
        <BarLoader color="#F05123" className="mx-auto mt-2" width="100%" />
      )}
      {cards &&
        cards.map((card) => {
          return (
            <CardItem card={card} key={card.id} onCardDelete={deleteCard} />
          );
        })}
    </main>
  );
}
