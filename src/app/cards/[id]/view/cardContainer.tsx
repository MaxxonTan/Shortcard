"use client";

import { Card, Page } from "types/supabase";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/button";
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";
import { StaticCanvas } from "fabric/fabric-impl";
import { fabric } from "fabric";

type CardContainerProp = {
  pages: Page[];
};

export default function CardContainer({ pages }: CardContainerProp) {
  const fabricRef = useRef<StaticCanvas | null>(null);
  const [pageIndex, setPageIndex] = useState(0);

  /**
   * Add Listeners for arrow click
   */
  useEffect(() => {
    window.addEventListener("keydown", handleKeyBoardEvent);
  });

  /**
   * Listen to page changes
   */
  useEffect(() => {
    const currentPage = pages.find((page) => page.page_index === pageIndex);
    if (!currentPage) return;

    let canvasWidth = 760;
    if (pageIndex === 0 || pageIndex === pages.length - 1) {
      canvasWidth = canvasWidth / 2;
    }

    fabricRef.current = new fabric.StaticCanvas("view-canvas", {
      height: 500,
      width: canvasWidth,
    });

    fabricRef.current.loadFromJSON(
      currentPage.canvas_content?.toString(),
      () => {
        fabricRef.current?.renderAll();

        // TODO: Add spinner
        console.log("Complete!");
      }
    );
  }, [pageIndex]);

  function handleKeyBoardEvent(e: KeyboardEvent) {
    if (e.code === "ArrowRight" && pageIndex !== pages.length - 1) {
      setPageIndex(pageIndex + 1);
    } else if (e.code === "ArrowLeft" && pageIndex !== 0) {
      setPageIndex(pageIndex - 1);
    }
  }

  return (
    <div className="relative flex h-full flex-col flex-wrap items-center justify-center gap-4 px-1 lg:flex-row">
      <Button
        color="Transparent"
        onClick={() => {
          setPageIndex(pageIndex - 1);
        }}
        horizontalPadding="p-0"
        leftIcon={
          <BsArrowLeftShort
            size={48}
            color={pageIndex === 0 ? "grey" : "#F05123"}
          />
        }
        isDisabled={pageIndex === 0}
        extraClassnames="hidden lg:block"
      />
      <div className="max-w-full overflow-x-auto rounded-md ring-2 ring-neutral-black">
        <canvas
          id="view-canvas"
          className={`min-w-[${
            pageIndex === 0 || pageIndex === pages.length - 1
              ? "330px"
              : "760px"
          }]`}
        />
      </div>
      <div className="flex w-full justify-center gap-4 lg:w-auto">
        <Button
          color="Transparent"
          onClick={() => {
            setPageIndex(pageIndex - 1);
          }}
          horizontalPadding="p-0"
          leftIcon={
            <BsArrowLeftShort
              size={48}
              color={pageIndex === 0 ? "grey" : "#F05123"}
            />
          }
          isDisabled={pageIndex === 0}
          extraClassnames="lg:hidden"
        />
        <Button
          color="Transparent"
          onClick={() => {
            setPageIndex(pageIndex + 1);
          }}
          horizontalPadding="p-0"
          leftIcon={
            <BsArrowRightShort
              size={48}
              color={pageIndex === pages.length - 1 ? "grey" : "#F05123"}
            />
          }
          isDisabled={pageIndex === pages.length - 1}
        />
      </div>
      <div className="absolute bottom-0 w-full bg-primary px-5 py-3 md:bottom-5 md:w-auto md:rounded-full md:py-1">
        <h1 className="text-center text-lg text-white">
          {pageIndex + 1} / {pages.length}
        </h1>
        //TODO: Add loader when image is loading
      </div>
    </div>
  );
}
