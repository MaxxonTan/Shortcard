import { createSupabaseServerClient } from "@/utils/supabase/supabaseServer";

export default async function Home() {
  const supabase = createSupabaseServerClient();

  const { data } = await supabase.from("posts").select("*");

  return <pre>{JSON.stringify({ data }, null, 2)}</pre>;
}
