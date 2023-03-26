"use client";

import Button from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import { MdExitToApp } from "react-icons/md";

export default function CardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="flex py-6 px-10">
        <h1 className=" text-4xl font-extrabold">Cards</h1>
        <Button
          color="Transparent"
          onClick={() => {}}
          leftIcon={<FiPlus size={32} />}
          hasTransition={false}
        />
        <Button
          color="Transparent"
          onClick={() => {}}
          leftIcon={<MdExitToApp size={32} />}
          hasTransition={false}
          extraClassnames="ml-auto"
        />
      </header>

      <main className="px-10">{children}</main>
    </>
  );
}
