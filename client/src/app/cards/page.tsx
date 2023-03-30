import { createSupabaseServerClient } from "@/utils/supabase/supabaseServer";

export default async function CardsPage() {
  const supabase = createSupabaseServerClient();
  const { data: cards } = await supabase.from("card").select();
  console.log(cards);

  return <main>All Cards</main>;
}
