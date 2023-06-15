import { CardEditState } from "@/app/cards/[id]/edit/cardEditReducer";
import { SupabaseClient } from "@supabase/supabase-js";
import { error } from "console";
import { Canvas } from "fabric/fabric-impl";
import { Card, Database, Page } from "types/supabase";
import { v4 as uuidv4 } from "uuid";

/**
 * Service class containing logic between cards and db
 */
export class SupabaseService {
  private supabase: SupabaseClient<Database>;

  constructor(supabaseContext: SupabaseClient) {
    this.supabase = supabaseContext;
  }

  public async updateCard(
    cardState: CardEditState,
    unsavedPages: Page[],
    cardId: string,
    currentPageCanvas: Canvas
  ) {
    // Update opening message for card
    if (cardState.openingMessage)
      await this.supabase
        .from("card")
        .update({
          opening_message: cardState.openingMessage,
        })
        .eq("id", cardId);

    cardState.localImages.forEach((localImage) => {
      // Upload images.
      // Replace images in canvas with uploaded images.
    });

    currentPageCanvas.requestRenderAll();

    console.log(currentPageCanvas.getObjects("image"));

    // Compare the cardState to pages ref and UPSERT to Supabase.
    cardState.pageJSONs.forEach((pageJSON, index) => {
      // Find page id
      const pageIndex = unsavedPages.findIndex((page) => {
        return page.page_index === index;
      });

      if (pageIndex !== -1) {
        unsavedPages[pageIndex].canvas_content = pageJSON;
      } else {
        unsavedPages.push({
          canvas_content: pageJSON,
          card_id: cardId,
          id: uuidv4(),
          page_index: index,
        });
      }
    });

    // TODO: Remove any pages that is in the db but not locally (deleted pages).
    while (unsavedPages.length > cardState.pageJSONs.length) {
      unsavedPages.pop();
    }

    await this.supabase.from("page").upsert(unsavedPages).select();

    return unsavedPages;
  }

  public async fetchCard(cardId: string): Promise<Card> {
    const { data: queriedCard, error: cardError } = await this.supabase
      .from("card")
      .select()
      .eq("id", cardId);

    if (cardError || !queriedCard) {
      return Promise.reject(cardError);
    }

    return queriedCard[0];
  }

  public async fetchPages(cardId: string): Promise<Page[]> {
    const { data: queriedPages, error: pageError } = await this.supabase
      .from("page")
      .select()
      .eq("card_id", cardId);

    if (pageError || !queriedPages) {
      return Promise.reject(pageError);
    }

    return queriedPages;
  }
}
