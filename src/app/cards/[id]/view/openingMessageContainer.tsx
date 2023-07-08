"use client";

import Button from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function OpeningMessageContainer(prop: {
  openingMessage: string;
  from: string;
  to: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [continued, setContinued] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!prop.openingMessage) return <></>;

  return (
    <div
      className={`absolute z-10 h-full w-full bg-primary transition-opacity ${
        continued ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div
        className={`${
          isLoaded ? "opacity-100" : "opacity-0"
        } flex h-full flex-col  items-center justify-center gap-8 p-4 transition-all duration-1000 
        `}
      >
        <h1 className="text-center text-4xl text-white md:text-5xl">
          {prop.openingMessage}
        </h1>
        <h3 className="text-xl text-secondary-dark md:text-2xl">
          From <b className="font-sans">{prop.from}</b> to{" "}
          <b className="font-sans">{prop.to}</b>
        </h3>
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
