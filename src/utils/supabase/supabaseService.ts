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

    // Sort unsaved pages
    unsavedPages.sort((a, b) => {
      if (a.page_index < b.page_index) return -1;
      else if (a.page_index > b.page_index) return 1;

      return 0;
    });

    while (unsavedPages.length > cardState.pageJSONs.length) {
      const deletedPage = unsavedPages.pop();

      await this.supabase.from("page").delete().eq("id", deletedPage?.id);
    }

    await this.supabase.from("page").upsert(unsavedPages).select();

    currentPageCanvas.requestRenderAll();

    return unsavedPages;
  }

  /**
   * Uploads an array of images to Supabase Storage.
   * @param images An array of images object containing the fabric object and the File object.
   * @param cardId The id of the card containing the images.
   * @returns The url of the uploaded image.
   */
  public async uploadImage(imageObject: File, cardId: string) {
    const user = await this.getUser();

    if (!user) return "";

    // Upload image.
    // TODO: Use image name instead of uuid, so that we can just reference the same remote image if there's
    // a lot of object with the same image. Have to parse the image name to desired format i.e. no empty spaces.
    const { data, error } = await this.supabase.storage
      .from("cards")
      .upload(`public/${user?.id}/${cardId}/${uuidv4()}`, imageObject, {
        upsert: true,
      });

    if (data) {
      const {
        data: { publicUrl },
      } = this.supabase.storage.from("cards").getPublicUrl(data.path);

      return publicUrl;
    }

    return "";
  }

  /**
   * Fetch a card from Supabase tables.
   * @param cardId The id of the card to be fetched.
   * @returns A promise of a Card object.
   */
  public fetchCard = cache(async (cardId: string): Promise<Card> => {
    const { data: queriedCard, error: cardError } = await this.supabase
      .from("card")
      .select()
      .eq("id", cardId);

    if (cardError || !queriedCard) {
      return Promise.reject(cardError);
    }

    return queriedCard[0];
  });

  /**
   * Fetch all the pages a card have from Supabase tables.
   * @param cardId The id of the card containing the pages.
   * @returns A promise of a Page array.
   */
  public fetchPages = cache(async (cardId: string): Promise<Page[]> => {
    const { data: queriedPages, error: pageError } = await this.supabase
      .from("page")
      .select()
      .eq("card_id", cardId);

    if (pageError || !queriedPages) {
      return Promise.reject(pageError);
    }

    return queriedPages;
  });

  /**
   * A wrapper around Supabase's auth.getUser() function, with React's cache to deduplicate requests.
   */
  public getUser = cache(async () => {
    const { data, error } = await this.supabase.auth.getUser();

    if (!error) return data.user;
  });
}
