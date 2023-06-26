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
        console.log("Complete!");
      }
    );
  }, [pageIndex]);

  return (
    <div className="my-auto flex h-full flex-wrap items-center justify-center gap-4 px-1">
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
      />
      <div className="overflow-x-auto rounded-md ring-2 ring-neutral-black">
        <canvas
          id="view-canvas"
          className={`min-w-[${
            pageIndex === 0 || pageIndex === pages.length - 1
              ? "330px"
              : "760px"
          }]`}
        />
      </div>

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
  );
}
