"use client";

import { useEffect, useRef } from "react";
import { fabric } from "fabric";
import { Canvas } from "fabric/fabric-impl";

export default function EditCardPage(params: { params: { id: string } }) {
  const fabricRef = useRef<Canvas | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    fabricRef.current = new fabric.Canvas(canvasRef.current);
  }, []);

  return (
    <main>
      <canvas ref={canvasRef} />
    </main>
  );
}
