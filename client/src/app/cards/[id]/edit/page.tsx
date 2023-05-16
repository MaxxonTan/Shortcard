"use client";

import { useEffect, useReducer, useRef } from "react";
import { fabric } from "fabric";
import { Canvas } from "fabric/fabric-impl";
import TextField from "@/components/ui/textField";
import Button from "@/components/ui/button";
import {
  BsArrowLeftShort,
  BsArrowRightShort,
  BsInputCursorText,
  BsLink45Deg,
  BsMusicNoteBeamed,
  BsPlus,
} from "react-icons/bs";
import { MdDelete, MdOutlineInsertPhoto } from "react-icons/md";

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
      backgroundColor: "white",
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
    <div className="flex flex-wrap items-center gap-8">
      <div className="my-ayto mr-auto flex max-w-xs flex-1 flex-col gap-2">
        <TextField
          label="Opening Message"
          placeholder="Enter opening message here..."
          onValueChange={(val) => {}}
          value=""
        />
        {/* TODO: Use Grid */}
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
            onClick={() => {}}
            text="Music"
            extraClassnames="w-full"
            leftIcon={<BsMusicNoteBeamed color="#F05123" size={24} />}
          />
        </div>
        <div className="flex gap-2">
          <Button
            color="Secondary"
            onClick={() => {}}
            text="Link"
            extraClassnames="w-full"
            leftIcon={<BsLink45Deg color="#F05123" size={24} />}
          />
          <Button
            color="Secondary"
            onClick={() => {}}
            text="Media"
            extraClassnames="w-full"
            leftIcon={<MdOutlineInsertPhoto color="#F05123" size={24} />}
          />
        </div>
        <div className="flex items-center justify-center">
          <p className="text-lg">
            page {cardState.currentPageIndex + 1} / {cardState.pageJSONs.length}
          </p>
          <Button
            color="Transparent"
            onClick={() => {
              cardStateDispatch({ type: "addPage" });
              cardStateDispatch({
                type: "changePage",
                toPageIndex: cardState.currentPageIndex,
                currentPageJSON: JSON.stringify(fabricRef.current),
              });
            }}
            rightIcon={<BsPlus size={24} />}
            hasTransition={false}
            extraClassnames="mt-1"
            tooltip="Add Page"
          />
        </div>
        <div className="flex items-center justify-center">
          <Button
            color="Transparent"
            onClick={() => {
              cardStateDispatch({
                type: "changePage",
                toPageIndex: cardState.currentPageIndex - 1,
                currentPageJSON: JSON.stringify(fabricRef.current),
              });
            }}
            rightIcon={
              <BsArrowLeftShort
                size={24}
                color={cardState.currentPageIndex === 0 ? "grey" : "black"}
              />
            }
            hasTransition={false}
            horizontalPadding="px-2"
            tooltip="Previous Page"
            isDisabled={cardState.currentPageIndex === 0}
          />
          <Button
            color="Transparent"
            onClick={() => {
              cardStateDispatch({
                type: "deletePage",
                pageIndex: cardState.currentPageIndex,
              });
            }}
            rightIcon={<MdDelete size={24} />}
            hasTransition={false}
            horizontalPadding="px-2"
            tooltip="Delete Page"
            isDisabled={cardState.pageJSONs.length === 1}
          />
          <Button
            color="Transparent"
            onClick={() => {
              cardStateDispatch({
                type: "changePage",
                toPageIndex: cardState.currentPageIndex + 1,
                currentPageJSON: JSON.stringify(fabricRef.current),
              });
            }}
            rightIcon={
              <BsArrowRightShort
                size={24}
                color={
                  cardState.currentPageIndex === cardState.pageJSONs.length - 1
                    ? "grey"
                    : "black"
                }
              />
            }
            hasTransition={false}
            horizontalPadding="px-2"
            tooltip="Next Page"
            isDisabled={
              cardState.currentPageIndex === cardState.pageJSONs.length - 1
            }
          />
        </div>
      </div>
      <div className="relative flex overflow-hidden rounded-md ring-4 ring-neutral-black">
        <canvas id="edit-canvas" />
      </div>
    </div>
  );
}
