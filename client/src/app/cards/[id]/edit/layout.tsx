"use client";

import Button from "@/components/ui/button";
import { BiArrowBack } from "react-icons/bi";
import { FaShare } from "react-icons/fa";

export default function EditCardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="flex items-center gap-3">
        <Button
          color="Transparent"
          onClick={() => {}}
          leftIcon={<BiArrowBack size={38} />}
          hasTransition={false}
          tooltip="New Card"
          horizontalPadding="0"
        />
        <h1 className="text-4xl font-bold text-neutral-black">Edit</h1>
        <Button
          color="Primary"
          onClick={() => {}}
          text="Share"
          extraClassnames="ml-auto"
          rightIcon={<FaShare size={24} />}
        />
      </header>
      <main className="mt-4">{children}</main>
    </>
  );
}
