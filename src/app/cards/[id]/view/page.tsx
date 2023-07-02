import { createSupabaseServerClient } from "@/utils/supabase/supabaseServer";
import CardContainer from "./cardContainer";
import OpeningMessageContainer from "./openingMessageContainer";

export default async function ViewCardPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createSupabaseServerClient();
  const { data: card, error: cardError } = await supabase
    .from("card")
    .select()
    .eq("id", params.id);

  const { data: pages, error: pageError } = await supabase
    .from("page")
    .select()
    .eq("card_id", params.id);

  return (
    <main className="relative h-full">
      {card && (
        <OpeningMessageContainer
          openingMessage={card[0].opening_message ?? ""}
        />
      )}
      {pages && <CardContainer pages={pages} />}
    </main>
  );
}
