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
import { HiOutlineSave } from "react-icons/hi";
import { useSupabase } from "@/components/supabase/supabaseProvider";
import { Page } from "types/supabase";
import { v4 as uuidv4 } from "uuid";
import { cardEditReducer, initialCardEdit } from "./cardEditReducer";
import { generateTextbox } from "@/utils/fabric/controls";

export default function EditCardPage(params: { params: { id: string } }) {
  const { supabase } = useSupabase();

  /**
   * Store the pages that are retrieved from the db.
   * Note: The content of the pages are not updated until the user saves the page.
   */
  const pages = useRef<Page[]>([]);
  const [cardState, cardStateDispatch] = useReducer(
    cardEditReducer,
    initialCardEdit
  );

  const fabricRef = useRef<Canvas | null>(null);

  // Loads the first page on page load.
  useEffect(() => {
    // Get pages from db.
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("page")
        .select()
        .eq("card_id", params.params.id);

      if (!error && data) {
        cardStateDispatch({
          type: "loadPage",
          pages: data,
        });

        pages.current = data;
      }
    };

    fetchData();

    cardStateDispatch({
      type: "loadPage",
      pages: pages.current,
    });
  }, []);

  // Update the canvas everytime the page index changes.
  useEffect(() => {
    // Clear the canvas.
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
  }, [cardState.currentPageIndex, cardState.pageJSONs]);

  async function saveCard() {
    const newCardState = cardEditReducer(cardState, {
      type: "changePage",
      currentPageJSON: JSON.stringify(fabricRef.current),
      toPageIndex: cardState.currentPageIndex,
    });

    // Compare the cardState to pages ref and UPSERT to Supabase.
    newCardState.pageJSONs.forEach((pageJSON, index) => {
      // Find page id
      const pageIndex = pages.current.findIndex((page) => {
        return page.page_index === index;
      });

      if (pageIndex !== -1) {
        pages.current[pageIndex].canvas_content = pageJSON;
      } else {
        pages.current.push({
          canvas_content: pageJSON,
          card_id: params.params.id,
          id: uuidv4(),
          page_index: index,
        });
      }
    });

    // Remove any pages that is in the db but not locally (deleted pages).
    while (pages.current.length > cardState.pageJSONs.length) {
      pages.current.pop();
    }

    const { data, error } = await supabase
      .from("page")
      .upsert(pages.current)
      .select();
  }

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
              const textbox = generateTextbox();

              if (fabricRef.current) {
                fabricRef.current.add(textbox);
                fabricRef.current.setActiveObject(textbox);
              }
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
                toPageIndex: cardState.currentPageIndex + 1,
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
            isDisabled={
              cardState.pageJSONs.length === 1 ||
              cardState.currentPageIndex === 0
            }
          />
          <Button
            color="Transparent"
            onClick={saveCard}
            rightIcon={<HiOutlineSave size={24} />}
            hasTransition={false}
            horizontalPadding="px-2"
            tooltip="Save Page"
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
