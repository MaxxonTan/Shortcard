"use client";

import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { BiArrowBack } from "react-icons/bi";
import { FaShare } from "react-icons/fa";

export default function EditCardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="h-screen px-6 py-8 sm:px-10">
      <header className="flex items-center gap-3">
        <Button
          color="Transparent"
          onClick={() => {
            router.back();
          }}
          leftIcon={<BiArrowBack size={38} />}
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
      <main className="mt-8 ">{children}</main>
    </div>
  );
}
