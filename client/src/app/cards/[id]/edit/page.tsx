"use client";

import { useEffect, useReducer, useRef } from "react";
import { fabric } from "fabric";
import { Canvas } from "fabric/fabric-impl";
import TextField from "@/components/ui/textField";
import Button from "@/components/ui/button";
import {
  BsInputCursorText,
  BsLink45Deg,
  BsMusicNoteBeamed,
} from "react-icons/bs";
import { MdOutlineInsertPhoto } from "react-icons/md";

type CardEditState = {
  pageJSONs: string[];
  // Index of current page in pageJsons
  currentPageIndex: number;
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
    };

function cardEditReducer(
  newCardState: CardEditState,
  action: CardEditAction
): CardEditState {
  switch (action.type) {
    case "addPage": {
      // Add new page
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
      return newCardState;
    }
  }
}

const initialCardEdit: CardEditState = {
  pageJSONs: [""],
  currentPageIndex: 0,
};

export default function EditCardPage(params: { params: { id: string } }) {
  const fabricRef = useRef<Canvas | null>(null);
  const [cardState, cardStateDispatch] = useReducer(
    cardEditReducer,
    initialCardEdit
  );

  // Loads the first page on page load
  useEffect(() => {
    cardStateDispatch({
      type: "changePage",
      toPageIndex: 0,
      currentPageJSON: "",
    });
  }, []);

  // Update the canvas everytime the page changes
  useEffect(() => {
    // Clear the canvas
    fabricRef.current && fabricRef.current.dispose();

    // Check whether it's the first or last page, if it is then the width for the new canvas should be different.
    let newCanvasWidth = 760;
    if (
      cardState.currentPageIndex === 0 ||
      cardState.currentPageIndex === cardState.pageJSONs.length - 1
    ) {
      newCanvasWidth = newCanvasWidth / 2;
    }

    fabricRef.current = new fabric.Canvas("edit-canvas", {
      height: 500,
      width: newCanvasWidth,
      backgroundColor: "green",
    });

    // If there is an existing canvas, load it up!
    if (cardState.pageJSONs[cardState.currentPageIndex]) {
      fabricRef.current.loadFromJSON(
        cardState.pageJSONs[cardState.currentPageIndex],
        fabricRef.current.renderAll.bind(fabricRef.current)
      );
    }
  }, [cardState.currentPageIndex]);

  return (
    <div className="flex flex-wrap gap-8">
      <div className="mr-auto flex max-w-xs flex-1 flex-col gap-2">
        <TextField
          label="Opening Message"
          onValueChange={(val) => {}}
          value=""
        />
        <div className="flex gap-2">
          <Button
            color="Secondary"
            onClick={() => {
              fabricRef.current &&
                fabricRef.current.add(
                  new fabric.Textbox("hello world", { left: 100, top: 100 })
                );
            }}
            text="Text"
            extraClassnames="w-full"
            leftIcon={<BsInputCursorText color="#F05123" size={24} />}
          />
          <Button
            color="Secondary"
            onClick={() => {
              cardStateDispatch({ type: "addPage" });
              cardStateDispatch({
                type: "changePage",
                toPageIndex: cardState.currentPageIndex,
                currentPageJSON: JSON.stringify(fabricRef.current),
              });
            }}
            text="Add page"
            extraClassnames="w-full"
            leftIcon={<BsMusicNoteBeamed color="#F05123" size={24} />}
          />
        </div>
        <div className="flex gap-2">
          <Button
            color="Secondary"
            onClick={() => {
              cardStateDispatch({
                type: "deletePage",
                pageIndex: cardState.currentPageIndex,
              });
            }}
            text="Delete Page"
            extraClassnames="w-full"
            leftIcon={<BsLink45Deg color="#F05123" size={24} />}
          />
          <Button
            color="Secondary"
            onClick={() => {
              cardStateDispatch({
                type: "changePage",
                toPageIndex: cardState.currentPageIndex + 1,
                currentPageJSON: JSON.stringify(fabricRef.current),
              });
            }}
            text="Next Page"
            extraClassnames="w-full"
            leftIcon={<MdOutlineInsertPhoto color="#F05123" size={24} />}
          />
        </div>
      </div>
      <div className="relative flex overflow-hidden rounded-md ring-4 ring-neutral-black">
        <canvas id="edit-canvas" />
      </div>
    </div>
  );
}
