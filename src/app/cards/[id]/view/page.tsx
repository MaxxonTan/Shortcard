import { createSupabaseServerClient } from "@/utils/supabase/supabaseServer";
import { SupabaseService } from "@/utils/supabase/supabaseService";
import { url } from "inspector";
import { Metadata, ResolvingMetadata } from "next";
import CardContainer from "./cardContainer";
import OpeningMessageContainer from "./openingMessageContainer";

type MetadataProps = {
  params: { id: string };
};

export async function generateMetadata(
  { params }: MetadataProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  console.log(parent);
  const supabase = createSupabaseServerClient();
  const supabaseService = new SupabaseService(supabase);

  const card = await supabaseService.fetchCard(params.id);

  return {
    title: `Shortcard for ${card.to}`,
    description: `Check out this card for ${card.to}!`,
    openGraph: {
      title: "Shortcard",
      description: `Check out this card for ${card.to}!`,
      images: [
        {
          url: "/favicon.ico",
        },
      ],
    },
  };
}

export default async function ViewCardPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createSupabaseServerClient();
  const supabaseService = new SupabaseService(supabase);

  const card = await supabaseService.fetchCard(params.id);

  const pages = await supabaseService.fetchPages(params.id);

  return (
    <main className="relative h-full">
      {card && (
        <OpeningMessageContainer
          openingMessage={card.opening_message ?? ""}
          from={card.from ?? ""}
        />
      )}
      {pages && <CardContainer pages={pages} />}
    </main>
  );
}
