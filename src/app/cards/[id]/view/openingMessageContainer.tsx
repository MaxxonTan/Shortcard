"use client";

import Button from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function OpeningMessageContainer(prop: {
  openingMessage: string;
}) {
  if (!prop.openingMessage) return <></>;

  const [isLoaded, setIsLoaded] = useState(false);
  const [continued, setContinued] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div
      className={`absolute z-10 h-full w-full gap-6 bg-primary transition-opacity ${
        continued ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div
        className={`${
          isLoaded ? "opacity-100" : "opacity-0"
        } flex h-full flex-col  items-center justify-center gap-6 p-4 transition-all duration-500 
        `}
      >
        <h1 className="text-center text-5xl text-white">
          {prop.openingMessage}
        </h1>
        <Button
          color="Secondary"
          onClick={() => {
            setContinued(true);
          }}
          text="Continue"
        />
      </div>
    </div>
  );
}
