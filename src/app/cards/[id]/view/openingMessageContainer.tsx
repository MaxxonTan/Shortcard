"use client";

import Button from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function OpeningMessageContainer(prop: {
  openingMessage: string;
  from: string;
}) {
  if (!prop.openingMessage) return <></>;

  const [isLoaded, setIsLoaded] = useState(false);
  const [continued, setContinued] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div
      className={`absolute z-10 h-full w-full bg-primary transition-opacity ${
        continued ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div
        className={`${
          isLoaded ? "opacity-100" : "opacity-0"
        } flex h-full flex-col  items-center justify-center gap-8 p-4 transition-all duration-700 
        `}
      >
        <h1 className="text-5xl text-white">{prop.openingMessage}</h1>
        <h3 className="text-3xl text-secondary-dark">From: {prop.from}</h3>
        <Button
          color="Secondary"
          onClick={() => {
            setContinued(true);
          }}
          text="Open Card"
        />
      </div>
    </div>
  );
}