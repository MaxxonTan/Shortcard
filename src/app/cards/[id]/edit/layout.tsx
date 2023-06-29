"use client";

import Button from "@/components/ui/button";
import CustomDialog from "@/components/ui/customDialog";
import { useRouter } from "next/navigation";
import { BiArrowBack, BiCopy } from "react-icons/bi";
import { FaShare } from "react-icons/fa";
import { useState } from "react";

export default function EditCardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    id: string;
  };
}) {
  const router = useRouter();
  const basePath =
    process.env.NODE_ENV === "production"
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : `http://${process.env.NEXT_PUBLIC_VERCEL_URL}`;

  const [openShareDialog, setOpenShareDialog] = useState(false);

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
          onClick={() => {
            setOpenShareDialog(true);
          }}
          text="Share"
          extraClassnames="ml-auto"
          rightIcon={<FaShare size={24} />}
        />
        <CustomDialog
          isOpen={openShareDialog}
          setOpen={(isOpen) => setOpenShareDialog(isOpen)}
          title="Share Card"
        >
          <div className="flex gap-2">
            <p className="truncate rounded-sm px-3 py-2 font-semibold text-neutral-black ring-2 ring-black">
              {`${basePath}/cards/${params.id}/view`}
            </p>
            <Button
              color="Primary"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${basePath}/cards/${params.id}/view`
                );
              }}
              leftIcon={<BiCopy />}
              extraClassnames="h-full"
              horizontalPadding="py-3 px-3"
              tooltip="Copy Link"
            />
          </div>
          <p className="mt-4 text-center text-sm text-gray-500">
            Anyone with this link can see your card.
          </p>
        </CustomDialog>
      </header>
      <main className="mt-8">{children}</main>
    </div>
  );
}
