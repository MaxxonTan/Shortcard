"use client";

import { useEffect, useRef } from "react";
import { fabric } from "fabric";
import { Canvas } from "fabric/fabric-impl";

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
    <main className="flex flex-wrap gap-8">
      <div className="mr-auto">test</div>
      <div className="flex rounded-md ring-4 ring-neutral-black">
        <canvas ref={firstCanvasRef} />
        <canvas ref={secondCanvasRef} />
      </div>
    </main>
  );
}
