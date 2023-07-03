import { createSupabaseServerClient } from "@/utils/supabase/supabaseServer";
import { SupabaseService } from "@/utils/supabase/supabaseService";
import { Metadata, ResolvingMetadata } from "next";
import CardContainer from "./cardContainer";
import OpeningMessageContainer from "./openingMessageContainer";

// type MetadataProps = {
//   params: { id: string };
// };

// export async function generateMetadata({
//   params,
// }: MetadataProps): Promise<Metadata> {
//   const supabase = createSupabaseServerClient();
//   const supabaseService = new SupabaseService(supabase);

//   const card = await supabaseService.fetchCard(params.id);

//   return {
//     openGraph: {
//       title: `Shortcard for ${card.to}`,
//       description: `Check out this card for ${card.to}!`,
//       url: `https://shortcard.vercel.app/cards/${card.id}/view/`,
//       siteName: "shortcard.vercel.app",
//       images: [
//         {
//           url: "/icon.jpg",
//           width: 1000,
//           height: 1000,
//         },
//       ],
//       locale: "en_US",
//       type: "website",
//     },
//   };
// }

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
