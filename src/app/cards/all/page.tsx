"use client";

import { useEffect, useState } from "react";

import CardItem from "@/components/ui/cardItem";
import { Card } from "types/supabase";
import { useSupabase } from "@/components/supabase/supabaseProvider";
import { BarLoader } from "react-spinners";
import { User } from "@supabase/supabase-js";
import { SupabaseService } from "@/utils/supabase/supabaseService";

export default function CardsPage() {
  const { supabase } = useSupabase();
  const supabaseService = new SupabaseService(supabase);

  const [cards, setCards] = useState<Card[]>([]);
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getCards() {
      const user = await supabaseService.getUser();
      setUser(user);

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
    if (!user) return;

    setIsLoading(true);

    // Delete all the images in the card.
    const baseFolderPath = `public/${user.id}/${cardId}`;
    const { data: images } = await supabase.storage
      .from("cards")
      .list(baseFolderPath);

    if (images) {
      const imagePaths = images.map((image) => {
        return baseFolderPath + "/" + image.name;
      });

      await supabase.storage.from("cards").remove(imagePaths);
    }

    const { error: cardDeleteError } = await supabase
      .from("card")
      .delete()
      .eq("id", cardId);

    if (!cardDeleteError) {
      const newCards = [...cards];
      const deleteCardIndex = newCards.findIndex((card) => card.id === cardId);

      newCards.splice(deleteCardIndex, 1);
      setCards(newCards);

      setIsLoading(false);
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
      {cards.length === 0 && !isLoading && (
        <h1 className="text-xl text-neutral-black">No cards created.</h1>
      )}
    </main>
  );
}
