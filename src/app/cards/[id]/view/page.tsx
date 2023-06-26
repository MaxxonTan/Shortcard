import { createSupabaseServerClient } from "@/utils/supabase/supabaseServer";
import CardContainer from "./cardContainer";

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
    <main className="h-full">{pages && <CardContainer pages={pages} />}</main>
  );
}
