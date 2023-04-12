import CardItem from "@/components/ui/cardItem";
import { createSupabaseServerClient } from "@/utils/supabase/supabaseServer";

export default async function CardsPage() {
  const supabase = createSupabaseServerClient();
  const { data: cards } = await supabase.from("card").select();

  return (
    <main className="flex gap-8">
      {cards &&
        cards.map((card) => {
          return <CardItem card={card} key={card.id} />;
        })}
    </main>
  );
}
