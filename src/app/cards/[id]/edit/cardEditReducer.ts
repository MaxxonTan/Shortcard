import { Page, Card } from "types/supabase";

export type CardEditState = {
  pageJSONs: string[];
  // Index of current page in pageJsons.
  currentPageIndex: number;
  openingMessage: string;
  localImages: {
    fabricObject: fabric.Image;
    imageObject: File;
  }[];
};

type CardEditAction =
  | {
      type: "changePage";
      /**
       * The index of the page you want to change to.
       **/
      toPageIndex: number;
      /**
       * The current page canvas converted to JSON format.
       * Used for storing to the list of pageJSONs.
       */
      currentPageJSON: string;
    }
  | {
      type: "addPage";
    }
  | {
      type: "deletePage";
      pageIndex: number;
    }
  | { type: "loadPage"; pages: Page[] }
  | { type: "loadCard"; card: Card }
  | { type: "updateOpeningMessage"; newOpeningMessage: string }
  | { type: "addImage"; fabricObject: fabric.Image; imageObject: File }
  | { type: "clearLocalImages" };

export const initialCardEdit: CardEditState = {
  pageJSONs: [""],
  currentPageIndex: -1,
  openingMessage: "",
  localImages: [],
};

export function cardEditReducer(
  newCardState: CardEditState,
  action: CardEditAction
): CardEditState {
  switch (action.type) {
    case "addPage": {
      // Add new page.
      const result = { ...newCardState };
      result.pageJSONs.push("");

      return result;
    }
    case "changePage": {
      const result = { ...newCardState };
      result.currentPageIndex = action.toPageIndex;

      result.pageJSONs[newCardState.currentPageIndex] = action.currentPageJSON;

      return result;
    }
    case "deletePage": {
      const result = { ...newCardState };

      // Delete from pageJsons.
      result.pageJSONs.splice(result.currentPageIndex, 1);

      // Update current page index.
      result.currentPageIndex -= 1;

      return result;
    }
    case "loadPage": {
      const result = { ...newCardState };

      // Sort the pages by index and retrive their JSON canvas.
      const sortedPages = [...action.pages];
      sortedPages.sort((a, b) => {
        if (a.page_index < b.page_index) return -1;
        else if (a.page_index > b.page_index) return 1;

        return 0;
      });

      result.pageJSONs = sortedPages.map((page) => {
        if (page.canvas_content) return page.canvas_content.toString();
        else return "";
      });

      // If there is no pages to the card (empty card), add an empty pageJSON
      if (result.pageJSONs.length === 0) result.pageJSONs = [""];

      result.currentPageIndex = 0;
      return result;
    }
    case "loadCard": {
      const result = { ...newCardState };

      result.openingMessage = action.card.opening_message ?? "";

      return result;
    }
    case "updateOpeningMessage": {
      const result = { ...newCardState };
      result.openingMessage = action.newOpeningMessage;

      return result;
    }
    case "addImage": {
      const result = { ...newCardState };

      result.localImages = [
        ...result.localImages,
        {
          fabricObject: action.fabricObject,
          imageObject: action.imageObject,
        },
      ];

      return result;
    }
    case "clearLocalImages": {
      const result = { ...newCardState };

      result.localImages = [];

      return result;
    }
  }
}
