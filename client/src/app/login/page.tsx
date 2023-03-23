"use client";

import Button from "@/components/ui/button";
import Image from "next/image";
import birthdayCardImage from "../../../public/birthday_card.png";

export default function LoginPage() {
  return (
    <main className="mx-auto flex h-screen flex-col items-center justify-center ">
      <Image src={birthdayCardImage} alt="Birthday Card Icon" className="" />

      <h1 className="mb-4 text-center font-serif text-2xl font-semibold">
        Generate birthday cards.
      </h1>
      <Button
        color="Primary"
        onClick={() => {}}
        text="Sign up with Google"
        horizontalPadding="px-5 lg:px-10"
      />
    </main>
  );
}
