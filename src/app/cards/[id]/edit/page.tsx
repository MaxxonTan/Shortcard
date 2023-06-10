"use client";

import { ChangeEvent, useEffect, useReducer, useRef, useState } from "react";
import { fabric } from "fabric";
import { Canvas, Textbox } from "fabric/fabric-impl";
import TextField from "@/components/ui/textField";
import Button from "@/components/ui/button";
import {
  BsArrowLeftShort,
  BsArrowRightShort,
  BsInputCursorText,
  BsPlus,
} from "react-icons/bs";
import { MdDelete, MdOutlineInsertPhoto } from "react-icons/md";
import { HiOutlineSave } from "react-icons/hi";
import { useSupabase } from "@/components/supabase/supabaseProvider";
import { Page } from "types/supabase";
import { v4 as uuidv4 } from "uuid";
import { cardEditReducer, initialCardEdit } from "./cardEditReducer";
import {
  generateImageObject,
  generateTextboxObject,
} from "@/utils/fabric/controls";
import TextboxProperties from "./editProperties/textbox";

/**
 * The type of fabric.js objects that are supported in this app.
 */
type supportedObjectTypes = "textbox" | "image" | "video" | "none";

export default function EditCardPage(params: { params: { id: string } }) {
  const { supabase } = useSupabase();

  /**
   * Store the pages that are retrieved from the db.
   * Note: The content of the pages are not updated until the user saves the page.
   */
  const pages = useRef<Page[]>([]);
  const [selectedObject, setSelectedObject] = useState<fabric.Object>();
  const [selectedObjectType, setSelectedObjectType] =
    useState<supportedObjectTypes>("none");
  const [cardState, cardStateDispatch] = useReducer(
    cardEditReducer,
    initialCardEdit
  );

  const fabricRef = useRef<Canvas | null>(null);

  /**
   * Loads the first page on page load.
   */
  useEffect(() => {
    loadCard();

    cardStateDispatch({
      type: "loadPage",
      pages: pages.current,
    });
  }, []);

  /**
   * Update the canvas everytime the page index changes.
   */
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

    fabricRef.current.on("selection:created", canvasObjectSelectionHandler);
    fabricRef.current.on("selection:updated", canvasObjectSelectionHandler);

    // If there is an existing canvas, load it up!
    if (cardState.pageJSONs[cardState.currentPageIndex]) {
      fabricRef.current.loadFromJSON(
        cardState.pageJSONs[cardState.currentPageIndex],
        fabricRef.current.renderAll.bind(fabricRef.current)
      );
    }

    /**
     * Hack to display custom controls on load without adding any textbox / image element.
     * For some reason editing the fabric.object controls prototype does not work.
     */
    const image = generateImageObject(document.createElement("img"));
    const textbox = generateTextboxObject();
    fabricRef.current.add(image, textbox);
    fabricRef.current.remove(image, textbox);
  }, [cardState.currentPageIndex, cardState.pageJSONs]);

  /**
   * Fetch all the pages for this card from the db
   */
  async function loadCard() {
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
  }

  /**
   * Save or delete cards for this card to the db
   */
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

  /**
   * Handler for events fired from canvas object selection.
   * Used for displaying object properties i.e. fonts, size, color, etc
   * @param e The event object fired when user selects / unselects an object.
   */
  function canvasObjectSelectionHandler(e: fabric.IEvent<MouseEvent>) {
    if (!e.selected) return;

    switch (e.selected[0].type) {
      case "textbox":
        setSelectedObjectType("textbox");
        setSelectedObject(e.selected[0]);
        break;
    }
  }

  /**
   * Add a texbox to the canvas
   */
  function addTextbox() {
    if (!fabricRef.current) return;

    const textbox = generateTextboxObject();

    fabricRef.current.add(textbox);
    fabricRef.current.setActiveObject(textbox);
  }

  /**
   * Adds a image to the canvas.
   * @param e The event fired after user selects a photo from input.
   */
  function addImage(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);

    // For each media the user uploads, generate a fabric object and add it to the canvas
    files.forEach((file) => {
      if (!fabricRef.current) return;

      if (file.type.startsWith("image")) {
        const imageURL = URL.createObjectURL(file);

        const imageElement = document.createElement("img");
        imageElement.src = imageURL;
        imageElement.addEventListener("load", () => {
          // Generate Image object with custom controls
          const image = generateImageObject(imageElement);

          if (!fabricRef.current) return;
          fabricRef.current.add(image);
          fabricRef.current.setActiveObject(image);
          fabricRef.current.renderAll();
        });
      }
    });
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
            onClick={addTextbox}
            text="Text"
            extraClassnames="w-full"
            leftIcon={<BsInputCursorText color="#F05123" size={24} />}
          />
          <Button
            color="Secondary"
            onClick={() => {
              document.getElementById("fileInput")?.click();
            }}
            text="Image"
            extraClassnames="w-full"
            leftIcon={<MdOutlineInsertPhoto color="#F05123" size={24} />}
          />
          <input
            id="fileInput"
            type="file"
            className="hidden"
            accept=".webp,.jpeg,.jpg,.png,.mp4"
            multiple={false}
            onChange={addImage}
          />
        </div>
        {selectedObjectType === "textbox" && (
          <TextboxProperties textbox={selectedObject as Textbox} />
        )}
        {/* Page Number */}
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
            extraClassnames="mt-1"
            tooltip="Add Page"
          />
        </div>
        {/* Page Controls */}
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
