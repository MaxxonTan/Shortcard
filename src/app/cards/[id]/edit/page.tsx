"use client";

import { ChangeEvent, useEffect, useReducer, useRef, useState } from "react";
import { fabric } from "fabric";
import { Canvas, Textbox } from "fabric/fabric-impl";
import {
  BsArrowLeftShort,
  BsArrowRightShort,
  BsInputCursorText,
  BsPlus,
  BsPaintBucket,
} from "react-icons/bs";
import { MdDelete, MdOutlineInsertPhoto } from "react-icons/md";
import { HiOutlineSave } from "react-icons/hi";
import Compressor from "compressorjs";

import TextField from "@/components/ui/textField";
import Button from "@/components/ui/button";
import { useSupabase } from "@/components/supabase/supabaseProvider";
import { Page } from "types/supabase";
import { cardEditReducer, initialCardEdit } from "./cardEditReducer";
import {
  generateImageObject,
  generateTextboxObject,
} from "@/utils/fabric/controls";
import TextboxProperties from "./editProperties/textbox";
import { SupabaseService } from "@/utils/supabase/supabaseService";
import ScaleLoader from "react-spinners/ScaleLoader";

/**
 * The type of fabric.js objects that are supported in this app.
 */
type supportedObjectTypes = "textbox" | "image" | "video" | "none";

export default function EditCardPage(params: { params: { id: string } }) {
  const { supabase } = useSupabase();
  const supabaseService = new SupabaseService(supabase);

  /**
   * Store the pages that are retrieved from the db and is used again when saving local changes.
   * This is checked against the pages in cardState reducer during save.
   */
  const pages = useRef<Page[]>([]);

  /**
   * Used to display the controls specific to the object type.
   * Currently only support Textboxes.
   */
  const [selectedObject, setSelectedObject] = useState<fabric.Object>();
  const [selectedObjectType, setSelectedObjectType] =
    useState<supportedObjectTypes>("none");

  /**
   * Keeping a state of page background color because using setBackgroundColor() doesn't cause a re-render,
   * which is needed to display updated value in the color input.
   */
  const [currentPageColor, setCurrentPageColor] = useState("#FFFFFF");
  const [cardState, cardStateDispatch] = useReducer(
    cardEditReducer,
    initialCardEdit
  );

  const fabricRef = useRef<Canvas | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Loads the first page on page load.
   */
  useEffect(() => {
    setIsLoading(true);

    /**
     * Fetch all the pages and card info for this card from the db
     */
    const loadCard = async () => {
      const queriedCard = await supabaseService.fetchCard(params.params.id);

      if (queriedCard) {
        cardStateDispatch({
          type: "loadCard",
          card: queriedCard,
        });
      }

      const queriedPages = await supabaseService.fetchPages(params.params.id);

      if (queriedPages) {
        cardStateDispatch({
          type: "loadPage",
          pages: queriedPages,
        });

        pages.current = queriedPages;
      }

      cardStateDispatch({
        type: "loadPage",
        pages: pages.current,
      });

      setIsLoading(false);
    };

    loadCard();
  }, []);

  /**
   * Update the canvas everytime the page index changes.
   */
  useEffect(() => {
    if (cardState.currentPageIndex === -1) return;

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

    setCurrentPageColor(
      fabricRef.current.backgroundColor?.toString() ?? "#FFFFFF"
    );

    /**
     * Hack to display custom controls on load without adding any textbox / image element.
     * For some reason editing the fabric.object controls prototype does not work.
     */
    const image = generateImageObject(document.createElement("img"));
    const textbox = generateTextboxObject();
    fabricRef.current.add(image, textbox);
    fabricRef.current.remove(image, textbox);

    return () => {
      fabricRef.current?.dispose();
    };
  }, [cardState.currentPageIndex]);

  /**
   * Save or delete cards for this card to the db
   */
  async function saveCard() {
    if (!fabricRef.current) return;

    setIsLoading(true);

    // Call change page to convert current page to JSON and save it to newCardState.
    let newCardState = cardEditReducer(cardState, {
      type: "changePage",
      currentPageJSON: JSON.stringify(fabricRef.current),
      toPageIndex: cardState.currentPageIndex,
    });

    if (newCardState.localImages.length > 0) {
      await supabaseService.uploadImages(
        newCardState.localImages,
        params.params.id,
        async () => {
          if (!fabricRef.current) return;

          cardStateDispatch({ type: "clearLocalImages" });

          // Call change page again because the source in image objects in the canvas have changed.
          newCardState = cardEditReducer(cardState, {
            type: "changePage",
            currentPageJSON: JSON.stringify(fabricRef.current),
            toPageIndex: cardState.currentPageIndex,
          });

          await supabaseService.updateCard(
            newCardState,
            pages.current,
            params.params.id,
            fabricRef.current
          );

          setIsLoading(false);
        }
      );

      return;
    }

    await supabaseService.updateCard(
      newCardState,
      pages.current,
      params.params.id,
      fabricRef.current
    );

    setIsLoading(false);
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
      case "image":
        setSelectedObjectType("image");
        setSelectedObject(e.selected[0]);
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
        // Compress image
        new Compressor(file, {
          quality: 0.5,
          success(compressedImage) {
            const imageURL = URL.createObjectURL(compressedImage);

            const imageElement = document.createElement("img");
            imageElement.src = imageURL;
            imageElement.addEventListener("load", () => {
              // Generate Image object with custom controls
              const image = generateImageObject(imageElement);

              if (!fabricRef.current) return;
              fabricRef.current.add(image);
              fabricRef.current.setActiveObject(image);
              fabricRef.current.renderAll();

              cardStateDispatch({
                type: "addImage",
                fabricObject: image,
                imageObject: compressedImage as File,
              });
            });
          },
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
          onValueChange={(val) => {
            cardStateDispatch({
              type: "updateOpeningMessage",
              newOpeningMessage: val,
            });
          }}
          value={cardState.openingMessage}
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
            // Reset value on click so that on change will always be triggered.
            onClick={(e) => (e.currentTarget.value = "")}
          />
          <Button
            color="Secondary"
            tooltip="Background Color"
            onClick={() => {
              document.getElementById("colorInput")?.click();
            }}
            leftIcon={
              <>
                <BsPaintBucket color="#F05123" size={24} />
                <input
                  id="colorInput"
                  type="color"
                  value={currentPageColor}
                  onChange={(e) => {
                    if (fabricRef.current) {
                      fabricRef.current.setBackgroundColor(
                        e.target.value,
                        () => {
                          setCurrentPageColor(e.target.value);
                          fabricRef.current?.requestRenderAll();
                        }
                      );
                    }
                  }}
                  className="invisible absolute"
                />
              </>
            }
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
            rightIcon={
              isLoading ? (
                <ScaleLoader
                  className="text-primary"
                  width={2}
                  height={16}
                  color="#F05123"
                />
              ) : (
                <HiOutlineSave size={24} />
              )
            }
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
