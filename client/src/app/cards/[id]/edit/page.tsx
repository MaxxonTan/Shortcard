"use client";

import { useEffect, useRef } from "react";
import { fabric } from "fabric";
import { Canvas } from "fabric/fabric-impl";
import TextField from "@/components/ui/textField";
import Button from "@/components/ui/button";
import { BsInputCursorText, BsMusicNoteBeamed } from "react-icons/bs";

export default function EditCardPage(params: { params: { id: string } }) {
  const firstFabricRef = useRef<Canvas | null>(null);
  const secondFabricRef = useRef<Canvas | null>(null);
  const firstCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const secondCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Birthday card has a ratio of 600 : 450
    firstFabricRef.current = new fabric.Canvas(firstCanvasRef.current, {
      height: 500,
      width: 380,
    });

    secondFabricRef.current = new fabric.Canvas(secondCanvasRef.current, {
      height: 500,
      width: 380,
      backgroundColor: "white",
    });
  }, []);

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
            onClick={() => {}}
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
            leftIcon={<BsMusicNoteBeamed color="#F05123" size={24} />}
          />
          <Button
            color="Secondary"
            onClick={() => {}}
            text="Media"
            extraClassnames="w-full"
            leftIcon={<BsMusicNoteBeamed color="#F05123" size={24} />}
          />
        </div>
      </div>
      <div className="flex rounded-md ring-4 ring-neutral-black">
        <canvas ref={firstCanvasRef} />
        <canvas ref={secondCanvasRef} />
      </div>
    </div>
  );
}
