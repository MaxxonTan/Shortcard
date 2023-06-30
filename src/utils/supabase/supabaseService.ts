import { CardEditState } from "@/app/cards/[id]/edit/cardEditReducer";
import { SupabaseClient } from "@supabase/supabase-js";
import { error } from "console";
import { Canvas, Image } from "fabric/fabric-impl";
import { cache } from "react";
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

  /**
   * Updates "pages" table by comparing pages between cardState and unsavedPages.
   * Also deletes pages that are not in cardState but in unsavedPages from the DB.
   * @param cardState The current card state from the cardEditReducer.
   * @param unsavedPages Array of local Page objects that are not updated with latest changes.
   * @param cardId The card id.
   * @param currentPageCanvas The canvas object.
   */
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

  /**
   * Uploads an array of images to Supabase Storage.
   * @param images An array of images object containing the fabric object and the File object.
   * @param cardId The id of the card containing the images.
   * @param onImageLoad The callback function after the uploaded images are loaded back into the canvas.
   */
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
        // Calls the onImageLoad function after the final image has been loaded into canvas.
        localImage.fabricObject.setSrc(
          publicUrl,
          index === images.length - 1 ? onImageLoad : undefined
        );
      }
    });
  }

  /**
   * Fetch a card from Supabase tables.
   * @param cardId The id of the card to be fetched.
   * @returns A promise of a Card object.
   */
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

  /**
   * Fetch all the pages a card have from Supabase tables.
   * @param cardId The id of the card containing the pages.
   * @returns A promise of a Page array.
   */
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

  /**
   * A wrapper around Supabase's auth.getUser() function, with React's cache to deduplicate requests.
   */
  public getUser = cache(async () => {
    const { data, error } = await this.supabase.auth.getUser();

    if (!error) return data.user;
  });
}
