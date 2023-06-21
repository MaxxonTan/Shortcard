import { CardEditState } from "@/app/cards/[id]/edit/cardEditReducer";
import { SupabaseClient } from "@supabase/supabase-js";
import { error } from "console";
import { Canvas, Image } from "fabric/fabric-impl";
import { Card, Database, Page } from "types/supabase";
import { v4 as uuidv4 } from "uuid";

/**
 * Service class containing logic between cards and db.
 * In a weird state right now since only used by the card edit page.
 * Refer to supabaseProvider.tsx for possible refactor.
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

    currentPageCanvas.requestRenderAll();

    return unsavedPages;
  }

  public async uploadImages(
    images: {
      fabricObject: Image;
      imageObject: File;
    }[],
    cardId: string,
    onImageLoad: () => void
  ) {
    const {
      data: { user },
      error: userError,
    } = await this.supabase.auth.getUser();

    images.forEach(async (localImage, index) => {
      // If local image has been deleted from canvas before saving
      if (!localImage.fabricObject.canvas) return;

      // Upload images.
      const { data, error } = await this.supabase.storage
        .from("cards")
        .upload(
          `public/${user?.id}/${cardId}/${localImage.imageObject.name}`,
          localImage.imageObject,
          { upsert: true }
        );

      if (data) {
        const {
          data: { publicUrl },
        } = this.supabase.storage.from("cards").getPublicUrl(data?.path);

        // Replace images in canvas with uploaded images.
        localImage.fabricObject.setSrc(
          publicUrl,
          index === images.length - 1 ? onImageLoad : undefined
        );
      }
    });
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
